import 'server-only';
import { cookies } from 'next/headers';
import { SESSION_COOKIE_NAME } from './session';

const BACKEND_URL = process.env.INTERNAL_API_URL ?? 'http://backend:4000/api';

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

/** Chamada server-side (Server Components / Route Handlers) direto para a API Nest, anexando o JWT do cookie httpOnly. */
export async function serverFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = cookies().get(SESSION_COOKIE_NAME)?.value;

  const response = await fetch(`${BACKEND_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...init.headers,
    },
    cache: 'no-store',
  });

  return parseResponse<T>(response);
}

export async function backendFetchWithToken<T>(path: string, token: string | undefined, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${BACKEND_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...init.headers,
    },
    cache: 'no-store',
  });

  return parseResponse<T>(response);
}

async function parseResponse<T>(response: Response): Promise<T> {
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const message = Array.isArray(data?.message) ? data.message.join(', ') : (data?.message ?? 'Erro na requisição.');
    throw new ApiError(response.status, message);
  }

  return data as T;
}

export function isAuthenticated(): boolean {
  return Boolean(cookies().get(SESSION_COOKIE_NAME)?.value);
}
