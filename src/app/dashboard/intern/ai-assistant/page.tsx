'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { 
  Bot, 
  Send, 
  Mic, 
  Trash2, 
  Copy, 
  Check, 
  ArrowRight,
  Plus,
  Search,
  Edit2,
  CheckSquare,
  RefreshCw,
  FolderOpen,
  MessageSquare,
  AlertTriangle,
  Menu,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdDate: string;
}

export default function AIAssistant() {
  const { theme } = useApp();
  
  // States for Conversations History
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  
  // UI states
  const [searchQuery, setSearchQuery] = useState('');
  const [input, setInput] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Inner sidebar visibility
  const [editingTitleId, setEditingTitleId] = useState<string | null>(null);
  const [editTitleText, setEditTitleText] = useState('');
  const [micActive, setMicActive] = useState(false);
  
  // Copy to clipboard tracker
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Streaming and API response states
  const [isStreaming, setIsStreaming] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);

  // Load chats on mount
  useEffect(() => {
    const localChats = localStorage.getItem('yaksha_chats');
    if (localChats) {
      try {
        const parsed = JSON.parse(localChats);
        setConversations(parsed);
        if (parsed.length > 0) {
          setActiveChatId(parsed[0].id);
        }
      } catch (e) {
        console.error('Failed to parse chats', e);
      }
    }
  }, []);

  // Save chats helper
  const saveChats = (list: Conversation[]) => {
    setConversations(list);
    localStorage.setItem('yaksha_chats', JSON.stringify(list));
  };

  // Auto-scroll chat to bottom
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversations, activeChatId, isStreaming]);

  const activeChat = conversations.find(c => c.id === activeChatId) || null;

  // New Chat
  const handleNewChat = () => {
    const newChat: Conversation = {
      id: `chat-${Date.now()}`,
      title: 'New Conversation',
      messages: [],
      createdDate: new Date().toLocaleDateString()
    };
    const list = [newChat, ...conversations];
    saveChats(list);
    setActiveChatId(newChat.id);
    setApiError(null);
  };

  // Delete Chat
  const handleDeleteChat = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this chat session?")) {
      const list = conversations.filter(c => c.id !== id);
      saveChats(list);
      if (activeChatId === id) {
        setActiveChatId(list.length > 0 ? list[0].id : null);
      }
    }
  };

  // Start Rename Chat Mode
  const startEditingTitle = (chat: Conversation, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingTitleId(chat.id);
    setEditTitleText(chat.title);
  };

  // Save Renamed Chat Title
  const saveChatTitle = (id: string) => {
    if (!editTitleText.trim()) return;
    const list = conversations.map(c => c.id === id ? { ...c, title: editTitleText } : c);
    saveChats(list);
    setEditingTitleId(null);
  };

  // Search filter
  const filteredConversations = conversations.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Custom client SSE parser for streaming completions from /api/chat
  const startAiStreaming = async (chatId: string, updatedMessages: Message[]) => {
    setIsStreaming(true);
    setApiError(null);

    // Context System Prompt
    const systemPrompt = {
  role: "system",
  content: `
You are Yaksha AI, the official InternFlow Internship Assistant.

Your mission is to guide interns throughout their internship journey.

You can help with:
- Internship onboarding
- Internship roadmap
- Coursework progress
- MERN learning track
- Team formation
- Standup meetings
- Deliverables and submissions
- Project milestones
- GitHub workflow and pull requests
- Resources and templates
- Announcements
- Certificates and badges

InternFlow Timeline:
- Week 1: Orientation, Fundamentals of AI, Team Formation, FAQ Project
- Weeks 2-4: MERN Coursework + FAQ Project
- Week 4: Deliverable Submission + Phase 2 Team Formation
- Weeks 5-8: Project Development, Pull Requests, Mentor Reviews
- Daily Standups: Mandatory throughout the internship

Response Style:
- Friendly and supportive
- Concise but informative
- Action-oriented
- Internship-focused

For non-InternFlow topics, politely redirect users to a general-purpose AI assistant.

Always behave as Yaksha AI and prioritize internship-related assistance.
`
};

    const payloadMessages = [
      systemPrompt,
      ...updatedMessages.map(m => ({
        role: m.role,
        content: m.content
      }))
    ];

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ messages: payloadMessages })
      });

      if (!res.ok) {
        const errPayload = await res.json().catch(() => ({}));
        if (errPayload.error) {
          setApiError(errPayload.error);
        } else {
          setApiError('Unable to generate response. Please try again.');
        }
        setIsStreaming(false);
        return;
      }

      if (!res.body) {
        setApiError('Unable to generate response. Please try again.');
        setIsStreaming(false);
        return;
      }

      // Append initial blank assistant card to active messages
      const assistantMsgId = `ai-msg-${Date.now()}`;
      const initialAssistantMsg: Message = {
        id: assistantMsgId,
        role: 'assistant',
        content: '',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      // Set chat with initial assistant container
      setConversations(prev => {
        const updated = prev.map(chat => {
          if (chat.id === chatId) {
            return { ...chat, messages: [...chat.messages, initialAssistantMsg] };
          }
          return chat;
        });
        localStorage.setItem('yaksha_chats', JSON.stringify(updated));
        return updated;
      });

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let currentContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          const cleanLine = line.trim();
          if (cleanLine.startsWith('data: ')) {
            const dataStr = cleanLine.substring(6).trim();
            if (dataStr === '[DONE]') continue;

            try {
              const parsed = JSON.parse(dataStr);
              const content = parsed.choices?.[0]?.delta?.content || '';
              if (content) {
                currentContent += content;

                // Reactively update active chat messages text
                setConversations(prev => {
                  const updated = prev.map(chat => {
                    if (chat.id === chatId) {
                      return {
                        ...chat,
                        messages: chat.messages.map(m => m.id === assistantMsgId ? { ...m, content: currentContent } : m)
                      };
                    }
                    return chat;
                  });
                  localStorage.setItem('yaksha_chats', JSON.stringify(updated));
                  return updated;
                });
              }
            } catch (e) {
              // Ignore partial parsing errors
            }
          }
        }
      }
    } catch (e) {
      console.error(e);
      setApiError('Unable to generate response. Please try again.');
    } finally {
      setIsStreaming(false);
    }
  };

  // Submit Message
  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;
    
    let targetChatId = activeChatId;
    let currentChats = [...conversations];

    // If no chats exist, initialize new chat
    if (!targetChatId) {
      targetChatId = `chat-${Date.now()}`;
      const newChat: Conversation = {
        id: targetChatId,
        title: text.length > 22 ? text.substring(0, 22) + '...' : text,
        messages: [],
        createdDate: new Date().toLocaleDateString()
      };
      currentChats = [newChat, ...conversations];
      setConversations(currentChats);
      setActiveChatId(targetChatId);
    } else {
      // If active chat has 0 messages, set title matching prompt query
      currentChats = conversations.map(c => {
        if (c.id === targetChatId && c.messages.length === 0) {
          return { ...c, title: text.length > 22 ? text.substring(0, 22) + '...' : text };
        }
        return c;
      });
      setConversations(currentChats);
    }

    const userMsg: Message = {
      id: `user-msg-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedChats = currentChats.map(c => {
      if (c.id === targetChatId) {
        return { ...c, messages: [...c.messages, userMsg] };
      }
      return c;
    });

    saveChats(updatedChats);

    const activeChatObj = updatedChats.find(c => c.id === targetChatId);
    if (activeChatObj) {
      await startAiStreaming(targetChatId, activeChatObj.messages);
    }
  };

  // Form Submit Handler
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isStreaming) return;
    handleSendMessage(input);
    setInput('');
  };

  // If an external page (FAQ) set a pending query, consume it and send immediately
  useEffect(() => {
    try {
      const pending = localStorage.getItem('yaksha_incoming_query');
      if (pending) {
        localStorage.removeItem('yaksha_incoming_query');
        // If a pending query exists, send it as a new message
        setTimeout(() => {
          // Use handleSendMessage to create/activate a chat and stream response
          handleSendMessage(pending);
        }, 60);
      }
    } catch (err) {
      console.error('Error reading pending incoming query', err);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Click suggestion handler
  const handleSuggestionClick = (prompt: string) => {
    if (isStreaming) return;
    handleSendMessage(prompt);
  };

  // Regenerate last response
  const handleRegenerate = async () => {
    if (!activeChatId || isStreaming) return;
    
    const activeChatObj = conversations.find(c => c.id === activeChatId);
    if (!activeChatObj || activeChatObj.messages.length === 0) return;

    // Filter out the last AI message
    const messagesCopy = [...activeChatObj.messages];
    const lastMsg = messagesCopy[messagesCopy.length - 1];

    if (lastMsg.role === 'assistant') {
      messagesCopy.pop(); // Remove it
    }

    // Save chat without last assistant message
    const updatedChats = conversations.map(c => {
      if (c.id === activeChatId) {
        return { ...c, messages: messagesCopy };
      }
      return c;
    });

    saveChats(updatedChats);
    await startAiStreaming(activeChatId, messagesCopy);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Custom parser to format bold, bullets, links, and code blocks
  const renderMessageContent = (content: string, msgId: string) => {
    const parts = content.split('```');
    
    return parts.map((part, index) => {
      // Odd indices represent code blocks
      if (index % 2 === 1) {
        const lines = part.split('\n');
        const lang = lines[0].trim() || 'code';
        const codeText = lines.slice(1).join('\n').trim();

        return (
          <div key={index} className="my-3 border border-white/5 rounded-xl overflow-hidden bg-slate-950 font-mono text-[11px] text-gray-300">
            <div className="flex justify-between items-center px-4 py-2 bg-slate-900 border-b border-white/5 text-[9px] font-bold text-gray-500 uppercase tracking-wider">
              <span>{lang}</span>
              <button
                onClick={() => handleCopy(`${msgId}-code-${index}`, codeText)}
                className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
              >
                {copiedId === `${msgId}-code-${index}` ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400 font-bold uppercase">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy code</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-4 overflow-x-auto leading-relaxed">
              <code>{codeText}</code>
            </pre>
          </div>
        );
      }

      // Even indices represent normal text, let's parse basic inline elements (bold, links, lists)
      const lines = part.split('\n');
      return (
        <div key={index} className="space-y-2 leading-relaxed text-xs">
          {lines.map((line, lineIdx) => {
            const isBullet = line.trim().startsWith('* ') || line.trim().startsWith('- ');
            const isNumbered = /^\d+\.\s/.test(line.trim());
            
            let parsedLine = line.trim();
            if (isBullet) {
              parsedLine = parsedLine.substring(2);
            } else if (isNumbered) {
              const dotIdx = parsedLine.indexOf('.');
              parsedLine = parsedLine.substring(dotIdx + 1).trim();
            }

            const boldRegex = /\*\*(.*?)\*\*/g;
            const linkRegex = /\[(.*?)\]\((.*?)\)/g;

            const hasBold = boldRegex.test(parsedLine);
            const hasLink = linkRegex.test(parsedLine);

            let contentNode: React.ReactNode = parsedLine;

            boldRegex.lastIndex = 0;
            linkRegex.lastIndex = 0;

            if (hasBold || hasLink) {
              contentNode = (
                <span dangerouslySetInnerHTML={{
                  __html: parsedLine
                    .replace(boldRegex, '<strong class="font-bold text-gray-200">$1</strong>')
                    .replace(linkRegex, '<a href="$2" target="_blank" rel="noreferrer" class="text-blue-400 hover:underline font-semibold">$1</a>')
                }} />
              );
            }

            if (isBullet) {
              return (
                <li key={lineIdx} className="list-disc pl-2 ml-4 text-gray-300">
                  {contentNode}
                </li>
              );
            }
            if (isNumbered) {
              return (
                <div key={lineIdx} className="pl-2 ml-4 flex gap-1.5 text-gray-300">
                  <span className="font-bold text-blue-400">{lineIdx + 1}.</span>
                  <span>{contentNode}</span>
                </div>
              );
            }
            if (parsedLine === '') {
              return <div key={lineIdx} className="h-2"></div>;
            }

            return <p key={lineIdx} className="text-gray-300">{contentNode}</p>;
          })}
        </div>
      );
    });
  };

  const quickPrompts = [
    "What is the internship roadmap?",
    "How do I submit my deliverable?",
    "How do I form a team?",
    "Where can I find learning resources?",
    "When are standup meetings?",
    "How do badges and certificates work?",
"Show latest announcements",
"What should I complete this week?"
  ];

  return (
    <div className="h-[calc(100vh-10rem)] border border-white/5 bg-[#111827]/40 rounded-2xl overflow-hidden shadow-2xl flex select-none relative">
      
      {/* Inner Chat History Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 260, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="h-full bg-slate-950/60 border-r border-white/5 flex flex-col justify-between shrink-0 overflow-hidden relative"
          >
            {/* Sidebar Header Actions */}
            <div className="p-4 space-y-3.5">
              <button
                onClick={handleNewChat}
                className="w-full py-2.5 px-4 rounded-xl border border-white/10 hover:border-blue-500/30 hover:bg-blue-600/5 text-gray-200 hover:text-blue-400 font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md bg-slate-900"
              >
                <Plus className="w-4 h-4" />
                <span>New Chat</span>
              </button>

              {/* History Search Box */}
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-600">
                  <Search className="w-3.5 h-3.5" />
                </span>
                <input
                  type="text"
                  placeholder="Search chats..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="glass-input w-full pl-8.5 pr-3 py-1.5 rounded-lg text-[11px]"
                />
              </div>
            </div>

            {/* Chats List Scroll container */}
            <div className="flex-1 overflow-y-auto px-2 space-y-1 py-1">
              {filteredConversations.length > 0 ? (
                filteredConversations.map((chat) => {
                  const isActive = chat.id === activeChatId;
                  const isEditing = editingTitleId === chat.id;

                  return (
                    <div
                      key={chat.id}
                      onClick={() => {
                        if (!isEditing) {
                          setActiveChatId(chat.id);
                          setApiError(null);
                        }
                      }}
                      className={`group flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-all border ${
                        isActive 
                          ? 'bg-blue-600/10 border-blue-500/20 text-blue-400' 
                          : 'bg-transparent border-transparent text-gray-400 hover:bg-white/2 hover:text-gray-200'
                      }`}
                    >
                      <div className="flex items-center gap-2 flex-1 overflow-hidden">
                        <MessageSquare className="w-3.5 h-3.5 shrink-0 text-gray-500 group-hover:text-gray-300" />
                        
                        {isEditing ? (
                          <input
                            type="text"
                            value={editTitleText}
                            onChange={(e) => setEditTitleText(e.target.value)}
                            onBlur={() => saveChatTitle(chat.id)}
                            onKeyDown={(e) => e.key === 'Enter' && saveChatTitle(chat.id)}
                            className="bg-slate-900 border border-blue-500 text-white rounded px-1.5 py-0.5 text-[10px] w-full focus:outline-none"
                            autoFocus
                            onClick={(e) => e.stopPropagation()}
                          />
                        ) : (
                          <span className="truncate pr-1">{chat.title}</span>
                        )}
                      </div>

                      {/* Hover controls */}
                      {!isEditing && isActive && (
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => startEditingTitle(chat, e)}
                            className="p-1 rounded hover:bg-slate-900 text-gray-500 hover:text-white"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={(e) => handleDeleteChat(chat.id, e)}
                            className="p-1 rounded hover:bg-slate-900 text-gray-500 hover:text-red-400"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-gray-600 text-[10px] font-bold uppercase tracking-wider">
                  No chats found
                </div>
              )}
            </div>

            {/* Workspace Footer details */}
            <div className="p-3 bg-slate-900/40 border-t border-white/5 text-[9px] text-gray-500 font-semibold text-center">
              Storage: Client-side Persistent Memory
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col justify-between h-full bg-transparent overflow-hidden">
        
        {/* Chat Upper Header bar */}
        <div className="px-6 py-4 bg-slate-900/60 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-1.5 rounded-lg bg-gray-800/40 border border-white/5 text-gray-400 hover:text-white cursor-pointer mr-1.5"
              title="Toggle Chats List"
            >
              <Menu className="w-4 h-4" />
            </button>
            <div className="p-2 rounded-xl bg-purple-600/10 border border-purple-500/15 text-purple-400 shadow-md">
              <Bot className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-gray-200">
                {activeChat ? activeChat.title : "Yaksha AI Assistant"}
              </h3>
              <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
                <span>Active Streaming Engine</span>
              </span>
            </div>
          </div>
        </div>

        {/* Chat Messages Log */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">
          
          {/* Welcome Screen if chat has no messages */}
          {(!activeChat || activeChat.messages.length === 0) ? (
            <div className="max-w-2xl mx-auto py-8 space-y-8 select-none">
              
              {/* Hi Kaustav welcome label */}
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-extrabold text-white tracking-tight">Hi Kaustav 👋</h2>
                <h3 className="text-base font-extrabold text-blue-400">I'm Yaksha AI.</h3>
                <p className="text-gray-400 text-xs font-medium"> I can help you navigate the internship, understand coursework, track deliverables, learn about teams, certificates, standups, resources, and project workflows.</p>
              </div>

              {/* Helper list */}
              <div className="glass-panel p-5 rounded-2xl shadow-md border border-white/5 space-y-3.5">
                <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">I can help with:</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center text-xs font-bold text-gray-300">
                  {["Internship Roadmap", "Coursework", "Teams", "Standups", "Deliverables", "Certificates", "Resources", "Announcements"].map(item => (
                    <div key={item} className="p-2 rounded-xl bg-slate-900 border border-white/5">
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Prompts Suggestions */}
              <div className="space-y-3">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Select a Quick Prompt to start:</span>
                <div className="flex flex-wrap gap-2.5">
                  {quickPrompts.map((promptText, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSuggestionClick(promptText)}
                      className="py-2 px-3 rounded-xl bg-slate-900 border border-white/5 text-[10px] font-semibold text-gray-300 hover:text-blue-400 hover:border-blue-500/25 transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <span>{promptText}</span>
                      <ArrowRight className="w-3 h-3 text-gray-600 group-hover:text-blue-400" />
                    </button>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            
            // Conversation Messages logs
            <div className="space-y-6">
              {activeChat.messages.map((msg) => {
                const isAi = msg.role === 'assistant';
                return (
                  <div 
                    key={msg.id} 
                    className={`flex gap-4 max-w-[85%] ${isAi ? 'mr-auto text-left' : 'ml-auto flex-row-reverse text-right'}`}
                  >
                    {/* Avatar icon */}
                    <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-xs font-bold shadow-md border ${
                      isAi 
                        ? 'bg-purple-600/10 text-purple-400 border-purple-500/20' 
                        : 'bg-blue-600/10 text-blue-400 border-blue-500/20'
                    }`}>
                      {isAi ? <Bot className="w-4.5 h-4.5" /> : 'K'}
                    </div>

                    {/* Chat Bubble card */}
                    <div className="space-y-1.5 group relative">
                      <div className={`p-4 rounded-2xl relative shadow-md border ${
                        isAi 
                          ? 'bg-slate-900 border-white/5 text-gray-300 rounded-tl-sm' 
                          : 'bg-blue-600 border-blue-500 text-white rounded-tr-sm'
                      }`}>
                        
                        {isAi ? (
                          renderMessageContent(msg.content, msg.id)
                        ) : (
                          <p className="text-xs leading-relaxed font-semibold">{msg.content}</p>
                        )}

                        {/* Interactive triggers (Copy) on hover */}
                        {isAi && (
                          <div className="absolute right-3.5 bottom-3.5 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity flex items-center gap-1.5">
                            <button
                              onClick={() => handleCopy(msg.id, msg.content)}
                              className="p-1 rounded bg-slate-950 text-gray-500 hover:text-white border border-white/5 cursor-pointer"
                              title="Copy Response"
                            >
                              {copiedId === msg.id ? (
                                <Check className="w-3 h-3 text-emerald-400" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          </div>
                        )}

                      </div>
                      
                      {/* Timestamp */}
                      <span className="text-[9px] text-gray-500 font-semibold block">{msg.timestamp}</span>
                    </div>

                  </div>
                );
              })}
            </div>
          )}

          {/* SSE Streaming dots indicator */}
          {isStreaming && activeChat && activeChat.messages.length > 0 && activeChat.messages[activeChat.messages.length - 1].content === '' && (
            <div className="flex gap-4 max-w-[85%] mr-auto text-left animate-pulse">
              <div className="w-8 h-8 rounded-full bg-purple-600/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
                <Bot className="w-4.5 h-4.5" />
              </div>
              <div className="p-4 rounded-2xl bg-slate-900 border border-white/5 flex items-center gap-1.5 rounded-tl-sm">
                <span className="w-2 h-2 rounded-full bg-purple-500 animate-[bounce_1.2s_infinite]"></span>
                <span className="w-2 h-2 rounded-full bg-purple-500 animate-[bounce_1.2s_0.2s_infinite]"></span>
                <span className="w-2 h-2 rounded-full bg-purple-500 animate-[bounce_1.2s_0.4s_infinite]"></span>
              </div>
            </div>
          )}

          <div ref={scrollRef}></div>
        </div>

        {/* Input workspace & error display banner */}
        <div className="px-6 py-4 bg-slate-900/60 border-t border-white/5 space-y-4">
          
          {/* API Error Box */}
          {apiError && (
            <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold">
              <AlertTriangle className="w-4.5 h-4.5 shrink-0" />
              <span>{apiError}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleFormSubmit} className="flex gap-2 items-center">
            
            {/* Input wrap */}
            <div className="relative flex-1">
              <input
                type="text"
                placeholder={isStreaming ? "Yaksha AI is thinking..." : "Ask Yaksha AI a question or click suggestions..."}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isStreaming}
                className="glass-input w-full pl-4 pr-12 py-3 rounded-xl text-xs font-semibold"
              />
              
              {/* Mic mock button */}
              <button
                type="button"
                onClick={() => {
                  setMicActive(!micActive);
                  if (!micActive) {
                    alert("Yaksha AI: Voice input initialized. Speak standard coding or coordinate queries.");
                  }
                }}
                disabled={isStreaming}
                className={`absolute inset-y-0 right-2 pr-3 flex items-center transition-colors cursor-pointer ${
                  micActive ? 'text-red-400 animate-pulse' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                <Mic className="w-4 h-4" />
              </button>
            </div>

            {/* Regenerate Action button (only shown if messages exist) */}
            {activeChat && activeChat.messages.length > 0 && !isStreaming && (
              <button
                type="button"
                onClick={handleRegenerate}
                className="p-3 rounded-xl bg-slate-900 border border-white/5 text-gray-400 hover:text-white cursor-pointer transition-colors"
                title="Regenerate Last Response"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            )}

            {/* Send */}
            <button
              type="submit"
              disabled={!input.trim() || isStreaming}
              className="py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-600/10 cursor-pointer flex items-center justify-center shrink-0 active:scale-98"
            >
              <Send className="w-4.5 h-4.5" />
            </button>

          </form>

        </div>

      </div>

    </div>
  );
}
