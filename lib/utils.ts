import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { getSoundEffects } from "./soundEffects"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

export function getWeekStart(date: Date): Date {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day
  return new Date(d.setDate(diff))
}

export function getWeekEnd(date: Date): Date {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + 6
  return new Date(d.setDate(diff))
}



// These functions are kept for backward compatibility but modified to not use browser notifications
export function requestNotificationPermission() {
  return Promise.resolve('granted');
}

export function showNotification(title: string, body: string) {
  // Do nothing - we'll use the in-app notification instead
  // The notification dialog is controlled by the needsConfirmation flag in timerState
}

export function closeNotification() {
  // Do nothing - we'll use the in-app notification instead
}

/**
 * Stops all notifications (sound and visual)
 */
export function stopAllNotifications() {
  if (typeof window !== 'undefined') {
    const soundEffects = getSoundEffects();
    soundEffects.stopAll();
  }
}

/**
 * Plays a button click sound
 */
export function playButtonClickSound() {
  if (typeof window !== 'undefined') {
    const soundEffects = getSoundEffects();
    soundEffects.play("buttonClick");
  }
}

/**
 * Plays a timer tick sound
 */
export function playTimerTickSound() {
  if (typeof window !== 'undefined') {
    const soundEffects = getSoundEffects();
    soundEffects.play("timerTick", { volume: 0.2 });
  }
}

export function playSoundEffect(type: string, volume: number) {
  if (typeof window !== 'undefined') {
    try {
      const soundEffects = getSoundEffects();
      soundEffects.play(type as any, { volume });
    } catch (error) {
      console.error(`Error in playSoundEffect:`, error);
    }
  }
}