import React, { useState, useEffect } from 'react';
import { Shield, ShieldAlert, Check, X, RefreshCw, Globe, Activity, FileText, Lock, Server, Layers, Filter, AlertTriangle } from 'lucide-react';

interface Packet {
  id: number;
  srcIp: string;
  dstIp: string;
  port: number;
  protocol: 'TCP' | 'UDP' | 'ICMP';
  flag: 'SYN' | 'ACK' | 'FIN' | 'PSH';
  payload: string;
  country: string;
  size: number;
  riskScore: number;
}

const FirewallSim: React.FC = () => {
  const [packets, setPackets] = useState<Packet[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'MONITOR' | 'RULES' | 'MAP' | 'LOGS'>('MONITOR');
  const [bandwidth, setBandwidth] = useState<number[]>(Array(20).fill(10));
  
  // RULES STATE
  const [blockChina, setBlockChina] = useState(false);
  const [dpiEnabled, setDpiEnabled] = useState(false);
  const [rateLimit, setRateLimit] = useState(false);
  const [blockSSH, setBlockSSH] = useState(false);
  const [idsEnabled, setIdsEnabled] = useState(false);
  const [vpnBlock, setVpnBlock] = useState(false);

  // Stats
  const [stats, setStats] = useState({ allowed: 0, blocked: 0, threats: 0, bandwidth: '0 Mbps' });

  useEffect(() => {
    const interval = setInterval(() => {
      // 1. GENERATE TRAFFIC
      const countries = ['USA', 'CHN', 'RUS', 'DEU', 'BRA', 'IRN', 'PRK'];
      const country = countries[Math.floor(Math.random() * countries.length)];
      const isAttack = Math.random() > 0.6;
      
      let payload = "Normal Data";
      let risk = 0;

      if (isAttack) {
         const attacks = [
             { data: "' OR 1=1 --", risk: 90 },
             { data: "<script>alert(1)</script>", risk: 85 },
             { data: "GET /etc/passwd", risk: 95 },
             { data: "Overflow...AAAAA", risk: 80 },
             { data: "Encrypted VPN Stream", risk: 50 }
         ];
         const sel = attacks[Math.floor(Math.random() * attacks.length)];
         payload = sel.data;
         risk = sel.risk;
      }

      const newPacket: Packet = {
        id: Date.now(),
        srcIp: `192.168.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`,
        dstIp: '10.0.0.5',
        port: Math.random() > 0.8 ? 22 : (Math.random() > 0.5 ? 443 : 80),
        protocol: Math.random() > 0.8 ? 'UDP' : 'TCP',
        flag: Math.random() > 0.9 ? 'SYN' : 'PSH',
        payload: payload,
        country: country,
        size: Math.floor(Math.random() * 1500),
        riskScore: risk
      };

      // 2. FIREWALL LOGIC ENGINE (Next-Gen Features)
      let action = 'ALLOW';
      let rule = 'Default';

      // Feature: Geo-Blocking
      if (blockChina && (country === 'CHN' || country === 'RUS' || country === 'PRK')) {
          action = 'BLOCK';
          rule = 'GEO-IP';
      }

      // Feature: Deep Packet Inspection (DPI)
      if (dpiEnabled && (payload.includes('OR 1=1') || payload.includes('script') || payload.includes('passwd'))) {
          action = 'DROP';
          rule = 'DPI-SIGNATURE';
      }

      // Feature: IDS/IPS
      if (idsEnabled && newPacket.riskScore > 80) {
          action = 'REJECT';
          rule = 'IPS-THREAT-PREVENTION';
      }

      // Feature: VPN Detection
      if (vpnBlock && payload.includes('VPN')) {
          action = 'BLOCK';
          rule = 'APP-FILTER-VPN';
      }

      // Feature: Port Filtering
      if (blockSSH && newPacket.port === 22) {
          action = 'REJECT';
          rule = 'PORT-FILTER-SSH';
      }

      // Feature: Rate Limiting (Simulated spike)
      if (rateLimit && Math.random() > 0.7) {
          action = 'THROTTLE';
          rule = 'QOS-RATE-LIMIT';
      }

      // Update State
      setPackets(prev => [newPacket, ...prev].slice(0, 10));
      
      if (action !== 'ALLOW') {
          setStats(prev => ({ ...prev, blocked: prev.blocked + 1, threats: isAttack ? prev.threats + 1 : prev.threats }));
          setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${action} SRC=${newPacket.srcIp} RULE=${rule} FLAGS=${newPacket.flag}`, ...prev].slice(0, 20));
      } else {
          setStats(prev => ({ ...prev, allowed: prev.allowed + 1 }));
      }

      // Bandwidth Visual
      const load = Math.floor(Math.random() * (isAttack ? 90 : 30) + 10);
      setBandwidth(prev => [...prev.slice(1), load]);
      setStats(prev => ({ ...prev, bandwidth: `${load * 12} Mbps` }));

    }, 800);
    return () => clearInterval(interval);
  }, [blockChina, dpiEnabled, rateLimit, blockSSH, idsEnabled, vpnBlock]);

  return (
    <div className="space-y-6 p-4">
      <div className="bg-cyber-800 p-4 rounded-lg border border-cyber-600 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
            <h3 className="text-xl font-bold text-cyber-accent mb-1">Enterprise NGFW</h3>
            <p className="text-cyber-subtext text-sm">Deep Packet Inspection, Geo-Blocking, IPS, and QoS.</p>
        </div>
        <div className="flex gap-4 text-center bg-black/30 p-2 rounded-lg border border-gray-700">
            <div className="px-2">
                <div className="text-xl font-bold text-green-500">{stats.allowed}</div>
                <div className="text-[10px] text-gray-500 uppercase">Passed</div>
            </div>
            <div className="px-2 border-l border-gray-700">
                <div className="text-xl font-bold text-red-500">{stats.blocked}</div>
                <div className="text-[10px] text-gray-500 uppercase">Blocked</div>
            </div>
            <div className="px-2 border-l border-gray-700">
                <div className="text-xl font-bold text-yellow-500">{stats.threats}</div>
                <div className="text-[10px] text-gray-500 uppercase">Intrusions</div>
            </div>
            <div className="px-2 border-l border-gray-700">
                <div className="text-xl font-bold text-blue-400">{stats.bandwidth}</div>
                <div className="text-[10px] text-gray-500 uppercase">Throughput</div>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT PANEL: CONTROLS & NAV */}
        <div className="lg:col-span-3 space-y-4">
            <div className="flex flex-col gap-2">
                <button onClick={() => setActiveTab('MONITOR')} className={`p-3 rounded text-left font-bold flex items-center gap-2 transition-all ${activeTab === 'MONITOR' ? 'bg-cyber-accent text-black shadow-[0_0_10px_var(--accent-color)]' : 'bg-cyber-900 text-gray-400'}`}><Activity size={16}/> Live Traffic</button>
                <button onClick={() => setActiveTab('RULES')} className={`p-3 rounded text-left font-bold flex items-center gap-2 transition-all ${activeTab === 'RULES' ? 'bg-cyber-accent text-black shadow-[0_0_10px_var(--accent-color)]' : 'bg-cyber-900 text-gray-400'}`}><Shield size={16}/> Policy Rules</button>
                <button onClick={() => setActiveTab('MAP')} className={`p-3 rounded text-left font-bold flex items-center gap-2 transition-all ${activeTab === 'MAP' ? 'bg-cyber-accent text-black shadow-[0_0_10px_var(--accent-color)]' : 'bg-cyber-900 text-gray-400'}`}><Globe size={16}/> Threat Map</button>
                <button onClick={() => setActiveTab('LOGS')} className={`p-3 rounded text-left font-bold flex items-center gap-2 transition-all ${activeTab === 'LOGS' ? 'bg-cyber-accent text-black shadow-[0_0_10px_var(--accent-color)]' : 'bg-cyber-900 text-gray-400'}`}><FileText size={16}/> SIEM Logs</button>
            </div>

            <div className="bg-cyber-900 border border-cyber-600 p-4 rounded h-40 flex items-end justify-between gap-1 relative overflow-hidden">
                <div className="absolute top-2 left-2 text-[10px] text-gray-500 font-mono">INTERFACE: eth0</div>
                {bandwidth.map((h, i) => (
                    <div key={i} className={`w-full opacity-80 hover:opacity-100 transition-all duration-300 ${h > 80 ? 'bg-red-500' : 'bg-blue-500'}`} style={{ height: `${h}%` }}></div>
                ))}
            </div>
        </div>

        {/* RIGHT PANEL: CONTENT */}
        <div className="lg:col-span-9 bg-black border border-cyber-600 rounded-lg p-6 min-h-[500px] relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>
            
            {activeTab === 'MONITOR' && (
                <div className="space-y-4 relative z-10">
                    <div className="flex justify-between items-center text-cyber-accent border-b border-gray-800 pb-2 mb-2">
                        <span className="font-bold flex items-center gap-2"><RefreshCw className="animate-spin" size={14}/> LIVE PACKET INSPECTION</span>
                        <div className="flex gap-2 text-xs">
                             <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> TCP</span>
                             <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-500"></span> UDP</span>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm font-mono">
                            <thead>
                                <tr className="text-gray-500 border-b border-gray-800 text-xs uppercase tracking-wider">
                                    <th className="pb-2">Time</th>
                                    <th className="pb-2">Source</th>
                                    <th className="pb-2">Geo</th>
                                    <th className="pb-2">Proto</th>
                                    <th className="pb-2">Flag</th>
                                    <th className="pb-2">Payload Content (DPI)</th>
                                    <th className="pb-2 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {packets.map(p => {
                                    const blocked = p.payload.includes('OR') || p.payload.includes('script') || (blockChina && (p.country === 'CHN' || p.country === 'RUS'));
                                    return (
                                        <tr key={p.id} className="border-b border-gray-900 hover:bg-white/5 transition-colors text-xs">
                                            <td className="py-2 text-gray-500">{new Date(p.id).toLocaleTimeString()}</td>
                                            <td className="py-2 text-blue-400">{p.srcIp}</td>
                                            <td className="py-2 font-bold">{p.country}</td>
                                            <td className="py-2 text-yellow-500">{p.protocol}/{p.port}</td>
                                            <td className="py-2 text-gray-400">{p.flag}</td>
                                            <td className="py-2 text-gray-400 truncate max-w-[150px]">
                                                {p.riskScore > 50 && <AlertTriangle size={12} className="inline text-red-500 mr-1"/>}
                                                {p.payload}
                                            </td>
                                            <td className="py-2 text-right font-bold">
                                                {blocked || (idsEnabled && p.riskScore > 80) ? <span className="text-red-500 bg-red-900/20 px-1 rounded">DROP</span> : <span className="text-green-500">ALLOW</span>}
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'RULES' && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 relative z-10">
                    {[
                        { label: 'Geo-Blocking', state: blockChina, setter: setBlockChina, icon: Globe, color: 'text-red-500', desc: 'Block High-Risk Countries (CN, RU, KP)' },
                        { label: 'Deep Packet Inspection', state: dpiEnabled, setter: setDpiEnabled, icon: Layers, color: 'text-blue-500', desc: 'Scan L7 Payloads for SQLi/XSS' },
                        { label: 'Strict Port Filtering', state: blockSSH, setter: setBlockSSH, icon: Lock, color: 'text-yellow-500', desc: 'Block SSH (22) & RDP (3389)' },
                        { label: 'Intrusion Prevention', state: idsEnabled, setter: setIdsEnabled, icon: ShieldAlert, color: 'text-orange-500', desc: 'Auto-Block High Risk Scores > 80' },
                        { label: 'VPN/Proxy Detection', state: vpnBlock, setter: setVpnBlock, icon: Filter, color: 'text-purple-500', desc: 'Block Tunneled/Encrypted Traffic' },
                        { label: 'QoS Rate Limiting', state: rateLimit, setter: setRateLimit, icon: Activity, color: 'text-green-500', desc: 'Throttle DDoS Traffic Spikes' },
                    ].map((item, i) => (
                        <div key={i} onClick={() => item.setter(!item.state)} className={`p-4 rounded border-2 cursor-pointer transition-all hover:scale-105 ${item.state ? `border-${item.color.split('-')[1]}-500 bg-${item.color.split('-')[1]}-900/20` : 'border-gray-700 bg-gray-900'}`}>
                            <div className="flex justify-between mb-2">
                                <item.icon size={24} className={item.state ? item.color : 'text-gray-500'} />
                                <div className={`w-10 h-6 rounded-full p-1 transition-colors ${item.state ? `bg-${item.color.split('-')[1]}-500` : 'bg-gray-700'}`}>
                                    <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${item.state ? 'translate-x-4' : ''}`}></div>
                                </div>
                            </div>
                            <h4 className="font-bold text-white text-sm">{item.label}</h4>
                            <p className="text-[10px] text-gray-400 mt-1 leading-tight">{item.desc}</p>
                        </div>
                    ))}
                </div>
            )}

            {activeTab === 'MAP' && (
                <div className="h-full flex items-center justify-center relative z-10">
                    <div className="w-full h-full bg-[#050510] rounded border border-gray-800 relative overflow-hidden p-8 grid grid-cols-4 gap-4 opacity-90">
                         {['USA', 'BRA', 'DEU', 'CHN', 'RUS', 'IRN', 'PRK', 'AUS'].map(c => {
                             const isBlocked = blockChina && (c === 'CHN' || c === 'RUS' || c === 'PRK' || c === 'IRN');
                             const hasTraffic = packets.some(p => p.country === c);
                             return (
                                 <div key={c} className={`border border-gray-700 rounded-lg flex flex-col items-center justify-center relative group overflow-hidden ${isBlocked ? 'bg-red-900/10' : 'bg-blue-900/10'}`}>
                                     <span className="text-4xl font-black text-gray-700 z-0 absolute opacity-20">{c}</span>
                                     <span className={`text-2xl font-bold z-10 ${isBlocked ? 'text-red-500' : 'text-gray-300'}`}>{c}</span>
                                     
                                     {isBlocked && <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-20">
                                         <Lock className="text-red-500 animate-pulse" size={32}/>
                                     </div>}

                                     {hasTraffic && !isBlocked && <div className="absolute bottom-0 left-0 w-full h-1 bg-green-500 animate-pulse shadow-[0_0_10px_green]"></div>}
                                     
                                     <div className="text-[10px] mt-2 text-gray-500">{isBlocked ? 'ACCESS DENIED' : 'ROUTE ACTIVE'}</div>
                                 </div>
                             )
                         })}
                    </div>
                </div>
            )}

            {activeTab === 'LOGS' && (
                <div className="bg-[#0d0d12] h-full p-2 rounded font-mono text-xs overflow-y-auto custom-scrollbar border border-gray-700 relative z-10">
                    <div className="text-yellow-500 mb-2 font-bold border-b border-gray-800 pb-1 sticky top-0 bg-[#0d0d12]">/var/log/syslog (SIEM Export)</div>
                    {logs.map((log, i) => (
                        <div key={i} className={`mb-1 border-l-2 pl-2 ${log.includes('BLOCK') || log.includes('DROP') ? 'text-red-400 border-red-500' : (log.includes('REJECT') ? 'text-orange-400 border-orange-500' : 'text-gray-400 border-gray-700')}`}>
                            {log}
                        </div>
                    ))}
                    {logs.length === 0 && <div className="text-gray-600 italic">No events logged yet...</div>}
                </div>
            )}

        </div>
      </div>
    </div>
  );
};

export default FirewallSim;