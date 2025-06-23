'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { PomodoroSettings } from '@/types'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { X, Volume2, VolumeX, Settings as SettingsIcon } from 'lucide-react'
import { getSoundEffects } from '@/lib/soundEffects'

interface SettingsDialogProps {
  isOpen: boolean
  onClose: () => void
  settings: PomodoroSettings
  onUpdateSettings: (settings: PomodoroSettings) => void
}

export default function SettingsDialog({
  isOpen,
  onClose,
  settings,
  onUpdateSettings
}: SettingsDialogProps) {
  const handleChange = (key: keyof PomodoroSettings, value: any) => {
    onUpdateSettings({
      ...settings,
      [key]: value
    })
  }

  const soundOptions = [
    { value: 'workComplete', label: 'Work Complete' },
    { value: 'breakComplete', label: 'Break Complete' },
    { value: 'bell', label: 'Bell' },
    { value: 'chime', label: 'Chime' },
    { value: 'ding', label: 'Ding' },
    { value: 'xylophone', label: 'Xylophone' },
    { value: 'workSessionOver', label: 'Work Session Over' },
    { value: 'breakOver', label: 'Break Over' }
  ]

  const themeOptions = [
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
    { value: 'system', label: 'System' }
  ]

  const handleClose = () => {
    // Stop all sounds when closing the dialog
    const soundEffects = getSoundEffects()
    soundEffects.stopAll()
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="bg-white dark:bg-black rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.8, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 20 }}
            transition={{ duration: 0.4, type: "spring", stiffness: 300 }}
          >
            {/* Header */}
            <motion.div 
              className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-900"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <SettingsIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </motion.div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h2>
              </div>
              <motion.button
                onClick={handleClose}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="h-6 w-6" />
              </motion.button>
            </motion.div>

            {/* Content */}
            <div className="p-6 space-y-8">
              {/* Timer Settings */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Timer Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <motion.div
                    whileHover={{ y: -2 }}
                    transition={{ duration: 0.2 }}
                  >
                    <label htmlFor="workDuration" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Work Duration (minutes)
                    </label>
                    <input
                      id="workDuration"
                      type="number"
                      min="1"
                      max="120"
                      value={Number.isFinite(settings.workDuration) ? settings.workDuration : 25}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('workDuration', parseInt(e.target.value))}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-900 dark:border-gray-600 dark:text-white"
                    />
                  </motion.div>
                  
                  <motion.div
                    whileHover={{ y: -2 }}
                    transition={{ duration: 0.2 }}
                  >
                    <label htmlFor="shortBreakDuration" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Short Break (minutes)
                    </label>
                    <input
                      id="shortBreakDuration"
                      type="number"
                      min="1"
                      max="30"
                      value={Number.isFinite(settings.shortBreakDuration) ? settings.shortBreakDuration : 5}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('shortBreakDuration', parseInt(e.target.value))}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-900 dark:border-gray-600 dark:text-white"
                    />
                  </motion.div>
                  
                  <motion.div
                    whileHover={{ y: -2 }}
                    transition={{ duration: 0.2 }}
                  >
                    <label htmlFor="longBreakDuration" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Long Break Duration (minutes)
                    </label>
                    <input
                      id="longBreakDuration"
                      type="number"
                      min="1"
                      max="60"
                      value={Number.isFinite(settings.longBreakDuration) ? settings.longBreakDuration : 15}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('longBreakDuration', parseInt(e.target.value))}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-900 dark:border-gray-600 dark:text-white"
                    />
                  </motion.div>
                </div>
              </motion.div>

              {/* Auto-start Settings */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Auto-start Settings</h3>
                <div className="space-y-4">
                  <motion.div 
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Auto-start breaks
                      </label>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Automatically start break timer when work session ends
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.autoStartBreaks}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('autoStartBreaks', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-900 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </motion.div>
                  
                  <motion.div 
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Auto-start work sessions
                      </label>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Automatically start work timer when break ends
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.autoStartWork}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('autoStartWork', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-900 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </motion.div>
                </div>
              </motion.div>

              {/* Notification Settings */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Notification Settings</h3>
                <div className="space-y-4">
                  <motion.div 
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Enable notifications
                      </label>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Show desktop notifications when timer ends
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.notifications}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('notifications', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-900 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </motion.div>
                  
                  <motion.div 
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Enable sounds
                      </label>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Play sound effects for notifications
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.soundEnabled}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('soundEnabled', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-900 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </motion.div>
                  
                  <motion.div 
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Timer tick sounds
                      </label>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Play tick sound during countdown
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.timerTickEnabled}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('timerTickEnabled', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-900 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </motion.div>
                </div>
              </motion.div>

              {/* Sound Settings */}
              {settings.soundEnabled && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Sound Settings</h3>
                  <div className="space-y-4">
                    <motion.div
                      whileHover={{ y: -2 }}
                      transition={{ duration: 0.2 }}
                    >
                      <label htmlFor="selectedSound" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Notification Sound
                      </label>
                      <Select
                        value={settings.selectedSound}
                        onValueChange={(value: any) => handleChange('selectedSound', value)}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {soundOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </motion.div>
                    
                    <motion.div
                      whileHover={{ y: -2 }}
                      transition={{ duration: 0.2 }}
                    >
                      <label htmlFor="volume" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Volume ({settings.volume}%)
                      </label>
                      <div className="flex items-center gap-2 mt-1">
                        <VolumeX className="h-4 w-4 text-gray-400" />
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={settings.volume}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('volume', parseInt(e.target.value))}
                          className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                        />
                        <Volume2 className="h-4 w-4 text-gray-400" />
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              )}

              {/* Theme Settings */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Theme Settings</h3>
                <motion.div
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.2 }}
                >
                  <label htmlFor="theme" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Theme
                  </label>
                  <Select
                    value={settings.theme}
                    onValueChange={(value: any) => handleChange('theme', value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {themeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </motion.div>
              </motion.div>
            </div>

            {/* Footer */}
            <motion.div 
              className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-900"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <motion.button
                onClick={handleClose}
                className="px-6 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 dark:text-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Close
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}