'use client'

import { motion } from 'framer-motion'
import { DailyStats, WeeklyStats } from '@/types'

interface StatsDisplayProps {
  mode: 'daily' | 'weekly'
  stats: DailyStats[] | WeeklyStats[]
}

export default function StatsDisplay({ mode, stats }: StatsDisplayProps) {
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}h ${mins}m`
    }
    return `${mins}m`
  }

  return (
    <div className="space-y-4">
      <motion.h3 
        className="text-lg font-semibold"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {mode === 'daily' ? 'Daily Statistics' : 'Weekly Statistics'}
      </motion.h3>
      <div className="space-y-4">
        {mode === 'daily' && (stats as DailyStats[]).map((stat) => (
          <motion.div key={stat.date} className="bg-white dark:bg-black rounded-lg shadow-lg p-4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex justify-between mb-2">
              <span className="font-medium">{new Date(stat.date).toLocaleDateString()}</span>
              <span className="text-xs text-gray-500">Focus: {stat.focusScore}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>Work Sessions: <span className="font-semibold">{stat.workSessions}</span></div>
              <div>Tasks Completed: <span className="font-semibold">{stat.tasksCompleted}</span></div>
              <div>Total Work: <span className="font-semibold">{formatTime(stat.totalWorkTime)}</span></div>
              <div>Total Break: <span className="font-semibold">{formatTime(stat.totalBreakTime)}</span></div>
            </div>
          </motion.div>
        ))}
        {mode === 'weekly' && (stats as WeeklyStats[]).map((stat) => (
          <motion.div key={stat.weekStart} className="bg-white dark:bg-black rounded-lg shadow-lg p-4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex justify-between mb-2">
              <span className="font-medium">Week of {new Date(stat.weekStart).toLocaleDateString()}</span>
              <span className="text-xs text-gray-500">Avg Focus: {stat.averageFocusScore}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>Total Sessions: <span className="font-semibold">{stat.totalSessions}</span></div>
              <div>Total Work: <span className="font-semibold">{formatTime(stat.totalWorkTime)}</span></div>
              <div>Total Break: <span className="font-semibold">{formatTime(stat.totalBreakTime)}</span></div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}