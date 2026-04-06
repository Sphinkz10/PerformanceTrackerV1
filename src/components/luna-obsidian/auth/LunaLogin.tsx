import React, { useRef, useEffect, useState } from 'react';
import { useApp } from '../../../contexts/AppContext';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface Particle {
  x: number;
  y: number;
  r: number;
  dx: number;
  dy: number;
  o: number;
  c: string;
}

export function LunaLogin() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useApp();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    let w: number;
    let h: number;

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resize);
    resize();

    for (let i = 0; i < 70; i++) {
      const t = Math.random();
      const col = t > 0.65 ? '255,183,1' : t > 0.3 ? '32,158,187' : '142,202,230';
      const warm = t > 0.65;
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * (warm ? 2 : 1.2) + 0.3,
        dx: (Math.random() - 0.5) * 0.22,
        dy: (Math.random() - 0.5) * 0.22,
        o: Math.random() * (warm ? 0.28 : 0.15) + 0.05,
        c: col,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.dx;
        p.y += p.dy;

        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.c},${p.o})`;
        ctx.fill();
      }

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(32,158,187,${0.06 * (1 - dist / 110)})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const showCustomToast = (message: string) => {
    toast.custom(() => (
      <div className="toast-el bg-gradient-to-r from-navy-light to-navy-mid border border-gold/30 text-gold px-7 py-3 rounded-full font-bold text-[0.78rem] tracking-wide whitespace-nowrap shadow-[0_10px_30px_rgba(0,0,0,0.4)]">
        {message}
      </div>
    ), { duration: 2500 });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      showCustomToast('Insira o email');
      return;
    }
    if (!password) {
      showCustomToast('Insira a palavra-passe');
      return;
    }
    if (!email.includes('@')) {
      showCustomToast('Email inválido');
      return;
    }

    setIsLoading(true);

    try {
      await login(email, password);
      showCustomToast(`Bem-vindo, ${email.split('@')[0]}!`);
    } catch (error) {
      console.error(error);
      showCustomToast('Erro ao iniciar sessão');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-navy min-h-screen flex items-center justify-center relative overflow-hidden font-sans">
      <canvas ref={canvasRef} className="absolute inset-0 z-[1] pointer-events-none"></canvas>
      <div className="bg-base absolute inset-0 z-0"></div>
      <div className="bg-warm absolute inset-0 z-0 opacity-30 mix-blend-screen"></div>
      <div className="bg-grad absolute inset-0 z-[2]"></div>
      <div className="vignette absolute inset-0 z-[3] pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-[460px] p-8 flex flex-col items-center gap-6">

        {/* Brand */}
        <div className="text-center opacity-0 animate-dropIn">
          <div className="brand-glow relative w-[58px] h-[58px] mx-auto mb-3.5 rounded-[18px] bg-gradient-to-br from-gold to-orange_l flex items-center justify-center shadow-[0_6px_28px_rgba(255,183,1,0.35),inset_0_1px_0_rgba(255,255,255,0.25)]">
            <svg className="w-[26px] h-[26px]" viewBox="0 0 24 24" fill="none" stroke="#023047" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
            </svg>
          </div>
          <h1 className="font-display text-[2.4rem] font-bold text-white tracking-[6px] uppercase">
            LUNA<b className="text-gold [text-shadow:0_0_30px_rgba(255,183,1,0.45)]">.</b>OS
          </h1>
          <div className="inline-flex items-center gap-1.5 mt-2 text-[0.63rem] font-semibold text-muted tracking-[3.5px] uppercase">
            <i className="w-1.5 h-1.5 rounded-full bg-gold shadow-[0_0_10px_rgba(255,183,1,0.7)] animate-pulse_dot"></i>
            Centro de Comando
          </div>
        </div>

        {/* Card */}
        <div className="w-full rounded-[28px] relative opacity-0 animate-scaleIn">
          <div className="card-glass border border-sky_l/10 rounded-[28px] overflow-hidden">

            {/* Top shimmer line */}
            <div className="top-line h-[3px] animate-shimmer"></div>

            {/* Card body */}
            <div className="p-8 sm:p-7">

              {/* Header */}
              <div className="text-center mb-7 opacity-0 animate-fadeRight">
                <h2 className="text-2xl font-bold text-white mb-1 leading-tight">Bem-vindo de volta.</h2>
                <p className="text-[0.8rem] text-muted-hi">Acede ao ecossistema de <span className="text-gold font-bold">performance</span></p>
              </div>

              {/* Form */}
              <form onSubmit={handleLogin} className="opacity-0 animate-fadeUp2">

                {/* Email */}
                <div className="relative mb-4">
                  <input
                    type="email"
                    id="email"
                    placeholder=" "
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field peer w-full pt-[18px] pb-[10px] pr-12 pl-4 bg-navy/70 border border-sky_l/15 border-l-[3px] border-l-teal_l rounded-[14px] text-white text-[0.9rem] font-medium outline-none transition-all duration-300 shadow-[inset_0_2px_6px_rgba(0,0,0,0.3),0_1px_0_rgba(255,255,255,0.03)]"
                  />
                  <label className="absolute left-4 top-1/2 -translate-y-1/2 text-[0.84rem] font-medium text-sky_l pointer-events-none transition-all duration-250 origin-left">Email</label>
                  <svg className="input-ico absolute right-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] stroke-sky_l fill-none transition-all duration-300 pointer-events-none" style={{strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round'}} viewBox="0 0 24 24">
                    <rect x="2" y="4" width="20" height="16" rx="2"/>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                  </svg>
                </div>

                {/* Password */}
                <div className="relative mb-4">
                  <input
                    type="password"
                    id="pass"
                    placeholder=" "
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field peer w-full pt-[18px] pb-[10px] pr-12 pl-4 bg-navy/70 border border-sky_l/15 border-l-[3px] border-l-teal_l rounded-[14px] text-white text-[0.9rem] font-medium outline-none transition-all duration-300 shadow-[inset_0_2px_6px_rgba(0,0,0,0.3),0_1px_0_rgba(255,255,255,0.03)]"
                  />
                  <label className="absolute left-4 top-1/2 -translate-y-1/2 text-[0.84rem] font-medium text-sky_l pointer-events-none transition-all duration-250 origin-left">Palavra-passe</label>
                  <svg className="input-ico absolute right-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] stroke-sky_l fill-none transition-all duration-300 pointer-events-none" style={{strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round'}} viewBox="0 0 24 24">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </div>

                {/* Remember + Forgot */}
                <div className="flex items-center justify-between -mt-0.5 mb-7">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input type="checkbox" className="hidden peer" />
                    <div className="w-[18px] h-[18px] rounded-[5px] border-[1.5px] border-sky_l/25 bg-navy/50 flex items-center justify-center transition-all peer-checked:border-gold peer-checked:bg-gold/10">
                      <svg className="w-[11px] h-[11px] stroke-gold opacity-0 peer-checked:group-[]:opacity-100 transition-opacity" style={{strokeWidth: 3, fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round'}} viewBox="0 0 24 24">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    </div>
                    <span className="text-[0.74rem] font-medium text-muted-hi">Lembrar-me</span>
                  </label>
                  <button type="button" onClick={() => showCustomToast('Link enviado')} className="text-[0.74rem] font-semibold text-sky_l hover:text-gold cursor-pointer transition-colors">
                    Esqueci a senha
                  </button>
                </div>

                {/* CTA */}
                <div className="relative group mb-1">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="cta-glass relative w-full py-[17px] bg-gradient-to-r from-gold via-[#f0a800] to-orange_l border border-white/20 rounded-full text-navy text-base font-extrabold tracking-[1.5px] uppercase cursor-pointer transition-all duration-350 overflow-hidden z-[1] shadow-[0_4px_14px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.3),inset_0_-2px_0_rgba(0,0,0,0.08)] hover:-translate-y-0.5 hover:shadow-[0_6px_18px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.35),inset_0_-2px_0_rgba(0,0,0,0.08)] active:translate-y-px active:shadow-[0_1px_4px_rgba(0,0,0,0.3),inset_0_3px_6px_rgba(0,0,0,0.15)] disabled:pointer-events-none disabled:opacity-90"
                  >
                    {isLoading ? (
                      <span className="inline-flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        A autenticar...
                      </span>
                    ) : (
                      <>
                        Iniciar Sessão <span className="inline-block ml-2 transition-transform group-hover:translate-x-1">&rarr;</span>
                        <div className="cta-shimmer"></div>
                      </>
                    )}
                  </button>
                  <div className="absolute -bottom-1 left-[15%] right-[15%] h-[22px] bg-gold rounded-full blur-[20px] opacity-30 z-0 transition-opacity group-hover:opacity-50"></div>
                </div>

                {/* Secure badge */}
                <div className="flex items-center justify-center gap-1.5 mt-4 mb-2 text-[0.62rem] font-semibold text-muted tracking-wide">
                  <svg className="w-3 h-3 stroke-teal_l fill-none" style={{strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round'}} viewBox="0 0 24 24">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                  Conexão encriptada &middot; TLS 1.3
                </div>
              </form>

              {/* Separator */}
              <div className="flex items-center gap-2.5 my-7 opacity-0 animate-fadeUp3">
                <div className="flex-1 h-px bg-sky_l/[0.12]"></div>
                <span className="text-[0.58rem] font-bold text-teal_l tracking-[2px] uppercase whitespace-nowrap px-3.5 py-1 bg-teal_l/10 border border-teal_l/20 rounded-full">ou continuar com</span>
                <div className="flex-1 h-px bg-sky_l/[0.12]"></div>
              </div>

              {/* Social buttons */}
              <div className="flex gap-2.5 opacity-0 animate-fadeUp4">
                <button
                  type="button"
                  onClick={() => showCustomToast('Google Auth ativo')}
                  className="s-btn-glass relative flex-1 flex items-center justify-center gap-2 py-3.5 bg-gradient-to-br from-[#1a7a96] to-[#16698a] border border-sky_l/20 border-l-[3px] border-l-gold rounded-full text-white text-[0.82rem] font-bold cursor-pointer transition-all duration-300 shadow-[0_4px_12px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.12),inset_0_-1px_0_rgba(0,0,0,0.2)] hover:bg-gradient-to-br hover:from-teal_l hover:to-[#1a7a96] hover:border-gold/35 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.15),inset_0_-1px_0_rgba(0,0,0,0.2)] active:translate-y-px active:shadow-[inset_0_2px_5px_rgba(0,0,0,0.3)]"
                >
                  <svg className="w-[18px] h-[18px] fill-sky_l/85 transition-all group-hover:fill-gold" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Google
                </button>
                <button
                  type="button"
                  onClick={() => showCustomToast('Facebook Auth ativo')}
                  className="s-btn-glass relative flex-1 flex items-center justify-center gap-2 py-3.5 bg-gradient-to-br from-[#1a7a96] to-[#16698a] border border-sky_l/20 border-l-[3px] border-l-gold rounded-full text-white text-[0.82rem] font-bold cursor-pointer transition-all duration-300 shadow-[0_4px_12px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.12),inset_0_-1px_0_rgba(0,0,0,0.2)] hover:bg-gradient-to-br hover:from-teal_l hover:to-[#1a7a96] hover:border-gold/35 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.15),inset_0_-1px_0_rgba(0,0,0,0.2)] active:translate-y-px active:shadow-[inset_0_2px_5px_rgba(0,0,0,0.3)]"
                >
                  <svg className="w-[18px] h-[18px] fill-sky_l/85 transition-all" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Facebook
                </button>
              </div>

            </div>

            {/* Footer */}
            <div className="px-8 py-4 border-t border-teal_l/10 flex items-center justify-between opacity-0 animate-fadeUp5">
              <p className="text-[0.78rem] text-sky_l">Não tens conta?</p>
              <button type="button" onClick={() => showCustomToast('Registo em breve')} className="text-gold font-bold text-[0.78rem] no-underline cursor-pointer transition-all px-4 py-1.5 bg-gold/[0.08] border border-gold/20 rounded-full hover:bg-gold/[0.15] hover:border-gold/35">
                Criar conta &rarr;
              </button>
            </div>

          </div>
        </div>

        {/* Scene footer */}
        <div className="text-center opacity-0 animate-fadeUp6">
          <p className="text-[0.62rem] text-sky_l/30 italic tracking-wide">
            A performance não é um acaso, é uma <b className="text-gold/50 font-semibold not-italic">ciência</b>.
          </p>
        </div>

      </div>
    </div>
  );
}
