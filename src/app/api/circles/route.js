import { NextResponse } from 'next/server';
import { getDB } from '@/lib/mockDB';

export async function GET() {
  try {
    const db = getDB();
    
    // Calculate currentRegistrations for each circle
    const circlesWithCounts = db.circles
      .filter(circle => circle.status !== 'draft')
      .map(circle => {
        const count = db.submissions.filter(s => s.circleId === circle._id).length;
        return {
          ...circle,
          currentRegistrations: count
        };
      });

    return NextResponse.json({ success: true, circles: circlesWithCounts });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
