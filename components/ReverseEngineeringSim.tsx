import React, { useState, useEffect } from 'react';
import { Cpu, Lock, Unlock, ArrowRight, Play, SkipForward, Search, FileCode, Binary, Database, RefreshCcw } from 'lucide-react';

const ReverseEngineeringSim: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'ASM' | 'HEX' | 'STRINGS' | 'DECOMPILE'>('ASM');
  const [ip, setIp] = useState(0); // Instruction Pointer (Index)
  const [registers, setRegisters] = useState({ EAX: '00000000', EBX: '00000000', ZF: 0 }); // Registers
  const [patched, setPatched] = useState(false);
  const [status, setStatus] = useState('RUNNING');
  const [userInput, setUserInput] = useState('');
  
  // The Program Logic
  const instructions = [
    { addr: '0x401000', opcode: 'MOV EAX, [INPUT]', desc: 'Load user input to EAX' },
    { addr: '0x401005', opcode: 'CMP EAX, 0x1337', desc: 'Compare input with 1337 (Decimal: 4919)' },
    { addr: '0x40100A', opcode: patched ? 'JMP 0x40101F' : 'JNE 0x401015', desc: patched ? 'Jump Always (BYPASS)' : 'Jump if Not Equal (Check)' },
    { addr: '0x40100C', opcode: 'MOV EAX, 0x0', desc: 'Set Success Flag = 0 (Fail)' },
    { addr: '0x401011', opcode: 'JMP 0x401024', desc: 'Jump to Exit' },
    { addr: '0x401015', opcode: 'MOV EAX, 0x0', desc: 'Logic Block (Failed Branch)' },
    { addr: '0x40101F', opcode: 'MOV EAX, 0x1', desc: 'Set Success Flag = 1 (Win)' },
    { addr: '0x401024', opcode: 'RET', desc: 'Return / Exit' }
  ];

  const resetDebugger = () => {
      setIp(0);
      setRegisters({ EAX: '00000000', EBX: '00000000', ZF: 0 });
      setStatus('RUNNING');
  };

  const stepDebugger = () => {
      if (ip >= instructions.length) return;
      
      const currentInst = instructions[ip];
      
      // LOGIC SIMULATION
      if (currentInst.opcode.includes('MOV EAX, [INPUT]')) {
          const val = parseInt(userInput) || 0;
          setRegisters(prev => ({ ...prev, EAX: val.toString(16).toUpperCase().padStart(8, '0') }));
          setIp(ip + 1);
      } 
      else if (currentInst.opcode.includes('CMP')) {
          const inputVal = parseInt(registers.EAX, 16);
          const secret = 4919; // 0x1337
          setRegisters(prev => ({ ...prev, ZF: inputVal === secret ? 1 : 0 }));
          setIp(ip + 1);
      }
      else if (currentInst.opcode.startsWith('JNE')) {
          if (registers.ZF === 0) { // Not Equal
              setIp(5); // Jump to Fail branch (index 5 approx logic)
          } else {
              setIp(ip + 1); // Fall through
          }
      }
      else if (currentInst.opcode.startsWith('JMP')) {
          if (currentInst.opcode.includes('0x40101F')) setIp(6); // Jump to Win
          else setIp(7); // Jump to Exit
      }
      else if (currentInst.opcode.includes('MOV EAX, 0x1')) {
           setStatus('ACCESS GRANTED');
           setIp(ip + 1);
      }
      else if (currentInst.opcode.includes('MOV EAX, 0x0')) {
           setStatus('ACCESS DENIED');
           setIp(ip + 1);
      }
      else {
          setIp(ip + 1);
      }
  };

  return (
    <div className="space-y-6 p-4">
      <div className="bg-cyber-800 p-4 rounded-lg border border-cyber-600">
        <h3 className="text-xl font-bold text-cyber-accent mb-2">Advanced Reverse Engineering (GDB Sim)</h3>
        <p className="text-cyber-subtext text-sm">
          Debug assembly code, inspect registers, patch binaries (Hex Editing), and analyze strings to crack the software.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[500px]">
        
        {/* LEFT: TOOLS PANEL */}
        <div className="lg:col-span-8 bg-[#1e1e1e] border border-cyber-600 rounded-lg flex flex-col overflow-hidden">
            {/* TABS */}
            <div className="flex border-b border-gray-700 bg-[#252526]">
                <button onClick={() => setActiveTab('ASM')} className={`px-4 py-2 text-xs font-bold flex items-center gap-2 ${activeTab === 'ASM' ? 'bg-[#1e1e1e] text-blue-400 border-t-2 border-blue-400' : 'text-gray-500'}`}>
                    <Cpu size={14}/> DISASSEMBLY
                </button>
                <button onClick={() => setActiveTab('HEX')} className={`px-4 py-2 text-xs font-bold flex items-center gap-2 ${activeTab === 'HEX' ? 'bg-[#1e1e1e] text-yellow-400 border-t-2 border-yellow-400' : 'text-gray-500'}`}>
                    <Binary size={14}/> HEX EDITOR
                </button>
                <button onClick={() => setActiveTab('STRINGS')} className={`px-4 py-2 text-xs font-bold flex items-center gap-2 ${activeTab === 'STRINGS' ? 'bg-[#1e1e1e] text-green-400 border-t-2 border-green-400' : 'text-gray-500'}`}>
                    <Search size={14}/> STRINGS
                </button>
                <button onClick={() => setActiveTab('DECOMPILE')} className={`px-4 py-2 text-xs font-bold flex items-center gap-2 ${activeTab === 'DECOMPILE' ? 'bg-[#1e1e1e] text-purple-400 border-t-2 border-purple-400' : 'text-gray-500'}`}>
                    <FileCode size={14}/> DECOMPILER
                </button>
            </div>

            {/* CONTENT AREA */}
            <div className="flex-1 p-4 font-mono text-sm overflow-y-auto custom-scrollbar">
                
                {/* ASM VIEW */}
                {activeTab === 'ASM' && (
                    <div className="space-y-1">
                        {instructions.map((inst, i) => (
                            <div key={i} className={`grid grid-cols-12 gap-4 px-2 py-1 rounded cursor-pointer ${ip === i ? 'bg-blue-900/30 border border-blue-500/50' : 'hover:bg-white/5'}`}>
                                <div className="col-span-1 text-gray-400">{ip === i && <ArrowRight size={14} className="text-yellow-500 inline"/>}</div>
                                <div className="col-span-2 text-blue-400">{inst.addr}</div>
                                <div className="col-span-4 text-gray-200 font-bold">{inst.opcode}</div>
                                <div className="col-span-5 text-gray-500 italic">; {inst.desc}</div>
                                {inst.opcode.startsWith('J') && (
                                    <button 
                                      className="absolute right-4 text-[10px] bg-gray-700 px-2 rounded hover:bg-yellow-600 text-white"
                                      onClick={() => setPatched(!patched)}
                                    >
                                        PATCH
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* HEX VIEW */}
                {activeTab === 'HEX' && (
                    <div className="text-gray-400">
                        <div className="mb-2 text-yellow-500 font-bold">Offset      00 01 02 03 04 05 06 07  ASCII</div>
                        {Array(8).fill(0).map((_, r) => (
                            <div key={r} className="grid grid-cols-12 hover:bg-white/5">
                                <div className="col-span-2 text-blue-400">000000{r}0</div>
                                <div className="col-span-6 tracking-widest text-gray-300">
                                    {r === 0 ? '4D 5A 90 00 03 00 00 00' : '00 00 00 00 00 00 00 00'}
                                </div>
                                <div className="col-span-4 border-l border-gray-700 pl-2 text-gray-600">
                                    {r === 0 ? 'MZ......' : '........'}
                                </div>
                            </div>
                        ))}
                        {/* PATCH BYTE */}
                        <div className="grid grid-cols-12 bg-yellow-900/10 border border-yellow-600/30 mt-2">
                            <div className="col-span-2 text-blue-400">000000A0</div>
                            <div className="col-span-6 tracking-widest text-gray-300">
                                {patched ? <span className="text-green-500 font-bold">EB</span> : <span className="text-red-500 font-bold">75</span>} 0C B8 01 00 00 00 90
                            </div>
                            <div className="col-span-4 border-l border-gray-700 pl-2 text-gray-600">
                                .L......
                            </div>
                        </div>
                    </div>
                )}

                {/* STRINGS VIEW */}
                {activeTab === 'STRINGS' && (
                    <div className="space-y-2 text-gray-300">
                        <div className="p-1 hover:bg-white/5 border-b border-gray-800">.text:00403010 "Enter Password:"</div>
                        <div className="p-1 hover:bg-white/5 border-b border-gray-800">.text:00403024 "Access Denied"</div>
                        <div className="p-1 hover:bg-white/5 border-b border-gray-800">.text:00403038 "Access Granted"</div>
                        <div className="p-1 bg-green-900/20 text-green-400 border border-green-600/50 font-bold cursor-pointer">
                            .data:00405000 "1337" (POSSIBLE SECRET)
                        </div>
                        <div className="p-1 hover:bg-white/5 border-b border-gray-800">.rdata:00406000 "KERNEL32.DLL"</div>
                    </div>
                )}

                {/* DECOMPILE VIEW */}
                {activeTab === 'DECOMPILE' && (
                    <div className="text-gray-300">
                        <div className="text-purple-400">bool check_license(int input) {'{'}</div>
                        <div className="pl-4">
                            <span className="text-blue-400">int</span> secret = <span className="text-green-400">0x1337</span>;
                        </div>
                        <div className="pl-4">
                            <span className="text-yellow-400">if</span> (input {patched ? '==' : '!='} secret) {'{'}
                        </div>
                        <div className="pl-8 text-gray-500">// {patched ? 'Logic patched to always succeed' : 'Original Logic'}</div>
                        <div className="pl-8">
                             return <span className="text-red-400">false</span>;
                        </div>
                        <div className="pl-4">{'}'}</div>
                        <div className="pl-4">
                             return <span className="text-green-400">true</span>;
                        </div>
                        <div>{'}'}</div>
                    </div>
                )}
            </div>
        </div>

        {/* RIGHT: REGISTERS & CONTROL */}
        <div className="lg:col-span-4 flex flex-col gap-4">
            
            {/* CONTROL PANEL */}
            <div className="bg-cyber-900 border border-cyber-600 rounded p-4">
                <div className="text-xs font-bold text-gray-500 uppercase mb-2">Debugger Control</div>
                <div className="flex gap-2 mb-4">
                    <button onClick={stepDebugger} className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-2 rounded font-bold flex items-center justify-center gap-2">
                        <SkipForward size={16}/> STEP INTO
                    </button>
                    <button onClick={resetDebugger} className="px-3 bg-gray-700 hover:bg-gray-600 text-white rounded">
                        <RefreshCcw size={16}/>
                    </button>
                </div>
                
                <div className="mb-2">
                    <label className="text-xs text-gray-500 uppercase">Input Value (Decimal)</label>
                    <input 
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      placeholder="e.g. 1234"
                      className="w-full bg-black border border-gray-600 rounded p-2 text-white"
                    />
                </div>
                <div className={`p-2 rounded text-center font-bold border ${status.includes('GRANTED') ? 'bg-green-600 text-white border-green-400' : 'bg-gray-800 text-gray-400 border-gray-600'}`}>
                    STATUS: {status}
                </div>
            </div>

            {/* REGISTERS */}
            <div className="bg-black border border-gray-700 rounded p-4 font-mono text-sm flex-1">
                <div className="text-xs font-bold text-gray-500 uppercase mb-4 border-b border-gray-800 pb-2">CPU Registers (x86)</div>
                
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <div className="text-blue-500 text-xs">EAX</div>
                        <div className="text-white text-lg">{registers.EAX}</div>
                    </div>
                    <div>
                        <div className="text-purple-500 text-xs">EBX</div>
                        <div className="text-white text-lg">{registers.EBX}</div>
                    </div>
                    <div>
                        <div className="text-yellow-500 text-xs">EIP (Inst Ptr)</div>
                        <div className="text-white text-lg">{instructions[ip]?.addr || 'END'}</div>
                    </div>
                    <div>
                        <div className="text-red-500 text-xs">ZF (Zero Flag)</div>
                        <div className={`text-lg font-bold ${registers.ZF ? 'text-green-500' : 'text-red-500'}`}>{registers.ZF}</div>
                    </div>
                </div>

                <div className="mt-6">
                    <div className="text-xs text-gray-500 mb-1">Stack Preview</div>
                    <div className="space-y-1 text-xs text-gray-400">
                        <div className="border-b border-gray-800 pb-1">0019FFCC   76341255</div>
                        <div className="border-b border-gray-800 pb-1">0019FFD0   00000000</div>
                        <div className="border-b border-gray-800 pb-1">0019FFD4   00401000</div>
                    </div>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default ReverseEngineeringSim;