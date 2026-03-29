import http from 'k6/http';
import { check, sleep } from 'k6';

// Test configuration: Ramp up to 50 users over 30s, hold for 1m, ramp down over 30s
export const options = {
  stages: [
    { duration: '10s', target: 20 }, // Ramp-up to 20 users
    { duration: '30s', target: 50 }, // Stress with 50 users
    { duration: '10s', target: 0 },  // Ramp-down to 0 users
  ],
  thresholds: {
    // 95% of requests must complete below 500ms
    http_req_duration: ['p(95)<500'],
    // Less than 1% of requests can fail
    http_req_failed: ['rate<0.01'],
  },
};

const BASE_URL = __ENV.TARGET_URL || 'http://localhost:5173';

export default function () {
  // 1. Visit the main SPA entrypoint (Home)
  const homeRes = http.get(`${BASE_URL}/`);
  check(homeRes, {
    'Home page loaded': (r) => r.status === 200,
    'Is HTML': (r) => r.headers['Content-Type'] && r.headers['Content-Type'].includes('text/html'),
  });

  sleep(1);

  // 2. Visit static compliance pages (LGPD validation)
  const privacyRes = http.get(`${BASE_URL}/privacy`);
  check(privacyRes, {
    'Privacy page loaded': (r) => r.status === 200,
  });

  sleep(1);

  // 3. Simulate an unauthenticated API call attempt (expecting 400/401, not 500)
  // This validates our resilience boundaries under load
  const apiRes = http.get(`${BASE_URL}/api/metric-updates`);
  check(apiRes, {
    'API boundary holds (401 or 404)': (r) => r.status === 401 || r.status === 404,
  });

  sleep(2);
}
