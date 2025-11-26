import React from 'react';
import { Target, Trophy, TrendingUp, ShieldAlert, Cpu, Lock, Terminal, Activity, CheckCircle } from 'lucide-react';

const Dashboard: React.FC = () => {
  // Mock Progression Data
  const skills = [
    { name: "Network Sec", level: 85, color: "bg-blue-500" },
    { name: "Cryptography", level: 60, color: "bg-purple-500" },
    { name: "Web Exploits", level: 92, color: "bg-red-500" },
    { name: "Binary Analysis", level: 40, color: "bg-yellow-500" },
  ];

  const recentMissions = [
    { id: 1, title: "SQL Injection Database Dump", status: "COMPLETED", xp: "+500 XP" },
    { id: 2, title: "Buffer Overflow Simulation", status: "IN PROGRESS", xp: "---" },
    { id: 3, title: "Corporate Firewall Bypass", status: "PENDING", xp: "---" },
  ];

  return (
    <div className="space-y-6 h-full flex flex-col p-4">
      {/* HEADER HUD */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-cyber-800 border border-cyber-accent/30 p-6 rounded-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Trophy size={64} />
          </div>
          <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Current Rank</h3>
          <div className="text-3xl font-black text-cyber-accent italic">ELITE HACKER</div>
          <div className="text-sm text-cyber-subtext mt-2 font-mono">ID: CIPHER-007</div>
        </div>

        <div className="bg-cyber-800 border border-cyber-600 p-6 rounded-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Target size={64} />
          </div>
          <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Mission Progress</h3>
          <div className="text-3xl font-black text-green-400">12<span className="text-lg text-gray-500">/20</span></div>
          <div className="w-full bg-gray-900 h-2 mt-3 rounded-full overflow-hidden">
            <div className="bg-green-500 h-full w-[60%] animate-pulse"></div>
          </div>
        </div>

        <div className="bg-cyber-800 border border-cyber-600 p-6 rounded-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Activity size={64} />
          </div>
          <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Global Threat Level</h3>
          <div className="text-3xl font-black text-red-500 animate-pulse">CRITICAL</div>
          <div className="text-sm text-red-400 mt-2 font-mono flex items-center gap-2">
            <ShieldAlert size={14} /> DEFCON 3
          </div>
        </div>
      </div>

      {/* SKILL TREE & INTEL */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
        
        {/* SKILL TREE */}
        <div className="bg-cyber-900 border border-cyber-600 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-6 border-b border-gray-800 pb-4">
            <Cpu className="text-cyber-accent" />
            <h2 className="text-lg font-bold text-white uppercase tracking-wide">Skill Tree Matrix</h2>
          </div>
          <div className="space-y-6">
            {skills.map((skill, i) => (
              <div key={i}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-bold text-gray-300">{skill.name}</span>
                  <span className="text-sm font-mono text-cyber-accent">{skill.level}%</span>
                </div>
                <div className="w-full bg-black h-3 rounded-full overflow-hidden border border-gray-800">
                  <div 
                    className={`h-full ${skill.color} transition-all duration-1000 ease-out`} 
                    style={{ width: `${skill.level}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ACTIVE OPERATIONS */}
        <div className="bg-cyber-900 border border-cyber-600 rounded-xl p-6 flex flex-col">
          <div className="flex items-center gap-2 mb-6 border-b border-gray-800 pb-4">
            <Terminal className="text-green-400" />
            <h2 className="text-lg font-bold text-white uppercase tracking-wide">Active Operations</h2>
          </div>
          
          <div className="space-y-3 flex-1">
            {recentMissions.map((m) => (
              <div key={m.id} className="bg-black/40 p-4 rounded border border-cyber-600 flex items-center justify-between group hover:border-cyber-accent transition-colors">
                <div className="flex items-center gap-3">
                  {m.status === 'COMPLETED' ? <CheckCircle size={18} className="text-green-500"/> : <Lock size={18} className="text-gray-500"/>}
                  <div>
                    <div className="font-bold text-sm text-gray-200">{m.title}</div>
                    <div className="text-[10px] text-gray-500 font-mono">{m.status}</div>
                  </div>
                </div>
                <div className="text-xs font-mono text-yellow-500 font-bold">{m.xp}</div>
              </div>
            ))}
             <div className="mt-4 p-4 bg-blue-900/10 border border-blue-500/30 rounded text-xs text-blue-300">
               <strong className="block mb-1">ADMIN NOTE:</strong>
               New Advanced Modules (Buffer Overflow, Reverse Engineering) have been unlocked for your user ID. Proceed with caution.
             </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;