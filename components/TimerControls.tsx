'use client'

import { motion } from 'framer-motion'
import { TimerMode } from '@/types'
import { cn } from '@/lib/utils'
import { Play, Pause, Square, RotateCcw, Settings } from 'lucide-react'

interface TimerControlsProps {
  isRunning: boolean
  isPaused: boolean
  currentMode: TimerMode
  onStart: () => void
  onPause: () => void
  onResume: () => void
  onStop: () => void
  onReset: () => void
  onSwitchMode: (mode: TimerMode) => void
  onOpenSettings: () => void
}

export default function TimerControls({
  isRunning,
  isPaused,
  currentMode,
  onStart,
  onPause,
  onResume,
  onStop,
  onReset,
  onSwitchMode,
  onOpenSettings
}: TimerControlsProps) {
  const buttonVariants = {
    hover: { scale: 1.05, y: -2 },
    tap: { scale: 0.95 },
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 }
  }

  const iconVariants = {
    hover: { rotate: 360 },
    tap: { scale: 0.9 }
  }

  return (
    <div className="space-y-6">
      {/* Mode selector */}
      <div className="flex justify-center mb-4">
        <div className="inline-flex rounded-md shadow-sm" role="group">
          <button
            type="button"
            onClick={() => onSwitchMode('work')}
            className={cn(
              'px-4 py-2 text-sm font-medium rounded-l-lg border',
              currentMode === 'work'
                ? 'bg-blue-500 text-white border-blue-600 hover:bg-blue-600 dark:bg-blue-700 dark:border-blue-800 dark:hover:bg-blue-800'
                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100 dark:bg-black dark:text-white dark:border-gray-600 dark:hover:bg-gray-900'
            )}
          >
            Work
          </button>
          <button
            type="button"
            onClick={() => onSwitchMode('shortBreak')}
            className={cn(
              'px-4 py-2 text-sm font-medium border-t border-b',
              currentMode === 'shortBreak'
                ? 'bg-green-500 text-white border-green-600 hover:bg-green-600 dark:bg-green-700 dark:border-green-800 dark:hover:bg-green-800'
                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100 dark:bg-black dark:text-white dark:border-gray-600 dark:hover:bg-gray-900'
            )}
          >
            Short Break
          </button>
          <button
            type="button"
            onClick={() => onSwitchMode('longBreak')}
            className={cn(
              'px-4 py-2 text-sm font-medium rounded-r-lg border',
              currentMode === 'longBreak'
                ? 'bg-blue-500 text-white border-blue-600 hover:bg-blue-600 dark:bg-blue-700 dark:border-blue-800 dark:hover:bg-blue-800'
                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100 dark:bg-black dark:text-white dark:border-gray-600 dark:hover:bg-gray-900'
            )}
          >
            Long Break
          </button>
        </div>
      </div>

      {/* Timer controls */}
      <motion.div 
        className="flex justify-center gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {!isRunning && !isPaused && (
          <motion.button
            onClick={onStart}
            className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 font-semibold text-lg flex items-center gap-2 shadow-lg"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            initial="initial"
            animate="animate"
            transition={{ duration: 0.3 }}
          >
            <motion.svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
              variants={iconVariants}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </motion.svg>
            Start
          </motion.button>
        )}

        {isRunning && (
          <motion.button
            onClick={onPause}
            className="px-8 py-4 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 focus:outline-none focus:ring-4 focus:ring-yellow-500 focus:ring-opacity-50 font-semibold text-lg flex items-center gap-2 shadow-lg"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            initial="initial"
            animate="animate"
            transition={{ duration: 0.3 }}
          >
            <motion.svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
              variants={iconVariants}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </motion.svg>
            Pause
          </motion.button>
        )}

        {isPaused && (
          <motion.button
            onClick={onResume}
            className="px-8 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50 font-semibold text-lg flex items-center gap-2 shadow-lg"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            initial="initial"
            animate="animate"
            transition={{ duration: 0.3 }}
          >
            <motion.svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
              variants={iconVariants}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </motion.svg>
            Resume
          </motion.button>
        )}

        {(isRunning || isPaused) && (
          <motion.button
            onClick={onStop}
            className="px-8 py-4 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-500 focus:ring-opacity-50 font-semibold text-lg flex items-center gap-2 shadow-lg"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            initial="initial"
            animate="animate"
            transition={{ duration: 0.3 }}
          >
            <motion.svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
              variants={iconVariants}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </motion.svg>
            Stop
          </motion.button>
        )}
      </motion.div>

      {/* Secondary Controls */}
      <motion.div 
        className="flex justify-center gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <motion.button
          onClick={onReset}
          className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-500 focus:ring-opacity-50 font-medium flex items-center gap-2 shadow-md"
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          initial="initial"
          animate="animate"
          transition={{ duration: 0.3 }}
        >
          <motion.svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
            variants={iconVariants}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </motion.svg>
          Reset
        </motion.button>

        <motion.button
          onClick={onOpenSettings}
          className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-500 focus:ring-opacity-50 font-medium flex items-center gap-2 shadow-md"
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          initial="initial"
          animate="animate"
          transition={{ duration: 0.3 }}
        >
          <motion.svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
            variants={iconVariants}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </motion.svg>
          Settings
        </motion.button>
      </motion.div>
    </div>
  )
}