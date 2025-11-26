import React, { useState, useEffect } from 'react';
import { Keyboard, Laptop, ArrowRight, FileText, Clipboard, Camera, Eye, Cpu, Save, Video, AlertTriangle } from 'lucide-react';

const KeyloggerSim: React.FC = () => {
  const [typedText, setTypedText] = useState('');
  const [capturedLogs, setCapturedLogs] = useState<string[]>([]);
  const [screenshots, setScreenshots] = useState<number[]>([]);
  const [clipboard, setClipboard] = useState('');
  const [activeWindow, setActiveWindow] = useState('chrome.exe - Bank of America');
  const [webcamActive, setWebcamActive] = useState(false);

  // Simulation Logic
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate random window changes
      if (Math.random() > 0.8) {
          const apps = ['notepad.exe', 'chrome.exe - Gmail', 'vlc.exe', 'explorer.exe'];
          const app = apps[Math.floor(Math.random() * apps.length)];
          setActiveWindow(app);
          setCapturedLogs(prev => [`[SYSTEM] Active Window Changed: ${app}`, ...prev]);
      }

      // Simulate Periodic Screenshots
      if (Math.random() > 0.9) {
          setScreenshots(prev => [Date.now(), ...prev].slice(0, 4));
          setCapturedLogs(prev => [`[SPYWARE] Screenshot Captured & Uploaded (340KB)`, ...prev]);
      }

      // Simulate Clipboard
      if (Math.random() > 0.85) {
          const clips = ['password123', '0x1A2b3C... (Bitcoin Wallet)', 'Meeting at 5pm', 'ssn: 123-45-678'];
          const clip = clips[Math.floor(Math.random() * clips.length)];
          setClipboard(clip);
          setCapturedLogs(prev => [`[CLIPBOARD] Stolen: "${clip}"`, ...prev]);
      }

    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const key = e.key;
    const time = new Date().toLocaleTimeString();
    
    // Keyword Trigger
    if (typedText.toLowerCase().includes('bank') || typedText.toLowerCase().includes('pass')) {
       setCapturedLogs(prev => [`[ALERT] TRIGGER KEYWORD DETECTED IN INPUT!`, ...prev]);
    }

    setCapturedLogs(prev => [`[${time}] KEY_PRESS: "${key}" (Win: ${activeWindow.split(' ')[0]})`, ...prev].slice(0, 15));
  };

  return (
    <div className="space-y-6 p-4">
      <div className="bg-cyber-800 p-4 rounded-lg border border-cyber-600">
        <h3 className="text-xl font-bold text-cyber-accent mb-2">Advanced Keylogger (Spyware Suite)</h3>
        <p className="text-cyber-subtext text-sm">
          Demonstrates total system surveillance: Keystrokes, Clipboard, Screenshots, Webcam, and Process monitoring.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* VICTIM'S VIEW */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-white font-bold bg-blue-900/30 p-2 rounded border border-blue-500/30">
            <span className="flex items-center gap-2"><Laptop size={20} className="text-blue-400" /> VICTIM PC (Infected)</span>
            <span className="text-xs font-mono text-gray-400">{activeWindow}</span>
          </div>
          
          <div className="bg-gray-100 p-6 rounded-lg shadow-xl text-black relative overflow-hidden">
            {/* Webcam Indicator */}
            <div className={`absolute top-2 right-2 flex items-center gap-1 text-[10px] bg-black text-white px-2 rounded-full transition-opacity duration-300 ${webcamActive ? 'opacity-100' : 'opacity-0'}`}>
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div> REC
            </div>

            <h4 className="font-bold mb-4 border-b pb-2 flex justify-between">
                <span>Secure Login Portal</span>
                <span className="text-xs text-gray-500 font-normal">v2.4</span>
            </h4>
            
            <div className="space-y-4">
              <div>
                  <label className="text-xs font-bold text-gray-500">Username</label>
                  <input 
                    type="text" 
                    placeholder="john.doe" 
                    className="w-full border p-2 rounded bg-white focus:ring-2 ring-blue-500 outline-none"
                    onKeyDown={(e) => handleKeyDown(e as any)}
                  />
              </div>
              <div>
                  <label className="text-xs font-bold text-gray-500">Password</label>
                  <input 
                    type="password" 
                    placeholder="••••••••" 
                    className="w-full border p-2 rounded bg-white focus:ring-2 ring-blue-500 outline-none"
                    value={typedText}
                    onChange={(e) => setTypedText(e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e as any)}
                  />
              </div>
              
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-700 flex gap-2">
                  <AlertTriangle size={14}/> 
                  <span>System Slow? "WindowsUpdate.exe" is running in background.</span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
             <button onClick={() => { setClipboard("MySecretPass"); setCapturedLogs(prev => [`[CLIPBOARD] User copied data`, ...prev]) }} className="flex-1 bg-gray-700 p-2 rounded text-xs flex items-center justify-center gap-2 hover:bg-gray-600"><Clipboard size={14}/> Simulate Copy</button>
             <button onClick={() => { setWebcamActive(!webcamActive); setCapturedLogs(prev => [`[WEBCAM] ${!webcamActive ? 'Activated' : 'Deactivated'} by C2`, ...prev]) }} className="flex-1 bg-gray-700 p-2 rounded text-xs flex items-center justify-center gap-2 hover:bg-gray-600"><Video size={14}/> Toggle Webcam</button>
          </div>
        </div>

        {/* HACKER'S C2 SERVER */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-white font-bold bg-red-900/30 p-2 rounded border border-red-500/30">
            <span className="flex items-center gap-2"><FileText size={20} className="text-red-500" /> C2 SERVER (Listening)</span>
            <span className="text-xs font-mono text-red-400 animate-pulse">● LIVE</span>
          </div>

          <div className="bg-black border-2 border-red-900 rounded-lg p-0 overflow-hidden shadow-[0_0_20px_rgba(255,0,0,0.15)] flex flex-col h-[400px]">
             {/* Toolbar */}
             <div className="bg-gray-900 p-2 flex gap-2 border-b border-gray-800">
                 <div className="flex-1 bg-black border border-gray-700 rounded px-2 py-1 text-xs text-green-500 font-mono truncate">
                     Last Clip: {clipboard || 'None'}
                 </div>
                 <div className="flex items-center gap-1 text-[10px] text-gray-500 px-2">
                     <Cpu size={12}/> CPU: 12%
                 </div>
             </div>

             {/* Main Logs */}
             <div className="flex-1 p-4 font-mono text-xs overflow-y-auto custom-scrollbar space-y-1">
                {capturedLogs.map((log, i) => (
                  <div key={i} className={`border-b border-gray-900 pb-1 ${log.includes('KEY') ? 'text-green-500' : (log.includes('ALERT') ? 'text-red-500 font-bold bg-red-900/10' : 'text-blue-400')}`}>
                    {log}
                  </div>
                ))}
                {capturedLogs.length === 0 && <span className="text-gray-600 italic">Waiting for connection...</span>}
             </div>
             
             {/* Screenshot Reel */}
             <div className="h-24 bg-gray-900 border-t border-gray-700 p-2 flex gap-2 overflow-x-auto">
                 {screenshots.length === 0 && <div className="text-gray-600 text-xs m-auto">No Screenshots Yet</div>}
                 {screenshots.map((s, i) => (
                     <div key={s} className="min-w-[80px] h-full bg-gray-800 border border-gray-600 rounded flex items-center justify-center relative group">
                         <Camera size={24} className="text-gray-500"/>
                         <div className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center text-[10px] text-white">View</div>
                     </div>
                 ))}
             </div>
          </div>
          
          <div className="bg-cyber-900 p-3 rounded border border-cyber-600 flex justify-between items-center text-xs">
              <span className="text-gray-400 flex items-center gap-2"><Save size={14}/> Persistence:</span>
              <span className="text-red-400 font-mono">HKCU\Software\Microsoft\Windows\CurrentVersion\Run</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default KeyloggerSim;