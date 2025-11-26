import React, { useState, useEffect } from 'react';
import { Layers, ArrowDown, AlertTriangle, RefreshCcw, Shield, Cpu, Binary, Code } from 'lucide-react';

const BufferOverflowSim: React.FC = () => {
  const [input, setInput] = useState('');
  const [stack, setStack] = useState<string[]>(Array(12).fill('00')); // Expanded Stack
  const [eip, setEip] = useState('0x8048324'); // Instruction Pointer
  const [esp, setEsp] = useState('0xBFFFFF00'); // Stack Pointer
  const [status, setStatus] = useState('NORMAL');
  
  // Advanced Features State
  const [aslr, setAslr] = useState(false);
  const [canary, setCanary] = useState(false);
  const [dep, setDep] = useState(false);
  const [showHex, setShowHex] = useState(false);
  const [shellcodeActive, setShellcodeActive] = useState(false);

  const BUFFER_SIZE = 8;
  const CANARY_VAL = "000D0A00"; // Null terminated canary simulation

  useEffect(() => {
    // Simulate ASLR changing addresses
    if (aslr) {
      const randomBase = Math.floor(Math.random() * 1000000).toString(16);
      setEsp(`0x${randomBase}00`);
    } else {
      setEsp('0xBFFFFF00');
    }
  }, [aslr]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInput(val);
    setShellcodeActive(val.includes('\\x90')); // Detect NOP sled

    // Simulate Stack Fill
    const newStack = Array(12).fill('00');
    
    // Inject Canary at index 8 if enabled
    if (canary) newStack[8] = "CANARY"; 

    for (let i = 0; i < val.length; i++) {
      // Map char to hex
      const hex = val.charCodeAt(i).toString(16).toUpperCase().padStart(2, '0');
      
      if (i < 12) {
        newStack[i] = hex;
      }
    }
    
    // Canary Check Logic
    if (canary && val.length > 8) {
       // If we wrote past buffer (8), we overwrote canary
       newStack[8] = "CORRUPT"; 
       setStatus('STACK SMASHING DETECTED (Canary Died)');
       setEip('HALTED');
       setStack(newStack);
       return;
    }

    setStack(newStack);

    // Overflow Logic (Return Address is at index 10-11 in this simplified view)
    if (val.length > 10) {
      if (dep) {
         setStatus('DEP PREVENTED EXECUTION');
         setEip('BLOCKED');
      } else {
         setEip('0x41414141 (CRASH)');
         setStatus('SEGMENTATION FAULT');
      }
    } else {
      setEip(aslr ? `0x${(Math.floor(Math.random()*100)+8048000).toString(16)}` : '0x8048324');
      setStatus('NORMAL');
    }
  };

  const insertShellcode = () => {
    setInput(input + "\\x90\\x90\\x90\\x90\\xCC\\xCC"); // NOPs + Int3
  };

  return (
    <div className="space-y-6 p-4">
      <div className="bg-cyber-800 p-4 rounded-lg border border-cyber-600">
        <h3 className="text-xl font-bold text-cyber-accent mb-2">Buffer Overflow (Stack Smashing)</h3>
        <p className="text-cyber-subtext text-sm">
          Advanced visualization of Memory Stack, Registers, and Protections (ASLR, Canary, DEP).
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <button onClick={() => setAslr(!aslr)} className={`px-3 py-1 rounded text-xs font-bold border ${aslr ? 'bg-green-600 border-green-400 text-white' : 'bg-gray-800 border-gray-600 text-gray-400'}`}>
          ASLR: {aslr ? 'ON' : 'OFF'}
        </button>
        <button onClick={() => setCanary(!canary)} className={`px-3 py-1 rounded text-xs font-bold border ${canary ? 'bg-green-600 border-green-400 text-white' : 'bg-gray-800 border-gray-600 text-gray-400'}`}>
          Stack Canary: {canary ? 'ON' : 'OFF'}
        </button>
        <button onClick={() => setDep(!dep)} className={`px-3 py-1 rounded text-xs font-bold border ${dep ? 'bg-green-600 border-green-400 text-white' : 'bg-gray-800 border-gray-600 text-gray-400'}`}>
          DEP (NX Bit): {dep ? 'ON' : 'OFF'}
        </button>
        <button onClick={() => setShowHex(!showHex)} className="px-3 py-1 rounded text-xs font-bold bg-blue-600 text-white flex items-center gap-1">
          <Binary size={12}/> Hex Dump
        </button>
        <button onClick={insertShellcode} className="px-3 py-1 rounded text-xs font-bold bg-red-600 text-white flex items-center gap-1">
          <Code size={12}/> Inject Shellcode
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT: INPUT & REGISTERS */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-cyber-900 border border-cyber-600 p-4 rounded">
            <label className="text-xs font-bold text-gray-500 uppercase">Payload Input</label>
            <input 
              value={input}
              onChange={handleInput}
              className="w-full bg-black border border-gray-700 p-2 rounded text-white font-mono mt-2"
              placeholder="Type or inject..."
            />
            <div className="flex justify-between mt-1 text-xs">
               <span className="text-gray-500">{input.length} bytes written</span>
               <span className={input.length > BUFFER_SIZE ? 'text-red-500 font-bold' : 'text-green-500'}>
                 Buffer Limit: {BUFFER_SIZE}
               </span>
            </div>
          </div>
          
          <div className={`p-4 rounded border-l-4 transition-colors ${status === 'NORMAL' ? 'bg-green-900/20 border-green-500' : 'bg-red-900/20 border-red-500'}`}>
            <div className="font-bold flex items-center gap-2">
               {status === 'NORMAL' ? <Shield size={16}/> : <AlertTriangle size={16}/>}
               {status}
            </div>
          </div>

          {/* CPU REGISTERS */}
          <div className="bg-black border border-gray-700 p-4 rounded font-mono text-sm">
             <div className="text-gray-500 text-xs font-bold mb-2 flex items-center gap-2"><Cpu size={14}/> CPU REGISTERS (x86)</div>
             <div className="grid grid-cols-2 gap-2">
                <div className="flex justify-between border-b border-gray-800 pb-1">
                   <span className="text-blue-400">EIP</span>
                   <span className={status === 'NORMAL' ? 'text-white' : 'text-red-500 font-bold animate-pulse'}>{eip}</span>
                </div>
                <div className="flex justify-between border-b border-gray-800 pb-1">
                   <span className="text-yellow-400">ESP</span>
                   <span className="text-white">{esp}</span>
                </div>
                <div className="flex justify-between border-b border-gray-800 pb-1">
                   <span className="text-purple-400">EBP</span>
                   <span className="text-white">0xBFFFFF08</span>
                </div>
                <div className="flex justify-between border-b border-gray-800 pb-1">
                   <span className="text-gray-400">EAX</span>
                   <span className="text-white">0x00000000</span>
                </div>
             </div>
          </div>
        </div>

        {/* CENTER: STACK VISUALIZATION */}
        <div className="lg:col-span-4 bg-black border border-gray-700 p-6 rounded flex flex-col items-center font-mono relative">
          <h4 className="text-gray-500 text-xs font-bold mb-4 uppercase">System Stack Memory</h4>
          
          <div className="w-full max-w-[200px] bg-gray-800 p-2 text-center text-xs text-gray-500 rounded-t border-b border-gray-600">High Memory (0xFF..)</div>
          
          {/* RETURN ADDRESS */}
          <div className={`w-full max-w-[200px] p-3 text-center border-2 transition-all my-1 relative ${status === 'NORMAL' ? 'border-blue-500 bg-blue-900/20 text-blue-200' : 'border-red-500 bg-red-600 text-white font-black'}`}>
            <span className="absolute left-[-40px] top-3 text-[10px] text-gray-500">RET</span>
            {status === 'NORMAL' ? stack[10] || '??' : '41'} {status === 'NORMAL' ? stack[11] || '??' : '41'}
          </div>
          
          {/* SAVED EBP */}
          <div className="w-full max-w-[200px] p-2 text-center border-x border-gray-700 bg-gray-900 text-gray-400 text-xs my-1 relative">
             <span className="absolute left-[-40px] top-2 text-[10px] text-gray-500">EBP</span>
             Saved Frame Ptr
          </div>

          {/* CANARY */}
          {canary && (
             <div className={`w-full max-w-[200px] p-1 text-center border border-dashed my-1 text-xs font-bold relative ${stack[8] === 'CORRUPT' ? 'bg-red-500 text-white border-red-500 animate-ping' : 'bg-yellow-900/30 text-yellow-500 border-yellow-500'}`}>
                <span className="absolute left-[-50px] top-1 text-[10px] text-yellow-500">CANARY</span>
                {stack[8] === 'CORRUPT' ? 'DEADBEEF' : CANARY_VAL}
             </div>
          )}

          {/* BUFFER */}
          <div className="w-full max-w-[200px] border-2 border-green-500/50 bg-green-900/10 p-2 space-y-1 relative">
             <span className="absolute left-[-50px] top-10 text-[10px] text-green-500">BUFFER</span>
             <div className="text-[10px] text-green-500 text-center mb-1">char buffer[8]</div>
             <div className="grid grid-cols-4 gap-1">
               {stack.slice(0, 8).map((byte, i) => (
                 <div key={i} className={`bg-black text-center text-xs border py-1 ${shellcodeActive && byte === '90' ? 'border-pink-500 text-pink-400' : 'border-green-900 text-green-300'}`}>
                   {byte}
                 </div>
               ))}
             </div>
          </div>
          
          <div className="w-full max-w-[200px] bg-gray-800 p-2 text-center text-xs text-gray-500 rounded-b border-t border-gray-600">Low Memory (0x00..)</div>
          <ArrowDown className="mt-2 text-gray-600" />
        </div>

        {/* RIGHT: HEX DUMP */}
        {showHex && (
            <div className="lg:col-span-4 bg-[#0d0d0d] border border-gray-600 p-4 rounded font-mono text-xs h-full">
                <div className="text-cyber-accent mb-2 border-b border-gray-800 pb-1">LIVE MEMORY DUMP</div>
                <div className="grid grid-cols-4 gap-x-4 text-gray-500 mb-2">
                    <span>ADDR</span>
                    <span className="col-span-2">HEX</span>
                    <span>ASCII</span>
                </div>
                {Array(4).fill(0).map((_, row) => (
                    <div key={row} className="grid grid-cols-4 gap-x-4 mb-1 hover:bg-white/5 p-1 rounded">
                        <span className="text-blue-400">0x08048{row}0</span>
                        <span className="col-span-2 text-gray-300">
                             {Array(4).fill(0).map((_, col) => stack[row*4 + col] || '00').join(' ')}
                        </span>
                        <span className="text-yellow-600">
                            {Array(4).fill(0).map((_, col) => {
                                const h = stack[row*4 + col];
                                if(!h || h === '00') return '.';
                                return String.fromCharCode(parseInt(h, 16)).replace(/[^\x20-\x7E]/g, '.');
                            }).join('')}
                        </span>
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
};

export default BufferOverflowSim;