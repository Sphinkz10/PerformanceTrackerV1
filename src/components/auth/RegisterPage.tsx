/**
 * Register Page - PerformTrack Account Creation
 * 
 * Features:
 * - Multi-step registration (3 steps)
 * - Role selection (Coach/Atleta)
 * - Form validation
 * - Password strength indicator
 * - Different onboarding per role
 * 
 * Design System: 100% compliant with Guidelines.md
 * 
 * @author PerformTrack Team
 * @since Athlete Portal - Authentication System
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Mail, Lock, User, Eye, EyeOff, Dumbbell, 
  ArrowRight, ArrowLeft, Users, Activity, CheckCircle, Shield
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { useApp } from '../../contexts/AppContext';

interface RegisterPageProps {
  onLoginClick: () => void;
  onPrivacyClick?: () => void;
  onTermsClick?: () => void;
}

type Step = 1 | 2 | 3;
type Role = 'coach' | 'athlete' | null;

export function RegisterPage({ onLoginClick, onPrivacyClick, onTermsClick }: RegisterPageProps) {
  const { register } = useApp();
  
  // CPL-002: LGPD/GDPR consent
  const [consentPrivacy, setConsentPrivacy] = useState(false);
  const [consentHealth, setConsentHealth] = useState(false);
  
  // Step 1 data
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Step 2 data
  const [selectedRole, setSelectedRole] = useState<Role>(null);
  
  // Step 3 data (Coach)
  const [workspaceName, setWorkspaceName] = useState('');
  const [workspaceType, setWorkspaceType] = useState('gym');
  
  // Step 3 data (Atleta)
  const [coachCode, setCoachCode] = useState('');
  
  // State
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [isLoading, setIsLoading] = useState(false);

  // Password strength
  const getPasswordStrength = (pwd: string): { strength: number; label: string; color: string } => {
    if (pwd.length === 0) return { strength: 0, label: '', color: 'slate' };
    if (pwd.length < 6) return { strength: 1, label: 'Fraca', color: 'red' };
    if (pwd.length < 8) return { strength: 2, label: 'Média', color: 'amber' };
    if (pwd.length < 12) return { strength: 3, label: 'Boa', color: 'emerald' };
    return { strength: 4, label: 'Forte', color: 'emerald' };
  };

  const passwordStrength = getPasswordStrength(password);

  // Step 1 validation
  const validateStep1 = (): boolean => {
    if (!name || !email || !password || !confirmPassword) {
      toast.error('Preencha todos os campos');
      return false;
    }

    if (!email.includes('@')) {
      toast.error('Email inválido');
      return false;
    }

    if (password.length < 6) {
      toast.error('Password deve ter pelo menos 6 caracteres');
      return false;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords não coincidem');
      return false;
    }

    return true;
  };

  // Step 2 validation
  const validateStep2 = (): boolean => {
    if (!selectedRole) {
      toast.error('Seleciona o teu perfil');
      return false;
    }
    return true;
  };

  // Step 3 validation
  const validateStep3 = (): boolean => {
    if (selectedRole === 'coach' && !workspaceName) {
      toast.error('Insere o nome do teu espaço');
      return false;
    }
    // CPL-002: LGPD mandatory consent
    if (!consentPrivacy) {
      toast.error('Deves aceitar a Política de Privacidade e os Termos de Utilização para continuar');
      return false;
    }
    return true;
  };

  // Navigation
  const goToNextStep = () => {
    if (currentStep === 1 && !validateStep1()) return;
    if (currentStep === 2 && !validateStep2()) return;
    
    if (currentStep < 3) {
      setCurrentStep((prev) => (prev + 1) as Step);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as Step);
    }
  };

  // Submit
  const handleSubmit = async () => {
    if (!validateStep3()) return;

    setIsLoading(true);

    try {
      await register({
        name,
        email,
        password,
        role: selectedRole!,
        workspaceName: selectedRole === 'coach' ? workspaceName : undefined,
        coachId: selectedRole === 'athlete' ? coachCode : undefined,
      });
      // Success toast is handled in AppContext
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao criar conta');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', bounce: 0.5 }}
            className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-sky-500 to-sky-600 mb-4"
          >
            <Dumbbell className="h-8 w-8 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Criar Conta</h1>
          <p className="text-sm text-slate-600">
            Passo {currentStep} de 3
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-6 flex gap-2">
          {[1, 2, 3].map((step) => (
            <div
              key={step}
              className={`flex-1 h-1 rounded-full transition-all ${
                step <= currentStep
                  ? 'bg-gradient-to-r from-sky-500 to-sky-600'
                  : 'bg-slate-200'
              }`}
            />
          ))}
        </div>

        {/* Register Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm"
        >
          <AnimatePresence mode="wait">
            {/* STEP 1: Basic Info */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <h2 className="text-xl font-bold text-slate-900 mb-6">Informação Básica</h2>

                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Nome Completo
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

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu@email.com"
                      className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-12 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {/* Password Strength */}
                  {password && (
                    <div className="mt-2">
                      <div className="flex gap-1 mb-1">
                        {[1, 2, 3, 4].map((level) => (
                          <div
                            key={level}
                            className={`flex-1 h-1 rounded-full transition-all ${
                              level <= passwordStrength.strength
                                ? `bg-${passwordStrength.color}-500`
                                : 'bg-slate-200'
                            }`}
                          />
                        ))}
                      </div>
                      <p className={`text-xs text-${passwordStrength.color}-600`}>
                        Força: {passwordStrength.label}
                      </p>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Confirmar Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 2: Role Selection */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <h2 className="text-xl font-bold text-slate-900 mb-6">Quem és tu?</h2>

                <div className="grid grid-cols-1 gap-4">
                  {/* Coach Card */}
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedRole('coach')}
                    className={`p-6 rounded-2xl border-2 text-left transition-all ${
                      selectedRole === 'coach'
                        ? 'border-sky-500 bg-sky-50'
                        : 'border-slate-200 bg-white hover:border-sky-300'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center shrink-0">
                        <Users className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-slate-900 mb-1">🏋️ Sou Treinador</h3>
                        <p className="text-sm text-slate-600 mb-3">
                          Gerir atletas, criar treinos e usar Live Command
                        </p>
                        {selectedRole === 'coach' && (
                          <div className="flex items-center gap-2 text-sky-600">
                            <CheckCircle className="h-4 w-4" />
                            <span className="text-xs font-medium">Selecionado</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.button>

                  {/* Athlete Card */}
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedRole('athlete')}
                    className={`p-6 rounded-2xl border-2 text-left transition-all ${
                      selectedRole === 'athlete'
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-slate-200 bg-white hover:border-emerald-300'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shrink-0">
                        <Activity className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-slate-900 mb-1">💪 Sou Atleta</h3>
                        <p className="text-sm text-slate-600 mb-3">
                          Treinar com um treinador e acompanhar o meu progresso
                        </p>
                        {selectedRole === 'athlete' && (
                          <div className="flex items-center gap-2 text-emerald-600">
                            <CheckCircle className="h-4 w-4" />
                            <span className="text-xs font-medium">Selecionado</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Onboarding */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                {selectedRole === 'coach' ? (
                  <>
                    <h2 className="text-xl font-bold text-slate-900 mb-6">
                      Configura o teu espaço
                    </h2>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Nome do teu espaço/ginásio
                      </label>
                      <input
                        type="text"
                        value={workspaceName}
                        onChange={(e) => setWorkspaceName(e.target.value)}
                        placeholder="Academia Premium"
                        className="w-full px-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Tipo de treino
                      </label>
                      <select
                        value={workspaceType}
                        onChange={(e) => setWorkspaceType(e.target.value)}
                        className="w-full px-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all"
                      >
                        <option value="gym">Ginásio / Academia</option>
                        <option value="personal">Personal Training</option>
                        <option value="team">Equipa Desportiva</option>
                        <option value="crossfit">CrossFit / Funcional</option>
                        <option value="other">Outro</option>
                      </select>
                    </div>
                  </>
                ) : (
                  <>
                    <h2 className="text-xl font-bold text-slate-900 mb-6">
                      Última coisa...
                    </h2>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Código do treinador (opcional)
                      </label>
                      <input
                        type="text"
                        value={coachCode}
                        onChange={(e) => setCoachCode(e.target.value)}
                        placeholder="ABC123"
                        className="w-full px-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-300 transition-all"
                      />
                    </div>

                    <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                      <p className="text-sm text-amber-800">
                        <strong>⚠️ Nota:</strong> Precisas de ser adicionado por um treinador para usar a app.
                        Se não tens código, pede ao teu treinador para te adicionar!
                      </p>
                    </div>
                  </>
                )}
                {/* CPL-002: LGPD / GDPR Consent */}
                <div className="mt-6 space-y-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-start gap-3">
                    <input
                      id="consent-privacy"
                      type="checkbox"
                      checked={consentPrivacy}
                      onChange={(e) => setConsentPrivacy(e.target.checked)}
                      className="mt-1 h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500 shrink-0 cursor-pointer"
                    />
                    <label htmlFor="consent-privacy" className="text-sm text-slate-700 leading-relaxed cursor-pointer">
                      Li e aceito a{' '}
                      <button
                        type="button"
                        onClick={onPrivacyClick}
                        className="text-sky-600 hover:underline font-medium"
                      >
                        Política de Privacidade
                      </button>
                      {' '}e os{' '}
                      <button
                        type="button"
                        onClick={onTermsClick}
                        className="text-sky-600 hover:underline font-medium"
                      >
                        Termos de Utilização
                      </button>
                      . {' '}
                      <span className="text-red-500 font-semibold">* Obrigatório</span>
                    </label>
                  </div>

                  <div className="flex items-start gap-3">
                    <input
                      id="consent-health"
                      type="checkbox"
                      checked={consentHealth}
                      onChange={(e) => setConsentHealth(e.target.checked)}
                      className="mt-1 h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500 shrink-0 cursor-pointer"
                    />
                    <label htmlFor="consent-health" className="text-sm text-slate-600 leading-relaxed cursor-pointer">
                      Autorizo o tratamento dos meus <strong>dados de saúde e desempenho desportivo</strong> para fins de acompanhamento pelo meu treinador. Posso revogar este consentimento a qualquer momento.
                      {' '}
                      <span className="text-slate-400">(Opcional — necessário para métricas avançadas)</span>
                    </label>
                  </div>

                  <div className="flex items-center gap-2 mt-2">
                    <Shield className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <p className="text-xs text-slate-400">
                      Os seus dados são tratados de acordo com a LGPD (Lei 13.709/2018) e RGPD.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex gap-3 mt-6">
            {currentStep > 1 && (
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={goToPreviousStep}
                disabled={isLoading}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold rounded-xl border-2 border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Voltar</span>
              </motion.button>
            )}

            {currentStep < 3 ? (
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={goToNextStep}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-lg shadow-sky-500/30 hover:from-sky-400 hover:to-sky-500 transition-all"
              >
                <span>Continuar</span>
                <ArrowRight className="h-4 w-4" />
              </motion.button>
            ) : (
              <motion.button
                type="button"
                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
                onClick={handleSubmit}
                disabled={isLoading}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/30 hover:from-emerald-400 hover:to-emerald-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>A criar conta...</span>
                  </>
                ) : (
                  <>
                    <span>Criar Conta</span>
                    <CheckCircle className="h-4 w-4" />
                  </>
                )}
              </motion.button>
            )}
          </div>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600">
              Já tens conta?{' '}
              <button
                type="button"
                onClick={onLoginClick}
                className="text-sky-600 hover:text-sky-700 font-semibold transition-colors"
                disabled={isLoading}
              >
                Entrar
              </button>
            </p>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-6 text-center text-xs text-slate-500"
        >
          © 2024 PerformTrack. Todos os direitos reservados.
        </motion.div>
      </motion.div>
    </div>
  );
}
