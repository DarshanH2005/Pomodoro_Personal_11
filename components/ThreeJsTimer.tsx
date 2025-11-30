'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface ThreeJsTimerProps {
  timeRemaining: number
  totalTime: number
  currentMode: string
  isRunning: boolean
  isPaused: boolean
}

// Helper function to format time
const formatTimeForDisplay = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
}

// Colors for different modes
const getModeColor = (mode: string): string => {
  switch (mode) {
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

export default function ThreeJsTimer({ timeRemaining, totalTime, currentMode, isRunning, isPaused }: ThreeJsTimerProps) {
  return (
    <div className="relative w-full h-[340px] flex items-center justify-center">
      <motion.div
        className="relative rounded-2xl shadow-2xl border border-white/20 overflow-hidden backdrop-blur-xl bg-white/20 dark:bg-black/30 flex flex-col items-center justify-center"
        style={{ width: 340, height: 340 }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, type: 'spring' }}
      >
        {/* Animated shimmer overlay */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ x: '-100%' }}
          animate={{ x: ['-100%', '120%'] }}
          transition={{ repeat: Infinity, duration: 2.8, ease: 'linear' }}
          style={{
            background: 'linear-gradient(120deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.32) 60%, rgba(255,255,255,0.08) 100%)',
            filter: 'blur(4px)',
            zIndex: 2,
          }}
        />
        <div className="relative z-10 flex flex-col items-center justify-center w-full h-full">
          <div className={`text-6xl font-bold font-mono mb-4 ${getModeColor(currentMode)}`}>{formatTimeForDisplay(timeRemaining)}</div>
          <div className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2 capitalize">{currentMode.replace(/([A-Z])/g, ' $1')}</div>
          <div className="text-base font-medium text-gray-500 dark:text-gray-400">
            {isPaused ? 'PAUSED' : isRunning ? 'RUNNING' : 'READY'}
          </div>
        </div>
      </motion.div>
    </div>
  )
}