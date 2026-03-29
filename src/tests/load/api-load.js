import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

const errorRate = new Rate('errors');

export const options = {
  stages: [
    { duration: '1m', target: 50 },   // Ramp up to 50 RPS
    { duration: '3m', target: 50 },   // Stay at 50 RPS
    { duration: '1m', target: 100 },  // Spike to 100 RPS
    { duration: '2m', target: 100 },  // Stay at 100 RPS
    { duration: '1m', target: 0 },    // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(99)<1000'], // 99% of requests < 1s
    http_req_failed: ['rate<0.02'],    // Error rate < 2%
    errors: ['rate<0.05'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';
const WORKSPACE_ID = 'workspace-demo';

export default function () {
  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // Test athletes API
  let res = http.get(
    `${BASE_URL}/api/athletes?workspaceId=${WORKSPACE_ID}`,
    params
  );
  check(res, {
    'athletes API status 200': (r) => r.status === 200,
    'athletes API <300ms': (r) => r.timings.duration < 300,
    'athletes API has data': (r) => r.json('athletes') !== undefined,
  }) || errorRate.add(1);

  sleep(0.5);

  // Test calendar events API
  const today = new Date().toISOString();
  const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
  
  res = http.get(
    `${BASE_URL}/api/calendar-events?workspaceId=${WORKSPACE_ID}&startDate=${today}&endDate=${nextWeek}`,
    params
  );
  check(res, {
    'calendar API status 200': (r) => r.status === 200,
    'calendar API <400ms': (r) => r.timings.duration < 400,
    'calendar API has events': (r) => r.json('events') !== undefined,
  }) || errorRate.add(1);

  sleep(0.5);

  // Test metrics API
  res = http.get(
    `${BASE_URL}/api/metrics?workspaceId=${WORKSPACE_ID}`,
    params
  );
  check(res, {
    'metrics API status 200': (r) => r.status === 200,
    'metrics API <300ms': (r) => r.timings.duration < 300,
  }) || errorRate.add(1);

  sleep(0.5);

  // Test workouts API
  res = http.get(
    `${BASE_URL}/api/workouts?workspaceId=${WORKSPACE_ID}`,
    params
  );
  check(res, {
    'workouts API status 200': (r) => r.status === 200,
    'workouts API <300ms': (r) => r.timings.duration < 300,
  }) || errorRate.add(1);

  sleep(1);
}
