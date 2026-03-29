# 📚 PERFORMTRACK - API REFERENCE

**Versão:** 1.0.0  
**Data:** 10 Janeiro 2026  
**Base URL:** `/api/v1`

---

## 📋 ÍNDICE

1. [Authentication](#authentication)
2. [Workspaces](#workspaces)
3. [Athletes](#athletes)
4. [Workouts](#workouts)
5. [Calendar Events](#calendar-events)
6. [Sessions](#sessions)
7. [Forms](#forms)
8. [Metrics](#metrics)
9. [Reports](#reports)
10. [Hooks & Utilities](#hooks--utilities)

---

## 🔐 AUTHENTICATION

### Headers Requeridos

```http
Authorization: Bearer {token}
Content-Type: application/json
```

### Login

```typescript
POST /api/auth/login

// Request
{
  email: string;
  password: string;
}

// Response
{
  user: {
    id: string;
    email: string;
    name: string;
    role: 'admin' | 'coach' | 'assistant' | 'viewer';
    workspaceId: string;
  };
  token: string;
  expiresAt: string;
}
```

---

## 🏢 WORKSPACES

### Get Workspace

```typescript
GET /api/workspaces/:workspaceId

// Response
{
  id: string;
  name: string;
  slug: string;
  settings: {
    timezone: string;
    locale: string;
    currency: string;
  };
  createdAt: string;
  updatedAt: string;
}
```

### Update Workspace

```typescript
PATCH /api/workspaces/:workspaceId

// Request
{
  name?: string;
  settings?: {
    timezone?: string;
    locale?: string;
    currency?: string;
  };
}

// Response
{
  success: boolean;
  workspace: Workspace;
}
```

---

## 👥 ATHLETES

### List Athletes

```typescript
GET /api/athletes?workspaceId={id}&page={number}&limit={number}

// Query Parameters
workspaceId: string (required)
page?: number (default: 1)
limit?: number (default: 20)
search?: string
sort?: 'name' | 'createdAt' | 'birthDate'
order?: 'asc' | 'desc'

// Response
{
  athletes: Athlete[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
```

### Get Athlete

```typescript
GET /api/athletes/:athleteId

// Response
{
  id: string;
  workspaceId: string;
  name: string;
  email: string | null;
  birthDate: string | null;
  avatar: string | null;
  metadata: {
    height?: number;
    weight?: number;
    position?: string;
    [key: string]: any;
  };
  createdAt: string;
  updatedAt: string;
}
```

### Create Athlete

```typescript
POST /api/athletes

// Request
{
  workspaceId: string;
  name: string;
  email?: string;
  birthDate?: string; // ISO date
  metadata?: Record<string, any>;
}

// Response
{
  success: boolean;
  athlete: Athlete;
}
```

### Update Athlete

```typescript
PATCH /api/athletes/:athleteId

// Request
{
  name?: string;
  email?: string;
  birthDate?: string;
  metadata?: Record<string, any>;
}

// Response
{
  success: boolean;
  athlete: Athlete;
}
```

### Delete Athlete

```typescript
DELETE /api/athletes/:athleteId

// Response
{
  success: boolean;
  message: string;
}
```

---

## 🏋️ WORKOUTS

### List Workouts

```typescript
GET /api/workouts?workspaceId={id}

// Query Parameters
workspaceId: string (required)
page?: number
limit?: number
search?: string
type?: 'strength' | 'cardio' | 'skill' | 'mixed'

// Response
{
  workouts: Workout[];
  pagination: Pagination;
}
```

### Get Workout

```typescript
GET /api/workouts/:workoutId

// Response
{
  id: string;
  workspaceId: string;
  name: string;
  description: string | null;
  type: 'strength' | 'cardio' | 'skill' | 'mixed';
  data: {
    blocks: Block[];
    exercises: Exercise[];
    settings: WorkoutSettings;
  };
  snapshotId: string | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}
```

### Create Workout

```typescript
POST /api/workouts

// Request
{
  workspaceId: string;
  name: string;
  description?: string;
  type: 'strength' | 'cardio' | 'skill' | 'mixed';
  data: {
    blocks: Block[];
    exercises: Exercise[];
    settings?: WorkoutSettings;
  };
}

// Response
{
  success: boolean;
  workout: Workout;
  snapshotId: string; // Auto-created snapshot
}
```

### Create Snapshot

```typescript
POST /api/workouts/:workoutId/snapshot

// Response
{
  success: boolean;
  snapshot: {
    id: string;
    workoutId: string;
    data: WorkoutData;
    createdAt: string;
  };
}
```

---

## 📅 CALENDAR EVENTS

### List Events

```typescript
GET /api/calendar/events?workspaceId={id}&startDate={date}&endDate={date}

// Query Parameters
workspaceId: string (required)
startDate: string (ISO date, required)
endDate: string (ISO date, required)
athleteIds?: string[] (comma-separated)
type?: EventType
status?: 'pending' | 'active' | 'completed' | 'cancelled'

// Response
{
  events: CalendarEvent[];
  total: number;
}
```

### Get Event

```typescript
GET /api/calendar/events/:eventId

// Response
{
  id: string;
  workspaceId: string;
  title: string;
  type: EventType;
  startTime: string; // ISO
  endTime: string; // ISO
  athletes: string[]; // athlete IDs
  workoutId: string | null;
  location: string | null;
  notes: string | null;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  metadata: {
    snapshotId?: string;
    sessionId?: string;
    [key: string]: any;
  };
  createdAt: string;
  updatedAt: string;
}
```

### Create Event

```typescript
POST /api/calendar/events

// Request
{
  workspaceId: string;
  title: string;
  type: EventType;
  startTime: string; // ISO
  endTime: string; // ISO
  athletes?: string[];
  workoutId?: string;
  location?: string;
  notes?: string;
  metadata?: Record<string, any>;
}

// Response
{
  success: boolean;
  event: CalendarEvent;
}
```

### Update Event

```typescript
PATCH /api/calendar/events/:eventId

// Request
{
  title?: string;
  startTime?: string;
  endTime?: string;
  athletes?: string[];
  location?: string;
  notes?: string;
  status?: 'pending' | 'active' | 'completed' | 'cancelled';
}

// Response
{
  success: boolean;
  event: CalendarEvent;
}
```

### Delete Event

```typescript
DELETE /api/calendar/events/:eventId

// Response
{
  success: boolean;
  message: string;
}
```

### Bulk Create Events

```typescript
POST /api/calendar/events/bulk

// Request
{
  workspaceId: string;
  events: Array<{
    title: string;
    type: EventType;
    startTime: string;
    endTime: string;
    athletes?: string[];
    workoutId?: string;
  }>;
}

// Response
{
  success: boolean;
  events: CalendarEvent[];
  count: number;
}
```

---

## ⚡ SESSIONS

### Start Session

```typescript
POST /api/sessions/start

// Request
{
  eventId: string;
  workoutId: string;
  athleteIds: string[];
}

// Response
{
  success: boolean;
  session: {
    id: string;
    eventId: string;
    workoutId: string;
    status: 'live';
    startedAt: string;
  };
}
```

### Update Session

```typescript
PATCH /api/sessions/:sessionId

// Request
{
  executionData?: {
    currentBlock?: number;
    currentExercise?: number;
    elapsedTime?: number;
    data?: Record<string, any>;
  };
}

// Response
{
  success: boolean;
  session: Session;
}
```

### Complete Session

```typescript
POST /api/sessions/:sessionId/complete

// Request
{
  executionData: {
    totalTime: number;
    exercises: Array<{
      exerciseId: string;
      sets: Array<{
        reps: number;
        weight: number;
        rpe?: number;
      }>;
    }>;
    notes?: string;
  };
}

// Response
{
  success: boolean;
  session: {
    id: string;
    status: 'completed';
    completedAt: string;
    executionData: ExecutionData;
  };
}
```

### Get Active Sessions

```typescript
GET /api/sessions/active?workspaceId={id}

// Response
{
  sessions: Session[];
  count: number;
}
```

---

## 📝 FORMS

### List Forms

```typescript
GET /api/forms?workspaceId={id}

// Response
{
  forms: Form[];
  total: number;
}
```

### Get Form

```typescript
GET /api/forms/:formId

// Response
{
  id: string;
  workspaceId: string;
  name: string;
  description: string | null;
  fields: FormField[];
  settings: {
    allowMultipleSubmissions?: boolean;
    requireAuth?: boolean;
  };
  createdAt: string;
}
```

### Create Form

```typescript
POST /api/forms

// Request
{
  workspaceId: string;
  name: string;
  description?: string;
  fields: Array<{
    id: string;
    type: 'text' | 'number' | 'select' | 'multiselect' | 'date' | 'scale';
    label: string;
    required?: boolean;
    options?: string[]; // for select/multiselect
    min?: number; // for number/scale
    max?: number;
  }>;
  settings?: FormSettings;
}

// Response
{
  success: boolean;
  form: Form;
}
```

### Submit Form

```typescript
POST /api/forms/:formId/submit

// Request
{
  athleteId: string;
  eventId?: string;
  data: Record<string, any>; // field ID → value
}

// Response
{
  success: boolean;
  submission: {
    id: string;
    formId: string;
    athleteId: string;
    data: Record<string, any>;
    submittedAt: string;
  };
}
```

### Get Submissions

```typescript
GET /api/forms/:formId/submissions?athleteId={id}&eventId={id}

// Response
{
  submissions: FormSubmission[];
  total: number;
}
```

---

## 📊 METRICS

### Record Metric

```typescript
POST /api/metrics

// Request
{
  workspaceId: string;
  athleteId: string;
  sessionId?: string;
  metricName: string;
  value: number;
  unit?: string;
  recordedAt?: string; // ISO, defaults to now
}

// Response
{
  success: boolean;
  metric: Metric;
}
```

### Get Athlete Metrics

```typescript
GET /api/metrics?athleteId={id}&metricName={name}&startDate={date}&endDate={date}

// Query Parameters
athleteId: string (required)
metricName?: string
startDate?: string (ISO)
endDate?: string (ISO)
limit?: number

// Response
{
  metrics: Metric[];
  aggregated: {
    min: number;
    max: number;
    avg: number;
    latest: number;
  };
}
```

### Batch Record Metrics

```typescript
POST /api/metrics/batch

// Request
{
  metrics: Array<{
    workspaceId: string;
    athleteId: string;
    sessionId?: string;
    metricName: string;
    value: number;
    unit?: string;
    recordedAt?: string;
  }>;
}

// Response
{
  success: boolean;
  count: number;
  metrics: Metric[];
}
```

---

## 📈 REPORTS

### List Reports

```typescript
GET /api/reports?workspaceId={id}

// Response
{
  reports: Report[];
  total: number;
}
```

### Create Report

```typescript
POST /api/reports

// Request
{
  workspaceId: string;
  name: string;
  config: {
    type: 'athlete' | 'workout' | 'attendance' | 'custom';
    filters: {
      athleteIds?: string[];
      dateRange?: { start: string; end: string };
      metrics?: string[];
    };
    visualizations: Array<{
      type: 'chart' | 'table' | 'stat';
      config: any;
    }>;
  };
  schedule?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    time: string; // HH:mm
    recipients: string[]; // emails
  };
}

// Response
{
  success: boolean;
  report: Report;
}
```

### Generate Report

```typescript
POST /api/reports/:reportId/generate

// Response
{
  success: boolean;
  data: {
    generatedAt: string;
    content: ReportContent;
    pdfUrl?: string;
  };
}
```

---

## 🔧 HOOKS & UTILITIES

### Custom Hooks

#### useCalendar

```typescript
import { useCalendar } from '@/components/calendar';

const { state, actions } = useCalendar();

// State
state.events: CalendarEvent[];
state.selectedDate: Date;
state.viewMode: ViewMode;
state.filters: Filters;
state.selectedEventIds: string[];

// Actions
actions.addEvent(event: Partial<CalendarEvent>): Promise<void>;
actions.updateEvent(id: string, updates: Partial<CalendarEvent>): Promise<void>;
actions.deleteEvent(id: string): Promise<void>;
actions.setViewMode(mode: ViewMode): void;
actions.setSelectedDate(date: Date): void;
actions.selectEvent(id: string): void;
actions.toggleEventSelection(id: string): void;
actions.applyFilters(filters: Filters): void;
```

#### useCalendarEvents

```typescript
import { useCalendarEvents } from '@/hooks/use-api';

const {
  events,
  isLoading,
  error,
  refetch,
  createEvent,
  updateEvent,
  deleteEvent,
} = useCalendarEvents(workspaceId, {
  startDate: '2024-01-01',
  endDate: '2024-01-31',
});
```

#### useAthletes

```typescript
import { useAthletes } from '@/hooks/use-api';

const {
  athletes,
  isLoading,
  error,
  refetch,
  createAthlete,
  updateAthlete,
  deleteAthlete,
} = useAthletes(workspaceId);
```

#### useBridgeRegistry

```typescript
import { useBridgeRegistry } from '@/components/calendar/integrations';

const {
  registry,
  bridges,
  activeBridges,
  stats,
  initialize,
  healthCheck,
} = useBridgeRegistry();
```

### Utility Functions

#### Date Helpers

```typescript
import {
  formatEventTime,
  getEventDuration,
  isEventToday,
  isEventPast,
  isEventConflict,
} from '@/lib/calendar-utils';

formatEventTime(event: CalendarEvent): string;
getEventDuration(event: CalendarEvent): number; // minutes
isEventToday(event: CalendarEvent): boolean;
isEventPast(event: CalendarEvent): boolean;
isEventConflict(event1: CalendarEvent, event2: CalendarEvent): boolean;
```

#### Validation

```typescript
import { validateEvent, validateWorkout, validateForm } from '@/lib/validators';

validateEvent(event: Partial<CalendarEvent>): ValidationResult;
validateWorkout(workout: Partial<Workout>): ValidationResult;
validateForm(formData: Record<string, any>, fields: FormField[]): ValidationResult;
```

---

## 📊 TYPE DEFINITIONS

### CalendarEvent

```typescript
interface CalendarEvent {
  id: string;
  workspaceId: string;
  title: string;
  type: EventType;
  startTime: string; // ISO
  endTime: string; // ISO
  athletes: string[]; // athlete IDs
  workoutId: string | null;
  location: string | null;
  notes: string | null;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  metadata: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

type EventType =
  | 'workout'
  | 'plan'
  | 'class'
  | 'assessment'
  | 'competition'
  | 'meeting'
  | 'recovery'
  | 'other';
```

### Workout

```typescript
interface Workout {
  id: string;
  workspaceId: string;
  name: string;
  description: string | null;
  type: 'strength' | 'cardio' | 'skill' | 'mixed';
  data: {
    blocks: Block[];
    exercises: Exercise[];
    settings: WorkoutSettings;
  };
  snapshotId: string | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

interface Block {
  id: string;
  name: string;
  type: 'amrap' | 'fortime' | 'emom' | 'tabata' | 'custom';
  duration?: number;
  rounds?: number;
  exercises: string[]; // exercise IDs
}

interface Exercise {
  id: string;
  name: string;
  category: string;
  prescription: {
    sets?: number;
    reps?: number | string; // "10" or "10-12" or "Max"
    weight?: number | string;
    duration?: number;
    distance?: number;
    rest?: number;
  };
}
```

### Athlete

```typescript
interface Athlete {
  id: string;
  workspaceId: string;
  name: string;
  email: string | null;
  birthDate: string | null;
  avatar: string | null;
  metadata: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}
```

### Session

```typescript
interface Session {
  id: string;
  workspaceId: string;
  eventId: string;
  workoutId: string;
  status: 'live' | 'completed' | 'cancelled';
  startedAt: string;
  completedAt: string | null;
  executionData: {
    currentBlock?: number;
    currentExercise?: number;
    elapsedTime?: number;
    exercises?: ExecutedExercise[];
    notes?: string;
  };
  createdAt: string;
}

interface ExecutedExercise {
  exerciseId: string;
  sets: Array<{
    reps: number;
    weight: number;
    rpe?: number;
    notes?: string;
  }>;
}
```

---

## 🔒 ERROR CODES

```typescript
{
  // 400 - Bad Request
  INVALID_INPUT: 'Invalid input data',
  MISSING_REQUIRED_FIELD: 'Required field missing',
  INVALID_DATE_RANGE: 'Invalid date range',
  
  // 401 - Unauthorized
  UNAUTHORIZED: 'Authentication required',
  INVALID_TOKEN: 'Invalid or expired token',
  
  // 403 - Forbidden
  FORBIDDEN: 'Insufficient permissions',
  WORKSPACE_ACCESS_DENIED: 'Workspace access denied',
  
  // 404 - Not Found
  NOT_FOUND: 'Resource not found',
  ATHLETE_NOT_FOUND: 'Athlete not found',
  EVENT_NOT_FOUND: 'Event not found',
  
  // 409 - Conflict
  EVENT_CONFLICT: 'Event time conflict',
  DUPLICATE_ENTRY: 'Duplicate entry',
  
  // 500 - Internal Server Error
  INTERNAL_ERROR: 'Internal server error',
  DATABASE_ERROR: 'Database error',
}
```

---

## 📞 RATE LIMITING

```
Standard: 100 requests/minute
Burst: 500 requests/hour
```

**Headers:**
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1609459200
```

---

**Documento criado em:** 10 Janeiro 2026  
**Versão:** 1.0.0  
**Última atualização:** 10 Janeiro 2026 23:55
