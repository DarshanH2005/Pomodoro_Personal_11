export interface PomodoroSession {
  id: string
  mode: 'work' | 'shortBreak' | 'longBreak'
  duration: number
  startTime: Date
  endTime?: Date
  completed: boolean
  taskId?: string
}

export interface Task {
  id: string
  title: string
  description?: string
  completed: boolean
  createdAt: Date
  updatedAt: Date
  priority: 'low' | 'medium' | 'high'
  category?: string
}

export interface PomodoroSettings {
  workDuration: number // in minutes
  shortBreakDuration: number // in minutes
  longBreakDuration: number // in minutes
  autoStartBreaks: boolean
  autoStartWork: boolean
  notifications: boolean
  soundEnabled: boolean
  timerTickEnabled: boolean // New setting to control timer tick sounds
  volume: number
  theme: 'light' | 'dark' | 'system'
  selectedSound: 'workComplete' | 'breakComplete' | 'bell' | 'chime' | 'ding' | 'xylophone' | 'workSessionOver' | 'breakOver'
}

export interface DailyStats {
  date: string
  workSessions: number
  totalWorkTime: number // in minutes
  totalBreakTime: number // in minutes
  tasksCompleted: number
  focusScore: number // 0-100
}

export interface WeeklyStats {
  weekStart: string
  totalSessions: number
  totalWorkTime: number
  totalBreakTime: number
  averageFocusScore: number
  dailyStats: string[] // ObjectId references to DailyStats
}

export interface TimerState {
  isRunning: boolean
  isPaused: boolean
  currentSession: PomodoroSession | null
  timeRemaining: number // in seconds
  currentTask: Task | null
  sessionCount: number
  completedSessions: PomodoroSession[]
  needsConfirmation?: boolean // Flag to indicate if timer completion needs user confirmation
  completedSessionMode?: 'work' | 'shortBreak' | 'longBreak' // Mode of the session that just completed
}

export interface AppState {
  timer: TimerState
  tasks: Task[]
  settings: PomodoroSettings
  stats: {
    daily: DailyStats[]
    weekly: WeeklyStats[]
  }
}

export type TimerMode = 'work' | 'shortBreak' | 'longBreak'

export interface NotificationOptions {
  title: string
  body: string
  icon?: string
  badge?: string
}