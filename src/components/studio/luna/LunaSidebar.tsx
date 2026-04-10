import React, { useState } from 'react';
import {
  FolderLibrary,
  Layers,
  Search,
  Menu,
  Grid,
  Plus,
  ChevronRight,
  ChevronDown,
  Activity,
  Circle,
  Dumbbell
} from 'lucide-react';
import styles from './luna.module.css';
import { mapExerciseToLibraryItem, LunaLibraryItem } from './types';
import { useExercises } from '@/hooks/useExercises';
import { useDraggable } from '@dnd-kit/core';

// Fallback icons if FolderLibrary isn't available in lucide-react version
import { BookMarked } from 'lucide-react';

const DraggableLibraryItem: React.FC<{ item: LunaLibraryItem }> = ({ item }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `lib-item-${item.id}`,
    data: {
      type: 'LibraryItem',
      item,
    },
  });

  let Icon = Dumbbell;
  if (item.type === 'compound') Icon = Dumbbell;
  if (item.type === 'isolation') Icon = Circle;
  if (item.type === 'bodyweight') Icon = Activity;

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`${styles.libCard} ${isDragging ? styles.isDragging : ''}`}
    >
      <div className={`${styles.libCardIcon} ${styles[item.color]}`}>
        <Icon size={14} />
      </div>
      <div className={styles.libCardText}>
        <div className={styles.libCardName}>{item.name}</div>
        <div className={styles.libCardMeta}>{item.category}</div>
      </div>
      <button className={styles.libCardAdd} onClick={(e) => e.stopPropagation()}>
        <Plus size={10} />
      </button>
    </div>
  );
};


const LibraryWorkoutItem = ({ item }: { item: LunaLibraryWorkout }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `lib-w-${item.id}`,
    data: { type: 'library-workout', item }
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`${styles.libraryItem} ${isDragging ? styles.dragging : ''}`}
    >
      <div className={styles.libraryItemIcon}>
        <Dumbbell size={16} />
      </div>
      <div className={styles.libraryItemInfo}>
        <h4>{item.name}</h4>
      </div>
      <GripVertical size={16} className={styles.dragHandleIcon} />
    </div>
  );
};

export const LunaSidebar: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'library' | 'layers'>('library');
  const [activeFilter, setActiveFilter] = useState('Todos');

  const { exercises, loading } = useExercises();
  const libraryItems = (exercises || []).map(mapExerciseToLibraryItem);

  // Example state for expanded layers
  const [expandedLayers, setExpandedLayers] = useState<Record<string, boolean>>({
    'forca': true,
    'warmup': true,
    'main': true
  });

  const toggleLayer = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedLayers(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <aside className={`${styles.leftCol} ${styles.glass}`}>
      <div className={styles.tabsBar}>
        <button
          className={`${styles.colTab} ${activeTab === 'library' ? styles.active : ''}`}
          onClick={() => setActiveTab('library')}
        >
          <BookMarked size={12} />
          Biblioteca
        </button>
        <button
          className={`${styles.colTab} ${activeTab === 'layers' ? styles.active : ''}`}
          onClick={() => setActiveTab('layers')}
        >
          <Layers size={12} />
          Camadas
        </button>
      </div>

      {/* Library Content */}
      <div className={`${styles.library} ${activeTab !== 'library' ? styles.hidden : ''}`}>
        <div className={styles.searchWrap}>
          <Search size={14} />
          <input type="text" placeholder="Pesquisar biblioteca..." />
        </div>

        <div className={styles.filterRow}>
          {['Todos', 'Exerc.', 'Treinos', 'Planos'].map(filter => (
            <button
              key={filter}
              className={`${styles.filterPill} ${activeFilter === filter ? styles.active : ''}`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className={styles.viewToggle}>
          <select className={styles.sortSelect} defaultValue="Mais recentes">
            <option>Mais recentes</option>
            <option>A-Z</option>
            <option>Mais usados</option>
          </select>
          <div className={styles.viewBtns}>
            <button className={`${styles.viewBtn} ${styles.active}`}>
              <Menu size={11} />
            </button>
            <button className={styles.viewBtn}>
              <Grid size={11} />
            </button>
          </div>
        </div>

        <div className={styles.libGrid}>
          {loading ? (
            <div style={{ color: 'var(--muted-hi)', fontSize: '0.8rem', padding: '1rem', textAlign: 'center' }}>
              A carregar biblioteca...
            </div>
          ) : (
            libraryItems.map(item => (
              <DraggableLibraryItem key={item.id} item={item} />
            ))
          )}
        </div>
      </div>

      {/* Layers Content */}
      <div className={`${styles.layers} ${activeTab === 'layers' ? styles.active : ''}`}>
        <div className={`${styles.layerItem} ${expandedLayers['forca'] ? styles.expanded : ''}`}>
          <div className={styles.layerToggle} onClick={(e) => toggleLayer('forca', e)}>
            <ChevronRight size={10} />
          </div>
          <div className={`${styles.layerIcon} ${styles.gold}`}>
            <Activity size={11} />
          </div>
          <div className={styles.layerName}>Força Avançada</div>
        </div>

        {expandedLayers['forca'] && (
          <div className={styles.layerChildren}>

            {/* Warmup Layer */}
            <div className={`${styles.layerItem} ${expandedLayers['warmup'] ? styles.expanded : ''}`}>
              <div className={styles.layerToggle} onClick={(e) => toggleLayer('warmup', e)}>
                <ChevronRight size={10} />
              </div>
              <div className={`${styles.layerIcon} ${styles.gold}`}>
                <Circle size={11} />
              </div>
              <div className={styles.layerName}>Aquecimento</div>
            </div>
            {expandedLayers['warmup'] && (
              <div className={styles.layerChildren}>
                <div className={styles.layerItem}>
                  <div className={styles.layerToggle}></div>
                  <div className={`${styles.layerIcon} ${styles.teal}`}>
                    <Dumbbell size={11} />
                  </div>
                  <div className={styles.layerName}>Mobilidade dinâmica</div>
                </div>
                <div className={styles.layerItem}>
                  <div className={styles.layerToggle}></div>
                  <div className={`${styles.layerIcon} ${styles.teal}`}>
                    <Dumbbell size={11} />
                  </div>
                  <div className={styles.layerName}>Activation x 3</div>
                </div>
              </div>
            )}

            {/* Main Layer */}
            <div className={`${styles.layerItem} ${styles.selected} ${expandedLayers['main'] ? styles.expanded : ''}`}>
              <div className={styles.layerToggle} onClick={(e) => toggleLayer('main', e)}>
                <ChevronRight size={10} />
              </div>
              <div className={`${styles.layerIcon} ${styles.orange}`}>
                <Circle size={11} />
              </div>
              <div className={styles.layerName}>Bloco Principal</div>
            </div>
            {expandedLayers['main'] && (
              <div className={styles.layerChildren}>
                <div className={styles.layerItem}>
                  <div className={styles.layerToggle}></div>
                  <div className={`${styles.layerIcon} ${styles.teal}`}>
                    <Dumbbell size={11} />
                  </div>
                  <div className={styles.layerName}>Bench Press</div>
                </div>
                <div className={styles.layerItem}>
                  <div className={styles.layerToggle}></div>
                  <div className={`${styles.layerIcon} ${styles.teal}`}>
                    <Dumbbell size={11} />
                  </div>
                  <div className={styles.layerName}>Squat Back</div>
                </div>
                <div className={styles.layerItem}>
                  <div className={styles.layerToggle}></div>
                  <div className={`${styles.layerIcon} ${styles.teal}`}>
                    <Dumbbell size={11} />
                  </div>
                  <div className={styles.layerName}>Deadlift</div>
                </div>
              </div>
            )}

            {/* Finisher Layer */}
            <div className={styles.layerItem}>
              <div className={styles.layerToggle}></div>
              <div className={`${styles.layerIcon} ${styles.teal}`}>
                <Circle size={11} />
              </div>
              <div className={styles.layerName}>Finisher</div>
            </div>

          </div>
        )}
      </div>
    </aside>
  );
};
