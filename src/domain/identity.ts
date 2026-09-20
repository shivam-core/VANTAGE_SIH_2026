export async function generateId(parts: (string | number | boolean | null)[]): Promise<string> {
  const json = JSON.stringify(parts, (_key, value) => {
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      return Object.keys(value).sort().reduce((sorted: Record<string, any>, k) => {
        sorted[k] = value[k];
        return sorted;
      }, {});
    }
    return value;
  });
  
  const encoder = new TextEncoder();
  const data = encoder.encode(json);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  return hashHex;
}

export function truncateId(id: string): string {
  return id.substring(0, 12);
}
