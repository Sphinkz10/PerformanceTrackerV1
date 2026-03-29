/**
 * WEEK 1 API TESTS - AUTOMATED TESTING SUITE
 * 
 * Tests for:
 * - Task 1.4: GET /api/athletes (with filters)
 * - Task 1.5: POST /api/sessions/[id]/snapshot
 * - Task 1.6: GET /api/athletes/[id]/metrics
 * - Task 1.1-1.3: New APIs (Personal Records, Metrics, Metric Packs)
 * 
 * @author PerformTrack Team
 * @since Semana 1 - Backend Essencial
 */

// ============================================================================
// TEST CONFIGURATION
// ============================================================================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const TEST_DATA = {
  workspaceId: 'test-workspace-123',
  athleteId: 'test-athlete-123',
  sessionId: 'test-session-123',
  metricId: 'test-metric-123',
  packId: 'test-pack-123',
  recordId: 'test-record-123',
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

async function testAPI(config: {
  name: string;
  method: string;
  url: string;
  body?: any;
  expectedStatus: number;
  validateResponse?: (data: any) => boolean;
}) {
  console.log(`\n🧪 Testing: ${config.name}`);
  console.log(`   ${config.method} ${config.url}`);

  try {
    const options: RequestInit = {
      method: config.method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (config.body) {
      options.body = JSON.stringify(config.body);
    }

    const response = await fetch(config.url, options);
    const data = await response.json();

    // Check status
    if (response.status !== config.expectedStatus) {
      console.error(`   ❌ FAIL: Expected status ${config.expectedStatus}, got ${response.status}`);
      console.error(`   Response:`, data);
      return false;
    }

    // Validate response
    if (config.validateResponse && !config.validateResponse(data)) {
      console.error(`   ❌ FAIL: Response validation failed`);
      console.error(`   Response:`, data);
      return false;
    }

    console.log(`   ✅ PASS`);
    return true;
  } catch (error: any) {
    console.error(`   ❌ ERROR: ${error.message}`);
    return false;
  }
}

// ============================================================================
// TASK 1.4: TEST GET /api/athletes WITH FILTERS
// ============================================================================

async function testAthletesAPI() {
  console.log('\n\n═══════════════════════════════════════════════════════');
  console.log('TASK 1.4: Testing GET /api/athletes with filters');
  console.log('═══════════════════════════════════════════════════════');

  const tests = [
    {
      name: 'List all athletes (no filters)',
      method: 'GET',
      url: `${API_BASE_URL}/api/athletes?workspaceId=${TEST_DATA.workspaceId}`,
      expectedStatus: 200,
      validateResponse: (data: any) => {
        return data.athletes !== undefined && Array.isArray(data.athletes);
      },
    },
    {
      name: 'Filter by isActive=true',
      method: 'GET',
      url: `${API_BASE_URL}/api/athletes?workspaceId=${TEST_DATA.workspaceId}&isActive=true`,
      expectedStatus: 200,
      validateResponse: (data: any) => {
        return data.athletes !== undefined && data.athletes.every((a: any) => a.is_active === true);
      },
    },
    {
      name: 'Filter by isActive=false',
      method: 'GET',
      url: `${API_BASE_URL}/api/athletes?workspaceId=${TEST_DATA.workspaceId}&isActive=false`,
      expectedStatus: 200,
      validateResponse: (data: any) => {
        return data.athletes !== undefined;
      },
    },
    {
      name: 'Missing workspaceId (should fail)',
      method: 'GET',
      url: `${API_BASE_URL}/api/athletes`,
      expectedStatus: 400,
      validateResponse: (data: any) => {
        return data.error !== undefined;
      },
    },
  ];

  let passed = 0;
  for (const test of tests) {
    if (await testAPI(test)) {
      passed++;
    }
  }

  console.log(`\n📊 Result: ${passed}/${tests.length} tests passed`);
  return passed === tests.length;
}

// ============================================================================
// TASK 1.5: TEST POST /api/sessions/[id]/snapshot
// ============================================================================

async function testSessionSnapshotAPI() {
  console.log('\n\n═══════════════════════════════════════════════════════');
  console.log('TASK 1.5: Testing POST /api/sessions/[id]/snapshot');
  console.log('═══════════════════════════════════════════════════════');

  const tests = [
    {
      name: 'Create session snapshot with valid data',
      method: 'POST',
      url: `${API_BASE_URL}/api/sessions/${TEST_DATA.sessionId}/snapshot`,
      body: {
        snapshotData: {
          workout: {
            id: 'workout-123',
            name: 'Test Workout',
            exercises: [
              {
                id: 'exercise-1',
                name: 'Squat',
                sets: [
                  { reps: 10, weight: 100, rpe: 7 },
                  { reps: 8, weight: 110, rpe: 8 },
                ],
              },
            ],
          },
          athletes: [
            {
              id: TEST_DATA.athleteId,
              name: 'Test Athlete',
              performance: {
                totalVolume: 1880,
                avgRpe: 7.5,
                duration: 3600,
              },
            },
          ],
        },
        completedAt: new Date().toISOString(),
        userId: 'test-user-123',
      },
      expectedStatus: 200,
      validateResponse: (data: any) => {
        return data.success === true && data.snapshot !== undefined;
      },
    },
    {
      name: 'Missing snapshotData (should fail)',
      method: 'POST',
      url: `${API_BASE_URL}/api/sessions/${TEST_DATA.sessionId}/snapshot`,
      body: {
        completedAt: new Date().toISOString(),
      },
      expectedStatus: 400,
      validateResponse: (data: any) => {
        return data.error !== undefined;
      },
    },
    {
      name: 'Missing completedAt (should fail)',
      method: 'POST',
      url: `${API_BASE_URL}/api/sessions/${TEST_DATA.sessionId}/snapshot`,
      body: {
        snapshotData: {},
      },
      expectedStatus: 400,
      validateResponse: (data: any) => {
        return data.error !== undefined;
      },
    },
  ];

  let passed = 0;
  for (const test of tests) {
    if (await testAPI(test)) {
      passed++;
    }
  }

  console.log(`\n📊 Result: ${passed}/${tests.length} tests passed`);
  return passed === tests.length;
}

// ============================================================================
// TASK 1.6: TEST GET /api/athletes/[id]/metrics
// ============================================================================

async function testAthleteMetricsAPI() {
  console.log('\n\n═══════════════════════════════════════════════════════');
  console.log('TASK 1.6: Testing GET /api/athletes/[id]/metrics');
  console.log('═══════════════════════════════════════════════════════');

  const tests = [
    {
      name: 'Get athlete metrics',
      method: 'GET',
      url: `${API_BASE_URL}/api/athletes/${TEST_DATA.athleteId}/metrics`,
      expectedStatus: 200,
      validateResponse: (data: any) => {
        return data.metrics !== undefined && Array.isArray(data.metrics);
      },
    },
    {
      name: 'Filter by category',
      method: 'GET',
      url: `${API_BASE_URL}/api/athletes/${TEST_DATA.athleteId}/metrics?category=biological`,
      expectedStatus: 200,
      validateResponse: (data: any) => {
        return data.metrics !== undefined;
      },
    },
    {
      name: 'Get metrics with date range',
      method: 'GET',
      url: `${API_BASE_URL}/api/athletes/${TEST_DATA.athleteId}/metrics?startDate=2024-01-01&endDate=2024-12-31`,
      expectedStatus: 200,
      validateResponse: (data: any) => {
        return data.metrics !== undefined;
      },
    },
  ];

  let passed = 0;
  for (const test of tests) {
    if (await testAPI(test)) {
      passed++;
    }
  }

  console.log(`\n📊 Result: ${passed}/${tests.length} tests passed`);
  return passed === tests.length;
}

// ============================================================================
// NEW APIS: TEST PERSONAL RECORDS
// ============================================================================

async function testPersonalRecordsAPI() {
  console.log('\n\n═══════════════════════════════════════════════════════');
  console.log('TASK 1.1: Testing Personal Records API');
  console.log('═══════════════════════════════════════════════════════');

  const tests = [
    {
      name: 'List athlete records',
      method: 'GET',
      url: `${API_BASE_URL}/api/athletes/${TEST_DATA.athleteId}/records`,
      expectedStatus: 200,
      validateResponse: (data: any) => {
        return data.records !== undefined && data.grouped !== undefined;
      },
    },
    {
      name: 'Filter records by category',
      method: 'GET',
      url: `${API_BASE_URL}/api/athletes/${TEST_DATA.athleteId}/records?category=strength`,
      expectedStatus: 200,
      validateResponse: (data: any) => {
        return data.records !== undefined;
      },
    },
    {
      name: 'Create new personal record',
      method: 'POST',
      url: `${API_BASE_URL}/api/athletes/${TEST_DATA.athleteId}/records`,
      body: {
        workspaceId: TEST_DATA.workspaceId,
        metricName: 'back_squat',
        displayName: 'Back Squat',
        category: 'strength',
        value: 150,
        unit: 'kg',
        achievedAt: new Date().toISOString(),
        source: 'session',
        sourceId: TEST_DATA.sessionId,
        notes: 'New PR!',
        createdBy: 'test-user-123',
      },
      expectedStatus: 201,
      validateResponse: (data: any) => {
        return data.success === true && data.record !== undefined;
      },
    },
    {
      name: 'Update personal record',
      method: 'PUT',
      url: `${API_BASE_URL}/api/athletes/${TEST_DATA.athleteId}/records/${TEST_DATA.recordId}`,
      body: {
        displayName: 'Back Squat Updated',
        notes: 'Updated notes',
        updatedBy: 'test-user-123',
      },
      expectedStatus: 200,
      validateResponse: (data: any) => {
        return data.success === true && data.record !== undefined;
      },
    },
    {
      name: 'Invalidate personal record',
      method: 'DELETE',
      url: `${API_BASE_URL}/api/athletes/${TEST_DATA.athleteId}/records/${TEST_DATA.recordId}?reason=Test invalidation`,
      expectedStatus: 200,
      validateResponse: (data: any) => {
        return data.success === true && data.record.status === 'invalidated';
      },
    },
  ];

  let passed = 0;
  for (const test of tests) {
    if (await testAPI(test)) {
      passed++;
    }
  }

  console.log(`\n📊 Result: ${passed}/${tests.length} tests passed`);
  return passed === tests.length;
}

// ============================================================================
// NEW APIS: TEST METRICS
// ============================================================================

async function testMetricsAPI() {
  console.log('\n\n═══════════════════════════════════════════════════════');
  console.log('TASK 1.2: Testing Metrics API');
  console.log('═══════════════════════════════════════════════════════');

  const tests = [
    {
      name: 'List metrics',
      method: 'GET',
      url: `${API_BASE_URL}/api/metrics?workspaceId=${TEST_DATA.workspaceId}`,
      expectedStatus: 200,
      validateResponse: (data: any) => {
        return data.metrics !== undefined && data.grouped !== undefined;
      },
    },
    {
      name: 'Filter metrics by category',
      method: 'GET',
      url: `${API_BASE_URL}/api/metrics?workspaceId=${TEST_DATA.workspaceId}&category=performance`,
      expectedStatus: 200,
      validateResponse: (data: any) => {
        return data.metrics !== undefined;
      },
    },
    {
      name: 'Create new metric',
      method: 'POST',
      url: `${API_BASE_URL}/api/metrics`,
      body: {
        workspaceId: TEST_DATA.workspaceId,
        name: 'test_hrv',
        displayName: 'Test HRV',
        description: 'Heart Rate Variability Test',
        category: 'biological',
        unit: 'ms',
        type: 'numeric',
        tags: ['dashboard', 'critical'],
        createdBy: 'test-user-123',
      },
      expectedStatus: 201,
      validateResponse: (data: any) => {
        return data.success === true && data.metric !== undefined && data.metric.aggregation_method === 'max';
      },
    },
    {
      name: 'Get metric details',
      method: 'GET',
      url: `${API_BASE_URL}/api/metrics/${TEST_DATA.metricId}`,
      expectedStatus: 200,
      validateResponse: (data: any) => {
        return data.metric !== undefined && data.usage !== undefined;
      },
    },
    {
      name: 'Update metric',
      method: 'PUT',
      url: `${API_BASE_URL}/api/metrics/${TEST_DATA.metricId}`,
      body: {
        displayName: 'Updated Test HRV',
        description: 'Updated description',
        updatedBy: 'test-user-123',
      },
      expectedStatus: 200,
      validateResponse: (data: any) => {
        return data.success === true && data.metric !== undefined;
      },
    },
    {
      name: 'Deactivate metric',
      method: 'DELETE',
      url: `${API_BASE_URL}/api/metrics/${TEST_DATA.metricId}`,
      expectedStatus: 200,
      validateResponse: (data: any) => {
        return data.success === true && data.metric.is_active === false;
      },
    },
  ];

  let passed = 0;
  for (const test of tests) {
    if (await testAPI(test)) {
      passed++;
    }
  }

  console.log(`\n📊 Result: ${passed}/${tests.length} tests passed`);
  return passed === tests.length;
}

// ============================================================================
// NEW APIS: TEST METRIC PACKS
// ============================================================================

async function testMetricPacksAPI() {
  console.log('\n\n═══════════════════════════════════════════════════════');
  console.log('TASK 1.3: Testing Metric Packs API');
  console.log('═══════════════════════════════════════════════════════');

  const tests = [
    {
      name: 'List metric packs',
      method: 'GET',
      url: `${API_BASE_URL}/api/metric-packs?workspaceId=${TEST_DATA.workspaceId}`,
      expectedStatus: 200,
      validateResponse: (data: any) => {
        return data.packs !== undefined && Array.isArray(data.packs);
      },
    },
    {
      name: 'List packs with metrics',
      method: 'GET',
      url: `${API_BASE_URL}/api/metric-packs?workspaceId=${TEST_DATA.workspaceId}&includeMetrics=true`,
      expectedStatus: 200,
      validateResponse: (data: any) => {
        return data.packs !== undefined;
      },
    },
    {
      name: 'Create new metric pack',
      method: 'POST',
      url: `${API_BASE_URL}/api/metric-packs`,
      body: {
        workspaceId: TEST_DATA.workspaceId,
        name: 'Test Pack',
        description: 'Test metric pack',
        category: 'performance',
        icon: 'Activity',
        color: 'sky',
        metricIds: [TEST_DATA.metricId],
        createdBy: 'test-user-123',
      },
      expectedStatus: 201,
      validateResponse: (data: any) => {
        return data.success === true && data.pack !== undefined;
      },
    },
    {
      name: 'Get pack details',
      method: 'GET',
      url: `${API_BASE_URL}/api/metric-packs/${TEST_DATA.packId}?workspaceId=${TEST_DATA.workspaceId}`,
      expectedStatus: 200,
      validateResponse: (data: any) => {
        return data.pack !== undefined && data.metricsCount !== undefined;
      },
    },
    {
      name: 'Update metric pack',
      method: 'PUT',
      url: `${API_BASE_URL}/api/metric-packs/${TEST_DATA.packId}`,
      body: {
        name: 'Updated Test Pack',
        description: 'Updated description',
        addMetricIds: ['new-metric-1'],
        updatedBy: 'test-user-123',
      },
      expectedStatus: 200,
      validateResponse: (data: any) => {
        return data.success === true && data.pack !== undefined;
      },
    },
    {
      name: 'Deactivate metric pack',
      method: 'DELETE',
      url: `${API_BASE_URL}/api/metric-packs/${TEST_DATA.packId}`,
      expectedStatus: 200,
      validateResponse: (data: any) => {
        return data.success === true && data.pack.is_active === false;
      },
    },
  ];

  let passed = 0;
  for (const test of tests) {
    if (await testAPI(test)) {
      passed++;
    }
  }

  console.log(`\n📊 Result: ${passed}/${tests.length} tests passed`);
  return passed === tests.length;
}

// ============================================================================
// MAIN TEST RUNNER
// ============================================================================

async function runAllTests() {
  console.log('╔═══════════════════════════════════════════════════════╗');
  console.log('║     PERFORMTRACK - WEEK 1 API TESTS                  ║');
  console.log('╚═══════════════════════════════════════════════════════╝');
  console.log(`\n🔗 API Base URL: ${API_BASE_URL}`);
  console.log(`📅 Test Date: ${new Date().toISOString()}\n`);

  const results: Record<string, boolean> = {};

  // Run all test suites
  results['Athletes API'] = await testAthletesAPI();
  results['Session Snapshot API'] = await testSessionSnapshotAPI();
  results['Athlete Metrics API'] = await testAthleteMetricsAPI();
  results['Personal Records API'] = await testPersonalRecordsAPI();
  results['Metrics API'] = await testMetricsAPI();
  results['Metric Packs API'] = await testMetricPacksAPI();

  // Summary
  console.log('\n\n╔═══════════════════════════════════════════════════════╗');
  console.log('║     FINAL SUMMARY                                     ║');
  console.log('╚═══════════════════════════════════════════════════════╝\n');

  const passed = Object.values(results).filter(r => r).length;
  const total = Object.keys(results).length;

  Object.entries(results).forEach(([name, result]) => {
    const status = result ? '✅ PASS' : '❌ FAIL';
    console.log(`${status}  ${name}`);
  });

  console.log(`\n📊 Overall: ${passed}/${total} test suites passed`);
  
  if (passed === total) {
    console.log('\n🎉 ALL TESTS PASSED! Week 1 APIs are ready.');
  } else {
    console.log('\n⚠️  Some tests failed. Review errors above.');
  }

  return passed === total;
}

// Export for use
export { runAllTests, testAthletesAPI, testSessionSnapshotAPI, testAthleteMetricsAPI, testPersonalRecordsAPI, testMetricsAPI, testMetricPacksAPI };

// Run if called directly
if (require.main === module) {
  runAllTests().then(success => {
    process.exit(success ? 0 : 1);
  });
}
