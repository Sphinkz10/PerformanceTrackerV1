import React, { useState } from 'react';
import { X, Save } from 'lucide-react';
import styles from './luna-forms.module.css';
import { useLunaForms } from './LunaFormsContext';
import { submitLunaFormResponse } from './lunaFormsApi';

interface LunaSubmissionModalProps {
  formId: number;
}

export const LunaSubmissionModal: React.FC<LunaSubmissionModalProps> = ({ formId }) => {
  const { forms, setForms, setPreviewFormId } = useLunaForms();
  const form = forms.find(f => f.id === formId);

  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [errors, setErrors] = useState<Record<number, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!form) return null;

  const handleClose = () => {
    setPreviewFormId(null);
  };

  const handleInputChange = (fieldId: number, value: string) => {
    setAnswers(prev => ({ ...prev, [fieldId]: value }));
    if (errors[fieldId]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
    }
  };

  const transformValue = (value: string, transformType: string, multiplier?: number): string => {
    const num = parseFloat(value);
    if (isNaN(num)) return value;

    switch (transformType) {
      case 'kg_to_lbs':
        return (num * 2.20462).toFixed(2);
      case 'lbs_to_kg':
        return (num / 2.20462).toFixed(2);
      case 'scale':
        return (num * (multiplier || 1)).toFixed(2);
      case 'percentage':
        return ((num * (multiplier || 1)) / 100).toFixed(2);
      default:
        return value;
    }
  };

  const handleSubmit = async () => {
    const newErrors: Record<number, string> = {};

    form.fields.forEach(field => {
      const val = answers[field.id];
      if (field.required && (!val || val.trim() === '')) {
        newErrors[field.id] = 'Este campo é obrigatório.';
      }
      if (field.type === 'number' && val) {
        if (isNaN(parseFloat(val))) {
          newErrors[field.id] = 'Insira um número válido.';
        }
      }
      if (field.type === 'email' && val) {
         if (!/^\S+@\S+\.\S+$/.test(val)) {
             newErrors[field.id] = 'Email inválido.';
         }
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const transformedAnswers = form.fields.map(field => {
        let finalValue = answers[field.id] || '';
        if (field.transform && field.transform.type !== 'none' && finalValue) {
          finalValue = transformValue(finalValue, field.transform.type, field.transform.multiplier);
        }
        return {
          fieldId: field.id,
          value: finalValue
        };
      });

      await submitLunaFormResponse(formId, transformedAnswers);

      const toast = document.createElement('div');
      toast.className = styles.toast;
      toast.innerText = 'Respostas submetidas com sucesso!';
      toast.style.cssText = `
        position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%); z-index: 999;
        background: linear-gradient(135deg, var(--navy-light), var(--navy-mid)); border: 1px solid rgba(255,183,1,0.3); color: var(--gold); padding: 12px 28px; border-radius: 50px; font-weight: 700; box-shadow: 0 10px 30px rgba(0,0,0,.4);
      `;
      document.body.appendChild(toast);
      setTimeout(() => { toast.style.opacity = '0'; toast.style.transition = 'opacity .5s'; setTimeout(() => toast.remove(), 500) }, 2500);

      // Optionally refresh the data via SWR by manually calling mutate,
      // but since context holds local state, we can update local submissions
      // or simply rely on standard refresh. Updating local for immediate feedback:
      const newSubmission = {
        date: new Date().toISOString(),
        answers: transformedAnswers
      };

      setForms(prev => prev.map(f => {
        if (f.id === formId) {
          return {
            ...f,
            submissions: [...(f.submissions || []), newSubmission]
          };
        }
        return f;
      }));

      handleClose();
    } catch (e) {
      const toast = document.createElement('div');
      toast.className = styles.toast;
      toast.innerText = 'Erro ao submeter respostas.';
      toast.style.cssText = `
        position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%); z-index: 999;
        background: #B91C1C; border: 1px solid rgba(255,255,255,0.3); color: white; padding: 12px 28px; border-radius: 50px; font-weight: 700; box-shadow: 0 10px 30px rgba(0,0,0,.4);
      `;
      document.body.appendChild(toast);
      setTimeout(() => { toast.style.opacity = '0'; toast.style.transition = 'opacity .5s'; setTimeout(() => toast.remove(), 500) }, 2500);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <div>
            <h2 className={styles.modalTitle}>{form.title || 'Sem título'}</h2>
            {form.description && <p className={styles.modalDesc}>{form.description}</p>}
          </div>
          <button className={styles.closeModalBtn} onClick={handleClose}>
            <X size={20} />
          </button>
        </div>

        <div className={styles.modalBody}>
          {form.fields.map(field => (
            <div key={field.id} className={styles.formGroup}>
              <label className={styles.formLabel}>
                {field.label}
                {field.required && <span className={styles.requiredMark}>*</span>}
              </label>

              {(field.type === 'text' || field.type === 'email' || field.type === 'number') && (
                <input
                  type={field.type}
                  className={styles.formInput}
                  placeholder={field.placeholder}
                  value={answers[field.id] || ''}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                />
              )}

              {field.type === 'textarea' && (
                <textarea
                  className={styles.formTextarea}
                  placeholder={field.placeholder}
                  value={answers[field.id] || ''}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                />
              )}

              {field.type === 'select' && (
                <select
                  className={styles.formSelect}
                  value={answers[field.id] || ''}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                >
                  <option value="">Selecione uma opção</option>
                  {field.options?.map((opt, i) => (
                    <option key={i} value={opt}>{opt}</option>
                  ))}
                </select>
              )}

              {field.type === 'radio' && (
                <div className={styles.radioGroup}>
                  {field.options?.map((opt, i) => (
                    <label key={i} className={styles.radioLabel}>
                      <input
                        type="radio"
                        name={`field_${field.id}`}
                        value={opt}
                        checked={answers[field.id] === opt}
                        onChange={(e) => handleInputChange(field.id, e.target.value)}
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              )}

              {field.type === 'checkbox' && (
                <div className={styles.checkboxGroup}>
                  {field.options?.map((opt, i) => {
                    const currentValues = answers[field.id] ? answers[field.id].split(',') : [];
                    return (
                      <label key={i} className={styles.checkboxLabel}>
                        <input
                          type="checkbox"
                          checked={currentValues.includes(opt)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              handleInputChange(field.id, [...currentValues, opt].join(','));
                            } else {
                              handleInputChange(field.id, currentValues.filter(v => v !== opt).join(','));
                            }
                          }}
                        />
                        {opt}
                      </label>
                    );
                  })}
                </div>
              )}

              {field.type === 'rating' && (
                <div className={styles.ratingGroup}>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                    <button
                      key={num}
                      type="button"
                      className={`${styles.ratingBtn} ${answers[field.id] === String(num) ? styles.selected : ''}`}
                      onClick={() => handleInputChange(field.id, String(num))}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              )}

              {errors[field.id] && <span className={styles.errorText}>{errors[field.id]}</span>}
            </div>
          ))}
          {form.fields.length === 0 && (
             <p className={styles.modalDesc}>Este formulário não tem campos.</p>
          )}
        </div>

        <div className={styles.modalFooter}>
          <button className={styles.btnCancel} onClick={handleClose} disabled={isSubmitting}>
            Cancelar
          </button>
          <button className={styles.btnSubmit} onClick={handleSubmit} disabled={isSubmitting} style={{ opacity: isSubmitting ? 0.7 : 1 }}>
            <Save size={18} /> {isSubmitting ? 'A submeter...' : 'Submeter'}
          </button>
        </div>
      </div>
    </div>
  );
};
