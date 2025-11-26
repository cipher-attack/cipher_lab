import React, { useState, useEffect, useRef } from 'react';
import { Radar, Terminal, Server, Globe, Shield, Clock, Search, Layers, Activity, FileText } from 'lucide-react';

const NmapSim: React.FC = () => {
  const [command, setCommand] = useState('nmap -sS -T4 192.168.1.15');
  const [output, setOutput] = useState<string[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [topology, setTopology] = useState<any[]>([]);
  
  // Builder State
  const [scanType, setScanType] = useState('-sS');
  const [timing, setTiming] = useState('-T4');
  const [flags, setFlags] = useState<string[]>([]);
  
  const bottomRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    // Auto-update command string
    const flagStr = flags.join(' ');
    setCommand(`nmap ${scanType} ${timing} ${flagStr} 192.168.1.15`);
  }, [scanType, timing, flags]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [output]);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, []);

  const toggleFlag = (f: string) => {
    if (flags.includes(f)) setFlags(flags.filter(x => x !== f));
    else setFlags([...flags, f]);
  };

  const runScan = () => {
    if (isScanning) return;
    setIsScanning(true);
    setOutput([`Starting Nmap 7.92 ( https://nmap.org ) at ${new Date().toLocaleTimeString()}`]);
    setTopology([]);

    const steps = [
        { msg: `Initiating ARP Ping Scan at 192.168.1.15`, delay: 500 },
        { msg: `Scanning 192.168.1.15 [1000 ports]`, delay: 1000 },
        { msg: `Completed SYN Stealth Scan at ${new Date().toLocaleTimeString()}, 2.40s elapsed (1000 total ports)`, delay: 3000 },
        { msg: `Initiating Service Scan at ${new Date().toLocaleTimeString()}`, delay: 3500 },
        { msg: `Detected OS: Linux 5.4 (Ubuntu) [Accuracy: 98%]`, delay: 5000 },
        { msg: `NSE: Script scanning completed.`, delay: 6000 },
        { msg: `Nmap done: 1 IP address (1 host up) scanned in 6.02 seconds`, delay: 7000 },
    ];

    // Stream Output
    let i = 0;
    
    // Clear any existing interval to prevent overlaps
    if (intervalRef.current) window.clearInterval(intervalRef.current);

    intervalRef.current = window.setInterval(() => {
        // Strict bounds check
        if (i >= steps.length) {
            if (intervalRef.current) window.clearInterval(intervalRef.current);
            setIsScanning(false);
            generateResults();
            return;
        } 
        
        // Defensive access using current step variable
        const currentStep = steps[i];
        if (currentStep && currentStep.msg) {
            setOutput(prev => [...prev, currentStep.msg]);
            if (i === 1) generateTopology(false); // Initial
            if (i === 4) generateTopology(true); // Full details
        }
        
        i++;
    }, 800);
  };

  const generateResults = () => {
      let ports = `
PORT     STATE SERVICE VERSION
22/tcp   open  ssh     OpenSSH 8.2p1 Ubuntu
80/tcp   open  http    Apache httpd 2.4.41
3306/tcp open  mysql   MySQL 5.7.33
8080/tcp open  http-proxy
`;
      if (flags.includes('-sV')) {
          ports += `
| http-title: Welcome to Vulnerable App
|_http-server-header: Apache/2.4.41 (Ubuntu)
`;
      }
      if (flags.includes('--script vuln')) {
          ports += `
| vulners: 
|   cpe:/a:apache:http_server:2.4.41: 
|       CVE-2021-41773  7.5  https://vulners.com/cve/CVE-2021-41773
`;
      }
      setOutput(prev => [...prev, ports]);
  };

  const generateTopology = (full: boolean) => {
      if (!full) {
          setTopology([{ id: 'TARGET', x: 50, y: 50, label: '192.168.1.15', type: 'HOST' }]);
      } else {
          setTopology([
              { id: 'TARGET', x: 50, y: 50, label: '192.168.1.15', type: 'HOST', os: 'Linux' },
              { id: 'SSH', x: 30, y: 20, label: 'Port 22', type: 'PORT' },
              { id: 'HTTP', x: 70, y: 20, label: 'Port 80', type: 'PORT' },
              { id: 'DB', x: 80, y: 80, label: 'Port 3306', type: 'PORT' },
          ]);
      }
  };

  return (
    <div className="space-y-6 p-4">
      <div className="bg-cyber-800 p-4 rounded-lg border border-cyber-600">
        <h3 className="text-xl font-bold text-cyber-accent mb-2">Advanced Nmap Lab (Network Recon)</h3>
        <p className="text-cyber-subtext text-sm">
          Build complex scan commands, visualize network topology, and perform OS/Service detection.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[600px]">
        
        {/* LEFT: COMMAND BUILDER */}
        <div className="lg:col-span-4 bg-cyber-900 border border-cyber-600 rounded p-4 flex flex-col gap-4">
             <div className="text-xs font-bold text-gray-500 uppercase mb-2 border-b border-gray-700 pb-1 flex items-center gap-2"><Terminal size={14}/> Command Builder</div>
             
             {/* Scan Type */}
             <div>
                 <label className="text-xs font-bold text-blue-400">Scan Type</label>
                 <div className="grid grid-cols-3 gap-2 mt-1">
                     {['-sS', '-sT', '-sU'].map(t => (
                         <button key={t} onClick={() => setScanType(t)} className={`text-xs border py-1 rounded ${scanType === t ? 'bg-blue-600 text-white' : 'border-gray-600 text-gray-400'}`}>
                             {t} {t === '-sS' ? '(SYN)' : (t === '-sT' ? '(TCP)' : '(UDP)')}
                         </button>
                     ))}
                 </div>
             </div>

             {/* Timing */}
             <div>
                 <label className="text-xs font-bold text-yellow-400">Timing Template</label>
                 <div className="grid grid-cols-5 gap-1 mt-1">
                     {['-T1', '-T2', '-T3', '-T4', '-T5'].map(t => (
                         <button key={t} onClick={() => setTiming(t)} className={`text-xs border py-1 rounded ${timing === t ? 'bg-yellow-600 text-black font-bold' : 'border-gray-600 text-gray-400'}`}>
                             {t}
                         </button>
                     ))}
                 </div>
             </div>

             {/* Flags */}
             <div>
                 <label className="text-xs font-bold text-green-400">Advanced Flags</label>
                 <div className="grid grid-cols-2 gap-2 mt-1">
                     {[
                         {f: '-O', l: 'OS Detect'},
                         {f: '-sV', l: 'Service Ver.'},
                         {f: '-D RND:10', l: 'Decoy (Spoof)'},
                         {f: '--traceroute', l: 'Trace Route'},
                         {f: '--script vuln', l: 'Vuln Scan'},
                         {f: '-Pn', l: 'No Ping'},
                     ].map(item => (
                         <button key={item.f} onClick={() => toggleFlag(item.f)} className={`text-[10px] border py-1 px-2 rounded flex justify-between ${flags.includes(item.f) ? 'bg-green-900/50 border-green-500 text-white' : 'border-gray-600 text-gray-400'}`}>
                             <span>{item.f}</span><span>{item.l}</span>
                         </button>
                     ))}
                 </div>
             </div>
             
             {/* Final Command */}
             <div className="mt-auto">
                 <div className="bg-black p-3 rounded border border-gray-600 font-mono text-xs text-green-400 break-all">
                     {command}
                 </div>
                 <button onClick={runScan} disabled={isScanning} className="w-full mt-2 bg-cyber-accent text-black font-bold py-3 rounded hover:bg-white transition-colors disabled:opacity-50">
                     {isScanning ? 'SCANNING...' : 'EXECUTE SCAN'}
                 </button>
             </div>
        </div>

        {/* CENTER: TERMINAL OUTPUT */}
        <div className="lg:col-span-5 bg-black border border-cyber-600 rounded p-4 font-mono text-sm overflow-hidden flex flex-col">
             <div className="text-gray-500 border-b border-gray-800 pb-1 mb-2 flex justify-between">
                 <span>root@kali:~/scans#</span>
                 {isScanning && <Activity size={14} className="animate-spin text-green-500"/>}
             </div>
             <div className="flex-1 overflow-y-auto custom-scrollbar space-y-1">
                 {output.map((line, i) => (
                     <div key={i} className={`break-words ${line.includes('PORT') ? 'text-white font-bold bg-gray-900' : (line.includes('open') ? 'text-green-400' : 'text-gray-300')}`}>
                         {line}
                     </div>
                 ))}
                 <div ref={bottomRef} />
             </div>
        </div>

        {/* RIGHT: TOPOLOGY VISUALIZER */}
        <div className="lg:col-span-3 bg-[#0a0a0f] border border-cyber-600 rounded relative overflow-hidden">
             <div className="absolute top-2 left-2 text-[10px] text-gray-500 font-bold uppercase z-10">Network Topology</div>
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,255,0,0.1)_1px,_transparent_1px)] bg-[size:20px_20px] opacity-20"></div>
             
             {isScanning && <div className="absolute inset-0 bg-green-500/5 animate-pulse"></div>}

             {/* Nodes */}
             <div className="relative w-full h-full">
                 {/* Attacker Node (Static) */}
                 <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
                     <div className="w-12 h-12 bg-blue-900 rounded-full border-2 border-blue-500 flex items-center justify-center shadow-[0_0_20px_blue]">
                         <Globe size={24} className="text-blue-300"/>
                     </div>
                     <span className="text-[10px] text-blue-400 mt-1 font-bold">ATTACKER</span>
                 </div>

                 {/* Render Discovered Nodes */}
                 {topology.map((node) => (
                     <div 
                        key={node.id} 
                        className="absolute flex flex-col items-center transition-all duration-500"
                        style={{ top: `${node.y}%`, left: `${node.x}%` }}
                     >
                         <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${node.type === 'HOST' ? 'bg-red-900 border-red-500' : 'bg-gray-800 border-gray-500'}`}>
                             {node.type === 'HOST' ? <Server size={16} className="text-red-300"/> : <Layers size={14} className="text-gray-400"/>}
                         </div>
                         <span className="text-[9px] text-gray-300 mt-1 bg-black/50 px-1 rounded">{node.label}</span>
                         {node.os && <span className="text-[8px] text-green-400">{node.os}</span>}
                     </div>
                 ))}
                 
                 {/* Connections (SVG) */}
                 <svg className="absolute inset-0 w-full h-full pointer-events-none">
                     {topology.length > 0 && <line x1="50%" y1="90%" x2="50%" y2="50%" stroke="#333" strokeDasharray="4"/>}
                     {topology.length > 1 && topology.slice(1).map((t, i) => (
                         <line key={i} x1="50%" y1="50%" x2={`${t.x}%`} y2={`${t.y}%`} stroke="#333" strokeWidth="1"/>
                     ))}
                 </svg>
             </div>
        </div>

      </div>
    </div>
  );
};

export default NmapSim;