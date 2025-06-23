import mongoose, { Schema } from 'mongoose';
import { Task } from '../types';

// Define the schema for Task
const TaskSchema = new Schema<Task>({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String },
  completed: { type: Boolean, required: true, default: false },
  priority: { type: String, enum: ['low', 'medium', 'high'], required: true, default: 'medium' },
  category: { type: String },
  createdAt: { type: Date, required: true, default: Date.now },
  updatedAt: { type: Date, required: true, default: Date.now }
}, {
  timestamps: true
});

// Create the model if it doesn't exist, or use the existing one
let TaskModel: mongoose.Model<Task>;

try {
  TaskModel = mongoose.models.Task || mongoose.model('Task', TaskSchema);
} catch {
  TaskModel = mongoose.model('Task', TaskSchema);
}

export default TaskModel;