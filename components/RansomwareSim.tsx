import React, { useState, useEffect, useRef } from 'react';
import { Skull, Lock, FileText, Image, File, ShieldAlert, Terminal, Network, Key, Trash2, X } from 'lucide-react';

const RansomwareSim: React.FC = () => {
  const [stage, setStage] = useState<'SAFE' | 'INFECTED' | 'SPREADING' | 'ENCRYPTING' | 'LOCKED'>('SAFE');
  const [logs, setLogs] = useState<string[]>([]);
  const [timer, setTimer] = useState(72 * 3600);
  const [showDecryptor, setShowDecryptor] = useState(false);
  const [decryptKey, setDecryptKey] = useState('');
  
  // Simulated File System
  const [files, setFiles] = useState([
    { name: 'financial_q3.xlsx', type: 'doc', status: 'clean' },
    { name: 'passwords.txt', type: 'doc', status: 'clean' },
    { name: 'backup_full.zip', type: 'zip', status: 'clean' },
    { name: 'family_vacation.jpg', type: 'img', status: 'clean' },
    { name: 'system32.dll', type: 'sys', status: 'clean' },
  ]);

  const timeoutsRef = useRef<number[]>([]);
  const intervalRef = useRef<number | null>(null);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach(window.clearTimeout);
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    if (stage === 'LOCKED' && timer > 0) {
      const t = setInterval(() => setTimer(prev => prev - 1), 1000);
      return () => clearInterval(t);
    }
  }, [stage, timer]);

  const addLog = (msg: string) => setLogs(prev => [...prev, msg]);

  const startInfection = () => {
    setStage('INFECTED');
    addLog("[DROPPED] payload.exe executed by user.");
    
    // 1. PERSISTENCE
    const t1 = window.setTimeout(() => {
        addLog("[REGISTRY] Added HKCU\\...\\Run\\UpdateService -> payload.exe");
        addLog("[PROCESS] Injected code into svchost.exe (PID: 1042)");
    }, 1000);
    timeoutsRef.current.push(t1);

    // 2. C2 & LATERAL
    const t2 = window.setTimeout(() => {
        setStage('SPREADING');
        addLog("[NETWORK] C2 Connection established to 192.168.X.X");
        addLog("[WORM] Scanning SMB ports... Found 3 targets.");
        addLog("[LATERAL] Moving to SQL_SERVER_01...");
    }, 3000);
    timeoutsRef.current.push(t2);

    // 3. DESTRUCTION
    const t3 = window.setTimeout(() => {
        addLog("[VSSADMIN] Deleting Shadow Copies (Backups)... SUCCESS.");
        addLog("[KILL] Disabling Windows Defender...");
        setStage('ENCRYPTING');
    }, 5000);
    timeoutsRef.current.push(t3);

    // 4. ENCRYPTION LOOP
    const t4 = window.setTimeout(() => {
        let count = 0;
        if (intervalRef.current) clearInterval(intervalRef.current);
        
        intervalRef.current = window.setInterval(() => {
            // Hardcoded length safety check since 'files' closure might be stale
            if (count >= 5) {
                if (intervalRef.current) window.clearInterval(intervalRef.current);
                setStage('LOCKED');
                addLog("[DONE] All user files encrypted with AES-256.");
                addLog("[NOTE] Dropped README_DECRYPT.txt");
            } else {
                setFiles(prev => {
                    const newFiles = [...prev];
                    // Defensive check to prevent "setting properties of undefined"
                    if (newFiles[count]) {
                        newFiles[count] = { ...newFiles[count], status: 'encrypted', name: newFiles[count].name + '.WNCRY' };
                    }
                    return newFiles;
                });
                // Use optional chaining for logs in case 'files' closure is stale or empty
                addLog(`[ENCRYPT] Encrypting file index ${count}...`);
                count++;
            }
        }, 800);
    }, 7000);
    timeoutsRef.current.push(t4);
  };

  const attemptDecrypt = () => {
      if (decryptKey === '1337') {
          setStage('SAFE');
          setFiles(prev => prev.map(f => ({ ...f, status: 'clean', name: f.name.replace('.WNCRY', '') })));
          addLog("[RECOVERY] Decryption successful. Files restored.");
          setShowDecryptor(false);
          // Clear any running infection intervals
          if (intervalRef.current) window.clearInterval(intervalRef.current);
          timeoutsRef.current.forEach(window.clearTimeout);
      } else {
          alert("INVALID KEY. TIME REDUCED.");
          setTimer(prev => prev - 3600);
      }
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6 p-4">
      <div className="bg-cyber-800 p-4 rounded-lg border border-cyber-600">
        <h3 className="text-xl font-bold text-cyber-accent mb-2">Advanced Ransomware (Kill Chain)</h3>
        <p className="text-cyber-subtext text-sm">Simulates the full lifecycle: Infection &rarr; Persistence &rarr; Lateral Movement &rarr; Encryption.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[600px]">
        
        {/* LEFT: VISUALIZER */}
        <div className="lg:col-span-7 bg-black border border-cyber-600 rounded-lg p-6 relative overflow-hidden flex flex-col items-center justify-center">
            
            {/* KILL CHAIN STATUS BAR */}
            <div className="absolute top-4 w-full px-8 flex justify-between text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                <span className={stage !== 'SAFE' ? 'text-red-500' : ''}>1. Infect</span>
                <span className={stage === 'SPREADING' || stage === 'ENCRYPTING' || stage === 'LOCKED' ? 'text-red-500' : ''}>2. Spread</span>
                <span className={stage === 'ENCRYPTING' || stage === 'LOCKED' ? 'text-red-500' : ''}>3. Encrypt</span>
                <span className={stage === 'LOCKED' ? 'text-red-500' : ''}>4. Extort</span>
            </div>

            {stage === 'SAFE' && (
                <div className="text-center">
                    <div className="bg-gray-800 p-6 rounded-xl border border-gray-600 cursor-pointer hover:bg-gray-700 hover:scale-105 transition-all group" onClick={startInfection}>
                        <FileText size={64} className="text-blue-400 mx-auto mb-4 group-hover:text-yellow-400"/>
                        <div className="font-bold text-white">Invoice_May_2024.pdf.exe</div>
                        <div className="text-xs text-gray-400 mt-2">Email Attachment</div>
                    </div>
                    <p className="mt-4 text-gray-500 text-sm">Waiting for user execution...</p>
                </div>
            )}

            {(stage === 'INFECTED' || stage === 'SPREADING') && (
                <div className="w-full">
                    <div className="flex justify-center mb-8">
                        <Network size={64} className="text-red-500 animate-pulse"/>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div className="bg-red-900/20 p-2 rounded border border-red-500/50">
                            <div className="text-xs text-red-400 font-bold">PC-01 (Patient Zero)</div>
                            <div className="text-[10px] text-gray-400">Infected</div>
                        </div>
                        <div className={`bg-gray-900 p-2 rounded border ${stage === 'SPREADING' ? 'border-red-500 animate-pulse bg-red-900/10' : 'border-gray-700'}`}>
                            <div className="text-xs text-white">SQL-SERVER</div>
                            <div className="text-[10px] text-gray-500">{stage === 'SPREADING' ? 'COMPROMISED' : 'Scanning...'}</div>
                        </div>
                        <div className={`bg-gray-900 p-2 rounded border ${stage === 'SPREADING' ? 'border-red-500 animate-pulse bg-red-900/10' : 'border-gray-700'}`}>
                            <div className="text-xs text-white">BACKUP-NAS</div>
                            <div className="text-[10px] text-gray-500">{stage === 'SPREADING' ? 'WIPING...' : 'Safe'}</div>
                        </div>
                    </div>
                </div>
            )}

            {stage === 'ENCRYPTING' && (
                <div className="grid grid-cols-5 gap-2 w-full px-4">
                    {files.map((f, i) => (
                        <div key={i} className={`h-24 rounded border flex flex-col items-center justify-center gap-2 ${f.status === 'encrypted' ? 'bg-red-900 border-red-500' : 'bg-gray-800 border-gray-600'}`}>
                            {f.status === 'encrypted' ? <Lock size={20} className="text-white"/> : <File size={20} className="text-gray-400"/>}
                            <span className="text-[8px] text-white truncate w-full text-center px-1">{f.name}</span>
                        </div>
                    ))}
                </div>
            )}

            {stage === 'LOCKED' && (
                <div className="text-center w-full animate-slide-up">
                    <Skull size={80} className="text-red-500 mx-auto mb-4 animate-bounce"/>
                    <h1 className="text-3xl font-black text-white uppercase tracking-widest mb-2">FILES ENCRYPTED</h1>
                    <div className="bg-red-900/30 border border-red-500 p-4 rounded mb-4">
                        <div className="text-xs text-red-300 uppercase">Time Remaining</div>
                        <div className="text-4xl font-mono font-bold text-red-500">{formatTime(timer)}</div>
                    </div>
                    <button onClick={() => setShowDecryptor(true)} className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-6 rounded flex items-center gap-2 mx-auto">
                        <Key size={18}/> OPEN DECRYPTOR
                    </button>
                </div>
            )}

            {/* Simulated Hacker Terminal */}
            <div className="absolute bottom-0 left-0 w-full h-1/3 bg-[#0d0d0d] border-t border-gray-700 p-2 font-mono text-[10px] overflow-y-auto custom-scrollbar opacity-90">
                {logs.map((l, i) => (
                    <div key={i} className="text-green-500 mb-1">{l}</div>
                ))}
                <div className="animate-pulse">_</div>
            </div>
        </div>

        {/* RIGHT: SYSTEM INFO */}
        <div className="lg:col-span-5 space-y-4">
            {/* PROCESS LIST */}
            <div className="bg-cyber-900 border border-cyber-600 rounded p-4">
                <h4 className="text-xs font-bold text-gray-500 uppercase mb-2 border-b border-gray-700 pb-1">Task Manager</h4>
                <div className="space-y-1 text-xs font-mono">
                    <div className="flex justify-between text-gray-300"><span>System</span><span>PID 4</span></div>
                    <div className="flex justify-between text-gray-300"><span>Explorer.exe</span><span>PID 420</span></div>
                    <div className="flex justify-between text-red-400 font-bold bg-red-900/20 px-1 rounded">
                        <span>svchost.exe (Injected)</span>
                        <span>PID 1042</span>
                    </div>
                    <div className="flex justify-between text-gray-300"><span>Chrome.exe</span><span>PID 1200</span></div>
                </div>
            </div>

            {/* REGISTRY */}
            <div className="bg-cyber-900 border border-cyber-600 rounded p-4">
                <h4 className="text-xs font-bold text-gray-500 uppercase mb-2 border-b border-gray-700 pb-1">Registry Monitor</h4>
                <div className="text-xs font-mono text-gray-400 break-all">
                    HKCU\Software\Microsoft\Windows\CurrentVersion\Run
                    {stage !== 'SAFE' && <div className="text-yellow-500 mt-1">Value: "WindowsUpdate" = "C:\Users\Temp\payload.exe"</div>}
                </div>
            </div>

            {/* SHADOW COPIES */}
            <div className="bg-cyber-900 border border-cyber-600 rounded p-4">
                <h4 className="text-xs font-bold text-gray-500 uppercase mb-2 border-b border-gray-700 pb-1">Backup Status (VSS)</h4>
                {stage === 'ENCRYPTING' || stage === 'LOCKED' ? (
                     <div className="flex items-center gap-2 text-red-500 font-bold text-xs"><Trash2 size={14}/> ALL SHADOW COPIES DELETED</div>
                ) : (
                     <div className="flex items-center gap-2 text-green-500 font-bold text-xs"><ShieldAlert size={14}/> Backups Active</div>
                )}
            </div>
        </div>
      </div>

      {/* DECRYPTOR MODAL */}
      {showDecryptor && (
          <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
              <div className="bg-gray-200 w-full max-w-md rounded shadow-2xl overflow-hidden border-4 border-red-600">
                  <div className="bg-red-600 text-white p-2 font-bold flex justify-between">
                      <span>WANNA_DECRYPT0R 2.0</span>
                      <button onClick={() => setShowDecryptor(false)}><X size={18}/></button>
                  </div>
                  <div className="p-6 text-black text-center">
                      <Lock size={48} className="mx-auto text-red-600 mb-4"/>
                      <h2 className="font-bold text-xl mb-2">Payment Required</h2>
                      <p className="text-sm text-gray-600 mb-4">Send 0.5 Bitcoin to address below to receive your decryption key.</p>
                      <div className="bg-white border p-2 font-mono text-xs mb-4 select-all">1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa</div>
                      <input 
                        value={decryptKey} 
                        onChange={(e) => setDecryptKey(e.target.value)}
                        placeholder="Enter Decryption Key..."
                        className="w-full border border-gray-400 p-2 mb-4"
                      />
                      <button onClick={attemptDecrypt} className="w-full bg-red-600 text-white font-bold py-3 hover:bg-red-700">DECRYPT FILES</button>
                      <div className="text-xs text-gray-500 mt-2">Hint: The key is '1337' for this simulation.</div>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default RansomwareSim;