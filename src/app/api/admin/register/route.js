import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const data = await req.json();
    const { email } = data;

    // MOCK MODE: Ensure the email is just valid
    if (!email || !email.endsWith('@theflybottle.org')) {
      return NextResponse.json({ error: 'Valid @theflybottle.org email required.' }, { status: 400 });
    }

    // Usually we would talk to MongoDB here, but mocking prevents it.
    return NextResponse.json({ success: true, message: 'Mock admin registered successfully. You can now sign in.' });

  } catch (error) {
    console.error('Registration Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
