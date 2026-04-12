import React, { useEffect, useState, useRef } from 'react';
import { useApp } from '../../contexts/AppContext';
import { supabase } from '../../lib/supabase/client';

interface LunaLoginProps {
  onRegisterClick?: () => void;
}

export const LunaLogin = ({ onRegisterClick }: LunaLoginProps = {}) => {
  const { login } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toasts, setToasts] = useState<{ id: number; msg: string; type?: 'error'|'info' }[]>([]);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passFocused, setPassFocused] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const showToast = (msg: string, type: 'error' | 'info' = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, msg, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2900);
  };

  const handleResetPassword = async () => {
    if (!email) {
      showToast('Insere o teu email no campo acima para recuperar a senha', 'error');
      setEmailFocused(true);
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/reset-password',
    });
    if (error) {
      showToast(error.message, 'error');
    } else {
      showToast('Link de recuperação enviado para o email!', 'info');
    }
  };

  const handleOAuth = async (provider: 'google' | 'facebook') => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: window.location.origin }
    });
    if (error) {
      showToast(`Erro ao ligar com ${provider}: ${error.message}`, 'error');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return showToast('Insira o email', 'error');
    if (!password) return showToast('Insira a palavra-passe', 'error');
    if (!email.includes('@')) return showToast('Email inválido', 'error');
    
    setLoading(true);
    try {
      await login(email, password);
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Falha na autenticação', 'error');
      setLoading(false);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let w: number, h: number;
    let reqId: number;
    const dots: any[] = [];
    const resize = () => { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; };
    window.addEventListener('resize', resize);
    resize();
    for (let i = 0; i < 70; i++) {
      const t = Math.random();
      const col = t > 0.65 ? '255,183,1' : t > 0.3 ? '32,158,187' : '142,202,230';
      const warm = t > 0.65;
      dots.push({ x: Math.random() * w, y: Math.random() * h, r: Math.random() * (warm ? 2 : 1.2) + 0.3, dx: (Math.random() - 0.5) * 0.22, dy: (Math.random() - 0.5) * 0.22, o: Math.random() * (warm ? 0.28 : 0.15) + 0.05, c: col });
    }
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < dots.length; i++) {
        const p = dots[i]; p.x += p.dx; p.y += p.dy;
        if (p.x < 0) p.x = w; if (p.x > w) p.x = 0; if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.c},${p.o})`; ctx.fill();
      }
      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const dx = dots[i].x - dots[j].x, dy = dots[i].y - dots[j].y, dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 110) { ctx.beginPath(); ctx.moveTo(dots[i].x, dots[i].y); ctx.lineTo(dots[j].x, dots[j].y); ctx.strokeStyle = `rgba(32,158,187,${0.06 * (1 - dist / 110)})`; ctx.lineWidth = 0.6; ctx.stroke(); }
        }
      }
      reqId = requestAnimationFrame(draw);
    };
    draw();
    return () => { window.removeEventListener('resize', resize); cancelAnimationFrame(reqId); };
  }, []);

  const S = {
    root: { backgroundColor: '#023047', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' as const, overflow: 'hidden', fontFamily: "'Plus Jakarta Sans', sans-serif" },
    bgBase: { position: 'absolute' as const, inset: 0, zIndex: 0, background: "url('https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=1920&q=85') center 35%/cover no-repeat", filter: 'brightness(0.2) saturate(0.8) hue-rotate(-5deg) contrast(1.1)' },
    bgWarm: { position: 'absolute' as const, inset: 0, zIndex: 0, background: "url('https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=1200&q=80') top right/55% auto no-repeat", filter: 'brightness(0.12) saturate(0.5)', opacity: 0.3, mixBlendMode: 'screen' as const },
    bgGrad: { position: 'absolute' as const, inset: 0, zIndex: 2, background: 'radial-gradient(ellipse at 20% 0%, rgba(32,158,187,0.1) 0%, transparent 45%), radial-gradient(ellipse at 80% 15%, rgba(255,183,1,0.06) 0%, transparent 40%), radial-gradient(ellipse at 50% 100%, rgba(2,48,71,0.95) 0%, transparent 55%), radial-gradient(ellipse at 0% 50%, rgba(2,48,71,0.55) 0%, transparent 45%), radial-gradient(ellipse at 100% 50%, rgba(2,48,71,0.55) 0%, transparent 45%)' },
    vignette: { position: 'absolute' as const, inset: 0, zIndex: 3, background: 'radial-gradient(ellipse at center, transparent 30%, rgba(2,48,71,0.5) 65%, rgba(2,48,71,0.88) 100%)', pointerEvents: 'none' as const },
    canvas: { position: 'absolute' as const, inset: 0, zIndex: 1, pointerEvents: 'none' as const },
    content: { position: 'relative' as const, zIndex: 10, width: '100%', maxWidth: '460px', padding: '2rem', display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: '1.5rem' },
    brandWrap: { textAlign: 'center' as const, opacity: 0, animation: 'dropIn 0.6s ease-out 0.15s forwards' },
    iconWrap: { position: 'relative' as const, width: '58px', height: '58px', margin: '0 auto 0.875rem', borderRadius: '18px', background: 'linear-gradient(to bottom right, #FFB701, #FC8500)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 28px rgba(255,183,1,0.35), inset 0 1px 0 rgba(255,255,255,0.25)' },
    h1: { fontFamily: "'Space Grotesk', sans-serif", fontSize: '2.4rem', fontWeight: 700, color: '#fff', letterSpacing: '6px', textTransform: 'uppercase' as const, margin: 0 },
    dot_badge: { display: 'inline-flex', alignItems: 'center', gap: '0.375rem', marginTop: '0.5rem', fontSize: '0.63rem', fontWeight: 600, color: '#6A9DB8', letterSpacing: '3.5px', textTransform: 'uppercase' as const },
    pulse_dot: { width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#FFB701', boxShadow: '0 0 10px rgba(255,183,1,0.7)', animation: 'pulse_dot 2s ease-in-out infinite', display: 'inline-block' },
    cardOuter: { width: '100%', borderRadius: '28px', position: 'relative' as const, opacity: 0, animation: 'scaleIn 0.6s ease-out 0.35s forwards' },
    cardGlass: { background: 'rgba(8,55,82,0.5)', backdropFilter: 'blur(50px)', WebkitBackdropFilter: 'blur(50px)', boxShadow: '0 25px 70px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)', border: '1px solid rgba(142,202,230,0.1)', borderRadius: '28px', overflow: 'hidden' },
    topLine: { height: '3px', background: 'linear-gradient(90deg, transparent 5%, #209EBB 25%, #FFB701 50%, #209EBB 75%, transparent 95%)', backgroundSize: '200% 100%', animation: 'shimmerLine 3.5s ease-in-out infinite' },
    cardBody: { padding: '2rem' },
    cardHeader: { textAlign: 'center' as const, marginBottom: '1.75rem', opacity: 0, animation: 'fadeRight 0.5s ease-out 0.55s forwards' },
    h2: { fontSize: '1.5rem', fontWeight: 700, color: '#fff', marginBottom: '0.25rem', lineHeight: 1.25 },
    subtitle: { fontSize: '0.8rem', color: '#A8CFE0', margin: 0 },
    form: { opacity: 0, animation: 'fadeUp 0.4s ease-out 0.65s forwards' },
    inputWrap: { position: 'relative' as const, marginBottom: '1rem' },
    input: (focused: boolean, hasVal: boolean) => ({
      width: '100%', paddingTop: focused || hasVal ? '22px' : '18px', paddingBottom: focused || hasVal ? '8px' : '10px', paddingRight: '3rem', paddingLeft: '1rem',
      backgroundColor: 'rgba(2,48,71,0.7)', border: `1px solid ${focused ? 'rgba(255,183,1,0.3)' : 'rgba(142,202,230,0.15)'}`, borderLeft: `3px solid ${focused ? '#FFB701' : '#209EBB'}`,
      borderRadius: '14px', color: '#fff', fontSize: '0.9rem', fontWeight: 500, outline: 'none', transition: 'all 0.3s', fontFamily: "'Plus Jakarta Sans', sans-serif",
      boxShadow: focused ? 'inset 0 2px 4px rgba(0,0,0,0.2), 0 0 0 3px rgba(255,183,1,0.1)' : 'inset 0 2px 6px rgba(0,0,0,0.3), 0 1px 0 rgba(255,255,255,0.03)',
      display: 'block', boxSizing: 'border-box' as const
    }),
    label: (focused: boolean, hasVal: boolean) => ({
      position: 'absolute' as const, left: '1rem', top: focused || hasVal ? '13px' : '50%', transform: focused || hasVal ? 'translateY(0) scale(0.7)' : 'translateY(-50%)',
      fontSize: '0.84rem', fontWeight: focused || hasVal ? 700 : 500, color: focused || hasVal ? '#FFB701' : '#8ECAE6',
      pointerEvents: 'none' as const, transition: 'all 0.25s', transformOrigin: 'left', letterSpacing: focused || hasVal ? '0.8px' : 'normal',
      textTransform: focused || hasVal ? 'uppercase' as const : 'none' as const
    }),
    rowBetween: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '-0.125rem', marginBottom: '1.75rem' },
    checkbox_row: { display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' },
    checkboxBox: { width: '18px', height: '18px', borderRadius: '5px', border: '1.5px solid rgba(142,202,230,0.25)', backgroundColor: 'rgba(2,48,71,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.2s' },
    forgotLink: { fontSize: '0.74rem', fontWeight: 600, color: '#8ECAE6', cursor: 'pointer', background: 'none', border: 'none', fontFamily: 'inherit', transition: 'color 0.2s' },
    ctaWrap: { position: 'relative' as const, marginBottom: '0.25rem' },
    ctaBtn: { position: 'relative' as const, width: '100%', padding: '17px', background: 'linear-gradient(to right, #FFB701, #f0a800, #FC8500)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '9999px', color: '#023047', fontSize: '1rem', fontWeight: 800, letterSpacing: '1.5px', textTransform: 'uppercase' as const, cursor: 'pointer', transition: 'all 0.3s', overflow: 'hidden', zIndex: 1, boxShadow: '0 4px 14px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.3), inset 0 -2px 0 rgba(0,0,0,0.08)', fontFamily: 'inherit' },
    ctaGlow: { position: 'absolute' as const, bottom: '-4px', left: '15%', right: '15%', height: '22px', backgroundColor: '#FFB701', borderRadius: '9999px', filter: 'blur(20px)', opacity: 0.3, zIndex: 0 },
    secureBadge: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.375rem', marginTop: '1rem', marginBottom: '0.5rem', fontSize: '0.62rem', fontWeight: 600, color: '#6A9DB8', letterSpacing: '0.025em' },
    divider: { display: 'flex', alignItems: 'center', gap: '0.625rem', margin: '1.75rem 0', opacity: 0, animation: 'fadeUp 0.4s ease-out 0.75s forwards' },
    dividerLine: { flex: 1, height: '1px', backgroundColor: 'rgba(142,202,230,0.12)' },
    dividerText: { fontSize: '0.58rem', fontWeight: 700, color: '#209EBB', letterSpacing: '2px', textTransform: 'uppercase' as const, whiteSpace: 'nowrap' as const, padding: '0.25rem 0.875rem', backgroundColor: 'rgba(32,158,187,0.1)', border: '1px solid rgba(32,158,187,0.2)', borderRadius: '9999px' },
    socialRow: { display: 'flex', gap: '0.625rem', opacity: 0, animation: 'fadeUp 0.4s ease-out 0.85s forwards' },
    socialBtn: { position: 'relative' as const, flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.875rem', background: 'linear-gradient(to bottom right, #1a7a96, #16698a)', border: '1px solid rgba(142,202,230,0.2)', borderLeft: '3px solid #FFB701', borderRadius: '9999px', color: '#fff', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.3s', boxShadow: '0 4px 12px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.12), inset 0 -1px 0 rgba(0,0,0,0.2)', fontFamily: 'inherit' },
    cardFooter: { padding: '1rem 2rem', borderTop: '1px solid rgba(32,158,187,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', opacity: 0, animation: 'fadeUp 0.4s ease-out 1.05s forwards' },
    footerText: { fontSize: '0.78rem', color: '#8ECAE6', margin: 0 },
    registerBtn: { fontSize: '0.78rem', fontWeight: 700, color: '#FFB701', cursor: 'pointer', background: 'none', border: '1px solid rgba(255,183,1,0.2)', borderRadius: '9999px', padding: '0.375rem 1rem', backgroundColor: 'rgba(255,183,1,0.08)', fontFamily: 'inherit', transition: 'all 0.2s' },
    sceneFooter: { textAlign: 'center' as const, opacity: 0, animation: 'fadeUp 0.4s ease-out 1.2s forwards' },
    sceneFooterText: { fontSize: '0.62rem', color: 'rgba(142,202,230,0.3)', fontStyle: 'italic', letterSpacing: '0.025em', margin: 0 },
    toastBox: { position: 'fixed' as const, bottom: '1.5rem', left: '50%', transform: 'translateX(-50%)', zIndex: 999, display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: '0.5rem', pointerEvents: 'none' as const },
    toast: (type: 'error'|'info') => ({ background: type === 'error' ? 'linear-gradient(to right, #3d0a0a, #2a0606)' : 'linear-gradient(to right, #0a4060, #0d3550)', border: `1px solid ${type === 'error' ? 'rgba(239,68,68,0.4)' : 'rgba(255,183,1,0.3)'}`, color: type === 'error' ? '#fca5a5' : '#FFB701', padding: '0.75rem 1.75rem', borderRadius: '9999px', fontWeight: 700, fontSize: '0.78rem', letterSpacing: '0.025em', whiteSpace: 'nowrap' as const, boxShadow: '0 10px 30px rgba(0,0,0,0.4)', opacity: 0, transform: 'translateY(12px) scale(0.95)', animation: 'toastPop 0.35s ease forwards' }),
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&display=swap');
        @keyframes dropIn { from { opacity:0; transform:translateY(-20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes scaleIn { from { opacity:0; transform:scale(0.94) translateY(18px); } to { opacity:1; transform:scale(1) translateY(0); } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeRight { from { opacity:0; transform:translateX(-12px); } to { opacity:1; transform:translateX(0); } }
        @keyframes pulse_dot { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:0.3; transform:scale(0.7); } }
        @keyframes shimmerLine { 0%,100% { background-position:0% 50%; } 50% { background-position:100% 50%; } }
        @keyframes toastPop { to { opacity:1; transform:translateY(0) scale(1); } }
        @keyframes spin_cta { to { transform:rotate(360deg); } }
        .luna-cta-btn:hover { transform:translateY(-2px); box-shadow:0 6px 18px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.35), inset 0 -2px 0 rgba(0,0,0,0.08) !important; }
        .luna-cta-btn:active { transform:translateY(1px); }
        .luna-social-btn:hover { transform:translateY(-2px); background:linear-gradient(to bottom right, #209EBB, #1a7a96) !important; }
        .luna-social-btn:active { transform:translateY(1px); }
        .luna-forgot:hover { color:#FFB701 !important; }
        .luna-register-btn:hover { background-color:rgba(255,183,1,0.15) !important; border-color:rgba(255,183,1,0.35) !important; }
        .luna-brand-glow::after { content:''; position:absolute; inset:-4px; border-radius:22px; background:rgba(255,183,1,0.18); z-index:-1; filter:blur(14px); }
        .luna-spin { animation: spin_cta 0.8s linear infinite; }
        @media (max-width: 480px) {
          .luna-content { padding: 1.25rem !important; gap: 1.25rem !important; }
          .luna-card-body { padding: 1.5rem !important; }
          .luna-card-footer { padding: 1rem 1.25rem !important; }
          .luna-h1 { font-size: 2rem !important; }
          .luna-social-row { flex-direction: column !important; }
        }
      `}</style>

      <div style={S.root}>
        <canvas ref={canvasRef} style={S.canvas} />
        <div style={S.bgBase} />
        <div style={S.bgWarm} />
        <div style={S.bgGrad} />
        <div style={S.vignette} />

        <div style={S.content} className="luna-content">
          {/* Brand */}
          <div style={S.brandWrap}>
            <div className="luna-brand-glow" style={S.iconWrap}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#023047" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
            </div>
            <h1 style={S.h1} className="luna-h1">
              LUNA<b style={{ color: '#FFB701', textShadow: '0 0 30px rgba(255,183,1,0.45)' }}>.</b>OS
            </h1>
            <div style={S.dot_badge}>
              <span style={S.pulse_dot} />
              Centro de Comando
            </div>
          </div>

          {/* Card */}
          <div style={S.cardOuter}>
            <div style={S.cardGlass}>
              <div style={S.topLine} />
              <div style={S.cardBody} className="luna-card-body">
                {/* Header */}
                <div style={S.cardHeader}>
                  <h2 style={S.h2}>Bem-vindo de volta.</h2>
                  <p style={S.subtitle}>Acede ao ecossistema de <b style={{ color: '#FFB701' }}>performance</b></p>
                </div>

                {/* Form */}
                <form onSubmit={handleLogin} style={S.form}>
                  {/* Email */}
                  <div style={S.inputWrap}>
                    <input
                      type="email" value={email} placeholder=" " autoComplete="email"
                      style={S.input(emailFocused, email.length > 0)}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setEmailFocused(true)}
                      onBlur={() => setEmailFocused(false)}
                    />
                    <label style={S.label(emailFocused, email.length > 0)}>Email</label>
                    <svg style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', width: '18px', height: '18px', stroke: emailFocused ? '#FFB701' : '#8ECAE6', fill: 'none', pointerEvents: 'none', transition: 'stroke 0.3s' }} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                      <rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                  </div>

                  {/* Password */}
                  <div style={S.inputWrap}>
                    <input
                      type="password" value={password} placeholder=" " autoComplete="current-password"
                      style={S.input(passFocused, password.length > 0)}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setPassFocused(true)}
                      onBlur={() => setPassFocused(false)}
                    />
                    <label style={S.label(passFocused, password.length > 0)}>Palavra-passe</label>
                    <svg style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', width: '18px', height: '18px', stroke: passFocused ? '#FFB701' : '#8ECAE6', fill: 'none', pointerEvents: 'none', transition: 'stroke 0.3s' }} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </div>

                  {/* Remember + Forgot */}
                  <div style={S.rowBetween}>
                    <div style={S.checkbox_row} onClick={(e) => { e.preventDefault(); setRememberMe(!rememberMe); }}>
                      <div style={{ ...S.checkboxBox, borderColor: rememberMe ? '#FFB701' : 'rgba(142,202,230,0.25)', backgroundColor: rememberMe ? 'rgba(255,183,1,0.1)' : 'rgba(2,48,71,0.5)' }}>
                        {rememberMe && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FFB701" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
                      </div>
                      <span style={{ fontSize: '0.74rem', fontWeight: 500, color: '#A8CFE0', userSelect: 'none' }}>Lembrar-me</span>
                    </div>
                    <button type="button" className="luna-forgot" onClick={handleResetPassword} style={S.forgotLink}>Esqueci a senha</button>
                  </div>

                  {/* CTA */}
                  <div style={S.ctaWrap}>
                    <button type="submit" disabled={loading} className="luna-cta-btn" style={S.ctaBtn}>
                      {loading ? (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="luna-spin">
                            <circle cx="12" cy="12" r="10" strokeDasharray="30 70" />
                          </svg>
                          A autenticar...
                        </span>
                      ) : (
                        <>Iniciar Sessão <span style={{ display: 'inline-block', marginLeft: '0.5rem', transition: 'transform 0.2s' }}>→</span></>
                      )}
                    </button>
                    <div style={S.ctaGlow} />
                  </div>

                  {/* Secure badge */}
                  <div style={S.secureBadge}>
                    <svg style={{ width: '12px', height: '12px', stroke: '#209EBB', fill: 'none' }} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                    Conexão encriptada · TLS 1.3
                  </div>
                </form>

                {/* Separator */}
                <div style={S.divider}>
                  <div style={S.dividerLine} />
                  <span style={S.dividerText}>ou continuar com</span>
                  <div style={S.dividerLine} />
                </div>

                {/* Social */}
                <div style={S.socialRow} className="luna-social-row">
                  <button type="button" className="luna-social-btn" onClick={() => handleOAuth('google')} style={S.socialBtn}>
                    <svg style={{ width: '18px', height: '18px', fill: 'rgba(142,202,230,0.85)' }} viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Google
                  </button>
                  <button type="button" className="luna-social-btn" onClick={() => handleOAuth('facebook')} style={S.socialBtn}>
                    <svg style={{ width: '18px', height: '18px', fill: 'rgba(142,202,230,0.85)' }} viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    Facebook
                  </button>
                </div>
              </div>

              {/* Footer */}
              <div style={S.cardFooter} className="luna-card-footer">
                <p style={S.footerText}>Não tens conta?</p>
                <button type="button" className="luna-register-btn" onClick={() => onRegisterClick ? onRegisterClick() : showToast('Registo em breve')} style={S.registerBtn}>Criar conta →</button>
              </div>
            </div>
          </div>

          {/* Scene footer */}
          <div style={S.sceneFooter}>
            <p style={S.sceneFooterText}>A performance não é um acaso, é uma <b style={{ color: 'rgba(255,183,1,0.5)', fontWeight: 600, fontStyle: 'normal' }}>ciência</b>.</p>
          </div>
        </div>

        {/* Toasts */}
        <div style={S.toastBox}>
          {toasts.map((t) => <div key={t.id} style={S.toast(t.type || 'info')}>{t.msg}</div>)}
        </div>
      </div>
    </>
  );
};
