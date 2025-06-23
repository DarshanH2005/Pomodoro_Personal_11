'use client'

import { useEffect, useState } from 'react'
import { formatTime } from '@/lib/utils'
import { TimerMode, PomodoroSettings } from '@/types'
import { motion } from 'framer-motion'

interface TimerDisplayProps {
  timeRemaining: number
  currentMode: TimerMode
  isRunning: boolean
  isPaused: boolean
  settings: PomodoroSettings
}

export default function TimerDisplay({
  timeRemaining,
  currentMode,
  isRunning,
  isPaused,
  settings
}: TimerDisplayProps) {
  const [progress, setProgress] = useState(0)
  const [totalTime, setTotalTime] = useState(0)

  // Calculate the total time for the current mode when it changes
  useEffect(() => {
    let time = 0
    switch (currentMode) {
      case 'work':
        time = settings.workDuration * 60
        break
      case 'shortBreak':
        time = settings.shortBreakDuration * 60
        break
      case 'longBreak':
        time = settings.longBreakDuration * 60
        break
    }
    setTotalTime(time)
  }, [currentMode, settings])

  // Update progress when time remaining changes
  useEffect(() => {
    if (totalTime > 0) {
      const calculatedProgress = ((totalTime - timeRemaining) / totalTime) * 100
      setProgress(calculatedProgress)
    }
  }, [timeRemaining, totalTime])

  // Calculate circle properties
  const radius = 120
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (progress / 100) * circumference

  // Get color based on current mode
  const getColor = () => {
    switch (currentMode) {
      case 'work':
        return 'text-blue-600 dark:text-blue-400'
      case 'shortBreak':
        return 'text-green-500 dark:text-green-400'
      case 'longBreak':
        return 'text-indigo-500 dark:text-indigo-400'
      default:
        return 'text-gray-500 dark:text-gray-400'
    }
  }

  const getStrokeColor = () => {
    switch (currentMode) {
      case 'work':
        return 'stroke-blue-600 dark:stroke-blue-400'
      case 'shortBreak':
        return 'stroke-green-500 dark:stroke-green-400'
      case 'longBreak':
        return 'stroke-indigo-500 dark:stroke-indigo-400'
      default:
        return 'stroke-gray-500 dark:stroke-gray-400'
    }
  }

  const getTitle = () => {
    switch (currentMode) {
      case 'work':
        return 'Work Session'
      case 'shortBreak':
        return 'Short Break'
      case 'longBreak':
        return 'Long Break'
      default:
        return 'Pomodoro Timer'
    }
  }

  const getModeIcon = () => {
    switch (currentMode) {
      case 'work':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
        )
      case 'shortBreak':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      case 'longBreak':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        )
      default:
        return null
    }
  }

  const getModeLabel = () => {
    switch (currentMode) {
      case 'work':
        return 'Work Session'
      case 'shortBreak':
        return 'Short Break'
      case 'longBreak':
        return 'Long Break'
      default:
        return 'Work Session'
    }
  }

  return (
    <div className="text-center">
      <motion.div 
        className="mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className={`inline-flex items-center gap-3 px-4 py-2 rounded-full bg-gray-100 dark:bg-black ${getColor()}`}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            animate={isRunning ? { rotate: 360 } : {}}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            {getModeIcon()}
          </motion.div>
          <span className="font-semibold capitalize">{getModeLabel()}</span>
        </motion.div>
      </motion.div>

      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <motion.div 
          className={`text-8xl font-bold font-mono ${getColor()} mb-4`}
          animate={isRunning ? { 
            scale: [1, 1.02, 1],
            textShadow: [
              "0 0 0px rgba(59, 130, 246, 0)",
              "0 0 20px rgba(59, 130, 246, 0.3)",
              "0 0 0px rgba(59, 130, 246, 0)"
            ]
          } : {}}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          {formatTime(timeRemaining)}
        </motion.div>
        
        <motion.div 
          className="flex justify-center items-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {isRunning && (
            <motion.div 
              className="flex items-center gap-2 text-green-600 dark:text-green-400"
              animate={{ opacity: [1, 0.7, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">Running</span>
            </motion.div>
          )}
          
          {isPaused && (
            <motion.div 
              className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="text-sm font-medium">Paused</span>
            </motion.div>
          )}
          
          {!isRunning && !isPaused && (
            <motion.div 
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
              <span className="text-sm font-medium">Stopped</span>
            </motion.div>
          )}
        </motion.div>
      </motion.div>

      {/* Progress Ring */}
      <motion.div 
        className="flex justify-center mb-6"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <div className="relative w-32 h-32">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
            {/* Background circle */}
            <circle
              cx="60"
              cy="60"
              r="54"
              stroke="currentColor"
              strokeWidth="4"
              fill="transparent"
              className="text-gray-200 dark:text-gray-700"
            />
            {/* Progress circle */}
            <motion.circle
              cx="60"
              cy="60"
              r="54"
              stroke="currentColor"
              strokeWidth="4"
              fill="transparent"
              strokeLinecap="round"
              className={getStrokeColor()}
              initial={{ strokeDasharray: "0 339.292", strokeDashoffset: "0" }}
              animate={{ 
                strokeDasharray: `${(progress / 100) * 339.292} 339.292`,
                strokeDashoffset: "0"
              }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
          </svg>
          <motion.div 
            className="absolute inset-0 flex items-center justify-center"
            animate={isRunning ? { scale: [1, 1.05, 1] } : {}}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className={`text-2xl font-bold ${getColor()}`}>
              {Math.ceil(progress)}%
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}