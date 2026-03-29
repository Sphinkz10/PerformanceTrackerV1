/**
 * CENTRALIZED CALENDAR CONSTANTS
 * 
 * All magic numbers and constant values in one place
 * 
 * @module calendar/utils/constants
 * @created 20 Janeiro 2026
 */

/**
 * Time constants
 */
export const TIME_CONSTANTS = {
  HOUR_HEIGHT: 80, // pixels per hour in day/week view
  MINUTES_PER_SLOT: 15, // time slot interval
  DEFAULT_EVENT_DURATION: 60, // minutes
  MIN_EVENT_DURATION: 15, // minutes
  MAX_EVENT_DURATION: 480, // minutes (8 hours)
  WORKING_HOURS_START: '08:00',
  WORKING_HOURS_END: '20:00',
} as const;

/**
 * View constants
 */
export const VIEW_CONSTANTS = {
  MAX_VISIBLE_MONTH_EVENTS: 3, // events shown per day in month view
  WEEK_STARTS_ON: 1, // Monday (0 = Sunday, 1 = Monday)
  AGENDA_PAGE_SIZE: 50, // events per page in agenda view
} as const;

/**
 * Animation constants
 */
export const ANIMATION_CONSTANTS = {
  STAGGER_DELAY: 0.05, // seconds between list items
  FADE_IN_DURATION: 0.2, // seconds
  HOVER_SCALE: 1.05,
  TAP_SCALE: 0.95,
  TOAST_DURATION: 4000, // milliseconds
} as const;

/**
 * Conflict severity thresholds
 */
export const CONFLICT_THRESHOLDS = {
  LOW: 1,
  MEDIUM: 2,
  HIGH: 3,
  CRITICAL: 5,
} as const;

/**
 * Export constants
 */
export const EXPORT_CONSTANTS = {
  MAX_EVENTS_CSV: 10000,
  MAX_EVENTS_PDF: 1000,
  MAX_EVENTS_ICS: 5000,
  FILENAME_DATE_FORMAT: 'yyyy-MM-dd',
} as const;

/**
 * Recurrence constants
 */
export const RECURRENCE_CONSTANTS = {
  MAX_OCCURRENCES: 365,
  DEFAULT_END_AFTER_COUNT: 10,
  MAX_FUTURE_MONTHS: 12,
} as const;

/**
 * UI constants
 */
export const UI_CONSTANTS = {
  SEARCH_DEBOUNCE: 300, // milliseconds
  AUTOSAVE_DEBOUNCE: 1000, // milliseconds
  MODAL_Z_INDEX: 50,
  DROPDOWN_Z_INDEX: 60,
  TOAST_Z_INDEX: 100,
} as const;

/**
 * Validation constants
 */
export const VALIDATION_CONSTANTS = {
  MAX_TITLE_LENGTH: 100,
  MAX_DESCRIPTION_LENGTH: 500,
  MAX_LOCATION_LENGTH: 100,
  MAX_TAGS_PER_EVENT: 10,
  MAX_TAG_LENGTH: 20,
  MAX_PARTICIPANTS: 100,
} as const;

/**
 * Color palette
 */
export const COLOR_PALETTE = {
  sky: { bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-300' },
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-300' },
  amber: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-300' },
  red: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-300' },
  violet: { bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-300' },
  slate: { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-300' },
} as const;

/**
 * Grid constants
 */
export const GRID_CONSTANTS = {
  GAP_MOBILE: 'gap-3',
  GAP_DESKTOP: 'gap-4',
  PADDING_MOBILE: 'p-4',
  PADDING_DESKTOP: 'p-5',
  BORDER_RADIUS_SM: 'rounded-xl',
  BORDER_RADIUS_MD: 'rounded-2xl',
} as const;
