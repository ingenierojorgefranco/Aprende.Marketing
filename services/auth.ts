// services/auth.ts

// Helper robusto para obtener la URL base del backend
const getApiBaseUrl = (): string => {
  // import.meta puede no estar definido en algunos entornos
  const anyImportMeta = import.meta as any;

  const env = anyImportMeta?.env || {};

  if (env.VITE_API_URL) {
    return env.VITE_API_URL as string;
  }

  // fallback razonable: mismo host + /api
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/api`;
  }

  return '/api';
};

const API_URL = getApiBaseUrl();

// -----------------------------
// Manejo del token en localStorage
// -----------------------------
const TOKEN_KEY = 'plataformadeventacom_token';

export const authStorage = {
  getToken: (): string | null => localStorage.getItem(TOKEN_KEY),
  setToken: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  clearToken: () => localStorage.removeItem(TOKEN_KEY),
};

// -----------------------------
// Tipos
// -----------------------------
export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface LoginResponse {
  user: AuthUser;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

// -----------------------------
// LOGIN REAL
// -----------------------------
export const login = async (
  credentials: LoginCredentials
): Promise<LoginResponse> => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || 'Error de login');
  }

  const data = (await res.json()) as LoginResponse;

  // Guardar token en localStorage
  authStorage.setToken(data.token);

  return data;
};

// -----------------------------
// REGISTRO REAL (opcional)
// -----------------------------
export const register = async (payload: {
  name: string;
  email: string;
  password: string;
  role?: string;
}): Promise<LoginResponse> => {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || 'Error creando usuario');
  }

  const data = (await res.json()) as LoginResponse;

  authStorage.setToken(data.token);

  return data;
};

// -----------------------------
// OBTENER SESIÓN ACTIVA
// -----------------------------
export const getCurrentUser = async (): Promise<AuthUser | null> => {
  const token = authStorage.getToken();
  if (!token) return null;

  const res = await fetch(`${API_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    authStorage.clearToken();
    return null;
  }

  return (await res.json()) as AuthUser;
};

// -----------------------------
// LOGOUT
// -----------------------------
export const logout = () => {
  authStorage.clearToken();
};

// -----------------------------
// Header helper
// -----------------------------
export const getAuthHeader = () => {
  const token = authStorage.getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};
