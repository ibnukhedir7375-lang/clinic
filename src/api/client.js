// Small fetch wrapper: adds the JWT, parses JSON and turns error responses
// into ApiError so components can show `error.message` / `error.fields`.
const BASE_URL = import.meta.env.VITE_API_URL ?? "/api";
const TOKEN_KEY = "clinic.token";

export const tokenStorage = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

export class ApiError extends Error {
  constructor(message, status, fields = {}) {
    super(message);
    this.status = status;
    this.fields = fields; // { fieldName: ["message", ...] } from the server's zod validation
  }
}

// AuthProvider registers a callback here so an expired token logs the user out.
let handleUnauthorized = () => {};
export function onUnauthorized(callback) {
  handleUnauthorized = callback;
}

export async function api(path, { method = "GET", body } = {}) {
  const token = tokenStorage.get();
  const headers = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (token) headers.Authorization = `Bearer ${token}`;

  let response;
  try {
    response = await fetch(BASE_URL + path, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new ApiError("Can't reach the server. Is the API running?", 0);
  }

  const data = response.status === 204 ? null : await response.json().catch(() => null);

  if (!response.ok) {
    if (response.status === 401 && token) handleUnauthorized();
    throw new ApiError(data?.message ?? `Request failed (${response.status})`, response.status, data?.errors);
  }
  return data;
}
