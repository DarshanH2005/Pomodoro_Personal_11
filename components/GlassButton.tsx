import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface GlassButtonProps extends HTMLMotionProps<'button'> {
  children: React.ReactNode;
  className?: string;
}

export default function GlassButton({ children, className = '', ...props }: GlassButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      className={`relative overflow-hidden p-3 rounded-full glass flex items-center justify-center transition-all hover:border-primary/50 hover:shadow-[0_0_15px_rgba(251,191,36,0.3)] ${className}`}
      {...props}
    >
      {/* Animated light streak - CSS driven */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(120deg, rgba(255,255,255,0.0) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.0) 100%)',
          filter: 'blur(2px)',
          animation: 'shimmer 3s infinite linear',
          backgroundSize: '200% 100%',
        }}
      />
      {children}
    </motion.button>
  );
}