import React, { useState, useEffect } from 'react';
import { Lock, Unlock, ShieldCheck, Hash, Cpu } from 'lucide-react';

const PasswordSim: React.FC = () => {
  const [password, setPassword] = useState('');
  const [sha256Hash, setSha256Hash] = useState('');
  const [crackTime, setCrackTime] = useState('Instantly');
  const [score, setScore] = useState(0);

  // REAL Hashing Function
  const generateHash = async (text: string) => {
    if (!text) {
      setSha256Hash('');
      return;
    }
    const msgBuffer = new TextEncoder().encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    setSha256Hash(hashHex);
  };

  useEffect(() => {
    calculateStrength(password);
    generateHash(password);
  }, [password]);

  const calculateStrength = (pwd: string) => {
    let s = 0;
    if (pwd.length > 7) s += 1;
    if (pwd.length > 12) s += 1;
    if (/[A-Z]/.test(pwd)) s += 1;
    if (/[0-9]/.test(pwd)) s += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) s += 1;
    
    setScore(s);

    // Realistic Math
    const pool = 
      (pwd.match(/[a-z]/) ? 26 : 0) +
      (pwd.match(/[A-Z]/) ? 26 : 0) +
      (pwd.match(/[0-9]/) ? 10 : 0) +
      (pwd.match(/[^a-zA-Z0-9]/) ? 32 : 0);

    const entropy = Math.pow(pool || 1, pwd.length);
    const gpuSpeed = 10000000000; // RTX 4090 Hash Rate approx
    const seconds = entropy / gpuSpeed;

    if (seconds < 0.0001) setCrackTime('Instantly (Rainbow Table)');
    else if (seconds < 60) setCrackTime('< 1 Minute');
    else if (seconds < 3600) setCrackTime(`${Math.round(seconds/60)} Minutes`);
    else if (seconds < 86400) setCrackTime(`${Math.round(seconds/3600)} Hours`);
    else if (seconds < 31536000) setCrackTime(`${Math.round(seconds/86400)} Days`);
    else setCrackTime(`${Math.round(seconds/31536000)} Years`);
  };

  const getStrengthColor = () => {
    if (score < 2) return 'bg-red-500';
    if (score < 4) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="space-y-6 p-4">
      <div className="bg-cyber-800 p-4 rounded-lg border border-cyber-600">
        <h3 className="text-xl font-bold text-cyber-accent mb-2">Password Lab (Real Hashing)</h3>
        <p className="text-cyber-subtext text-sm">
          Real-time SHA-256 hash generation and entropy calculation. See what your password looks like to a database.
        </p>
      </div>

      <div className="bg-cyber-800 p-8 rounded-lg border border-cyber-600 max-w-3xl mx-auto text-center shadow-2xl">
        <div className="mb-6 relative">
          <input 
            type="text" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Type a password..."
            className="w-full bg-cyber-900 border border-cyber-600 text-cyber-text text-xl p-4 rounded focus:outline-none focus:border-cyber-accent text-center font-mono placeholder-gray-600"
          />
          <div className="absolute right-4 top-4 text-gray-500">
            {score >= 4 ? <ShieldCheck className="text-green-500" /> : score < 2 ? <Unlock className="text-red-500" /> : <Lock className="text-yellow-500" />}
          </div>
        </div>

        {/* Real Hash Display */}
        <div className="bg-black p-3 rounded mb-6 border border-gray-800 text-left">
           <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
             <Hash size={12} /> SHA-256 HASH (Database View)
           </div>
           <div className="font-mono text-xs text-cyber-purple break-all leading-relaxed">
             {sha256Hash || "waiting for input..."}
           </div>
        </div>

        <div className="h-4 w-full bg-cyber-700 rounded-full mb-4 overflow-hidden">
          <div 
            className={`h-full transition-all duration-500 ${getStrengthColor()}`} 
            style={{ width: `${Math.min((score / 5) * 100, 100)}%` }}
          ></div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-left">
          <div className="bg-cyber-900 p-4 rounded border border-cyber-600">
            <div className="text-cyber-subtext text-xs uppercase tracking-wider">Complexity Score</div>
            <div className={`text-xl font-bold mt-1 ${score > 3 ? 'text-green-400' : 'text-red-400'}`}>
              {score}/5
            </div>
          </div>
          <div className="bg-cyber-900 p-4 rounded border border-cyber-600">
            <div className="text-cyber-subtext text-xs uppercase tracking-wider flex items-center gap-2">
               <Cpu size={14} /> Crack Time (RTX 4090)
            </div>
            <div className="text-xl font-bold text-cyber-accent mt-1">
              {password.length === 0 ? '---' : crackTime}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordSim;