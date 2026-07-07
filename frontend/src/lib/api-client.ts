'use client';

export class ApiClientError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

/** Chamada client-side: sempre passa pelo proxy /api/backend, que injeta o token do cookie httpOnly. */
export async function clientFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`/api/backend${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init.headers,
    },
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const message = Array.isArray(data?.message) ? data.message.join(', ') : (data?.message ?? 'Erro na requisição.');
    throw new ApiClientError(response.status, message);
  }

  return data as T;
}
