import React, { useEffect, useRef, useState } from 'react';
import styles from './luna.module.css';
import { LunaTopBar } from './LunaTopBar';
import { LunaSidebar } from './LunaSidebar';
import { LunaWorkspace } from './LunaWorkspace';
import { LunaPropertiesPanel } from './LunaPropertiesPanel';
import { Calculator, X, Plus, Dumbbell, SlidersHorizontal, Activity, Circle } from 'lucide-react';
import { LunaProvider, useLunaStore } from './LunaContext';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { LunaLibraryItem } from './types';

interface Toast {
  id: number;
  message: string;
}

// Render component for DragOverlay
const LibraryItemDragOverlay: React.FC<{ item: LunaLibraryItem }> = ({ item }) => {
  let Icon = Dumbbell;
  if (item.type === 'compound') Icon = Dumbbell;
  if (item.type === 'isolation') Icon = Circle;
  if (item.type === 'bodyweight') Icon = Activity;

  return (
    <div className={`${styles.libCard} ${styles.dragOverlay}`}>
      <div className={`${styles.libCardIcon} ${styles[item.color]}`}>
        <Icon size={14} />
      </div>
      <div className={styles.libCardText}>
        <div className={styles.libCardName}>{item.name}</div>
        <div className={styles.libCardMeta}>{item.category}</div>
      </div>
      <button className={styles.libCardAdd}>
        <Plus size={10} />
      </button>
    </div>
  );
};

const LunaDndWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentWorkout, addExerciseToBlock, reorderExercises, moveExerciseBetweenBlocks } = useLunaStore();
  const [activeItem, setActiveItem] = useState<LunaLibraryItem | null>(null);
  const [activeSortableId, setActiveSortableId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const isLibraryItem = active.data.current?.type === 'LibraryItem';

    if (isLibraryItem) {
      setActiveItem(active.data.current?.item as LunaLibraryItem);
    } else {
      setActiveSortableId(active.id as string);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    // Only handle cross-block movement of sortable items during drag over
    const { active, over } = event;

    if (!over) return;

    const activeData = active.data.current;
    if (activeData?.type === 'LibraryItem') return; // Library items handled in drag end

    const overData = over.data.current;

    // Support dropping onto another item or a droppable container
    const activeBlockId = activeData?.sortable?.containerId;
    const overBlockId = overData?.sortable?.containerId || over.id;

    if (!activeBlockId || !overBlockId || activeBlockId === overBlockId) return;

    // We only execute reorder between blocks here to show immediate feedback if needed
    // However, a simpler implementation is to just handle everything onDragEnd.
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveItem(null);
    setActiveSortableId(null);

    const { active, over } = event;
    if (!over) return;

    const isLibraryItem = active.data.current?.type === 'LibraryItem';

    if (isLibraryItem) {
      // Library -> Block
      const targetBlockId = over.data.current?.sortable?.containerId || over.id;
      if (typeof targetBlockId === 'string' && currentWorkout?.blocks.some(b => b.id === targetBlockId)) {
        addExerciseToBlock(active.data.current?.item as LunaLibraryItem, targetBlockId);
      }
    } else {
      // Sortable -> Sortable / Block
      const activeBlockId = active.data.current?.sortable?.containerId;
      const overBlockId = over.data.current?.sortable?.containerId || over.id;

      if (!activeBlockId || !overBlockId) return;

      if (activeBlockId === overBlockId) {
        // Reorder within same block
        const block = currentWorkout?.blocks.find(b => b.id === activeBlockId);
        if (!block) return;

        const oldIndex = block.exercises.findIndex(e => e.id === active.id);
        const newIndex = block.exercises.findIndex(e => e.id === over.id);

        if (oldIndex !== newIndex && oldIndex !== -1 && newIndex !== -1) {
          reorderExercises(activeBlockId, oldIndex, newIndex);
        }
      } else {
        // Move between blocks
        const sourceBlock = currentWorkout?.blocks.find(b => b.id === activeBlockId);
        const targetBlock = currentWorkout?.blocks.find(b => b.id === overBlockId);
        if (!sourceBlock || !targetBlock) return;

        const oldIndex = sourceBlock.exercises.findIndex(e => e.id === active.id);
        let newIndex = targetBlock.exercises.findIndex(e => e.id === over.id);

        // If dropping onto empty container
        if (newIndex === -1) {
          newIndex = targetBlock.exercises.length;
        }

        if (oldIndex !== -1) {
          moveExerciseBetweenBlocks(activeBlockId, overBlockId as string, oldIndex, newIndex);
        }
      }
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      {children}
      <DragOverlay dropAnimation={{ duration: 200, easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)' }}>
        {activeItem ? <LibraryItemDragOverlay item={activeItem} /> : null}
      </DragOverlay>
    </DndContext>
  );
};

export const LunaDesignStudio: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Modals state
  const [isCalcOpen, setIsCalcOpen] = useState(false);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isDistOpen, setIsDistOpen] = useState(false);

  // Toasts state
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastIdCounter = useRef(0);

  const showToast = (message: string) => {
    const id = toastIdCounter.current++;
    setToasts(prev => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  // Particles Background Effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w: number, h: number;
    const particles: any[] = [];
    let animationFrameId: number;

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resize);
    resize();

    for(let i=0; i<55; i++){
      const t = Math.random();
      const col = t > .65 ? '255,183,1' : t > .3 ? '32,158,187' : '142,202,230';
      const warm = t > .65;
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * (warm ? 2 : 1.2) + .3,
        dx: (Math.random() - .5) * .18,
        dy: (Math.random() - .5) * .18,
        o: Math.random() * (warm ? .22 : .1) + .04,
        c: col
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for(let i=0; i<particles.length; i++){
        const p = particles[i];
        p.x += p.dx; p.y += p.dy;
        if(p.x < 0) p.x = w; if(p.x > w) p.x = 0;
        if(p.y < 0) p.y = h; if(p.y > h) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
        ctx.fillStyle = `rgba(${p.c},${p.o})`;
        ctx.fill();
      }

      for(let i=0; i<particles.length; i++){
        for(let j=i+1; j<particles.length; j++){
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          if(dist < 110){
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(32,158,187,${0.04 * (1 - dist/110)})`;
            ctx.lineWidth = .5;
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

  return (
    <LunaProvider>
      <LunaDndWrapper>
    <div className={styles.lunaContainer}>
      <canvas ref={canvasRef} className={styles.pts}></canvas>
      <div className={styles.bgBase}></div>
      <div className={styles.bgGrad}></div>
      <div className={styles.vignette}></div>

      <div className={styles.app}>
        <LunaTopBar
          onCalcClick={() => setIsCalcOpen(true)}
          onDistClick={() => setIsDistOpen(true)}
          onSaveClick={() => showToast('Treino guardado')}
        />

        <div className={styles.body}>
          <LunaSidebar />
          <LunaWorkspace onConfigClick={(id) => setIsConfigOpen(true)} />
          <LunaPropertiesPanel />
        </div>
      </div>

      {/* --- MODALS --- */}

      {/* Exercise Config Modal */}
      {isConfigOpen && (
        <div className={`${styles.modalBackdrop} ${styles.open}`} onClick={(e) => {
          if (e.target === e.currentTarget) setIsConfigOpen(false);
        }}>
          <div className={`${styles.modal} ${styles.glassStrong}`}>
            <div className={styles.modalHeader}>
              <h2>
                <Dumbbell size={18} color="var(--gold)" />
                Configurar Exercício
              </h2>
              <button className={styles.modalClose} onClick={() => setIsConfigOpen(false)}>
                <X size={13} />
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.sectionTitle}>Bench Press</div>
              <table className={styles.setsTable}>
                <thead>
                  <tr>
                    <th>Série</th><th>Reps</th><th>Carga (kg)</th><th>RPE</th><th>Descanso</th>
                  </tr>
                </thead>
                <tbody>
                  {[1,2,3,4,5].map(setNum => (
                    <tr key={setNum} className={styles.setRow}>
                      <td><div className={styles.setNum}>{setNum}</div></td>
                      <td><input type="number" className={styles.miniInput} defaultValue={setNum === 1 ? 8 : 5} /></td>
                      <td><input type="number" className={styles.miniInput} defaultValue={85} /></td>
                      <td><input type="number" className={styles.miniInput} defaultValue={8} /></td>
                      <td><input type="text" className={styles.miniInput} defaultValue="2min" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button className={styles.addExBtn} style={{ marginTop: 8 }}>
                <Plus size={12} />
                Adicionar série
              </button>

              <div className={styles.sectionTitle} style={{ marginTop: 18 }}>Notas</div>
              <div className={styles.field}>
                <textarea className={styles.fieldInput} rows={2} style={{ resize: 'vertical' }} defaultValue="Foco no controlo excêntrico. Espasmo escapular activo."></textarea>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={() => { setIsConfigOpen(false); setIsCalcOpen(true); }}>
                <Calculator size={13} />
                Calculadora
              </button>
              <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={() => setIsConfigOpen(false)}>Cancelar</button>
              <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={() => { setIsConfigOpen(false); showToast('Exercício guardado'); }}>Guardar</button>
            </div>
          </div>
        </div>
      )}

      {/* Calc Modal */}
      {isCalcOpen && (
        <div className={`${styles.modalBackdrop} ${styles.open}`} onClick={(e) => {
          if (e.target === e.currentTarget) setIsCalcOpen(false);
        }}>
          <div className={`${styles.modal} ${styles.glassStrong}`} style={{ maxWidth: 420 }}>
            <div className={styles.modalHeader}>
              <h2>
                <Calculator size={18} color="var(--gold)" />
                Calculadora de Carga
              </h2>
              <button className={styles.modalClose} onClick={() => setIsCalcOpen(false)}>
                <X size={13} />
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.fieldRow}>
                <div className={styles.field}>
                  <label className={styles.fieldLabel}>1RM Atual</label>
                  <input type="number" className={styles.fieldInput} defaultValue={120} />
                </div>
                <div className={styles.field}>
                  <label className={styles.fieldLabel}>% 1RM</label>
                  <input type="number" className={styles.fieldInput} defaultValue={70} />
                </div>
              </div>
              <div style={{ background: 'linear-gradient(135deg, rgba(255,183,1,0.15), rgba(252,133,0,0.05))', border: '1px solid rgba(255,183,1,0.3)', borderRadius: 12, padding: 18, textAlign: 'center', marginTop: 8 }}>
                <div style={{ fontSize: '.62rem', color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 700 }}>Carga Recomendada</div>
                <div style={{ fontFamily: 'Space Grotesk', fontSize: '2.2rem', fontWeight: 700, color: 'var(--white)', marginTop: 4 }}>84 <span style={{ fontSize: '1rem', color: 'var(--gold)' }}>kg</span></div>
                <div style={{ fontSize: '.65rem', color: 'var(--muted-hi)', marginTop: 4 }}>~8-10 reps possíveis</div>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={() => setIsCalcOpen(false)}>Fechar</button>
              <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={() => { setIsCalcOpen(false); showToast('Carga aplicada'); }}>Aplicar</button>
            </div>
          </div>
        </div>
      )}

      {/* Distribution Slide */}
      <div className={`${styles.slideOver} ${styles.glassStrong} ${isDistOpen ? styles.open : ''}`}>
        <div className={styles.modalHeader}>
          <h2>
            <SlidersHorizontal size={18} color="var(--gold)" />
            Distribuição de Carga
          </h2>
          <button className={styles.modalClose} onClick={() => setIsDistOpen(false)}>
            <X size={13} />
          </button>
        </div>
        <div className={styles.slideOverBody}>
          <div className={styles.sectionTitle}>Volume por Bloco</div>
          <div className={styles.distCard}>
            <div className={styles.distCardHeader}>
              <span className={styles.distCardName}>Aquecimento</span>
              <span className={styles.distCardPct}>15%</span>
            </div>
            <div className={styles.distBar}><div className={styles.distBarFill} style={{ width: '15%' }}></div></div>
          </div>
          <div className={styles.distCard}>
            <div className={styles.distCardHeader}>
              <span className={styles.distCardName}>Bloco Principal</span>
              <span className={styles.distCardPct}>70%</span>
            </div>
            <div className={styles.distBar}><div className={styles.distBarFill} style={{ width: '70%' }}></div></div>
          </div>
          <div className={styles.distCard}>
            <div className={styles.distCardHeader}>
              <span className={styles.distCardName}>Finisher</span>
              <span className={styles.distCardPct}>15%</span>
            </div>
            <div className={styles.distBar}><div className={styles.distBarFill} style={{ width: '15%' }}></div></div>
          </div>

          <div className={styles.sectionTitle}>Padrões Motores</div>
          <div className={styles.distCard}>
            <div className={styles.distCardHeader}>
              <span className={styles.distCardName}>Push</span>
              <span className={styles.distCardPct}>45%</span>
            </div>
            <div className={styles.distBar}><div className={styles.distBarFill} style={{ width: '45%' }}></div></div>
          </div>
          <div className={styles.distCard}>
            <div className={styles.distCardHeader}>
              <span className={styles.distCardName}>Pull</span>
              <span className={styles.distCardPct}>20%</span>
            </div>
            <div className={styles.distBar}><div className={styles.distBarFill} style={{ width: '20%' }}></div></div>
          </div>
          <div className={styles.distCard}>
            <div className={styles.distCardHeader}>
              <span className={styles.distCardName}>Squat</span>
              <span className={styles.distCardPct}>25%</span>
            </div>
            <div className={styles.distBar}><div className={styles.distBarFill} style={{ width: '25%' }}></div></div>
          </div>
          <div className={styles.distCard}>
            <div className={styles.distCardHeader}>
              <span className={styles.distCardName}>Hinge</span>
              <span className={styles.distCardPct}>10%</span>
            </div>
            <div className={styles.distBar}><div className={styles.distBarFill} style={{ width: '10%' }}></div></div>
          </div>
        </div>
      </div>

      {/* Toasts container */}
      <div className={styles.toastBox}>
        {toasts.map(t => (
          <div key={t.id} className={styles.toast}>
            {t.message}
          </div>
        ))}
      </div>
    </div>
      </LunaDndWrapper>
    </LunaProvider>
  );
};
