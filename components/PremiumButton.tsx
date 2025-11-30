'use client'

import { motion, HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/utils'

interface PremiumButtonProps extends HTMLMotionProps<"button"> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'icon'
    size?: 'sm' | 'md' | 'lg' | 'icon'
    children: React.ReactNode
    className?: string
}

export default function PremiumButton({
    variant = 'primary',
    size = 'md',
    children,
    className,
    ...props
}: PremiumButtonProps) {
    const baseStyles = "relative inline-flex items-center justify-center rounded-2xl font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:pointer-events-none overflow-hidden"

    const variants = {
        primary: "bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        icon: "p-0 bg-transparent hover:bg-accent/50 text-foreground"
    }

    const sizes = {
        sm: "h-9 px-4 text-sm",
        md: "h-12 px-6 text-base",
        lg: "h-16 px-10 text-lg",
        icon: "h-12 w-12"
    }

    return (
        <motion.button
            className={cn(baseStyles, variants[variant], sizes[size], className)}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.95, y: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            {...props}
        >
            {/* Subtle shimmer effect on hover for primary buttons */}
            {variant === 'primary' && (
                <motion.div
                    className="absolute inset-0 -z-10 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                />
            )}
            {children}
        </motion.button>
    )
}
