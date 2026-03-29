import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  Send,
  Paperclip,
  Smile,
  MoreVertical,
  Phone,
  Video,
  Check,
  CheckCheck,
  ArrowLeft,
  Image as ImageIcon,
  File,
  Mic
} from "lucide-react";
import { toast } from "sonner";
import { useMessages } from "../../hooks/useMessages";

// ============================================
// SAMPLE ATHLETES - Can be replaced with real athlete data
// ============================================

const SAMPLE_ATHLETES = [
  { id: "athlete-1", name: "João Silva", avatar: "JS" },
  { id: "athlete-2", name: "Maria Santos", avatar: "MS" },
  { id: "athlete-3", name: "Pedro Costa", avatar: "PC" },
  { id: "athlete-4", name: "Ana Rodrigues", avatar: "AR" },
  { id: "athlete-5", name: "Carlos Mendes", avatar: "CM" },
  { id: "athlete-6", name: "Sofia Almeida", avatar: "SA" }
];

export function Messages() {
  const {
    conversations,
    getMessages,
    sendMessage,
    receiveMessage,
    getOrCreateConversation,
    markConversationAsRead
  } = useMessages();

  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [messageText, setMessageText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // ============================================
  // INIT: Create conversations for sample athletes if none exist
  // ============================================

  useEffect(() => {
    if (conversations.length === 0) {
      // Initialize conversations for sample athletes
      SAMPLE_ATHLETES.forEach(athlete => {
        getOrCreateConversation(athlete.id, athlete.name, athlete.avatar);
      });
    }
  }, []);

  // ============================================
  // SELECTED CONVERSATION
  // ============================================

  const selectedConv = conversations.find(c => c.id === selectedConversationId);
  const messages = selectedConversationId ? getMessages(selectedConversationId) : [];

  // Mark as read when opening conversation
  useEffect(() => {
    if (selectedConversationId) {
      markConversationAsRead(selectedConversationId);
    }
  }, [selectedConversationId, markConversationAsRead]);

  // ============================================
  // HANDLERS
  // ============================================

  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedConversationId) return;

    sendMessage(selectedConversationId, messageText);
    setMessageText("");
    toast.success("Mensagem enviada");

    // Simulate reply after 2-5 seconds (mock)
    const delay = 2000 + Math.random() * 3000;
    setTimeout(() => {
      if (selectedConv) {
        const replies = [
          "Recebi! Obrigado 😊",
          "Perfeito, vejo-te lá!",
          "Está bem, vou preparar-me",
          "Obrigado pela informação!",
          "Combinado 👍"
        ];
        const randomReply = replies[Math.floor(Math.random() * replies.length)];
        receiveMessage(selectedConversationId, selectedConv.athleteId, randomReply);
      }
    }, delay);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatMessageTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);

    if (minutes < 1) return "Agora";
    if (minutes < 60) return `${minutes}min`;
    if (hours < 24) return `${hours}h`;
    return date.toLocaleDateString();
  };

  const formatLastMessageTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 5) return "Há 5 min";
    if (minutes < 60) return `Há ${minutes} min`;
    if (hours < 1) return "Há 1 hora";
    if (hours < 24) return `Há ${hours} hora${hours > 1 ? 's' : ''}`;
    if (days === 1) return "Ontem";
    return `Há ${days} dias`;
  };

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white pb-20 sm:pb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
        {/* ✅ Day 12: Already responsive - flex-col mobile, flex-row desktop */}
        <div className="flex flex-col sm:flex-row gap-4 h-[calc(100vh-120px)]">
          {/* Conversations List - Hide on mobile when chat is selected */}
          <div className={`${selectedConversationId && 'hidden sm:flex'} sm:w-96 flex flex-col rounded-2xl border border-slate-200 bg-white overflow-hidden`}>
            {/* Header */}
            <div className="p-4 border-b border-slate-200">
              <h2 className="font-semibold text-slate-900 mb-3">Mensagens</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Procurar conversas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-xl bg-white/90 focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all"
                />
              </div>
            </div>

            {/* Conversations */}
            <div className="flex-1 overflow-y-auto">
              {filteredConversations.map((conv) => (
                <motion.button
                  key={conv.id}
                  whileHover={{ backgroundColor: "rgba(241, 245, 249, 0.5)" }}
                  onClick={() => setSelectedConversationId(conv.id)}
                  className={`w-full p-4 border-b border-slate-100 text-left transition-all ${
                    selectedConversationId === conv.id ? 'bg-sky-50 border-l-4 border-l-sky-500' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className={`h-12 w-12 rounded-full bg-gradient-to-br ${
                        conv.online ? 'from-emerald-500 to-emerald-600' : 'from-slate-400 to-slate-500'
                      } flex items-center justify-center text-white font-semibold`}>
                        {conv.avatar}
                      </div>
                      {conv.online && (
                        <div className="absolute bottom-0 right-0 h-3 w-3 bg-emerald-500 border-2 border-white rounded-full" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-slate-900 truncate">{conv.name}</h3>
                        <span className="text-xs text-slate-500">{formatLastMessageTime(new Date(conv.lastMessageTime))}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className={`text-sm truncate ${conv.unreadCount > 0 ? 'font-medium text-slate-900' : 'text-slate-600'}`}>
                          {conv.typing ? (
                            <span className="text-emerald-600 italic">A escrever...</span>
                          ) : (
                            conv.lastMessage
                          )}
                        </p>
                        {conv.unreadCount > 0 && (
                          <span className="ml-2 h-5 w-5 rounded-full bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center shrink-0">
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          {selectedConversationId ? (
            <div className="flex-1 flex flex-col rounded-2xl border border-slate-200 bg-white overflow-hidden">
              {/* Chat Header */}
              <div className="p-4 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSelectedConversationId(null)}
                    className="sm:hidden h-8 w-8 rounded-lg hover:bg-slate-100 flex items-center justify-center"
                  >
                    <ArrowLeft className="h-5 w-5 text-slate-600" />
                  </button>
                  <div className="relative">
                    <div className={`h-10 w-10 rounded-full bg-gradient-to-br ${
                      selectedConv?.online ? 'from-emerald-500 to-emerald-600' : 'from-slate-400 to-slate-500'
                    } flex items-center justify-center text-white font-semibold`}>
                      {selectedConv?.avatar}
                    </div>
                    {selectedConv?.online && (
                      <div className="absolute bottom-0 right-0 h-3 w-3 bg-emerald-500 border-2 border-white rounded-full" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">{selectedConv?.name}</h3>
                    <p className="text-xs text-slate-500">
                      {selectedConv?.online ? 'Online' : 'Offline'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="h-9 w-9 rounded-lg hover:bg-slate-100 flex items-center justify-center"
                  >
                    <Phone className="h-4 w-4 text-slate-600" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="h-9 w-9 rounded-lg hover:bg-slate-100 flex items-center justify-center"
                  >
                    <Video className="h-4 w-4 text-slate-600" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="h-9 w-9 rounded-lg hover:bg-slate-100 flex items-center justify-center"
                  >
                    <MoreVertical className="h-4 w-4 text-slate-600" />
                  </motion.button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
                {messages.map((message, index) => {
                  const isMe = message.senderId === "me";
                  const showAvatar = index === 0 || messages[index - 1].senderId !== message.senderId;
                  const showTime = index === messages.length - 1 || 
                    messages[index + 1].senderId !== message.senderId ||
                    messages[index + 1].timestamp.getTime() - message.timestamp.getTime() > 300000;

                  return (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`flex ${isMe ? 'justify-end' : 'justify-start'} items-end gap-2`}
                    >
                      {!isMe && showAvatar && (
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white text-xs font-semibold shrink-0">
                          {selectedConv?.avatar}
                        </div>
                      )}
                      {!isMe && !showAvatar && <div className="w-8 shrink-0" />}

                      <div className={`max-w-[70%] ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                        <div
                          className={`px-4 py-2 rounded-2xl ${
                            isMe
                              ? 'bg-gradient-to-r from-sky-500 to-sky-600 text-white rounded-br-sm'
                              : 'bg-white border border-slate-200 text-slate-900 rounded-bl-sm'
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap break-words">{message.text}</p>
                        </div>
                        {showTime && (
                          <div className={`flex items-center gap-1 mt-1 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                            <span className="text-xs text-slate-400">
                              {formatMessageTime(message.timestamp)}
                            </span>
                            {isMe && (
                              <div>
                                {message.read ? (
                                  <CheckCheck className="h-3 w-3 text-sky-500" />
                                ) : (
                                  <Check className="h-3 w-3 text-slate-400" />
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-slate-200 bg-white">
                <div className="flex items-end gap-2">
                  <div className="flex gap-1">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="h-9 w-9 rounded-lg hover:bg-slate-100 flex items-center justify-center"
                    >
                      <Paperclip className="h-4 w-4 text-slate-600" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="h-9 w-9 rounded-lg hover:bg-slate-100 flex items-center justify-center"
                    >
                      <ImageIcon className="h-4 w-4 text-slate-600" />
                    </motion.button>
                  </div>

                  <div className="flex-1 relative">
                    <textarea
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Escrever mensagem..."
                      rows={1}
                      className="w-full px-4 py-2 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all resize-none max-h-32"
                      style={{ minHeight: '36px' }}
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="h-9 w-9 rounded-lg hover:bg-slate-100 flex items-center justify-center"
                  >
                    <Smile className="h-4 w-4 text-slate-600" />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSendMessage}
                    disabled={!messageText.trim()}
                    className={`h-9 w-9 rounded-lg flex items-center justify-center transition-all ${
                      messageText.trim()
                        ? 'bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-md'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    <Send className="h-4 w-4" />
                  </motion.button>
                </div>
              </div>
            </div>
          ) : (
            <div className="hidden sm:flex flex-1 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 items-center justify-center">
              <div className="text-center">
                <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                  <Send className="h-8 w-8 text-slate-400" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-1">Seleciona uma conversa</h3>
                <p className="text-sm text-slate-600">Escolhe um atleta para começar a conversar</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}