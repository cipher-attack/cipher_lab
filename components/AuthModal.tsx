
import React, { useState } from 'react';
import { AuthService } from '../services/authService';
import { Lock, UserPlus, LogIn, X, Fingerprint, ShieldCheck, Github, Globe, Mail, Twitter, CheckCircle, AlertTriangle } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: any) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  if (!isOpen) return null;

  const validatePassword = (pwd: string) => {
    if (pwd.length < 8) return "Password must be at least 8 characters.";
    if (!/[A-Z]/.test(pwd)) return "Password must contain at least one Uppercase letter.";
    if (!/[0-9]/.test(pwd)) return "Password must contain at least one Number.";
    if (!/[^A-Za-z0-9]/.test(pwd)) return "Password must contain at least one Special Character (e.g., !@#$).";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (isLogin) {
        const result = await AuthService.login(email, password);
        if (result.success && result.user) {
          onLoginSuccess(result.user);
          onClose();
        } else {
          setError(result.message || "Login failed.");
        }
      } else {
        // Strong Password Enforcement
        const passError = validatePassword(password);
        if (passError) {
            setError(passError);
            setLoading(false);
            return;
        }

        const result = await AuthService.signup(username, email, password);
        if (result.success) {
          setSuccessMsg(result.message || "Verification email sent.");
          setIsLogin(true); // Switch to Login tab
          setEmail('');
          setPassword('');
        } else {
          setError(result.message || "Signup failed.");
        }
      }
    } catch (err: any) {
       setError("Connection failed. Check network.");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'github' | 'twitter') => {
    setLoading(true);
    setError('');
    
    try {
      const result = await AuthService.loginWithProvider(provider);
      if (result.success && result.user) {
        onLoginSuccess(result.user);
        onClose();
      } else {
        setError(result.message || "Social login failed.");
      }
    } catch (err: any) {
      setError("Social authentication failed. Please check Firebase Console settings.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md bg-cyber-900 border border-cyber-accent rounded-xl shadow-[0_0_30px_rgba(0,242,255,0.2)] overflow-hidden animate-slide-up">
        
        {/* Decorative Scanner Bar */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyber-accent to-transparent animate-scan"></div>
        
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors">
          <X size={20} />
        </button>

        <div className="p-8">
          <div className="text-center mb-6">
            <div className="inline-block p-4 rounded-full bg-cyber-800 border border-cyber-600 mb-4 relative">
              <Fingerprint size={40} className="text-cyber-accent animate-pulse" />
              <div className="absolute inset-0 border border-cyber-accent rounded-full animate-ping opacity-20"></div>
            </div>
            <h2 className="text-2xl font-black text-white uppercase tracking-widest">
              {isLogin ? 'System Access' : 'New Identity'}
            </h2>
            <p className="text-cyber-subtext text-xs mt-2 font-mono">
              SECURE FIREBASE CONNECTION
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Username only needed for signup */}
            {!isLogin && (
              <div>
                <label className="block text-xs font-bold text-cyber-subtext uppercase mb-1">Codename</label>
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-black border border-cyber-600 rounded p-3 text-white focus:border-cyber-accent focus:outline-none transition-colors"
                  placeholder="e.g. Neo"
                  required={!isLogin}
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-cyber-subtext uppercase mb-1">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-3.5 text-gray-500"/>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black border border-cyber-600 rounded p-3 pl-10 text-white focus:border-cyber-accent focus:outline-none transition-colors"
                  placeholder="agent@cipher.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-cyber-subtext uppercase mb-1">Passphrase</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-3.5 text-gray-500"/>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setPwdFocus(true)}
                  className="w-full bg-black border border-cyber-600 rounded p-3 pl-10 text-white focus:border-cyber-accent focus:outline-none transition-colors"
                  placeholder="••••••••"
                  required
                />
              </div>
              {!isLogin && pwdFocus && (
                  <div className="grid grid-cols-2 gap-2 mt-2 p-2 bg-black/50 rounded border border-cyber-600/30">
                      <div className={`text-[10px] flex items-center gap-1 ${password.length >= 8 ? 'text-green-400' : 'text-gray-500'}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${password.length >= 8 ? 'bg-green-400' : 'bg-gray-600'}`}></div> 8+ Characters
                      </div>
                      <div className={`text-[10px] flex items-center gap-1 ${/[A-Z]/.test(password) ? 'text-green-400' : 'text-gray-500'}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${/[A-Z]/.test(password) ? 'bg-green-400' : 'bg-gray-600'}`}></div> Uppercase
                      </div>
                      <div className={`text-[10px] flex items-center gap-1 ${/[0-9]/.test(password) ? 'text-green-400' : 'text-gray-500'}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${/[0-9]/.test(password) ? 'bg-green-400' : 'bg-gray-600'}`}></div> Number
                      </div>
                      <div className={`text-[10px] flex items-center gap-1 ${/[^A-Za-z0-9]/.test(password) ? 'text-green-400' : 'text-gray-500'}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${/[^A-Za-z0-9]/.test(password) ? 'bg-green-400' : 'bg-gray-600'}`}></div> Symbol
                      </div>
                  </div>
              )}
            </div>

            {error && (
              <div className="bg-red-900/30 border border-red-500/50 text-red-200 text-xs p-3 rounded flex items-center gap-2">
                <ShieldCheck size={14} /> {error}
              </div>
            )}

            {successMsg && (
              <div className="bg-green-900/30 border border-green-500/50 text-green-200 text-xs p-3 rounded flex flex-col gap-1 animate-pulse">
                <div className="flex items-center gap-2 font-bold">
                    <CheckCircle size={14} /> Verification Sent!
                </div>
                <div>{successMsg}</div>
                <div className="flex items-center gap-1 text-yellow-400 mt-1 font-bold bg-black/20 p-1 rounded">
                    <AlertTriangle size={12}/> CHECK SPAM FOLDER
                </div>
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className={`w-full py-3 rounded font-bold uppercase tracking-wide flex items-center justify-center gap-2 transition-all ${loading ? 'bg-cyber-700 text-gray-400 cursor-wait' : 'bg-cyber-accent text-black hover:bg-white hover:shadow-[0_0_15px_rgba(0,242,255,0.5)]'}`}
            >
              {loading ? 'Authenticating...' : (isLogin ? <><LogIn size={18} /> Login</> : <><UserPlus size={18} /> Register</>)}
            </button>
          </form>

          {/* SOCIAL LOGIN SECTION */}
          <div className="mt-6">
            <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-cyber-600"></div>
                <span className="flex-shrink-0 mx-4 text-cyber-subtext text-xs font-bold uppercase">Or authenticate via</span>
                <div className="flex-grow border-t border-cyber-600"></div>
            </div>

            <div className="grid grid-cols-3 gap-3 mt-4">
                {/* Google */}
                <button 
                  onClick={() => handleSocialLogin('google')}
                  disabled={loading}
                  className="group relative flex items-center justify-center gap-2 py-3 px-2 rounded-lg bg-transparent border border-red-500/30 text-red-400 hover:border-red-500 hover:text-red-500 hover:bg-red-500/5 hover:shadow-[0_0_15px_rgba(239,68,68,0.3)] transition-all duration-300"
                >
                   <Globe size={18} className="transition-transform group-hover:scale-110"/> 
                   <span className="text-xs font-bold tracking-wider">Google</span>
                </button>

                {/* GitHub */}
                <button 
                  onClick={() => handleSocialLogin('github')}
                  disabled={loading}
                  className="group relative flex items-center justify-center gap-2 py-3 px-2 rounded-lg bg-transparent border border-gray-500/30 text-gray-400 hover:border-white hover:text-white hover:bg-white/5 hover:shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-all duration-300"
                >
                   <Github size={18} className="transition-transform group-hover:scale-110"/> 
                   <span className="text-xs font-bold tracking-wider">GitHub</span>
                </button>

                 {/* X / Twitter */}
                 <button 
                  onClick={() => handleSocialLogin('twitter')}
                  disabled={loading}
                  className="group relative flex items-center justify-center gap-2 py-3 px-2 rounded-lg bg-transparent border border-blue-500/30 text-blue-400 hover:border-blue-400 hover:text-blue-300 hover:bg-blue-500/5 hover:shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all duration-300"
                >
                   <Twitter size={18} className="transition-transform group-hover:scale-110"/> 
                   <span className="text-xs font-bold tracking-wider">X</span>
                </button>
            </div>
          </div>

          <div className="mt-6 text-center">
            <button 
              onClick={() => { setIsLogin(!isLogin); setError(''); setSuccessMsg(''); }}
              className="text-cyber-subtext text-xs hover:text-cyber-accent underline underline-offset-4 transition-colors"
            >
              {isLogin ? "Don't have an account? Sign Up" : "Already authorized? Login"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
