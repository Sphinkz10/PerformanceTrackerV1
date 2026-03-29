import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Send, Sparkles, Brain, Lightbulb, TrendingUp, Users, BarChart3 } from "lucide-react";
import { toast } from "sonner";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerateReport: (config: any) => void;
}

const QUICK_QUESTIONS = [
  "Mostra-me a progressão do João no agachamento",
  "Como está a carga de treino da Maria?",
  "Comparar João vs Maria em força",
  "Quem tem melhor aderência esta semana?",
  "Relatório de recuperação da equipa"
];

const MOCK_RESPONSES: Record<string, Message> = {
  default: {
    id: "1",
    role: "assistant",
    content: "Olá! Sou o assistente de análise do PerformTrack. Posso ajudar a:\n\n• Analisar progressão de atletas\n• Comparar métricas\n• Avaliar carga de treino\n• Gerar relatórios personalizados\n\nSobre o que gostaria de analisar hoje?",
    timestamp: new Date(),
    suggestions: QUICK_QUESTIONS.slice(0, 3)
  },
  progressao: {
    id: "2",
    role: "assistant",
    content: "Vamos analisar a progressão do João no Agachamento Livre. Tenho dados desde Janeiro.\n\n📈 ENCONTREI:\n• Progressão de 12% em 4 meses\n• Melhor recorde: 120kg (há 2 semanas)\n• Consistência: 84% das sessões completadas\n\n🎯 SUGIRO ESTE RELATÓRIO:\n1. Evolução de 1RM (gráfico de linha)\n2. Carga média por sessão (barras)\n3. Comparação com grupo (box plot)",
    timestamp: new Date(),
    suggestions: ["Gerar este relatório", "Adicionar análise de velocidade", "Comparar com Maria"]
  },
  carga: {
    id: "3",
    role: "assistant",
    content: "Análise de carga da Maria:\n\n✅ ACWR: 1.15 (Zona ideal)\n📊 Volume semanal: 850 AU (média: 800 AU)\n🟢 Risco de lesão: Baixo\n\n💡 RECOMENDAÇÕES:\n• Carga bem distribuída\n• Possível aumento de 5-10% próxima semana\n• Manter padrão de recuperação atual",
    timestamp: new Date(),
    suggestions: ["Ver gráfico de carga", "Comparar com mês passado", "Gerar relatório completo"]
  }
};

export function AIAssistantModal({ isOpen, onClose, onGenerateReport }: AIAssistantModalProps) {
  const [messages, setMessages] = useState<Message[]>([
    MOCK_RESPONSES.default
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (message: string = input) => {
    if (!message.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: message,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      let response: Message;
      
      if (message.toLowerCase().includes("progressão") || message.toLowerCase().includes("joão")) {
        response = MOCK_RESPONSES.progressao;
      } else if (message.toLowerCase().includes("carga") || message.toLowerCase().includes("maria")) {
        response = MOCK_RESPONSES.carga;
      } else {
        response = {
          id: Date.now().toString(),
          role: "assistant",
          content: `Entendi que quer saber sobre "${message}". Vou preparar uma análise completa para você!\n\n📊 Dados encontrados\n💡 Gerando insights...\n✨ Relatório pronto em breve!`,
          timestamp: new Date(),
          suggestions: ["Gerar relatório agora", "Adicionar mais métricas", "Ver dados brutos"]
        };
      }

      setMessages(prev => [...prev, { ...response, id: Date.now().toString() }]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSuggestionClick = (suggestion: string) => {
    if (suggestion.toLowerCase().includes("gerar")) {
      toast.success("Gerando relatório baseado na conversa...");
      onGenerateReport({ type: "ai-suggested" });
      onClose();
    } else {
      handleSend(suggestion);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-2xl w-full max-w-3xl max-h-[80vh] overflow-hidden shadow-2xl flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-sky-50 to-violet-50">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-sky-500 to-violet-600 flex items-center justify-center">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-slate-900">Assistente de Análise</h2>
                <p className="text-sm text-slate-600">Powered by IA • Sempre aprendendo</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="h-9 w-9 rounded-lg hover:bg-white/50 flex items-center justify-center transition-colors"
            >
              <X className="h-5 w-5 text-slate-500" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`max-w-[80%] ${message.role === "user" ? "order-2" : "order-1"}`}>
                  {message.role === "assistant" && (
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="h-4 w-4 text-violet-500" />
                      <span className="text-xs font-medium text-slate-600">Assistente</span>
                    </div>
                  )}
                  <div
                    className={`rounded-2xl p-4 ${
                      message.role === "user"
                        ? "bg-gradient-to-br from-sky-500 to-sky-600 text-white"
                        : "bg-slate-100 text-slate-900"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-line leading-relaxed">{message.content}</p>
                  </div>
                  
                  {message.suggestions && (
                    <div className="mt-3 space-y-2">
                      <p className="text-xs font-medium text-slate-600">Sugestões:</p>
                      {message.suggestions.map((suggestion, idx) => (
                        <motion.button
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="w-full text-left px-3 py-2 rounded-lg border-2 border-sky-200 bg-white hover:border-sky-400 hover:bg-sky-50 transition-all text-sm font-medium text-slate-700"
                        >
                          {suggestion}
                        </motion.button>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}

            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2 text-slate-500"
              >
                <div className="flex gap-1">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
                    className="h-2 w-2 rounded-full bg-slate-400"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
                    className="h-2 w-2 rounded-full bg-slate-400"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
                    className="h-2 w-2 rounded-full bg-slate-400"
                  />
                </div>
                <span className="text-sm">Analisando...</span>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions */}
          {messages.length === 1 && (
            <div className="px-6 pb-4">
              <p className="text-xs font-medium text-slate-600 mb-2">Perguntas rápidas:</p>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {QUICK_QUESTIONS.map((question, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(question)}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-sky-100 text-xs font-medium text-slate-700 whitespace-nowrap transition-colors"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-6 border-t bg-slate-50">
            <div className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                placeholder="Digite sua pergunta ou análise desejada..."
                className="flex-1 px-4 py-3 border-2 border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSend()}
                disabled={!input.trim()}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Send className="h-4 w-4" />
                <span className="hidden sm:inline">Enviar</span>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
