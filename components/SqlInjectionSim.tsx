import React, { useState } from 'react';
import { Database, ShieldAlert, Play, Shield, LayoutList, Bug, Code } from 'lucide-react';

const SqlInjectionSim: React.FC = () => {
  const [username, setUsername] = useState('');
  const [queryResult, setQueryResult] = useState<any[] | null>(null);
  const [executedQuery, setExecutedQuery] = useState('');
  const [wafEnabled, setWafEnabled] = useState(false);
  const [wafBlocked, setWafBlocked] = useState(false);
  const [showSchema, setShowSchema] = useState(false);
  const [blindMode, setBlindMode] = useState(false); // NEW FEATURE
  const [showCode, setShowCode] = useState(false); // NEW FEATURE

  const dbUsers = [
    { id: 1, user: 'admin', pass: 'sUp3r_s3cr3t', role: 'root' },
    { id: 2, user: 'alice', pass: 'wonderland', role: 'user' },
  ];

  const handleLogin = () => {
    setQueryResult(null);
    setWafBlocked(false);

    if (wafEnabled) {
      if (username.toLowerCase().includes('or') || username.includes("'") || username.toLowerCase().includes('union')) {
        setWafBlocked(true);
        setExecutedQuery("BLOCKED BY WAF RULES: [SQLI_DETECTED]");
        return;
      }
    }

    const query = `SELECT * FROM users WHERE user = '${username}'`;
    setExecutedQuery(query);

    const lower = username.toLowerCase();
    
    if (lower.includes("union select")) {
       setQueryResult([
         ...dbUsers, 
         { id: 999, user: 'DATABASE_VERSION()', pass: 'MySQL 5.7', role: 'system' },
         { id: 1000, user: 'CURRENT_USER()', pass: 'root@localhost', role: 'system' }
       ]);
    } else if ((lower.includes("' or ") || lower.includes("'or")) && lower.includes("=")) {
        setQueryResult(dbUsers);
    } else {
       const user = dbUsers.find(u => u.user === username);
       setQueryResult(user ? [user] : []);
    }
  };

  return (
    <div className="space-y-6 p-4">
      <div className="bg-cyber-800 p-4 rounded-lg border border-cyber-600 flex flex-col md:flex-row justify-between gap-4">
        <div>
           <h3 className="text-xl font-bold text-cyber-accent mb-2">SQL Injection (Advanced)</h3>
           <p className="text-cyber-subtext text-sm">Dump database, bypass login, and inspect WAF behavior.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setShowCode(!showCode)} className="px-3 py-2 rounded font-bold text-xs bg-gray-700 text-white flex items-center gap-1"><Code size={14}/> View Code</button>
          <button onClick={() => setBlindMode(!blindMode)} className={`px-3 py-2 rounded font-bold text-xs flex items-center gap-1 ${blindMode ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300'}`}><Bug size={14}/> {blindMode ? 'Blind Mode' : 'Normal Mode'}</button>
          <button onClick={() => setShowSchema(!showSchema)} className={`px-3 py-2 rounded font-bold flex items-center gap-2 text-xs ${showSchema ? 'bg-blue-600 text-white' : 'bg-cyber-700 text-gray-300'}`}><LayoutList size={14} /> Schema</button>
          <button onClick={() => setWafEnabled(!wafEnabled)} className={`px-3 py-2 rounded font-bold flex items-center gap-2 text-xs ${wafEnabled ? 'bg-green-600 text-white' : 'bg-cyber-700 text-gray-300'}`}><Shield size={14} /> WAF: {wafEnabled ? 'ON' : 'OFF'}</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-cyber-900 p-6 rounded border border-cyber-600 shadow-lg relative">
            {blindMode && <div className="absolute top-2 right-2 text-purple-400 text-xs font-bold">BLIND MODE ACTIVE (No Errors)</div>}
            <div className="text-xs font-bold text-gray-400 uppercase mb-2">Vulnerable Login Portal</div>
            <div className="flex gap-2 mb-4">
              <input 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-black border border-cyber-600 p-3 rounded text-cyber-text focus:border-cyber-accent outline-none"
                placeholder="Enter username"
              />
              <button onClick={handleLogin} className="bg-cyber-accent text-black px-6 rounded font-bold hover:bg-white transition-colors"><Play size={18}/></button>
            </div>
          </div>

          {showCode && (
              <div className="bg-[#1e1e1e] border border-gray-600 p-4 rounded text-xs font-mono text-gray-300 animate-slide-up">
                  <div className="text-blue-400 mb-1">// Backend PHP Code (Vulnerable)</div>
                  <div>$username = <span className="text-red-400">$_POST['username']</span>;</div>
                  <div>$query = "SELECT * FROM users WHERE user = '" . $username . "'";</div>
                  <div>$result = <span className="text-yellow-400">mysqli_query</span>($conn, $query);</div>
              </div>
          )}
          
          {showSchema && (
            <div className="bg-[#0f172a] border border-blue-800 p-4 rounded text-sm font-mono text-blue-200 animate-slide-up">
              <div className="font-bold border-b border-blue-800 mb-2 pb-1 flex gap-2 items-center"><Database size={14}/> DB SCHEMA: users_table</div>
              <div>id INT(11) PRIMARY KEY</div>
              <div>user VARCHAR(50)</div>
              <div>pass VARCHAR(255)</div>
              <div>role VARCHAR(10)</div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="bg-black border border-cyber-600 p-4 rounded font-mono text-sm relative min-h-[150px]">
             {wafBlocked && (
               <div className="absolute inset-0 bg-red-900/90 flex flex-col items-center justify-center text-white z-10 animate-pulse">
                 <ShieldAlert size={48} className="mb-2"/>
                 <span className="font-bold text-xl">WAF BLOCK TRIGGERED</span>
               </div>
             )}
             <div className="text-gray-500 mb-2 text-xs font-bold uppercase border-b border-gray-800 pb-1">Backend Query Log</div>
             <div className="text-green-400 break-all">{executedQuery || "// Waiting for request..."}</div>
          </div>

          {queryResult && (
             <div className="bg-cyber-800 p-4 rounded border border-cyber-600 animate-slide-up">
                <div className="text-xs font-bold mb-3 text-cyber-accent flex justify-between">
                  <span>QUERY RESULTS</span>
                  <span className="bg-cyber-700 px-2 rounded text-white">{queryResult.length} Rows</span>
                </div>
                {blindMode && queryResult.length > 0 ? (
                    <div className="text-green-500 font-mono">True (Login Successful) - Data Hidden in Blind Mode</div>
                ) : (
                    <div className="max-h-[200px] overflow-y-auto custom-scrollbar">
                    {queryResult.map((r, i) => (
                        <div key={i} className="text-xs font-mono border-b border-cyber-700 py-2 grid grid-cols-12 gap-2 hover:bg-white/5">
                        <span className="col-span-1 text-gray-500">{r.id}</span>
                        <span className="col-span-3 font-bold text-white">{r.user}</span>
                        <span className="col-span-5 text-red-300 truncate">{r.pass}</span>
                        <span className="col-span-3 text-right text-gray-400">{r.role}</span>
                        </div>
                    ))}
                    {queryResult.length === 0 && <div className="text-red-400 italic text-sm">0 rows returned.</div>}
                    </div>
                )}
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SqlInjectionSim;