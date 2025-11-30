'use client'

import { useState, useEffect } from 'react'
import { usePomodoro } from '@/hooks/usePomodoro'
import { useDatabase } from '@/hooks/useDatabase'
import { formatTime, requestNotificationPermission, playSoundEffect } from '@/lib/utils'
import { getSoundEffects } from '@/lib/soundEffects'
import { Task } from '@/types'
import TimerDisplay from '@/components/TimerDisplay'
import TimerControls from '@/components/TimerControls'
import TaskList from '@/components/TaskList'
import SettingsDialog from '@/components/SettingsDialog'
import StatsDisplay from '@/components/StatsDisplay'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useTheme } from 'next-themes'
import { motion, AnimatePresence } from 'framer-motion'
import { Sun, Moon, Settings, Menu } from 'lucide-react'
import GlassButton from '@/components/GlassButton'
import { ThemeToggle } from '@/components/ThemeToggle'
import DailyRoutine from '@/components/DailyRoutine'
import { ShineBorder } from '@/components/ui/shine-border'
import { MagicCard } from '@/components/ui/magic-card'

export default function Home() {
  const {
    timerState,
    settings,
    currentMode,
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
    resetTimer,
    switchMode,
    updateSettings,
    confirmNotification
  } = usePomodoro()

  const {
    tasks,
    sessions,
    dailyStats,
    weeklyStats,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    createSession
  } = useDatabase()

  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Set mounted flag on component mount
  useEffect(() => {
    setMounted(true)
  }, [])

  // Request notification permission on component mount
  useEffect(() => {
    if (mounted) {
      requestNotificationPermission()
    }
  }, [mounted])

  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [statsMode, setStatsMode] = useState<'daily' | 'weekly'>('daily')

  const addTask = async (task: Omit<Task, 'id'>) => {
    try {
      await createTask(task)
    } catch (error) {
      console.error('Failed to add task:', error)
    }
  }

  const updateTaskHandler = async (id: string, updates: Partial<Task>) => {
    try {
      await updateTask(id, updates)
    } catch (error) {
      console.error('Failed to update task:', error)
    }
  }

  const deleteTaskHandler = async (taskId: string) => {
    try {
      await deleteTask(taskId)
    } catch (error) {
      console.error('Failed to delete task:', error)
    }
  }

  const toggleTaskCompletion = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId)
    if (task) {
      try {
        await updateTask(taskId, { completed: !task.completed })
      } catch (error) {
        console.error('Failed to toggle task completion:', error)
      }
    }
  }

  const selectTaskForTimer = (task: Task) => {
    startTimer(currentMode, task)
  }

  // Update theme when settings change
  useEffect(() => {
    if (mounted && settings.theme === 'system') {
      setTheme('system')
    } else if (mounted) {
      setTheme(settings.theme)
    }
  }, [settings.theme, setTheme, mounted])

  // Log when notification popup should be displayed
  useEffect(() => {
    if (timerState.needsConfirmation) {
      console.log('🎉 Notification popup should be displayed!', { currentMode, needsConfirmation: timerState.needsConfirmation })
    }
  }, [timerState.needsConfirmation, currentMode])

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </main>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Top App Bar */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-lg bg-background/80 border-b border-border/40">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 p-2 rounded-xl">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-xl font-medium tracking-tight">Pomodoro</h1>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="p-3 rounded-full hover:bg-secondary transition-colors"
              aria-label="Settings"
            >
              <Settings className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Notification Confirmation Dialog - In-app popup */}
        <AnimatePresence>
          {timerState.needsConfirmation && (
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div
                className="bg-card text-card-foreground rounded-[2rem] shadow-2xl max-w-md w-full p-8 text-center border border-border/50"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", duration: 0.5 }}
              >
                <div className="flex justify-center mb-6">
                  <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                    {timerState.completedSessionMode === 'work' ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    )}
                  </div>
                </div>
                <h2 className="text-2xl font-normal mb-2">
                  {timerState.completedSessionMode === 'work' ? 'Session Complete' : 'Break Over'}
                </h2>
                <p className="mb-8 text-muted-foreground">
                  {timerState.completedSessionMode === 'work'
                    ? 'Great job! Take a moment to recharge.'
                    : 'Ready to get back in the zone?'}
                </p>
                <button
                  onClick={confirmNotification}
                  className="w-full py-4 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all font-medium text-lg shadow-lg shadow-primary/25"
                >
                  {timerState.completedSessionMode === 'work' ? 'Start Break' : 'Start Focusing'}
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Timer */}
          <motion.div
            className="lg:col-span-7 space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="group bg-card text-card-foreground rounded-[2rem] shadow-sm border border-border/50 p-8 relative overflow-hidden">
              <ShineBorder shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]} />
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-20"></div>
              <TimerDisplay
                timeRemaining={timerState.timeRemaining}
                currentMode={currentMode}
                isRunning={timerState.isRunning}
                isPaused={timerState.isPaused}
                settings={settings}
                onSwitchMode={switchMode}
              />

              <div className="mt-8">
                <TimerControls
                  isRunning={timerState.isRunning}
                  isPaused={timerState.isPaused}
                  currentMode={currentMode}
                  onStart={() => startTimer()}
                  onPause={pauseTimer}
                  onResume={resumeTimer}
                  onStop={stopTimer}
                  onReset={resetTimer}
                  onSwitchMode={switchMode}
                  onOpenSettings={() => setIsSettingsOpen(true)}
                />
              </div>
            </div>

            {/* Session Info Card */}
            <div className="bg-secondary/30 rounded-[1.5rem] p-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Current Session</p>
                <p className="text-lg font-medium mt-1">
                  {timerState.currentTask ? timerState.currentTask.title : 'No task selected'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Completed</p>
                <p className="text-2xl font-semibold text-primary mt-1">{timerState.sessionCount}</p>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Tasks & Stats */}
          <motion.div
            className="lg:col-span-5 space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <DailyRoutine />

            <MagicCard className="bg-card text-card-foreground rounded-[2rem] shadow-sm border border-border/50 p-6 h-[600px] flex flex-col">
              <Tabs defaultValue="tasks" className="h-full flex flex-col">
                <TabsList className="w-full grid grid-cols-2 mb-6 bg-secondary/50 p-1 rounded-full">
                  <TabsTrigger value="tasks" className="rounded-full data-[state=active]:bg-background data-[state=active]:shadow-sm">Tasks</TabsTrigger>
                  <TabsTrigger value="stats" className="rounded-full data-[state=active]:bg-background data-[state=active]:shadow-sm">Stats</TabsTrigger>
                </TabsList>

                <TabsContent value="tasks" className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                  <TaskList
                    tasks={tasks}
                    onAddTask={addTask}
                    onUpdateTask={updateTaskHandler}
                    onDeleteTask={deleteTaskHandler}
                    onToggleComplete={toggleTaskCompletion}
                    onSelectTask={selectTaskForTimer}
                    currentTask={timerState.currentTask}
                  />
                </TabsContent>

                <TabsContent value="stats" className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                  <div className="flex gap-2 mb-6 bg-secondary/30 p-1 rounded-xl inline-flex">
                    <button
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${statsMode === 'daily' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                      onClick={() => setStatsMode('daily')}
                    >
                      Daily
                    </button>
                    <button
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${statsMode === 'weekly' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                      onClick={() => setStatsMode('weekly')}
                    >
                      Weekly
                    </button>
                  </div>
                  <StatsDisplay mode={statsMode} stats={statsMode === 'daily' ? dailyStats : weeklyStats} />
                </TabsContent>
              </Tabs>
            </MagicCard>
          </motion.div>
        </div>

        <SettingsDialog
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          settings={settings}
          onUpdateSettings={updateSettings}
        />
      </main>
    </div>
  )
}