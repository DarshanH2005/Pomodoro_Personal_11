'use client'

import { useEffect, useState } from 'react'
import { formatTime } from '@/lib/utils'
import { TimerMode, PomodoroSettings } from '@/types'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface TimerDisplayProps {
  timeRemaining: number
  currentMode: TimerMode
  isRunning: boolean
  isPaused: boolean
  settings: PomodoroSettings
  onSwitchMode?: (mode: TimerMode) => void
}

export default function TimerDisplay({
  timeRemaining,
  currentMode,
  isRunning,
  isPaused,
  settings,
  onSwitchMode
}: TimerDisplayProps) {
  const [progress, setProgress] = useState(100)
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
      // Calculate progress percentage (100% -> 0%)
      const calculatedProgress = (timeRemaining / totalTime) * 100
      setProgress(calculatedProgress)
    }
  }, [timeRemaining, totalTime])

  // Get color based on current mode
  const getColor = () => {
    switch (currentMode) {
      case 'work':
        return 'text-primary stroke-primary'
      case 'shortBreak':
        return 'text-green-500 stroke-green-500'
      case 'longBreak':
        return 'text-indigo-500 stroke-indigo-500'
      default:
        return 'text-gray-400 stroke-gray-400'
    }
  }

  // Circular Progress Configuration
  const radius = 140
  const stroke = 8
  const normalizedRadius = radius - stroke * 2
  const circumference = normalizedRadius * 2 * Math.PI
  const strokeDashoffset = circumference - (progress / 100) * circumference

  return (
    <div className="flex flex-col items-center justify-center py-6">

      {/* Mode Toggles */}
      <div className="flex items-center gap-2 mb-10 bg-secondary/30 p-1.5 rounded-full">
        {[
          { id: 'work', label: 'Focus' },
          { id: 'shortBreak', label: 'Short Break' },
          { id: 'longBreak', label: 'Long Break' }
        ].map((mode) => (
          <button
            key={mode.id}
            onClick={() => onSwitchMode && onSwitchMode(mode.id as TimerMode)}
            className={cn(
              "px-6 py-2 rounded-full text-sm font-medium transition-all duration-300",
              currentMode === mode.id
                ? "bg-background shadow-sm text-foreground scale-105"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
            )}
          >
            {mode.label}
          </button>
        ))}
      </div>

      {/* Circular Timer */}
      <div className="relative flex items-center justify-center">
        {/* SVG Ring */}
        <svg
          height={radius * 2}
          width={radius * 2}
          className="rotate-[-90deg] transform"
        >
          {/* Background Circle */}
          <circle
            stroke="currentColor"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            className="text-secondary/30"
          />
          {/* Progress Circle */}
          <circle
            stroke="currentColor"
            fill="transparent"
            strokeWidth={stroke}
            strokeDasharray={circumference + ' ' + circumference}
            style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.5s linear' }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            className={getColor().split(' ')[1]} // Get stroke color
          />
        </svg>

        {/* Time Display (Centered) */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div
            key={timeRemaining}
            initial={{ opacity: 0.5, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={cn(
              "text-7xl font-bold tracking-tighter tabular-nums",
              getColor().split(' ')[0] // Get text color
            )}
          >
            {formatTime(timeRemaining)}
          </motion.div>

          {/* Status Text */}
          <div className="mt-4 h-6">
            {isRunning && (
              <span className="text-sm font-medium text-muted-foreground uppercase tracking-widest animate-pulse">
                Focusing
              </span>
            )}
            {isPaused && (
              <span className="text-sm font-medium text-yellow-500 uppercase tracking-widest">
                Paused
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}