import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req) {
  try {
    const { email } = await req.json();

    // MOCK MODE: Don't compare passwords, just check email and set raw cookie
    if (!email || !email.endsWith('@theflybottle.org')) {
      return NextResponse.json({ error: 'Valid @theflybottle.org email required.' }, { status: 400 });
    }

    // Set simple mock cookie instead of real JWT
    const cookieStore = await cookies();
    cookieStore.set({
      name: 'admin_token',
      value: 'mock_passed',
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 // 24 hours
    });

    return NextResponse.json({ success: true, message: 'Mock logged in successfully.' });

  } catch (error) {
    console.error('Login Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
