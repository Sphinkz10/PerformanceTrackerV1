import http from 'k6/http';
import { check, sleep } from 'k6';

// Spike test: sudden traffic increase
export const options = {
  stages: [
    { duration: '10s', target: 10 },   // Baseline
    { duration: '10s', target: 200 },  // SPIKE!
    { duration: '30s', target: 200 },  // Stay at spike
    { duration: '10s', target: 10 },   // Recovery
    { duration: '30s', target: 10 },   // Baseline again
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'], // More lenient during spike
    http_req_failed: ['rate<0.05'],    // Allow 5% errors during spike
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

export default function () {
  const res = http.get(`${BASE_URL}/`);
  
  check(res, {
    'status is 200': (r) => r.status === 200,
  });
  
  sleep(1);
}
