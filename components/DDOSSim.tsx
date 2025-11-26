import React, { useState, useEffect, useRef } from 'react';
import { Server, Zap, Shield, Activity, Globe, Cpu, Database, AlertTriangle, Play, Square, Pause, BarChart3, Wifi } from 'lucide-react';

const DDOSSim: React.FC = () => {
  const [attacking, setAttacking] = useState(false);
  const [attackType, setAttackType] = useState<'UDP' | 'SYN' | 'HTTP'>('UDP');
  const [botnetSize, setBotnetSize] = useState(2500);
  const [mitigation, setMitigation] = useState(false);
  
  // Real-time Stats
  const [bandwidthHistory, setBandwidthHistory] = useState<number[]>(Array(30).fill(5));
  const [logs, setLogs] = useState<string[]>([]);
  const [latency, setLatency] = useState(24); // ms
  
  // Server Resources
  const [cpu, setCpu] = useState(12);
  const [ram, setRam] = useState(30);
  
  // Service Health (100 = Healthy)
  const [health, setHealth] = useState({ web: 100, db: 100, api: 100 });

  // Visuals
  const [particles, setParticles] = useState<{id: number, left: number, speed: number, color: string}[]>([]);
  const requestRef = useRef<number>();

  // --- ATTACK LOGIC LOOP ---
  useEffect(() => {
    let interval: any;
    
    if (attacking) {
      interval = setInterval(() => {
        // 1. Calculate Impact Multiplier
        let damageMultiplier = botnetSize / 5000; // 0.1 to 2.0
        if (mitigation) damageMultiplier *= 0.05; // Mitigation absorbs 95% damage

        // 2. Resource Impact based on Attack Type
        if (attackType === 'UDP') {
           // Volumetric -> Hits Bandwidth & Latency
           const spike = (Math.random() * 40 + 60) * damageMultiplier;
           setBandwidthHistory(prev => [...prev.slice(1), Math.min(100, spike)]);
           setLatency(prev => Math.min(999, prev + (50 * damageMultiplier)));
        } 
        else if (attackType === 'SYN') {
           // Protocol -> Hits RAM & DB (Connection Tables)
           setRam(prev => Math.min(100, prev + (15 * damageMultiplier)));
           setBandwidthHistory(prev => [...prev.slice(1), (Math.random() * 20 + 20) * damageMultiplier]);
           setLatency(prev => Math.min(500, prev + (10 * damageMultiplier)));
        }
        else if (attackType === 'HTTP') {
           // Layer 7 -> Hits CPU & Web App
           setCpu(prev => Math.min(100, prev + (20 * damageMultiplier)));
           setBandwidthHistory(prev => [...prev.slice(1), (Math.random() * 10 + 10) * damageMultiplier]);
        }

        // 3. Service Damage
        setHealth(prev => ({
            web: Math.max(0, prev.web - (attackType === 'HTTP' ? 5 : 0.5) * damageMultiplier),
            db: Math.max(0, prev.db - (attackType === 'SYN' ? 4 : 0.2) * damageMultiplier),
            api: Math.max(0, prev.api - (attackType === 'UDP' ? 3 : 0.5) * damageMultiplier)
        }));

        // 4. Generate Logs
        const srcIp = `${Math.floor(Math.random()*223)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`;
        const regions = ['CHN', 'RUS', 'BRA', 'USA', 'IND', 'IRN'];
        const region = regions[Math.floor(Math.random() * regions.length)];
        
        const logMsg = mitigation 
            ? `[SCRUBBED] ${attackType} traffic from ${srcIp} (${region}) - dropped at edge.`
            : `[ALERT] Incoming ${attackType} Flood from ${srcIp} (${region}) - Target: Port ${attackType === 'HTTP' ? 80 : 443}`;
        
        setLogs(prev => [logMsg, ...prev].slice(0, 12));

      }, 300);
    } else {
        // --- RECOVERY MODE ---
        interval = setInterval(() => {
            setCpu(prev => Math.max(12, prev - 5));
            setRam(prev => Math.max(30, prev - 5));
            setBandwidthHistory(prev => [...prev.slice(1), Math.max(5, prev[prev.length-1] - 5)]);
            setLatency(prev => Math.max(24, prev - 20));
            setHealth(prev => ({
                web: Math.min(100, prev.web + 5),
                db: Math.min(100, prev.db + 5),
                api: Math.min(100, prev.api + 5)
            }));
        }, 500);
    }

    return () => clearInterval(interval);
  }, [attacking, attackType, botnetSize, mitigation]);

  // --- PARTICLE ANIMATION LOOP ---
  useEffect(() => {
    if (attacking) {
      const spawnParticle = () => {
         const density = Math.ceil(botnetSize / 1000); 
         const color = attackType === 'UDP' ? '#ef4444' : (attackType === 'SYN' ? '#eab308' : '#3b82f6');
         
         const newP = {
             id: Math.random(),
             left: Math.random() * 100,
             speed: Math.random() * 1 + 0.5,
             color: color
         };

         setParticles(prev => [...prev, newP].slice(-50)); // Limit particle count

         if (attacking) requestRef.current = requestAnimationFrame(spawnParticle);
      };
      requestRef.current = requestAnimationFrame(spawnParticle);
    } else {
        setParticles([]);
    }
    return () => cancelAnimationFrame(requestRef.current!);
  }, [attacking, attackType, botnetSize]);

  // --- HELPER UI ---
  const getHealthColor = (h: number) => {
      if (h > 70) return 'text-green-500';
      if (h > 30) return 'text-yellow-500';
      return 'text-red-600 animate-pulse font-black';
  };

  const getStatusText = (h: number) => {
      if (h > 70) return 'OPERATIONAL';
      if (h > 30) return 'DEGRADED';
      return 'OFFLINE';
  };

  return (
    <div className="space-y-6 p-4">
      <div className="bg-cyber-800 p-4 rounded-lg border border-cyber-600">
        <h3 className="text-xl font-bold text-cyber-accent mb-2">Advanced DDoS Lab</h3>
        <p className="text-cyber-subtext text-sm">
          Simulate massive Botnet attacks (UDP/SYN/HTTP). Toggle Cloud Mitigation to see defense mechanisms in action.
        </p>
      </div>

      {/* CONTROL CENTER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT: ATTACK CONFIG */}
        <div className="lg:col-span-4 space-y-4">
            <div className="bg-cyber-900 border border-cyber-600 rounded p-4">
                <div className="flex items-center gap-2 mb-4 text-red-500 font-bold border-b border-gray-700 pb-2">
                    <Zap size={18}/> BOTNET CONTROL (C2)
                </div>
                
                <div className="space-y-4">
                    {/* Attack Vector */}
                    <div>
                        <label className="text-xs text-gray-500 uppercase font-bold">Attack Vector</label>
                        <div className="grid grid-cols-3 gap-2 mt-1">
                            <button onClick={() => setAttackType('UDP')} className={`text-xs font-bold py-2 rounded border ${attackType === 'UDP' ? 'bg-red-900/50 border-red-500 text-white' : 'bg-black border-gray-700 text-gray-400'}`}>UDP FLOOD</button>
                            <button onClick={() => setAttackType('SYN')} className={`text-xs font-bold py-2 rounded border ${attackType === 'SYN' ? 'bg-yellow-900/50 border-yellow-500 text-white' : 'bg-black border-gray-700 text-gray-400'}`}>SYN FLOOD</button>
                            <button onClick={() => setAttackType('HTTP')} className={`text-xs font-bold py-2 rounded border ${attackType === 'HTTP' ? 'bg-blue-900/50 border-blue-500 text-white' : 'bg-black border-gray-700 text-gray-400'}`}>HTTP FLOOD</button>
                        </div>
                    </div>

                    {/* Botnet Size */}
                    <div>
                         <label className="text-xs text-gray-500 uppercase font-bold flex justify-between">
                            <span>Botnet Size</span>
                            <span className="text-red-400">{botnetSize.toLocaleString()} Zombies</span>
                         </label>
                         <input type="range" min="500" max="10000" step="500" value={botnetSize} onChange={(e) => setBotnetSize(parseInt(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer mt-2"/>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                         <button onClick={() => setAttacking(!attacking)} className={`flex-1 font-bold py-3 rounded flex items-center justify-center gap-2 transition-all ${attacking ? 'bg-red-600 text-white shadow-[0_0_20px_red] animate-pulse' : 'bg-green-600 text-black hover:bg-green-500'}`}>
                             {attacking ? <><Square size={16} fill="white"/> STOP ATTACK</> : <><Play size={16} fill="black"/> LAUNCH ATTACK</>}
                         </button>
                    </div>
                </div>
            </div>

            {/* DEFENSE CONFIG */}
            <div className="bg-cyber-900 border border-cyber-600 rounded p-4">
                <div className="flex items-center gap-2 mb-4 text-blue-400 font-bold border-b border-gray-700 pb-2">
                    <Shield size={18}/> MITIGATION STRATEGY
                </div>
                <div className="flex items-center justify-between bg-black p-3 rounded border border-gray-700">
                    <div className="text-sm text-gray-300">
                        <div className="font-bold">Cloud Scrubbing</div>
                        <div className="text-[10px] text-gray-500">Route via Protection Network</div>
                    </div>
                    <button 
                       onClick={() => setMitigation(!mitigation)}
                       className={`w-12 h-6 rounded-full transition-colors relative ${mitigation ? 'bg-blue-500' : 'bg-gray-700'}`}
                    >
                        <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${mitigation ? 'left-7' : 'left-1'}`}></div>
                    </button>
                </div>
            </div>
            
            {/* LOGS */}
            <div className="bg-black border border-cyber-600 rounded p-4 h-48 font-mono text-[10px] overflow-y-auto custom-scrollbar flex flex-col">
                 <div className="text-gray-500 mb-2 border-b border-gray-800 pb-1 font-bold">NETWORK EVENTS LOG</div>
                 <div className="flex-1 space-y-1">
                     {logs.map((l, i) => (
                         <div key={i} className={`${l.includes('ALERT') ? 'text-red-500' : 'text-blue-400'}`}>{l}</div>
                     ))}
                     {logs.length === 0 && <span className="text-gray-600 italic">No activity detected...</span>}
                 </div>
            </div>
        </div>

        {/* CENTER & RIGHT: VISUALIZATION */}
        <div className="lg:col-span-8 flex flex-col gap-6">
            
            {/* TOP ROW: MAP & TARGET */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[350px]">
                
                {/* GLOBAL BOTNET MAP */}
                <div className="bg-black border border-cyber-600 rounded p-4 relative overflow-hidden flex items-center justify-center">
                    <Globe className={`text-gray-800 absolute w-[120%] h-[120%] opacity-20 ${attacking ? 'animate-pulse' : ''}`} strokeWidth={0.5}/>
                    
                    {/* Active Nodes */}
                    {attacking && Array(12).fill(0).map((_, i) => (
                        <div 
                           key={i} 
                           className="absolute w-2 h-2 rounded-full bg-red-500 animate-ping" 
                           style={{ 
                               top: `${Math.random() * 80 + 10}%`, 
                               left: `${Math.random() * 80 + 10}%`,
                               animationDuration: `${Math.random() * 1 + 0.5}s`
                           }}
                        ></div>
                    ))}
                    
                    <div className="absolute top-2 left-2 text-xs font-bold text-gray-500">GLOBAL BOTNET ACTIVITY</div>
                    {attacking && <div className="absolute bottom-2 right-2 text-xs font-bold text-red-500 bg-red-900/20 px-2 rounded animate-pulse">{botnetSize.toLocaleString()} NODES ACTIVE</div>}
                </div>

                {/* TARGET SERVER VISUAL */}
                <div className="bg-gray-900 border border-cyber-600 rounded p-4 relative overflow-hidden flex flex-col items-center justify-end">
                    
                    {/* FALLING PARTICLES */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                        {particles.map(p => (
                            <div 
                                key={p.id}
                                className="absolute w-1 h-2 rounded-full"
                                style={{
                                    left: `${p.left}%`,
                                    backgroundColor: p.color,
                                    top: -10,
                                    animation: `fall ${p.speed}s linear forwards`
                                }}
                            ></div>
                        ))}
                    </div>

                    {/* CLOUD SHIELD */}
                    {mitigation && (
                        <div className="absolute top-1/3 w-full h-2 bg-blue-500/20 backdrop-blur-sm z-10 flex items-center justify-center border-y border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.5)]">
                             <span className="text-[10px] text-blue-300 font-bold tracking-widest">CLOUD PROTECTION LAYER</span>
                        </div>
                    )}

                    {/* SERVER RACK */}
                    <div className={`relative z-20 transition-transform duration-100 ${attacking ? 'translate-x-[1px] translate-y-[1px]' : ''}`}>
                         <Server size={100} className={cpu > 90 || ram > 90 ? 'text-red-600' : 'text-gray-300'} />
                         {/* Status LED */}
                         <div className={`absolute top-2 right-4 w-2 h-2 rounded-full ${cpu > 90 ? 'bg-red-500 animate-ping' : 'bg-green-500'}`}></div>
                    </div>
                    
                    <div className="z-20 mt-2 text-center">
                        <div className="font-bold text-white">PRIMARY_DATACENTER</div>
                        <div className="text-xs text-gray-500">192.168.1.10</div>
                    </div>
                </div>
            </div>

            {/* BOTTOM ROW: METRICS */}
            <div className="grid grid-cols-3 gap-4 h-48">
                
                {/* 1. BANDWIDTH GRAPH */}
                <div className="bg-black border border-cyber-600 rounded p-3 flex flex-col">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] text-gray-400 font-bold flex items-center gap-1"><Wifi size={10}/> INGRESS TRAFFIC</span>
                        <span className={`text-xs font-bold ${bandwidthHistory[bandwidthHistory.length-1] > 80 ? 'text-red-500' : 'text-blue-500'}`}>
                             {Math.floor(bandwidthHistory[bandwidthHistory.length-1]) * 100} Mbps
                        </span>
                    </div>
                    <div className="flex-1 flex items-end gap-1">
                        {bandwidthHistory.map((val, i) => (
                            <div key={i} className={`flex-1 transition-all duration-300 ${val > 80 ? 'bg-red-500' : 'bg-blue-600'}`} style={{ height: `${val}%` }}></div>
                        ))}
                    </div>
                </div>

                {/* 2. SERVER LOAD */}
                <div className="bg-black border border-cyber-600 rounded p-3 flex flex-col justify-around">
                     <div>
                         <div className="flex justify-between text-[10px] text-gray-400 font-bold mb-1">
                             <span className="flex items-center gap-1"><Cpu size={10}/> CPU USAGE</span>
                             <span className={cpu > 80 ? 'text-red-500' : 'text-green-500'}>{Math.floor(cpu)}%</span>
                         </div>
                         <div className="w-full h-1 bg-gray-800 rounded overflow-hidden">
                             <div className={`h-full ${cpu > 80 ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: `${cpu}%` }}></div>
                         </div>
                     </div>
                     <div>
                         <div className="flex justify-between text-[10px] text-gray-400 font-bold mb-1">
                             <span className="flex items-center gap-1"><Database size={10}/> RAM USAGE</span>
                             <span className={ram > 80 ? 'text-red-500' : 'text-green-500'}>{Math.floor(ram)}%</span>
                         </div>
                         <div className="w-full h-1 bg-gray-800 rounded overflow-hidden">
                             <div className={`h-full ${ram > 80 ? 'bg-red-500' : 'bg-purple-500'}`} style={{ width: `${ram}%` }}></div>
                         </div>
                     </div>
                     <div className="text-center mt-2">
                         <div className="text-[10px] text-gray-500">LATENCY (PING)</div>
                         <div className={`font-mono text-lg font-bold ${latency > 200 ? 'text-red-500' : 'text-white'}`}>{Math.floor(latency)} ms</div>
                     </div>
                </div>

                {/* 3. SERVICE HEALTH */}
                <div className="bg-black border border-cyber-600 rounded p-3 flex flex-col justify-between">
                     <div className="text-[10px] text-gray-400 font-bold border-b border-gray-800 pb-1 mb-1">SERVICE STATUS</div>
                     
                     <div className="flex justify-between items-center text-xs">
                         <span>WEB (HTTP)</span>
                         <span className={getHealthColor(health.web)}>{getStatusText(health.web)}</span>
                     </div>
                     <div className="flex justify-between items-center text-xs">
                         <span>DATABASE</span>
                         <span className={getHealthColor(health.db)}>{getStatusText(health.db)}</span>
                     </div>
                     <div className="flex justify-between items-center text-xs">
                         <span>REST API</span>
                         <span className={getHealthColor(health.api)}>{getStatusText(health.api)}</span>
                     </div>
                     
                     {health.web < 30 && <div className="mt-1 bg-red-900/20 border border-red-500 text-red-500 text-[10px] text-center rounded animate-pulse font-bold">CRITICAL FAILURE</div>}
                </div>

            </div>
        </div>

      </div>
      
      {/* Animation Style */}
      <style>{`
        @keyframes fall {
          0% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(300px); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default DDOSSim;