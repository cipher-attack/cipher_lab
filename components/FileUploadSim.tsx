import React, { useState } from 'react';
import { Upload, FileCode, CheckCircle, XCircle, Terminal, FileImage, ShieldAlert, Settings } from 'lucide-react';

const FileUploadSim: React.FC = () => {
  const [fileName, setFileName] = useState('');
  const [mimeType, setMimeType] = useState('image/jpeg');
  const [magicBytes, setMagicBytes] = useState('FF D8 FF'); // JPEG Header
  const [nullByte, setNullByte] = useState(false);
  const [exifInject, setExifInject] = useState(false);
  
  const [status, setStatus] = useState<'IDLE' | 'UPLOADING' | 'SUCCESS' | 'BLOCKED'>('IDLE');
  const [logs, setLogs] = useState<string[]>([]);
  const [hacked, setHacked] = useState(false);
  
  // Web Shell State
  const [shellCmd, setShellCmd] = useState('');
  const [shellOutput, setShellOutput] = useState<string[]>([]);
  const [showShell, setShowShell] = useState(false);

  const handleUpload = () => {
    if (!fileName) return;
    setStatus('UPLOADING');
    setLogs([]);
    
    setTimeout(() => {
      let blocked = false;
      const ext = fileName.split('.').pop()?.toLowerCase();
      let finalName = fileName;

      // 1. EXTENSION CHECK
      setLogs(prev => [...prev, `[FILTER] Checking extension: .${ext}...`]);
      if (ext === 'php' || ext === 'exe' || ext === 'sh') {
         if (!nullByte) {
             setLogs(prev => [...prev, `[BLOCK] Malicious extension detected.`]);
             blocked = true;
         } else {
             setLogs(prev => [...prev, `[BYPASS] Null byte detected! Ignoring trail.`]);
             finalName = fileName.replace('%00.png', ''); // Simulating truncating
         }
      }

      // 2. MIME TYPE CHECK
      setLogs(prev => [...prev, `[FILTER] Checking MIME: ${mimeType}...`]);
      if (mimeType !== 'image/jpeg' && mimeType !== 'image/png') {
         setLogs(prev => [...prev, `[BLOCK] Invalid MIME type.`]);
         blocked = true;
      }

      // 3. MAGIC BYTES CHECK
      setLogs(prev => [...prev, `[FILTER] Checking Magic Bytes: ${magicBytes}...`]);
      if (!magicBytes.startsWith('FF D8') && !magicBytes.startsWith('89 50')) {
          setLogs(prev => [...prev, `[BLOCK] Invalid File Header (Not an Image).`]);
          blocked = true;
      }

      if (blocked) {
          setStatus('BLOCKED');
      } else {
          setStatus('SUCCESS');
          setLogs(prev => [...prev, `[SUCCESS] File saved to /var/www/uploads/${finalName}`]);
          
          // Check if payload executes
          if ((fileName.includes('.php') || nullByte || exifInject) && !blocked) {
              setHacked(true);
              setLogs(prev => [...prev, `[ALERT] SERVER COMPROMISED: Code execution detected.`]);
          }
      }
    }, 1000);
  };

  const executeShell = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shellCmd.trim()) return;
    
    const output = `www-data@server: $ ${shellCmd}`;
    setShellOutput(prev => [...prev, output]);
    
    // Sim responses
    let res = "";
    if (shellCmd === 'ls') res = "index.php  uploads/  config.php  .env";
    else if (shellCmd === 'whoami') res = "www-data";
    else if (shellCmd.includes('cat /etc/passwd')) res = "root:x:0:0:root:/root:/bin/bash\nwww-data:x:33:33:www-data:/var/www:/usr/sbin/nologin";
    else if (shellCmd === 'pwd') res = "/var/www/html/uploads";
    else res = `bash: ${shellCmd}: command not found`;
    
    if (res) setShellOutput(prev => [...prev, res]);
    setShellCmd('');
  };

  return (
    <div className="space-y-6 p-4">
      <div className="bg-cyber-800 p-4 rounded-lg border border-cyber-600">
        <h3 className="text-xl font-bold text-cyber-accent mb-2">Advanced File Upload (RCE)</h3>
        <p className="text-cyber-subtext text-sm">
          Bypass server filters using MIME Spoofing, Magic Bytes, Null Bytes (%00), and Exif Injection to get a Reverse Shell.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* ATTACKER PANEL */}
        <div className="space-y-4">
           <div className="bg-white text-black p-6 rounded-lg shadow-xl relative">
               <div className="absolute top-2 right-2 text-gray-400"><Settings size={18}/></div>
               <h4 className="font-bold text-lg mb-4 border-b pb-2 flex items-center gap-2"><Upload size={20}/> Malicious Uploader</h4>
               
               <div className="space-y-3">
                   {/* Filename */}
                   <div>
                       <label className="text-xs font-bold text-gray-500 uppercase">Filename</label>
                       <div className="flex gap-1">
                           <input 
                                value={fileName}
                                onChange={(e) => setFileName(e.target.value)}
                                placeholder="shell.php" 
                                className="border p-2 rounded w-full bg-gray-50"
                           />
                           <button onClick={() => setNullByte(!nullByte)} className={`px-2 text-xs font-bold rounded border ${nullByte ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                               %00
                           </button>
                       </div>
                       {nullByte && <div className="text-xs text-red-500 mt-1">Payload: {fileName}%00.png</div>}
                   </div>

                   {/* MIME Type */}
                   <div>
                       <label className="text-xs font-bold text-gray-500 uppercase">Content-Type Header</label>
                       <select value={mimeType} onChange={(e) => setMimeType(e.target.value)} className="w-full border p-2 rounded bg-gray-50">
                           <option value="image/jpeg">image/jpeg (Spoofed)</option>
                           <option value="image/png">image/png (Spoofed)</option>
                           <option value="application/x-php">application/x-php (Malicious)</option>
                       </select>
                   </div>

                   {/* Magic Bytes */}
                   <div>
                       <label className="text-xs font-bold text-gray-500 uppercase">File Signature (Magic Bytes)</label>
                       <select value={magicBytes} onChange={(e) => setMagicBytes(e.target.value)} className="w-full border p-2 rounded bg-gray-50">
                           <option value="FF D8 FF">FF D8 FF (JPEG Header)</option>
                           <option value="89 50 4E 47">89 50 4E 47 (PNG Header)</option>
                           <option value="3C 3F 70 68 70">3C 3F 70 68 70 (&lt;?php Tag)</option>
                       </select>
                   </div>
                   
                   {/* Exif Injection */}
                   <div className="flex items-center gap-2">
                       <input type="checkbox" checked={exifInject} onChange={() => setExifInject(!exifInject)} id="exif"/>
                       <label htmlFor="exif" className="text-sm font-bold text-gray-600 cursor-pointer">Inject PHP in Exif Metadata (Comment)</label>
                   </div>
               </div>

               <button 
                 onClick={handleUpload}
                 className="w-full bg-blue-600 text-white py-3 rounded font-bold hover:bg-blue-700 transition-colors mt-4"
               >
                 UPLOAD PAYLOAD
               </button>

               {status === 'BLOCKED' && <div className="mt-4 p-3 bg-red-100 text-red-700 rounded flex items-center gap-2"><XCircle size={18}/> WAF Blocked Request</div>}
               {status === 'SUCCESS' && <div className="mt-4 p-3 bg-green-100 text-green-700 rounded flex items-center gap-2"><CheckCircle size={18}/> 200 OK - Stored</div>}
           </div>

           {hacked && !showShell && (
               <button onClick={() => setShowShell(true)} className="w-full bg-red-600 text-white py-4 rounded font-bold animate-pulse shadow-[0_0_20px_red]">
                   OPEN REVERSE SHELL CONNECTION
               </button>
           )}
        </div>

        {/* SERVER LOGS / SHELL */}
        <div className="flex flex-col h-full">
            {showShell ? (
                <div className="flex-1 bg-black border border-red-600 rounded-lg p-4 font-mono text-sm shadow-[0_0_30px_rgba(255,0,0,0.2)] flex flex-col h-[500px]">
                    <div className="border-b border-red-900 pb-2 mb-2 text-red-500 font-bold flex justify-between">
                        <span>CONNECTED: 192.168.1.5:4444</span>
                        <span className="animate-pulse">● LIVE</span>
                    </div>
                    <div className="flex-1 overflow-y-auto space-y-1 text-green-400">
                        <div>Linux web-server 5.4.0-42-generic #46-Ubuntu SMP Fri Jul 10 00:24:02 UTC 2020 x86_64</div>
                        <div>uid=33(www-data) gid=33(www-data) groups=33(www-data)</div>
                        <br/>
                        {shellOutput.map((line, i) => (
                            <div key={i}>{line}</div>
                        ))}
                    </div>
                    <form onSubmit={executeShell} className="mt-2 flex">
                        <span className="text-blue-400 mr-2">www-data@server:~$</span>
                        <input 
                            value={shellCmd}
                            onChange={(e) => setShellCmd(e.target.value)}
                            className="flex-1 bg-transparent border-none outline-none text-white focus:ring-0"
                            autoFocus
                        />
                    </form>
                </div>
            ) : (
                <div className="bg-black border border-gray-700 rounded-lg p-4 font-mono text-sm flex flex-col h-full">
                    <div className="flex items-center gap-2 text-gray-500 border-b border-gray-800 pb-2 mb-2">
                        <Terminal size={14} /> APACHE ERROR LOGS
                    </div>
                    <div className="flex-1 space-y-1">
                        {logs.map((log, i) => (
                        <div key={i} className={`${log.includes('BLOCK') ? 'text-red-400' : (log.includes('BYPASS') ? 'text-yellow-400' : 'text-green-400')}`}>{log}</div>
                        ))}
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default FileUploadSim;