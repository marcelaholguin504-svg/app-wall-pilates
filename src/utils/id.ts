export function generateId(prefix = "id"): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

   export function generateUUID(): string {
     return crypto.randomUUID();
   }
