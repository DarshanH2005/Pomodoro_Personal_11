'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, X, Check, RotateCcw } from 'lucide-react'
import PremiumButton from './PremiumButton'

import { MagicCard } from '@/components/ui/magic-card'

interface RoutineItem {
    id: string
    text: string
    completed: boolean
}

export default function DailyRoutine() {
    const [items, setItems] = useState<RoutineItem[]>([])
    const [newItemText, setNewItemText] = useState('')
    const [isAdding, setIsAdding] = useState(false)
    const [mounted, setMounted] = useState(false)

    // Load from localStorage on mount
    useEffect(() => {
        setMounted(true)
        const saved = localStorage.getItem('dailyRoutine')
        if (saved) {
            try {
                setItems(JSON.parse(saved))
            } catch (e) {
                console.error('Failed to parse daily routine', e)
            }
        } else {
            // Default items
            setItems([
                { id: '1', text: 'Morning Planning', completed: false },
                { id: '2', text: 'Check Emails', completed: false },
            ])
        }
    }, [])

    // Save to localStorage whenever items change
    useEffect(() => {
        if (mounted) {
            localStorage.setItem('dailyRoutine', JSON.stringify(items))
        }
    }, [items, mounted])

    const addItem = () => {
        if (!newItemText.trim()) return
        const newItem: RoutineItem = {
            id: Date.now().toString(),
            text: newItemText.trim(),
            completed: false
        }
        setItems([...items, newItem])
        setNewItemText('')
        setIsAdding(false)
    }

    const toggleItem = (id: string) => {
        setItems(items.map(item =>
            item.id === id ? { ...item, completed: !item.completed } : item
        ))
    }

    const deleteItem = (id: string) => {
        setItems(items.filter(item => item.id !== id))
    }

    const resetDaily = () => {
        setItems(items.map(item => ({ ...item, completed: false })))
    }

    if (!mounted) return null

    return (
        <MagicCard className="bg-card text-card-foreground rounded-[2rem] shadow-sm border border-border/50 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                    <span className="text-xl">☀️</span> Daily Routine
                </h3>
                <div className="flex gap-2">
                    <PremiumButton
                        onClick={resetDaily}
                        variant="secondary"
                        size="icon"
                        className="h-8 w-8"
                        title="Reset for new day"
                    >
                        <RotateCcw className="h-4 w-4" />
                    </PremiumButton>
                    <PremiumButton
                        onClick={() => setIsAdding(true)}
                        size="icon"
                        className="h-8 w-8"
                        title="Add routine item"
                    >
                        <Plus className="h-4 w-4" />
                    </PremiumButton>
                </div>
            </div>

            <AnimatePresence>
                {isAdding && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-4 flex gap-2"
                    >
                        <input
                            type="text"
                            value={newItemText}
                            onChange={(e) => setNewItemText(e.target.value)}
                            placeholder="New routine item..."
                            className="flex-1 px-3 py-2 rounded-lg bg-secondary/30 border-none focus:ring-2 focus:ring-primary/50 outline-none"
                            onKeyDown={(e) => e.key === 'Enter' && addItem()}
                            autoFocus
                        />
                        <PremiumButton onClick={addItem} size="sm">Add</PremiumButton>
                        <PremiumButton onClick={() => setIsAdding(false)} variant="secondary" size="sm">Cancel</PremiumButton>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="space-y-2">
                {items.length === 0 && (
                    <p className="text-muted-foreground text-sm text-center py-4">No routine items yet.</p>
                )}
                <AnimatePresence>
                    {items.map(item => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className={`group flex items-center justify-between p-3 rounded-xl transition-colors ${item.completed ? 'bg-primary/5' : 'bg-secondary/20 hover:bg-secondary/40'
                                }`}
                        >
                            <div className="flex items-center gap-3 flex-1 cursor-pointer" onClick={() => toggleItem(item.id)}>
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${item.completed ? 'bg-primary border-primary' : 'border-muted-foreground'
                                    }`}>
                                    {item.completed && <Check className="w-3 h-3 text-primary-foreground" />}
                                </div>
                                <span className={`font-medium transition-all ${item.completed ? 'text-muted-foreground line-through' : ''
                                    }`}>
                                    {item.text}
                                </span>
                            </div>
                            <button
                                onClick={() => deleteItem(item.id)}
                                className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all p-1"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </MagicCard>
    )
}
