import { NextResponse } from 'next/server';
import { getDB } from '@/lib/mockDB';

export async function GET(req, { params }) {
  try {
    const { slug } = await params;
    
    const db = getDB();
    const circle = db.circles.find(c => c.slug === slug);

    if (!circle) {
      return NextResponse.json({ error: 'Circle not found' }, { status: 404 });
    }

    const currentRegistrations = db.submissions.filter(s => s.circleId === circle._id).length;
    
    return NextResponse.json({ success: true, circle: { ...circle, currentRegistrations } });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
