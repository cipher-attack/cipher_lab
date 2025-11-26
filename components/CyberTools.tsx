import React, { useState, useEffect } from 'react';
import { PenTool, ArrowRight, Hash, Code, Copy, Check, Key, Network } from 'lucide-react';

const CyberTools: React.FC = () => {
  const [input, setInput] = useState('');
  const [base64, setBase64] = useState('');
  const [hex, setHex] = useState('');
  const [binary, setBinary] = useState('');
  const [copied, setCopied] = useState('');
  
  // NEW: Password Gen
  const [genPass, setGenPass] = useState('');
  
  // NEW: IP Calc
  const [ipInput, setIpInput] = useState('192.168.1.1/24');
  const [ipInfo, setIpInfo] = useState('');

  useEffect(() => {
    if (!input) {
        setBase64(''); setHex(''); setBinary('');
        return;
    }
    try { setBase64(btoa(input)); } catch { setBase64('Error'); }
    let h = '';
    for(let i=0; i<input.length; i++) h += input.charCodeAt(i).toString(16).padStart(2, '0');
    setHex(h);
    let b = '';
    for(let i=0; i<input.length; i++) b += input.charCodeAt(i).toString(2).padStart(8, '0') + ' ';
    setBinary(b);
  }, [input]);

  const copyToClipboard = (text: string, id: string) => {
      navigator.clipboard.writeText(text);
      setCopied(id);
      setTimeout(() => setCopied(''), 2000);
  };

  const generatePassword = () => {
      const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
      let pass = "";
      for (let i = 0; i < 16; i++) {
          pass += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      setGenPass(pass);
  };

  const calcSubnet = () => {
      // Very basic mock calculation for demo
      if (ipInput.endsWith('/24')) setIpInfo("Hosts: 254 | Mask: 255.255.255.0");
      else if (ipInput.endsWith('/16')) setIpInfo("Hosts: 65534 | Mask: 255.255.0.0");
      else setIpInfo("Calculated: Class C Network");
  };

  return (
    <div className="space-y-6 p-4">
      <div className="bg-cyber-800 p-4 rounded-lg border border-cyber-600">
        <h3 className="text-xl font-bold text-cyber-accent mb-2">Cipher Utility Belt</h3>
        <p className="text-cyber-subtext text-sm">Real-time encoding, password generation, and network tools.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <div className="space-y-4">
            <div className="bg-cyber-900 p-4 rounded border border-cyber-600">
                <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Input Text</label>
                <textarea 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="w-full bg-black border border-cyber-600 p-3 rounded text-white h-24 focus:border-cyber-accent outline-none font-mono"
                    placeholder="Type to encode..."
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="bg-cyber-800 p-3 rounded border border-cyber-600">
                    <div className="flex justify-between items-center mb-1">
                        <label className="text-xs font-bold text-blue-400">Base64</label>
                        <button onClick={() => copyToClipboard(base64, 'b64')}><Copy size={12}/></button>
                    </div>
                    <div className="font-mono text-xs break-all text-gray-300">{base64 || '...'}</div>
                </div>
                <div className="bg-cyber-800 p-3 rounded border border-cyber-600">
                    <div className="flex justify-between items-center mb-1">
                        <label className="text-xs font-bold text-yellow-400">Hex</label>
                        <button onClick={() => copyToClipboard(hex, 'hex')}><Copy size={12}/></button>
                    </div>
                    <div className="font-mono text-xs break-all text-gray-300">{hex || '...'}</div>
                </div>
            </div>
         </div>

         <div className="space-y-4">
             {/* Pass Gen */}
             <div className="bg-cyber-800 p-4 rounded border border-cyber-600">
                <div className="flex justify-between items-center mb-2">
                    <h4 className="font-bold flex items-center gap-2"><Key size={16}/> Password Gen</h4>
                    <button onClick={generatePassword} className="text-xs bg-cyber-accent text-black px-2 py-1 rounded font-bold">GENERATE</button>
                </div>
                <div className="bg-black p-3 rounded font-mono text-center text-lg tracking-widest text-green-400 border border-gray-700">
                    {genPass || 'CLICK_GENERATE'}
                </div>
             </div>

             {/* IP Calc */}
             <div className="bg-cyber-800 p-4 rounded border border-cyber-600">
                <div className="flex justify-between items-center mb-2">
                    <h4 className="font-bold flex items-center gap-2"><Network size={16}/> IP Subnet</h4>
                </div>
                <div className="flex gap-2">
                    <input value={ipInput} onChange={(e) => setIpInput(e.target.value)} className="bg-black border border-gray-600 rounded px-2 text-sm flex-1"/>
                    <button onClick={calcSubnet} className="bg-gray-700 text-white px-3 rounded text-xs">CALC</button>
                </div>
                <div className="mt-2 text-xs font-mono text-yellow-400">{ipInfo}</div>
             </div>
         </div>
      </div>
    </div>
  );
};

export default CyberTools;