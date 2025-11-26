import React, { useState } from 'react';
import { AlertTriangle, Mail, CheckCircle, FileCode, Search, Eye } from 'lucide-react';

const PhishingSim: React.FC = () => {
  const [selectedEmail, setSelectedEmail] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ isPhishing: boolean; reason: string } | null>(null);
  const [showHeader, setShowHeader] = useState(false);

  const emails = [
    {
      id: 1,
      sender: "security@googIe-support.com",
      realSender: "hacker@evil-server.xyz",
      subject: "Critical Security Alert: Password Expired",
      body: "Dear User, click <a href='#'>here</a> to reset.",
      isPhishing: true,
      headers: "Return-Path: <apache@vps-2938.net>\nReceived: from unknown (HELO evil-server.xyz) (192.168.1.55)\nDKIM-Signature: v=1; a=rsa-sha256; d=googIe-support.com; s=selector1;",
      reason: "Sender spoofing (googIe vs google). Header reveals origin 'evil-server.xyz'."
    },
    {
      id: 2,
      sender: "notifications@github.com",
      realSender: "notifications@github.com",
      subject: "New login from Chrome",
      body: "We noticed a new login. If this was you, ignore this.",
      isPhishing: false,
      headers: "Return-Path: <noreply@github.com>\nReceived: from smtp.github.com (140.82.112.4)\nDKIM-Signature: v=1; a=rsa-sha256; d=github.com;",
      reason: "Legitimate domain, valid headers, no urgency or links."
    }
  ];

  const currentEmail = emails.find(e => e.id === selectedEmail);

  return (
    <div className="space-y-6">
      <div className="bg-cyber-800 p-4 rounded-lg border border-cyber-700">
        <h3 className="text-xl font-bold text-cyber-accent mb-2">Phishing Analysis (Deep Inspector)</h3>
        <p className="text-gray-400 text-sm">Use the <strong>Header Inspector</strong> to find the true origin IP.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-1 space-y-2">
          {emails.map((email) => (
            <button
              key={email.id}
              onClick={() => { setSelectedEmail(email.id); setFeedback(null); setShowHeader(false); }}
              className={`w-full text-left p-3 rounded border transition-colors ${selectedEmail === email.id ? 'bg-cyber-700 border-cyber-accent' : 'bg-cyber-800 border-transparent hover:bg-cyber-700'}`}
            >
              <div className="font-bold text-sm truncate">{email.sender}</div>
              <div className="text-xs text-gray-400 truncate">{email.subject}</div>
            </button>
          ))}
        </div>

        <div className="md:col-span-2 bg-white text-black rounded p-6 relative min-h-[400px]">
          {currentEmail ? (
            <>
              <div className="border-b pb-4 mb-4 flex justify-between items-start">
                 <div>
                    <div className="font-bold text-lg">{currentEmail.subject}</div>
                    <div className="text-sm text-gray-600 flex items-center gap-2 group relative">
                      <Mail size={16} /> {currentEmail.sender}
                      <span className="opacity-0 group-hover:opacity-100 absolute left-0 -top-6 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                         True Identity: {currentEmail.realSender}
                      </span>
                    </div>
                 </div>
                 <button onClick={() => setShowHeader(!showHeader)} className="text-xs bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded flex items-center gap-1">
                    <FileCode size={12} /> View Headers
                 </button>
              </div>

              {showHeader ? (
                <div className="bg-gray-900 text-green-400 p-4 rounded text-xs font-mono mb-4 animate-slide-up">
                  <div className="border-b border-gray-700 mb-2 pb-1 text-gray-500 font-bold">RAW SOURCE HEADERS</div>
                  <pre className="whitespace-pre-wrap">{currentEmail.headers}</pre>
                </div>
              ) : (
                <div className="text-gray-800 whitespace-pre-wrap mb-10" dangerouslySetInnerHTML={{__html: currentEmail.body}}></div>
              )}
              
              <div className="absolute bottom-4 right-4 flex gap-2">
                <button onClick={() => setFeedback({ isPhishing: currentEmail.isPhishing, reason: currentEmail.isPhishing ? "Correct! " + currentEmail.reason : "Wrong! " + currentEmail.reason })} className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2">
                  <CheckCircle size={16} /> Safe
                </button>
                <button onClick={() => setFeedback({ isPhishing: currentEmail.isPhishing, reason: currentEmail.isPhishing ? "Correct! " + currentEmail.reason : "Wrong! " + currentEmail.reason })} className="bg-red-600 text-white px-4 py-2 rounded flex items-center gap-2">
                  <AlertTriangle size={16} /> Phish
                </button>
              </div>
            </>
          ) : <div className="flex items-center justify-center h-full text-gray-400">Select an email</div>}
        </div>
      </div>
      {feedback && <div className={`p-4 rounded border ${feedback.reason.startsWith('Correct') ? 'bg-green-900/30 border-green-500 text-green-200' : 'bg-red-900/30 border-red-500 text-red-200'}`}><strong>Result:</strong> {feedback.reason}</div>}
    </div>
  );
};

export default PhishingSim;