'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Task } from '@/types'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Edit, Trash2, Play, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import PremiumButton from './PremiumButton'

interface TaskListProps {
  tasks: Task[]
  onAddTask: (task: Omit<Task, 'id'>) => void
  onUpdateTask: (id: string, updates: Partial<Task>) => void
  onDeleteTask: (id: string) => void
  onToggleComplete: (id: string) => void
  onSelectTask: (task: Task) => void
  currentTask: Task | null
}

export default function TaskList({
  tasks,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onToggleComplete,
  onSelectTask,
  currentTask
}: TaskListProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high'
  })

  const handleAddTask = () => {
    if (newTask.title.trim()) {
      onAddTask({
        ...newTask,
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      setNewTask({
        title: '',
        description: '',
        priority: 'medium'
      })
      setIsAdding(false)
    }
  }

  const handleUpdateTask = (id: string) => {
    const task = tasks.find(t => t.id === id)
    if (task) {
      onUpdateTask(id, {
        title: newTask.title || task.title,
        description: newTask.description || task.description,
        priority: newTask.priority
      })
      setEditingId(null)
      setNewTask({
        title: '',
        description: '',
        priority: 'medium'
      })
    }
  }

  const startEditing = (task: Task) => {
    setEditingId(task.id)
    setNewTask({
      title: task.title,
      description: task.description || '',
      priority: task.priority
    })
  }

  const getPriorityColor = (priority: 'low' | 'medium' | 'high') => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-black dark:text-gray-200'
    }
  }

  const taskVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -20, scale: 0.95 }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  return (
    <div className="space-y-4">
      <motion.div
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="text-lg font-semibold">Tasks</h3>
        <PremiumButton
          onClick={() => setIsAdding(true)}
          size="sm"
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Task
        </PremiumButton>
      </motion.div>

      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-gray-50 dark:bg-black rounded-lg p-4 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h4 className="font-medium">New Task</h4>
              <motion.button
                onClick={() => setIsAdding(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="h-5 w-5" />
              </motion.button>
            </div>

            <input
              type="text"
              placeholder="Task title"
              value={newTask.title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTask({ ...newTask, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-black dark:border-gray-600 dark:text-white"
            />

            <textarea
              placeholder="Task description (optional)"
              value={newTask.description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewTask({ ...newTask, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-black dark:border-gray-600 dark:text-white"
              rows={3}
            />

            <div className="grid grid-cols-2 gap-4">
              <Select
                value={newTask.priority}
                onValueChange={(value: 'low' | 'medium' | 'high') => setNewTask({ ...newTask, priority: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <PremiumButton
                onClick={handleAddTask}
                size="sm"
              >
                Add Task
              </PremiumButton>
              <PremiumButton
                onClick={() => setIsAdding(false)}
                variant="secondary"
                size="sm"
              >
                Cancel
              </PremiumButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="space-y-3"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence>
          {tasks.map((task) => (
            <motion.div
              key={task.id}
              variants={taskVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              layout
              className={`p-4 rounded-lg border transition-all duration-200 ${currentTask?.id === task.id
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-900 bg-white dark:bg-black'
                } ${task.completed ? 'opacity-60' : ''}`}
            >
              {editingId === task.id ? (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Edit Task</h4>
                    <motion.button
                      onClick={() => setEditingId(null)}
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <X className="h-5 w-5" />
                    </motion.button>
                  </div>

                  <input
                    type="text"
                    placeholder="Task title"
                    value={newTask.title}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTask({ ...newTask, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-black dark:border-gray-600 dark:text-white"
                  />

                  <textarea
                    placeholder="Task description (optional)"
                    value={newTask.description}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewTask({ ...newTask, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-black dark:border-gray-600 dark:text-white"
                    rows={3}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <Select
                      value={newTask.priority}
                      onValueChange={(value: 'low' | 'medium' | 'high') => setNewTask({ ...newTask, priority: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex gap-2">
                    <PremiumButton
                      onClick={() => handleUpdateTask(task.id)}
                      size="sm"
                    >
                      Update Task
                    </PremiumButton>
                    <PremiumButton
                      onClick={() => setEditingId(null)}
                      variant="secondary"
                      size="sm"
                    >
                      Cancel
                    </PremiumButton>
                  </div>
                </motion.div>
              ) : (
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => onToggleComplete(task.id)}
                        className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </motion.div>

                    <div className="flex-1 min-w-0">
                      <motion.h4
                        className={`font-medium ${task.completed ? 'line-through text-gray-500' : ''}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        {task.title}
                      </motion.h4>
                      {task.description && (
                        <motion.p
                          className="text-sm text-gray-600 dark:text-gray-400 mt-1"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3, delay: 0.1 }}
                        >
                          {task.description}
                        </motion.p>
                      )}

                      <motion.div
                        className="flex items-center gap-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                      >
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(task.priority)}`}>
                          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                        </span>
                      </motion.div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    {!task.completed && (
                      <PremiumButton
                        onClick={() => onSelectTask(task)}
                        variant="icon"
                        size="icon"
                        className="h-8 w-8 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/20"
                        title="Start working on this task"
                      >
                        <Play className="h-4 w-4" />
                      </PremiumButton>
                    )}

                    <PremiumButton
                      onClick={() => startEditing(task)}
                      variant="icon"
                      size="icon"
                      className="h-8 w-8 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                      title="Edit task"
                    >
                      <Edit className="h-4 w-4" />
                    </PremiumButton>

                    <PremiumButton
                      onClick={() => onDeleteTask(task.id)}
                      variant="icon"
                      size="icon"
                      className="h-8 w-8 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20"
                      title="Delete task"
                    >
                      <Trash2 className="h-4 w-4" />
                    </PremiumButton>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {tasks.length === 0 && (
        <motion.div
          className="text-center py-8 text-gray-500 dark:text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <p>No tasks yet. Add your first task to get started!</p>
        </motion.div>
      )}
    </div>
  )
}