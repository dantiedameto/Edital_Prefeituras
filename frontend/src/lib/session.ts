export const SESSION_COOKIE_NAME = 'central_editais_token';

export const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  path: '/',
  maxAge: 60 * 60 * 24 * 7, // 7 dias, alinhado ao JWT_EXPIRES_IN padrão do backend
};
