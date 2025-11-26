import React, { useState } from 'react';
import { ArrowRightLeft, Key, FileLock2, Shield, Hash, Fingerprint, FileText } from 'lucide-react';

const EncryptionSim: React.FC = () => {
  const [inputText, setInputText] = useState('Hello World');
  const [key, setKey] = useState('secret123');
  const [mode, setMode] = useState<'caesar' | 'aes' | 'rsa' | 'sign' | 'file'>('aes');
  const [rsaKeys, setRsaKeys] = useState<{pub: string, priv: string} | null>(null);
  const [fileEncrypted, setFileEncrypted] = useState(false);

  // MOCK FUNCTIONS
  const caesarCipher = (str: string, shift: number) => {
    return str.replace(/[a-zA-Z]/g, (char) => {
      const start = char <= 'Z' ? 65 : 97;
      return String.fromCharCode(((char.charCodeAt(0) - start + shift) % 26) + start);
    });
  };

  const simpleAESMock = (text: string, pass: string) => {
    let result = '';
    for(let i = 0; i < text.length; i++) {
       const xor = text.charCodeAt(i) ^ pass.charCodeAt(i % pass.length);
       result += (xor.toString(16).padStart(2, '0'));
    }
    return result.toUpperCase();
  };

  const generateRSA = () => {
    setRsaKeys({
      pub: 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC...',
      priv: 'MIICXAIBAAKBgQC...'
    });
  };

  let output = '';
  let color = 'text-green-500';

  if (mode === 'caesar') {
    output = caesarCipher(inputText, 3);
    color = 'text-yellow-500';
  } else if (mode === 'aes') {
    output = simpleAESMock(inputText, key);
    color = 'text-cyber-purple';
  } else if (mode === 'rsa') {
    output = rsaKeys ? `[ENCRYPTED WITH PUBLIC KEY]\n${btoa(inputText).split('').reverse().join('')}...` : 'Generate Keys First';
    color = 'text-blue-400';
  } else if (mode === 'sign') {
    output = rsaKeys ? `-----BEGIN SIGNATURE-----\n${Math.abs(inputText.length * 92384).toString(16).toUpperCase()}...\n-----END SIGNATURE-----` : 'Generate Keys First';
    color = 'text-orange-400';
  }

  return (
    <div className="space-y-6 p-4">
      <div className="bg-cyber-800 p-4 rounded-lg border border-cyber-600">
        <h3 className="text-xl font-bold text-cyber-accent mb-2">Cryptography Lab (Advanced)</h3>
        <p className="text-cyber-subtext text-sm">Now supports RSA, Digital Signatures, and File Encryption.</p>
      </div>

      {/* Control Panel */}
      <div className="flex flex-wrap gap-2 justify-center bg-cyber-900 p-2 rounded border border-cyber-600">
        <button onClick={() => setMode('aes')} className={`px-4 py-2 rounded text-sm font-bold transition-all ${mode === 'aes' ? 'bg-cyber-purple text-white' : 'bg-cyber-800 text-gray-400'}`}>AES (Symmetric)</button>
        <button onClick={() => setMode('rsa')} className={`px-4 py-2 rounded text-sm font-bold transition-all ${mode === 'rsa' ? 'bg-blue-600 text-white' : 'bg-cyber-800 text-gray-400'}`}>RSA (Asymmetric)</button>
        <button onClick={() => setMode('sign')} className={`px-4 py-2 rounded text-sm font-bold transition-all ${mode === 'sign' ? 'bg-orange-600 text-white' : 'bg-cyber-800 text-gray-400'}`}>Digital Sign</button>
        <button onClick={() => setMode('file')} className={`px-4 py-2 rounded text-sm font-bold transition-all ${mode === 'file' ? 'bg-red-600 text-white' : 'bg-cyber-800 text-gray-400'}`}>File Encrypt</button>
        <button onClick={() => setMode('caesar')} className={`px-4 py-2 rounded text-sm font-bold transition-all ${mode === 'caesar' ? 'bg-yellow-600 text-black' : 'bg-cyber-800 text-gray-400'}`}>Caesar (Weak)</button>
      </div>

      {mode === 'file' ? (
        <div className="bg-black p-8 rounded border border-cyber-600 text-center">
            <div className="border-2 border-dashed border-gray-600 p-10 rounded-lg flex flex-col items-center">
               <FileLock2 size={48} className={`mb-4 ${fileEncrypted ? 'text-green-500' : 'text-gray-500'}`} />
               {fileEncrypted ? (
                   <div>
                       <div className="text-green-500 font-bold mb-2">FILE ENCRYPTED SUCCESSFULLY</div>
                       <div className="text-xs font-mono bg-gray-900 p-2 rounded">secret_doc.aes (24KB)</div>
                       <button onClick={() => setFileEncrypted(false)} className="mt-4 text-sm text-blue-400 underline">Encrypt Another</button>
                   </div>
               ) : (
                   <div>
                       <div className="text-gray-300 font-bold">Drag & Drop File to Encrypt</div>
                       <button onClick={() => setTimeout(() => setFileEncrypted(true), 1500)} className="mt-4 bg-red-600 text-white px-6 py-2 rounded font-bold hover:bg-red-500">
                         Simulate Encryption
                       </button>
                   </div>
               )}
            </div>
        </div>
      ) : (
      <>
        {(mode === 'rsa' || mode === 'sign') && (
            <div className="bg-black/50 p-4 rounded border border-blue-500/30 flex items-center justify-between">
            <div className="text-xs">
                <div className="font-bold text-blue-400">RSA KEYPAIR STATUS</div>
                <div className="text-gray-400">{rsaKeys ? 'KEYS ACTIVE (2048 bit)' : 'NO KEYS GENERATED'}</div>
            </div>
            <button onClick={generateRSA} className="bg-blue-600 text-white px-3 py-1 rounded text-xs font-bold hover:bg-blue-500">
                {rsaKeys ? <span className="flex items-center gap-1"><Key size={12}/> REGENERATE</span> : 'GENERATE KEYS'}
            </button>
            </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-center">
            <div className="md:col-span-3 space-y-2">
            <label className="block text-cyber-subtext text-sm">Input Data</label>
            <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="w-full h-40 bg-cyber-900 border border-cyber-600 p-3 rounded focus:border-cyber-accent text-cyber-text font-mono shadow-inner"
                placeholder="Secret message..."
            />
            </div>

            <div className="md:col-span-1 flex flex-col items-center justify-center gap-4">
            <div className="p-3 rounded-full bg-cyber-800 border border-cyber-600 animate-pulse">
                {mode === 'sign' ? <Fingerprint className="text-orange-500"/> : <ArrowRightLeft className="text-cyber-accent" />}
            </div>
            
            {mode === 'aes' && (
                <input type="text" value={key} onChange={(e) => setKey(e.target.value)} className="w-full bg-black text-center text-green-500 text-xs p-1 border border-green-900 rounded" placeholder="Key"/>
            )}
            </div>

            <div className="md:col-span-3 space-y-2">
            <label className="block text-cyber-subtext text-sm">Output ({mode.toUpperCase()})</label>
            <textarea
                readOnly
                value={output}
                className={`w-full h-40 bg-black border border-cyber-600 p-3 rounded font-mono text-sm ${color}`}
            />
            </div>
        </div>
      </>
      )}
    </div>
  );
};

export default EncryptionSim;