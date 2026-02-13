// API client for TanStack Query hooks
// Generated from Canon schema — replace with your own fetch wrapper

export interface ApiClientConfig {
  baseUrl: string;
  headers?: Record<string, string>;
}

let config: ApiClientConfig = { baseUrl: '/api' };

export function configureApiClient(c: ApiClientConfig): void {
  config = c;
}

export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${config.baseUrl}${path}`, {
    headers: { 'Accept': 'application/json', ...config.headers },
  });
  if (!res.ok) throw new Error(`GET ${path}: ${res.status} ${res.statusText}`);
  return res.json();
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${config.baseUrl}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', ...config.headers },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`POST ${path}: ${res.status} ${res.statusText}`);
  return res.json();
}

export async function apiPut<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${config.baseUrl}${path}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', ...config.headers },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`PUT ${path}: ${res.status} ${res.statusText}`);
  return res.json();
}

export async function apiDelete(path: string): Promise<void> {
  const res = await fetch(`${config.baseUrl}${path}`, {
    method: 'DELETE',
    headers: { 'Accept': 'application/json', ...config.headers },
  });
  if (!res.ok) throw new Error(`DELETE ${path}: ${res.status} ${res.statusText}`);
}
