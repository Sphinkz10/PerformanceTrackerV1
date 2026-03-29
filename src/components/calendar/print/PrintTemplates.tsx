/**
 * CALENDAR PRINT TEMPLATES
 * Print-friendly templates for calendar views
 * 
 * Features:
 * - Weekly schedule print
 * - Monthly calendar print
 * - Event details print
 * - Attendance sheet print
 * - CSS print styles
 * - Page break control
 * 
 * @module calendar/print/PrintTemplates
 * @version 2.0.0
 * @created 18 Janeiro 2026
 */

import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from 'date-fns';
import { pt } from 'date-fns/locale';
import { CalendarEvent, EventParticipantWithDetails } from '@/types/calendar';

// ============================================================================
// TYPES
// ============================================================================

interface PrintTemplateProps {
  events: CalendarEvent[];
  dateRange: { start: Date; end: Date };
  title?: string;
  workspaceName?: string;
}

interface EventDetailsPrintProps {
  event: CalendarEvent;
  participants?: EventParticipantWithDetails[];
  workspaceName?: string;
}

// ============================================================================
// WEEKLY SCHEDULE PRINT
// ============================================================================

export function WeeklySchedulePrint({
  events,
  dateRange,
  title = 'Agenda Semanal',
  workspaceName,
}: PrintTemplateProps) {
  const days = eachDayOfInterval({ start: dateRange.start, end: dateRange.end });

  return (
    <div className="print-template">
      {/* Print Styles */}
      <style>{`
        @media print {
          @page {
            size: A4;
            margin: 1.5cm;
          }
          
          .print-template {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            color: #000;
            background: white;
          }
          
          .no-print {
            display: none !important;
          }
          
          .page-break {
            page-break-after: always;
          }
          
          table {
            width: 100%;
            border-collapse: collapse;
          }
          
          th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
          }
          
          th {
            background-color: #f8f9fa;
            font-weight: 600;
          }
        }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: '24px', borderBottom: '2px solid #000', paddingBottom: '12px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>{title}</h1>
        {workspaceName && (
          <p style={{ fontSize: '14px', color: '#666', margin: '4px 0 0 0' }}>{workspaceName}</p>
        )}
        <p style={{ fontSize: '12px', color: '#666', margin: '4px 0 0 0' }}>
          {format(dateRange.start, "d 'de' MMMM", { locale: pt })} -{' '}
          {format(dateRange.end, "d 'de' MMMM 'de' yyyy", { locale: pt })}
        </p>
      </div>

      {/* Weekly Schedule */}
      {days.map((day, dayIndex) => {
        const dayEvents = events
          .filter(e => isSameDay(new Date(e.start_date), day))
          .sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime());

        return (
          <div key={dayIndex} style={{ marginBottom: '20px' }}>
            {/* Day Header */}
            <div
              style={{
                backgroundColor: '#f8f9fa',
                padding: '8px 12px',
                borderLeft: '4px solid #0ea5e9',
                marginBottom: '8px',
              }}
            >
              <h2 style={{ fontSize: '16px', fontWeight: '600', margin: 0 }}>
                {format(day, "EEEE, d 'de' MMMM", { locale: pt })}
              </h2>
            </div>

            {/* Events */}
            {dayEvents.length === 0 ? (
              <p style={{ fontSize: '12px', color: '#999', fontStyle: 'italic', margin: '8px 0' }}>
                Sem eventos agendados
              </p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th style={{ width: '15%' }}>Horário</th>
                    <th style={{ width: '25%' }}>Título</th>
                    <th style={{ width: '15%' }}>Tipo</th>
                    <th style={{ width: '20%' }}>Local</th>
                    <th style={{ width: '25%' }}>Observações</th>
                  </tr>
                </thead>
                <tbody>
                  {dayEvents.map(event => (
                    <tr key={event.id}>
                      <td>
                        {format(new Date(event.start_date), 'HH:mm', { locale: pt })} -{' '}
                        {format(new Date(event.end_date), 'HH:mm', { locale: pt })}
                      </td>
                      <td style={{ fontWeight: '600' }}>{event.title}</td>
                      <td>{event.type}</td>
                      <td>{event.location || '-'}</td>
                      <td style={{ fontSize: '11px', color: '#666' }}>
                        {event.athlete_ids?.length || 0} atleta(s)
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        );
      })}

      {/* Footer */}
      <div
        style={{
          marginTop: '24px',
          paddingTop: '12px',
          borderTop: '1px solid #ddd',
          fontSize: '10px',
          color: '#999',
        }}
      >
        <p style={{ margin: 0 }}>Impresso em {format(new Date(), "d 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: pt })}</p>
      </div>
    </div>
  );
}

// ============================================================================
// MONTHLY CALENDAR PRINT
// ============================================================================

export function MonthlyCalendarPrint({
  events,
  dateRange,
  title = 'Calendário Mensal',
  workspaceName,
}: PrintTemplateProps) {
  const weekStart = startOfWeek(dateRange.start, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(dateRange.end, { weekStartsOn: 1 });
  const allDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  // Group into weeks
  const weeks: Date[][] = [];
  for (let i = 0; i < allDays.length; i += 7) {
    weeks.push(allDays.slice(i, i + 7));
  }

  return (
    <div className="print-template">
      {/* Print Styles */}
      <style>{`
        @media print {
          @page {
            size: A4 landscape;
            margin: 1cm;
          }
          
          .calendar-grid {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            gap: 4px;
          }
          
          .calendar-day {
            border: 1px solid #ddd;
            min-height: 80px;
            padding: 4px;
          }
          
          .calendar-day-header {
            font-weight: 600;
            font-size: 11px;
            margin-bottom: 4px;
            padding-bottom: 2px;
            border-bottom: 1px solid #eee;
          }
          
          .calendar-event {
            font-size: 9px;
            padding: 2px 4px;
            margin-bottom: 2px;
            background-color: #f0f9ff;
            border-left: 2px solid #0ea5e9;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: '16px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>{title}</h1>
        {workspaceName && (
          <p style={{ fontSize: '14px', color: '#666', margin: '4px 0' }}>{workspaceName}</p>
        )}
        <p style={{ fontSize: '14px', fontWeight: '600', margin: '8px 0 0 0' }}>
          {format(dateRange.start, "MMMM 'de' yyyy", { locale: pt })}
        </p>
      </div>

      {/* Weekday Headers */}
      <div className="calendar-grid" style={{ marginBottom: '4px' }}>
        {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].map(day => (
          <div
            key={day}
            style={{
              textAlign: 'center',
              fontWeight: '600',
              fontSize: '12px',
              padding: '4px',
              backgroundColor: '#f8f9fa',
            }}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      {weeks.map((week, weekIndex) => (
        <div key={weekIndex} className="calendar-grid">
          {week.map((day, dayIndex) => {
            const dayEvents = events
              .filter(e => isSameDay(new Date(e.start_date), day))
              .slice(0, 3); // Show max 3 events per day

            const isCurrentMonth = day >= dateRange.start && day <= dateRange.end;

            return (
              <div
                key={dayIndex}
                className="calendar-day"
                style={{
                  backgroundColor: isCurrentMonth ? 'white' : '#fafafa',
                  opacity: isCurrentMonth ? 1 : 0.5,
                }}
              >
                <div className="calendar-day-header">
                  {format(day, 'd', { locale: pt })}
                </div>
                {dayEvents.map(event => (
                  <div key={event.id} className="calendar-event">
                    {format(new Date(event.start_date), 'HH:mm', { locale: pt })} {event.title}
                  </div>
                ))}
                {events.filter(e => isSameDay(new Date(e.start_date), day)).length > 3 && (
                  <div style={{ fontSize: '9px', color: '#999', marginTop: '2px' }}>
                    +{events.filter(e => isSameDay(new Date(e.start_date), day)).length - 3} mais
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}

      {/* Footer */}
      <div
        style={{
          marginTop: '16px',
          paddingTop: '8px',
          borderTop: '1px solid #ddd',
          fontSize: '10px',
          color: '#999',
          textAlign: 'center',
        }}
      >
        <p style={{ margin: 0 }}>
          Impresso em {format(new Date(), "d 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: pt })}
        </p>
      </div>
    </div>
  );
}

// ============================================================================
// EVENT DETAILS PRINT
// ============================================================================

export function EventDetailsPrint({
  event,
  participants,
  workspaceName,
}: EventDetailsPrintProps) {
  return (
    <div className="print-template">
      {/* Print Styles */}
      <style>{`
        @media print {
          @page {
            size: A4;
            margin: 2cm;
          }
        }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: '24px', borderBottom: '2px solid #000', paddingBottom: '12px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: 0 }}>{event.title}</h1>
        {workspaceName && (
          <p style={{ fontSize: '14px', color: '#666', margin: '4px 0 0 0' }}>{workspaceName}</p>
        )}
      </div>

      {/* Event Details */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px' }}>
          Detalhes do Evento
        </h2>
        <table style={{ width: '100%' }}>
          <tbody>
            <tr>
              <td style={{ width: '30%', padding: '8px', fontWeight: '600', borderBottom: '1px solid #eee' }}>
                Data e Hora
              </td>
              <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>
                {format(new Date(event.start_date), "EEEE, d 'de' MMMM 'de' yyyy", { locale: pt })}
                <br />
                {format(new Date(event.start_date), 'HH:mm', { locale: pt })} -{' '}
                {format(new Date(event.end_date), 'HH:mm', { locale: pt })}
              </td>
            </tr>
            <tr>
              <td style={{ padding: '8px', fontWeight: '600', borderBottom: '1px solid #eee' }}>Tipo</td>
              <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>{event.type}</td>
            </tr>
            <tr>
              <td style={{ padding: '8px', fontWeight: '600', borderBottom: '1px solid #eee' }}>Status</td>
              <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>{event.status}</td>
            </tr>
            {event.location && (
              <tr>
                <td style={{ padding: '8px', fontWeight: '600', borderBottom: '1px solid #eee' }}>Local</td>
                <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>{event.location}</td>
              </tr>
            )}
            {event.description && (
              <tr>
                <td style={{ padding: '8px', fontWeight: '600', borderBottom: '1px solid #eee' }}>Descrição</td>
                <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>{event.description}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Participants */}
      {participants && participants.length > 0 && (
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px' }}>
            Participantes ({participants.length})
          </h2>
          <table style={{ width: '100%' }}>
            <thead>
              <tr>
                <th style={{ padding: '8px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Nome</th>
                <th style={{ padding: '8px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Presença</th>
                <th style={{ padding: '8px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Assinatura</th>
              </tr>
            </thead>
            <tbody>
              {participants.map(participant => (
                <tr key={participant.id}>
                  <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>
                    {participant.athlete?.name || participant.athlete_id}
                  </td>
                  <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>
                    {participant.attendance_status || '☐ Presente ☐ Ausente'}
                  </td>
                  <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>
                    _________________________
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Notes Section */}
      <div style={{ marginTop: '32px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px' }}>Observações</h2>
        <div
          style={{
            border: '1px solid #ddd',
            minHeight: '100px',
            padding: '12px',
            backgroundColor: '#fafafa',
          }}
        >
          {event.notes || ''}
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          marginTop: '32px',
          paddingTop: '12px',
          borderTop: '1px solid #ddd',
          fontSize: '10px',
          color: '#999',
        }}
      >
        <p style={{ margin: 0 }}>
          Impresso em {format(new Date(), "d 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: pt })}
        </p>
      </div>
    </div>
  );
}

// ============================================================================
// ATTENDANCE SHEET PRINT
// ============================================================================

export function AttendanceSheetPrint({ event, workspaceName }: EventDetailsPrintProps) {
  // Generate empty rows for manual attendance
  const emptyRows = Array.from({ length: Math.max(15, event.athlete_ids?.length || 0) }, (_, i) => i);

  return (
    <div className="print-template">
      {/* Print Styles */}
      <style>{`
        @media print {
          @page {
            size: A4;
            margin: 1.5cm;
          }
        }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: '24px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>Folha de Presenças</h1>
        {workspaceName && (
          <p style={{ fontSize: '14px', color: '#666', margin: '4px 0' }}>{workspaceName}</p>
        )}
      </div>

      {/* Event Info */}
      <div
        style={{
          backgroundColor: '#f8f9fa',
          padding: '12px',
          marginBottom: '16px',
          border: '1px solid #ddd',
        }}
      >
        <p style={{ margin: '4px 0', fontSize: '14px' }}>
          <strong>Evento:</strong> {event.title}
        </p>
        <p style={{ margin: '4px 0', fontSize: '14px' }}>
          <strong>Data:</strong>{' '}
          {format(new Date(event.start_date), "EEEE, d 'de' MMMM 'de' yyyy", { locale: pt })}
        </p>
        <p style={{ margin: '4px 0', fontSize: '14px' }}>
          <strong>Horário:</strong> {format(new Date(event.start_date), 'HH:mm', { locale: pt })} -{' '}
          {format(new Date(event.end_date), 'HH:mm', { locale: pt })}
        </p>
        {event.location && (
          <p style={{ margin: '4px 0', fontSize: '14px' }}>
            <strong>Local:</strong> {event.location}
          </p>
        )}
      </div>

      {/* Attendance Table */}
      <table style={{ width: '100%', marginBottom: '24px' }}>
        <thead>
          <tr>
            <th style={{ width: '5%', padding: '8px', textAlign: 'center', borderBottom: '2px solid #000' }}>
              #
            </th>
            <th style={{ width: '40%', padding: '8px', textAlign: 'left', borderBottom: '2px solid #000' }}>
              Nome
            </th>
            <th style={{ width: '15%', padding: '8px', textAlign: 'center', borderBottom: '2px solid #000' }}>
              Presente
            </th>
            <th style={{ width: '40%', padding: '8px', textAlign: 'left', borderBottom: '2px solid #000' }}>
              Assinatura
            </th>
          </tr>
        </thead>
        <tbody>
          {emptyRows.map(index => (
            <tr key={index}>
              <td style={{ padding: '12px 8px', textAlign: 'center', borderBottom: '1px solid #ddd' }}>
                {index + 1}
              </td>
              <td style={{ padding: '12px 8px', borderBottom: '1px solid #ddd' }}>
                _____________________________________
              </td>
              <td style={{ padding: '12px 8px', textAlign: 'center', borderBottom: '1px solid #ddd' }}>
                ☐
              </td>
              <td style={{ padding: '12px 8px', borderBottom: '1px solid #ddd' }}>
                _____________________________________
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Summary */}
      <div style={{ marginTop: '24px' }}>
        <p style={{ fontSize: '12px', margin: '4px 0' }}>
          <strong>Total de Presenças:</strong> _________
        </p>
        <p style={{ fontSize: '12px', margin: '4px 0' }}>
          <strong>Responsável:</strong> _________________________________________
        </p>
        <p style={{ fontSize: '12px', margin: '4px 0' }}>
          <strong>Assinatura:</strong> _________________________________________
        </p>
      </div>

      {/* Footer */}
      <div
        style={{
          position: 'fixed',
          bottom: '1cm',
          left: 0,
          right: 0,
          textAlign: 'center',
          fontSize: '10px',
          color: '#999',
        }}
      >
        <p style={{ margin: 0 }}>
          Impresso em {format(new Date(), "d 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: pt })}
        </p>
      </div>
    </div>
  );
}

// ============================================================================
// PRINT UTILITY
// ============================================================================

/**
 * Trigger browser print dialog
 */
export function triggerPrint() {
  window.print();
}
