# 🔧 **PERFORMTRACK CALENDAR - API DOCUMENTATION**

> **Version:** 2.0.0  
> **Last Updated:** 18 Janeiro 2026  
> **Audience:** Developers, System Integrators

---

## 📖 **TABLE OF CONTENTS**

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Base URL & Headers](#base-url--headers)
4. [Event Endpoints](#event-endpoints)
5. [Participant Endpoints](#participant-endpoints)
6. [Export Endpoints](#export-endpoints)
7. [Report Endpoints](#report-endpoints)
8. [Integration Endpoints](#integration-endpoints)
9. [Automation Endpoints](#automation-endpoints)
10. [Webhooks](#webhooks)
11. [Error Handling](#error-handling)
12. [Rate Limiting](#rate-limiting)
13. [SDK Examples](#sdk-examples)

---

## 🎯 **OVERVIEW**

The PerformTrack Calendar API provides programmatic access to calendar events, participants, analytics, and integrations.

### **Key Features**

- 🔒 **Secure** - JWT authentication, workspace isolation
- 📊 **RESTful** - Standard HTTP methods
- 🚀 **Fast** - <200ms average response time
- 📝 **Well-Documented** - OpenAPI 3.0 spec available
- 🔄 **Real-time** - WebSocket support for live updates

### **API Capabilities**

✅ CRUD operations on events  
✅ Participant management  
✅ Attendance tracking  
✅ Export data (CSV, JSON, iCal)  
✅ Generate reports  
✅ Trigger automations  
✅ Real-time subscriptions  

---

## 🔐 **AUTHENTICATION**

All API requests require authentication via JWT tokens.

### **Obtain Access Token**

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "your_password"
}
```

**Response:**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_in": 3600,
  "token_type": "Bearer"
}
```

### **Use Token in Requests**

Include token in Authorization header:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### **Refresh Token**

```http
POST /api/auth/refresh
Content-Type: application/json

{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## 🌐 **BASE URL & HEADERS**

### **Base URL**

```
Production:  https://api.performtrack.com/v2
Staging:     https://api-staging.performtrack.com/v2
Development: http://localhost:3000/api/v2
```

### **Required Headers**

```http
Authorization: Bearer {access_token}
Content-Type: application/json
X-Workspace-ID: {workspace_id}
```

### **Optional Headers**

```http
X-Request-ID: {unique_request_id}  # For tracking
Accept-Language: pt-PT              # Localization
```

---

## 📅 **EVENT ENDPOINTS**

### **List Events**

```http
GET /api/calendar/events
```

**Query Parameters:**

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `workspace_id` | string | **Required** Workspace ID | `workspace_123` |
| `start_date` | ISO 8601 | Filter by start date (>=) | `2026-01-01T00:00:00Z` |
| `end_date` | ISO 8601 | Filter by end date (<=) | `2026-01-31T23:59:59Z` |
| `type` | string | Filter by type | `training` |
| `status` | string | Filter by status | `confirmed` |
| `athlete_ids` | string[] | Filter by athletes (comma-separated) | `athlete_1,athlete_2` |
| `limit` | number | Max results (default: 50, max: 100) | `50` |
| `offset` | number | Pagination offset | `0` |
| `sort_by` | string | Sort field | `start_date` |
| `sort_order` | string | Sort direction (`asc` or `desc`) | `asc` |

**Example Request:**

```http
GET /api/calendar/events?workspace_id=workspace_123&start_date=2026-01-01T00:00:00Z&end_date=2026-01-31T23:59:59Z&limit=20
Authorization: Bearer {token}
X-Workspace-ID: workspace_123
```

**Response (200 OK):**

```json
{
  "data": [
    {
      "id": "event_abc123",
      "workspace_id": "workspace_123",
      "title": "Morning Training",
      "description": "Cardio and strength",
      "start_date": "2026-01-15T10:00:00Z",
      "end_date": "2026-01-15T11:30:00Z",
      "type": "training",
      "status": "confirmed",
      "location": "Gym A",
      "color": "#0ea5e9",
      "athlete_ids": ["athlete_1", "athlete_2"],
      "tags": ["cardio", "strength"],
      "source": "manual",
      "workout_id": null,
      "created_at": "2026-01-10T08:00:00Z",
      "updated_at": "2026-01-10T08:00:00Z"
    }
  ],
  "meta": {
    "total": 45,
    "limit": 20,
    "offset": 0,
    "has_more": true
  }
}
```

---

### **Get Event by ID**

```http
GET /api/calendar/events/{event_id}
```

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `event_id` | string | Event ID |

**Response (200 OK):**

```json
{
  "data": {
    "id": "event_abc123",
    "workspace_id": "workspace_123",
    "title": "Morning Training",
    "description": "Cardio and strength",
    "start_date": "2026-01-15T10:00:00Z",
    "end_date": "2026-01-15T11:30:00Z",
    "type": "training",
    "status": "confirmed",
    "location": "Gym A",
    "color": "#0ea5e9",
    "athlete_ids": ["athlete_1", "athlete_2"],
    "tags": ["cardio", "strength"],
    "source": "manual",
    "workout_id": null,
    "created_at": "2026-01-10T08:00:00Z",
    "updated_at": "2026-01-10T08:00:00Z"
  }
}
```

---

### **Create Event**

```http
POST /api/calendar/events
```

**Request Body:**

```json
{
  "workspace_id": "workspace_123",
  "title": "Morning Training",
  "description": "Cardio and strength",
  "start_date": "2026-01-15T10:00:00Z",
  "end_date": "2026-01-15T11:30:00Z",
  "type": "training",
  "status": "confirmed",
  "location": "Gym A",
  "color": "#0ea5e9",
  "athlete_ids": ["athlete_1", "athlete_2"],
  "tags": ["cardio", "strength"],
  "source": "manual",
  "notes": "Bring water bottles"
}
```

**Validation:**

- `title`: Required, 1-200 characters
- `start_date`: Required, ISO 8601 format
- `end_date`: Required, must be after `start_date`
- `type`: Required, one of: `training`, `competition`, `meeting`, `recovery`, `assessment`, `other`
- `status`: Optional, default `pending`, one of: `pending`, `confirmed`, `completed`, `cancelled`

**Response (201 Created):**

```json
{
  "data": {
    "id": "event_new123",
    "workspace_id": "workspace_123",
    "title": "Morning Training",
    ...
  }
}
```

---

### **Update Event**

```http
PATCH /api/calendar/events/{event_id}
```

**Request Body (partial update):**

```json
{
  "title": "Updated Training",
  "status": "confirmed"
}
```

**Response (200 OK):**

```json
{
  "data": {
    "id": "event_abc123",
    "workspace_id": "workspace_123",
    "title": "Updated Training",
    "status": "confirmed",
    ...
  }
}
```

---

### **Delete Event**

```http
DELETE /api/calendar/events/{event_id}
```

**Response (204 No Content)**

---

### **Batch Create Events**

```http
POST /api/calendar/events/batch
```

**Request Body:**

```json
{
  "events": [
    {
      "title": "Training 1",
      "start_date": "2026-01-15T10:00:00Z",
      "end_date": "2026-01-15T11:00:00Z",
      "type": "training",
      ...
    },
    {
      "title": "Training 2",
      "start_date": "2026-01-16T10:00:00Z",
      "end_date": "2026-01-16T11:00:00Z",
      "type": "training",
      ...
    }
  ]
}
```

**Response (201 Created):**

```json
{
  "data": {
    "created": 2,
    "failed": 0,
    "events": [...]
  }
}
```

---

## 👥 **PARTICIPANT ENDPOINTS**

### **List Participants**

```http
GET /api/calendar/events/{event_id}/participants
```

**Response (200 OK):**

```json
{
  "data": [
    {
      "id": "participant_123",
      "event_id": "event_abc123",
      "athlete_id": "athlete_1",
      "attendance_status": "present",
      "attendance_notes": "On time",
      "created_at": "2026-01-15T09:00:00Z",
      "updated_at": "2026-01-15T10:00:00Z",
      "athlete": {
        "id": "athlete_1",
        "name": "John Doe",
        "email": "john@example.com"
      }
    }
  ]
}
```

---

### **Add Participant**

```http
POST /api/calendar/events/{event_id}/participants
```

**Request Body:**

```json
{
  "athlete_id": "athlete_3",
  "attendance_status": "pending"
}
```

**Response (201 Created)**

---

### **Update Attendance**

```http
PATCH /api/calendar/events/{event_id}/participants/{participant_id}
```

**Request Body:**

```json
{
  "attendance_status": "present",
  "attendance_notes": "Arrived 5 min late"
}
```

**Response (200 OK)**

---

### **Remove Participant**

```http
DELETE /api/calendar/events/{event_id}/participants/{participant_id}
```

**Response (204 No Content)**

---

### **Batch Update Attendance**

```http
POST /api/calendar/events/{event_id}/participants/batch-update
```

**Request Body:**

```json
{
  "updates": [
    {
      "athlete_id": "athlete_1",
      "attendance_status": "present"
    },
    {
      "athlete_id": "athlete_2",
      "attendance_status": "absent",
      "attendance_notes": "Sick"
    }
  ]
}
```

**Response (200 OK)**

---

## 📤 **EXPORT ENDPOINTS**

### **Export Events**

```http
POST /api/calendar/export
```

**Request Body:**

```json
{
  "workspace_id": "workspace_123",
  "format": "csv",
  "date_range": {
    "start": "2026-01-01T00:00:00Z",
    "end": "2026-01-31T23:59:59Z"
  },
  "filters": {
    "types": ["training", "competition"],
    "statuses": ["confirmed", "completed"]
  },
  "fields": {
    "title": true,
    "date": true,
    "time": true,
    "type": true,
    "status": true,
    "location": true,
    "participants": true,
    "description": false,
    "notes": false
  }
}
```

**Supported Formats:**

- `csv` - Comma-separated values
- `excel` - Excel .xlsx
- `pdf` - PDF document
- `json` - JSON data
- `ical` - iCalendar format

**Response (200 OK):**

```json
{
  "data": {
    "download_url": "https://api.performtrack.com/downloads/export_abc123.csv",
    "expires_at": "2026-01-18T12:00:00Z",
    "file_size": 15360,
    "event_count": 45
  }
}
```

**Download File:**

```http
GET https://api.performtrack.com/downloads/export_abc123.csv
Authorization: Bearer {token}
```

---

## 📊 **REPORT ENDPOINTS**

### **Generate Event Summary Report**

```http
POST /api/calendar/reports/event-summary
```

**Request Body:**

```json
{
  "workspace_id": "workspace_123",
  "date_range": {
    "start": "2026-01-01T00:00:00Z",
    "end": "2026-01-31T23:59:59Z"
  },
  "include_types": ["training", "competition"],
  "include_statuses": ["confirmed", "completed"]
}
```

**Response (200 OK):**

```json
{
  "data": {
    "metadata": {
      "generated_at": "2026-01-18T10:30:00Z",
      "workspace_id": "workspace_123",
      "date_range": {...},
      "total_events": 45
    },
    "summary": {
      "total_events": 45,
      "confirmed_events": 30,
      "pending_events": 5,
      "completed_events": 8,
      "cancelled_events": 2,
      "confirmation_rate": 66.67,
      "completion_rate": 17.78,
      "cancellation_rate": 4.44
    },
    "by_type": [
      {"type": "training", "count": 35, "percentage": 77.78},
      {"type": "competition", "count": 10, "percentage": 22.22}
    ],
    "by_status": [...],
    "timeline": [
      {
        "date": "2026-01-01",
        "count": 2,
        "confirmed": 2,
        "pending": 0,
        "completed": 0
      },
      ...
    ]
  }
}
```

---

### **Generate Attendance Report**

```http
POST /api/calendar/reports/attendance
```

**Request Body:**

```json
{
  "workspace_id": "workspace_123",
  "date_range": {
    "start": "2026-01-01T00:00:00Z",
    "end": "2026-01-31T23:59:59Z"
  }
}
```

**Response (200 OK):**

```json
{
  "data": {
    "metadata": {...},
    "overall": {
      "total_participants": 150,
      "present_count": 135,
      "absent_count": 10,
      "excused_count": 5,
      "attendance_rate": 90.00
    },
    "by_event": [...],
    "by_athlete": [
      {
        "athlete_id": "athlete_1",
        "athlete_name": "John Doe",
        "total_events": 10,
        "attended_events": 9,
        "attendance_rate": 90.00
      },
      ...
    ]
  }
}
```

---

### **Generate Performance Report**

```http
POST /api/calendar/reports/performance
```

**Response includes:**
- Completion metrics
- Punctuality metrics
- Utilization metrics
- Weekly trends

---

### **Generate Utilization Report**

```http
POST /api/calendar/reports/utilization
```

**Response includes:**
- Overall utilization
- By day of week
- By time of day
- Peak times

---

## 🔗 **INTEGRATION ENDPOINTS**

### **DataOS Integration**

#### **Sync Event to DataOS**

```http
POST /api/calendar/integrations/dataos/sync
```

**Request Body:**

```json
{
  "event_id": "event_abc123",
  "workspace_id": "workspace_123"
}
```

**Response (200 OK):**

```json
{
  "data": {
    "synced": true,
    "metrics_created": 3,
    "metrics": [
      {
        "key": "training_completed",
        "value": 1,
        "athlete_id": "athlete_1"
      },
      ...
    ]
  }
}
```

---

### **Forms Integration**

#### **Schedule Form for Event**

```http
POST /api/calendar/integrations/forms/schedule
```

**Request Body:**

```json
{
  "event_id": "event_abc123",
  "form_id": "form_xyz789",
  "timing": "pre_event",
  "schedule": {
    "days_before": 2,
    "time": "18:00"
  },
  "recipients": {
    "target": "all_participants"
  }
}
```

**Response (201 Created)**

---

### **Live Session Integration**

#### **Create Session from Event**

```http
POST /api/calendar/integrations/live-session/create
```

**Request Body:**

```json
{
  "event_id": "event_abc123",
  "coach_id": "coach_1"
}
```

**Response (201 Created):**

```json
{
  "data": {
    "session_id": "session_abc123",
    "event_id": "event_abc123",
    "link_id": "link_xyz789"
  }
}
```

---

#### **Sync Session Attendance**

```http
POST /api/calendar/integrations/live-session/sync-attendance
```

**Request Body:**

```json
{
  "session_id": "session_abc123",
  "event_id": "event_abc123"
}
```

**Response (200 OK):**

```json
{
  "data": {
    "synced": 15,
    "errors": 0
  }
}
```

---

## ⚡ **AUTOMATION ENDPOINTS**

### **List Automation Rules**

```http
GET /api/calendar/automations
```

**Response (200 OK):**

```json
{
  "data": [
    {
      "id": "rule_123",
      "workspace_id": "workspace_123",
      "name": "1h Before Reminder",
      "enabled": true,
      "trigger": "before_event",
      "trigger_config": {
        "before_minutes": 60
      },
      "actions": [
        {
          "type": "send_notification",
          "config": {
            "title": "Training in 1 hour!",
            "message": "Don't forget {event.title}"
          }
        }
      ],
      "trigger_count": 145,
      "last_triggered_at": "2026-01-18T09:00:00Z"
    }
  ]
}
```

---

### **Create Automation Rule**

```http
POST /api/calendar/automations
```

**Request Body:**

```json
{
  "workspace_id": "workspace_123",
  "name": "Completion Sync",
  "trigger": "event_completed",
  "trigger_config": {
    "event_types": ["training"]
  },
  "conditions": [
    {
      "field": "athlete_count",
      "operator": "greater_than",
      "value": 0
    }
  ],
  "actions": [
    {
      "type": "update_metric",
      "config": {
        "metric_key": "training_completed",
        "value": 1
      }
    }
  ]
}
```

**Response (201 Created)**

---

### **Update Automation Rule**

```http
PATCH /api/calendar/automations/{rule_id}
```

---

### **Delete Automation Rule**

```http
DELETE /api/calendar/automations/{rule_id}
```

---

### **Trigger Automation Manually**

```http
POST /api/calendar/automations/{rule_id}/trigger
```

**Request Body:**

```json
{
  "event_id": "event_abc123"
}
```

**Response (200 OK):**

```json
{
  "data": {
    "execution_id": "exec_xyz789",
    "status": "completed",
    "actions_executed": 2,
    "actions_failed": 0
  }
}
```

---

## 🔔 **WEBHOOKS**

### **Register Webhook**

```http
POST /api/webhooks
```

**Request Body:**

```json
{
  "workspace_id": "workspace_123",
  "url": "https://your-app.com/webhooks/calendar",
  "events": [
    "event.created",
    "event.updated",
    "event.completed",
    "participant.attendance_marked"
  ],
  "secret": "your_webhook_secret"
}
```

**Response (201 Created):**

```json
{
  "data": {
    "id": "webhook_123",
    "url": "https://your-app.com/webhooks/calendar",
    "events": [...],
    "active": true,
    "created_at": "2026-01-18T10:00:00Z"
  }
}
```

---

### **Webhook Payload**

When an event occurs, we POST to your URL:

```json
{
  "id": "evt_abc123",
  "event": "event.created",
  "timestamp": "2026-01-18T10:30:00Z",
  "workspace_id": "workspace_123",
  "data": {
    "event": {
      "id": "event_new123",
      "title": "New Training",
      ...
    }
  }
}
```

**Verify Signature:**

```javascript
const crypto = require('crypto');

function verifyWebhook(payload, signature, secret) {
  const hmac = crypto.createHmac('sha256', secret);
  const digest = hmac.update(payload).digest('hex');
  return digest === signature;
}

// In your webhook handler:
const signature = req.headers['x-performtrack-signature'];
const isValid = verifyWebhook(req.body, signature, 'your_webhook_secret');
```

---

### **Webhook Events**

| Event | Description |
|-------|-------------|
| `event.created` | New event created |
| `event.updated` | Event updated |
| `event.deleted` | Event deleted |
| `event.confirmed` | Event status → confirmed |
| `event.completed` | Event status → completed |
| `event.cancelled` | Event status → cancelled |
| `participant.added` | Participant added to event |
| `participant.removed` | Participant removed |
| `participant.attendance_marked` | Attendance updated |

---

## ❌ **ERROR HANDLING**

### **Error Response Format**

```json
{
  "error": {
    "code": "INVALID_REQUEST",
    "message": "Start date must be before end date",
    "details": {
      "field": "end_date",
      "value": "2026-01-10T10:00:00Z"
    },
    "request_id": "req_abc123"
  }
}
```

### **Error Codes**

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `UNAUTHORIZED` | 401 | Invalid or missing token |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `INVALID_REQUEST` | 400 | Validation error |
| `CONFLICT` | 409 | Resource conflict |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server error |

### **Validation Errors**

```json
{
  "error": {
    "code": "INVALID_REQUEST",
    "message": "Validation failed",
    "details": {
      "errors": [
        {
          "field": "title",
          "message": "Title is required"
        },
        {
          "field": "end_date",
          "message": "End date must be after start date"
        }
      ]
    }
  }
}
```

---

## ⏱️ **RATE LIMITING**

### **Limits**

| Tier | Requests/minute | Requests/hour |
|------|-----------------|---------------|
| Free | 60 | 1,000 |
| Pro | 300 | 10,000 |
| Enterprise | Unlimited | Unlimited |

### **Headers**

```http
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1642502400
```

### **Rate Limit Exceeded**

```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded. Try again in 30 seconds.",
    "retry_after": 30
  }
}
```

---

## 💻 **SDK EXAMPLES**

### **JavaScript/TypeScript**

```typescript
import { PerformTrackClient } from '@performtrack/sdk';

const client = new PerformTrackClient({
  apiKey: 'your_api_key',
  workspaceId: 'workspace_123',
});

// List events
const events = await client.calendar.events.list({
  startDate: new Date('2026-01-01'),
  endDate: new Date('2026-01-31'),
  type: 'training',
});

// Create event
const newEvent = await client.calendar.events.create({
  title: 'Morning Training',
  startDate: new Date('2026-01-20T10:00:00Z'),
  endDate: new Date('2026-01-20T11:30:00Z'),
  type: 'training',
  athleteIds: ['athlete_1', 'athlete_2'],
});

// Update attendance
await client.calendar.participants.updateAttendance(
  'event_abc123',
  'participant_123',
  {
    attendanceStatus: 'present',
    notes: 'On time',
  }
);

// Export events
const exportUrl = await client.calendar.export({
  format: 'csv',
  dateRange: {
    start: new Date('2026-01-01'),
    end: new Date('2026-01-31'),
  },
});
```

---

### **Python**

```python
from performtrack import PerformTrackClient

client = PerformTrackClient(
    api_key='your_api_key',
    workspace_id='workspace_123'
)

# List events
events = client.calendar.events.list(
    start_date='2026-01-01T00:00:00Z',
    end_date='2026-01-31T23:59:59Z',
    type='training'
)

# Create event
new_event = client.calendar.events.create(
    title='Morning Training',
    start_date='2026-01-20T10:00:00Z',
    end_date='2026-01-20T11:30:00Z',
    type='training',
    athlete_ids=['athlete_1', 'athlete_2']
)

# Generate report
report = client.calendar.reports.event_summary(
    date_range={
        'start': '2026-01-01T00:00:00Z',
        'end': '2026-01-31T23:59:59Z'
    }
)
```

---

### **cURL**

```bash
# List events
curl -X GET 'https://api.performtrack.com/v2/api/calendar/events?workspace_id=workspace_123&start_date=2026-01-01T00:00:00Z' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'X-Workspace-ID: workspace_123'

# Create event
curl -X POST 'https://api.performtrack.com/v2/api/calendar/events' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -H 'X-Workspace-ID: workspace_123' \
  -d '{
    "title": "Morning Training",
    "start_date": "2026-01-20T10:00:00Z",
    "end_date": "2026-01-20T11:30:00Z",
    "type": "training",
    "athlete_ids": ["athlete_1", "athlete_2"]
  }'

# Update event
curl -X PATCH 'https://api.performtrack.com/v2/api/calendar/events/event_abc123' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -H 'X-Workspace-ID: workspace_123' \
  -d '{
    "status": "confirmed"
  }'
```

---

## 📚 **ADDITIONAL RESOURCES**

- **OpenAPI Spec:** https://api.performtrack.com/v2/openapi.json
- **Postman Collection:** https://www.postman.com/performtrack/workspace/calendar-api
- **SDK Repository:** https://github.com/performtrack/sdk
- **Developer Forum:** https://community.performtrack.com/developers

---

## 🆘 **SUPPORT**

**Technical Support:**  
📧 developers@performtrack.com  
💬 Slack: #api-support  
📖 Docs: https://docs.performtrack.com

**Report Bugs:**  
🐛 GitHub Issues: https://github.com/performtrack/api/issues

---

*API Documentation Version 2.0.0 - Last Updated: 18 Janeiro 2026*
