import mongoose, { Schema } from 'mongoose';
import { DailyStats, WeeklyStats } from '../types';

// Define the schema for DailyStats
const DailyStatsSchema = new Schema<DailyStats>({
  date: { type: String, required: true, unique: true },
  workSessions: { type: Number, default: 0 },
  totalWorkTime: { type: Number, default: 0 },
  totalBreakTime: { type: Number, default: 0 },
  tasksCompleted: { type: Number, default: 0 },
  focusScore: { type: Number, default: 0 },
}, {
  timestamps: true
});

// Define the schema for WeeklyStats
const WeeklyStatsSchema = new Schema<WeeklyStats>({
  weekStart: { type: String, required: true, unique: true },
  totalSessions: { type: Number, default: 0 },
  totalWorkTime: { type: Number, default: 0 },
  totalBreakTime: { type: Number, default: 0 },
  averageFocusScore: { type: Number, default: 0 },
  dailyStats: [{ type: Schema.Types.ObjectId, ref: 'DailyStats' }],
}, {
  timestamps: true
});

// Create the models if they don't exist, or use the existing ones
let DailyStatsModel: mongoose.Model<DailyStats>;
let WeeklyStatsModel: mongoose.Model<WeeklyStats>;

try {
  DailyStatsModel = mongoose.models.DailyStats || mongoose.model('DailyStats', DailyStatsSchema);
  WeeklyStatsModel = mongoose.models.WeeklyStats || mongoose.model('WeeklyStats', WeeklyStatsSchema);
} catch {
  DailyStatsModel = mongoose.model('DailyStats', DailyStatsSchema);
  WeeklyStatsModel = mongoose.model('WeeklyStats', WeeklyStatsSchema);
}

export { DailyStatsModel, WeeklyStatsModel };