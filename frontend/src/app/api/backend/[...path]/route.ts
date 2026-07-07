import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { SESSION_COOKIE_NAME } from '../../../../lib/session';

const BACKEND_URL = process.env.INTERNAL_API_URL ?? 'http://backend:4000/api';

async function proxy(request: NextRequest, params: { path: string[] }) {
  const token = cookies().get(SESSION_COOKIE_NAME)?.value;
  const targetPath = params.path.join('/');
  const search = request.nextUrl.search;

  const hasBody = !['GET', 'HEAD', 'DELETE'].includes(request.method);
  const body = hasBody ? await request.text() : undefined;

  const backendResponse = await fetch(`${BACKEND_URL}/${targetPath}${search}`, {
    method: request.method,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body,
    cache: 'no-store',
  });

  const text = await backendResponse.text();
  return new NextResponse(text, {
    status: backendResponse.status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function GET(request: NextRequest, context: { params: { path: string[] } }) {
  return proxy(request, context.params);
}
export async function POST(request: NextRequest, context: { params: { path: string[] } }) {
  return proxy(request, context.params);
}
export async function PATCH(request: NextRequest, context: { params: { path: string[] } }) {
  return proxy(request, context.params);
}
export async function DELETE(request: NextRequest, context: { params: { path: string[] } }) {
  return proxy(request, context.params);
}
export async function PUT(request: NextRequest, context: { params: { path: string[] } }) {
  return proxy(request, context.params);
}
