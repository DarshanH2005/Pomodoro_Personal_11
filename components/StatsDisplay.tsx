'use client'

import { motion } from 'framer-motion'
import { DailyStats, WeeklyStats } from '@/types'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts'

import { Clock, CheckCircle2, Zap, TrendingUp } from 'lucide-react'

interface StatsDisplayProps {
  mode: 'daily' | 'weekly'
  stats: DailyStats[] | WeeklyStats[]
}

export default function StatsDisplay({ mode, stats }: StatsDisplayProps) {
  // Helper to format minutes to hours
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) return `${hours}h ${mins}m`
    return `${mins}m`
  }

  // Calculate Totals
  const totalWorkMinutes = stats.reduce((acc, curr) => acc + curr.totalWorkTime, 0)
  const totalSessions = stats.reduce((acc, curr) => {
    if ('workSessions' in curr) return acc + curr.workSessions
    if ('totalSessions' in curr) return acc + curr.totalSessions
    return acc
  }, 0)

  // Calculate Average Focus Score
  const avgFocusScore = Math.round(
    stats.reduce((acc, curr) => {
      if ('focusScore' in curr) return acc + curr.focusScore
      if ('averageFocusScore' in curr) return acc + curr.averageFocusScore
      return acc
    }, 0) / (stats.length || 1)
  )

  // Prepare Data for Charts
  const chartData = stats.map(stat => {
    const dateLabel = 'date' in stat
      ? new Date(stat.date).toLocaleDateString('en-US', { weekday: 'short' })
      : new Date(stat.weekStart).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

    return {
      name: dateLabel,
      Work: Math.round(stat.totalWorkTime / 60 * 10) / 10, // Hours
      Break: Math.round(stat.totalBreakTime / 60 * 10) / 10, // Hours
      Sessions: 'workSessions' in stat ? stat.workSessions : stat.totalSessions,
      Score: 'focusScore' in stat ? stat.focusScore : stat.averageFocusScore
    }
  }).reverse() // Show oldest to newest

  // Pie Chart Data
  const pieData = [
    { name: 'Focus', value: totalWorkMinutes, color: '#3b82f6' }, // blue-500
    { name: 'Break', value: stats.reduce((acc, curr) => acc + curr.totalBreakTime, 0), color: '#10b981' } // emerald-500
  ]

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border/50 p-3 rounded-xl shadow-xl">
          <p className="font-medium mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-muted-foreground">{entry.name}:</span>
              <span className="font-medium">
                {entry.name === 'Work' || entry.name === 'Break' ? `${entry.value}h` : entry.value}
              </span>
            </div>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-6 pb-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-secondary/20 p-4 rounded-2xl border border-border/50"
        >
          <div className="flex items-center gap-2 text-primary mb-2">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-medium">Total Focus</span>
          </div>
          <p className="text-2xl font-bold">{formatTime(totalWorkMinutes)}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-secondary/20 p-4 rounded-2xl border border-border/50"
        >
          <div className="flex items-center gap-2 text-primary mb-2">
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-sm font-medium">Sessions</span>
          </div>
          <p className="text-2xl font-bold">{totalSessions}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-secondary/20 p-4 rounded-2xl border border-border/50"
        >
          <div className="flex items-center gap-2 text-primary mb-2">
            <Zap className="w-4 h-4" />
            <span className="text-sm font-medium">Avg Focus</span>
          </div>
          <p className="text-2xl font-bold">{avgFocusScore}%</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-secondary/20 p-4 rounded-2xl border border-border/50"
        >
          <div className="flex items-center gap-2 text-primary mb-2">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-medium">Trend</span>
          </div>
          <p className="text-2xl font-bold text-green-500">+12%</p>
        </motion.div>
      </div>

      {/* Activity Chart */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-card border border-border/50 rounded-3xl p-6 shadow-sm"
      >
        <h3 className="text-lg font-semibold mb-6">Activity Overview</h3>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(128,128,128,0.2)" />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'currentColor', fontSize: 12, opacity: 0.7 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'currentColor', fontSize: 12, opacity: 0.7 }}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(128,128,128,0.1)', radius: 8 }} />
              <Bar dataKey="Work" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={40} />
              <Bar dataKey="Break" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Distribution & Trends Grid */}
      <div className="grid grid-cols-1 gap-6">
        {/* Pie Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-card border border-border/50 rounded-3xl p-6 shadow-sm"
        >
          <h3 className="text-lg font-semibold mb-4">Focus Distribution</h3>
          <div className="h-[200px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  )
}