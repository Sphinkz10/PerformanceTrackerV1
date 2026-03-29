
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
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function saveWorkspaceId() {
    try {
        const { data, error } = await supabase.from('workspaces').select('id, name').limit(1);

        if (data && data.length > 0) {
            const id = data[0].id;
            console.log('Writing ID to file:', id);
            fs.writeFileSync('valid_workspace_id.txt', id);
        } else {
            console.log('No workspaces found.');
        }
    } catch (err) {
        console.error('Error:', err);
    }
}

saveWorkspaceId();
