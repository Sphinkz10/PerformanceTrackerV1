import React, { useState } from 'react';
import styles from './luna-forms.module.css';
import { useLunaForms } from './LunaFormsContext';
import { Trash2 } from 'lucide-react';
import { LunaFormField, LunaLogicRule, LunaFormFieldTransform } from './formsTypes';

export const FormsPropertiesPanel: React.FC = () => {
  const { forms, setForms, currentFormId, selectedFieldId, isRightDrawerOpen } = useLunaForms();
  const [activeTab, setActiveTab] = useState<'props' | 'logic' | 'transform'>('props');

  const form = forms.find(f => f.id === currentFormId);
  const field = form?.fields.find(f => f.id === selectedFieldId);

  if (!form) return <aside className={`${styles.rightCol} ${styles.glass} ${isRightDrawerOpen ? styles.open : ''}`} />;

  const updateField = (updates: Partial<LunaFormField>) => {
    if (!field) return;
    setForms(forms.map(f => f.id === currentFormId ? {
      ...f,
      fields: f.fields.map(fl => fl.id === field.id ? { ...fl, ...updates } : fl)
    } : f));
  };

  const updateLogicRules = (rules: LunaLogicRule[]) => {
    setForms(forms.map(f => f.id === currentFormId ? { ...f, logicRules: rules } : f));
  };

  return (
    <aside className={`${styles.rightCol} ${styles.glass} ${isRightDrawerOpen ? styles.open : ''}`}>
      <div className={styles.rightTabs}>
        <button className={`${styles.rightTab} ${activeTab === 'props' ? styles.active : ''}`} onClick={() => setActiveTab('props')}>Propriedades</button>
        <button className={`${styles.rightTab} ${activeTab === 'logic' ? styles.active : ''}`} onClick={() => setActiveTab('logic')}>Lógica</button>
        <button className={`${styles.rightTab} ${activeTab === 'transform' ? styles.active : ''}`} onClick={() => setActiveTab('transform')}>Transformações</button>
      </div>

      <div className={styles.rightPane}>
        {activeTab === 'props' && field && (
          <div id="propsPane">
            <div className={styles.propGroup}>
              <label className={styles.propLabel}>Label</label>
              <input
                type="text"
                className={styles.propInput}
                value={field.label}
                onChange={(e) => updateField({ label: e.target.value })}
              />
            </div>
            <div className={styles.propGroup}>
              <label className={styles.propLabel}>Placeholder</label>
              <input
                type="text"
                className={styles.propInput}
                value={field.placeholder || ''}
                onChange={(e) => updateField({ placeholder: e.target.value })}
              />
            </div>
            <div className={styles.propGroup} style={{ color: 'var(--white)', fontSize: '.8rem' }}>
              <label className={styles.propLabel}>Obrigatório</label>
              <input
                type="checkbox"
                checked={field.required}
                onChange={(e) => updateField({ required: e.target.checked })}
                style={{ marginRight: '6px' }}
              /> Sim
            </div>
            {field.options !== undefined && (
              <div className={styles.propGroup}>
                <label className={styles.propLabel}>Opções (vírgula)</label>
                <input
                  type="text"
                  className={styles.propInput}
                  value={(field.options || []).join(', ')}
                  onChange={(e) => updateField({ options: e.target.value.split(',').map(s => s.trim()) })}
                />
              </div>
            )}
          </div>
        )}

        {activeTab === 'logic' && (
          <div id="logicPane">
            {form.logicRules.map((rule, idx) => (
              <div key={idx} className={styles.logicRule}>
                <div className={styles.logicRuleRow}>
                  <select
                    className={styles.propSelect}
                    value={rule.fieldId}
                    onChange={(e) => {
                      const newRules = [...form.logicRules];
                      newRules[idx].fieldId = parseInt(e.target.value);
                      updateLogicRules(newRules);
                    }}
                  >
                    {form.fields.map(f => <option key={f.id} value={f.id}>{f.label}</option>)}
                  </select>
                  <select
                    className={styles.propSelect}
                    value={rule.condition}
                    onChange={(e) => {
                      const newRules = [...form.logicRules];
                      newRules[idx].condition = e.target.value as any;
                      updateLogicRules(newRules);
                    }}
                  >
                    <option value="equals">igual</option>
                    <option value="not_equals">diferente</option>
                    <option value="contains">contém</option>
                    <option value="greater">maior</option>
                    <option value="less">menor</option>
                  </select>
                </div>
                <div className={styles.logicRuleRow}>
                  <input
                    type="text"
                    className={styles.propInput}
                    placeholder="Valor"
                    value={rule.value}
                    onChange={(e) => {
                      const newRules = [...form.logicRules];
                      newRules[idx].value = e.target.value;
                      updateLogicRules(newRules);
                    }}
                  />
                </div>
                <div className={styles.logicRuleRow}>
                  <span style={{ fontSize: '.7rem', color: 'var(--muted)' }}>Ação:</span>
                  <select
                    className={styles.propSelect}
                    value={rule.action}
                    onChange={(e) => {
                      const newRules = [...form.logicRules];
                      newRules[idx].action = e.target.value as any;
                      updateLogicRules(newRules);
                    }}
                  >
                    <option value="show">Mostrar</option>
                    <option value="hide">Ocultar</option>
                    <option value="require">Obrigatório</option>
                  </select>
                  <select
                    className={styles.propSelect}
                    value={rule.targetFieldId}
                    onChange={(e) => {
                      const newRules = [...form.logicRules];
                      newRules[idx].targetFieldId = parseInt(e.target.value);
                      updateLogicRules(newRules);
                    }}
                  >
                    {form.fields.map(f => <option key={f.id} value={f.id}>{f.label}</option>)}
                  </select>
                  <button
                    style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer' }}
                    onClick={() => {
                      const newRules = form.logicRules.filter((_, i) => i !== idx);
                      updateLogicRules(newRules);
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
            <button
              className={styles.btnAddRule}
              onClick={() => {
                if (form.fields.length === 0) return;
                const newRule: LunaLogicRule = {
                  fieldId: form.fields[0].id,
                  condition: 'equals',
                  value: '',
                  action: 'show',
                  targetFieldId: form.fields[0].id
                };
                updateLogicRules([...form.logicRules, newRule]);
              }}
            >
              + Adicionar regra
            </button>
          </div>
        )}

        {activeTab === 'transform' && field && (
          <div id="transformPane">
            <div className={styles.propGroup}>
              <label className={styles.propLabel}>Tipo de transformação</label>
              <select
                className={styles.propSelect}
                value={field.transform?.type || 'none'}
                onChange={(e) => {
                  const type = e.target.value as any;
                  updateField({ transform: { type, multiplier: field.transform?.multiplier || 1 } });
                }}
              >
                <option value="none">Nenhuma</option>
                <option value="kg_to_lbs">kg → lbs</option>
                <option value="lbs_to_kg">lbs → kg</option>
                <option value="scale">Escala (multiplicador)</option>
                <option value="percentage">Percentagem</option>
              </select>
            </div>
            {(field.transform?.type === 'scale' || field.transform?.type === 'percentage') && (
              <div className={styles.propGroup}>
                <label className={styles.propLabel}>Multiplicador</label>
                <input
                  type="number"
                  className={styles.propInput}
                  value={field.transform?.multiplier || 1}
                  onChange={(e) => updateField({ transform: { type: field.transform!.type, multiplier: parseFloat(e.target.value) || 1 } })}
                />
              </div>
            )}
          </div>
        )}

        {!field && activeTab !== 'logic' && (
          <div style={{ color: 'var(--muted)', fontSize: '.8rem', textAlign: 'center', marginTop: '20px' }}>
            Selecione um campo para editar.
          </div>
        )}
      </div>
    </aside>
  );
};
