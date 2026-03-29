import { useState } from "react";
import { motion } from "motion/react";
import {
  X,
  Send,
  Eye,
  Code,
  Sparkles,
  Mail,
  Copy,
  Check
} from "lucide-react";
import { toast } from "sonner";

interface EmailTemplateModalProps {
  form: any;
  onClose: () => void;
  onSend: (config: EmailConfig) => void;
}

interface EmailConfig {
  subject: string;
  message: string;
  recipients: string[];
  includeLink: boolean;
  customLink?: string;
}

export function EmailTemplateModal({ form, onClose, onSend }: EmailTemplateModalProps) {
  const [activeTab, setActiveTab] = useState<"compose" | "preview">("compose");
  const [copied, setCopied] = useState(false);
  const [isSending, setIsSending] = useState(false);
  
  const [config, setConfig] = useState<EmailConfig>({
    subject: `Preencha o formulário: ${form.name}`,
    message: `Olá!\n\nPor favor, preencha o formulário "${form.name}".\n\nEste formulário leva aproximadamente ${form.avgTime} para ser completado.\n\nObrigado!`,
    recipients: [],
    includeLink: true,
    customLink: `https://performtrack.app/forms/${form.id}`
  });

  const [recipientInput, setRecipientInput] = useState("");

  const templates = [
    {
      name: "Convite Formal",
      subject: `Solicitação: ${form.name}`,
      message: `Prezado(a),\n\nVenho por meio desta solicitar o preenchimento do formulário "${form.name}".\n\nO formulário é essencial para [objetivo] e leva aproximadamente ${form.avgTime}.\n\nFico à disposição para quaisquer dúvidas.\n\nAtenciosamente,\n[Seu Nome]`
    },
    {
      name: "Convite Casual",
      subject: `Hey! Preciso que você preencha isso 😊`,
      message: `Olá!\n\nPreciso que você dê uma olhada neste formulário: "${form.name}"\n\nÉ rapidinho, leva só ${form.avgTime}!\n\nValeu! 🙏`
    },
    {
      name: "Lembrete",
      subject: `Lembrete: ${form.name} pendente`,
      message: `Olá!\n\nNotamos que você ainda não completou o formulário "${form.name}".\n\nSe tiver qualquer dúvida, estamos à disposição!\n\nObrigado pela atenção.`
    }
  ];

  const isValidEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const addRecipient = () => {
    const email = recipientInput.trim();
    
    if (!email) {
      toast.error("Digite um email!");
      return;
    }
    
    if (!isValidEmail(email)) {
      toast.error("Email inválido! Use formato: nome@dominio.com");
      return;
    }
    
    if (config.recipients.includes(email)) {
      toast.error("Este email já foi adicionado!");
      return;
    }
    
    setConfig({
      ...config,
      recipients: [...config.recipients, email]
    });
    setRecipientInput("");
    toast.success("Destinatário adicionado!");
  };

  const removeRecipient = (email: string) => {
    setConfig({
      ...config,
      recipients: config.recipients.filter(r => r !== email)
    });
  };

  const applyTemplate = (template: typeof templates[0]) => {
    setConfig({
      ...config,
      subject: template.subject,
      message: template.message
    });
    toast.success(`Template "${template.name}" aplicado!`);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(config.customLink || "");
    setCopied(true);
    toast.success("Link copiado!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSend = async () => {
    if (config.recipients.length === 0) {
      toast.error("Adicione pelo menos um destinatário!");
      return;
    }
    if (!config.subject.trim()) {
      toast.error("Adicione um assunto!");
      return;
    }
    
    setIsSending(true);
    try {
      // Simula envio (2 segundos)
      await new Promise(resolve => setTimeout(resolve, 2000));
      onSend(config);
      toast.success(`Email enviado para ${config.recipients.length} destinatário${config.recipients.length !== 1 ? 's' : ''}!`);
      onClose();
    } catch (error) {
      toast.error("Erro ao enviar email");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-gradient-to-r from-emerald-50 to-white">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
              <Mail className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900">Enviar Formulário por Email</h2>
              <p className="text-sm text-slate-600">Configure e envie para seus atletas</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="h-9 w-9 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors"
          >
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 px-6 pt-4">
          {[
            { id: "compose" as const, label: "Compor", icon: Mail },
            { id: "preview" as const, label: "Preview", icon: Eye }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                  activeTab === tab.id
                    ? "bg-emerald-100 text-emerald-700"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Body */}
        <div className="p-6 max-h-[calc(90vh-250px)] overflow-y-auto">
          {activeTab === "compose" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Templates */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="h-4 w-4 text-amber-500" />
                  <h3 className="font-semibold text-slate-900 text-sm">Templates Rápidos</h3>
                </div>
                {templates.map((template, index) => (
                  <motion.button
                    key={template.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => applyTemplate(template)}
                    className="w-full text-left p-3 rounded-lg border-2 border-slate-200 hover:border-emerald-300 bg-white hover:bg-emerald-50 transition-all"
                  >
                    <p className="text-sm font-medium text-slate-900">{template.name}</p>
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
                      {template.message.substring(0, 60)}...
                    </p>
                  </motion.button>
                ))}
              </div>

              {/* Email Composer */}
              <div className="lg:col-span-2 space-y-4">
                
                {/* Recipients */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Destinatários
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="email"
                      className="flex-1 px-4 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                      placeholder="email@exemplo.com"
                      value={recipientInput}
                      onChange={(e) => setRecipientInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addRecipient();
                        }
                      }}
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={addRecipient}
                      className="px-4 py-2 text-sm font-medium rounded-lg bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition-colors"
                    >
                      Adicionar
                    </motion.button>
                  </div>
                  
                  {/* Recipients List */}
                  {config.recipients.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {config.recipients.map((email) => (
                        <motion.div
                          key={email}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700"
                        >
                          <span className="text-sm">{email}</span>
                          <button
                            onClick={() => removeRecipient(email)}
                            className="hover:bg-emerald-200 rounded-full p-0.5"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Assunto
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                    placeholder="Assunto do email..."
                    value={config.subject}
                    onChange={(e) => setConfig({ ...config, subject: e.target.value })}
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Mensagem
                  </label>
                  <textarea
                    className="w-full px-4 py-3 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/30 resize-none"
                    rows={10}
                    placeholder="Digite sua mensagem..."
                    value={config.message}
                    onChange={(e) => setConfig({ ...config, message: e.target.value })}
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    {config.message.length} caracteres
                  </p>
                </div>

                {/* Include Link */}
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="flex-1">
                    <label className="font-medium text-slate-900 text-sm">
                      Incluir Link do Formulário
                    </label>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Link será adicionado automaticamente ao final do email
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={config.includeLink}
                      onChange={(e) => setConfig({ ...config, includeLink: e.target.checked })}
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                  </label>
                </div>

                {/* Link Preview */}
                {config.includeLink && (
                  <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                    <label className="block text-xs font-medium text-emerald-900 mb-2">
                      Link do Formulário
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        className="flex-1 px-3 py-2 text-sm bg-white border border-emerald-200 rounded-lg"
                        value={config.customLink}
                        onChange={(e) => setConfig({ ...config, customLink: e.target.value })}
                      />
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={copyLink}
                        className="px-3 py-2 rounded-lg bg-white border border-emerald-200 hover:bg-emerald-100 transition-colors"
                      >
                        {copied ? (
                          <Check className="h-4 w-4 text-emerald-600" />
                        ) : (
                          <Copy className="h-4 w-4 text-emerald-600" />
                        )}
                      </motion.button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "preview" && (
            <div className="max-w-2xl mx-auto">
              {/* Email Preview */}
              <div className="rounded-xl border-2 border-slate-300 bg-white overflow-hidden">
                {/* Email Header */}
                <div className="bg-slate-100 px-6 py-4 border-b border-slate-300">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                      <span className="text-white font-semibold">PT</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-900">PerformTrack</p>
                      <p className="text-xs text-slate-500">no-reply@performtrack.app</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-slate-600">
                      <span className="font-medium">Para:</span> {config.recipients.join(", ") || "destinatarios@exemplo.com"}
                    </p>
                    <p className="text-xs text-slate-600">
                      <span className="font-medium">Assunto:</span> {config.subject || "Sem assunto"}
                    </p>
                  </div>
                </div>

                {/* Email Body */}
                <div className="px-6 py-6">
                  <div className="prose prose-sm max-w-none">
                    <div className="whitespace-pre-wrap text-slate-700">
                      {config.message}
                    </div>
                    
                    {config.includeLink && (
                      <div className="mt-6 pt-6 border-t border-slate-200">
                        <motion.a
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          href="#"
                          className="inline-block px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all"
                        >
                          Acessar Formulário →
                        </motion.a>
                        <p className="text-xs text-slate-500 mt-3">
                          Ou copie e cole este link: {config.customLink}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="mt-8 pt-6 border-t border-slate-200">
                    <p className="text-xs text-slate-500 text-center">
                      Este email foi enviado pelo PerformTrack
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-slate-200 bg-slate-50">
          <div className="text-sm text-slate-600">
            {config.recipients.length} destinatário{config.recipients.length !== 1 ? 's' : ''}
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2 text-sm text-slate-700 font-medium hover:bg-slate-200 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <motion.button
              whileHover={{ scale: isSending ? 1 : 1.05 }}
              whileTap={{ scale: isSending ? 1 : 0.95 }}
              onClick={handleSend}
              disabled={isSending}
              className="flex items-center gap-2 px-6 py-2 text-sm bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-medium rounded-lg hover:from-emerald-400 hover:to-emerald-500 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSending ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Enviar Email
                </>
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}