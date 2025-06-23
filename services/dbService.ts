import connectToDatabase from '../lib/mongodb';
import PomodoroSessionModel from '../models/PomodoroSession';
import TaskModel from '../models/Task';
import { DailyStatsModel, WeeklyStatsModel } from '../models/Stats';
import { PomodoroSession, Task, DailyStats, WeeklyStats } from '../types';
import { getWeekStart, getWeekEnd } from '../lib/utils';

// Connect to the database before performing any operations
const ensureConnection = async () => {
  try {
    await connectToDatabase();
  } catch (error) {
    console.error('Failed to connect to MongoDB', error);
    throw error;
  }
};

// Pomodoro Session Operations
export const saveSession = async (session: PomodoroSession): Promise<PomodoroSession> => {
  await ensureConnection();
  const newSession = new PomodoroSessionModel(session);
  await newSession.save();
  
  // Update stats when a session is completed
  if (session.completed) {
    await updateStatsForCompletedSession(session);
  }
  
  return newSession.toObject();
};

export const getSessions = async (startDate?: Date, endDate?: Date): Promise<PomodoroSession[]> => {
  await ensureConnection();
  
  let query = {};
  if (startDate && endDate) {
    query = {
      startTime: { $gte: startDate },
      endTime: { $lte: endDate }
    };
  }
  
  const sessions = await PomodoroSessionModel.find(query).sort({ startTime: -1 });
  return sessions.map(session => session.toObject());
};

// Task Operations
export const saveTask = async (task: Task): Promise<Task> => {
  await ensureConnection();
  
  // Check if task already exists
  const existingTask = await TaskModel.findOne({ id: task.id });
  
  if (existingTask) {
    // Update existing task
    Object.assign(existingTask, task);
    await existingTask.save();
    return existingTask.toObject();
  } else {
    // Create new task
    const newTask = new TaskModel(task);
    await newTask.save();
    return newTask.toObject();
  }
};

export const getTasks = async (completed?: boolean): Promise<Task[]> => {
  await ensureConnection();
  
  let query = {};
  if (completed !== undefined) {
    query = { completed };
  }
  
  const tasks = await TaskModel.find(query).sort({ createdAt: -1 });
  return tasks.map(task => task.toObject());
};

export const deleteTask = async (taskId: string): Promise<boolean> => {
  await ensureConnection();
  const result = await TaskModel.deleteOne({ id: taskId });
  return result.deletedCount > 0;
};

// Stats Operations
async function updateStatsForCompletedSession(session: PomodoroSession) {
  const sessionDate = new Date(session.startTime);
  sessionDate.setHours(0, 0, 0, 0); // Normalize to start of day
  
  // Format date as string for database storage
  const dateString = sessionDate.toISOString().split('T')[0];
  
  // Update or create daily stats
  let dailyStats = await DailyStatsModel.findOne({ date: dateString });
  
  if (!dailyStats) {
    dailyStats = new DailyStatsModel({
      date: dateString,
      workSessions: 0,
      totalWorkTime: 0,
      totalBreakTime: 0,
      tasksCompleted: 0,
      focusScore: 0
    });
  }
  
  // Update stats based on session mode
  switch (session.mode) {
    case 'work':
      dailyStats.workSessions += 1;
      dailyStats.totalWorkTime += Math.floor(session.duration / 60); // Convert seconds to minutes
      break;
    case 'shortBreak':
      dailyStats.totalBreakTime += Math.floor(session.duration / 60); // Convert seconds to minutes
      break;
    case 'longBreak':
      dailyStats.totalBreakTime += Math.floor(session.duration / 60); // Convert seconds to minutes
      break;
  }
  
  // Calculate focus score (work time / total time * 100)
  const totalTime = dailyStats.totalWorkTime + dailyStats.totalBreakTime;
  dailyStats.focusScore = totalTime > 0 ? Math.round((dailyStats.totalWorkTime / totalTime) * 100) : 0;
  
  await dailyStats.save();
  
  // Update or create weekly stats
  const weekStart = getWeekStart(sessionDate);
  const weekEnd = getWeekEnd(sessionDate);
  const weekStartString = weekStart.toISOString().split('T')[0];
  
  let weeklyStats = await WeeklyStatsModel.findOne({ weekStart: weekStartString });
  
  if (!weeklyStats) {
    weeklyStats = new WeeklyStatsModel({
      weekStart: weekStartString,
      totalSessions: 0,
      totalWorkTime: 0,
      totalBreakTime: 0,
      averageFocusScore: 0,
      dailyStats: []
    });
  }
  
  // Update weekly stats based on session mode
  switch (session.mode) {
    case 'work':
      weeklyStats.totalSessions += 1;
      weeklyStats.totalWorkTime += Math.floor(session.duration / 60); // Convert seconds to minutes
      break;
    case 'shortBreak':
      weeklyStats.totalSessions += 1;
      weeklyStats.totalBreakTime += Math.floor(session.duration / 60); // Convert seconds to minutes
      break;
    case 'longBreak':
      weeklyStats.totalSessions += 1;
      weeklyStats.totalBreakTime += Math.floor(session.duration / 60); // Convert seconds to minutes
      break;
  }
  
  // Calculate average focus score
  const weeklyTotalTime = weeklyStats.totalWorkTime + weeklyStats.totalBreakTime;
  weeklyStats.averageFocusScore = weeklyTotalTime > 0 ? Math.round((weeklyStats.totalWorkTime / weeklyTotalTime) * 100) : 0;
  
  // Add daily stats to weekly stats if not already included
  if (!weeklyStats.dailyStats.includes(dailyStats._id.toString())) {
    weeklyStats.dailyStats.push(dailyStats._id.toString());
  }
  
  await weeklyStats.save();
}

export const getDailyStats = async (startDate?: Date, endDate?: Date): Promise<DailyStats[]> => {
  await ensureConnection();
  
  let query = {};
  if (startDate && endDate) {
    const startString = startDate.toISOString().split('T')[0];
    const endString = endDate.toISOString().split('T')[0];
    query = {
      date: { $gte: startString, $lte: endString }
    };
  }
  
  const stats = await DailyStatsModel.find(query).sort({ date: -1 });
  return stats.map(stat => stat.toObject());
};

export const getWeeklyStats = async (startDate?: Date, endDate?: Date): Promise<WeeklyStats[]> => {
  await ensureConnection();
  
  let query = {};
  if (startDate && endDate) {
    const startString = startDate.toISOString().split('T')[0];
    const endString = endDate.toISOString().split('T')[0];
    query = {
      weekStart: { $gte: startString, $lte: endString }
    };
  }
  
  const stats = await WeeklyStatsModel.find(query)
    .populate('dailyStats')
    .sort({ weekStart: -1 });
    
  return stats.map(stat => stat.toObject());
};

export const updateTaskCompletion = async (taskId: string, completed: boolean): Promise<void> => {
  await ensureConnection();
  
  const task = await TaskModel.findOne({ id: taskId });
  if (!task) return;
  
  // If task is being marked as completed and wasn't completed before
  if (completed && !task.completed) {
    task.completed = true;
    await task.save();
    
    // Update daily and weekly stats for task completion
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayString = today.toISOString().split('T')[0];
    
    const dailyStats = await DailyStatsModel.findOne({ date: todayString });
    if (dailyStats) {
      dailyStats.tasksCompleted += 1;
      await dailyStats.save();
    }
    
    const weekStart = getWeekStart(today);
    const weekStartString = weekStart.toISOString().split('T')[0];
    const weeklyStats = await WeeklyStatsModel.findOne({ weekStart: weekStartString });
    if (weeklyStats) {
      weeklyStats.totalSessions += 1;
      await weeklyStats.save();
    }
  }
  // If task is being marked as not completed and was completed before
  else if (!completed && task.completed) {
    task.completed = false;
    await task.save();
    
    // Update daily and weekly stats for task un-completion
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayString = today.toISOString().split('T')[0];
    
    const dailyStats = await DailyStatsModel.findOne({ date: todayString });
    if (dailyStats && dailyStats.tasksCompleted > 0) {
      dailyStats.tasksCompleted -= 1;
      await dailyStats.save();
    }
    
    const weekStart = getWeekStart(today);
    const weekStartString = weekStart.toISOString().split('T')[0];
    const weeklyStats = await WeeklyStatsModel.findOne({ weekStart: weekStartString });
    if (weeklyStats && weeklyStats.totalSessions > 0) {
      weeklyStats.totalSessions -= 1;
      await weeklyStats.save();
    }
  }
};