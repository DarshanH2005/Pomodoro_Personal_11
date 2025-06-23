'use client'

import React, { useRef, useEffect } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Text, useTexture } from '@react-three/drei'
import { TimerMode } from '@/types'

interface ThreeJsTimerProps {
  timeRemaining: number
  totalTime: number
  currentMode: TimerMode
  isRunning: boolean
  isPaused: boolean
}

// Helper function to format time
const formatTimeForDisplay = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
}

// Colors for different modes
const getModeColor = (mode: TimerMode): string => {
  switch (mode) {
    case 'work':
      return '#3b82f6' // blue-500
    case 'shortBreak':
      return '#10b981' // green-500
    case 'longBreak':
      return '#6366f1' // indigo-500
    default:
      return '#6b7280' // gray-500
  }
}

// The actual 3D timer component
function Timer({ timeRemaining, totalTime, currentMode, isRunning, isPaused }: ThreeJsTimerProps) {
  const ringRef = useRef<THREE.Mesh>(null)
  const particlesRef = useRef<THREE.Points>(null)
  const textRef = useRef<any>(null)
  
  // Calculate progress
  const progress = totalTime > 0 ? (totalTime - timeRemaining) / totalTime : 0
  
  // Get color based on mode
  const color = getModeColor(currentMode)
  
  // Animation frame
  useFrame((state, delta) => {
    if (ringRef.current) {
      // Rotate the ring slowly
      ringRef.current.rotation.z -= delta * 0.1
      
      // Update ring scale based on progress
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.02
      ringRef.current.scale.set(scale, scale, 1)
    }
    
    if (particlesRef.current) {
      // Rotate particles
      particlesRef.current.rotation.z -= delta * 0.05
    }
    
    if (textRef.current) {
      // Make text pulse slightly
      const textScale = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.05
      textRef.current.scale.set(textScale, textScale, 1)
    }
  })
  
  // Create particles
  const particleCount = 100
  const particlePositions = new Float32Array(particleCount * 3)
  
  for (let i = 0; i < particleCount; i++) {
    const angle = (i / particleCount) * Math.PI * 2
    const radius = 2 + Math.random() * 0.5
    
    particlePositions[i * 3] = Math.cos(angle) * radius
    particlePositions[i * 3 + 1] = Math.sin(angle) * radius
    particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 0.5
  }
  
  return (
    <>
      {/* Background sphere */}
      <mesh>
        <sphereGeometry args={[5, 32, 32]} />
        <meshBasicMaterial color="#000000" side={THREE.BackSide} transparent opacity={0.8} />
      </mesh>
      
      {/* Progress ring */}
      <mesh ref={ringRef}>
        <ringGeometry args={[1.8, 2, 64, 1, 0, Math.PI * 2 * progress]} />
        <meshBasicMaterial color={color} side={THREE.DoubleSide} />
      </mesh>
      
      {/* Background ring */}
      <mesh>
        <ringGeometry args={[1.8, 2, 64]} />
        <meshBasicMaterial color="#374151" opacity={0.3} transparent side={THREE.DoubleSide} />
      </mesh>
      
      {/* Time text */}
      <Text
        ref={textRef}
        position={[0, 0, 0]}
        fontSize={0.5}
        color={color}
        anchorX="center"
        anchorY="middle"
        font="/fonts/Inter-Bold.woff"
      >
        {formatTimeForDisplay(timeRemaining)}
      </Text>
      
      {/* Status text */}
      <Text
        position={[0, -0.7, 0]}
        fontSize={0.2}
        color="#e5e7eb"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Inter-Regular.woff"
      >
        {isPaused ? 'PAUSED' : isRunning ? 'RUNNING' : 'READY'}
      </Text>
      
      {/* Particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleCount}
            array={particlePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial size={0.05} color={color} transparent opacity={0.6} />
      </points>
      
      {/* Ambient light */}
      <ambientLight intensity={0.5} />
    </>
  )
}

// Camera setup
function CameraSetup() {
  const { camera } = useThree()
  
  useEffect(() => {
    camera.position.z = 5
  }, [camera])
  
  return null
}

// Main component that wraps the 3D scene
export default function ThreeJsTimer(props: ThreeJsTimerProps) {
  return (
    <div className="w-full h-[300px] rounded-lg overflow-hidden">
      <Canvas>
        <CameraSetup />
        <Timer {...props} />
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
    </div>
  )
}