import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { DailyStatsModel, WeeklyStatsModel } from '@/models/Stats';
import PomodoroSessionModel from '@/models/PomodoroSession';

export async function GET() {
    try {
        await connectToDatabase();

        // Clear existing stats
        await DailyStatsModel.deleteMany({});
        await WeeklyStatsModel.deleteMany({});
        await PomodoroSessionModel.deleteMany({});

        const today = new Date();
        const currentWeekStart = new Date(today);
        currentWeekStart.setDate(today.getDate() - today.getDay());
        currentWeekStart.setHours(0, 0, 0, 0);

        // 1. Create Daily Stats for the last 7 days
        const dailyStats = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            const dateString = date.toISOString().split('T')[0];

            // Random data
            const workSessions = Math.floor(Math.random() * 8) + 2; // 2-10 sessions
            const totalWorkTime = workSessions * 25 * 60; // in seconds

            dailyStats.push({
                date: dateString,
                totalWorkTime,
                workSessions: workSessions,
                tasksCompleted: Math.floor(workSessions * 0.7),
                focusScore: Math.floor(Math.random() * 30) + 70 // 70-100
            });
        }
        await DailyStatsModel.insertMany(dailyStats);

        // 2. Create Weekly Stats for the last 4 weeks
        const weeklyStats = [];
        for (let i = 0; i < 4; i++) {
            const weekStart = new Date(currentWeekStart);
            weekStart.setDate(currentWeekStart.getDate() - (i * 7));
            const weekStartString = weekStart.toISOString().split('T')[0];

            // Random data
            const totalWorkTime = (Math.floor(Math.random() * 1000) + 500) * 60; // seconds
            const totalSessions = Math.floor(totalWorkTime / (25 * 60));

            weeklyStats.push({
                weekStart: weekStartString,
                totalWorkTime,
                totalSessions,
                averageFocusScore: Math.floor(Math.random() * 20) + 80
            });
        }
        await WeeklyStatsModel.insertMany(weeklyStats);

        // 3. Create some recent sessions
        const sessions = [];
        for (let i = 0; i < 10; i++) {
            sessions.push({
                id: (Date.now() + i).toString(),
                mode: 'work',
                duration: 25 * 60,
                startTime: new Date(Date.now() - (i * 3600000)), // 1 hour apart
                endTime: new Date(Date.now() - (i * 3600000) + (25 * 60000)),
                completed: true
            });
        }
        await PomodoroSessionModel.insertMany(sessions);

        return NextResponse.json({
            message: 'Database seeded successfully! 🌱',
            details: {
                dailyStats: dailyStats.length,
                weeklyStats: weeklyStats.length,
                sessions: sessions.length
            }
        });

    } catch (error) {
        console.error('Seeding failed:', error);
        return NextResponse.json(
            { error: 'Failed to seed database', details: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    }
}
