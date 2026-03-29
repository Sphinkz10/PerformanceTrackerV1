/**
 * Setup Validation Script
 * 
 * Validates that Supabase is properly configured and accessible.
 * Run with: npx ts-node scripts/validate-setup.ts
 */

import { createClient } from '@supabase/supabase-js';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

const log = {
  success: (msg: string) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg: string) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  warning: (msg: string) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  info: (msg: string) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
  header: (msg: string) => console.log(`\n${colors.cyan}${'='.repeat(60)}\n${msg}\n${'='.repeat(60)}${colors.reset}\n`),
};

async function validateSetup() {
  log.header('🔍 PERFORMTRACK - SETUP VALIDATION');

  let errors = 0;
  let warnings = 0;

  // ========================================
  // 1. Check Environment Variables
  // ========================================
  log.info('Checking environment variables...');

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;

  if (!supabaseUrl) {
    log.error('NEXT_PUBLIC_SUPABASE_URL is not set');
    errors++;
  } else {
    log.success(`SUPABASE_URL: ${supabaseUrl}`);
  }

  if (!supabaseAnonKey) {
    log.error('NEXT_PUBLIC_SUPABASE_ANON_KEY is not set');
    errors++;
  } else {
    log.success('SUPABASE_ANON_KEY is set');
  }

  if (!supabaseServiceKey) {
    log.warning('SUPABASE_SERVICE_KEY is not set (needed for admin operations)');
    warnings++;
  } else {
    log.success('SUPABASE_SERVICE_KEY is set');
  }

  if (!appUrl) {
    log.warning('NEXT_PUBLIC_APP_URL is not set (defaulting to localhost:3000)');
    warnings++;
  } else {
    log.success(`APP_URL: ${appUrl}`);
  }

  if (errors > 0) {
    log.error('\nEnvironment variables validation FAILED');
    log.info('Create .env.local file with required variables');
    log.info('See .env.local.example for template');
    return;
  }

  // ========================================
  // 2. Test Supabase Connection
  // ========================================
  log.header('🔌 Testing Supabase Connection');

  const supabase = createClient(supabaseUrl!, supabaseAnonKey!);

  try {
    // Test connection with a simple query
    const { data, error } = await supabase.from('workspaces').select('count').limit(1);

    if (error) {
      log.error(`Connection failed: ${error.message}`);
      
      if (error.message.includes('relation') || error.message.includes('does not exist')) {
        log.warning('Database tables do not exist');
        log.info('Run migrations: See SETUP_GUIDE.md Step 4');
      }
      
      errors++;
    } else {
      log.success('Connected to Supabase successfully!');
    }
  } catch (error: any) {
    log.error(`Connection error: ${error.message}`);
    errors++;
  }

  // ========================================
  // 3. Check Required Tables
  // ========================================
  log.header('📊 Checking Database Tables');

  const requiredTables = [
    'workspaces',
    'users',
    'athletes',
    'calendar_events',
    'metrics',
    'metric_updates',
    'sessions',
  ];

  for (const table of requiredTables) {
    try {
      const { error } = await supabase.from(table).select('count').limit(1);

      if (error) {
        if (error.message.includes('relation') || error.message.includes('does not exist')) {
          log.error(`Table '${table}' does not exist`);
          errors++;
        } else {
          log.warning(`Table '${table}' check failed: ${error.message}`);
          warnings++;
        }
      } else {
        log.success(`Table '${table}' exists`);
      }
    } catch (error: any) {
      log.error(`Failed to check table '${table}': ${error.message}`);
      errors++;
    }
  }

  if (errors > 0) {
    log.error('\n❌ Tables validation FAILED');
    log.info('Run migrations: See SETUP_GUIDE.md Step 4');
    return;
  }

  // ========================================
  // 4. Check Seed Data
  // ========================================
  log.header('🌱 Checking Seed Data');

  // Check workspaces
  try {
    const { data: workspaces, error } = await supabase
      .from('workspaces')
      .select('id, name')
      .limit(5);

    if (error) {
      log.error(`Failed to query workspaces: ${error.message}`);
      errors++;
    } else if (!workspaces || workspaces.length === 0) {
      log.warning('No workspaces found');
      log.info('Run seed script: See SETUP_GUIDE.md Step 5');
      warnings++;
    } else {
      log.success(`Found ${workspaces.length} workspace(s)`);
      workspaces.forEach(w => log.info(`  - ${w.name} (${w.id})`));
    }
  } catch (error: any) {
    log.error(`Failed to check workspaces: ${error.message}`);
    errors++;
  }

  // Check users
  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('id, email, role')
      .limit(5);

    if (error) {
      log.error(`Failed to query users: ${error.message}`);
      errors++;
    } else if (!users || users.length === 0) {
      log.warning('No users found in database');
      log.info('Create users: See SETUP_GUIDE.md Step 6');
      warnings++;
    } else {
      log.success(`Found ${users.length} user(s)`);
      users.forEach(u => log.info(`  - ${u.email} (${u.role})`));
    }
  } catch (error: any) {
    log.error(`Failed to check users: ${error.message}`);
    errors++;
  }

  // Check athletes
  try {
    const { data: athletes, error } = await supabase
      .from('athletes')
      .select('id, name')
      .limit(5);

    if (error) {
      log.error(`Failed to query athletes: ${error.message}`);
      errors++;
    } else if (!athletes || athletes.length === 0) {
      log.warning('No athletes found');
      log.info('This is OK if you just setup the database');
      warnings++;
    } else {
      log.success(`Found ${athletes.length} athlete(s)`);
      athletes.forEach(a => log.info(`  - ${a.name}`));
    }
  } catch (error: any) {
    log.error(`Failed to check athletes: ${error.message}`);
    errors++;
  }

  // ========================================
  // 5. Check Auth Users
  // ========================================
  log.header('🔐 Checking Authentication');

  // We can't directly query auth.users with anon key
  // But we can test sign in with demo credentials
  log.info('Testing authentication...');
  
  try {
    // Try to get session (will be null if not logged in, but shouldn't error)
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      log.error(`Auth check failed: ${error.message}`);
      errors++;
    } else {
      if (session) {
        log.success('Active session found');
        log.info(`  User: ${session.user.email}`);
      } else {
        log.info('No active session (this is OK)');
        log.info('Test login at: http://localhost:3000/login');
      }
    }
  } catch (error: any) {
    log.error(`Auth check error: ${error.message}`);
    errors++;
  }

  // ========================================
  // FINAL REPORT
  // ========================================
  log.header('📋 VALIDATION REPORT');

  if (errors === 0 && warnings === 0) {
    log.success('🎉 ALL CHECKS PASSED! Setup is complete!');
    log.info('\nNext steps:');
    log.info('1. Start dev server: npm run dev');
    log.info('2. Go to: http://localhost:3000');
    log.info('3. Test login with demo credentials');
    log.info('4. Check PLANO_ACAO_PRODUCAO.md for Day 2 tasks');
  } else if (errors === 0) {
    log.warning(`⚠️  Setup is functional but has ${warnings} warning(s)`);
    log.info('\nYou can proceed, but consider fixing warnings');
  } else {
    log.error(`❌ Setup validation FAILED with ${errors} error(s) and ${warnings} warning(s)`);
    log.info('\nFix the errors above and run validation again');
    log.info('See SETUP_GUIDE.md for detailed instructions');
  }

  console.log('\n');
  process.exit(errors > 0 ? 1 : 0);
}

// Run validation
validateSetup().catch((error) => {
  log.error(`Validation script failed: ${error.message}`);
  console.error(error);
  process.exit(1);
});
