
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const envPath = path.resolve(__dirname, '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
        env[key.trim()] = value.trim();
    }
});

const SUPABASE_URL = env.VITE_SUPABASE_URL;
const SUPABASE_KEY = env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function listWorkspaces() {
    console.log('Fetching valid workspaces...');
    try {
        const { data, error } = await supabase.from('workspaces').select('id, name');
        if (error) {
            console.error('❌ Error fetching workspaces:', error.message);
        } else {
            console.log('✅ Valid Workspaces found:', data);
            if (data.length > 0) {
                console.log('👉 Please use this ID in App.tsx:', data[0].id);
            } else {
                console.log('⚠️ No workspaces found! You need to create one first.');
            }
        }
    } catch (err) {
        console.error('❌ Unexpected Error:', err);
    }
}

listWorkspaces();
