/**
 * CONTEXTUAL ACTIONS COMPONENT
 * 
 * Componente adaptativo que muda de apresentação baseado no breakpoint:
 * - MOBILE: Dropdown menu (mais touch-friendly)
 * - DESKTOP: Botões inline (mais direto)
 * 
 * Segue Design System Guidelines.md
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MoreVertical, ChevronDown } from 'lucide-react';
import { useResponsive } from '@/hooks/useResponsive';

// ============================================
// TYPES
// ============================================

export interface Action {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  hidden?: boolean;
}

export interface ContextualActionsProps {
  actions: Action[];
  label?: string;
  dropdownIcon?: React.ComponentType<{ className?: string }>;
  mobileThreshold?: 'always' | 'tablet' | 'desktop'; // Quando mostrar dropdown
  align?: 'left' | 'right';
  className?: string;
}

// ============================================
// COMPONENT
// ============================================

export const ContextualActions: React.FC<ContextualActionsProps> = ({
  actions,
  label = 'Ações',
  dropdownIcon: DropdownIcon = MoreVertical,
  mobileThreshold = 'tablet',
  align = 'right',
  className = ''
}) => {
  const { isMobile, isTablet } = useResponsive();
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Determinar se deve mostrar como dropdown
  const shouldShowDropdown = React.useMemo(() => {
    if (mobileThreshold === 'always') return true;
    if (mobileThreshold === 'tablet') return isMobile || isTablet;
    if (mobileThreshold === 'desktop') return isMobile;
    return false;
  }, [mobileThreshold, isMobile, isTablet]);

  // Filtrar ações visíveis
  const visibleActions = actions.filter(action => !action.hidden);

  // Fechar dropdown ao clicar fora
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // ============================================
  // RENDER: DROPDOWN (Mobile/Tablet)
  // ============================================

  if (shouldShowDropdown) {
    return (
      <div className={`relative ${className}`} ref={dropdownRef}>
        {/* Trigger Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-xl border-2 border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100 transition-all"
          aria-label={label}
          aria-expanded={isOpen}
        >
          <DropdownIcon className="h-4 w-4" />
          <span className="hidden sm:inline">{label}</span>
          <ChevronDown 
            className={`h-3 w-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          />
        </motion.button>

        {/* Dropdown Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className={`absolute z-50 mt-2 min-w-[200px] rounded-xl border border-slate-200 bg-white shadow-xl ${
                align === 'right' ? 'right-0' : 'left-0'
              }`}
            >
              <div className="py-2">
                {visibleActions.map((action, index) => {
                  const Icon = action.icon;
                  const isLast = index === visibleActions.length - 1;

                  return (
                    <React.Fragment key={action.id}>
                      <button
                        onClick={() => {
                          action.onClick();
                          setIsOpen(false);
                        }}
                        disabled={action.disabled}
                        className={`
                          w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-left
                          transition-colors
                          ${action.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-50'}
                          ${action.variant === 'danger' 
                            ? 'text-red-600 hover:bg-red-50' 
                            : action.variant === 'primary'
                            ? 'text-sky-700 hover:bg-sky-50'
                            : 'text-slate-700'
                          }
                        `}
                      >
                        {Icon && <Icon className="h-4 w-4 shrink-0" />}
                        <span>{action.label}</span>
                      </button>
                      {!isLast && <div className="h-px bg-slate-100 mx-2" />}
                    </React.Fragment>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // ============================================
  // RENDER: INLINE BUTTONS (Desktop)
  // ============================================

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {visibleActions.map((action) => {
        const Icon = action.icon;

        // Determinar classes baseado na variante
        const variantClasses = {
          primary: 'bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-md hover:from-sky-400 hover:to-sky-500',
          secondary: 'border-2 border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100',
          danger: 'border border-red-200 bg-white text-red-600 hover:bg-red-50'
        };

        const classes = variantClasses[action.variant || 'secondary'];

        return (
          <motion.button
            key={action.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={action.onClick}
            disabled={action.disabled}
            className={`
              flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl
              transition-all
              ${classes}
              ${action.disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            {Icon && <Icon className="h-4 w-4" />}
            <span>{action.label}</span>
          </motion.button>
        );
      })}
    </div>
  );
};

// ============================================
// EXPORT
// ============================================

export default ContextualActions;
