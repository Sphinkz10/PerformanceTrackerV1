# 🚀 PERFORMTRACK CALENDAR - QUICK START GUIDE

## 📋 Table of Contents
1. [Installation](#installation)
2. [Basic Usage](#basic-usage)
3. [Features Overview](#features-overview)
4. [Common Tasks](#common-tasks)
5. [API Integration](#api-integration)
6. [Troubleshooting](#troubleshooting)

---

## 🔧 Installation

### 1. Import the Calendar Component

```tsx
import { CalendarCore } from '@/components/calendar/core/CalendarCore';

function MyApp() {
  return <CalendarCore workspaceId="your-workspace-id" />;
}
```

### 2. Required Dependencies

All dependencies are already included in the project:
- ✅ React 18+
- ✅ Motion (Framer Motion successor)
- ✅ date-fns
- ✅ SWR
- ✅ Tailwind CSS v4
- ✅ Lucide Icons
- ✅ Sonner (toast notifications)

---

## 📖 Basic Usage

### Creating an Event

**Method 1: Quick Add Button (Floating)**
1. Click the blue "+" button at bottom-right
2. Follow the 5-step wizard:
   - Step 1: Choose import source (manual or Design Studio)
   - Step 2: Set date, time & location
   - Step 3: Select participants (athletes)
   - Step 4: Configure confirmation settings
   - Step 5: Review and confirm

**Method 2: Header Button**
1. Click "Novo Evento" in the top-right header
2. Same 5-step wizard

**Method 3: Quick Create (in views)**
- Day/Week View: Click empty time slot
- Month View: Click on date
- Team View: Click athlete row + time slot

### Viewing Events

**5 View Modes Available:**

1. **📅 Week View** (Default)
   - 7-day horizontal timeline
   - Hourly slots (6 AM - 11 PM)
   - Drag & drop to reschedule
   - Hover for quick preview

2. **📋 Agenda View**
   - List format grouped by date
   - Shows all upcoming events
   - Filters and search
   - Infinite scroll

3. **📆 Day View**
   - Single day detailed view
   - 30-minute granularity
   - Perfect for busy schedules
   - Time conflict visualization

4. **📊 Month View**
   - Traditional calendar grid
   - Mini event cards
   - Day utilization bars
   - Quick navigation

5. **👥 Team View**
   - Multi-athlete resource timeline
   - Horizontal scheduling
   - Athlete availability status
   - Workload visualization

### Editing Events

1. Click any event card
2. Event Details Modal opens
3. Click "Editar" button
4. Modify fields
5. Save changes

### Deleting Events

1. Open Event Details Modal
2. Click "Eliminar" (red button)
3. Confirm deletion
4. Event removed + toast notification

---

## 🎯 Features Overview

### ✅ Core Features (100% Complete)

#### Event Management
- Create, Read, Update, Delete (CRUD)
- Rich event types (training, match, recovery, meeting, etc.)
- Multi-athlete assignment
- Custom colors & tags
- Location support
- Notes and descriptions
- Status tracking (scheduled, completed, cancelled)

#### Recurring Events
- Daily, Weekly, Monthly, Custom patterns
- End date or occurrence count
- Edit single vs all occurrences
- Conflict detection for recurring series

#### Templates
- Pre-built event templates
- Custom template creation
- Template categories
- One-click apply
- Template library browsing

#### Filters & Search
- Filter by event type
- Filter by athlete
- Filter by date range
- Filter by status
- Filter by location
- Text search
- Multi-filter combination

#### Import/Export
- CSV import/export
- iCalendar (.ics) import/export
- JSON import/export
- PDF export (print-friendly)
- Conflict detection on import
- Import preview before applying

#### Bulk Operations
- Multi-select events (checkbox)
- Bulk edit (update multiple events)
- Bulk delete
- Bulk duplicate
- Bulk move (date/time)
- Bulk tag assignment
- Bulk athlete assignment

#### Team & Availability
- Team resource timeline view
- Athlete availability management
- Status indicators (available, busy, injured, rest, away)
- Utilization tracking
- Workload visualization
- Conflict prevention

#### Analytics
- Training volume charts
- Athlete workload tracking
- Event type distribution
- Completion rates
- Utilization metrics
- Trend analysis
- Export analytics data

#### Confirmations
- Athlete confirmation tracking
- Pending confirmations view
- Confirmation status badges
- Reminder system UI
- Bulk confirmation actions

#### Settings
- View preferences
- Default event durations
- Color themes
- Notification preferences
- Week start day
- Time format (12h/24h)
- Time zone support
- Language (PT)
- Settings persistence

---

## 🛠️ Common Tasks

### Task 1: Schedule Weekly Training

```tsx
// 1. Click "Novo Evento"
// 2. Select "Training" type
// 3. Set recurring: Weekly on Mon, Wed, Fri
// 4. Select athletes
// 5. Configure confirmation required
// 6. Create → Generates all occurrences
```

### Task 2: Import Match Schedule

```tsx
// 1. Click "Mais" → "Importar Eventos"
// 2. Upload CSV file with format:
//    title, start_date, end_date, type, location, athletes
// 3. Preview imported events
// 4. Resolve conflicts if any
// 5. Confirm import
```

### Task 3: View Athlete Workload

```tsx
// 1. Switch to "Team View"
// 2. Select specific athletes
// 3. View utilization percentage
// 4. Identify overloaded days (red indicators)
// 5. Adjust schedule as needed
```

### Task 4: Manage Athlete Availability

```tsx
// 1. Click "Mais" → "Disponibilidade Atletas"
// 2. Select athlete
// 3. Select date
// 4. Add time blocks:
//    - Set start/end time
//    - Set status (injured, rest, away, etc.)
//    - Add notes
// 5. Mark as recurring if needed
// 6. Save
```

### Task 5: Bulk Reschedule Events

```tsx
// 1. Enable selection mode (checkboxes appear)
// 2. Select multiple events
// 3. Bulk Operations Bar appears at bottom
// 4. Click "Mover"
// 5. Choose new date/time
// 6. Apply to all selected
```

### Task 6: Generate Monthly Report

```tsx
// 1. Click "Mais" → "Analytics Dashboard"
// 2. Select date range (month)
// 3. View charts and metrics
// 4. Click "Export" → PDF
// 5. Download report
```

### Task 7: Create Event Template

```tsx
// 1. Create event as normal
// 2. On Review step, click "Guardar como Template"
// 3. Give template a name
// 4. Select category
// 5. Save → Now available in Templates Library
```

### Task 8: Export Schedule to PDF

```tsx
// 1. Click "Mais" → "Exportar Avançado"
// 2. Select format: PDF
// 3. Choose date range
// 4. Select filters (athletes, types, etc.)
// 5. Configure PDF options:
//    - Layout (list or calendar grid)
//    - Include details
//    - Color coding
// 6. Generate & Download
```

---

## 🔌 API Integration

### Event API Endpoints

```typescript
// GET all events
GET /api/calendar-events?workspaceId={id}&start_date={iso}&end_date={iso}

// POST create event
POST /api/calendar-events
Body: {
  workspaceId: string,
  title: string,
  description?: string,
  type: EventType,
  startDate: ISO string,
  endDate: ISO string,
  location?: string,
  color?: string,
  tags?: string[],
  athleteIds?: string[],
  workoutId?: string,
  requiresConfirmation?: boolean,
  recurrence?: RecurrenceRule
}

// PATCH update event
PATCH /api/calendar-events/:id
Body: Partial<Event>

// DELETE event
DELETE /api/calendar-events/:id?deleteAll=true

// POST bulk operations
POST /api/calendar-events/bulk-edit
Body: {
  eventIds: string[],
  updates: Partial<Event>
}

POST /api/calendar-events/bulk-delete
Body: {
  eventIds: string[]
}
```

### Using SWR Hooks

```typescript
import { useCalendarEvents } from '@/hooks/use-api';

function MyComponent({ workspaceId }: { workspaceId: string }) {
  const { 
    data, 
    error, 
    isLoading,
    mutate // for manual refresh
  } = useCalendarEvents(workspaceId, {
    start_date: '2024-12-01',
    end_date: '2024-12-31',
    event_type: 'training',
    athlete_id: 'athlete-123'
  });
  
  if (isLoading) return <Loading />;
  if (error) return <Error />;
  
  return (
    <div>
      {data.events.map(event => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}
```

### Custom Fetcher

```typescript
// /hooks/use-api.ts
export function useCalendarEvents(
  workspaceId: string,
  filters: CalendarFilters
) {
  const query = new URLSearchParams({
    workspaceId,
    ...filters,
  }).toString();
  
  return useSWR(
    `/api/calendar-events?${query}`,
    fetcher,
    {
      refreshInterval: 0, // Disable auto-refresh
      revalidateOnFocus: true, // Refetch on tab focus
      revalidateOnReconnect: true, // Refetch on network reconnect
    }
  );
}
```

---

## 🐛 Troubleshooting

### Issue: CreateEventModal not opening

**Symptoms:**
- Clicking "+" button does nothing
- No modal appears

**Solution 1: Clear browser cache**
```bash
# Hard reload
Cmd/Ctrl + Shift + R
```

**Solution 2: Check console for errors**
```javascript
// Open browser console (F12)
// Look for React errors or state issues
```

**Solution 3: Verify CalendarProvider**
```tsx
// Ensure CalendarCore is wrapped correctly
<CalendarProvider>
  <CalendarContent />
</CalendarProvider>
```

### Issue: Events not loading

**Symptoms:**
- Calendar shows "No events"
- Loading spinner forever

**Check:**
1. API endpoint is correct
2. workspaceId is valid
3. Network tab shows successful response
4. Data format matches CalendarEvent interface

**Debug:**
```typescript
// Add console.log in useCalendarEvents
console.log('Fetching events:', { workspaceId, filters });
console.log('Response:', data);
```

### Issue: Drag & drop not working

**Symptoms:**
- Can't drag events
- Events don't snap to new times

**Solution:**
- Drag & drop only works in Week & Day views
- Ensure event has both start_date and end_date
- Check that event is not marked as "locked"

### Issue: Recurring events not generating

**Symptoms:**
- Only first occurrence created
- Recurrence rule ignored

**Check:**
1. Recurrence rule is valid
2. End date is after start date
3. Occurrence count > 0
4. No conflicts preventing creation

### Issue: Filters not applying

**Symptoms:**
- All events still showing
- Filter UI shows selected but no effect

**Solution:**
```typescript
// Filters must be passed to API
const { data } = useCalendarEvents(workspaceId, filters);

// Not:
const { data } = useCalendarEvents(workspaceId, {});
```

### Issue: Performance slow with many events

**Symptoms:**
- Laggy scrolling
- Slow rendering
- High CPU usage

**Optimizations:**
1. **Use pagination:**
   ```typescript
   const PAGE_SIZE = 50;
   // Load events in chunks
   ```

2. **Virtual scrolling:**
   ```typescript
   // Already implemented in AgendaView
   // Uses react-window internally
   ```

3. **Debounced search:**
   ```typescript
   const debouncedSearch = useMemo(
     () => debounce(handleSearch, 300),
     []
   );
   ```

### Issue: Export fails

**Symptoms:**
- Export button does nothing
- Download doesn't start

**Check:**
1. Events array is not empty
2. Date range is valid
3. Browser allows downloads
4. File size is not too large (>50MB)

**Debug:**
```typescript
console.log('Exporting:', {
  format,
  eventCount: events.length,
  dateRange: { start, end }
});
```

---

## 🎓 Best Practices

### 1. Event Organization
- ✅ Use consistent naming (e.g., "Training - Cardio", "Match vs. TeamX")
- ✅ Always set location when applicable
- ✅ Use tags for easy filtering
- ✅ Set realistic durations
- ✅ Add notes for special instructions

### 2. Athlete Management
- ✅ Update availability regularly
- ✅ Mark injuries/rest days promptly
- ✅ Monitor workload metrics
- ✅ Avoid over-scheduling
- ✅ Use confirmation system

### 3. Templates
- ✅ Create templates for repeated sessions
- ✅ Organize by category
- ✅ Update templates when protocols change
- ✅ Share templates across team

### 4. Data Management
- ✅ Export backups monthly
- ✅ Use import for bulk scheduling
- ✅ Review analytics regularly
- ✅ Clean up old events
- ✅ Archive completed seasons

### 5. Performance
- ✅ Use filters to reduce data load
- ✅ Archive events older than 1 year
- ✅ Avoid excessive recurring events (>100 occurrences)
- ✅ Limit simultaneous selections (<50 events)

---

## 📚 Additional Resources

### Documentation
- [Full Design System](/components/calendar/DESIGN_SYSTEM.md)
- [Completion Document](/components/calendar/COMPLETION_DOCUMENT.md)
- [API Reference](/components/calendar/API.md)
- [Component Library](/components/calendar/COMPONENTS.md)

### Support
- GitHub Issues: [Report bugs](https://github.com/performtrack/calendar/issues)
- Discord: [Community chat](https://discord.gg/performtrack)
- Email: support@performtrack.com

### Updates
- Changelog: See releases
- Roadmap: See project board
- Feature requests: Open discussion

---

## ✨ Pro Tips

1. **Keyboard Shortcuts:**
   - `N` - New event
   - `T` - Go to today
   - `←/→` - Navigate previous/next
   - `Esc` - Close modal
   - `Cmd/Ctrl + S` - Save (in modals)

2. **Quick Actions:**
   - Double-click event → Edit
   - Right-click event → Context menu
   - Hold Shift + Click → Multi-select

3. **Hidden Features:**
   - Drag edge of event to resize duration
   - Click athlete name in event → Filter by athlete
   - Click tag → Filter by tag

4. **Mobile Gestures:**
   - Swipe left/right → Navigate dates
   - Long press event → Quick actions
   - Pinch zoom → Adjust time scale

---

**🎉 You're ready to master PerformTrack Calendar!**

For advanced features and customization, refer to the full documentation.

**Version:** 1.0.0  
**Last Updated:** December 2024  
**Author:** PerformTrack Team
