import { NextRequest, NextResponse } from 'next/server';
import { saveSession, getSessions } from '@/services/dbService';
import { PomodoroSession } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    
    const sessions = await getSessions(
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined
    );
    return NextResponse.json(sessions);
  } catch (error) {
    console.error('Error fetching sessions:', error);
    return NextResponse.json({ error: 'Failed to fetch sessions' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const sessionData = await request.json();
    const session: PomodoroSession = {
      ...sessionData,
      id: Date.now().toString()
    };
    
    const savedSession = await saveSession(session);
    return NextResponse.json(savedSession, { status: 201 });
  } catch (error) {
    console.error('Error creating session:', error);
    return NextResponse.json({ error: 'Failed to create session' }, { status: 500 });
  }
} 