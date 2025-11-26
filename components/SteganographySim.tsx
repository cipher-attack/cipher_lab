import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, FileImage, Binary, Music, Layers, FileJson, Lock, Activity, Search, ArrowRight, ShieldCheck, AlertTriangle } from 'lucide-react';

const SteganographySim: React.FC = () => {
  const [method, setMethod] = useState<'LSB' | 'EOF' | 'EXIF' | 'AUDIO'>('LSB');
  const [message, setMessage] = useState('');
  const [passkey, setPasskey] = useState('');
  const [isEncrypted, setIsEncrypted] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [activeView, setActiveView] = useState<'PREVIEW' | 'HEX' | 'BITPLANE' | 'SPECTROGRAM'>('PREVIEW');

  // Stats
  const [entropy, setEntropy] = useState(3.2);
  const [capacity, setCapacity] = useState('0%');
  const [psnr, setPsnr] = useState('Infinity');

  // Mock Data
  const [hexData, setHexData] = useState<string[]>([]);
  const [pixels, setPixels] = useState<string[]>(Array(64).fill('000000'));

  useEffect(() => {
    // Initialize Mock Hex
    const base = [];
    for(let i=0; i<128; i++) base.push(Math.floor(Math.random()*255).toString(16).toUpperCase().padStart(2,'0'));
    setHexData(base);
    setEntropy(3.2);
    setPsnr('Infinity');
  }, [method]);

  const handleHide = () => {
    if (!message) return;
    setHidden(true);
    
    // Simulate Stats Change
    setEntropy(prev => Math.min(7.9, prev + (message.length * 0.1)));
    setCapacity(`${Math.min(100, Math.floor((message.length / 50) * 100))}%`);
    if (method === 'LSB') setPsnr('42.5 dB'); // Typical LSB PSNR
    
    // Simulate Hex Change
    const newHex = [...hexData];
    const chars = message.split('').map(c => c.charCodeAt(0));
    
    if (method === 'EOF') {
        // Append to end
        newHex.push('FF', 'D9'); // JPEG EOF
        chars.forEach(c => newHex.push(c.toString(16).toUpperCase().padStart(2,'0')));
    } else {
        // Scatter
        let idx = 10;
        chars.forEach(c => {
            if (idx < newHex.length) newHex[idx] = c.toString(16).toUpperCase().padStart(2,'0');
            idx += 4;
        });
    }
    setHexData(newHex);
  };

  const handleReset = () => {
      setHidden(false);
      setMessage('');
      setPasskey('');
      setEntropy(3.2);
      setPsnr('Infinity');
      setCapacity('0%');
      const base = [];
      for(let i=0; i<128; i++) base.push(Math.floor(Math.random()*255).toString(16).toUpperCase().padStart(2,'0'));
      setHexData(base);
  };

  return (
    <div className="space-y-6 p-4">
      <div className="bg-cyber-800 p-4 rounded-lg border border-cyber-600">
        <h3 className="text-xl font-bold text-cyber-accent mb-2">Advanced Steganography Lab</h3>
        <p className="text-cyber-subtext text-sm">
          Hide data using LSB (Image), Spectrograms (Audio), EOF Injection, and Metadata manipulation.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT: CONFIGURATION */}
        <div className="lg:col-span-4 space-y-4">
            
            {/* METHOD SELECTOR */}
            <div className="bg-cyber-900 border border-cyber-600 rounded p-4">
                <div className="text-xs font-bold text-gray-500 uppercase mb-3">Hiding Method</div>
                <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => { setMethod('LSB'); setActiveView('PREVIEW'); handleReset(); }} className={`p-2 rounded border text-xs font-bold flex items-center gap-2 ${method === 'LSB' ? 'bg-blue-600 text-white border-blue-400' : 'bg-gray-800 text-gray-400 border-gray-600'}`}>
                        <FileImage size={16}/> LSB (Image)
                    </button>
                    <button onClick={() => { setMethod('AUDIO'); setActiveView('SPECTROGRAM'); handleReset(); }} className={`p-2 rounded border text-xs font-bold flex items-center gap-2 ${method === 'AUDIO' ? 'bg-purple-600 text-white border-purple-400' : 'bg-gray-800 text-gray-400 border-gray-600'}`}>
                        <Music size={16}/> Audio Spectrum
                    </button>
                    <button onClick={() => { setMethod('EOF'); setActiveView('HEX'); handleReset(); }} className={`p-2 rounded border text-xs font-bold flex items-center gap-2 ${method === 'EOF' ? 'bg-yellow-600 text-white border-yellow-400' : 'bg-gray-800 text-gray-400 border-gray-600'}`}>
                        <Binary size={16}/> EOF Injection
                    </button>
                    <button onClick={() => { setMethod('EXIF'); setActiveView('PREVIEW'); handleReset(); }} className={`p-2 rounded border text-xs font-bold flex items-center gap-2 ${method === 'EXIF' ? 'bg-green-600 text-white border-green-400' : 'bg-gray-800 text-gray-400 border-gray-600'}`}>
                        <FileJson size={16}/> Exif Data
                    </button>
                </div>
            </div>

            {/* PAYLOAD INPUT */}
            <div className="bg-cyber-900 border border-cyber-600 rounded p-4 space-y-3">
                <div className="text-xs font-bold text-gray-500 uppercase">Secret Payload</div>
                <textarea 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Enter secret message..."
                    className="w-full bg-black border border-gray-700 rounded p-2 text-white text-sm h-24 font-mono"
                    disabled={hidden}
                />
                
                <div className="flex items-center justify-between bg-black p-2 rounded border border-gray-700">
                    <div className="flex items-center gap-2">
                        <input type="checkbox" checked={isEncrypted} onChange={() => setIsEncrypted(!isEncrypted)} disabled={hidden} />
                        <span className="text-xs text-gray-300 flex items-center gap-1"><Lock size={12}/> AES Encryption</span>
                    </div>
                    {isEncrypted && (
                        <input 
                            value={passkey}
                            onChange={(e) => setPasskey(e.target.value)}
                            placeholder="Passkey"
                            className="bg-gray-900 border border-gray-600 rounded px-2 py-1 text-xs w-24 text-white"
                            disabled={hidden}
                        />
                    )}
                </div>

                <div className="flex gap-2">
                    <button onClick={handleHide} disabled={hidden || !message} className="flex-1 bg-cyber-accent text-black font-bold py-2 rounded hover:bg-white disabled:opacity-50">
                        {hidden ? 'DATA HIDDEN' : 'HIDE DATA'}
                    </button>
                    <button onClick={handleReset} className="px-3 bg-gray-700 text-white rounded hover:bg-gray-600">
                        RESET
                    </button>
                </div>
            </div>

            {/* STATS PANEL */}
            <div className="bg-black border border-cyber-600 rounded p-4 grid grid-cols-2 gap-4">
                 <div>
                     <div className="text-[10px] text-gray-500 uppercase">Entropy</div>
                     <div className={`text-xl font-mono ${entropy > 7.5 ? 'text-red-500 font-bold' : 'text-green-500'}`}>{entropy.toFixed(2)}</div>
                     <div className="text-[8px] text-gray-600">High = Detected</div>
                 </div>
                 <div>
                     <div className="text-[10px] text-gray-500 uppercase">PSNR (Quality)</div>
                     <div className="text-xl font-mono text-blue-400">{psnr}</div>
                 </div>
                 <div className="col-span-2">
                     <div className="text-[10px] text-gray-500 uppercase flex justify-between">
                         <span>Capacity Used</span>
                         <span>{capacity}</span>
                     </div>
                     <div className="w-full bg-gray-800 h-1 mt-1 rounded">
                         <div className="bg-cyber-accent h-full transition-all" style={{width: capacity}}></div>
                     </div>
                 </div>
            </div>
        </div>

        {/* RIGHT: VISUALIZATION */}
        <div className="lg:col-span-8 flex flex-col gap-4">
            
            {/* TABS */}
            <div className="flex gap-2 border-b border-gray-700 pb-2">
                <button onClick={() => setActiveView('PREVIEW')} className={`text-xs font-bold px-3 py-1 rounded ${activeView === 'PREVIEW' ? 'bg-cyber-700 text-white' : 'text-gray-500'}`}>MEDIA PREVIEW</button>
                <button onClick={() => setActiveView('HEX')} className={`text-xs font-bold px-3 py-1 rounded ${activeView === 'HEX' ? 'bg-cyber-700 text-white' : 'text-gray-500'}`}>HEX DIFF</button>
                {method === 'LSB' && <button onClick={() => setActiveView('BITPLANE')} className={`text-xs font-bold px-3 py-1 rounded ${activeView === 'BITPLANE' ? 'bg-cyber-700 text-white' : 'text-gray-500'}`}>BIT PLANES</button>}
                {method === 'AUDIO' && <button onClick={() => setActiveView('SPECTROGRAM')} className={`text-xs font-bold px-3 py-1 rounded ${activeView === 'SPECTROGRAM' ? 'bg-cyber-700 text-white' : 'text-gray-500'}`}>SPECTROGRAM</button>}
            </div>

            <div className="flex-1 bg-black border border-cyber-600 rounded p-4 relative overflow-hidden min-h-[400px]">
                
                {/* 1. PREVIEW MODE */}
                {activeView === 'PREVIEW' && (
                    <div className="flex flex-col items-center justify-center h-full">
                        {method === 'AUDIO' ? (
                            <div className="w-full flex items-center justify-center gap-1 h-32">
                                {Array(20).fill(0).map((_, i) => (
                                    <div 
                                        key={i} 
                                        className={`w-3 rounded bg-purple-500 transition-all duration-300 ${hidden ? 'animate-pulse' : ''}`}
                                        style={{ height: `${Math.random() * 80 + 20}%` }}
                                    ></div>
                                ))}
                            </div>
                        ) : (
                            <div className="relative group">
                                <div className="w-64 h-64 bg-gray-800 rounded border-2 border-gray-600 flex items-center justify-center overflow-hidden">
                                     <FileImage size={64} className="text-gray-600"/>
                                     {/* Simulated Image Content */}
                                     <div className="absolute inset-0 grid grid-cols-8 grid-rows-8 opacity-20">
                                         {Array(64).fill(0).map((_, i) => (
                                             <div key={i} className="bg-blue-500/50" style={{ opacity: Math.random() }}></div>
                                         ))}
                                     </div>
                                </div>
                                {method === 'EXIF' && hidden && (
                                    <div className="absolute -bottom-16 left-0 bg-green-900/90 text-green-300 p-2 text-xs font-mono rounded w-full animate-slide-up border border-green-500">
                                        <div>Make: Canon</div>
                                        <div>Model: EOS 80D</div>
                                        <div>Comment: <span className="text-white font-bold">{isEncrypted ? '[ENCRYPTED]' : message}</span></div>
                                    </div>
                                )}
                            </div>
                        )}
                        {hidden && <div className="mt-4 text-green-500 font-bold flex items-center gap-2"><ShieldCheck size={18}/> {method} INJECTION COMPLETE</div>}
                    </div>
                )}

                {/* 2. HEX DIFF MODE */}
                {activeView === 'HEX' && (
                    <div className="font-mono text-xs grid grid-cols-8 gap-x-2 gap-y-1 h-full overflow-y-auto custom-scrollbar content-start">
                        {hexData.map((byte, i) => {
                            // Highlight logic
                            const isModified = hidden && (
                                (method === 'EOF' && i > 128) || 
                                (method !== 'EOF' && (i % 4 === 2) && i > 10 && i < 10 + (message.length * 4))
                            );
                            return (
                                <span key={i} className={`p-0.5 ${isModified ? 'bg-red-500/30 text-red-400 font-bold' : 'text-gray-600'}`}>
                                    {byte}
                                </span>
                            )
                        })}
                    </div>
                )}

                {/* 3. BIT PLANE SLICING */}
                {activeView === 'BITPLANE' && (
                    <div className="grid grid-cols-4 gap-4 h-full">
                         {[7,6,5,4,3,2,1,0].map(plane => {
                             const isLsb = plane === 0;
                             return (
                                 <div key={plane} className={`border rounded p-2 flex flex-col items-center ${isLsb && hidden ? 'border-red-500 bg-red-900/10' : 'border-gray-700 bg-gray-900'}`}>
                                     <div className="flex-1 w-full bg-black flex items-center justify-center overflow-hidden relative">
                                         {/* Noise Simulation */}
                                         <div className="absolute inset-0" style={{ 
                                             backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='${0.65 + (plane * 0.1)}' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='${isLsb && hidden ? '1' : (0.1 + plane * 0.1)}'/%3E%3C/svg%3E")`
                                         }}></div>
                                         {isLsb && hidden && <span className="z-10 text-red-500 font-black text-xs bg-black/50 px-1">DATA</span>}
                                     </div>
                                     <div className={`text-xs mt-1 font-bold ${isLsb ? 'text-blue-400' : 'text-gray-500'}`}>
                                         Bit Plane {plane} {isLsb ? '(LSB)' : ''}
                                     </div>
                                 </div>
                             )
                         })}
                    </div>
                )}

                {/* 4. SPECTROGRAM */}
                {activeView === 'SPECTROGRAM' && (
                    <div className="flex items-end justify-center gap-[2px] h-full w-full px-4 pb-4">
                        {Array(60).fill(0).map((_, i) => {
                             const isHighFreq = i > 40;
                             const hasData = hidden && isHighFreq;
                             return (
                                 <div key={i} className="flex-1 flex flex-col justify-end h-full group relative">
                                     <div 
                                        className={`w-full rounded-t transition-all duration-500 ${hasData ? 'bg-red-500' : 'bg-green-500'}`}
                                        style={{ height: `${Math.random() * 50 + 20}%` }}
                                     ></div>
                                     {hasData && (
                                         <div className="absolute top-10 left-0 w-full h-2 bg-yellow-400 animate-ping"></div>
                                     )}
                                 </div>
                             )
                        })}
                        <div className="absolute top-4 right-4 bg-black/50 p-2 rounded text-xs text-white border border-gray-600">
                             <div>High Frequency Range</div>
                             <div className={hidden ? 'text-red-500 font-bold' : 'text-gray-500'}>{hidden ? 'ANOMALY DETECTED' : 'NORMAL'}</div>
                        </div>
                    </div>
                )}

            </div>
        </div>

      </div>
    </div>
  );
};

export default SteganographySim;