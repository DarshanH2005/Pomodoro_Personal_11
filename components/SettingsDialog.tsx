'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { PomodoroSettings } from '@/types'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { X, Volume2, VolumeX, Settings as SettingsIcon, Clock, Bell, Monitor, Moon } from 'lucide-react'
import { getSoundEffects } from '@/lib/soundEffects'
import PremiumButton from './PremiumButton'
import { cn } from '@/lib/utils'

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
    const soundEffects = getSoundEffects()
    soundEffects.stopAll()
    onClose()
  }

  // Custom Toggle Component
  const Toggle = ({ checked, onChange, label, description }: { checked: boolean, onChange: (checked: boolean) => void, label: string, description?: string }) => (
    <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/20 hover:bg-secondary/30 transition-colors">
      <div className="flex-1 pr-4">
        <label className="text-sm font-medium text-foreground block cursor-pointer" onClick={() => onChange(!checked)}>
          {label}
        </label>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">
            {description}
          </p>
        )}
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={cn(
          "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
          checked ? "bg-primary" : "bg-muted"
        )}
      >
        <span
          className={cn(
            "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
            checked ? "translate-x-6" : "translate-x-1"
          )}
        />
      </button>
    </div>
  )

  // Section Header Component
  const SectionHeader = ({ icon: Icon, title }: { icon: any, title: string }) => (
    <div className="flex items-center gap-2 mb-4 text-primary">
      <Icon className="w-5 h-5" />
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
    </div>
  )

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          <motion.div
            className="relative w-full max-w-2xl bg-card text-card-foreground rounded-[2rem] shadow-2xl border border-border/50 max-h-[85vh] flex flex-col overflow-hidden"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border/40 bg-card/50 backdrop-blur-xl sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-xl">
                  <SettingsIcon className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
              </div>
              <PremiumButton
                onClick={handleClose}
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-secondary/50"
              >
                <X className="h-5 w-5" />
              </PremiumButton>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">

              {/* Timer Settings */}
              <section>
                <SectionHeader icon={Clock} title="Timer Duration" />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { key: 'workDuration', label: 'Focus', max: 120 },
                    { key: 'shortBreakDuration', label: 'Short Break', max: 30 },
                    { key: 'longBreakDuration', label: 'Long Break', max: 60 }
                  ].map((item) => (
                    <div key={item.key} className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground block text-center">
                        {item.label}
                      </label>
                      <div className="relative group">
                        <input
                          type="number"
                          min="1"
                          max={item.max}
                          value={(settings as any)[item.key]}
                          onChange={(e) => handleChange(item.key as keyof PomodoroSettings, parseInt(e.target.value) || 1)}
                          className="w-full text-center bg-secondary/20 border-2 border-transparent focus:border-primary/50 rounded-xl py-3 text-xl font-bold outline-none transition-all group-hover:bg-secondary/30"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-medium">min</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Auto-start Settings */}
              <section>
                <SectionHeader icon={Monitor} title="Automation" />
                <div className="grid gap-3">
                  <Toggle
                    label="Auto-start Breaks"
                    description="Automatically start break timer when work session ends"
                    checked={settings.autoStartBreaks}
                    onChange={(val) => handleChange('autoStartBreaks', val)}
                  />
                  <Toggle
                    label="Auto-start Work"
                    description="Automatically start work timer when break ends"
                    checked={settings.autoStartWork}
                    onChange={(val) => handleChange('autoStartWork', val)}
                  />
                </div>
              </section>

              {/* Notification Settings */}
              <section>
                <SectionHeader icon={Bell} title="Notifications & Sound" />
                <div className="space-y-4">
                  <div className="grid gap-3">
                    <Toggle
                      label="Desktop Notifications"
                      description="Show system notifications when timer ends"
                      checked={settings.notifications}
                      onChange={(val) => handleChange('notifications', val)}
                    />
                    <Toggle
                      label="Sound Effects"
                      description="Play sounds for timer events"
                      checked={settings.soundEnabled}
                      onChange={(val) => handleChange('soundEnabled', val)}
                    />
                    <Toggle
                      label="Ticking Sound"
                      description="Play a ticking sound while timer is running"
                      checked={settings.timerTickEnabled}
                      onChange={(val) => handleChange('timerTickEnabled', val)}
                    />
                  </div>

                  {settings.soundEnabled && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="space-y-4 pt-2"
                    >
                      <div className="bg-secondary/20 p-4 rounded-xl space-y-4">
                        <div>
                          <label className="text-sm font-medium text-muted-foreground mb-2 block">Alert Sound</label>
                          <Select
                            value={settings.selectedSound}
                            onValueChange={(value) => handleChange('selectedSound', value)}
                          >
                            <SelectTrigger className="w-full bg-background border-border/50 h-10 rounded-lg">
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
                        </div>

                        <div>
                          <label className="text-sm font-medium text-muted-foreground mb-2 block">
                            Volume ({settings.volume}%)
                          </label>
                          <div className="flex items-center gap-3">
                            <VolumeX className="h-4 w-4 text-muted-foreground" />
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={settings.volume}
                              onChange={(e) => handleChange('volume', parseInt(e.target.value))}
                              className="flex-1 h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                            />
                            <Volume2 className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </section>

              {/* Theme Settings */}
              <section>
                <SectionHeader icon={Moon} title="Appearance" />
                <div className="bg-secondary/20 p-4 rounded-xl">
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">Theme Preference</label>
                  <Select
                    value={settings.theme}
                    onValueChange={(value) => handleChange('theme', value)}
                  >
                    <SelectTrigger className="w-full bg-background border-border/50 h-10 rounded-lg">
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
                </div>
              </section>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-border/40 bg-card/50 backdrop-blur-xl sticky bottom-0 z-10 flex justify-end">
              <PremiumButton
                onClick={handleClose}
                className="w-full sm:w-auto min-w-[100px]"
              >
                Done
              </PremiumButton>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}