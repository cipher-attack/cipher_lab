
import React, { useState, useRef, useEffect } from 'react';
import { askCyberTutor, resetChatSession, startNewSession } from '../services/geminiService';
import { AuthService, ChatSession, UserProfile } from '../services/authService';
import { Send, Bot, User, Loader2, Sparkles, Terminal, Check, Copy, Download, Trash2, Save, Plus, History, X, ArrowDown, Paperclip, Image as ImageIcon } from 'lucide-react';
import { ChatMessage } from '../types';

interface AIChatProps {
  context: string;
  user: UserProfile | null; 
}

// --- UTILITY: Robust Syntax Highlighting ---
const highlightCode = (code: string) => {
  let safeCode = code
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  return safeCode
    .replace(/\b(import|from|def|class|return|if|else|elif|while|for|try|except|with|as|pass|break|continue|const|let|var|function|export|interface|implements)\b/g, '<span class="token-keyword">$1</span>')
    .replace(/\b(print|console|log|map|filter|reduce|push|append|open|read|write)\b/g, '<span class="token-function">$1</span>')
    .replace(/('.*?'|".*?"|`.*?`)/g, '<span class="token-string">$1</span>')
    .replace(/(\/\/.*$|#.*$)/gm, '<span class="token-comment">$&</span>')
    .replace(/\b(true|false|null|None|True|False)\b/g, '<span class="token-keyword">$1</span>');
};

// --- COMPONENT: Code Block with Copy ---
interface CodeBlockProps {
  language: string;
  code: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ language, code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-4 rounded-lg overflow-hidden border border-cyber-600 bg-[#0d0d12] shadow-2xl relative group/code w-full">
      <div className="flex justify-between items-center px-4 py-2 bg-cyber-800 border-b border-cyber-600">
        <span className="text-xs uppercase font-mono text-cyber-accent font-bold tracking-wider">{language || 'SCRIPT'}</span>
        <button 
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-white transition-colors bg-cyber-700/50 hover:bg-cyber-600 px-2 py-1 rounded"
        >
          {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
          {copied ? "COPIED" : "COPY"}
        </button>
      </div>
      <div className="relative overflow-x-auto">
        <pre className="p-4 font-mono text-sm leading-6 text-gray-300 w-full whitespace-pre">
          <code dangerouslySetInnerHTML={{ __html: highlightCode(code) }} />
        </pre>
      </div>
    </div>
  );
};

// --- COMPONENT: Markdown Renderer ---
const MarkdownRenderer = ({ content }: { content: string }) => {
  const parts = content.split(/```(\w+)?\n([\s\S]*?)```/g);

  return (
    <div className="markdown-content w-full">
      {parts.map((part, index) => {
        if (index % 3 === 2) {
          const language = parts[index - 1];
          return <CodeBlock key={index} language={language || 'text'} code={part.trim()} />;
        } else if (index % 3 === 1) {
          return null;
        } else {
          let formatted = part
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') 
            .replace(/`([^`]+)`/g, '<code class="bg-cyber-700/50 text-cyber-accent px-1.5 py-0.5 rounded text-sm font-mono border border-cyber-600">$1</code>') 
            .replace(/\n/g, '<br />'); 

          return <div key={index} dangerouslySetInnerHTML={{ __html: formatted }} className="break-words" />;
        }
      })}
    </div>
  );
};

const getDefaultMessage = (): ChatMessage => ({ 
  role: 'model', 
  text: 'Greetings. I am **Cipher_AI** (Created by **Biruk Getachew**). \n\nI generate **Production-Grade Exploits** and **Security Scripts**. How can I assist?', 
  timestamp: new Date()
});

const AIChat: React.FC<AIChatProps> = ({ context, user }) => {
  const [input, setInput] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null); // Base64 Data URI
  const [messages, setMessages] = useState<ChatMessage[]>([getDefaultMessage()]);
  const [loading, setLoading] = useState(false);
  const [typingIndex, setTypingIndex] = useState(0); 
  const [displayResponse, setDisplayResponse] = useState(''); 
  
  // History State
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Scroll State
  const [autoScroll, setAutoScroll] = useState(true);
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load Sessions on User Login (Async)
  useEffect(() => {
    const fetchHistory = async () => {
      if (user) {
        const userSessions = await AuthService.getSessions(user.uid);
        setSessions(userSessions);
        
        setMessages([getDefaultMessage()]);
        setActiveSessionId(null);
        resetChatSession();
      } else {
        setSessions([]);
        setMessages([getDefaultMessage()]);
        setActiveSessionId(null);
        resetChatSession();
      }
    };
    fetchHistory();
  }, [user]);

  // SMART SCROLL LOGIC
  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    
    // If user is within 50px of bottom, enable auto-scroll. Otherwise, disable it.
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;
    setAutoScroll(isAtBottom);
    setShowScrollBtn(!isAtBottom);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    setAutoScroll(true);
  };

  useEffect(() => {
    if (autoScroll) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, displayResponse, autoScroll]);

  // TYPING EFFECT - OPTIMIZED SPEED
  useEffect(() => {
    const lastMsg = messages[messages.length - 1];
    if (lastMsg.role === 'model' && typingIndex < lastMsg.text.length) {
      // CHANGED: Increased delay from 1ms to 30ms to prevent freezing on mobile
      const speed = 30; 
      const timeout = setTimeout(() => {
        // Detect if we are inside a code block to dump chunks
        const remainingText = lastMsg.text.slice(typingIndex);
        const isCodeBlock = remainingText.startsWith('`') || lastMsg.text.slice(0, typingIndex).split('```').length % 2 === 0;
        
        // INCREMENT SIZES: Moderate chunks to keep UI responsive
        const increment = isCodeBlock ? 10 : 5; 
        
        setDisplayResponse(lastMsg.text.slice(0, typingIndex + increment));
        setTypingIndex(prev => prev + increment);
      }, speed);
      return () => clearTimeout(timeout);
    } else if (lastMsg.role === 'model') {
       setDisplayResponse(lastMsg.text);
    }
  }, [typingIndex, messages]);

  // --- ACTIONS ---

  const handleNewChat = () => {
    resetChatSession();
    setMessages([getDefaultMessage()]);
    setActiveSessionId(null);
    setIsHistoryOpen(false);
    setSelectedImage(null);
  };

  const loadSession = async (session: ChatSession) => {
    const parsedMessages = session.messages.map(m => ({
      ...m,
      // Handle Firebase Timestamps that might be objects
      timestamp: m.timestamp instanceof Date ? m.timestamp : new Date((m.timestamp as any).seconds * 1000)
    }));

    setMessages(parsedMessages);
    setActiveSessionId(session.id);
    setDisplayResponse(parsedMessages[parsedMessages.length-1].text);
    setTypingIndex(999999);
    setIsHistoryOpen(false);
    setSelectedImage(null);
    
    // Force scroll to bottom on load
    setTimeout(() => scrollToBottom(), 100);

    await startNewSession(parsedMessages);
  };

  const handleDeleteSession = async (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    if (user) {
      await AuthService.deleteSession(sessionId);
      const updated = await AuthService.getSessions(user.uid);
      setSessions(updated);
      if (activeSessionId === sessionId) {
        handleNewChat();
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Image Compression Logic using Canvas
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          // Max dimension limit (e.g., 800px) to prevent massive base64 strings
          const MAX_SIZE = 800;
          if (width > height) {
            if (width > MAX_SIZE) {
              height *= MAX_SIZE / width;
              width = MAX_SIZE;
            }
          } else {
            if (height > MAX_SIZE) {
              width *= MAX_SIZE / height;
              height = MAX_SIZE;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            // Convert to base64 with 0.7 quality jpeg
            const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
            setSelectedImage(compressedBase64);
          }
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSend = async () => {
    if (!input.trim() && !selectedImage) return;

    const userMsgText = input;
    const userMsgImage = selectedImage || undefined;
    
    setInput('');
    setSelectedImage(null);
    if (textareaRef.current) textareaRef.current.style.height = 'auto';

    const newUserMsg: ChatMessage = { 
      role: 'user', 
      text: userMsgText, 
      image: userMsgImage,
      timestamp: new Date() 
    };
    
    setMessages(prev => [...prev, newUserMsg]);
    setLoading(true);
    setTypingIndex(0);
    setDisplayResponse('');
    setAutoScroll(true); // Force scroll to see user message

    let currentId = activeSessionId;
    let currentHistory = [...messages, newUserMsg];

    if (user) {
      if (!currentId) {
        const newSession = await AuthService.createSession(user.uid, newUserMsg);
        if (newSession) {
          currentId = newSession.id;
          setActiveSessionId(currentId);
          const s = await AuthService.getSessions(user.uid);
          setSessions(s);
        }
      } else {
        await AuthService.saveSessionMessages(currentId, [...messages, newUserMsg]);
        const s = await AuthService.getSessions(user.uid);
        setSessions(s);
      }
    }

    // Pass the image data (if any) to the service
    const responseText = await askCyberTutor(userMsgText, context, currentHistory, userMsgImage || undefined);

    setLoading(false);
    
    const newAiMsg: ChatMessage = { role: 'model', text: responseText, timestamp: new Date() };
    const finalMessages = [...messages, newUserMsg, newAiMsg];
    
    setMessages(finalMessages);

    if (user && currentId) {
      await AuthService.saveSessionMessages(currentId, finalMessages);
      const s = await AuthService.getSessions(user.uid);
      setSessions(s);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInputResize = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 150)}px`;
  };

  const downloadChatLog = () => {
    const log = messages.map(m => `[${m.timestamp.toLocaleString()}] ${m.role.toUpperCase()}: \n${m.text}\n${m.image ? '[IMAGE ATTACHED]' : ''}\n-------------------`).join('\n\n');
    const blob = new Blob([log], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cipher_log_${new Date().toISOString()}.txt`;
    a.click();
  };

  return (
    <div className="flex flex-col h-[650px] bg-cyber-800/80 backdrop-blur-xl border border-cyber-600 rounded-xl overflow-hidden shadow-2xl relative group">
      
      {/* HEADER */}
      <div className="bg-cyber-900/90 backdrop-blur-md p-4 border-b border-cyber-600 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-cyber-accent blur opacity-50 animate-pulse"></div>
            <div className="bg-cyber-900 p-2 rounded-full border border-cyber-accent relative z-10">
              <Bot className="text-cyber-accent" size={20} />
            </div>
          </div>
          <div>
             <span className="font-black text-cyber-text block text-lg tracking-wide flex items-center gap-2">
               CIPHER_AI <Sparkles size={12} className="text-yellow-400" />
             </span>
             <span className="text-[10px] uppercase tracking-widest text-cyber-purple font-bold">
                {user ? `USER: ${user.username}` : 'GUEST MODE'}
             </span>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
           <button 
             onClick={handleNewChat}
             title="New Chat"
             className="p-2 rounded-lg bg-cyber-accent/10 text-cyber-accent hover:bg-cyber-accent hover:text-black transition-all mr-1"
           >
             <Plus size={18} />
           </button>

           {user && (
             <button 
               onClick={() => setIsHistoryOpen(!isHistoryOpen)}
               title="History"
               className={`p-2 rounded-lg transition-all mr-2 ${isHistoryOpen ? 'bg-cyber-700 text-white' : 'bg-cyber-800 text-gray-400 hover:text-white'}`}
             >
               <History size={18} />
             </button>
           )}

           <button onClick={downloadChatLog} title="Export Log" className="p-2 rounded hover:bg-cyber-700 text-cyber-subtext hover:text-cyber-accent transition-colors">
             <Download size={16} />
           </button>
        </div>
      </div>

      {/* MAIN LAYOUT */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* CHAT AREA */}
        <div className="flex-1 flex flex-col min-w-0 relative">
          
          {/* Scroll Container */}
          <div 
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth bg-cyber-800/30 w-full custom-scrollbar"
          >
            {messages.map((msg, idx) => {
              const isLast = idx === messages.length - 1;
              const isModel = msg.role === 'model';
              const content = (isModel && isLast && !loading) ? displayResponse : msg.text;

              return (
                <div key={idx} className={`flex gap-4 animate-slide-up w-full ${isModel ? '' : 'flex-row-reverse'}`}>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg ${
                    isModel ? 'bg-cyber-900 border border-cyber-accent/50 text-cyber-accent' : 'bg-indigo-600 border border-indigo-400 text-white'
                  }`}>
                    {isModel ? <Terminal size={16} /> : <User size={16} />}
                  </div>

                  <div className={`relative max-w-[95%] lg:max-w-[90%] group/msg`}>
                    <div className={`p-4 rounded-2xl shadow-xl backdrop-blur-sm border ${
                      isModel ? 'bg-cyber-900/95 border-cyber-600 text-cyber-text rounded-tl-none' : 'bg-indigo-600 text-white rounded-tr-none border-indigo-500'
                    }`}>
                      {msg.image && (
                        <div className="mb-3 rounded-lg overflow-hidden border border-white/20">
                          <img src={msg.image} alt="User Upload" className="max-w-full max-h-64 object-contain" />
                        </div>
                      )}
                      {isModel ? <MarkdownRenderer content={content} /> : <div className="whitespace-pre-wrap text-sm">{content}</div>}
                    </div>
                    
                    <div className={`text-[10px] text-cyber-subtext mt-1 font-mono flex gap-2 ${isModel ? 'justify-start' : 'justify-end'}`}>
                      <span>{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      {user && activeSessionId && !isModel && idx > 0 && <span className="flex items-center gap-1 text-green-500"><Save size={8}/> Saved</span>}
                    </div>
                  </div>
                </div>
              );
            })}

            {loading && (
              <div className="flex gap-4 animate-slide-up">
                 <div className="w-8 h-8 rounded-lg bg-cyber-900 border border-cyber-accent/30 flex items-center justify-center">
                  <Loader2 size={16} className="animate-spin text-cyber-accent" />
                </div>
                <div className="p-4 bg-cyber-900/50 rounded-2xl rounded-tl-none border border-cyber-600 flex items-center gap-3">
                  <span className="flex gap-1">
                    <span className="w-2 h-2 bg-cyber-accent rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-2 h-2 bg-cyber-purple rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-2 h-2 bg-pink-500 rounded-full animate-bounce"></span>
                  </span>
                  <span className="text-xs text-cyber-accent font-mono animate-pulse">ANALYZING INPUT...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Jump to Bottom Button */}
          {showScrollBtn && (
            <button 
              onClick={scrollToBottom}
              className="absolute bottom-20 right-8 bg-cyber-accent text-black p-3 rounded-full shadow-lg hover:bg-white transition-all animate-bounce z-30"
            >
              <ArrowDown size={20} />
            </button>
          )}

          {/* PREVIEW AREA */}
          {selectedImage && (
            <div className="bg-cyber-900 border-t border-cyber-600 px-4 pt-4 pb-0 flex items-center">
              <div className="relative group inline-block">
                <img src={selectedImage} alt="Preview" className="h-16 w-auto rounded border border-cyber-accent object-cover" />
                <button 
                  onClick={() => setSelectedImage(null)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600"
                >
                  <X size={12} />
                </button>
              </div>
            </div>
          )}

          {/* INPUT AREA */}
          <div className="p-4 bg-cyber-900 border-t border-cyber-600 backdrop-blur z-20">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-cyber-accent to-cyber-purple rounded-lg blur opacity-20 group-focus-within:opacity-100 transition duration-500"></div>
              <div className="relative flex items-end bg-cyber-800 rounded-lg border border-cyber-600">
                {/* File Upload Trigger */}
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  ref={fileInputRef} 
                  onChange={handleFileSelect}
                />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="m-2 p-2.5 rounded-lg text-cyber-subtext hover:bg-cyber-700 hover:text-white transition-colors"
                  title="Upload Image"
                >
                  <Paperclip size={20} />
                </button>

                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={handleInputResize}
                  onKeyDown={handleKeyDown}
                  placeholder={user ? "Enter command..." : "Login to chat..."}
                  className="flex-1 bg-transparent border-none px-2 py-3 text-cyber-text placeholder-cyber-subtext focus:outline-none focus:ring-0 font-mono text-sm resize-none min-h-[50px] max-h-[150px] overflow-y-auto custom-scrollbar"
                  rows={1}
                />
                <button 
                  onClick={handleSend}
                  disabled={loading || (!input.trim() && !selectedImage)}
                  className="m-2 p-2.5 rounded-lg bg-cyber-accent/10 text-cyber-accent hover:bg-cyber-accent hover:text-black transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0"
                >
                  <Send size={20} className={loading ? 'opacity-0' : 'opacity-100'} />
                  {loading && <div className="absolute inset-0 flex items-center justify-center"><Loader2 className="animate-spin" size={20} /></div>}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* HISTORY SIDEBAR */}
        <div className={`absolute top-0 right-0 h-full w-64 bg-cyber-900/95 backdrop-blur-xl border-l border-cyber-600 transform transition-transform duration-300 z-30 flex flex-col ${isHistoryOpen ? 'translate-x-0' : 'translate-x-full'}`}>
           <div className="p-4 border-b border-cyber-600 flex justify-between items-center bg-black/20">
             <span className="font-bold text-cyber-accent flex items-center gap-2"><History size={16}/> HISTORY</span>
             <button onClick={() => setIsHistoryOpen(false)} className="text-gray-500 hover:text-white"><X size={18}/></button>
           </div>
           
           <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2">
             {sessions.length === 0 && (
               <div className="text-center text-gray-500 text-xs mt-10 p-4">
                 {loading ? 'Loading...' : 'No history found.\nStart a new chat!'}
               </div>
             )}
             
             {sessions.map(session => (
               <div 
                 key={session.id}
                 onClick={() => loadSession(session)}
                 className={`p-3 rounded-lg cursor-pointer border group relative transition-all ${activeSessionId === session.id ? 'bg-cyber-800 border-cyber-accent' : 'border-transparent hover:bg-cyber-800 hover:border-cyber-600'}`}
               >
                 <div className="text-sm font-bold text-gray-200 truncate pr-6 mb-1">{session.title}</div>
                 <div className="text-[10px] text-gray-500 font-mono">
                   {/* Handle potentially async timestamps if not fully normalized */}
                   {session.lastModified instanceof Date ? session.lastModified.toLocaleDateString() : 'Recent'}
                 </div>
                 
                 <button 
                   onClick={(e) => handleDeleteSession(e, session.id)}
                   className="absolute right-2 top-3 text-gray-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                 >
                   <Trash2 size={14} />
                 </button>
               </div>
             ))}
           </div>
           
           <button onClick={handleNewChat} className="m-3 p-3 bg-cyber-accent text-black font-bold rounded flex items-center justify-center gap-2 hover:bg-white transition-colors">
             <Plus size={18} /> NEW CHAT
           </button>
        </div>
      </div>
    </div>
  );
};

export default AIChat;
