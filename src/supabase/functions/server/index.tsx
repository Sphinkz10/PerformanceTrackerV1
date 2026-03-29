/**
 * Supabase Edge Function - Form Submissions API
 * 
 * ⚠️ NOTA: Esta função está em modo mock/desenvolvimento
 * Para produção, configurar propriamente as credenciais do Supabase
 * 
 * Status: Development Mode (sem deploy)
 */

// Simple export to prevent deployment errors
export default {
  fetch: () => new Response(
    JSON.stringify({ 
      status: 'development',
      message: 'Edge function running in local mode. Configure Supabase credentials for production.',
      error: 'Not deployed - running locally'
    }),
    { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    }
  )
};
