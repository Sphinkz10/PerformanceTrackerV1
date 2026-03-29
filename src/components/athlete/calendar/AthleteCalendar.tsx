/**
 * Athlete Calendar - Simple calendar for athletes
 * 
 * Features:
 * - View training schedule
 * - Request booking (syncs with coach availability)
 * - Cancel sessions
 * - Mark vacations
 * - Add competitions
 * - Mark exam dates
 * - Agenda view below calendar
 * 
 * Design System: 100% compliant with Guidelines.md
 * 
 * @author PerformTrack Team
 * @since Athlete Portal - Calendar
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
  Dumbbell,
  Trophy,
  BookOpen,
  Plane,
  XCircle,
  Clock,
  MapPin,
} from 'lucide-react';
import { RequestBookingModal } from '../modals/RequestBookingModal';
import { AddEventModal } from '../modals/AddEventModal';
import { toast } from 'sonner@2.0.3';

export function AthleteCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [requestBookingOpen, setRequestBookingOpen] = useState(false);
  const [addEventOpen, setAddEventOpen] = useState(false);
  const [selectedEventType, setSelectedEventType] = useState<'vacation' | 'competition' | 'exam' | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Mock events
  const events = [
    { id: '1', date: new Date(2026, 1, 3), type: 'workout', title: 'Upper Body A', time: '18:00', location: 'Ginásio Principal' },
    { id: '2', date: new Date(2026, 1, 5), type: 'workout', title: 'Lower Body B', time: '10:00', location: 'Ginásio Principal' },
    { id: '3', date: new Date(2026, 1, 7), type: 'workout', title: 'Full Body', time: '18:00', location: 'Ginásio Principal' },
    { id: '4', date: new Date(2026, 1, 10), type: 'workout', title: 'Upper Body B', time: '18:00', location: 'Ginásio Principal' },
    { id: '5', date: new Date(2026, 1, 12), type: 'workout', title: 'Lower Body A', time: '10:00', location: 'Ginásio Principal' },
    { id: '6', date: new Date(2026, 1, 14), type: 'competition', title: 'Campeonato Regional', time: '09:00', location: 'Estádio Municipal' },
    { id: '7', date: new Date(2026, 1, 17), type: 'workout', title: 'Full Body Strength', time: '18:00', location: 'Ginásio Principal' },
    { id: '8', date: new Date(2026, 1, 20), type: 'exam', title: 'Exame de Matemática', time: '14:00', location: 'Universidade' },
    { id: '9', date: new Date(2026, 1, 25), type: 'vacation', title: 'Férias', time: 'Todo o dia', location: '-' },
    { id: '10', date: new Date(2026, 1, 26), type: 'vacation', title: 'Férias', time: 'Todo o dia', location: '-' },
    { id: '11', date: new Date(2026, 1, 27), type: 'vacation', title: 'Férias', time: 'Todo o dia', location: '-' },
  ];

  // Mock coach unavailable dates
  const coachUnavailableDates = [
    new Date(2026, 1, 8),
    new Date(2026, 1, 9),
    new Date(2026, 1, 15),
    new Date(2026, 1, 16),
  ];

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const days = getDaysInMonth(currentDate);

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const getEventsForDate = (date: Date | null) => {
    if (!date) return [];
    return events.filter(event => 
      event.date.toDateString() === date.toDateString()
    );
  };

  const isCoachUnavailable = (date: Date | null) => {
    if (!date) return false;
    return coachUnavailableDates.some(unavailableDate => 
      unavailableDate.toDateString() === date.toDateString()
    );
  };

  const isToday = (date: Date | null) => {
    if (!date) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const handleAddEvent = (type: 'vacation' | 'competition' | 'exam') => {
    setSelectedEventType(type);
    setAddEventOpen(true);
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'workout': return Dumbbell;
      case 'competition': return Trophy;
      case 'exam': return BookOpen;
      case 'vacation': return Plane;
      default: return CalendarIcon;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'workout': return 'emerald';
      case 'competition': return 'violet';
      case 'exam': return 'amber';
      case 'vacation': return 'sky';
      default: return 'slate';
    }
  };

  // Get events for current month sorted by date
  const monthEvents = events
    .filter(event => 
      event.date.getMonth() === currentDate.getMonth() &&
      event.date.getFullYear() === currentDate.getFullYear()
    )
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  const formatAgendaDate = (date: Date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return 'Hoje';
    if (date.toDateString() === tomorrow.toDateString()) return 'Amanhã';
    
    return date.toLocaleDateString('pt-PT', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">📅 Calendário</h1>
          <p className="text-sm text-slate-600">
            Gere o teu horário e eventos importantes
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setRequestBookingOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md hover:from-emerald-400 hover:to-emerald-500 transition-all"
        >
          <Plus className="h-4 w-4" />
          Pedir Marcação
        </motion.button>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleAddEvent('vacation')}
          className="p-3 sm:p-4 rounded-xl border-2 border-sky-200 bg-gradient-to-br from-sky-50 to-white hover:border-sky-400 transition-all text-center"
        >
          <Plane className="h-4 w-4 sm:h-5 sm:w-5 text-sky-600 mx-auto mb-1" />
          <p className="text-xs font-semibold text-slate-900">Férias</p>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleAddEvent('competition')}
          className="p-3 sm:p-4 rounded-xl border-2 border-violet-200 bg-gradient-to-br from-violet-50 to-white hover:border-violet-400 transition-all text-center"
        >
          <Trophy className="h-4 w-4 sm:h-5 sm:w-5 text-violet-600 mx-auto mb-1" />
          <p className="text-xs font-semibold text-slate-900">Competição</p>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleAddEvent('exam')}
          className="p-3 sm:p-4 rounded-xl border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-white hover:border-amber-400 transition-all text-center"
        >
          <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600 mx-auto mb-1" />
          <p className="text-xs font-semibold text-slate-900">Exame</p>
        </motion.button>
      </div>

      {/* Calendar */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-3 sm:p-6 shadow-sm">
        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-base sm:text-lg font-bold text-slate-900">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>

          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={previousMonth}
              className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors"
            >
              <ChevronLeft className="h-4 w-4 text-slate-600" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={nextMonth}
              className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors"
            >
              <ChevronRight className="h-4 w-4 text-slate-600" />
            </motion.button>
          </div>
        </div>

        {/* Days of Week */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2 sm:mb-3">
          {daysOfWeek.map((day) => (
            <div key={day} className="text-center text-xs font-semibold text-slate-500 py-2">
              <span className="hidden sm:inline">{day}</span>
              <span className="sm:hidden">{day.charAt(0)}</span>
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {days.map((day, index) => {
            const dayEvents = getEventsForDate(day);
            const unavailable = isCoachUnavailable(day);
            const today = isToday(day);

            return (
              <div
                key={index}
                className={`min-h-[60px] sm:min-h-[80px] p-1 sm:p-2 rounded-lg sm:rounded-xl border transition-all ${
                  day
                    ? unavailable
                      ? 'border-red-300 bg-red-50 cursor-not-allowed'
                      : today
                      ? 'border-2 border-emerald-400 bg-emerald-50'
                      : dayEvents.length > 0
                      ? 'border-slate-300 bg-white hover:border-sky-400 cursor-pointer'
                      : 'border-slate-200 bg-white hover:border-slate-300 cursor-pointer'
                    : 'border-transparent'
                }`}
              >
                {day && (
                  <div className="h-full flex flex-col">
                    <span
                      className={`text-xs font-semibold mb-0.5 sm:mb-1 ${
                        today ? 'text-emerald-700' : unavailable ? 'text-red-600' : 'text-slate-900'
                      }`}
                    >
                      {day.getDate()}
                    </span>

                    {/* Events - Show dots on mobile, mini badges on desktop */}
                    <div className="flex-1 overflow-hidden">
                      {/* Mobile: Just colored dots */}
                      <div className="flex gap-0.5 sm:hidden flex-wrap">
                        {dayEvents.slice(0, 3).map((event) => {
                          const color = getEventColor(event.type);
                          return (
                            <div
                              key={event.id}
                              className={`h-1.5 w-1.5 rounded-full bg-${color}-500`}
                              title={event.title}
                            />
                          );
                        })}
                      </div>

                      {/* Desktop: Mini event badges */}
                      <div className="hidden sm:flex flex-col gap-0.5">
                        {dayEvents.slice(0, 2).map((event) => {
                          const Icon = getEventIcon(event.type);
                          const color = getEventColor(event.type);
                          return (
                            <div
                              key={event.id}
                              className={`text-xs px-1 py-0.5 rounded bg-${color}-100 text-${color}-700 truncate flex items-center gap-1`}
                              title={event.title}
                            >
                              <Icon className="h-2.5 w-2.5 flex-shrink-0" />
                              <span className="truncate text-xs leading-tight">{event.title}</span>
                            </div>
                          );
                        })}
                        {dayEvents.length > 2 && (
                          <div className="text-xs text-slate-500 font-medium pl-1">
                            +{dayEvents.length - 2}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Agenda - Event List */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-6 shadow-sm">
        <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-emerald-600" />
          Agenda do Mês
        </h3>

        {monthEvents.length === 0 ? (
          <div className="text-center py-8">
            <CalendarIcon className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm text-slate-600">Nenhum evento agendado este mês</p>
          </div>
        ) : (
          <div className="space-y-3">
            {monthEvents.map((event, idx) => {
              const Icon = getEventIcon(event.type);
              const color = getEventColor(event.type);

              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  className={`flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border-2 border-${color}-200 bg-gradient-to-br from-${color}-50 to-white hover:border-${color}-400 transition-all`}
                >
                  {/* Icon */}
                  <div className={`h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-gradient-to-br from-${color}-500 to-${color}-600 flex items-center justify-center flex-shrink-0`}>
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                      <h4 className="font-bold text-slate-900 truncate">{event.title}</h4>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-${color}-100 text-${color}-700 w-fit`}>
                        {event.type === 'workout' ? '🏋️ Treino' : event.type === 'competition' ? '🏆 Competição' : event.type === 'exam' ? '📚 Exame' : '✈️ Férias'}
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-sm text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <CalendarIcon className="h-3.5 w-3.5" />
                        <span>{formatAgendaDate(event.date)}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{event.time}</span>
                      </div>
                      {event.location && event.location !== '-' && (
                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5" />
                          <span className="truncate">{event.location}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions (only for workouts) */}
                  {event.type === 'workout' && (
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => toast.info('Ver detalhes (em desenvolvimento)')}
                        className="hidden sm:flex items-center gap-2 px-3 py-2 text-sm font-semibold rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-400 hover:to-emerald-500 transition-all"
                      >
                        Ver
                      </motion.button>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3 sm:p-4">
        <h3 className="text-sm font-bold text-slate-900 mb-3">Legenda</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 sm:h-4 sm:w-4 rounded bg-emerald-500" />
            <span className="text-xs text-slate-600">Treinos</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 sm:h-4 sm:w-4 rounded bg-violet-500" />
            <span className="text-xs text-slate-600">Competições</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 sm:h-4 sm:w-4 rounded bg-amber-500" />
            <span className="text-xs text-slate-600">Exames</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 sm:h-4 sm:w-4 rounded bg-sky-500" />
            <span className="text-xs text-slate-600">Férias</span>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-slate-200">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 sm:h-4 sm:w-4 rounded bg-red-50 border-2 border-red-300" />
            <span className="text-xs text-slate-600">Coach indisponível</span>
          </div>
        </div>
      </div>

      {/* Modals */}
      <RequestBookingModal
        isOpen={requestBookingOpen}
        onClose={() => setRequestBookingOpen(false)}
      />

      <AddEventModal
        isOpen={addEventOpen}
        onClose={() => {
          setAddEventOpen(false);
          setSelectedEventType(null);
        }}
        eventType={selectedEventType}
      />
    </div>
  );
}