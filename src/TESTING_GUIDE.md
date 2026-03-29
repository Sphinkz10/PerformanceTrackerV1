# 🧪 PERFORMTRACK - TESTING GUIDE

**Versão:** 1.0.0  
**Data:** 10 Janeiro 2026  
**Framework:** Jest + React Testing Library + Playwright

---

## 📋 ÍNDICE

1. [Overview](#overview)
2. [Setup](#setup)
3. [Unit Tests](#unit-tests)
4. [Component Tests](#component-tests)
5. [Integration Tests](#integration-tests)
6. [E2E Tests](#e2e-tests)
7. [Coverage](#coverage)
8. [Best Practices](#best-practices)

---

## 🎯 OVERVIEW

### Testing Strategy

```
Pyramid de Testes:
       /\
      /E2E\     ← Few (Critical user flows)
     /------\
    /INTEG.  \  ← Some (API + Component integration)
   /----------\
  /UNIT TESTS  \ ← Many (Functions, hooks, utilities)
 /--------------\
```

### Test Types

| Type | Tools | Coverage Target |
|------|-------|----------------|
| Unit | Jest | 80%+ |
| Component | Jest + RTL | 70%+ |
| Integration | Jest + MSW | 60%+ |
| E2E | Playwright | Critical paths |

---

## ⚙️ SETUP

### Install Dependencies

```bash
# Testing libraries
npm install -D jest @testing-library/react @testing-library/jest-dom
npm install -D @testing-library/user-event @testing-library/hooks
npm install -D jest-environment-jsdom

# E2E
npm install -D @playwright/test

# Mocking
npm install -D msw
```

### Jest Configuration

```javascript
// jest.config.js
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  collectCoverageFrom: [
    'components/**/*.{js,jsx,ts,tsx}',
    'hooks/**/*.{js,jsx,ts,tsx}',
    'lib/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 80,
      statements: 80,
    },
  },
};

module.exports = createJestConfig(customJestConfig);
```

```javascript
// jest.setup.js
import '@testing-library/jest-dom';

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
  unobserve() {}
};

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
```

### Playwright Configuration

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

---

## 🔧 UNIT TESTS

### Testing Utilities

```typescript
// __tests__/lib/calendar-utils.test.ts
import {
  formatEventTime,
  getEventDuration,
  isEventConflict,
} from '@/lib/calendar-utils';

describe('Calendar Utils', () => {
  describe('formatEventTime', () => {
    it('formats event time correctly', () => {
      const event = {
        startTime: '2024-01-15T09:00:00Z',
        endTime: '2024-01-15T10:00:00Z',
      };

      const result = formatEventTime(event);

      expect(result).toBe('09:00 - 10:00');
    });
  });

  describe('getEventDuration', () => {
    it('calculates duration in minutes', () => {
      const event = {
        startTime: '2024-01-15T09:00:00Z',
        endTime: '2024-01-15T10:30:00Z',
      };

      const duration = getEventDuration(event);

      expect(duration).toBe(90);
    });
  });

  describe('isEventConflict', () => {
    it('detects time conflicts', () => {
      const event1 = {
        startTime: '2024-01-15T09:00:00Z',
        endTime: '2024-01-15T10:00:00Z',
      };

      const event2 = {
        startTime: '2024-01-15T09:30:00Z',
        endTime: '2024-01-15T10:30:00Z',
      };

      expect(isEventConflict(event1, event2)).toBe(true);
    });

    it('allows back-to-back events', () => {
      const event1 = {
        startTime: '2024-01-15T09:00:00Z',
        endTime: '2024-01-15T10:00:00Z',
      };

      const event2 = {
        startTime: '2024-01-15T10:00:00Z',
        endTime: '2024-01-15T11:00:00Z',
      };

      expect(isEventConflict(event1, event2)).toBe(false);
    });
  });
});
```

### Testing Hooks

```typescript
// __tests__/hooks/useCalendar.test.tsx
import { renderHook, act } from '@testing-library/react';
import { useCalendar } from '@/components/calendar';
import { CalendarProvider } from '@/components/calendar';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <CalendarProvider workspaceId="test-workspace">{children}</CalendarProvider>
);

describe('useCalendar', () => {
  it('initializes with empty events', () => {
    const { result } = renderHook(() => useCalendar(), { wrapper });

    expect(result.current.state.events).toEqual([]);
  });

  it('adds event', async () => {
    const { result } = renderHook(() => useCalendar(), { wrapper });

    const newEvent = {
      title: 'Test Event',
      type: 'workout',
      startTime: '2024-01-15T09:00:00Z',
      endTime: '2024-01-15T10:00:00Z',
    };

    await act(async () => {
      await result.current.actions.addEvent(newEvent);
    });

    expect(result.current.state.events).toHaveLength(1);
    expect(result.current.state.events[0].title).toBe('Test Event');
  });

  it('changes view mode', () => {
    const { result } = renderHook(() => useCalendar(), { wrapper });

    act(() => {
      result.current.actions.setViewMode('week');
    });

    expect(result.current.state.viewMode).toBe('week');
  });
});
```

---

## 🎨 COMPONENT TESTS

### Testing Simple Components

```typescript
// __tests__/components/StatCard.test.tsx
import { render, screen } from '@testing-library/react';
import { StatCard } from '@/components/shared/StatCard';
import { TrendingUp } from 'lucide-react';

describe('StatCard', () => {
  it('renders stat card with all props', () => {
    render(
      <StatCard
        label="Total Athletes"
        value="42"
        icon={TrendingUp}
        variant="emerald"
        trend="+5%"
      />
    );

    expect(screen.getByText('Total Athletes')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
    expect(screen.getByText('+5%')).toBeInTheDocument();
  });

  it('renders without trend', () => {
    render(
      <StatCard
        label="Total Sessions"
        value="120"
        icon={TrendingUp}
        variant="sky"
      />
    );

    expect(screen.getByText('Total Sessions')).toBeInTheDocument();
    expect(screen.queryByText(/\+/)).not.toBeInTheDocument();
  });
});
```

### Testing Interactive Components

```typescript
// __tests__/components/Calendar/MonthView.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { MonthView } from '@/components/calendar/views/MonthView';
import { CalendarProvider } from '@/components/calendar';

const mockEvents = [
  {
    id: '1',
    title: 'Morning Workout',
    type: 'workout',
    startTime: '2024-01-15T09:00:00Z',
    endTime: '2024-01-15T10:00:00Z',
    athletes: [],
    status: 'pending',
  },
];

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <CalendarProvider workspaceId="test">{children}</CalendarProvider>
);

describe('MonthView', () => {
  it('renders month grid', () => {
    render(<MonthView />, { wrapper });

    // Should have weekday headers
    expect(screen.getByText('Dom')).toBeInTheDocument();
    expect(screen.getByText('Seg')).toBeInTheDocument();
  });

  it('displays events', () => {
    render(<MonthView />, { wrapper });

    expect(screen.getByText('Morning Workout')).toBeInTheDocument();
  });

  it('opens event on click', async () => {
    const onEventClick = jest.fn();
    
    render(<MonthView onEventClick={onEventClick} />, { wrapper });

    const eventElement = screen.getByText('Morning Workout');
    fireEvent.click(eventElement);

    expect(onEventClick).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'Morning Workout' })
    );
  });

  it('navigates to next month', () => {
    render(<MonthView />, { wrapper });

    const nextButton = screen.getByLabelText('Next month');
    fireEvent.click(nextButton);

    // Month should change
    expect(screen.getByText(/Fevereiro/)).toBeInTheDocument();
  });
});
```

### Testing Modal Components

```typescript
// __tests__/components/QuickSessionModal.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QuickSessionModal } from '@/components/modals/QuickSessionModal';

describe('QuickSessionModal', () => {
  it('renders when open', () => {
    render(
      <QuickSessionModal
        isOpen={true}
        onClose={jest.fn()}
        onCreateSession={jest.fn()}
      />
    );

    expect(screen.getByText('Criar Sessão Rápida')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(
      <QuickSessionModal
        isOpen={false}
        onClose={jest.fn()}
        onCreateSession={jest.fn()}
      />
    );

    expect(screen.queryByText('Criar Sessão Rápida')).not.toBeInTheDocument();
  });

  it('submits form with valid data', async () => {
    const user = userEvent.setup();
    const onCreateSession = jest.fn();

    render(
      <QuickSessionModal
        isOpen={true}
        onClose={jest.fn()}
        onCreateSession={onCreateSession}
      />
    );

    // Fill form
    await user.type(screen.getByLabelText('Título'), 'Test Session');
    await user.selectOptions(screen.getByLabelText('Tipo'), 'workout');

    // Submit
    await user.click(screen.getByText('Criar'));

    await waitFor(() => {
      expect(onCreateSession).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Test Session',
          type: 'workout',
        })
      );
    });
  });
});
```

---

## 🔗 INTEGRATION TESTS

### Testing API Hooks

```typescript
// __tests__/integration/useCalendarEvents.test.tsx
import { renderHook, waitFor } from '@testing-library/react';
import { useCalendarEvents } from '@/hooks/use-api';
import { server } from '../mocks/server';
import { rest } from 'msw';

// Setup MSW
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('useCalendarEvents', () => {
  it('fetches events successfully', async () => {
    const { result } = renderHook(() =>
      useCalendarEvents('workspace-1', {
        startDate: '2024-01-01',
        endDate: '2024-01-31',
      })
    );

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.events).toHaveLength(3);
    expect(result.current.error).toBe(null);
  });

  it('handles API errors', async () => {
    server.use(
      rest.get('/api/calendar/events', (req, res, ctx) => {
        return res(ctx.status(500), ctx.json({ error: 'Internal error' }));
      })
    );

    const { result } = renderHook(() =>
      useCalendarEvents('workspace-1', {
        startDate: '2024-01-01',
        endDate: '2024-01-31',
      })
    );

    await waitFor(() => {
      expect(result.current.error).toBeTruthy();
    });

    expect(result.current.events).toEqual([]);
  });
});
```

### Testing Bridge Integration

```typescript
// __tests__/integration/DashboardBridge.test.tsx
import { DashboardBridge } from '@/components/calendar/integrations/DashboardBridge';

describe('DashboardBridge Integration', () => {
  let bridge: DashboardBridge;

  beforeEach(() => {
    bridge = new DashboardBridge();
  });

  afterEach(() => {
    bridge.destroy();
  });

  it('initializes successfully', async () => {
    await bridge.init();

    expect(bridge.status).toBe('active');
    expect(bridge.config.enabled).toBe(true);
  });

  it('syncs events to calendar', async () => {
    await bridge.init();

    const event = {
      id: 'event-1',
      title: 'Test Event',
      type: 'workout',
      startTime: '2024-01-15T09:00:00Z',
      endTime: '2024-01-15T10:00:00Z',
    };

    const result = await bridge.syncToCalendar({
      type: 'create',
      data: event,
      source: 'dashboard',
    });

    expect(result.success).toBe(true);
    expect(result.data).toEqual(event);
  });

  it('triggers event hooks', async () => {
    await bridge.init();

    const onEventCreated = jest.fn();
    bridge.registerHooks({ onEventCreated });

    const event = {
      id: 'event-1',
      title: 'Test Event',
      type: 'workout',
      startTime: '2024-01-15T09:00:00Z',
      endTime: '2024-01-15T10:00:00Z',
    };

    await bridge.syncToCalendar({
      type: 'create',
      data: event,
      source: 'dashboard',
    });

    expect(onEventCreated).toHaveBeenCalledWith(event, expect.any(Object));
  });
});
```

---

## 🎭 E2E TESTS

### Critical User Flows

```typescript
// e2e/calendar-workflow.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Calendar Workflow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/calendar');
  });

  test('create event flow', async ({ page }) => {
    // Click "Novo Evento"
    await page.click('text=Novo Evento');

    // Fill form
    await page.fill('input[name="title"]', 'E2E Test Event');
    await page.selectOption('select[name="type"]', 'workout');
    await page.fill('input[name="date"]', '2024-01-15');
    await page.fill('input[name="time"]', '09:00');

    // Submit
    await page.click('button:has-text("Criar")');

    // Verify event appears
    await expect(page.locator('text=E2E Test Event')).toBeVisible();
  });

  test('drag and drop event', async ({ page }) => {
    // Wait for calendar to load
    await page.waitForSelector('.calendar-grid');

    // Get event and target cell
    const event = page.locator('text=Morning Workout').first();
    const targetCell = page.locator('[data-date="2024-01-16"]');

    // Drag and drop
    await event.dragTo(targetCell);

    // Verify event moved
    const eventDate = await event
      .locator('xpath=ancestor::*[@data-date]')
      .getAttribute('data-date');
    expect(eventDate).toBe('2024-01-16');
  });

  test('filter events', async ({ page }) => {
    // Open filters
    await page.click('button:has-text("Filtros")');

    // Select type
    await page.check('input[value="workout"]');

    // Apply
    await page.click('button:has-text("Aplicar")');

    // Verify only workout events visible
    const events = page.locator('.calendar-event');
    await expect(events).toHaveCount(5);
    await expect(page.locator('.calendar-event[data-type="class"]')).toHaveCount(0);
  });

  test('SMART engine', async ({ page }) => {
    // Open SMART input
    await page.click('button:has-text("SMART")');

    // Type natural language
    await page.fill('input[placeholder*="comando"]', 'treino segunda 9h');

    // Press Enter
    await page.press('input[placeholder*="comando"]', 'Enter');

    // Verify event created
    await expect(page.locator('text=Treino')).toBeVisible();
    
    // Verify time
    const eventTime = page.locator('.calendar-event >> text=09:00');
    await expect(eventTime).toBeVisible();
  });
});
```

### Dashboard Flow

```typescript
// e2e/dashboard.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Dashboard', () => {
  test('displays KPIs', async ({ page }) => {
    await page.goto('/dashboard');

    // Wait for data to load
    await page.waitForSelector('[data-testid="stat-card"]');

    // Verify KPIs present
    await expect(page.locator('text=Atletas Ativos')).toBeVisible();
    await expect(page.locator('text=Sessões Hoje')).toBeVisible();
    await expect(page.locator('text=Próxima Sessão')).toBeVisible();
  });

  test('navigates to calendar', async ({ page }) => {
    await page.goto('/dashboard');

    // Click calendar integration section
    await page.click('button:has-text("Ver Completo")');

    // Verify navigation
    await expect(page).toHaveURL(/.*calendar/);
  });

  test('creates quick session', async ({ page }) => {
    await page.goto('/dashboard');

    // Click quick session
    await page.click('text=Criar Sessão Rápida');

    // Fill modal
    await page.fill('input[name="title"]', 'Quick E2E Session');
    
    // Submit
    await page.click('button:has-text("Criar")');

    // Verify success
    await expect(page.locator('text=Sessão criada')).toBeVisible();
  });
});
```

---

## 📊 COVERAGE

### Run Coverage

```bash
# Unit + Component + Integration
npm run test:coverage

# Generate HTML report
npm run test:coverage -- --coverage --coverageReporters=html

# Open report
open coverage/index.html
```

### Coverage Thresholds

```javascript
// jest.config.js
coverageThreshold: {
  global: {
    branches: 70,    // if/else, switch cases
    functions: 70,   // function definitions
    lines: 80,       // executable lines
    statements: 80,  // statements
  },
  // Per-file thresholds
  './components/calendar/**/*.tsx': {
    branches: 80,
    functions: 80,
    lines: 85,
    statements: 85,
  },
}
```

---

## ✅ BEST PRACTICES

### DO's

✅ **Test behavior, not implementation**
```typescript
// ✅ Good
expect(screen.getByText('Event created')).toBeInTheDocument();

// ❌ Bad
expect(component.state.events.length).toBe(1);
```

✅ **Use semantic queries**
```typescript
// ✅ Good
screen.getByRole('button', { name: 'Criar' });
screen.getByLabelText('Título');

// ❌ Bad
screen.getByTestId('create-button');
```

✅ **Test user interactions**
```typescript
// ✅ Good
await userEvent.click(screen.getByText('Submit'));
await userEvent.type(input, 'test');

// ❌ Bad
fireEvent.click(button);
```

✅ **Use waitFor for async**
```typescript
// ✅ Good
await waitFor(() => {
  expect(screen.getByText('Loaded')).toBeInTheDocument();
});

// ❌ Bad
expect(screen.getByText('Loaded')).toBeInTheDocument();
```

### DON'Ts

❌ **Don't test implementation details**
❌ **Don't use snapshots excessively**
❌ **Don't mock everything**
❌ **Don't skip cleanup**
❌ **Don't test external libraries**

---

## 🚀 RUN TESTS

### Commands

```bash
# All tests
npm test

# Watch mode
npm test -- --watch

# Specific file
npm test -- StatCard.test.tsx

# Coverage
npm run test:coverage

# E2E
npm run test:e2e

# E2E headed
npm run test:e2e -- --headed

# E2E specific browser
npm run test:e2e -- --project=chromium
```

### package.json Scripts

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:debug": "playwright test --debug"
  }
}
```

---

**Documento criado em:** 10 Janeiro 2026  
**Versão:** 1.0.0  
**Última atualização:** 11 Janeiro 2026 00:00
