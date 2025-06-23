import mongoose, { Schema } from 'mongoose';
import { PomodoroSession } from '../types';

// Define the schema for PomodoroSession
const PomodoroSessionSchema = new Schema<PomodoroSession>({
  id: { type: String, required: true, unique: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date },
  duration: { type: Number, required: true },
  mode: { type: String, enum: ['work', 'shortBreak', 'longBreak'], required: true },
  completed: { type: Boolean, required: true, default: false },
  taskId: { type: String },
}, {
  timestamps: true
});

// Create the model if it doesn't exist, or use the existing one
let PomodoroSessionModel: mongoose.Model<PomodoroSession>;

try {
  PomodoroSessionModel = mongoose.models.PomodoroSession || mongoose.model('PomodoroSession', PomodoroSessionSchema);
} catch {
  PomodoroSessionModel = mongoose.model('PomodoroSession', PomodoroSessionSchema);
}

export default PomodoroSessionModel;