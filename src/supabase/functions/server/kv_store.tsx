/**
 * KV Store Mock (Development Mode)
 * 
 * ⚠️ NOTA: Esta é uma implementação mock para desenvolvimento local
 * Para produção, usar Supabase KV ou outro serviço de storage
 */

// In-memory mock storage
const mockStore = new Map<string, any>();

/**
 * Get value from KV store
 */
export async function get(key: string): Promise<any | null> {
  return mockStore.get(key) || null;
}

/**
 * Set value in KV store
 */
export async function set(key: string, value: any): Promise<void> {
  mockStore.set(key, value);
}

/**
 * Delete value from KV store
 */
export async function del(key: string): Promise<void> {
  mockStore.delete(key);
}

/**
 * List all keys (for debugging)
 */
export async function list(): Promise<string[]> {
  return Array.from(mockStore.keys());
}

// Development mode warning
console.log('⚠️ KV Store running in MOCK mode (development only)');
