const DEFAULT_API_BASE_URL = 'http://127.0.0.1:3001/api';

// Allow override for debugging (e.g., http://localhost:3001/api)
export const API_BASE_URL =
  typeof process !== 'undefined' && process.env && process.env.EXPO_PUBLIC_API_BASE_URL
    ? process.env.EXPO_PUBLIC_API_BASE_URL
    : DEFAULT_API_BASE_URL;

async function readJsonSafely(res) {
  const text = await res.text();
  try {
    return text ? JSON.parse(text) : null;
  } catch {
    return text;
  }
}

export async function apiRequest(path, options = {}) {
  const url = `${API_BASE_URL}${path}`;
  const headers = {
    Accept: 'application/json',
    ...(options.headers || {}),
  };

  const timeoutMs = typeof options.timeoutMs === 'number' ? options.timeoutMs : 5000;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  let res;
  try {
    res = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }

  const data = await readJsonSafely(res);

  if (!res.ok) {
    const message =
      data && typeof data === 'object' && data.error
        ? data.error
        : `Request failed: ${res.status}`;
    const err = new Error(message);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}
