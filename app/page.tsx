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
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex flex-col items-center justify-center mb-8">
          <h1 className="text-4xl font-bold mb-2 text-blue-600">Pomodoro Timer</h1>
          <p className="text-gray-600 text-center max-w-md">
            Boost your productivity with the Pomodoro Technique
          </p>
        </div>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </main>
    )
  }

  return (
    <main className="container mx-auto px-4 py-8 max-w-full">
      <motion.div 
        className="flex flex-col items-center justify-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-bold mb-2 text-blue-600 dark:text-blue-400">Pomodoro Timer</h1>
        <p className="text-gray-600 dark:text-gray-300 text-center max-w-md">
          Boost your productivity with the Pomodoro Technique
        </p>
      </motion.div>

      {/* Notification Confirmation Dialog - In-app popup */}
      <AnimatePresence>
        {timerState.needsConfirmation && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 notification-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div 
              className="bg-white dark:bg-black rounded-xl shadow-2xl max-w-md w-full p-8 text-center notification-dialog"
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
              transition={{ duration: 0.4, type: "spring", stiffness: 300 }}
            >
              <motion.div 
                className="flex justify-center mb-6"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="h-24 w-24 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center animate-pulse relative">
                  <div className="absolute inset-0 rounded-full bg-blue-500 opacity-30 animate-ping"></div>
                  {timerState.completedSessionMode === 'work' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                </div>
              </motion.div>
              <motion.h2 
                className="text-3xl font-bold mb-4 text-blue-600 dark:text-blue-400"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
              >
                {timerState.completedSessionMode === 'work' ? 'Your work session is over!' : 
                 timerState.completedSessionMode === 'shortBreak' ? 'Short break is over!' :
                 'Long break is over!'}
              </motion.h2>
              <motion.p 
                className="mb-8 text-gray-700 dark:text-gray-300 text-xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {timerState.completedSessionMode === 'work' 
                  ? 'Time for a break.' 
                  : timerState.completedSessionMode === 'shortBreak'
                  ? 'Ready to focus again?'
                  : 'Ready to get back to work?'}
              </motion.p>
              <motion.div 
                className="flex justify-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <button
                  onClick={confirmNotification}
                  className="px-10 py-5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 notification-button font-semibold text-xl transition-all shadow-xl"
                >
                  {timerState.completedSessionMode === 'work' ? 'Start Break' : 'Start Working'}
                </button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        className="grid grid-cols-1 xl:grid-cols-5 gap-8 items-start min-h-0"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <motion.div 
          className="xl:col-span-3 space-y-6 min-h-0 xl:ml-48"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <motion.div 
            className="bg-white dark:bg-black rounded-xl shadow-lg p-6"
            whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
            transition={{ duration: 0.3 }}
          >
            <TimerDisplay 
              timeRemaining={timerState.timeRemaining}
              currentMode={currentMode}
              isRunning={timerState.isRunning}
              isPaused={timerState.isPaused}
              settings={settings}
            />
            
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
          </motion.div>

          <motion.div 
            className="bg-white dark:bg-black rounded-xl shadow-lg p-6"
            whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-xl font-semibold mb-4">Current Session</h2>
            {timerState.currentTask ? (
              <motion.div 
                className="space-y-2"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <p className="font-medium">{timerState.currentTask.title}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {timerState.currentTask.description || 'No description'}
                </p>
                <div className="flex items-center justify-between text-sm">
                  <span>Priority</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    timerState.currentTask.priority === 'high' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                    timerState.currentTask.priority === 'medium' ? 'bg-gray-100 text-gray-800 dark:bg-black dark:text-gray-200' :
                    'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  }`}>
                    {timerState.currentTask.priority.charAt(0).toUpperCase() + timerState.currentTask.priority.slice(1)}
                  </span>
                </div>
              </motion.div>
            ) : (
              <motion.p 
                className="text-gray-500 dark:text-gray-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                No task selected
              </motion.p>
            )}

            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">Session Progress</h3>
              <motion.div 
                className="space-y-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <div className="flex justify-between text-sm">
                  <span>Work Sessions</span>
                  <span>{timerState.sessionCount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Mode</span>
                  <span className="capitalize">{currentMode}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Next Break</span>
                  <span>
                    {currentMode === 'work' ? 'Short Break' : 'Work Session'}
                  </span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div 
          className="bg-white dark:bg-black rounded-xl shadow-lg p-6 min-h-0"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
        >
          <Tabs defaultValue="tasks" className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-2 mb-4 flex-shrink-0">
              <TabsTrigger value="tasks">Tasks</TabsTrigger>
              <TabsTrigger value="stats">Statistics</TabsTrigger>
            </TabsList>
            <TabsContent value="tasks" className="flex-1 overflow-y-auto">
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
            <TabsContent value="stats" className="flex-1 overflow-y-auto">
              <div className="mb-4 flex gap-2">
                <button
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors ${statsMode === 'daily' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-black dark:text-gray-200'}`}
                  onClick={() => setStatsMode('daily')}
                >
                  Day
                </button>
                <button
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors ${statsMode === 'weekly' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-black dark:text-gray-200'}`}
                  onClick={() => setStatsMode('weekly')}
                >
                  Weekly
                </button>
              </div>
              <StatsDisplay mode={statsMode} stats={statsMode === 'daily' ? dailyStats : weeklyStats} />
            </TabsContent>
          </Tabs>
        </motion.div>
      </motion.div>

      <SettingsDialog 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={updateSettings}
      />
    </main>
  )
}