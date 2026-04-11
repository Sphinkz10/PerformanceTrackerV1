import React, { useEffect, useRef } from 'react';
import styles from './luna-forms.module.css';
import { LunaFormsProvider, useLunaForms } from './LunaFormsContext';
import { FormsSidebar } from './FormsSidebar';
import { FormsWorkspace } from './FormsWorkspace';
import { FormsPropertiesPanel } from './FormsPropertiesPanel';
import { DrawerBackdrop } from './DrawerBackdrop';
import { Menu, Settings, Save, RefreshCw } from 'lucide-react';

const Particles: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w: number, h: number;
    const particles: any[] = [];

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    for (let i = 0; i < 60; i++) {
      const t = Math.random();
      const col = t > 0.65 ? '255,183,1' : t > 0.3 ? '32,158,187' : '142,202,230';
      const warm = t > 0.65;
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * (warm ? 2 : 1.2) + 0.3,
        dx: (Math.random() - 0.5) * 0.18,
        dy: (Math.random() - 0.5) * 0.18,
        o: Math.random() * (warm ? 0.25 : 0.12) + 0.04,
        c: col
      });
    }

    let animationFrameId: number;

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      for (const p of particles) {
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
          const ds = Math.sqrt(dx * dx + dy * dy);
          if (ds < 110) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(32,158,187,${0.05 * (1 - ds / 110)})`;
            ctx.lineWidth = 0.5;
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

  return <canvas ref={canvasRef} className={styles.pts} />;
};

const Topbar: React.FC = () => {
  const { toggleLeftDrawer, toggleRightDrawer, forms, currentFormId } = useLunaForms();

  const handleSave = () => {
    // Basic toast imitation for now, the real save logic would persist state to backend
    const toast = document.createElement('div');
    toast.className = styles.toast;
    toast.innerText = 'Guardado';
    toast.style.cssText = `
      position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%); z-index: 999;
      background: linear-gradient(135deg, var(--navy-light), var(--navy-mid)); border: 1px solid rgba(255,183,1,0.3); color: var(--gold); padding: 12px 28px; border-radius: 50px; font-weight: 700; box-shadow: 0 10px 30px rgba(0,0,0,.4);
    `;
    document.body.appendChild(toast);
    setTimeout(() => { toast.style.opacity = '0'; toast.style.transition = 'opacity .5s'; setTimeout(() => toast.remove(), 500) }, 2500);
  };

  return (
    <header className={`${styles.topbar} ${styles.glass}`}>
      <div className={styles.tbLeft}>
        <button className={styles.menuBtn} onClick={toggleLeftDrawer}>
          <Menu size={18} />
        </button>
        <button className={styles.btnIcon} onClick={() => window.location.reload()}>
          <RefreshCw size={16} />
        </button>
        <div className={styles.studioBrand}>
          <div className={styles.studioBrandIcon}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#023047">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
            </svg>
          </div>
          <div className={styles.studioBrandText}>
            Forms Center
            <small>LUNA.OS</small>
          </div>
        </div>
      </div>
      <div className={styles.tbCenter} />
      <div className={styles.tbRight}>
        <button className={styles.propsToggleBtn} onClick={toggleRightDrawer}>
          <Settings size={18} />
        </button>
        <button className={styles.btnSave} onClick={handleSave}>
          <Save size={13} /> Salvar
        </button>
      </div>
    </header>
  );
};

export const LunaFormsAppContent: React.FC = () => {
  return (
    <div className={styles.container}>
      <Particles />
      <div className={styles.bgBase} />
      <div className={styles.bgGrad} />
      <div className={styles.vignette} />

      <div className={styles.app}>
        <Topbar />

        <div className={styles.body}>
          <FormsSidebar />
          <FormsWorkspace />
          <FormsPropertiesPanel />
        </div>
      </div>

      <DrawerBackdrop />
    </div>
  );
};

export const LunaFormsApp: React.FC = () => {
  return (
    <LunaFormsProvider>
      <LunaFormsAppContent />
    </LunaFormsProvider>
  );
};
