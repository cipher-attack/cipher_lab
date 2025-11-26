import React, { useState, useEffect } from 'react';
import { User, Server, Wifi, Eye, Globe, Lock, Unlock, Laptop, Router, FileImage, Cookie, Bug } from 'lucide-react';

const MitmnSim: React.FC = () => {
  const [activeAttack, setActiveAttack] = useState<'NONE' | 'ARP' | 'DNS' | 'SSL' | 'DRIFT'>('NONE');
  const [logs, setLogs] = useState<string[]>([]);
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const [creds, setCreds] = useState<{user:string, pass:string} | null>(null);
  
  // Victim State
  const [victimView, setVictimView] = useState({ url: 'https://bank.com', secure: true, content: 'LOGIN' });

  useEffect(() => {
    if (activeAttack === 'NONE') return;

    const interval = setInterval(() => {
        // Attack Logic Simulation
        if (activeAttack === 'ARP') {
            setLogs(prev => [`[ARP] Poisoning 192.168.1.5 is-at aa:bb:cc:dd:ee:ff`, ...prev].slice(0, 8));
        }
        else if (activeAttack === 'SSL') {
            setVictimView(prev => ({ ...prev, secure: false, url: 'http://bank.com' }));
            setLogs(prev => [`[SSLSTRIP] Downgraded connection to HTTP`, ...prev].slice(0, 8));
            if (Math.random() > 0.8) setCreds({ user: 'alice', pass: 's3cr3t123' });
        }
        else if (activeAttack === 'DNS') {
            setVictimView({ url: 'http://fake-facebook.com', secure: false, content: 'FAKE_LOGIN' });
            setLogs(prev => [`[DNS] Spoofed response: facebook.com -> 10.0.0.666`, ...prev].slice(0, 8));
        }
        else if (activeAttack === 'DRIFT') {
            if (Math.random() > 0.7 && capturedImages.length < 6) {
                setCapturedImages(prev => [...prev, `https://picsum.photos/100/100?random=${Date.now()}`]);
                setLogs(prev => [`[DRIFTNET] Reassembled JPEG image from stream`, ...prev].slice(0, 8));
            }
        }
    }, 1500);

    return () => clearInterval(interval);
  }, [activeAttack, capturedImages]);

  return (
    <div className="space-y-6 p-4">
      <div className="bg-cyber-800 p-4 rounded-lg border border-cyber-600">
        <h3 className="text-xl font-bold text-cyber-accent mb-2">Advanced MITM (Man-in-the-Middle)</h3>
        <p className="text-cyber-subtext text-sm">Intercept traffic using ARP Poisoning, SSL Stripping, DNS Spoofing, and Packet Reconstruction.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[600px]">
        
        {/* LEFT: ATTACK CONTROL */}
        <div className="lg:col-span-3 space-y-4">
            <div className="bg-cyber-900 border border-cyber-600 rounded p-4">
                <h4 className="text-xs font-bold text-gray-500 uppercase mb-4">Attack Vectors</h4>
                <div className="space-y-2">
                    <button 
                      onClick={() => setActiveAttack(activeAttack === 'ARP' ? 'NONE' : 'ARP')}
                      className={`w-full p-3 rounded text-left text-xs font-bold border transition-all ${activeAttack === 'ARP' ? 'bg-red-900/50 border-red-500 text-white' : 'bg-black border-gray-700 text-gray-400 hover:border-white'}`}
                    >
                        <div className="flex items-center gap-2"><Bug size={14}/> ARP POISONING</div>
                        <span className="text-[10px] font-normal opacity-70">Redirect traffic through you</span>
                    </button>
                    
                    <button 
                      onClick={() => setActiveAttack(activeAttack === 'SSL' ? 'NONE' : 'SSL')}
                      className={`w-full p-3 rounded text-left text-xs font-bold border transition-all ${activeAttack === 'SSL' ? 'bg-yellow-900/50 border-yellow-500 text-white' : 'bg-black border-gray-700 text-gray-400 hover:border-white'}`}
                    >
                        <div className="flex items-center gap-2"><Unlock size={14}/> SSL STRIPPING</div>
                        <span className="text-[10px] font-normal opacity-70">Downgrade HTTPS to HTTP</span>
                    </button>

                    <button 
                      onClick={() => setActiveAttack(activeAttack === 'DNS' ? 'NONE' : 'DNS')}
                      className={`w-full p-3 rounded text-left text-xs font-bold border transition-all ${activeAttack === 'DNS' ? 'bg-blue-900/50 border-blue-500 text-white' : 'bg-black border-gray-700 text-gray-400 hover:border-white'}`}
                    >
                        <div className="flex items-center gap-2"><Globe size={14}/> DNS SPOOFING</div>
                        <span className="text-[10px] font-normal opacity-70">Redirect domains to fake site</span>
                    </button>

                    <button 
                      onClick={() => setActiveAttack(activeAttack === 'DRIFT' ? 'NONE' : 'DRIFT')}
                      className={`w-full p-3 rounded text-left text-xs font-bold border transition-all ${activeAttack === 'DRIFT' ? 'bg-purple-900/50 border-purple-500 text-white' : 'bg-black border-gray-700 text-gray-400 hover:border-white'}`}
                    >
                        <div className="flex items-center gap-2"><FileImage size={14}/> DRIFTNET</div>
                        <span className="text-[10px] font-normal opacity-70">Reassemble images from packets</span>
                    </button>
                </div>
            </div>

            <div className="bg-black border border-cyber-600 rounded p-4 h-48 overflow-y-auto font-mono text-[10px]">
                <div className="text-gray-500 border-b border-gray-800 mb-2">ATTACKER LOGS</div>
                {logs.map((l, i) => (
                    <div key={i} className="text-green-400 mb-1">{l}</div>
                ))}
            </div>
        </div>

        {/* CENTER: NETWORK TOPOLOGY & VICTIM VIEW */}
        <div className="lg:col-span-6 flex flex-col gap-6">
            
            {/* NETWORK MAP */}
            <div className="bg-black border border-cyber-600 rounded-lg relative overflow-hidden flex flex-col items-center justify-center p-8 min-h-[300px]">
                {/* BACKGROUND GRID */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,50,0,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,50,0,0.1)_1px,transparent_1px)] bg-[size:20px_20px]"></div>

                {/* ROUTER */}
                <div className="relative z-10 flex flex-col items-center mb-16">
                    <Router size={48} className="text-blue-500"/>
                    <span className="bg-blue-900/50 text-blue-200 text-xs px-2 rounded mt-1">Gateway (192.168.1.1)</span>
                    <span className="text-[8px] text-gray-500">MAC: AA:AA:AA:AA:AA:AA</span>
                </div>

                <div className="flex justify-between w-full relative z-10 px-8">
                    {/* VICTIM */}
                    <div className="flex flex-col items-center">
                        <Laptop size={48} className="text-gray-400"/>
                        <span className="bg-gray-800 text-gray-200 text-xs px-2 rounded mt-1">Victim (192.168.1.5)</span>
                        <span className="text-[8px] text-gray-500">MAC: BB:BB:BB:BB:BB:BB</span>
                        <div className="mt-2 text-[9px] text-yellow-500 border border-yellow-700 p-1 bg-black/50 rounded">
                            ARP Table:
                            {activeAttack === 'ARP' ? <div className="text-red-500 font-bold">1.1 is-at CC:CC... (POISONED)</div> : <div className="text-green-500">1.1 is-at AA:AA... (OK)</div>}
                        </div>
                    </div>

                    {/* ATTACKER */}
                    <div className="flex flex-col items-center">
                        <div className={`p-4 rounded-full border-2 transition-all ${activeAttack !== 'NONE' ? 'border-red-500 shadow-[0_0_30px_red] bg-red-900/20' : 'border-gray-600 bg-gray-900'}`}>
                            <Eye size={32} className={activeAttack !== 'NONE' ? 'text-red-500' : 'text-gray-500'}/>
                        </div>
                        <span className="bg-red-900/50 text-red-200 text-xs px-2 rounded mt-2">Attacker (192.168.1.66)</span>
                        <span className="text-[8px] text-gray-500">MAC: CC:CC:CC:CC:CC:CC</span>
                    </div>
                </div>

                {/* CONNECTION LINES (SVG) */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    {/* Router to Victim (Normal) */}
                    <line x1="50%" y1="20%" x2="20%" y2="60%" stroke={activeAttack === 'ARP' ? '#333' : '#00ff00'} strokeWidth="2" strokeDasharray="5,5" className={activeAttack !== 'ARP' ? 'animate-pulse' : ''} />
                    {/* Router to Attacker */}
                    <line x1="50%" y1="20%" x2="80%" y2="60%" stroke={activeAttack !== 'NONE' ? '#ff0000' : '#333'} strokeWidth="2" />
                    {/* Attacker to Victim (Poisoned) */}
                    {activeAttack === 'ARP' && <line x1="80%" y1="60%" x2="20%" y2="60%" stroke="#ff0000" strokeWidth="2" strokeDasharray="5,5" className="animate-pulse" />}
                </svg>
            </div>

            {/* VICTIM BROWSER SIMULATION (MOVED TO CENTER) */}
            <div className="bg-gray-200 rounded text-black overflow-hidden flex flex-col border border-gray-500 h-64 shadow-xl">
                <div className="bg-gray-300 p-2 border-b border-gray-400 flex items-center gap-2">
                    <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="flex-1 bg-white mx-2 rounded px-3 py-1 text-sm text-gray-500 flex items-center gap-2 font-mono">
                        {victimView.secure ? <Lock size={12} className="text-green-600"/> : <Unlock size={12} className="text-red-500 animate-pulse"/>}
                        {victimView.url}
                    </div>
                </div>
                <div className="flex-1 p-8 flex flex-col items-center justify-center bg-white">
                    <h2 className="text-2xl font-bold mb-4 text-blue-800 tracking-tight flex items-center gap-2">
                        {victimView.content === 'LOGIN' ? <><Lock size={24}/> SECURE BANKING</> : <><Globe size={24}/> FACEBOOK (CLONE)</>}
                    </h2>
                    
                    <div className={`p-6 border rounded-lg w-full max-w-sm shadow-sm ${victimView.content === 'FAKE_LOGIN' ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}>
                        <div className="mb-2 text-xs font-bold text-gray-500">Sign In</div>
                        <input className="border w-full mb-3 p-2 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Username / Email"/>
                        <input className="border w-full mb-4 p-2 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none" type="password" placeholder="Password"/>
                        <button className="w-full bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700 transition-colors">Login</button>
                    </div>

                    {victimView.content === 'FAKE_LOGIN' && <div className="mt-2 text-xs text-red-500 font-bold animate-pulse">⚠️ YOU ARE ON A PHISHING SITE</div>}
                </div>
            </div>
        </div>

        {/* RIGHT: HARVESTED DATA */}
        <div className="lg:col-span-3 space-y-4">
            
            {/* CREDENTIAL HARVESTER */}
            <div className="bg-cyber-900 border border-cyber-600 rounded p-4 h-1/2">
                <h4 className="text-xs font-bold text-gray-500 uppercase mb-2 border-b border-gray-700 pb-1 flex items-center gap-2"><Cookie size={14}/> Credential Harvester</h4>
                {creds ? (
                    <div className="bg-green-900/30 border border-green-500 p-3 rounded animate-slide-up">
                        <div className="text-xs text-green-400 font-bold mb-1">POST /login.php CAPTURED</div>
                        <div className="text-xs text-gray-300 flex justify-between"><span>User:</span> <span className="text-white font-bold">{creds.user}</span></div>
                        <div className="text-xs text-gray-300 flex justify-between"><span>Pass:</span> <span className="text-red-400 font-bold">{creds.pass}</span></div>
                    </div>
                ) : (
                    <div className="text-gray-500 text-xs italic p-4 text-center border border-dashed border-gray-800 rounded">
                        Waiting for victim input...
                    </div>
                )}
            </div>

            {/* DRIFTNET IMAGES */}
            <div className="bg-black border border-cyber-600 rounded p-2 h-1/2 overflow-hidden">
                 <h4 className="text-[10px] font-bold text-purple-500 uppercase mb-2 border-b border-gray-800 pb-1">Driftnet (Image Stream)</h4>
                 <div className="grid grid-cols-2 gap-2 overflow-y-auto h-full pb-6 custom-scrollbar">
                     {capturedImages.map((img, i) => (
                         <img key={i} src={img} alt="sniffed" className="w-full aspect-square object-cover rounded border border-purple-500/30 animate-fade-in hover:scale-110 transition-transform"/>
                     ))}
                     {capturedImages.length === 0 && <div className="col-span-2 text-center text-gray-600 text-[10px] mt-4">No images intercepted</div>}
                 </div>
            </div>

        </div>
      </div>
    </div>
  );
};

export default MitmnSim;