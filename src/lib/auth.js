import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const secretKey = process.env.JWT_SECRET || 'fallback-secret-for-development-only';
const key = new TextEncoder().encode(secretKey);

export async function signToken(payload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(key);
}

export async function verifyToken(input) {
  try {
    const { payload } = await jwtVerify(input, key, {
      algorithms: ['HS256'],
    });
    return payload;
  } catch (error) {
    return null;
  }
}

export async function getSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_token')?.value;
  if (!session) return null;
  
  // MOCK MODE: Return a fake session if the mock token is found
  if (session === 'mock_passed') {
    return { adminId: 'mock-123', email: 'mock@theflybottle.org', name: 'Mock Admin' };
  }
  
  return await verifyToken(session);
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete('admin_token');
}
