import { NextRequest, NextResponse } from 'next/server';
import { backendFetchWithToken } from '../../../../lib/api-server';
import { COOKIE_OPTIONS, SESSION_COOKIE_NAME } from '../../../../lib/session';

export async function POST(request: NextRequest) {
  const body = await request.json();

  try {
    const result = await backendFetchWithToken<{ accessToken: string; user: unknown }>('/auth/login', undefined, {
      method: 'POST',
      body: JSON.stringify(body),
    });

    const response = NextResponse.json({ user: result.user });
    response.cookies.set(SESSION_COOKIE_NAME, result.accessToken, COOKIE_OPTIONS);
    return response;
  } catch (error: any) {
    return NextResponse.json({ message: error.message ?? 'Não foi possível entrar.' }, { status: error.status ?? 401 });
  }
}
