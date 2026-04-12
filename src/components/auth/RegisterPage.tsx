import { useState } from 'react';
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
  const [consentPrivacy, setConsentPrivacy] = useState(false);
  const [consentHealth, setConsentHealth] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role>(null);
  const [workspaceName, setWorkspaceName] = useState('');
  const [workspaceType, setWorkspaceType] = useState('gym');
  const [coachCode, setCoachCode] = useState('');
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [toasts, setToasts] = useState<{ id: number; msg: string; type?: 'error' | 'info' }[]>([]);

  const showToast = (msg: string, type: 'error' | 'info' = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  };

  const getPasswordStrength = (pwd: string) => {
    if (pwd.length === 0) return { strength: 0, label: '', color: 'transparent' };
    if (pwd.length < 6) return { strength: 1, label: 'Fraca', color: '#ef4444' };
    if (pwd.length < 8) return { strength: 2, label: 'Média', color: '#f59e0b' };
    if (pwd.length < 12) return { strength: 3, label: 'Boa', color: '#10b981' };
    return { strength: 4, label: 'Forte', color: '#FFB701' };
  };
  const pwdStr = getPasswordStrength(password);

  const validateStep1 = () => {
    if (!name || !email || !password || !confirmPassword) { showToast('Preencha todos os campos', 'error'); return false; }
    if (!email.includes('@')) { showToast('Email inválido', 'error'); return false; }
    if (password.length < 6) { showToast('Password deve ter pelo menos 6 caracteres', 'error'); return false; }
    if (password !== confirmPassword) { showToast('Passwords não coincidem', 'error'); return false; }
    return true;
  };
  const validateStep2 = () => { if (!selectedRole) { showToast('Seleciona o teu perfil', 'error'); return false; } return true; };
  const validateStep3 = () => {
    if (selectedRole === 'coach' && !workspaceName) { showToast('Insere o nome do teu espaço', 'error'); return false; }
    if (!consentPrivacy) { showToast('Deves aceitar a Política de Privacidade para continuar', 'error'); return false; }
    return true;
  };

  const goNext = () => {
    if (currentStep === 1 && !validateStep1()) return;
    if (currentStep === 2 && !validateStep2()) return;
    if (currentStep < 3) setCurrentStep(prev => (prev + 1) as Step);
  };
  const goPrev = () => { if (currentStep > 1) setCurrentStep(prev => (prev - 1) as Step); };

  const handleSubmit = async () => {
    if (!validateStep3()) return;
    setIsLoading(true);
    try {
      await register({ name, email, password, role: selectedRole!, workspaceName: selectedRole === 'coach' ? workspaceName : undefined, coachId: selectedRole === 'athlete' ? coachCode : undefined });
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Erro ao criar conta', 'error');
      setIsLoading(false);
    }
  };

  // --- Style system ---
  const S = {
    root: { backgroundColor: '#023047', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' as const, overflow: 'hidden', fontFamily: "'Plus Jakarta Sans', sans-serif", padding: '1.5rem' },
    bgBase: { position: 'absolute' as const, inset: 0, zIndex: 0, background: "url('https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=1920&q=85') center 35%/cover no-repeat", filter: 'brightness(0.18) saturate(0.8) hue-rotate(-5deg) contrast(1.1)' },
    bgGrad: { position: 'absolute' as const, inset: 0, zIndex: 2, background: 'radial-gradient(ellipse at 20% 0%, rgba(32,158,187,0.1) 0%, transparent 45%), radial-gradient(ellipse at 80% 15%, rgba(255,183,1,0.06) 0%, transparent 40%), radial-gradient(ellipse at 50% 100%, rgba(2,48,71,0.95) 0%, transparent 60%)' },
    vignette: { position: 'absolute' as const, inset: 0, zIndex: 3, background: 'radial-gradient(ellipse at center, transparent 30%, rgba(2,48,71,0.5) 65%, rgba(2,48,71,0.88) 100%)', pointerEvents: 'none' as const },
    content: { position: 'relative' as const, zIndex: 10, width: '100%', maxWidth: '480px', display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: '1.5rem' },
    brandRow: { display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' },
    iconWrap: { position: 'relative' as const, width: '42px', height: '42px', borderRadius: '13px', background: 'linear-gradient(to bottom right, #FFB701, #FC8500)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 18px rgba(255,183,1,0.3)', flexShrink: 0 },
    brandTitle: { fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.6rem', fontWeight: 700, color: '#fff', letterSpacing: '4px', textTransform: 'uppercase' as const, margin: 0 },
    stepBadge: { fontSize: '0.62rem', fontWeight: 600, color: '#6A9DB8', letterSpacing: '3px', textTransform: 'uppercase' as const, textAlign: 'center' as const },
    progressRow: { display: 'flex', gap: '0.5rem', width: '100%' },
    progressBar: (active: boolean) => ({ flex: 1, height: '3px', borderRadius: '9999px', background: active ? 'linear-gradient(to right, #209EBB, #FFB701)' : 'rgba(142,202,230,0.15)', transition: 'background 0.4s' }),
    card: { width: '100%', background: 'rgba(8,55,82,0.5)', backdropFilter: 'blur(50px)', WebkitBackdropFilter: 'blur(50px)', boxShadow: '0 25px 70px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)', border: '1px solid rgba(142,202,230,0.1)', borderRadius: '28px', overflow: 'hidden' },
    topLine: { height: '3px', background: 'linear-gradient(90deg, transparent 5%, #209EBB 25%, #FFB701 50%, #209EBB 75%, transparent 95%)', backgroundSize: '200% 100%', animation: 'shimmerLine 3.5s ease-in-out infinite' },
    cardBody: { padding: '2rem' },
    stepTitle: { fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.25rem', fontWeight: 700, color: '#fff', marginBottom: '1.5rem', marginTop: 0 },
    fieldWrap: { marginBottom: '1rem' },
    label: { display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#8ECAE6', marginBottom: '0.5rem', letterSpacing: '1px', textTransform: 'uppercase' as const },
    input: (focused: boolean) => ({ width: '100%', padding: '0.75rem 1rem', backgroundColor: 'rgba(2,48,71,0.7)', border: `1px solid ${focused ? 'rgba(255,183,1,0.3)' : 'rgba(142,202,230,0.15)'}`, borderLeft: `3px solid ${focused ? '#FFB701' : '#209EBB'}`, borderRadius: '12px', color: '#fff', fontSize: '0.9rem', fontWeight: 500, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' as const, transition: 'all 0.25s', boxShadow: focused ? '0 0 0 3px rgba(255,183,1,0.08)' : 'inset 0 2px 6px rgba(0,0,0,0.25)' }),
    select: { width: '100%', padding: '0.75rem 1rem', backgroundColor: 'rgba(2,48,71,0.85)', border: '1px solid rgba(142,202,230,0.15)', borderLeft: '3px solid #209EBB', borderRadius: '12px', color: '#fff', fontSize: '0.9rem', fontWeight: 500, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' as const, cursor: 'pointer' },
    pwdStrRow: { display: 'flex', gap: '4px', marginTop: '0.5rem' },
    pwdStrBar: (filled: boolean, col: string) => ({ flex: 1, height: '3px', borderRadius: '9999px', background: filled ? col : 'rgba(142,202,230,0.15)', transition: 'background 0.3s' }),
    pwdLabel: { fontSize: '0.7rem', color: pwdStr.color, marginTop: '0.25rem', fontWeight: 600 },
    roleCard: (selected: boolean, accent: string) => ({ display: 'flex', alignItems: 'flex-start', gap: '1rem', padding: '1.25rem', borderRadius: '16px', border: `2px solid ${selected ? accent : 'rgba(142,202,230,0.12)'}`, backgroundColor: selected ? `${accent}0f` : 'rgba(2,48,71,0.4)', cursor: 'pointer', transition: 'all 0.25s', marginBottom: '0.75rem', userSelect: 'none' as const }),
    roleIcon: (accent: string) => ({ width: '44px', height: '44px', borderRadius: '12px', background: `linear-gradient(135deg, ${accent}cc, ${accent}88)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '1.3rem' }),
    roleTitle: { fontSize: '0.95rem', fontWeight: 700, color: '#fff', marginBottom: '0.25rem' },
    roleDesc: { fontSize: '0.78rem', color: '#A8CFE0', lineHeight: 1.5 },
    roleCheck: (accent: string) => ({ display: 'flex', alignItems: 'center', gap: '0.375rem', marginTop: '0.5rem', fontSize: '0.7rem', fontWeight: 700, color: accent, letterSpacing: '0.5px' }),
    consentBox: { padding: '1.25rem', borderRadius: '14px', backgroundColor: 'rgba(2,48,71,0.5)', border: '1px solid rgba(142,202,230,0.1)', marginTop: '1rem' },
    consentRow: { display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.75rem' },
    consentCheckWrap: { width: '18px', height: '18px', borderRadius: '5px', border: '1.5px solid rgba(142,202,230,0.25)', backgroundColor: 'rgba(2,48,71,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px', cursor: 'pointer', transition: 'all 0.2s' },
    consentText: { fontSize: '0.78rem', color: '#A8CFE0', lineHeight: 1.6 },
    consentLink: { color: '#FFB701', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', font: 'inherit', fontSize: '0.78rem', padding: 0, textDecoration: 'underline' },
    infoBox: { padding: '0.875rem 1rem', borderRadius: '12px', backgroundColor: 'rgba(255,183,1,0.06)', border: '1px solid rgba(255,183,1,0.15)', marginTop: '0.75rem' },
    infoText: { fontSize: '0.78rem', color: '#A8CFE0', lineHeight: 1.6, margin: 0 },
    btnRow: { display: 'flex', gap: '0.75rem', marginTop: '1.75rem' },
    backBtn: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.875rem', background: 'rgba(142,202,230,0.06)', border: '1px solid rgba(142,202,230,0.18)', borderRadius: '9999px', color: '#8ECAE6', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' },
    nextBtn: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.875rem 1.5rem', background: 'linear-gradient(to right, #FFB701, #FC8500)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '9999px', color: '#023047', fontSize: '0.9rem', fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit', letterSpacing: '1px', textTransform: 'uppercase' as const, transition: 'all 0.25s', boxShadow: '0 4px 14px rgba(255,183,1,0.25)' },
    submitBtn: (loading: boolean) => ({ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.875rem 1.5rem', background: loading ? 'rgba(32,158,187,0.4)' : 'linear-gradient(to right, #209EBB, #16698a)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '9999px', color: '#fff', fontSize: '0.9rem', fontWeight: 800, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', letterSpacing: '1px', textTransform: 'uppercase' as const, transition: 'all 0.25s', boxShadow: '0 4px 14px rgba(32,158,187,0.2)', opacity: loading ? 0.7 : 1 }),
    cardFooter: { padding: '1rem 2rem', borderTop: '1px solid rgba(32,158,187,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' },
    footerText: { fontSize: '0.78rem', color: '#8ECAE6', margin: 0 },
    loginLink: { fontSize: '0.78rem', fontWeight: 700, color: '#FFB701', cursor: 'pointer', background: 'none', border: 'none', fontFamily: 'inherit', transition: 'opacity 0.2s' },
    toastBox: { position: 'fixed' as const, bottom: '1.5rem', left: '50%', transform: 'translateX(-50%)', zIndex: 999, display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: '0.5rem', pointerEvents: 'none' as const },
    toast: (type: 'error' | 'info') => ({ background: type === 'error' ? 'linear-gradient(to right, #3d0a0a, #2a0606)' : 'linear-gradient(to right, #0a4060, #0d3550)', border: `1px solid ${type === 'error' ? 'rgba(239,68,68,0.4)' : 'rgba(255,183,1,0.3)'}`, color: type === 'error' ? '#fca5a5' : '#FFB701', padding: '0.75rem 1.75rem', borderRadius: '9999px', fontWeight: 700, fontSize: '0.78rem', whiteSpace: 'nowrap' as const, boxShadow: '0 10px 30px rgba(0,0,0,0.4)', opacity: 0, transform: 'translateY(12px) scale(0.95)', animation: 'toastPop 0.35s ease forwards' }),
  };

  const [focusedField, setFocusedField] = useState<string | null>(null);
  const focus = (f: string) => () => setFocusedField(f);
  const blur = () => setFocusedField(null);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&display=swap');
        @keyframes shimmerLine { 0%,100% { background-position:0% 50%; } 50% { background-position:100% 50%; } }
        @keyframes toastPop { to { opacity:1; transform:translateY(0) scale(1); } }
        @keyframes spin_r { to { transform:rotate(360deg); } }
        .luna-r-back:hover { background:rgba(142,202,230,0.12) !important; }
        .luna-r-next:hover { transform:translateY(-1px); box-shadow:0 6px 20px rgba(255,183,1,0.35) !important; }
        .luna-r-submit:hover:not(:disabled) { transform:translateY(-1px); box-shadow:0 6px 20px rgba(32,158,187,0.35) !important; }
        .luna-r-login:hover { opacity:0.8; }
        .luna-r-consent:hover { border-color:rgba(255,183,1,0.4) !important; background-color:rgba(255,183,1,0.08) !important; }
        .luna-spin-r { animation: spin_r 0.8s linear infinite; }
        *::placeholder { color: rgba(142,202,230,0.35); }
        option { background-color: #023047; }
      `}</style>

      <div style={S.root}>
        <div style={S.bgBase} />
        <div style={S.bgGrad} />
        <div style={S.vignette} />

        <div style={S.content}>
          {/* Brand */}
          <div>
            <div style={S.brandRow}>
              <div style={S.iconWrap}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#023047" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
              </div>
              <h1 style={S.brandTitle}>LUNA<b style={{ color: '#FFB701', textShadow: '0 0 20px rgba(255,183,1,0.4)' }}>.</b>OS</h1>
            </div>
            <div style={S.stepBadge}>Criar Conta — Passo {currentStep} de 3</div>
          </div>

          {/* Progress */}
          <div style={S.progressRow}>
            {[1, 2, 3].map(s => <div key={s} style={S.progressBar(s <= currentStep)} />)}
          </div>

          {/* Card */}
          <div style={S.card}>
            <div style={S.topLine} />
            <div style={S.cardBody}>

              {/* STEP 1 */}
              {currentStep === 1 && (
                <div>
                  <h2 style={S.stepTitle}>Informação Básica</h2>

                  <div style={S.fieldWrap}>
                    <label style={S.label}>Nome Completo</label>
                    <input type="text" value={name} placeholder="João Silva" style={S.input(focusedField === 'name')} onChange={e => setName(e.target.value)} onFocus={focus('name')} onBlur={blur} />
                  </div>

                  <div style={S.fieldWrap}>
                    <label style={S.label}>Email</label>
                    <input type="email" value={email} placeholder="seu@email.com" style={S.input(focusedField === 'email')} onChange={e => setEmail(e.target.value)} onFocus={focus('email')} onBlur={blur} />
                  </div>

                  <div style={S.fieldWrap}>
                    <label style={S.label}>Password</label>
                    <div style={{ position: 'relative' }}>
                      <input type={showPassword ? 'text' : 'password'} value={password} placeholder="••••••••" style={S.input(focusedField === 'pass')} onChange={e => setPassword(e.target.value)} onFocus={focus('pass')} onBlur={blur} />
                      <button type="button" onClick={() => setShowPassword(v => !v)} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#6A9DB8', padding: 0 }}>
                        {showPassword ? (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                        ) : (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        )}
                      </button>
                    </div>
                    {password && (
                      <div>
                        <div style={S.pwdStrRow}>
                          {[1,2,3,4].map(l => <div key={l} style={S.pwdStrBar(l <= pwdStr.strength, pwdStr.color)} />)}
                        </div>
                        <p style={S.pwdLabel}>Força: {pwdStr.label}</p>
                      </div>
                    )}
                  </div>

                  <div style={S.fieldWrap}>
                    <label style={S.label}>Confirmar Password</label>
                    <input type={showPassword ? 'text' : 'password'} value={confirmPassword} placeholder="••••••••" style={S.input(focusedField === 'conf')} onChange={e => setConfirmPassword(e.target.value)} onFocus={focus('conf')} onBlur={blur} />
                  </div>
                </div>
              )}

              {/* STEP 2 */}
              {currentStep === 2 && (
                <div>
                  <h2 style={S.stepTitle}>Quem és tu?</h2>

                  <div onClick={() => setSelectedRole('coach')} style={S.roleCard(selectedRole === 'coach', '#FFB701')}>
                    <div style={S.roleIcon('#FFB701')}>🏋️</div>
                    <div style={{ flex: 1 }}>
                      <div style={S.roleTitle}>Sou Treinador</div>
                      <div style={S.roleDesc}>Gerir atletas, criar treinos e usar Live Command</div>
                      {selectedRole === 'coach' && (
                        <div style={S.roleCheck('#FFB701')}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                          SELECIONADO
                        </div>
                      )}
                    </div>
                  </div>

                  <div onClick={() => setSelectedRole('athlete')} style={S.roleCard(selectedRole === 'athlete', '#209EBB')}>
                    <div style={S.roleIcon('#209EBB')}>💪</div>
                    <div style={{ flex: 1 }}>
                      <div style={S.roleTitle}>Sou Atleta</div>
                      <div style={S.roleDesc}>Treinar com um treinador e acompanhar o meu progresso</div>
                      {selectedRole === 'athlete' && (
                        <div style={S.roleCheck('#209EBB')}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                          SELECIONADO
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3 */}
              {currentStep === 3 && (
                <div>
                  {selectedRole === 'coach' ? (
                    <>
                      <h2 style={S.stepTitle}>Configura o teu espaço</h2>
                      <div style={S.fieldWrap}>
                        <label style={S.label}>Nome do espaço / ginásio</label>
                        <input type="text" value={workspaceName} placeholder="Academia Premium" style={S.input(focusedField === 'wname')} onChange={e => setWorkspaceName(e.target.value)} onFocus={focus('wname')} onBlur={blur} />
                      </div>
                      <div style={S.fieldWrap}>
                        <label style={S.label}>Tipo de treino</label>
                        <select value={workspaceType} onChange={e => setWorkspaceType(e.target.value)} style={S.select}>
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
                      <h2 style={S.stepTitle}>Última coisa...</h2>
                      <div style={S.fieldWrap}>
                        <label style={S.label}>Código do treinador (opcional)</label>
                        <input type="text" value={coachCode} placeholder="ABC123" style={S.input(focusedField === 'code')} onChange={e => setCoachCode(e.target.value)} onFocus={focus('code')} onBlur={blur} />
                      </div>
                      <div style={S.infoBox}>
                        <p style={S.infoText}><b style={{ color: '#FFB701' }}>⚠️ Nota:</b> Precisas de ser adicionado por um treinador para usar a app. Se não tens código, pede ao teu treinador para te adicionar!</p>
                      </div>
                    </>
                  )}

                  {/* LGPD Consent */}
                  <div style={S.consentBox}>
                    <div style={S.consentRow}>
                      <div
                        className="luna-r-consent"
                        style={{ ...S.consentCheckWrap, borderColor: consentPrivacy ? '#FFB701' : 'rgba(142,202,230,0.25)', backgroundColor: consentPrivacy ? 'rgba(255,183,1,0.1)' : 'rgba(2,48,71,0.5)' }}
                        onClick={() => setConsentPrivacy(v => !v)}
                      >
                        {consentPrivacy && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#FFB701" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
                      </div>
                      <div style={S.consentText}>
                        Li e aceito a{' '}
                        <button type="button" className="luna-r-consent" onClick={onPrivacyClick} style={S.consentLink}>Política de Privacidade</button>
                        {' '}e os{' '}
                        <button type="button" className="luna-r-consent" onClick={onTermsClick} style={S.consentLink}>Termos de Utilização</button>.
                        {' '}<span style={{ color: '#FC8500', fontWeight: 700 }}>* Obrigatório</span>
                      </div>
                    </div>

                    <div style={S.consentRow}>
                      <div
                        className="luna-r-consent"
                        style={{ ...S.consentCheckWrap, borderColor: consentHealth ? '#209EBB' : 'rgba(142,202,230,0.25)', backgroundColor: consentHealth ? 'rgba(32,158,187,0.1)' : 'rgba(2,48,71,0.5)' }}
                        onClick={() => setConsentHealth(v => !v)}
                      >
                        {consentHealth && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#209EBB" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
                      </div>
                      <div style={S.consentText}>
                        Autorizo o tratamento dos meus <b style={{ color: '#A8CFE0' }}>dados de saúde e desempenho desportivo</b> para fins de acompanhamento pelo meu treinador.{' '}
                        <span style={{ color: '#6A9DB8' }}>(Opcional — necessário para métricas avançadas)</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginTop: '0.25rem' }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6A9DB8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                      <span style={{ fontSize: '0.68rem', color: '#4a7a96' }}>Dados tratados de acordo com a LGPD (Lei 13.709/2018) e RGPD.</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation buttons */}
              <div style={S.btnRow}>
                {currentStep > 1 && (
                  <button type="button" className="luna-r-back" onClick={goPrev} disabled={isLoading} style={S.backBtn}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                    Voltar
                  </button>
                )}

                {currentStep < 3 ? (
                  <button type="button" className="luna-r-next" onClick={goNext} style={S.nextBtn}>
                    Continuar
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                  </button>
                ) : (
                  <button type="button" className="luna-r-submit" onClick={handleSubmit} disabled={isLoading} style={S.submitBtn(isLoading)}>
                    {isLoading ? (
                      <>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="luna-spin-r"><circle cx="12" cy="12" r="10" strokeDasharray="30 70"/></svg>
                        A criar conta...
                      </>
                    ) : (
                      <>
                        Criar Conta
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Footer */}
            <div style={S.cardFooter}>
              <p style={S.footerText}>Já tens conta?</p>
              <button type="button" className="luna-r-login" onClick={onLoginClick} disabled={isLoading} style={{ ...S.loginLink, marginLeft: '0.5rem' }}>
                Entrar →
              </button>
            </div>
          </div>

          {/* Scene footer */}
          <p style={{ fontSize: '0.62rem', color: 'rgba(142,202,230,0.25)', fontStyle: 'italic', textAlign: 'center', margin: 0 }}>
            A performance não é um acaso, é uma <b style={{ color: 'rgba(255,183,1,0.4)', fontWeight: 600, fontStyle: 'normal' }}>ciência</b>.
          </p>
        </div>

        {/* Toasts */}
        <div style={S.toastBox}>
          {toasts.map(t => <div key={t.id} style={S.toast(t.type || 'info')}>{t.msg}</div>)}
        </div>
      </div>
    </>
  );
}
