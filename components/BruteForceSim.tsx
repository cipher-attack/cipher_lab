import React, { useState, useEffect, useRef } from 'react';
import { Lock, Unlock, Server, Play, RotateCcw, Settings, Zap, Shield, Globe, Layers, List, Cpu, Wifi } from 'lucide-react';

const BruteForceSim: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [currentAttempt, setCurrentAttempt] = useState('waiting...');
  const [log, setLog] = useState<string[]>([]);
  const [cracked, setCracked] = useState(false);
  const [progress, setProgress] = useState(0);
  const [crackedPass, setCrackedPass] = useState('');
  
  // Settings
  const [protocol, setProtocol] = useState('SSH');
  const [mode, setMode] = useState('DICT'); // DICT, MASK, RAINBOW
  const [threads, setThreads] = useState(4);
  const [proxyEnabled, setProxyEnabled] = useState(true);
  const [gpuAccel, setGpuAccel] = useState(false);
  const [targetIp, setTargetIp] = useState('192.168.1.100');
  const [proxyIp, setProxyIp] = useState('10.0.0.1');

  const targetPassword = "dragon";
  
  // Simulated wordlists
  const dictList = ["admin", "password", "123456", "qwerty", "welcome", "login", "monkey", "dragon", "master", "football", "access", "letmein"];
  const maskList = ["aaaaa", "baaaa", "caaaa", "daaaa", "dragon", "eaaaa", "faaaa", "gaaaa"]; 
  const rainbowList = ["8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92 (dragon)"];

  const intervalRef = useRef<number | null>(null);

  const startAttack = () => {
    if (isRunning) return;
    setIsRunning(true);
    setCracked(false);
    setLog([]);
    setProgress(0);
    setCrackedPass('');
    
    let index = 0;
    const list = mode === 'MASK' ? maskList : (mode === 'RAINBOW' ? rainbowList : dictList);
    
    // Speed calculation
    // Base speed: 200ms
    // Thread reduction: 200 / threads
    // GPU reduction: / 2
    let speed = 200 / threads;
    if (gpuAccel) speed = speed / 2;
    if (mode === 'RAINBOW') speed = 50; // Instant lookups

    intervalRef.current = setInterval(() => {
        // Proxy Rotation logic
        if (proxyEnabled && Math.random() > 0.7) {
            setProxyIp(`10.0.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`);
        }

        if (index >= list.length) {
          stopAttack();
          setLog(prev => [`[${protocol}] Wordlist exhausted. Failed.`, ...prev]);
          return;
        }

        const rawItem = list[index];
        const attempt = mode === 'RAINBOW' ? rawItem.split(' ')[1].replace('(', '').replace(')', '') : rawItem;
        
        setCurrentAttempt(attempt);
        setProgress((index / list.length) * 100);
        
        const timestamp = new Date().toLocaleTimeString();
        const threadId = Math.floor(Math.random() * threads) + 1;
        
        // Log generation
        if (mode === 'RAINBOW') {
            setLog(prev => [`[${timestamp}] [HASHCAT] Lookup: ${rawItem.substring(0, 15)}... Found: ${attempt}`, ...prev].slice(0, 15));
        } else {
            setLog(prev => [`[${timestamp}] [${protocol}] [T-${threadId}] Trying: ${attempt} via ${proxyEnabled ? proxyIp : targetIp}... ${attempt === targetPassword ? 'SUCCESS' : 'FAIL'}`, ...prev].slice(0, 15));
        }
        
        if (attempt === targetPassword) {
          setCracked(true);
          setCrackedPass(attempt);
          setLog(prev => [`[${timestamp}] [SUCCESS] PASSWORD CRACKED: "${attempt}"`, ...prev]);
          stopAttack();
        }
        index++;
    }, speed);
  };

  const stopAttack = () => {
      setIsRunning(false);
      if (intervalRef.current) clearInterval(intervalRef.current);
  };

  useEffect(() => {
      return () => stopAttack();
  }, []);

  return (
    <div className="space-y-6 p-4">
      <div className="bg-cyber-800 p-4 rounded-lg border border-cyber-600">
        <h3 className="text-xl font-bold text-cyber-accent mb-2">Advanced Brute Force (Hydra/Hashcat)</h3>
        <p className="text-cyber-subtext text-sm">Multi-protocol cracker supporting Dictionary attacks, Mask attacks, and Rainbow Tables with Proxy Rotation.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT: CONFIGURATION */}
        <div className="lg:col-span-4 space-y-4">
            <div className="bg-cyber-900 border border-cyber-600 rounded p-4">
                <div className="flex items-center gap-2 mb-4 text-cyber-accent font-bold border-b border-gray-700 pb-2">
                    <Settings size={18}/> Attack Configuration
                </div>
                
                <div className="space-y-4">
                    {/* Target */}
                    <div>
                        <label className="text-xs text-gray-500 uppercase font-bold">Target IP</label>
                        <input className="w-full bg-black border border-gray-700 rounded p-2 text-white text-sm font-mono" value={targetIp} onChange={(e) => setTargetIp(e.target.value)} />
                    </div>

                    {/* Protocol */}
                    <div>
                        <label className="text-xs text-gray-500 uppercase font-bold">Protocol</label>
                        <div className="grid grid-cols-4 gap-2 mt-1">
                            {['SSH', 'FTP', 'RDP', 'HTTP'].map(p => (
                                <button key={p} onClick={() => setProtocol(p)} className={`text-xs font-bold py-1 rounded border ${protocol === p ? 'bg-blue-600 text-white border-blue-400' : 'bg-gray-800 text-gray-400 border-gray-600'}`}>
                                    {p}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Mode */}
                    <div>
                        <label className="text-xs text-gray-500 uppercase font-bold">Attack Mode</label>
                        <div className="grid grid-cols-3 gap-2 mt-1">
                            <button onClick={() => setMode('DICT')} className={`text-xs font-bold py-1 rounded border ${mode === 'DICT' ? 'bg-purple-600 text-white border-purple-400' : 'bg-gray-800 text-gray-400 border-gray-600'}`}>
                                Dictionary
                            </button>
                            <button onClick={() => setMode('MASK')} className={`text-xs font-bold py-1 rounded border ${mode === 'MASK' ? 'bg-purple-600 text-white border-purple-400' : 'bg-gray-800 text-gray-400 border-gray-600'}`}>
                                Mask (?a?a)
                            </button>
                            <button onClick={() => setMode('RAINBOW')} className={`text-xs font-bold py-1 rounded border ${mode === 'RAINBOW' ? 'bg-purple-600 text-white border-purple-400' : 'bg-gray-800 text-gray-400 border-gray-600'}`}>
                                Rainbow Table
                            </button>
                        </div>
                    </div>

                    {/* Threading */}
                    <div>
                        <label className="text-xs text-gray-500 uppercase font-bold flex justify-between">
                            <span>Threads</span>
                            <span>{threads}</span>
                        </label>
                        <input type="range" min="1" max="16" value={threads} onChange={(e) => setThreads(parseInt(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer mt-1" />
                    </div>

                    {/* Toggles */}
                    <div className="flex flex-col gap-2">
                         <div className="flex items-center justify-between bg-black p-2 rounded border border-gray-700">
                             <div className="flex items-center gap-2 text-xs font-bold text-gray-300">
                                 <Globe size={14} className="text-blue-500"/> Proxy Rotation
                             </div>
                             <input type="checkbox" checked={proxyEnabled} onChange={() => setProxyEnabled(!proxyEnabled)} />
                         </div>
                         <div className="flex items-center justify-between bg-black p-2 rounded border border-gray-700">
                             <div className="flex items-center gap-2 text-xs font-bold text-gray-300">
                                 <Cpu size={14} className="text-green-500"/> GPU Acceleration
                             </div>
                             <input type="checkbox" checked={gpuAccel} onChange={() => setGpuAccel(!gpuAccel)} />
                         </div>
                    </div>
                </div>

                <div className="mt-6 flex gap-2">
                    {!isRunning ? (
                        <button onClick={startAttack} className="flex-1 bg-green-600 text-white font-bold py-2 rounded hover:bg-green-500 flex items-center justify-center gap-2">
                            <Play size={18} fill="currentColor" /> START ATTACK
                        </button>
                    ) : (
                        <button onClick={stopAttack} className="flex-1 bg-red-600 text-white font-bold py-2 rounded hover:bg-red-500 flex items-center justify-center gap-2">
                             STOP
                        </button>
                    )}
                    <button onClick={() => { stopAttack(); setLog([]); setCracked(false); setProgress(0); }} className="px-3 bg-gray-700 hover:bg-gray-600 rounded">
                        <RotateCcw size={18} />
                    </button>
                </div>
            </div>
        </div>

        {/* RIGHT: VISUALIZATION */}
        <div className="lg:col-span-8 flex flex-col gap-4">
            
            {/* STATUS HUD */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-black border border-cyber-600 p-4 rounded flex items-center gap-3">
                    <Server size={32} className={isRunning ? 'text-yellow-500 animate-pulse' : 'text-gray-600'} />
                    <div>
                        <div className="text-xs text-gray-500 uppercase font-bold">Status</div>
                        <div className={`text-lg font-bold ${isRunning ? 'text-yellow-500' : 'text-gray-400'}`}>
                            {isRunning ? 'ATTACKING...' : 'IDLE'}
                        </div>
                    </div>
                </div>

                <div className="bg-black border border-cyber-600 p-4 rounded flex items-center gap-3">
                    <Layers size={32} className="text-blue-500" />
                    <div>
                        <div className="text-xs text-gray-500 uppercase font-bold">Attempts</div>
                        <div className="text-lg font-bold text-blue-500">
                            {Math.round(progress * 1.5)} / {mode === 'MASK' ? '8' : '12'}
                        </div>
                    </div>
                </div>

                <div className="bg-black border border-cyber-600 p-4 rounded flex items-center gap-3">
                    {cracked ? <Unlock size={32} className="text-green-500" /> : <Lock size={32} className="text-red-500" />}
                    <div>
                        <div className="text-xs text-gray-500 uppercase font-bold">Result</div>
                        <div className={`text-lg font-bold ${cracked ? 'text-green-500' : 'text-red-500'}`}>
                            {cracked ? crackedPass : 'LOCKED'}
                        </div>
                    </div>
                </div>
            </div>

            {/* TERMINAL OUTPUT */}
            <div className="flex-1 bg-[#0d0d0d] border border-cyber-600 rounded p-4 font-mono text-sm relative overflow-hidden flex flex-col min-h-[300px]">
                <div className="flex items-center justify-between border-b border-gray-800 pb-2 mb-2">
                    <span className="text-gray-500 text-xs font-bold flex items-center gap-2"><List size={14}/> ATTACK LOG</span>
                    {proxyEnabled && <span className="text-xs text-blue-400 flex items-center gap-1"><Wifi size={12}/> Proxy: {proxyIp}</span>}
                </div>
                
                <div className="flex-1 overflow-y-auto custom-scrollbar space-y-1">
                    {log.map((l, i) => (
                        <div key={i} className={`${l.includes('SUCCESS') ? 'text-green-400 font-bold bg-green-900/20' : (l.includes('FAILED') ? 'text-red-400' : 'text-gray-400')}`}>
                            {l}
                        </div>
                    ))}
                    {isRunning && <div className="text-yellow-500 animate-pulse">_</div>}
                </div>

                {/* Progress Bar */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-800">
                    <div className="h-full bg-cyber-accent transition-all duration-300" style={{ width: `${progress}%` }}></div>
                </div>
            </div>
            
            {/* GPU VISUAL */}
            {gpuAccel && isRunning && (
                <div className="bg-green-900/10 border border-green-500/30 p-2 rounded text-xs text-green-400 flex items-center justify-center gap-2 animate-pulse">
                    <Cpu size={14}/> GPU ACCELERATION ACTIVE: USING CUDA CORES (HashRate: 4500 MH/s)
                </div>
            )}
        </div>

      </div>
    </div>
  );
};

export default BruteForceSim;