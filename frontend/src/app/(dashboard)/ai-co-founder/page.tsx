"use client";

import { Send, Bot, User, Mail, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { getChatHistory, sendChatMessage, draftEmail, sendDraft } from "@/lib/api";

type Message = {
  id?: string;
  role: "user" | "assistant";
  content: string;
};

type DraftState = {
  recipientEmail: string;
  recipientName: string;
  prompt: string;
  subject?: string;
  body?: string;
  senderEmail: string;
  senderPassword: string;
  status: 'idle' | 'drafting' | 'review' | 'sending' | 'sent' | 'error';
  error?: string;
};

export default function AICoFounderPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Email Modal State
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [draftState, setDraftState] = useState<DraftState>({
    recipientEmail: "",
    recipientName: "",
    prompt: "",
    senderEmail: "",
    senderPassword: "",
    status: 'idle'
  });

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchHistory = async () => {
    try {
      const data = await getChatHistory();
      setMessages(data);
    } catch (err) {
      console.error("Failed to fetch chat history", err);
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { role: "user" as const, content: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const data = await sendChatMessage(userMessage.content);
      setMessages(prev => [...prev, { role: "assistant", content: data.content }]);
    } catch (err) {
      console.error("Failed to send message", err);
      setMessages(prev => [...prev, { role: "assistant", content: "Sorry, I am having trouble connecting to the server right now." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDraftEmail = async () => {
    if (!draftState.recipientEmail || !draftState.recipientName || !draftState.prompt) return;
    
    setDraftState(prev => ({ ...prev, status: 'drafting', error: undefined }));
    try {
      const res = await draftEmail(
        draftState.recipientEmail,
        draftState.recipientName,
        draftState.prompt,
        false,
        draftState.senderEmail || undefined,
        draftState.senderPassword || undefined
      );
      setDraftState(prev => ({
        ...prev,
        status: 'review',
        subject: res.draft.subject,
        body: res.draft.body
      }));
    } catch (e: any) {
      setDraftState(prev => ({ ...prev, status: 'error', error: e.message || "Failed to draft email." }));
    }
  };

  const handleSendEmail = async () => {
    if (!draftState.recipientEmail || !draftState.subject || !draftState.body) return;
    
    setDraftState(prev => ({ ...prev, status: 'sending', error: undefined }));
    try {
      await sendDraft(
        draftState.recipientEmail,
        draftState.subject,
        draftState.body,
        draftState.senderEmail || undefined,
        draftState.senderPassword || undefined
      );
      setDraftState(prev => ({ ...prev, status: 'sent' }));
      
      // Auto close after success
      setTimeout(() => {
        setIsEmailModalOpen(false);
        setDraftState({ recipientEmail: "", recipientName: "", prompt: "", senderEmail: "", senderPassword: "", status: 'idle' });
      }, 2000);
      
    } catch (e: any) {
      setDraftState(prev => ({ ...prev, status: 'error', error: e.message || "Failed to send email." }));
    }
  };


  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-80px)] flex flex-col pt-4 relative">
      
      {/* Email Modal Overlay */}
      {isEmailModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[var(--bg-primary)] border border-[var(--border-default)] w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-6 border-b border-[var(--border-default)]">
              <h2 className="font-serif text-2xl text-[var(--text-primary)] flex items-center gap-2">
                <Mail className="w-5 h-5 text-[var(--accent-primary)]" />
                AI Email Agent
              </h2>
              <button 
                onClick={() => setIsEmailModalOpen(false)}
                className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-6">
              {draftState.error && (
                <div className="p-4 bg-red-500/10 border border-red-500/50 text-red-500 text-sm">
                  {draftState.error}
                </div>
              )}
              
              {draftState.status === 'sent' ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-16 h-16 bg-green-500/10 border border-green-500/50 rounded-full flex items-center justify-center mx-auto">
                    <Send className="w-8 h-8 text-green-500" />
                  </div>
                  <h3 className="font-sans text-xl text-[var(--text-primary)]">Email Sent Successfully!</h3>
                  <p className="text-[var(--text-secondary)]">Your email to {draftState.recipientEmail} is on its way.</p>
                </div>
              ) : (
                <>
                  {/* Sender Credentials */}
                  <div className="p-4 bg-[var(--bg-secondary)] border border-[var(--border-default)] space-y-3">
                    <p className="text-xs font-mono uppercase text-[var(--accent-primary)] tracking-wide">Send from your Gmail</p>
                    <p className="text-xs text-[var(--text-secondary)]">Enter your Gmail and App Password so the email comes from your account. <a href="https://myaccount.google.com/apppasswords" target="_blank" rel="noopener noreferrer" className="text-[var(--accent-primary)] underline">Get App Password →</a></p>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-mono uppercase text-[var(--text-secondary)]">Your Gmail</label>
                        <input 
                          type="email" 
                          value={draftState.senderEmail}
                          onChange={e => setDraftState(prev => ({...prev, senderEmail: e.target.value}))}
                          disabled={draftState.status !== 'idle'}
                          className="w-full bg-[var(--bg-primary)] border border-[var(--border-default)] p-3 text-[var(--text-primary)] focus:border-[var(--accent-primary)] outline-none text-sm"
                          placeholder="you@gmail.com"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-mono uppercase text-[var(--text-secondary)]">App Password</label>
                        <input 
                          type="password" 
                          value={draftState.senderPassword}
                          onChange={e => setDraftState(prev => ({...prev, senderPassword: e.target.value}))}
                          disabled={draftState.status !== 'idle'}
                          className="w-full bg-[var(--bg-primary)] border border-[var(--border-default)] p-3 text-[var(--text-primary)] focus:border-[var(--accent-primary)] outline-none text-sm"
                          placeholder="xxxx xxxx xxxx xxxx"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Recipient Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-mono uppercase text-[var(--text-secondary)]">Recipient Email</label>
                      <input 
                        type="email" 
                        value={draftState.recipientEmail}
                        onChange={e => setDraftState(prev => ({...prev, recipientEmail: e.target.value}))}
                        disabled={draftState.status !== 'idle'}
                        className="w-full bg-[var(--bg-secondary)] border border-[var(--border-default)] p-3 text-[var(--text-primary)] focus:border-[var(--accent-primary)] outline-none"
                        placeholder="client@example.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-mono uppercase text-[var(--text-secondary)]">Recipient Name</label>
                      <input 
                        type="text" 
                        value={draftState.recipientName}
                        onChange={e => setDraftState(prev => ({...prev, recipientName: e.target.value}))}
                        disabled={draftState.status !== 'idle'}
                        className="w-full bg-[var(--bg-secondary)] border border-[var(--border-default)] p-3 text-[var(--text-primary)] focus:border-[var(--accent-primary)] outline-none"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase text-[var(--text-secondary)]">What should the email say?</label>
                    <textarea 
                      value={draftState.prompt}
                      onChange={e => setDraftState(prev => ({...prev, prompt: e.target.value}))}
                      disabled={draftState.status !== 'idle'}
                      className="w-full bg-[var(--bg-secondary)] border border-[var(--border-default)] p-3 text-[var(--text-primary)] focus:border-[var(--accent-primary)] outline-none h-24 resize-none"
                      placeholder="Follow up on the web design proposal I sent last week..."
                    />
                  </div>
                  
                  {draftState.status === 'review' && (
                    <div className="mt-8 border-t border-[var(--border-default)] pt-6 space-y-4">
                      <h3 className="font-sans font-medium text-[var(--text-primary)] mb-2 flex items-center gap-2">
                        <Bot className="w-4 h-4 text-[var(--accent-primary)]" />
                        AI Draft Preview
                      </h3>
                      
                      <div className="bg-[var(--bg-secondary)] border border-[var(--border-default)] p-4 space-y-4">
                        <div>
                          <span className="text-[var(--text-secondary)] text-sm mr-2">Subject:</span>
                          <span className="text-[var(--text-primary)] font-medium">{draftState.subject}</span>
                        </div>
                        <div className="w-full h-px bg-[var(--border-default)]" />
                        <div className="text-[var(--text-primary)] whitespace-pre-wrap font-sans text-sm leading-relaxed">
                          {draftState.body}
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
            
            <div className="p-6 border-t border-[var(--border-default)] flex justify-end gap-4 bg-[var(--bg-secondary)]">
              {draftState.status === 'idle' || draftState.status === 'error' ? (
                <button 
                  onClick={handleDraftEmail}
                  disabled={!draftState.recipientEmail || !draftState.recipientName || !draftState.prompt}
                  className="bg-[var(--accent-primary)] hover:bg-[#c25e34] text-[var(--bg-primary)] px-6 py-2 font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  <Bot className="w-4 h-4" />
                  Generate Draft
                </button>
              ) : draftState.status === 'drafting' ? (
                <button disabled className="bg-[var(--bg-primary)] border border-[var(--accent-primary)] text-[var(--accent-primary)] px-6 py-2 font-medium opacity-75 animate-pulse">
                  Drafting with AI...
                </button>
              ) : draftState.status === 'review' ? (
                <>
                  <button 
                    onClick={() => setDraftState(prev => ({...prev, status: 'idle'}))}
                    className="px-6 py-2 border border-[var(--border-default)] text-[var(--text-primary)] hover:bg-[var(--bg-primary)] transition-colors"
                  >
                    Edit Instructions
                  </button>
                  <button 
                    onClick={handleSendEmail}
                    className="bg-green-600 hover:bg-green-500 text-white px-6 py-2 font-medium transition-colors flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Send Email Now
                  </button>
                </>
              ) : draftState.status === 'sending' ? (
                <button disabled className="bg-green-600 text-white px-6 py-2 font-medium opacity-75 animate-pulse">
                  Sending...
                </button>
              ) : null}
            </div>
          </div>
        </div>
      )}

      {/* Main Chat Interface */}
      <div className="flex-1 overflow-y-auto space-y-6 pb-4 no-scrollbar">
        {messages.length === 0 && (
          <div className="flex gap-4">
             <div className="w-8 h-8 rounded border border-[var(--border-default)] flex items-center justify-center shrink-0 bg-[var(--bg-secondary)]">
              <Bot className="w-4 h-4 text-[var(--accent-primary)]" />
            </div>
            <div className="space-y-4">
              <p className="font-sans text-[var(--text-primary)] leading-relaxed">
                Loading AI Co-Founder...
              </p>
            </div>
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className="flex gap-4">
            <div className={`w-8 h-8 rounded border border-[var(--border-default)] flex items-center justify-center shrink-0 ${msg.role === 'assistant' ? 'bg-[var(--bg-secondary)]' : 'bg-[var(--bg-primary)]'}`}>
              {msg.role === 'assistant' ? (
                <Bot className="w-4 h-4 text-[var(--accent-primary)]" />
              ) : (
                <User className="w-4 h-4 text-[var(--text-secondary)]" />
              )}
            </div>
            <div className="space-y-4">
              <p className="font-sans text-[var(--text-primary)] leading-relaxed mt-1">
                {msg.content}
              </p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded border border-[var(--border-default)] flex items-center justify-center shrink-0 bg-[var(--bg-secondary)] animate-pulse">
              <Bot className="w-4 h-4 text-[var(--accent-primary)]" />
            </div>
            <div className="space-y-4">
              <p className="font-sans text-[var(--text-secondary)] leading-relaxed mt-1">
                Thinking...
              </p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="bg-[var(--bg-primary)] pt-4 pb-8 mt-auto shrink-0 border-t border-[var(--border-default)]">
        <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar pb-2">
          <button 
            onClick={() => setIsEmailModalOpen(true)}
            className="whitespace-nowrap px-4 py-1.5 bg-[var(--accent-primary)] text-[var(--bg-primary)] hover:bg-[#c25e34] text-xs font-mono uppercase tracking-wide transition-colors flex items-center gap-2"
          >
            <Mail className="w-3 h-3" />
            Draft Email
          </button>
          {["Find new clients", "Write a proposal", "Review my rates", "Improve profile"].map((action) => (
            <button 
              key={action} 
              onClick={() => setInput(action)}
              className="whitespace-nowrap px-4 py-1.5 bg-[var(--bg-secondary)] border border-[var(--border-default)] hover:border-[var(--text-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-xs font-mono uppercase tracking-wide transition-colors"
            >
              {action}
            </button>
          ))}
        </div>
        <div className="relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask your AI Co-Founder to do something..."
            className="w-full bg-[var(--bg-secondary)] border border-[var(--border-default)] focus:border-[var(--accent-primary)] rounded-none px-4 py-4 pr-12 text-[var(--text-primary)] placeholder-[var(--text-secondary)] resize-none h-16 outline-none transition-colors"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <button 
            onClick={handleSendMessage}
            disabled={isLoading || !input.trim()}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
