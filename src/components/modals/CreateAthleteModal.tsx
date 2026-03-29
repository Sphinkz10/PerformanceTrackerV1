import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, User, Mail, Phone, Calendar, Dumbbell, Heart } from "lucide-react";

interface CreateAthleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (athleteData: AthleteData) => void;
}

export interface AthleteData {
  name: string;
  email: string;
  phone: string;
  birthDate: string;
  sport: string;
  level: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  medicalNotes?: string;
}

const sports = [
  "Futebol",
  "Atletismo",
  "Basquetebol",
  "Voleibol",
  "Natação",
  "Ténis",
  "Outro"
];

const levels = [
  "Iniciante",
  "Intermédio",
  "Avançado",
  "Profissional"
];

export function CreateAthleteModal({ isOpen, onClose, onComplete }: CreateAthleteModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [sport, setSport] = useState("");
  const [level, setLevel] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("");
  const [medicalNotes, setMedicalNotes] = useState("");

  const handleSubmit = () => {
    if (!isValid) return;

    onComplete({
      name,
      email,
      phone,
      birthDate,
      sport,
      level,
      emergencyContact: emergencyContact || undefined,
      emergencyPhone: emergencyPhone || undefined,
      medicalNotes: medicalNotes || undefined
    });

    // Reset
    setName("");
    setEmail("");
    setPhone("");
    setBirthDate("");
    setSport("");
    setLevel("");
    setEmergencyContact("");
    setEmergencyPhone("");
    setMedicalNotes("");
  };

  const isValid = name !== "" && email !== "" && phone !== "" && birthDate !== "" && sport !== "" && level !== "";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-xl max-w-2xl w-full my-8"
            >
              {/* Header */}
              <div className="p-6 border-b border-slate-200">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center">
                      <User className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h2 className="font-semibold text-slate-900">Novo Atleta</h2>
                      <p className="text-sm text-slate-600 mt-0.5">Preencha os dados do atleta</p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="h-8 w-8 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors"
                  >
                    <X className="h-4 w-4 text-slate-400" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4 max-h-[600px] overflow-y-auto">
                {/* Informação Básica */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 mb-3">Informação Básica</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Nome Completo *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="João Silva"
                          className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Email *
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="joao@email.com"
                            className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Telefone *
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+351 912 345 678"
                            className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Data de Nascimento *
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                          type="date"
                          value={birthDate}
                          onChange={(e) => setBirthDate(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Informação Desportiva */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 mb-3">Informação Desportiva</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Desporto *
                      </label>
                      <div className="relative">
                        <Dumbbell className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                        <select
                          value={sport}
                          onChange={(e) => setSport(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all appearance-none cursor-pointer"
                        >
                          <option value="">Selecionar desporto</option>
                          {sports.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Nível *
                      </label>
                      <select
                        value={level}
                        onChange={(e) => setLevel(e.target.value)}
                        className="w-full px-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all appearance-none cursor-pointer"
                      >
                        <option value="">Selecionar nível</option>
                        {levels.map((l) => (
                          <option key={l} value={l}>{l}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Contacto de Emergência */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 mb-3">Contacto de Emergência (Opcional)</h3>
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Nome
                        </label>
                        <input
                          type="text"
                          value={emergencyContact}
                          onChange={(e) => setEmergencyContact(e.target.value)}
                          placeholder="Maria Silva"
                          className="w-full px-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Telefone
                        </label>
                        <input
                          type="tel"
                          value={emergencyPhone}
                          onChange={(e) => setEmergencyPhone(e.target.value)}
                          placeholder="+351 912 345 678"
                          className="w-full px-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notas Médicas */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 mb-3">Notas Médicas (Opcional)</h3>
                  <div className="relative">
                    <Heart className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <textarea
                      value={medicalNotes}
                      onChange={(e) => setMedicalNotes(e.target.value)}
                      rows={4}
                      placeholder="Alergias, condições médicas, limitações físicas..."
                      className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="p-6 border-t border-slate-200 flex items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className="flex-1 px-4 py-2 text-sm font-semibold rounded-xl border-2 border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-all"
                >
                  Cancelar
                </motion.button>
                <motion.button
                  whileHover={{ scale: isValid ? 1.02 : 1 }}
                  whileTap={{ scale: isValid ? 0.98 : 1 }}
                  onClick={handleSubmit}
                  disabled={!isValid}
                  className={`flex-1 px-4 py-2 text-sm font-semibold rounded-xl text-white shadow-md transition-all ${
                    isValid
                      ? "bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-400 hover:to-sky-500"
                      : "bg-slate-300 cursor-not-allowed"
                  }`}
                >
                  Criar Atleta
                </motion.button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
