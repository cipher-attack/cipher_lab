import React, { useState } from 'react';
import { Github, Send, Mail, Phone, Zap } from 'lucide-react';

const AboutCipher: React.FC = () => {
  const [animatingId, setAnimatingId] = useState<string | null>(null);
  const [phase, setPhase] = useState<'idle' | 'falling' | 'shattered'>('idle');

  const socialLinks = [
    { id: 'tg', icon: <Send size={24} />, label: 'Telegram', link: 'https://t.me/cipher_attacks', color: 'text-blue-400', border: 'border-blue-500/30' },
    { id: 'ph', icon: <Phone size={24} />, label: '+251962108017', link: 'tel:+251962108017', color: 'text-green-400', border: 'border-green-500/30' },
    { id: 'em', icon: <Mail size={24} />, label: 'Email', link: 'mailto:birukgetachew253@gmail.com', color: 'text-yellow-400', border: 'border-yellow-500/30' },
    { id: 'gh', icon: <Github size={24} />, label: 'GitHub', link: 'https://github.com/cipher-attack', color: 'text-gray-200', border: 'border-gray-500/30' },
    { id: 'x', icon: <Zap size={24} />, label: 'X (Twitter)', link: 'https://x.com/Cipher_attacks', color: 'text-white', border: 'border-white/30' },
  ];

  const handleClick = (e: React.MouseEvent, id: string, link: string) => {
    e.preventDefault();
    if (animatingId) return;

    setAnimatingId(id);
    setPhase('falling');

    // Sequence: Fall -> Shatter -> Redirect
    setTimeout(() => {
      setPhase('shattered');
      
      setTimeout(() => {
        window.open(link, '_blank');
        setAnimatingId(null);
        setPhase('idle');
      }, 600); // Wait for shatter to finish
    }, 600); // Wait for fall to finish
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] text-center p-8 relative overflow-hidden">
      
      {/* Minimal Header */}
      <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter text-cyber-text opacity-10 absolute top-10 select-none">
        CIPHER
      </h1>

      <div className="relative z-10 mb-16 animate-slide-up">
        <h2 className="text-3xl font-bold text-cyber-text mb-2">Biruk Getachew</h2>
        <p className="text-cyber-accent font-mono uppercase tracking-widest text-sm">Full Stack Security Engineer</p>
      </div>

      {/* Physics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-8 relative h-40">
        {socialLinks.map((item) => {
          const isAnimating = animatingId === item.id;
          
          return (
            <div key={item.id} className="relative group w-20 mx-auto">
              <a 
                href={item.link} 
                onClick={(e) => handleClick(e, item.id, item.link)}
                className="block outline-none"
              >
                {/* ICON CONTAINER */}
                <div className={`relative w-20 h-20 flex items-center justify-center`}>
                  
                  {(!isAnimating || phase === 'falling') && (
                    <div className={`w-16 h-16 rounded-2xl bg-cyber-800/80 backdrop-blur-md border ${item.border} flex items-center justify-center shadow-lg group-hover:shadow-[0_0_20px_currentColor] transition-all duration-300 ${item.color} ${isAnimating && phase === 'falling' ? 'animate-fall' : 'hover:-translate-y-2'}`}>
                      {item.icon}
                    </div>
                  )}

                  {/* SHATTERED PIECES (Only visible in 'shattered' phase) */}
                  {isAnimating && phase === 'shattered' && (
                    <>
                      {/* Left Half */}
                      <div className={`absolute top-0 left-0 w-16 h-16 bg-cyber-800 border ${item.border} flex items-center justify-center overflow-hidden animate-shatter-l ${item.color}`} style={{ clipPath: 'polygon(0 0, 40% 0, 60% 100%, 0 100%)' }}>
                         {item.icon}
                      </div>
                      {/* Right Half */}
                      <div className={`absolute top-0 left-0 w-16 h-16 bg-cyber-800 border ${item.border} flex items-center justify-center overflow-hidden animate-shatter-r ${item.color}`} style={{ clipPath: 'polygon(40% 0, 100% 0, 100% 100%, 60% 100%)' }}>
                         {item.icon}
                      </div>
                    </>
                  )}
                </div>

                <span className={`block mt-4 text-xs font-mono font-bold uppercase ${item.color} ${isAnimating ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}>
                  {item.label}
                </span>
              </a>
            </div>
          );
        })}
      </div>
      
      {/* Floor for impact visual */}
      <div className="absolute bottom-10 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-cyber-600 to-transparent opacity-50"></div>
    </div>
  );
};

export default AboutCipher;