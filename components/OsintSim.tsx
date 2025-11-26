import React, { useState } from 'react';
import { Search, Globe, User, MapPin, Hash, Image, Database, FileText, Wifi, Eye, Camera, Lock, Layers } from 'lucide-react';

const OsintSim: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'SOCIAL' | 'GEO' | 'TECH' | 'IMAGE'>('SOCIAL');
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<any>(null);

  // Sherlock Search State
  const [sherlockProgress, setSherlockProgress] = useState(0);
  const [foundAccounts, setFoundAccounts] = useState<string[]>([]);

  const handleSearch = () => {
    setSearching(true);
    setResults(null);
    setSherlockProgress(0);
    setFoundAccounts([]);

    if (activeTab === 'SOCIAL') {
        // Simulate Sherlock Username Search
        let p = 0;
        const sites = ['Twitter', 'Instagram', 'GitHub', 'Reddit', 'Spotify', 'TikTok', 'Pinterest', 'Tinder', 'Roblox', 'Steam'];
        const interval = setInterval(() => {
            p += 10;
            setSherlockProgress(p);
            
            // Randomly find accounts
            if (Math.random() > 0.6) {
                const site = sites[Math.floor((p/10)-1)];
                if(site) setFoundAccounts(prev => [...prev, site]);
            }

            if (p >= 100) {
                clearInterval(interval);
                setSearching(false);
                setResults({
                    target: query,
                    accounts: foundAccounts,
                    email: query.toLowerCase().replace(' ', '.') + '@gmail.com',
                    leaked: true
                });
            }
        }, 300);
    } 
    else if (activeTab === 'GEO') {
        setTimeout(() => {
            setSearching(false);
            setResults({
                coords: '41.8781° N, 87.6298° W',
                city: 'Chicago, IL',
                isp: 'Comcast Cable',
                ip: '192.168.1.44'
            });
        }, 2000);
    }
    else {
        setTimeout(() => {
            setSearching(false);
            setResults({ done: true });
        }, 1500);
    }
  };

  return (
    <div className="space-y-6 p-4">
      <div className="bg-cyber-800 p-4 rounded-lg border border-cyber-600">
        <h3 className="text-xl font-bold text-cyber-accent mb-2">Advanced OSINT Lab (Open Source Intel)</h3>
        <p className="text-cyber-subtext text-sm">
          Target Analysis Suite: Username enumeration (Sherlock), Geo-location, Tech Stack lookup, and Exif extraction.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[600px]">
        
        {/* LEFT: INPUT & TABS */}
        <div className="lg:col-span-4 flex flex-col gap-4">
            {/* SEARCH BAR */}
            <div className="bg-cyber-900 border border-cyber-600 rounded p-4">
                <div className="text-xs font-bold text-gray-500 uppercase mb-2">Target Identifier</div>
                <div className="flex gap-2">
                    <input 
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder={activeTab === 'SOCIAL' ? "Username (e.g. john_doe)" : (activeTab === 'GEO' ? "IP Address" : "Domain")}
                        className="flex-1 bg-black border border-gray-700 rounded p-3 text-white focus:border-cyber-accent outline-none"
                    />
                    <button onClick={handleSearch} disabled={!query || searching} className="bg-cyber-accent text-black px-4 rounded font-bold hover:bg-white disabled:opacity-50">
                        <Search />
                    </button>
                </div>
            </div>

            {/* TABS */}
            <div className="grid grid-cols-2 gap-2">
                <button onClick={() => {setActiveTab('SOCIAL'); setResults(null);}} className={`p-4 rounded border text-left transition-all ${activeTab === 'SOCIAL' ? 'bg-blue-900/40 border-blue-500 text-white' : 'bg-gray-900 border-gray-700 text-gray-400'}`}>
                    <User size={24} className="mb-2 text-blue-400"/>
                    <div className="font-bold text-sm">Social Recon</div>
                    <div className="text-[10px] opacity-70">Username Enumeration</div>
                </button>
                <button onClick={() => {setActiveTab('GEO'); setResults(null);}} className={`p-4 rounded border text-left transition-all ${activeTab === 'GEO' ? 'bg-green-900/40 border-green-500 text-white' : 'bg-gray-900 border-gray-700 text-gray-400'}`}>
                    <MapPin size={24} className="mb-2 text-green-400"/>
                    <div className="font-bold text-sm">Geo / IP</div>
                    <div className="text-[10px] opacity-70">Location Tracking</div>
                </button>
                <button onClick={() => {setActiveTab('TECH'); setResults(null);}} className={`p-4 rounded border text-left transition-all ${activeTab === 'TECH' ? 'bg-yellow-900/40 border-yellow-500 text-white' : 'bg-gray-900 border-gray-700 text-gray-400'}`}>
                    <Wifi size={24} className="mb-2 text-yellow-400"/>
                    <div className="font-bold text-sm">Tech Stack</div>
                    <div className="text-[10px] opacity-70">DNS & Server Info</div>
                </button>
                <button onClick={() => {setActiveTab('IMAGE'); setResults(null);}} className={`p-4 rounded border text-left transition-all ${activeTab === 'IMAGE' ? 'bg-purple-900/40 border-purple-500 text-white' : 'bg-gray-900 border-gray-700 text-gray-400'}`}>
                    <Image size={24} className="mb-2 text-purple-400"/>
                    <div className="font-bold text-sm">Image Intel</div>
                    <div className="text-[10px] opacity-70">Exif & Reverse Search</div>
                </button>
            </div>

            {/* BREACH CHECK WIDGET */}
            <div className="bg-black border border-red-900/50 p-4 rounded mt-auto">
                <div className="flex items-center gap-2 text-red-500 font-bold text-xs mb-2">
                    <Database size={14}/> DATA BREACH CHECK (HIBP)
                </div>
                <div className="text-gray-500 text-xs">
                    {searching ? 'Checking database...' : (results?.leaked ? <span className="text-red-400 font-bold">WARNING: Email found in 3 breaches! (LinkedIn, Adobe)</span> : 'Status: Unknown')}
                </div>
            </div>
        </div>

        {/* RIGHT: RESULTS DISPLAY */}
        <div className="lg:col-span-8 bg-black border border-cyber-600 rounded p-6 relative overflow-hidden flex flex-col">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')] opacity-5 pointer-events-none"></div>

            {searching ? (
                <div className="flex-1 flex flex-col items-center justify-center">
                    <div className="w-16 h-16 border-4 border-cyber-accent border-t-transparent rounded-full animate-spin mb-4"></div>
                    <div className="text-cyber-accent font-mono animate-pulse">RUNNING INTELLIGENCE SCAN...</div>
                    
                    {activeTab === 'SOCIAL' && (
                        <div className="w-64 bg-gray-800 h-2 rounded-full mt-4 overflow-hidden">
                            <div className="h-full bg-blue-500 transition-all" style={{width: `${sherlockProgress}%`}}></div>
                        </div>
                    )}
                </div>
            ) : results ? (
                <div className="space-y-6 animate-slide-up z-10">
                    
                    {/* SOCIAL RESULTS */}
                    {activeTab === 'SOCIAL' && (
                        <>
                            <div className="grid grid-cols-4 gap-4">
                                {['Twitter', 'Instagram', 'GitHub', 'Reddit', 'Spotify', 'TikTok', 'Pinterest', 'Steam'].map(site => {
                                    const found = foundAccounts.includes(site);
                                    return (
                                        <div key={site} className={`p-3 rounded border text-center ${found ? 'bg-green-900/20 border-green-500 text-green-400' : 'bg-gray-900 border-gray-800 text-gray-600'}`}>
                                            <div className="font-bold text-sm">{site}</div>
                                            <div className="text-[10px]">{found ? 'FOUND' : 'NOT FOUND'}</div>
                                        </div>
                                    )
                                })}
                            </div>

                            <div className="bg-gray-900 p-4 rounded border border-gray-700">
                                <h4 className="text-gray-400 text-xs font-bold uppercase mb-4">Relationship Graph</h4>
                                <div className="flex justify-center items-center h-40 relative">
                                    <div className="absolute w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold z-10">{query[0]?.toUpperCase()}</div>
                                    {foundAccounts.slice(0, 4).map((acc, i) => (
                                        <div key={i} className="absolute flex flex-col items-center" style={{ transform: `rotate(${i * 90}deg) translate(80px) rotate(-${i * 90}deg)` }}>
                                            <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-[10px] border border-gray-500">{acc[0]}</div>
                                            <div className="w-20 h-[1px] bg-gray-600 absolute top-4 right-4 -z-10" style={{ transform: `rotate(${i*90 + 180}deg)`, transformOrigin: 'right' }}></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}

                    {/* GEO RESULTS */}
                    {activeTab === 'GEO' && (
                        <div className="grid grid-cols-2 gap-6">
                            <div className="bg-gray-900 border border-gray-700 p-4 rounded">
                                <h4 className="text-green-400 text-xs font-bold uppercase mb-2">IP Intelligence</h4>
                                <div className="space-y-2 text-sm text-gray-300 font-mono">
                                    <div className="flex justify-between border-b border-gray-800 pb-1"><span>IP Address:</span> <span className="text-white">{results.ip}</span></div>
                                    <div className="flex justify-between border-b border-gray-800 pb-1"><span>ISP:</span> <span className="text-white">{results.isp}</span></div>
                                    <div className="flex justify-between border-b border-gray-800 pb-1"><span>Timezone:</span> <span className="text-white">America/Chicago</span></div>
                                    <div className="flex justify-between border-b border-gray-800 pb-1"><span>VPN/Proxy:</span> <span className="text-red-400">FALSE</span></div>
                                </div>
                            </div>
                            <div className="bg-black border border-green-900 p-4 rounded flex items-center justify-center relative overflow-hidden">
                                <Globe size={100} className="text-green-900 opacity-50 absolute"/>
                                <MapPin size={32} className="text-red-500 relative z-10 drop-shadow-lg animate-bounce"/>
                                <div className="absolute bottom-2 text-green-500 font-mono text-xs">{results.coords}</div>
                            </div>
                        </div>
                    )}

                    {/* TECH RESULTS */}
                    {activeTab === 'TECH' && (
                        <div className="space-y-4">
                             <div className="grid grid-cols-3 gap-4">
                                 <div className="bg-gray-900 p-3 rounded border border-gray-700 text-center">
                                     <div className="text-xs text-gray-500 mb-1">Registrar</div>
                                     <div className="font-bold text-blue-400">GoDaddy.com, LLC</div>
                                 </div>
                                 <div className="bg-gray-900 p-3 rounded border border-gray-700 text-center">
                                     <div className="text-xs text-gray-500 mb-1">Server</div>
                                     <div className="font-bold text-yellow-400">Nginx 1.18.0</div>
                                 </div>
                                 <div className="bg-gray-900 p-3 rounded border border-gray-700 text-center">
                                     <div className="text-xs text-gray-500 mb-1">CMS</div>
                                     <div className="font-bold text-purple-400">WordPress 5.8</div>
                                 </div>
                             </div>
                             
                             <div className="bg-black border border-gray-700 p-4 rounded font-mono text-xs">
                                 <div className="text-gray-500 mb-2 border-b border-gray-800 pb-1">DNS ENUMERATION</div>
                                 <div className="text-green-400">mail.{query}  [104.21.55.2]</div>
                                 <div className="text-green-400">dev.{query}   [104.21.55.3] (Potential Entry)</div>
                                 <div className="text-green-400">vpn.{query}   [104.21.55.4]</div>
                             </div>
                        </div>
                    )}

                    {/* IMAGE RESULTS */}
                    {activeTab === 'IMAGE' && (
                        <div className="grid grid-cols-2 gap-6">
                            <div className="border-2 border-dashed border-gray-700 rounded flex flex-col items-center justify-center p-8 bg-gray-900/50">
                                <Camera size={32} className="text-gray-500 mb-2"/>
                                <div className="text-xs text-gray-400">Drag Image or Paste URL to extract Exif</div>
                            </div>
                            <div className="bg-black border border-gray-700 p-4 rounded font-mono text-xs text-gray-300">
                                <div className="text-purple-400 font-bold mb-2">METADATA EXTRACTED</div>
                                <div>Device: iPhone 13 Pro</div>
                                <div>Date: 2023:10:12 14:22:05</div>
                                <div>GPS: <span className="text-red-400 font-bold">34.0522° N, 118.2437° W</span></div>
                                <div>Software: Adobe Photoshop 21.0</div>
                            </div>
                        </div>
                    )}

                    <button className="absolute bottom-4 right-4 bg-cyber-accent text-black px-4 py-2 rounded text-xs font-bold hover:bg-white flex items-center gap-2">
                        <FileText size={14}/> GENERATE PDF REPORT
                    </button>

                </div>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-600">
                    <Eye size={48} className="mb-4 opacity-20"/>
                    <div className="text-sm">Initiate a search to gather intelligence.</div>
                </div>
            )}
        </div>

      </div>
    </div>
  );
};

export default OsintSim;