import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Activity, ArrowRight, Monitor } from 'lucide-react';

type FileSystemType = {
  [key: string]: string | FileSystemType;
};

const initialFileSystem: FileSystemType = {
  home: {
    cipher: {
      lab: {
        'notes.txt': 'Remember to check for hidden files.',
        '.env': 'DB_PASSWORD=secret_root_pass\nAPI_KEY=12345-ABCDE', // Hidden file
        'exploit.py': 'import os\nprint("Exploiting...")',
        'server.log': 'User admin login failed.\nUser root login success.\nError: buffer overflow at 0x840040.',
      },
      downloads: {
        'malware.exe': '[BINARY DATA]'
      }
    }
  }
};

const TerminalSim: React.FC = () => {
  const [history, setHistory] = useState<string[]>([
    "CipherOS [Version 5.0.0 - ELITE KERNEL]",
    "Logged in as: root",
    "Type 'help' for commands.",
    ""
  ]);
  const [input, setInput] = useState('');
  const [currentPath, setCurrentPath] = useState<string[]>(['home', 'cipher', 'lab']);
  const [fileSystem, setFileSystem] = useState<FileSystemType>(initialFileSystem);
  const [topMode, setTopMode] = useState(false);
  const [matrixMode, setMatrixMode] = useState(false);
  const [theme, setTheme] = useState<'green' | 'amber' | 'blue'>('green');
  
  // History State
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  // Focus input on click anywhere
  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  const getDirFromPath = (path: string[], fs: FileSystemType): FileSystemType | null => {
    let current: any = fs;
    for (const dir of path) {
      if (current[dir] && typeof current[dir] === 'object') {
        current = current[dir];
      } else {
        return null;
      }
    }
    return current;
  };

  const getPathString = () => '/' + currentPath.join('/');

  const executeCommand = (cmdStr: string) => {
    if (!cmdStr.trim()) return;

    // Add to history state
    setCommandHistory(prev => [cmdStr, ...prev]);
    setHistoryIndex(-1);

    const promptLine = `root@cipher-lab:${getPathString()}$ ${cmdStr}`;
    setHistory(prev => [...prev, promptLine]);

    const [cmd, ...args] = cmdStr.trim().split(/\s+/);
    const arg = args[0];
    const currentDir = getDirFromPath(currentPath, fileSystem);
    
    if (!currentDir) return;

    let output = '';

    switch (cmd) {
      case 'help':
        output = `Available Commands:
  [Core]    ls, cd, cat, grep, chmod, clear, history
  [Network] ping, curl, ssh, whois, nmap
  [System]  top, neofetch, theme, alias
  [Tools]   python, matrix, hack, socials`;
        break;
      
      // 1. IMPROVED LS (Colors)
      case 'ls':
        const showHidden = arg === '-a';
        const content = Object.entries(currentDir)
          .filter(([name]) => showHidden || !name.startsWith('.'))
          .map(([name, item]) => {
             const isDir = typeof item === 'object';
             return isDir ? `<span class='text-blue-400 font-bold'>${name}/</span>` : `<span class='${theme === 'amber' ? 'text-yellow-200' : 'text-white'}'>${name}</span>`;
          });
        output = content.join('   ');
        break;

      // 2. SSH SIMULATION
      case 'ssh':
        if (!arg) output = "usage: ssh user@host";
        else {
           setHistory(prev => [...prev, `Connecting to ${arg}...`]);
           setTimeout(() => setHistory(prev => [...prev, `ssh: connect to host ${arg} port 22: Connection refused (Simulation)`]), 1000);
           return;
        }
        break;

      // 3. CURL SIMULATION
      case 'curl':
        if (!arg) output = "usage: curl [url]";
        else output = `&lt;!DOCTYPE html&gt;&lt;html&gt;&lt;head&gt;&lt;title&gt;${arg}&lt;/title&gt;... [200 OK]`;
        break;

      // 4. WHOIS
      case 'whois':
        if (!arg) output = "usage: whois [domain]";
        else output = `Domain Name: ${arg.toUpperCase()}
Registry Domain ID: 2394823_DOMAIN_COM-VRSN
Registrar: MarkMonitor Inc.
Creation Date: 1997-09-15
Expiry Date: 2028-09-14`;
        break;

      // 5. PYTHON INTERPRETER (Simple Math)
      case 'python':
      case 'python3':
        if (!arg) {
           output = `Python 3.8.10 (default, Mar 15 2022, 12:22:08)\nType "help", "copyright" for more information.`;
        } else {
           try {
             // Safe eval for math only
             // eslint-disable-next-line no-eval
             const result = eval(args.join(' '));
             output = String(result);
           } catch {
             output = `Traceback (most recent call last):\n  File "<stdin>", line 1, in <module>\nNameError: name '${arg}' is not defined`;
           }
        }
        break;

      // 6. MATRIX EFFECT
      case 'matrix':
        setMatrixMode(true);
        return;

      // 7. NEOFETCH
      case 'neofetch':
        output = `
       ${theme === 'amber' ? 'text-yellow-500' : 'text-green-500'}       
      .-------.    root@cipher-lab
      |  |>   |    ---------------
      |  <|   |    OS: CipherOS Linux
      |       |    Kernel: 5.4.0-elite
      |       |    Uptime: 42 days, 6 hours
      '-------'    Shell: bash 5.0.17
                   CPU: Virtual Quantum Core (128)
                   Memory: 1024TB / 2048TB
`;
        break;

      // 8. THEME SWITCHER
      case 'theme':
        if (arg === 'amber') setTheme('amber');
        else if (arg === 'blue') setTheme('blue');
        else setTheme('green');
        output = `Theme changed to ${arg || 'green'}`;
        break;

      // 9. FAKE HACK SCENARIO
      case 'hack':
        setHistory(prev => [...prev, "Initiating brute force on Pentagon firewall..."]);
        let step = 0;
        const hackInterval = setInterval(() => {
           step++;
           if (step === 1) setHistory(prev => [...prev, "Bypassing Proxy [10.2.2.1]... SUCCESS"]);
           if (step === 2) setHistory(prev => [...prev, "Injecting Payload... SUCCESS"]);
           if (step === 3) setHistory(prev => [...prev, "Downloading Confidential Data... [||||||||||] 100%"]);
           if (step === 4) {
             setHistory(prev => [...prev, "ACCESS GRANTED. Welcome, Admin."]);
             clearInterval(hackInterval);
           }
        }, 800);
        return;

      // 10. HISTORY LIST
      case 'history':
        output = commandHistory.map((c, i) => `${commandHistory.length - i}  ${c}`).reverse().join('\n');
        break;

      case 'grep':
        const searchStr = args[0];
        const fileName = args[1];
        if (!searchStr || !fileName) output = "usage: grep [string] [file]";
        else if (currentDir[fileName] && typeof currentDir[fileName] === 'string') {
          const fileContent = currentDir[fileName] as string;
          const lines = fileContent.split('\n').filter(l => l.includes(searchStr));
          output = lines.map(l => l.replace(searchStr, `<span class='text-red-500 font-bold'>${searchStr}</span>`)).join('\n');
          if (!output) output = ""; 
        } else {
          output = `grep: ${fileName}: No such file`;
        }
        break;
      case 'chmod':
        if (!arg) output = "usage: chmod [permissions] [file]";
        else output = `Changed mode of ${args[1] || 'file'} to ${args[0]}`;
        break;
      case 'top':
        setTopMode(true);
        return;
      case 'cd':
        if (!arg) setCurrentPath(['home', 'cipher']);
        else if (arg === '..') { if (currentPath.length > 0) setCurrentPath(prev => prev.slice(0, -1)); }
        else if (arg === '/') setCurrentPath([]);
        else if (currentDir[arg] && typeof currentDir[arg] === 'object') setCurrentPath(prev => [...prev, arg]);
        else output = `bash: cd: ${arg}: No such file`;
        break;
      case 'cat':
        if (currentDir[arg] && typeof currentDir[arg] === 'string') output = currentDir[arg] as string;
        else output = `cat: ${arg}: No such file`;
        break;
      case 'socials':
      case 'connect':
        output = `<div class="p-2 border border-cyber-accent rounded bg-cyber-900/50">... [Cipher Links] ...</div>`;
        break;
      case 'ping':
        if (!arg) { output = "usage: ping [host]"; break; }
        setHistory(prev => [...prev, promptLine, `PING ${arg} (${arg}) 56(84) bytes of data.`]);
        let pingCount = 0;
        const pingInt = setInterval(() => {
          pingCount++;
          setHistory(prev => [...prev, `64 bytes from ${arg}: icmp_seq=${pingCount} ttl=118 time=${(Math.random()*20 + 10).toFixed(1)} ms`]);
          if (pingCount >= 4) {
             clearInterval(pingInt);
             setHistory(prev => [...prev, `--- ${arg} ping statistics ---`, `4 packets transmitted, 4 received, 0% packet loss`]);
          }
        }, 800);
        return;
      case 'clear': setHistory([]); return;
      default: output = `bash: ${cmd}: command not found`;
    }

    if (output) setHistory(prev => [...prev, output]);
  };

  // Handle Tab Autocomplete and History Navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      executeCommand(input);
      setInput('');
    } else if (e.key === 'Tab') {
      e.preventDefault();
      // Simple autocomplete
      const [cmd, arg] = input.split(' ');
      if (cmd === 'cd' || cmd === 'cat' || cmd === 'ls') {
         const currentDir = getDirFromPath(currentPath, fileSystem);
         if (currentDir) {
           const match = Object.keys(currentDir).find(f => f.startsWith(arg || ''));
           if (match) setInput(`${cmd} ${match}`);
         }
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = Math.min(historyIndex + 1, commandHistory.length - 1);
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      } else {
        setHistoryIndex(-1);
        setInput('');
      }
    }
  };

  // Matrix Effect
  if (matrixMode) {
     return (
       <div className="fixed inset-0 bg-black z-50 overflow-hidden font-mono" onClick={() => setMatrixMode(false)}>
          {Array(20).fill(0).map((_, i) => (
             <div key={i} className="absolute top-0 text-green-500 text-opacity-80 animate-fall" style={{
                left: `${i * 5}%`, 
                animationDuration: `${Math.random() * 2 + 1}s`,
                fontSize: '20px',
                writingMode: 'vertical-rl'
             }}>
                {Array(30).fill(0).map(() => String.fromCharCode(0x30A0 + Math.random() * 96)).join('')}
             </div>
          ))}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black p-4 border border-green-500 text-green-500">
             SYSTEM COMPROMISED. CLICK TO REBOOT.
          </div>
       </div>
     );
  }

  // Top Mode
  if (topMode) {
    return (
      <div className="bg-black text-green-400 p-4 font-mono text-xs h-full w-full absolute inset-0 z-50 overflow-hidden">
        <div>top - 14:02:55 up 10 days, 3 users, load average: 0.10, 0.22, 0.35</div>
        <div>Tasks: 120 total, 1 running, 119 sleeping, 0 stopped, 0 zombie</div>
        <div className="mb-4">%Cpu(s): 2.5 us, 1.0 sy, 0.0 ni, 96.5 id, 0.0 wa, 0.0 hi, 0.0 si</div>
        <table className="w-full text-left">
          <thead>
            <tr className="bg-white text-black">
              <th>PID</th><th>USER</th><th>PR</th><th>NI</th><th>VIRT</th><th>RES</th><th>SHR</th><th>S</th><th>%CPU</th><th>%MEM</th><th>COMMAND</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>1203</td><td>root</td><td>20</td><td>0</td><td>12.5g</td><td>4024</td><td>3020</td><td>R</td><td>5.3</td><td>0.1</td><td>bash</td></tr>
            <tr><td>1</td><td>root</td><td>20</td><td>0</td><td>224m</td><td>8900</td><td>6500</td><td>S</td><td>0.0</td><td>0.1</td><td>systemd</td></tr>
            <tr><td>442</td><td>cipher</td><td>20</td><td>0</td><td>1.2g</td><td>120m</td><td>40m</td><td>S</td><td>0.0</td><td>2.4</td><td>node</td></tr>
          </tbody>
        </table>
        <div className="mt-8 text-white font-bold">Press 'q' to quit process monitor</div>
        <input autoFocus className="opacity-0 absolute" onChange={(e) => { if(e.target.value === 'q') setTopMode(false); }} />
      </div>
    );
  }

  const getThemeColors = () => {
    switch(theme) {
      case 'amber': return 'text-yellow-500';
      case 'blue': return 'text-blue-400';
      default: return 'text-green-500';
    }
  };

  return (
    <div className="space-y-6 h-full flex flex-col relative" onClick={handleContainerClick}>
      <div className="bg-cyber-800 p-4 rounded-lg border border-cyber-600">
        <h3 className="text-xl font-bold text-cyber-accent mb-2">Terminal (Version 5.0)</h3>
        <p className="text-cyber-subtext text-sm">
          Features: <code className="text-white">ssh</code>, <code className="text-white">curl</code>, <code className="text-white">whois</code>, <code className="text-white">python</code>, <code className="text-white">matrix</code>, <code className="text-white">hack</code>. <br/>
          Try <code className="text-white">theme blue</code> or <code className="text-white">theme amber</code>.
        </p>
      </div>

      <div 
        className={`flex-1 bg-[#0d0d0d] rounded-lg border border-cyber-600 p-4 font-mono text-sm shadow-2xl flex flex-col min-h-[400px] cursor-text overflow-hidden ${getThemeColors()}`}
      >
        <div className="flex-1 overflow-y-auto space-y-1 mb-2 scrollbar-hide">
          {history.map((line, i) => (
            <div key={i} className="whitespace-pre-wrap break-all" dangerouslySetInnerHTML={{__html: line}} />
          ))}
          <div className="flex items-center break-all">
            <span className="mr-2 flex-shrink-0 font-bold">root@cipher-lab:<span className="text-blue-400">{getPathString()}</span>$</span>
            <input 
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className={`flex-1 bg-transparent border-none outline-none focus:ring-0 font-mono p-0 ${getThemeColors()}`}
              autoFocus
              autoComplete="off"
            />
          </div>
          <div ref={bottomRef} />
        </div>
      </div>
    </div>
  );
};

export default TerminalSim;