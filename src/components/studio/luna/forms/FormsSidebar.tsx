import React, { useState, useEffect, useRef } from 'react';
import styles from './luna-forms.module.css';
import { useLunaForms } from './LunaFormsContext';
import { Search, Plus } from 'lucide-react';

export const FormsSidebar: React.FC = () => {
  const { forms, setForms, currentFormId, setCurrentFormId, isLeftDrawerOpen, closeDrawers, setPreviewFormId } = useLunaForms();
  const [activeTab, setActiveTab] = useState<'all' | 'templates' | 'responses'>('all');
  const [search, setSearch] = useState('');
  const [contextMenu, setContextMenu] = useState<{ id: number, x: number, y: number } | null>(null);

  const statTotal = forms.length;
  const statTemplates = forms.filter(f => f.isTemplate).length;
  const statResponses = forms.reduce((acc, f) => acc + (f.submissions?.length || 0), 0);

  let filteredForms = forms.filter(f => f.title.toLowerCase().includes(search.toLowerCase()));
  if (activeTab === 'templates') {
    filteredForms = filteredForms.filter(f => f.isTemplate);
  } else if (activeTab === 'responses') {
    filteredForms = filteredForms.filter(f => f.submissions && f.submissions.length > 0);
  }

  const handleNewForm = () => {
    const newId = forms.length ? Math.max(...forms.map(f => f.id)) + 1 : 1;
    const newForm = {
      id: newId,
      title: 'Novo formulário',
      description: '',
      fields: [],
      logicRules: [],
      submissions: [],
      published: false,
      isTemplate: false
    };
    setForms([...forms, newForm]);
    setCurrentFormId(newId);
    if (window.innerWidth < 1024) closeDrawers();
  };

  const handleFormClick = (id: number) => {
    setCurrentFormId(id);
    if (window.innerWidth < 1024) closeDrawers();
  };

  const handleMenuClick = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setContextMenu({ id, x: e.pageX, y: e.pageY });
  };

  const closeMenu = () => setContextMenu(null);

  useEffect(() => {
    document.addEventListener('click', closeMenu);
    return () => document.removeEventListener('click', closeMenu);
  }, []);

  const handleAction = (action: string, id: number) => {
    const form = forms.find(f => f.id === id);
    if (!form) return;

    if (action === 'preview') {
      setPreviewFormId(id);
    } else if (action === 'edit') {
      setCurrentFormId(id);
      if (window.innerWidth < 1024) closeDrawers();
    } else if (action === 'duplicate') {
      const newId = forms.length ? Math.max(...forms.map(f => f.id)) + 1 : 1;
      const newForm = { ...JSON.parse(JSON.stringify(form)), id: newId, title: form.title + ' (cópia)', published: false, isTemplate: false };
      setForms([...forms, newForm]);
    } else if (action === 'togglePublish') {
      setForms(forms.map(f => f.id === id ? { ...f, published: !f.published, isTemplate: !f.published ? false : f.isTemplate } : f));
    } else if (action === 'delete') {
      if (window.confirm('Apagar permanentemente?')) {
        const newForms = forms.filter(f => f.id !== id);
        setForms(newForms);
        if (currentFormId === id) setCurrentFormId(newForms[0]?.id || null);
      }
    }
  };

  return (
    <aside className={`${styles.leftCol} ${styles.glass} ${isLeftDrawerOpen ? styles.open : ''}`}>
      <div className={styles.statsRow}>
        <div className={styles.statCard}><div className={styles.num}>{statTotal}</div><div className={styles.label}>Formulários</div></div>
        <div className={styles.statCard}><div className={styles.num}>{statTemplates}</div><div className={styles.label}>Templates</div></div>
        <div className={styles.statCard}><div className={styles.num}>{statResponses}</div><div className={styles.label}>Respostas</div></div>
      </div>

      <div className={styles.tabsBar}>
        <button className={`${styles.colTab} ${activeTab === 'all' ? styles.active : ''}`} onClick={() => setActiveTab('all')}>Todos</button>
        <button className={`${styles.colTab} ${activeTab === 'templates' ? styles.active : ''}`} onClick={() => setActiveTab('templates')}>Templates</button>
        <button className={`${styles.colTab} ${activeTab === 'responses' ? styles.active : ''}`} onClick={() => setActiveTab('responses')}>Respostas</button>
      </div>

      <div className={styles.searchWrap}>
        <Search size={14} />
        <input
          type="text"
          placeholder="Pesquisar..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className={styles.formList}>
        {filteredForms.map(f => (
          <div
            key={f.id}
            className={`${styles.formCard} ${currentFormId === f.id ? styles.active : ''}`}
            onClick={() => handleFormClick(f.id)}
          >
            <div className={styles.formCardTitle}>
              <span>{f.title || 'Sem título'}</span>
              <button className={styles.formCardMenu} onClick={(e) => handleMenuClick(e, f.id)}>⋮</button>
            </div>
            <div className={styles.formCardMeta}>
              <span>{f.fields.length} campos</span>
              <span>{f.submissions?.length || 0} respostas</span>
              <span className={styles.formCardBadge}>
                {f.published ? 'Publicado' : (f.isTemplate ? 'Template' : 'Rascunho')}
              </span>
            </div>
          </div>
        ))}
      </div>

      <button className={styles.newFormBtn} onClick={handleNewForm}>
        <Plus size={14} /> Novo Formulário
      </button>

      {contextMenu && (
        <div
          className={styles.contextMenu}
          style={{ left: contextMenu.x, top: contextMenu.y }}
        >
          <div className={styles.contextMenuItem} onClick={() => handleAction('preview', contextMenu.id)}>▶️ Prever</div>
          <div className={styles.contextMenuItem} onClick={() => handleAction('edit', contextMenu.id)}>✏️ Editar</div>
          <div className={styles.contextMenuItem} onClick={() => handleAction('duplicate', contextMenu.id)}>📑 Duplicar</div>
          <div className={styles.contextMenuItem} onClick={() => handleAction('togglePublish', contextMenu.id)}>
            {forms.find(f => f.id === contextMenu.id)?.published ? '📁 Arquivar' : '🚀 Publicar'}
          </div>
          <div className={`${styles.contextMenuItem} ${styles.danger}`} onClick={() => handleAction('delete', contextMenu.id)}>🗑️ Apagar</div>
        </div>
      )}
    </aside>
  );
};
