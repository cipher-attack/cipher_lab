
import React, { useState, useEffect } from 'react';
import { ProjectType } from './types';
// Dashboard removed
import CyberTools from './components/CyberTools';
import PhishingSim from './components/PhishingSim';
import TerminalSim from './components/TerminalSim';
import EncryptionSim from './components/EncryptionSim';
import SqlInjectionSim from './components/SqlInjectionSim';
import FirewallSim from './components/FirewallSim';
import SteganographySim from './components/SteganographySim';
import DDOSSim from './components/DDOSSim';
import KeyloggerSim from './components/KeyloggerSim';
import XSSSim from './components/XSSSim';
import BruteForceSim from './components/BruteForceSim';
import NmapSim from './components/NmapSim';
import MitmnSim from './components/MitmnSim';
import RansomwareSim from './components/RansomwareSim';
import OsintSim from './components/OsintSim';
import BufferOverflowSim from './components/BufferOverflowSim';
import FileUploadSim from './components/FileUploadSim';
import ReverseEngineeringSim from './components/ReverseEngineeringSim';
import AboutCipher from './components/AboutCipher';
import AIChat from './components/AIChat';
import AuthModal from './components/AuthModal'; 
import { AuthService, UserProfile } from './services/authService'; 
import { Shield, Lock, FileCode, Database, Server, Menu, User, Sun, Moon, Terminal, Eye, Zap, Keyboard, Globe, Award, Search, Wifi, Skull, Radar, LogIn, LogOut, PenTool, Download, Layers, Upload, Cpu } from 'lucide-react';

const GlitchLogo = () => {
  const [broken, setBroken] = useState(false);

  const handleClick = () => {
    setBroken(true);
    setTimeout(() => setBroken(false), 500); 
  };

  return (
    <div 
      onClick={handleClick}
      className="cursor-pointer select-none group relative overflow-hidden p-2 rounded-lg hover:bg-black/5 transition-colors"
    >
      <h1 className={`text-2xl md:text-3xl font-black italic tracking-tighter text-cyber-text transition-all duration-100 ${broken ? 'glitch-active' : ''}`}>
        CIPHER<span className="text-cyber-accent">_AI</span>
      </h1>
      <div className="absolute top-0 left-0 w-full h-[1px] bg-cyber-accent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
    </div>
  );
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ProjectType>(ProjectType.TERMINAL); // TERMINAL DEFAULT
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [visitedModules, setVisitedModules] = useState<string[]>([]);
  
  // Auth State
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // AUTH LISTENER FOR PERSISTENCE
  useEffect(() => {
    const unsubscribe = AuthService.onAuthStateChange((user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!visitedModules.includes(activeTab) && activeTab !== ProjectType.ABOUT) {
      setVisitedModules([...visitedModules, activeTab]);
    }
  }, [activeTab]);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.remove('light-mode');
    } else {
      document.body.classList.add('light-mode');
    }
  }, [isDarkMode]);

  const handleLogout = async () => {
    await AuthService.logout();
    setCurrentUser(null);
  };

  const getRank = () => {
    const count = visitedModules.length;
    if (count < 5) return { title: "Script Kiddie", color: "text-gray-400", canCert: false };
    if (count < 10) return { title: "White Hat", color: "text-green-400", canCert: false };
    if (count < 13) return { title: "Cyber Ninja", color: "text-purple-400", canCert: false };
    return { title: "Elite Hacker", color: "text-red-500 animate-pulse", canCert: true };
  };

  const navItems = [
    { id: ProjectType.TERMINAL, label: 'Terminal', icon: <Terminal size={18} /> },
    { id: ProjectType.TOOLS, label: 'Cyber Tools', icon: <PenTool size={18} /> },
    { id: ProjectType.PHISHING, label: 'Phishing', icon: <Shield size={18} /> },
    { id: ProjectType.ENCRYPTION, label: 'Cryptography', icon: <FileCode size={18} /> },
    { id: ProjectType.SQL_INJECTION, label: 'SQL Injection', icon: <Database size={18} /> },
    { id: ProjectType.FIREWALL, label: 'Firewall', icon: <Server size={18} /> },
    { id: ProjectType.STEGANOGRAPHY, label: 'Steganography', icon: <Eye size={18} /> },
    { id: ProjectType.DDOS, label: 'DDoS Attack', icon: <Zap size={18} /> },
    { id: ProjectType.KEYLOGGER, label: 'Keylogger', icon: <Keyboard size={18} /> },
    { id: ProjectType.XSS, label: 'XSS Exploit', icon: <Globe size={18} /> },
    { id: ProjectType.BRUTE_FORCE, label: 'Brute Force', icon: <Lock size={18} /> },
    { id: ProjectType.NMAP, label: 'Nmap Scan', icon: <Radar size={18} /> },
    { id: ProjectType.MITM, label: 'MITM Sniffer', icon: <Wifi size={18} /> },
    { id: ProjectType.RANSOMWARE, label: 'Ransomware', icon: <Skull size={18} /> },
    { id: ProjectType.OSINT, label: 'OSINT', icon: <Search size={18} /> },
    { id: ProjectType.BUFFER_OVERFLOW, label: 'Buffer Overflow', icon: <Layers size={18} /> },
    { id: ProjectType.FILE_UPLOAD, label: 'File Upload (RCE)', icon: <Upload size={18} /> },
    { id: ProjectType.REVERSE_ENGINEERING, label: 'Reverse Eng.', icon: <Cpu size={18} /> },
    { id: ProjectType.ABOUT, label: 'About Cipher', icon: <User size={18} /> },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case ProjectType.TOOLS: return <CyberTools />;
      case ProjectType.PHISHING: return <PhishingSim />;
      case ProjectType.TERMINAL: return <TerminalSim />;
      case ProjectType.ENCRYPTION: return <EncryptionSim />;
      case ProjectType.SQL_INJECTION: return <SqlInjectionSim />;
      case ProjectType.FIREWALL: return <FirewallSim />;
      case ProjectType.STEGANOGRAPHY: return <SteganographySim />;
      case ProjectType.DDOS: return <DDOSSim />;
      case ProjectType.KEYLOGGER: return <KeyloggerSim />;
      case ProjectType.XSS: return <XSSSim />;
      case ProjectType.BRUTE_FORCE: return <BruteForceSim />;
      case ProjectType.NMAP: return <NmapSim />;
      case ProjectType.MITM: return <MitmnSim />;
      case ProjectType.RANSOMWARE: return <RansomwareSim />;
      case ProjectType.OSINT: return <OsintSim />;
      case ProjectType.BUFFER_OVERFLOW: return <BufferOverflowSim />;
      case ProjectType.FILE_UPLOAD: return <FileUploadSim />;
      case ProjectType.REVERSE_ENGINEERING: return <ReverseEngineeringSim />;
      case ProjectType.ABOUT: return <AboutCipher />;
      default: return <TerminalSim />;
    }
  };

  const getActiveTitle = () => navItems.find(n => n.id === activeTab)?.label || 'Cipher Lab';
  const rank = getRank();

  const handleDownloadCert = () => {
     alert("Downloading Certificate for Elite Hacker: " + (currentUser?.username || "Guest"));
  };

  return (
    <div className="min-h-screen bg-cyber-900 text-cyber-text font-sans flex flex-col md:flex-row overflow-hidden relative transition-colors duration-300">
      <div className="fixed inset-0 pointer-events-none z-0 opacity-10" style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%239C92AC\' fill-opacity=\'0.2\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'}}></div>

      {/* Mobile Header */}
      <div className="md:hidden bg-cyber-800/90 backdrop-blur p-4 flex justify-between items-center border-b border-cyber-600 z-50 sticky top-0">
        <GlitchLogo />
        <div className="flex items-center gap-3">
          {currentUser ? (
             <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-green-400 truncate max-w-[80px]">{currentUser.username}</span>
                <button onClick={handleLogout} className="p-2 text-red-400 bg-red-900/20 rounded border border-red-500/30" title="Logout">
                  <LogOut size={18} />
                </button>
             </div>
          ) : (
             <button onClick={() => setIsAuthOpen(true)} className="p-2 text-cyber-accent bg-cyber-accent/10 rounded border border-cyber-accent/30 animate-pulse">
                <LogIn size={18} />
             </button>
          )}
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-cyber-text p-2 border border-cyber-600 rounded bg-cyber-900 ml-2"><Menu /></button>
        </div>
      </div>

      <div className={`fixed md:relative z-40 w-full md:w-72 h-screen bg-cyber-800/95 backdrop-blur-xl border-r border-cyber-600 flex flex-col transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="p-6 hidden md:block">
          <GlitchLogo />
        </div>
        
        {/* Sidebar Info (Rank) */}
        <div className="px-6 mt-4 mb-2">
          <div className="bg-cyber-900/50 p-3 rounded border border-cyber-600 flex items-center gap-3">
             <Award className={rank.color} />
             <div>
               <div className="text-[10px] text-gray-500 uppercase tracking-wide">Current Rank</div>
               <div className={`font-bold font-mono ${rank.color}`}>{rank.title}</div>
             </div>
          </div>
          {rank.canCert && (
             <button onClick={handleDownloadCert} className="w-full mt-2 text-[10px] bg-cyber-accent text-black font-bold py-1 rounded flex items-center justify-center gap-1 hover:bg-white transition-colors">
               <Download size={10} /> CLAIM CERTIFICATE
             </button>
          )}
        </div>

        <div className="px-6 pb-4 flex-1 overflow-y-auto custom-scrollbar">
          <div className="text-xs font-bold text-cyber-subtext uppercase tracking-widest mb-2 px-2 mt-2">Core Modules</div>
          <nav className="space-y-1">
            {navItems.slice(0, 6).map((item) => (
              <button key={item.id} onClick={() => { setActiveTab(item.id); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 group relative overflow-hidden ${activeTab === item.id ? 'text-cyber-accent bg-cyber-900 border border-cyber-accent/30 shadow-[0_0_10px_rgba(0,0,0,0.1)]' : 'text-cyber-subtext hover:text-cyber-text hover:bg-black/5'}`}>
                <span className="relative z-10">{item.icon}</span><span className="font-medium relative z-10">{item.label}</span>
              </button>
            ))}
          </nav>
          <div className="text-xs font-bold text-red-400 uppercase tracking-widest mb-2 px-2 mt-6">Advanced Attack</div>
          <nav className="space-y-1">
            {navItems.slice(6).map((item) => (
              <button key={item.id} onClick={() => { setActiveTab(item.id); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 group relative overflow-hidden ${activeTab === item.id ? 'text-red-400 bg-red-900/20 border border-red-500/30' : 'text-cyber-subtext hover:text-red-300 hover:bg-black/5'}`}>
                <span className="relative z-10">{item.icon}</span><span className="font-medium relative z-10">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
        <div className="p-6 border-t border-cyber-600 bg-cyber-900/30 space-y-4">
           <button onClick={() => setIsDarkMode(!isDarkMode)} className="w-full flex items-center justify-between p-3 rounded-lg bg-cyber-700/50 border border-cyber-600 text-sm hover:border-cyber-accent transition-colors">
             <span className="text-cyber-subtext">Theme Mode</span>{isDarkMode ? <Moon size={16} className="text-cyber-purple" /> : <Sun size={16} className="text-yellow-500" />}
           </button>
        </div>
      </div>

      <main className="flex-1 p-4 md:p-8 overflow-y-auto h-screen scroll-smooth z-10 relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6">
            <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end pb-4 border-b border-cyber-600 gap-4">
              <div>
                <h2 className="text-4xl font-black text-cyber-text uppercase tracking-tight">{getActiveTitle()}</h2>
                <div className="flex items-center gap-2 mt-2">
                   <span className="h-1.5 w-1.5 rounded-full bg-cyber-accent animate-pulse"></span>
                   <span className="text-xs font-mono text-cyber-accent">LAB ENVIRONMENT ACTIVE</span>
                </div>
              </div>

              {/* Desktop Auth Controls */}
              <div className="hidden md:block">
                {currentUser ? (
                  <div className="flex items-center gap-4 bg-cyber-800 p-2 pl-4 rounded-lg border border-cyber-600">
                    <div className="flex flex-col items-end">
                       <span className="font-bold text-green-400 text-sm">{currentUser.username}</span>
                       <span className="text-[10px] text-gray-500 font-mono">AUTHORIZED</span>
                    </div>
                    <button onClick={handleLogout} className="bg-red-900/20 p-2 rounded text-red-400 hover:bg-red-600 hover:text-white transition-colors" title="Disconnect">
                      <LogOut size={18} />
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => setIsAuthOpen(true)}
                    className="flex items-center gap-2 bg-cyber-accent text-black px-6 py-2 rounded font-bold hover:bg-white hover:shadow-[0_0_15px_var(--accent-color)] transition-all"
                  >
                    <LogIn size={18} /> ACCESS TERMINAL
                  </button>
                )}
              </div>
            </header>

            <div className="bg-cyber-800/80 backdrop-blur border border-cyber-600 rounded-xl shadow-xl relative overflow-hidden min-h-[500px]">
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyber-accent via-cyber-purple to-pink-500"></div>
               <div className="p-1 h-full">{renderContent()}</div>
            </div>
          </div>
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-8 h-full">
              <AIChat context={getActiveTitle()} user={currentUser} />
            </div>
          </div>
        </div>
      </main>
      
      {/* AUTH MODAL */}
      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={(user) => setCurrentUser(user)}
      />

    </div>
  );
};

export default App;
