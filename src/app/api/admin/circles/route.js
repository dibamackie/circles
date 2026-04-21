import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getDB, saveDB } from '@/lib/mockDB';

export async function GET(req) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const db = getDB();
    const circles = db.circles.reverse(); // simple sort newest first
    
    return NextResponse.json({ success: true, circles });
  } catch (error) {
    console.error('Fetch Circles Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const data = await req.json();
    const { name, slug, status, capacity } = data;

    if (!name || !slug) {
      return NextResponse.json({ error: 'Name and slug are required.' }, { status: 400 });
    }

    const db = getDB();
    if (db.circles.find(c => c.slug === slug)) {
      return NextResponse.json({ error: 'Slug already exists.' }, { status: 400 });
    }

    const newCircle = {
      _id: Date.now().toString(),
      name,
      slug,
      status: status || 'draft',
      capacity: capacity ? parseInt(capacity) : 0,
      telegramLink: ''
    };

    db.circles.push(newCircle);
    saveDB(db);

    return NextResponse.json({ success: true, circle: newCircle });
  } catch (error) {
    console.error('Create Circle Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
