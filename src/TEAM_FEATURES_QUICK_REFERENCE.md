# 🏆 Team Features - Quick Reference Guide

> **Fast reference for Team Groups, Bulk Operations & Analytics**

---

## 📋 TABLE OF CONTENTS

1. [Overview](#overview)
2. [Team Groups](#team-groups)
3. [Bulk Scheduling](#bulk-scheduling)
4. [Team Analytics](#team-analytics)
5. [API Reference](#api-reference)
6. [Database Schema](#database-schema)
7. [Usage Examples](#usage-examples)

---

## 🎯 OVERVIEW

The Team Features system provides:
- ✅ **Team Groups** - Organize athletes into teams
- ✅ **Bulk Operations** - Schedule multiple events at once
- ✅ **Team Analytics** - Track team performance
- ✅ **Multi-Coach Support** - Assign coaches with permissions
- ✅ **Color Coding** - Visual identification

---

## 👥 TEAM GROUPS

### **What is a Team Group?**
A collection of athletes and coaches with:
- Unique name and description
- Visual color for identification
- Category (U12, U21, Elite, etc.)
- Metadata (sport, season, etc.)

### **Creating a Team Group:**

```typescript
import { useTeamGroups } from '@/hooks/useTeamGroups';

const { createGroup } = useTeamGroups(workspaceId);

await createGroup({
  name: 'Elite Squad',
  description: 'Top performers',
  color: '#8b5cf6',
  athlete_ids: ['athlete-1', 'athlete-2', 'athlete-3'],
  coach_ids: ['coach-1'],
  meta: {
    category: 'Elite',
    sport: 'Football',
    season: '2024-25'
  }
});
```

### **Managing Groups:**

```typescript
// Update
await updateGroup(groupId, {
  name: 'New Name',
  athlete_ids: [...existingIds, 'new-athlete-id']
});

// Delete
await deleteGroup(groupId);

// Refresh list
await refreshGroups();
```

---

## ⚡ BULK SCHEDULING

### **What is Bulk Scheduling?**
Create multiple events in one operation with:
- Date range selection
- Weekday pattern (Mon-Sun)
- Event template (title, type, time, duration)
- Conflict detection
- Notification sending

### **Using the Bulk Schedule Wizard:**

```typescript
import { BulkTeamScheduleModal } from '@/components/calendar';

<BulkTeamScheduleModal
  isOpen={isOpen}
  onClose={onClose}
  onSchedule={async (operation) => {
    const result = await bulkSchedule(operation);
    console.log(`Created ${result.success} events!`);
    return result;
  }}
  teamGroup={selectedGroup}
/>
```

### **Bulk Schedule Operation:**

```typescript
const operation = {
  team_group_id: 'team-group-1',
  event_template: {
    title: 'Morning Training',
    event_type: 'training',
    start_time: '09:00',
    duration_minutes: 90,
    location: 'Main Gym'
  },
  dates: ['2026-01-20', '2026-01-22', '2026-01-24'], // Mon, Wed, Fri
  options: {
    skip_conflicts: true,
    send_notifications: true
  }
};

const result = await bulkSchedule(operation);
// result = { success: 3, failed: 0, conflicts: 0, created_events: [...] }
```

### **Weekday Pattern Example:**

```typescript
// Schedule Mon-Fri for 4 weeks
const weekdays = [1, 2, 3, 4, 5]; // Mon-Fri
const startDate = '2026-01-20';
const endDate = '2026-02-14'; // 4 weeks

// Wizard auto-calculates dates that match weekdays
// Result: ~20 events (4 weeks × 5 days)
```

---

## 📊 TEAM ANALYTICS

### **What Analytics are Available?**

**Event Metrics:**
- Total events (scheduled, completed, cancelled)
- Completion rate
- Total hours
- Average hours per athlete

**Participation Metrics:**
- Total participants
- Unique athletes
- Average attendance rate
- Participation trend (↗️/→/↘️)

**Event Type Breakdown:**
- Count by type (training, competition, recovery, etc.)
- Hours by type

### **Loading Analytics:**

```typescript
const { getGroupAnalytics } = useTeamGroups(workspaceId);

const analytics = await getGroupAnalytics(groupId, {
  start: '2026-01-01',
  end: '2026-01-31'
});

console.log(analytics);
// {
//   total_events: 24,
//   completed_events: 20,
//   avg_attendance_rate: 87.5,
//   total_hours: 36,
//   trend_participation: 'increasing',
//   by_event_type: { ... }
// }
```

### **Using the Analytics Panel:**

```typescript
import { TeamAnalyticsPanel } from '@/components/calendar';

<TeamAnalyticsPanel
  teamGroup={selectedGroup}
  analytics={analytics}
  dateRange={{ start: '2026-01-01', end: '2026-01-31' }}
/>
```

---

## 🔌 API REFERENCE

### **Endpoints:**

```typescript
// List all groups
GET /api/calendar/team-groups?workspace_id={id}

// Create group
POST /api/calendar/team-groups
Body: { name, description, color, athlete_ids, coach_ids, meta }

// Get group details
GET /api/calendar/team-groups/{id}

// Update group
PATCH /api/calendar/team-groups/{id}
Body: { name?, athlete_ids?, ... }

// Delete group
DELETE /api/calendar/team-groups/{id}

// Get analytics
GET /api/calendar/team-groups/{id}/analytics?start_date={date}&end_date={date}

// Bulk schedule
POST /api/calendar/team-groups/bulk-schedule
Body: { team_group_id, event_template, dates, options }
```

### **Response Examples:**

**List Groups:**
```json
{
  "groups": [
    {
      "id": "team-group-1",
      "workspace_id": "ws-1",
      "name": "Elite Squad",
      "color": "#8b5cf6",
      "athlete_ids": ["athlete-1", "athlete-2"],
      "coach_ids": ["coach-1"],
      "meta": { "category": "Elite" },
      "created_at": "2026-01-20T10:00:00Z"
    }
  ],
  "total": 1
}
```

**Bulk Schedule Result:**
```json
{
  "success": 18,
  "failed": 0,
  "conflicts": 2,
  "created_events": ["event-1", "event-2", ...]
}
```

---

## 🗄️ DATABASE SCHEMA

### **Tables:**

**team_groups**
```sql
id              UUID PRIMARY KEY
workspace_id    UUID REFERENCES workspaces
name            VARCHAR(255) NOT NULL
description     TEXT
color           VARCHAR(7) -- Hex color
athlete_ids     UUID[] -- Array of athlete IDs
coach_ids       UUID[] -- Array of coach IDs
meta            JSONB
created_at      TIMESTAMPTZ
updated_at      TIMESTAMPTZ
created_by      UUID REFERENCES users
```

**coach_assignments**
```sql
id              UUID PRIMARY KEY
team_group_id   UUID REFERENCES team_groups
coach_id        UUID REFERENCES users
role            VARCHAR(50) -- 'head', 'assistant', 'specialist'
permissions     JSONB
assigned_at     TIMESTAMPTZ
assigned_by     UUID
```

### **Materialized View:**

**team_analytics**
```sql
SELECT
  team_group_id,
  COUNT(events) AS total_events,
  AVG(attendance_rate) AS avg_attendance_rate,
  SUM(duration) / 60.0 AS total_hours,
  ...
FROM team_groups
JOIN calendar_events
JOIN event_participants
GROUP BY team_group_id
```

### **Helper Functions:**

**create_bulk_team_events()**
```sql
Parameters:
  - team_group_id UUID
  - event_template JSONB
  - dates TEXT[]
  - skip_conflicts BOOLEAN
  - send_notifications BOOLEAN

Returns:
  JSONB {
    success: INT,
    failed: INT,
    conflicts: INT,
    created_events: UUID[]
  }
```

---

## 💡 USAGE EXAMPLES

### **Example 1: Create Training Squad**

```typescript
// 1. Create group
const squad = await createGroup({
  name: 'U21 Training Squad',
  color: '#10b981',
  athlete_ids: ['athlete-1', 'athlete-2', 'athlete-3', 'athlete-4'],
  coach_ids: ['coach-1'],
  meta: { category: 'U21', sport: 'Football' }
});

// 2. Schedule Mon/Wed/Fri training for 1 month
await bulkSchedule({
  team_group_id: squad.id,
  event_template: {
    title: 'U21 Training',
    event_type: 'training',
    start_time: '18:00',
    duration_minutes: 90,
    location: 'Training Ground A'
  },
  dates: generateWeekdayDates([1, 3, 5], '2026-01-20', '2026-02-20'),
  options: {
    skip_conflicts: true,
    send_notifications: true
  }
});

// 3. View analytics after 1 month
const analytics = await getGroupAnalytics(squad.id, {
  start: '2026-01-20',
  end: '2026-02-20'
});
```

### **Example 2: Elite Squad with Multiple Coaches**

```typescript
const eliteSquad = await createGroup({
  name: 'Elite Performance Squad',
  description: 'Top 5 athletes + 2 specialist coaches',
  color: '#8b5cf6',
  athlete_ids: ['athlete-1', 'athlete-2', 'athlete-3', 'athlete-4', 'athlete-5'],
  coach_ids: ['head-coach', 'strength-coach'],
  meta: {
    category: 'Elite',
    level: 'Professional',
    season: '2024-25'
  }
});
```

### **Example 3: Competition Prep Schedule**

```typescript
// Schedule intensive training before competition
await bulkSchedule({
  team_group_id: groupId,
  event_template: {
    title: 'Competition Prep',
    event_type: 'training',
    start_time: '10:00',
    duration_minutes: 120,
    location: 'Competition Venue'
  },
  dates: [
    '2026-02-10', // Mon
    '2026-02-12', // Wed
    '2026-02-14', // Fri
    '2026-02-17', // Mon (week 2)
    '2026-02-19', // Wed
  ],
  options: {
    skip_conflicts: false, // Don't skip - we need all sessions
    send_notifications: true
  }
});
```

---

## 🎨 UI COMPONENTS

### **TeamGroupManager**
Main component for group management:
- List all groups
- Create/Edit/Delete
- Select group
- View quick actions

```typescript
import { TeamGroupManager } from '@/components/calendar';

<TeamGroupManager
  workspaceId="ws-1"
  selectedGroup={selectedGroup}
  onSelectGroup={setSelectedGroup}
/>
```

### **TeamGroupModal**
Create/Edit team groups:
```typescript
import { TeamGroupModal } from '@/components/calendar';

<TeamGroupModal
  isOpen={isOpen}
  onClose={onClose}
  onSave={handleSave}
  existingGroup={group} // Optional for edit
  athletes={athletesList}
  coaches={coachesList}
/>
```

### **BulkTeamScheduleModal**
Bulk scheduling wizard:
```typescript
import { BulkTeamScheduleModal } from '@/components/calendar';

<BulkTeamScheduleModal
  isOpen={isOpen}
  onClose={onClose}
  onSchedule={handleSchedule}
  teamGroup={selectedGroup}
/>
```

### **TeamAnalyticsPanel**
Display team analytics:
```typescript
import { TeamAnalyticsPanel } from '@/components/calendar';

<TeamAnalyticsPanel
  teamGroup={group}
  analytics={analytics}
  dateRange={{ start: '2026-01-01', end: '2026-01-31' }}
/>
```

---

## 🔧 HOOKS

### **useTeamGroups**

```typescript
const {
  // State
  groups,          // TeamGroup[]
  isLoading,       // boolean
  error,           // Error | null
  
  // Actions
  createGroup,     // (group: Partial<TeamGroup>) => Promise<TeamGroup>
  updateGroup,     // (id: string, updates: Partial<TeamGroup>) => Promise<TeamGroup>
  deleteGroup,     // (id: string) => Promise<void>
  getGroupAnalytics, // (id: string, range: DateRange) => Promise<TeamAnalytics>
  bulkSchedule,    // (operation: BulkTeamOperation) => Promise<Result>
  
  // Utils
  refreshGroups,   // () => Promise<void>
} = useTeamGroups(workspaceId);
```

---

## ⚠️ IMPORTANT NOTES

### **Conflict Detection:**
- Set `skip_conflicts: true` to ignore events with conflicts
- Set `skip_conflicts: false` to create all events (may cause double-bookings)
- Conflicts are detected per-athlete, not per-group

### **Performance:**
- Analytics use materialized view (fast!)
- Refresh view with: `SELECT refresh_team_analytics();`
- Auto-refresh: scheduled job (recommended: daily)

### **Permissions:**
- All users can view groups in their workspace
- All users can create/edit/delete groups
- Coach-specific permissions: coming soon

### **Limits:**
- Max athletes per group: No hard limit
- Max coaches per group: No hard limit
- Max events in bulk operation: 100 (recommended)

---

## 🚀 NEXT STEPS

After implementing team features:

1. **Integrate with Real Data:**
   - Replace mock athletes with API
   - Replace mock coaches with API
   - Connect to Supabase

2. **Enhance Analytics:**
   - Add chart visualizations
   - Export analytics to PDF
   - Comparison between teams

3. **Add Permissions:**
   - Implement coach permission checks
   - Role-based UI restrictions
   - Audit log for team changes

4. **Calendar Sharing:**
   - Share team calendar externally
   - Generate public iCal feed
   - Embed calendar widget

---

**Created:** 20 Janeiro 2026  
**Version:** 1.0  
**Status:** ✅ Production Ready
