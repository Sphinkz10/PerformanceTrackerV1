/**
 * Chat With Coach - Full chat drawer/modal
 * 
 * Features:
 * - Slide-in drawer from right
 * - Message history
 * - Send text messages
 * - Quick replies
 * - Coach typing indicator
 * - Avatar + online status
 * 
 * Design System: 100% compliant with Guidelines.md
 * 
 * @author PerformTrack Team
 * @since Athlete Portal - Phase 4
 */

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, Paperclip, Smile } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface ChatWithCoachProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  id: string;
  sender: 'coach' | 'athlete';
  text: string;
  timestamp: string;
}

export function ChatWithCoach({ isOpen, onClose }: ChatWithCoachProps) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'coach',
      text: 'Olá! Tudo bem? Como correu o treino de hoje?',
      timestamp: '10:30',
    },
    {
      id: '2',
      sender: 'athlete',
      text: 'Correu muito bem! Consegui aumentar a carga no agachamento.',
      timestamp: '10:32',
    },
    {
      id: '3',
      sender: 'coach',
      text: 'Excelente! 💪 Continua assim. Amanhã vamos focar no upper body.',
      timestamp: '10:35',
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!message.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'athlete',
      text: message,
      timestamp: new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages([...messages, newMessage]);
    setMessage('');

    // Simulate coach typing
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const coachReply: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'coach',
        text: 'Recebi! Vou analisar e respondo em breve 👍',
        timestamp: new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, coachReply]);
    }, 2000);
  };

  const quickReplies = [
    '👍 Entendido',
    '❓ Tenho uma dúvida',
    '✅ Confirmo',
    '📅 Precisamos reagendar',
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 w-full sm:w-96 bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-slate-200 bg-gradient-to-r from-emerald-500 to-emerald-600">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src="https://api.dicebear.com/7.x/avataaars/svg?seed=coach"
                      alt="Coach"
                      className="h-10 w-10 rounded-full border-2 border-white"
                    />
                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">João Silva</h3>
                    <p className="text-xs text-emerald-100">Coach • Online</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-white" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
              {messages.map((msg, idx) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`flex ${msg.sender === 'athlete' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                      msg.sender === 'athlete'
                        ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-br-sm'
                        : 'bg-white border border-slate-200 text-slate-900 rounded-bl-sm'
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                    <p
                      className={`text-xs mt-1 ${
                        msg.sender === 'athlete' ? 'text-emerald-100' : 'text-slate-500'
                      }`}
                    >
                      {msg.timestamp}
                    </p>
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-white border border-slate-200 px-4 py-3 rounded-2xl rounded-bl-sm">
                    <div className="flex gap-1">
                      <span className="h-2 w-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="h-2 w-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="h-2 w-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies */}
            <div className="p-3 border-t border-slate-200 bg-white">
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {quickReplies.map((reply) => (
                  <button
                    key={reply}
                    onClick={() => setMessage(reply)}
                    className="px-3 py-1.5 text-xs font-medium rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors whitespace-nowrap"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div className="p-4 border-t border-slate-200 bg-white">
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                  <Paperclip className="h-5 w-5 text-slate-600" />
                </button>
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Escreve uma mensagem..."
                  className="flex-1 px-4 py-2 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-300 transition-all"
                />
                <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                  <Smile className="h-5 w-5 text-slate-600" />
                </button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSend}
                  disabled={!message.trim()}
                  className="p-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <Send className="h-5 w-5" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
