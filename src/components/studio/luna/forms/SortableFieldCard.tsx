import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Copy, Trash2 } from 'lucide-react';
import styles from './luna-forms.module.css';
import { LunaFormField } from './formsTypes';

interface SortableFieldCardProps {
  field: LunaFormField;
  isSelected: boolean;
  onFieldClick: (e: React.MouseEvent, fieldId: number) => void;
  updateField: (fieldId: number, updates: Partial<LunaFormField>) => void;
  duplicateField: (fieldId: number) => void;
  deleteField: (fieldId: number) => void;
}

const fieldTypes = [
  { value: 'text', label: 'Texto Curto' }, { value: 'textarea', label: 'Texto Longo' }, { value: 'number', label: 'Número' },
  { value: 'email', label: 'Email' }, { value: 'phone', label: 'Telefone' }, { value: 'date', label: 'Data' },
  { value: 'time', label: 'Hora' }, { value: 'duration', label: 'Duração' }, { value: 'select', label: 'Lista' },
  { value: 'radio', label: 'Escolha Única' }, { value: 'checkbox', label: 'Múltipla Escolha' }, { value: 'rating', label: 'Avaliação' },
  { value: 'location', label: 'Localização' }, { value: 'upload', label: 'Upload' }, { value: 'signature', label: 'Assinatura' }
];

export const SortableFieldCard: React.FC<SortableFieldCardProps> = ({
  field,
  isSelected,
  onFieldClick,
  updateField,
  duplicateField,
  deleteField
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${styles.fieldCard} ${isSelected ? styles.selected : ''} ${isDragging ? styles.dragging : ''}`}
      onClick={(e) => onFieldClick(e, field.id)}
    >
      <div className={styles.fieldHeader}>
        {/* Pass ONLY listeners to drag handle */}
        <div className={styles.dragHandle} {...attributes} {...listeners}>⋮⋮</div>
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
  );
};
