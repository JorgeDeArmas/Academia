import { NextRequest } from 'next/server';

export interface Session {
  userId: string;
  tiktokUserId: string;
  accessToken: string;
}

export function getSession(request: NextRequest): Session | null {
  const sessionCookie = request.cookies.get('session')?.value;
  
  if (!sessionCookie) {
    return null;
  }

  try {
    return JSON.parse(sessionCookie);
  } catch {
    return null;
  }
}

export function requireSession(request: NextRequest): Session {
  const session = getSession(request);
  
  if (!session) {
    throw new Error('Unauthorized');
  }
  
  return session;
}
