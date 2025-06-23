'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { PomodoroSession, Task, PomodoroSettings, TimerState, TimerMode } from '@/types'
import { showNotification, stopAllNotifications, playButtonClickSound, playTimerTickSound, playSoundEffect } from '@/lib/utils'
import { getSoundEffects } from '@/lib/soundEffects'
import { saveSession, saveTask, updateTaskCompletion } from '@/services/dbService'

// Define SoundType for the hook
type SoundType = 'workComplete' | 'breakComplete' | 'buttonClick' | 'timerTick' | 'bell' | 'chime' | 'ding' | 'xylophone';

export const DEFAULT_SETTINGS: PomodoroSettings = {
  workDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  autoStartBreaks: false,
  autoStartWork: false,
  notifications: true,
  soundEnabled: true,
  timerTickEnabled: false, // Disabled by default to avoid annoying beeps
  volume: 100, // Set default volume to 100
  theme: 'system',
  selectedSound: 'workSessionOver'
}

export function usePomodoro() {
  const [settings, setSettings] = useState<PomodoroSettings>(DEFAULT_SETTINGS)
  const [timerState, setTimerState] = useState<TimerState>({
    isRunning: false,
    isPaused: false,
    currentSession: null,
    timeRemaining: DEFAULT_SETTINGS.workDuration * 60,
    currentTask: null,
    sessionCount: 0,
    completedSessions: []
  })
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const [currentMode, setCurrentMode] = useState<TimerMode>('work')
  const [isClient, setIsClient] = useState(false)
  const startTimeRef = useRef<number | null>(null)
  const initialDurationRef = useRef<number | null>(null)

  // Set client flag on mount
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Load settings from localStorage
  useEffect(() => {
    if (isClient && typeof window !== 'undefined') {
      const savedSettings = localStorage.getItem('pomodoroSettings')
      if (savedSettings) {
        try {
          const parsed = JSON.parse(savedSettings)
          setSettings(parsed)
          setTimerState(prev => ({
            ...prev,
            timeRemaining: parsed.workDuration * 60
          }))
        } catch (error) {
          console.error('Failed to parse saved settings:', error)
        }
      }
    }
  }, [isClient])

  // Save settings to localStorage
  useEffect(() => {
    if (isClient && typeof window !== 'undefined') {
      localStorage.setItem('pomodoroSettings', JSON.stringify(settings))
    }
  }, [settings, isClient])

  const getDurationForMode = useCallback((mode: TimerMode): number => {
    switch (mode) {
      case 'work':
        return settings.workDuration * 60
      case 'shortBreak':
        return settings.shortBreakDuration * 60
      case 'longBreak':
        return settings.longBreakDuration * 60
      default:
        return settings.workDuration * 60
    }
  }, [settings])

  const getNextMode = useCallback((): TimerMode => {
    if (currentMode === 'work') {
      return 'shortBreak'
    }
    return 'work'
  }, [currentMode])

  const createSession = useCallback((mode: TimerMode, taskId?: string): PomodoroSession => {
    return {
      id: Date.now().toString(),
      mode: mode,
      duration: getDurationForMode(mode),
      startTime: new Date(),
      completed: false,
      taskId
    }
  }, [getDurationForMode])

  const playSound = useCallback(
    (type: SoundType) => {
      if (settings.soundEnabled) {
        const soundToPlay = type === 'workComplete' || type === 'breakComplete' ? settings.selectedSound : type;
        playSoundEffect(soundToPlay, settings.volume)
      }
    },
    [settings.soundEnabled, settings.volume, settings.selectedSound]
  )

  const completeSession = useCallback(async () => {
    if (!timerState.currentSession) {
      console.log('❌ No current session found, cannot complete')
      return
    }

    console.log('🎯 Timer session completing!', { 
      currentMode, 
      sessionCount: timerState.sessionCount,
      timeRemaining: timerState.timeRemaining,
      isRunning: timerState.isRunning,
      isPaused: timerState.isPaused
    })

    const completedSession: PomodoroSession = {
      ...timerState.currentSession,
      endTime: new Date(),
      completed: true
    }

    // Play completion sound (looping until confirmed)
    if (settings.soundEnabled) {
      let soundType: 'workSessionOver' | 'breakOver';
      if (currentMode === 'work') {
        soundType = 'workSessionOver';
      } else {
        soundType = 'breakOver';
      }
      console.log('🔊 Playing completion sound:', soundType)
      const soundEffects = getSoundEffects()
      soundEffects.playNotification(soundType)
    }

    // Don't auto-start next session until user confirms
    const nextMode = getNextMode()
    console.log('🔄 Switching to next mode:', nextMode)
    setCurrentMode(nextMode)
    
    console.log('📝 Setting timer state with needsConfirmation: true')
    
    // Combine all state updates into a single call
    setTimerState((prev: TimerState) => {
      console.log('📝 Setting timer state with needsConfirmation: true', {
        prevNeedsConfirmation: prev.needsConfirmation,
        newNeedsConfirmation: true
      })
      return {
        ...prev,
        completedSessions: [...prev.completedSessions, completedSession],
        sessionCount: currentMode === 'work' ? prev.sessionCount + 1 : prev.sessionCount,
        isRunning: false,
        isPaused: false,
        currentSession: null,
        timeRemaining: getDurationForMode(nextMode),
        needsConfirmation: true, // Add flag to indicate notification needs confirmation
        completedSessionMode: currentMode // Store the mode that just completed
      }
    })

    // Save session to MongoDB
    try {
      await saveSession(completedSession)
    } catch (error) {
      console.error('Failed to save session to database:', error)
    }

    // Update task if one is assigned
    if (timerState.currentTask && currentMode === 'work') {
      // Task completion is now handled separately through the task list
      // No automatic pomodoro tracking
    }

    // Show notification
    if (settings.notifications) {
      const completedMode = completedSession.mode
      const title = completedMode === 'work' ? 'Work Session Complete!' : 'Break Time Over!'
      const body = completedMode === 'work' 
        ? 'Time for a break! You\'ve earned it.' 
        : 'Ready to get back to work?'
      showNotification(title, body)
    }
    
    console.log('✅ completeSession function finished')
  }, [timerState.currentSession, timerState.currentTask, currentMode, settings, getNextMode, getDurationForMode, playSound])

  // Timer countdown effect
  useEffect(() => {
    if (timerState.isRunning && !timerState.isPaused) {
      // Set start time if not already set
      if (!startTimeRef.current) {
        startTimeRef.current = Date.now()
        initialDurationRef.current = timerState.timeRemaining
      }
      intervalRef.current = setInterval(() => {
        setTimerState((prev: TimerState) => {
          if (!startTimeRef.current || !initialDurationRef.current) return prev
          const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000)
          const newTimeRemaining = Math.max(initialDurationRef.current - elapsed, 0)
          // Play tick sound every minute if enabled (less frequent than 30 seconds)
          if (settings.soundEnabled && settings.timerTickEnabled && newTimeRemaining % 60 === 0 && newTimeRemaining > 0) {
            console.log('⏱️ Playing timer tick sound at', newTimeRemaining, 'seconds')
            playTimerTickSound()
          }
          if (newTimeRemaining <= 0) {
            console.log('⏰ Timer reached zero! Calling completeSession...')
            if (intervalRef.current) {
              clearInterval(intervalRef.current)
              intervalRef.current = null
            }
            setTimeout(() => {
              completeSession()
            }, 100)
            return { ...prev, timeRemaining: 0 }
          }
          return {
            ...prev,
            timeRemaining: newTimeRemaining
          }
        })
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      // Reset start time when timer is stopped or paused
      startTimeRef.current = null
      initialDurationRef.current = null
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [timerState.isRunning, timerState.isPaused, settings.soundEnabled, settings.timerTickEnabled, completeSession])

  const startTimer = useCallback((mode?: TimerMode, task?: Task) => {
    // Removed button click sound
    const timerMode = mode || currentMode
    const session = createSession(timerMode, task?.id)
    setCurrentMode(timerMode)
    // Reset start time and initial duration
    startTimeRef.current = null
    initialDurationRef.current = null
    setTimerState((prev: TimerState) => ({
      ...prev,
      isRunning: true,
      isPaused: false,
      currentSession: session,
      currentTask: task || prev.currentTask,
      timeRemaining: session.duration
    }))
  }, [currentMode, createSession])

  const pauseTimer = useCallback(() => {
    // Removed button click sound
    startTimeRef.current = null
    initialDurationRef.current = null
    setTimerState((prev: TimerState) => ({
      ...prev,
      isPaused: true
    }))
  }, [])

  const resumeTimer = useCallback(() => {
    // Removed button click sound
    setTimerState((prev: TimerState) => ({
      ...prev,
      isPaused: false
    }))
  }, [])

  const stopTimer = useCallback(() => {
    // Removed button click sound
    startTimeRef.current = null
    initialDurationRef.current = null
    setTimerState((prev: TimerState) => ({
      ...prev,
      isRunning: false,
      isPaused: false,
      currentSession: null,
      timeRemaining: getDurationForMode(currentMode)
    }))
  }, [currentMode, getDurationForMode])

  const resetTimer = useCallback(() => {
    // Removed button click sound
    startTimeRef.current = null
    initialDurationRef.current = null
    setTimerState((prev: TimerState) => ({
      ...prev,
      isRunning: false,
      isPaused: false,
      currentSession: null,
      timeRemaining: getDurationForMode(currentMode),
      sessionCount: 0,
      completedSessions: []
    }))
    setCurrentMode('work')
  }, [currentMode, getDurationForMode])

  const switchMode = useCallback((mode: TimerMode) => {
    // Removed button click sound
    setCurrentMode(mode)
    setTimerState((prev: TimerState) => ({
      ...prev,
      isRunning: false,
      isPaused: false,
      currentSession: null,
      timeRemaining: getDurationForMode(mode)
    }))
  }, [getDurationForMode])

  const updateSettings = useCallback((newSettings: Partial<PomodoroSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }))
  }, [])

  // Add function to confirm notification and continue
  const confirmNotification = useCallback(() => {
    // Removed button click sound
    // Stop all notifications (sound)
    stopAllNotifications()
    // Clear the notification flag
    setTimerState((prev: TimerState) => ({
      ...prev,
      needsConfirmation: false,
      completedSessionMode: undefined
    }))
    // If work session completed, automatically transition to short break
    if (currentMode === 'work') {
      // Switch to short break (or long break if it's time for one)
      const nextMode = 'shortBreak'
      switchMode(nextMode)
      if (settings.autoStartBreaks) {
        startTimer()
      }
    } else if (settings.autoStartWork && (currentMode === 'shortBreak' || currentMode === 'longBreak')) {
      // Auto-start work if coming from a break (if enabled in settings)
      switchMode('work')
      startTimer()
    }
  }, [settings.autoStartWork, settings.autoStartBreaks, currentMode, timerState.sessionCount, switchMode, startTimer])

  // Add after the other useEffects
  useEffect(() => {
    let newTime = 0;
    switch (currentMode) {
      case 'work':
        newTime = settings.workDuration * 60;
        break;
      case 'shortBreak':
        newTime = settings.shortBreakDuration * 60;
        break;
      case 'longBreak':
        newTime = settings.longBreakDuration * 60;
        break;
      default:
        newTime = settings.workDuration * 60;
    }
    setTimerState((prev: TimerState) => ({
      ...prev,
      timeRemaining: newTime
    }));
    startTimeRef.current = null;
    initialDurationRef.current = null;
  }, [settings.workDuration, settings.shortBreakDuration, settings.longBreakDuration, currentMode]);

  return {
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
  }
}