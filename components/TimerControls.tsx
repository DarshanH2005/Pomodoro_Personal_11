'use client'

import { Play, Pause, RotateCcw, Square, Settings } from 'lucide-react'
import { TimerMode } from '@/types'
import PremiumButton from './PremiumButton'
import { motion } from 'framer-motion'

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
  return (
    <div className="flex flex-col items-center gap-8">
      {/* Primary Control */}
      <div className="flex items-center gap-6">
        {!isRunning ? (
          <PremiumButton
            onClick={onStart}
            size="lg"
            className="rounded-full w-24 h-24 shadow-xl shadow-primary/25"
            aria-label="Start Timer"
          >
            <Play className="w-10 h-10 fill-current ml-1" />
          </PremiumButton>
        ) : (
          <>
            {!isPaused ? (
              <PremiumButton
                onClick={onPause}
                size="lg"
                className="rounded-full w-24 h-24 shadow-xl shadow-primary/25"
                aria-label="Pause Timer"
              >
                <Pause className="w-10 h-10 fill-current" />
              </PremiumButton>
            ) : (
              <PremiumButton
                onClick={onResume}
                size="lg"
                className="rounded-full w-24 h-24 shadow-xl shadow-primary/25"
                aria-label="Resume Timer"
              >
                <Play className="w-10 h-10 fill-current ml-1" />
              </PremiumButton>
            )}
          </>
        )}
      </div>

      {/* Secondary Controls */}
      <motion.div
        className="flex items-center gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {(isRunning || isPaused) && (
          <PremiumButton
            variant="secondary"
            size="icon"
            onClick={onStop}
            className="rounded-full w-14 h-14 bg-secondary/50 hover:bg-destructive/10 hover:text-destructive transition-colors"
            title="Stop"
          >
            <Square className="w-5 h-5 fill-current" />
          </PremiumButton>
        )}

        <PremiumButton
          variant="secondary"
          size="icon"
          onClick={onReset}
          className="rounded-full w-14 h-14 bg-secondary/50"
          title="Reset"
        >
          <RotateCcw className="w-5 h-5" />
        </PremiumButton>
      </motion.div>
    </div>
  )
}