import React from 'react';
import styles from './luna-forms.module.css';
import { useLunaForms } from './LunaFormsContext';
import { Plus, Copy, Trash2 } from 'lucide-react';
import { LunaFormField } from './formsTypes';

const fieldTypes = [
  { value: 'text', label: 'Texto Curto' }, { value: 'textarea', label: 'Texto Longo' }, { value: 'number', label: 'Número' },
  { value: 'email', label: 'Email' }, { value: 'phone', label: 'Telefone' }, { value: 'date', label: 'Data' },
  { value: 'time', label: 'Hora' }, { value: 'duration', label: 'Duração' }, { value: 'select', label: 'Lista' },
  { value: 'radio', label: 'Escolha Única' }, { value: 'checkbox', label: 'Múltipla Escolha' }, { value: 'rating', label: 'Avaliação' },
  { value: 'location', label: 'Localização' }, { value: 'upload', label: 'Upload' }, { value: 'signature', label: 'Assinatura' }
];

export const FormsWorkspace: React.FC = () => {
  const {
    forms, setForms,
    currentFormId,
    selectedFieldId, setSelectedFieldId,
    toggleRightDrawer
  } = useLunaForms();

  const form = forms.find(f => f.id === currentFormId);

  if (!form) {
    return <main className={styles.workspace} style={{ opacity: 0.5 }}></main>;
  }

  const updateForm = (updates: Partial<typeof form>) => {
    setForms(forms.map(f => f.id === currentFormId ? { ...f, ...updates } : f));
  };

  const updateField = (fieldId: number, updates: Partial<LunaFormField>) => {
    updateForm({
      fields: form.fields.map(f => f.id === fieldId ? { ...f, ...updates } : f)
    });
  };

  const handleAddField = () => {
    const nextFieldId = form.fields.length ? Math.max(...form.fields.map(f => f.id)) + 1 : 100;
    updateForm({
      fields: [...form.fields, { id: nextFieldId, type: 'text', label: 'Nova pergunta', placeholder: '', required: false }]
    });
  };

  const duplicateField = (fieldId: number) => {
    const original = form.fields.find(f => f.id === fieldId);
    if (original) {
      const nextFieldId = form.fields.length ? Math.max(...form.fields.map(f => f.id)) + 1 : 100;
      const newField = { ...JSON.parse(JSON.stringify(original)), id: nextFieldId };
      const idx = form.fields.findIndex(f => f.id === fieldId);
      const newFields = [...form.fields];
      newFields.splice(idx + 1, 0, newField);
      updateForm({ fields: newFields });
    }
  };

  const deleteField = (fieldId: number) => {
    const newFields = form.fields.filter(f => f.id !== fieldId);
    updateForm({ fields: newFields });
    if (selectedFieldId === fieldId) {
      setSelectedFieldId(newFields[0]?.id || null);
    }
  };

  const handleFieldClick = (e: React.MouseEvent, fieldId: number) => {
    if ((e.target as HTMLElement).closest(`.${styles.fieldActions}`)) return;
    setSelectedFieldId(fieldId);
    if (window.innerWidth < 1024) {
      toggleRightDrawer();
    }
  };

  return (
    <main className={styles.workspace}>
      <div className={`${styles.formHeader} ${styles.glassStrong}`}>
        <input
          type="text"
          className={styles.formTitleInput}
          placeholder="Título do formulário..."
          value={form.title}
          onChange={(e) => updateForm({ title: e.target.value })}
        />
        <input
          type="text"
          className={styles.formDescInput}
          placeholder="Descrição..."
          value={form.description}
          onChange={(e) => updateForm({ description: e.target.value })}
        />
        <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
          <span className={styles.formCardBadge}>
            {form.published ? 'Publicado' : (form.isTemplate ? 'Template' : 'Rascunho')}
          </span>
          <button
            className={styles.btnSecondary}
            style={{ padding: '4px 12px', fontSize: '.6rem' }}
            onClick={() => updateForm({ published: !form.published, isTemplate: !form.published ? false : form.isTemplate })}
          >
            {form.published ? 'Arquivar' : 'Publicar'}
          </button>
        </div>
      </div>

      <div className={styles.fieldList}>
        {form.fields.map(field => (
          <div
            key={field.id}
            className={`${styles.fieldCard} ${selectedFieldId === field.id ? styles.selected : ''}`}
            onClick={(e) => handleFieldClick(e, field.id)}
          >
            <div className={styles.fieldHeader}>
              <div className={styles.dragHandle}>⋮⋮</div>
              <input
                type="text"
                className={styles.fieldLabelInput}
                value={field.label}
                onChange={(e) => updateField(field.id, { label: e.target.value })}
              />
              <span className={styles.fieldTypeBadge}>
                {fieldTypes.find(t => t.value === field.type)?.label || field.type}
              </span>
              <div className={styles.fieldActions}>
                <button className={styles.fieldActionBtn} onClick={(e) => { e.stopPropagation(); duplicateField(field.id); }}>
                  <Copy size={12} />
                </button>
                <button className={styles.fieldActionBtn} onClick={(e) => { e.stopPropagation(); deleteField(field.id); }}>
                  <Trash2 size={12} />
                </button>
              </div>
            </div>

            <div className={styles.fieldBody}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <label style={{ color: 'var(--white)', fontSize: '.8rem' }}>
                  <input
                    type="checkbox"
                    checked={field.required}
                    onChange={(e) => updateField(field.id, { required: e.target.checked })}
                    style={{ marginRight: '6px' }}
                  />
                  Obrigatório
                </label>
                <input
                  type="text"
                  className={styles.propInput}
                  style={{ flex: 1, padding: '6px 10px' }}
                  placeholder="Placeholder"
                  value={field.placeholder || ''}
                  onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
                />
              </div>
              {field.options !== undefined && (
                <div style={{ marginTop: '12px' }}>
                  <label style={{ color: 'var(--muted)', fontSize: '.7rem', display: 'block', marginBottom: '4px' }}>Opções (vírgula)</label>
                  <input
                    type="text"
                    className={styles.propInput}
                    value={(field.options || []).join(', ')}
                    onChange={(e) => updateField(field.id, { options: e.target.value.split(',').map(s => s.trim()) })}
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <button className={styles.addFieldBtn} onClick={handleAddField}>
        <Plus size={14} /> Adicionar Campo
      </button>
    </main>
  );
};
