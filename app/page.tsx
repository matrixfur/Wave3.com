"use client"

import type React from "react"

import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRef, useState, useEffect, Suspense } from "react"
import { motion, AnimatePresence, useScroll, useSpring, useTransform } from "framer-motion"
import { Canvas } from "@react-three/fiber"
import { Sphere, Float, Environment, Preload, Points } from "@react-three/drei"
import { Progress } from "@/components/ui/progress"
import { ToastAction } from "@/components/ui/toast"
import {
  ArrowRight,
  Menu,
  X,
  Mail,
  Phone,
  MapPin,
  Github,
  Twitter,
  Linkedin,
  ArrowUp,
  CheckCircle,
  Monitor,
  Tablet,
  Smartphone,
  Eye,
  MousePointer,
  Zap,
  Sparkles,
  Send,
  Loader2,
} from "lucide-react"
import Image from "next/image"
import type * as THREE from "three"
import { useFrame } from "@react-three/fiber"
import { useInView } from "framer-motion"
import { useToast } from "@/components/ui/use-toast"

// Custom hook to detect mobile devices
const useMobile = () => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  return isMobile
}

// Enhanced Preloader with subtle color
function EnhancedPreloader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (progress < 100) {
        setProgress((prev) => {
          const increment = Math.random() * 15
          const newProgress = Math.min(prev + increment, 100)
          if (newProgress === 100) {
            setTimeout(onComplete, 300)
          }
          return newProgress
        })
      }
    }, 80)

    return () => clearTimeout(timer)
  }, [progress, onComplete])

  return (
    <motion.div
      className="fixed inset-0 bg-white z-[100] flex flex-col items-center justify-center"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <Image src="/wave3-logo.png" alt="Wave3 Logo" width={120} height={48} className="h-12 w-auto" />
      </motion.div>

      <div className="w-48 mb-4">
        <Progress
          value={progress}
          className="h-0.5 bg-gray-100"
          indicatorClassName="bg-gradient-to-r from-blue-500 to-indigo-600"
        />
      </div>

      <motion.p
        className="text-gray-500 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {Math.round(progress)}%
      </motion.p>
    </motion.div>
  )
}

// Enhanced Background with subtle colors
function EnhancedBackground() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/20"></div>

      {/* Subtle grid */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        ></div>
      </div>

      {/* Floating elements with subtle colors */}
      <motion.div
        className="absolute top-1/4 right-1/3 w-96 h-96 rounded-full bg-gradient-to-r from-blue-100/20 to-indigo-100/20 blur-3xl"
        animate={{
          x: [0, 50, 0],
          y: [0, -30, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 25,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      />

      <motion.div
        className="absolute bottom-1/3 left-1/4 w-80 h-80 rounded-full bg-gradient-to-r from-indigo-100/15 to-purple-100/15 blur-3xl"
        animate={{
          x: [0, -40, 0],
          y: [0, 25, 0],
          scale: [1, 0.9, 1],
        }}
        transition={{
          duration: 30,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      />
    </div>
  )
}

// Enhanced Particles with subtle colors
function EnhancedParticles() {
  const pointsRef = useRef<THREE.Points>(null!)
  const isMobile = useMobile()
  const particleCount = isMobile ? 150 : 300

  const positions = new Float32Array(particleCount * 3)
  const colors = new Float32Array(particleCount * 3)
  const sizes = new Float32Array(particleCount)

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 25
    positions[i * 3 + 1] = (Math.random() - 0.5) * 25
    positions[i * 3 + 2] = (Math.random() - 0.5) * 25

    // Subtle blue tones
    const colorVariant = Math.random()
    if (colorVariant < 0.7) {
      colors[i * 3] = 0.2 + Math.random() * 0.2 // R
      colors[i * 3 + 1] = 0.4 + Math.random() * 0.3 // G
      colors[i * 3 + 2] = 0.8 + Math.random() * 0.2 // B
    } else {
      colors[i * 3] = 0.1 // R
      colors[i * 3 + 1] = 0.1 // G
      colors[i * 3 + 2] = 0.1 // B (some gray particles)
    }

    sizes[i] = Math.random() * 0.03 + 0.01
  }

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.015

      const positionAttribute = pointsRef.current.geometry.attributes.position
      const sizeAttribute = pointsRef.current.geometry.attributes.size

      if (positionAttribute && sizeAttribute && positionAttribute.array && sizeAttribute.array) {
        const positions = positionAttribute.array as Float32Array
        const sizes = sizeAttribute.array as Float32Array

        for (let i = 0; i < particleCount; i++) {
          const i3 = i * 3
          const x = positions[i3]
          const y = positions[i3 + 1]
          const z = positions[i3 + 2]

          const dist = Math.sqrt(x * x + y * y + z * z)
          const wave = Math.sin(dist * 0.4 - state.clock.elapsedTime * 0.3) * 0.3 + 0.7
          sizes[i] = (Math.random() * 0.03 + 0.01) * wave

          // Gentle drift
          positions[i3] += Math.sin(state.clock.elapsedTime * 0.1 + i) * 0.002
          positions[i * 3 + 1] += Math.cos(state.clock.elapsedTime * 0.1 + i) * 0.002
        }

        positionAttribute.needsUpdate = true
        sizeAttribute.needsUpdate = true
      }
    }
  })

  return (
    <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
      <bufferAttribute attach="geometry-color" array={colors} count={particleCount} itemSize={3} />
      <bufferAttribute attach="geometry-size" array={sizes} count={particleCount} itemSize={1} />
      <pointsMaterial
        size={0.03}
        sizeAttenuation={true}
        depthWrite={false}
        vertexColors={true}
        transparent
        opacity={0.6}
      />
    </Points>
  )
}

// Enhanced 3D Scene with subtle colors
function Enhanced3DScene() {
  const isMobile = useMobile()

  return (
    <Canvas camera={{ position: [0, 0, isMobile ? 10 : 8], fov: isMobile ? 50 : 45 }}>
      <ambientLight intensity={0.6} />
      <pointLight position={[10, 10, 10]} intensity={0.4} />
      <pointLight position={[-10, -10, -10]} intensity={0.2} color="#3b82f6" />

      <EnhancedParticles />

      <Float speed={0.8} rotationIntensity={0.2} floatIntensity={0.5}>
        <Sphere args={[isMobile ? 0.8 : 1.2, 32, 32]} position={[0, 0, 0]}>
          <meshStandardMaterial color="#f8fafc" roughness={0.1} metalness={0.1} />
        </Sphere>
      </Float>

      <Float speed={0.5} rotationIntensity={0.1} floatIntensity={0.3}>
        <Sphere args={[isMobile ? 0.3 : 0.4, 16, 16]} position={[isMobile ? 1.5 : 2.5, 1, -1]}>
          <meshStandardMaterial color="#dbeafe" roughness={0.2} metalness={0.05} />
        </Sphere>
      </Float>

      <Float speed={0.6} rotationIntensity={0.15} floatIntensity={0.4}>
        <Sphere args={[isMobile ? 0.2 : 0.25, 16, 16]} position={[isMobile ? -1.2 : -2, -1, 0.5]}>
          <meshStandardMaterial color="#e0e7ff" roughness={0.3} metalness={0.1} />
        </Sphere>
      </Float>

      <Environment preset="studio" />
      <Preload all />
    </Canvas>
  )
}

// Enhanced Scroll Progress with color
function EnhancedScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 })

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 z-50 origin-left"
      style={{ scaleX }}
    />
  )
}

// Animated Counter with enhanced styling
function AnimatedCounter({ end, duration = 2, suffix = "" }: { end: number; duration?: number; suffix?: string }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (isInView) {
      let startTime: number
      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime
        const progress = Math.min((currentTime - startTime) / (duration * 1000), 1)
        setCount(Math.floor(progress * end))
        if (progress < 1) requestAnimationFrame(animate)
      }
      requestAnimationFrame(animate)
    }
  }, [isInView, end, duration])

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  )
}

// Enhanced Feature Item with interactions
function EnhancedFeatureItem({
  title,
  description,
  icon,
}: {
  title: string
  description: string
  icon: React.ReactNode
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="group cursor-pointer"
    >
      <div className="flex items-start space-x-4">
        <motion.div
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 flex items-center justify-center text-blue-600 group-hover:from-blue-100 group-hover:to-indigo-100 group-hover:border-blue-200 transition-all duration-300 flex-shrink-0"
          whileHover={{ scale: 1.1, rotate: 5 }}
        >
          {icon}
        </motion.div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base sm:text-lg font-medium text-gray-900 group-hover:text-blue-900 transition-colors">
            {title}
          </h3>
          <p className="text-gray-600 leading-relaxed text-sm mt-2">{description}</p>
        </div>
      </div>
    </motion.div>
  )
}

// Enhanced Service Card with interactions
function EnhancedServiceCard({
  title,
  description,
  features,
  index,
}: {
  title: string
  description: string
  features: string[]
  index: number
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="group cursor-pointer"
    >
      <div className="p-4 sm:p-6 border border-gray-100 rounded-xl hover:border-blue-200 hover:shadow-lg hover:shadow-blue-50 transition-all duration-300 h-full bg-white/50 backdrop-blur-sm">
        <motion.h3
          className="text-lg sm:text-xl font-medium mb-3 text-gray-900 group-hover:text-blue-900 transition-colors"
          whileHover={{ x: 5 }}
        >
          {title}
        </motion.h3>
        <p className="text-gray-600 mb-4 text-sm leading-relaxed">{description}</p>

        <ul className="space-y-2">
          {features.map((feature, idx) => (
            <motion.li
              key={idx}
              className="flex items-center text-sm text-gray-700"
              initial={{ opacity: 0, x: -10 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: index * 0.1 + idx * 0.05 }}
            >
              <CheckCircle className="h-3 w-3 text-blue-500 mr-2 flex-shrink-0" />
              <span className="break-words">{feature}</span>
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.div>
  )
}

// Enhanced Project Card with interactions
function EnhancedProjectCard({
  title,
  category,
  description,
  index,
}: {
  title: string
  category: string
  description: string
  index: number
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="group cursor-pointer"
    >
      <div className="p-4 sm:p-6 border border-gray-100 rounded-xl hover:border-blue-200 hover:shadow-lg hover:shadow-blue-50 transition-all duration-300 bg-white/50 backdrop-blur-sm">
        <div className="mb-3">
          <motion.span
            className="text-xs text-blue-600 uppercase tracking-wide font-medium bg-blue-50 px-2 py-1 rounded-full"
            whileHover={{ scale: 1.05 }}
          >
            {category}
          </motion.span>
        </div>
        <motion.h3
          className="text-base sm:text-lg font-medium text-gray-900 mb-2 group-hover:text-blue-900 transition-colors"
          whileHover={{ x: 5 }}
        >
          {title}
        </motion.h3>
        <p className="text-gray-600 text-sm">{description}</p>

        <motion.div
          className="mt-4 flex items-center text-blue-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity"
          whileHover={{ x: 5 }}
        >
          <Eye className="h-4 w-4 mr-1" />
          View Project
        </motion.div>
      </div>
    </motion.div>
  )
}

// Enhanced Testimonial Card
function EnhancedTestimonialCard({
  name,
  company,
  text,
  index,
}: {
  name: string
  company: string
  text: string
  index: number
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="group cursor-pointer"
    >
      <div className="p-4 sm:p-6 border border-gray-100 rounded-xl hover:border-blue-200 hover:shadow-lg hover:shadow-blue-50 transition-all duration-300 bg-white/50 backdrop-blur-sm">
        <motion.p className="text-gray-700 mb-4 text-sm leading-relaxed italic" whileHover={{ scale: 1.02 }}>
          "{text}"
        </motion.p>
        <div className="flex items-center">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mr-3 flex-shrink-0">
            <span className="text-white font-medium text-xs sm:text-sm">
              {name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </span>
          </div>
          <div className="min-w-0">
            <h4 className="text-gray-900 font-medium text-sm truncate">{name}</h4>
            <p className="text-blue-600 text-xs truncate">{company}</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// Enhanced Responsive Device Preview
function ResponsiveDevicePreview() {
  const [activeDevice, setActiveDevice] = useState("desktop")
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8 }}
      className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 sm:p-8 border border-gray-100 shadow-lg shadow-blue-50/50"
    >
      <div className="text-center mb-6 sm:mb-8">
        <motion.h3 className="text-xl sm:text-2xl font-medium text-gray-900 mb-2" whileHover={{ scale: 1.02 }}>
          Responsive Design
        </motion.h3>
        <p className="text-gray-600 text-sm sm:text-base">Perfect experience across all devices</p>
      </div>

      <div className="flex justify-center mb-6 sm:mb-8 space-x-2 sm:space-x-4">
        {[
          { id: "desktop", icon: Monitor, label: "Desktop" },
          { id: "tablet", icon: Tablet, label: "Tablet" },
          { id: "mobile", icon: Smartphone, label: "Mobile" },
        ].map(({ id, icon: Icon, label }) => (
          <motion.button
            key={id}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 rounded-lg transition-all text-xs sm:text-sm ${
              activeDevice === id
                ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg"
                : "bg-gray-50 border border-gray-200 text-gray-600 hover:text-gray-900 hover:border-blue-200"
            }`}
            onClick={() => setActiveDevice(id)}
          >
            <Icon className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="font-medium hidden sm:inline">{label}</span>
          </motion.button>
        ))}
      </div>

      <div className="relative flex justify-center">
        <motion.div
          key={activeDevice}
          initial={{ opacity: 0, scale: 0.9, rotateY: 10 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          transition={{ duration: 0.4, type: "spring", stiffness: 300 }}
          className={`bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg overflow-hidden border border-gray-200 shadow-xl ${
            activeDevice === "desktop"
              ? "w-full max-w-md sm:max-w-2xl aspect-video"
              : activeDevice === "tablet"
                ? "w-48 sm:w-80 aspect-[3/4]"
                : "w-32 sm:w-48 aspect-[9/16]"
          }`}
        >
          <div className="p-2 sm:p-4 h-full flex flex-col">
            <div className="flex items-center justify-between mb-2 sm:mb-4">
              <div className="flex space-x-1">
                <motion.div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-red-400" whileHover={{ scale: 1.2 }} />
                <motion.div
                  className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-yellow-400"
                  whileHover={{ scale: 1.2 }}
                />
                <motion.div
                  className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-400"
                  whileHover={{ scale: 1.2 }}
                />
              </div>
              <div className="h-0.5 sm:h-1 w-8 sm:w-16 bg-gray-300 rounded-full"></div>
            </div>

            <div className="flex-1 flex flex-col space-y-1 sm:space-y-2">
              <motion.div
                className="h-1/4 bg-gradient-to-r from-blue-200/50 to-indigo-200/50 rounded-lg"
                whileHover={{ scale: 1.02 }}
              />
              <div className="flex-1 grid grid-cols-2 gap-1 sm:gap-2">
                <motion.div
                  className="bg-gray-200/70 rounded-lg"
                  whileHover={{ scale: 1.02, backgroundColor: "#e5e7eb" }}
                />
                <motion.div
                  className="bg-gray-200/70 rounded-lg"
                  whileHover={{ scale: 1.02, backgroundColor: "#e5e7eb" }}
                />
              </div>
              <motion.div
                className="h-4 sm:h-8 bg-gradient-to-r from-blue-100/50 to-indigo-100/50 rounded-lg"
                whileHover={{ scale: 1.02 }}
              />
            </div>
          </div>
        </motion.div>

        {/* Floating interaction indicators */}
        <motion.div
          className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-2 h-2 sm:w-4 sm:h-4 bg-blue-500 rounded-full"
          animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        />
        <motion.div
          className="absolute -bottom-1 -left-1 sm:-bottom-2 sm:-left-2 w-1.5 h-1.5 sm:w-3 sm:h-3 bg-indigo-500 rounded-full"
          animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2.5, repeat: Number.POSITIVE_INFINITY, delay: 0.5 }}
        />
      </div>

      <motion.div className="mt-4 sm:mt-6 text-center text-xs sm:text-sm text-gray-600" whileHover={{ scale: 1.02 }}>
        <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 inline mr-1 text-blue-500" />
        Optimized for all screen sizes
      </motion.div>
    </motion.div>
  )
}

// Enhanced Mobile Navigation
function EnhancedMobileNav() {
  const [isOpen, setIsOpen] = useState(false)
  const menuItems = ["About", "Services", "Work", "Contact"]

  return (
    <div className="md:hidden">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
        aria-label={isOpen ? "Close menu" : "Open menu"}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-gray-100 z-50 rounded-b-2xl shadow-lg"
          >
            <nav className="flex flex-col p-6 space-y-4">
              {menuItems.map((item, index) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ x: 5, scale: 1.02 }}
                  onClick={() => setIsOpen(false)}
                >
                  {item}
                </motion.a>
              ))}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: menuItems.length * 0.1 }}
                className="pt-4 border-t border-gray-100"
              >
                <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
                  Get Started
                </Button>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Mouse follower component
function MouseFollower() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    const handleMouseEnter = () => setIsHovering(true)
    const handleMouseLeave = () => setIsHovering(false)

    window.addEventListener("mousemove", handleMouseMove)

    // Add hover listeners to interactive elements
    const interactiveElements = document.querySelectorAll('button, a, [role="button"]')
    interactiveElements.forEach((el) => {
      el.addEventListener("mouseenter", handleMouseEnter)
      el.addEventListener("mouseleave", handleMouseLeave)
    })

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      interactiveElements.forEach((el) => {
        el.removeEventListener("mouseenter", handleMouseEnter)
        el.removeEventListener("mouseleave", handleMouseLeave)
      })
    }
  }, [])

  return (
    <motion.div
      className="fixed w-4 h-4 bg-blue-500/30 rounded-full pointer-events-none z-50 mix-blend-difference"
      animate={{
        x: mousePosition.x - 8,
        y: mousePosition.y - 8,
        scale: isHovering ? 2 : 1,
      }}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 28,
      }}
    />
  )
}

// Contact Form Component with Backend Integration
function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const { toast } = useToast()

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required"
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required"
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters long"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({
          title: "Message sent successfully!",
          description: "We'll get back to you as soon as possible.",
          action: <ToastAction altText="Close">Close</ToastAction>,
        })

        // Reset form
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        })
      } else {
        throw new Error("Failed to send message")
      }
    } catch (error) {
      console.error("Error sending message:", error)
      toast({
        title: "Error sending message",
        description: "Please try again later or contact us directly.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <motion.div whileHover={{ scale: 1.02 }}>
          <Input
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleInputChange}
            className={`border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 ${
              errors.name ? "border-red-500" : ""
            }`}
            required
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </motion.div>
        <motion.div whileHover={{ scale: 1.02 }}>
          <Input
            name="email"
            type="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleInputChange}
            className={`border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 ${
              errors.email ? "border-red-500" : ""
            }`}
            required
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </motion.div>
      </div>
      <motion.div whileHover={{ scale: 1.02 }}>
        <Input
          name="subject"
          placeholder="Subject"
          value={formData.subject}
          onChange={handleInputChange}
          className={`border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 ${
            errors.subject ? "border-red-500" : ""
          }`}
          required
        />
        {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject}</p>}
      </motion.div>
      <motion.div whileHover={{ scale: 1.02 }}>
        <Textarea
          name="message"
          placeholder="Tell us about your project..."
          value={formData.message}
          onChange={handleInputChange}
          className={`border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 min-h-[100px] ${
            errors.message ? "border-red-500" : ""
          }`}
          required
        />
        {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
      </motion.div>
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              Send Message
            </>
          )}
        </Button>
      </motion.div>
    </form>
  )
}

export default function Wave3Landing() {
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)
  const { scrollYProgress } = useScroll()
  const isMobile = useMobile()

  // Scroll-based animations
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0])
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.98])

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    )
  }

  return (
    <>
      <AnimatePresence>{loading && <EnhancedPreloader onComplete={() => setLoading(false)} />}</AnimatePresence>

      <div className="min-h-screen bg-white text-gray-900 overflow-x-hidden relative">
        {/* Enhanced Background */}
        <EnhancedBackground />

        {/* Mouse Follower */}
        {!isMobile && <MouseFollower />}

        {/* Enhanced Scroll Progress */}
        <EnhancedScrollProgress />

        {/* Content */}
        <div className="relative z-20">
          {/* Enhanced Navbar - Fixed positioning */}
          <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed top-4 sm:top-6 left-1/2 transform -translate-x-1/2 z-50 w-[95%] sm:w-[90%] max-w-4xl"
          >
            <motion.div
              className="bg-white/80 backdrop-blur-xl rounded-full border border-gray-100 shadow-lg shadow-blue-50/50"
              whileHover={{ scale: 1.01, shadow: "0 20px 25px -5px rgba(59, 130, 246, 0.1)" }}
            >
              <div className="px-4 sm:px-6 py-3 flex items-center justify-between">
                <motion.div className="flex items-center" whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                  <Image src="/wave3-logo.png" alt="Wave3" width={80} height={32} className="h-5 sm:h-6 w-auto" />
                </motion.div>

                <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
                  {["About", "Services", "Work", "Contact"].map((item, index) => (
                    <motion.a
                      key={item}
                      href={`#${item.toLowerCase()}`}
                      className="text-gray-600 hover:text-blue-600 transition-colors text-sm font-medium relative"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 + 0.2 }}
                      whileHover={{ y: -2 }}
                    >
                      {item}
                      <motion.div
                        className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-600"
                        whileHover={{ width: "100%" }}
                        transition={{ duration: 0.3 }}
                      />
                    </motion.a>
                  ))}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-full shadow-lg text-xs sm:text-sm px-3 sm:px-4"
                    >
                      Get Started
                    </Button>
                  </motion.div>
                </div>

                <EnhancedMobileNav />
              </div>
            </motion.div>
          </motion.nav>

          {/* Enhanced Hero Section */}
          <motion.section
            className="min-h-screen flex items-center justify-center relative pt-20 sm:pt-24 px-4 sm:px-6"
            style={{ opacity: heroOpacity, scale: heroScale }}
          >
            <div className="container mx-auto max-w-7xl">
              <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
                {/* Left Content */}
                <motion.div
                  className="text-center lg:text-left"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="inline-flex items-center px-3 sm:px-4 py-2 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 mb-6 sm:mb-8"
                    whileHover={{ scale: 1.05, y: -2 }}
                  >
                    <Zap className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600 mr-2" />
                    <span className="text-xs sm:text-sm text-blue-700 font-medium">Digital Innovation Agency</span>
                  </motion.div>

                  <motion.h1
                    className="text-4xl sm:text-5xl lg:text-6xl font-light mb-4 sm:mb-6 leading-tight"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    <motion.span className="text-black" whileHover={{ scale: 1.02, color: "#1f2937" }}>
                      Wave3
                    </motion.span>
                    <br />
                    <motion.span
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
                      whileHover={{ scale: 1.02 }}
                    >
                      Digital Agency
                    </motion.span>
                  </motion.h1>

                  <motion.p
                    className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 leading-relaxed max-w-lg mx-auto lg:mx-0"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    We create digital experiences that matter. Clean, functional, and purposeful design for modern
                    businesses with a touch of innovation.
                  </motion.p>

                  <motion.div
                    className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8 sm:mb-12 justify-center lg:justify-start"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                  >
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 sm:px-6 py-2 sm:py-3 group shadow-lg text-sm sm:text-base">
                        Start Project
                        <ArrowRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        variant="outline"
                        className="border-gray-300 text-gray-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base"
                      >
                        View Work
                      </Button>
                    </motion.div>
                  </motion.div>

                  {/* Enhanced Stats */}
                  <motion.div
                    className="grid grid-cols-3 gap-4 sm:gap-8 max-w-md mx-auto lg:mx-0"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                  >
                    {[
                      { number: 150, suffix: "+", label: "Projects", color: "text-blue-600" },
                      { number: 98, suffix: "%", label: "Satisfaction", color: "text-indigo-600" },
                      { number: 5, suffix: "+", label: "Years", color: "text-purple-600" },
                    ].map((stat, index) => (
                      <motion.div
                        key={index}
                        className="text-center"
                        whileHover={{ scale: 1.05, y: -5 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className={`text-xl sm:text-2xl lg:text-3xl font-medium ${stat.color} mb-1`}>
                          <AnimatedCounter end={stat.number} suffix={stat.suffix} />
                        </div>
                        <p className="text-gray-500 text-xs">{stat.label}</p>
                      </motion.div>
                    ))}
                  </motion.div>
                </motion.div>

                {/* Right Content - Enhanced 3D Scene */}
                <motion.div
                  className="h-[300px] sm:h-[400px] lg:h-[500px] order-first lg:order-last"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Suspense
                    fallback={
                      <div className="w-full h-full bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl animate-pulse flex items-center justify-center border border-blue-100">
                        <div className="text-blue-400 text-sm">Loading 3D Scene...</div>
                      </div>
                    }
                  >
                    <Enhanced3DScene />
                  </Suspense>
                </motion.div>
              </div>
            </div>
          </motion.section>

          {/* Enhanced About Section */}
          <section className="py-16 sm:py-24 px-4 sm:px-6" id="about">
            <div className="container mx-auto max-w-4xl">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-12 sm:mb-16"
              >
                <motion.h2 className="text-2xl sm:text-3xl font-light mb-4 text-black" whileHover={{ scale: 1.02 }}>
                  Why Wave3?
                </motion.h2>
                <motion.p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base" whileHover={{ scale: 1.01 }}>
                  We believe in simplicity, functionality, and creating digital experiences that truly serve their
                  purpose with modern aesthetics.
                </motion.p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
                <EnhancedFeatureItem
                  icon={<Sparkles className="h-5 w-5 sm:h-6 sm:w-6" />}
                  title="Clean Design"
                  description="Every element serves a purpose. We remove the unnecessary and focus on what matters most for your users with beautiful aesthetics."
                />
                <EnhancedFeatureItem
                  icon={<Zap className="h-5 w-5 sm:h-6 sm:w-6" />}
                  title="Fast Performance"
                  description="Speed is essential. Our solutions are optimized for performance and built with modern technologies for lightning-fast experiences."
                />
                <EnhancedFeatureItem
                  icon={<Eye className="h-5 w-5 sm:h-6 sm:w-6" />}
                  title="User Focused"
                  description="We design with your users in mind, creating intuitive experiences that convert visitors into customers through thoughtful interactions."
                />
                <EnhancedFeatureItem
                  icon={<MousePointer className="h-5 w-5 sm:h-6 sm:w-6" />}
                  title="Interactive Experience"
                  description="Engaging animations and micro-interactions that delight users while maintaining professional standards and accessibility."
                />
              </div>
            </div>
          </section>

          {/* Enhanced Services Section */}
          <section
            className="py-16 sm:py-24 px-4 sm:px-6 bg-gradient-to-br from-blue-50/30 to-indigo-50/20"
            id="services"
          >
            <div className="container mx-auto max-w-6xl">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-12 sm:mb-16"
              >
                <motion.h2 className="text-2xl sm:text-3xl font-light mb-4 text-black" whileHover={{ scale: 1.02 }}>
                  Services
                </motion.h2>
                <motion.p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base" whileHover={{ scale: 1.01 }}>
                  Comprehensive digital solutions designed to help your business grow and succeed in the modern digital
                  landscape.
                </motion.p>
              </motion.div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12 sm:mb-16">
                {[
                  {
                    title: "Web Development",
                    description:
                      "Custom websites and applications built with modern technologies and best practices for optimal performance.",
                    features: ["Responsive Design", "SEO Optimized", "Fast Loading", "Secure & Reliable"],
                  },
                  {
                    title: "Mobile Apps",
                    description:
                      "Native and cross-platform mobile applications that engage users and drive business growth effectively.",
                    features: ["iOS & Android", "Cross-Platform", "App Store Ready", "Push Notifications"],
                  },
                  {
                    title: "UI/UX Design",
                    description:
                      "User-centered design that creates meaningful experiences and drives conversions through thoughtful interfaces.",
                    features: ["User Research", "Wireframing", "Prototyping", "Design Systems"],
                  },
                ].map((service, index) => (
                  <EnhancedServiceCard
                    key={index}
                    title={service.title}
                    description={service.description}
                    features={service.features}
                    index={index}
                  />
                ))}
              </div>

              {/* Responsive Device Preview */}
              <ResponsiveDevicePreview />
            </div>
          </section>

          {/* Enhanced Work Section */}
          <section className="py-16 sm:py-24 px-4 sm:px-6" id="work">
            <div className="container mx-auto max-w-6xl">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-12 sm:mb-16"
              >
                <motion.h2 className="text-2xl sm:text-3xl font-light mb-4 text-black" whileHover={{ scale: 1.02 }}>
                  Selected Work
                </motion.h2>
                <motion.p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base" whileHover={{ scale: 1.01 }}>
                  A collection of projects that showcase our approach to digital design and development with modern
                  aesthetics.
                </motion.p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    title: "E-commerce Platform",
                    category: "Web Development",
                    description:
                      "Modern e-commerce solution with seamless user experience and advanced analytics dashboard.",
                  },
                  {
                    title: "Restaurant App",
                    category: "Mobile Development",
                    description: "Complete restaurant management system with ordering and real-time delivery tracking.",
                  },
                  {
                    title: "SaaS Dashboard",
                    category: "UI/UX Design",
                    description: "Clean dashboard interface with intuitive data visualization and smooth user flows.",
                  },
                  {
                    title: "Portfolio Website",
                    category: "Web Development",
                    description: "Minimal portfolio showcasing creative work with smooth animations and interactions.",
                  },
                  {
                    title: "Fitness App",
                    category: "Mobile Development",
                    description: "Simple fitness tracking app focused on user motivation and progress visualization.",
                  },
                  {
                    title: "Brand Identity",
                    category: "Design",
                    description: "Complete brand system with logo, guidelines, and digital application standards.",
                  },
                ].map((project, index) => (
                  <EnhancedProjectCard
                    key={index}
                    title={project.title}
                    category={project.category}
                    description={project.description}
                    index={index}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* Enhanced Testimonials Section */}
          <section className="py-16 sm:py-24 px-4 sm:px-6 bg-gradient-to-br from-indigo-50/30 to-blue-50/20">
            <div className="container mx-auto max-w-5xl">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-12 sm:mb-16"
              >
                <motion.h2 className="text-2xl sm:text-3xl font-light mb-4 text-black" whileHover={{ scale: 1.02 }}>
                  Client Feedback
                </motion.h2>
                <motion.p className="text-gray-600 text-sm sm:text-base" whileHover={{ scale: 1.01 }}>
                  What our clients say about working with Wave3
                </motion.p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    name: "Sarah Johnson",
                    company: "TechStart Inc",
                    text: "Wave3 delivered exactly what we needed. Clean, fast, and effective. Our conversion rate increased by 40% within the first month.",
                  },
                  {
                    name: "Michael Chen",
                    company: "Local Bistro",
                    text: "The mobile app transformed our business completely. Simple to use for both customers and staff. Highly recommended for any business.",
                  },
                  {
                    name: "Emily Rodriguez",
                    company: "Creative Studio",
                    text: "Professional team with great attention to detail. They understood our vision perfectly and executed it with modern flair.",
                  },
                ].map((testimonial, index) => (
                  <EnhancedTestimonialCard
                    key={index}
                    name={testimonial.name}
                    company={testimonial.company}
                    text={testimonial.text}
                    index={index}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* Enhanced Contact Section */}
          <section className="py-16 sm:py-24 px-4 sm:px-6" id="contact">
            <div className="container mx-auto max-w-4xl">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-12 sm:mb-16"
              >
                <motion.h2 className="text-2xl sm:text-3xl font-light mb-4 text-black" whileHover={{ scale: 1.02 }}>
                  Let's Work Together
                </motion.h2>
                <motion.p className="text-gray-600 text-sm sm:text-base" whileHover={{ scale: 1.01 }}>
                  Ready to start your project? Get in touch and let's discuss how we can help bring your vision to life.
                </motion.p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="border border-gray-100 rounded-2xl p-6 sm:p-8 bg-white/70 backdrop-blur-sm shadow-lg shadow-blue-50/50"
                whileHover={{ scale: 1.01, shadow: "0 25px 50px -12px rgba(59, 130, 246, 0.1)" }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                  <div>
                    <motion.h3 className="text-lg font-medium mb-6 text-black" whileHover={{ x: 5 }}>
                      Send Message
                    </motion.h3>
                    <ContactForm />
                  </div>

                  <div className="space-y-6">
                    <div>
                      <motion.h3 className="text-lg font-medium mb-6 text-black" whileHover={{ x: 5 }}>
                        Contact Info
                      </motion.h3>
                      <div className="space-y-4">
                        {[
                          { icon: <Mail className="h-4 w-4" />, text: "hello@wave3.agency", color: "text-blue-600" },
                          { icon: <Phone className="h-4 w-4" />, text: "+1 (555) 123-WAVE", color: "text-indigo-600" },
                          {
                            icon: <MapPin className="h-4 w-4" />,
                            text: "Remote & Worldwide",
                            color: "text-purple-600",
                          },
                        ].map((item, index) => (
                          <motion.div
                            key={index}
                            className="flex items-center space-x-3"
                            whileHover={{ x: 5, scale: 1.02 }}
                          >
                            <div className={item.color}>{item.icon}</div>
                            <span className="text-gray-600 text-sm break-all">{item.text}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <motion.h4 className="font-medium mb-4 text-black" whileHover={{ x: 5 }}>
                        Follow
                      </motion.h4>
                      <div className="flex space-x-3">
                        {[
                          { icon: <Twitter className="h-4 w-4" />, color: "from-blue-500 to-blue-600" },
                          { icon: <Linkedin className="h-4 w-4" />, color: "from-blue-600 to-indigo-600" },
                          { icon: <Github className="h-4 w-4" />, color: "from-gray-600 to-gray-700" },
                        ].map((social, index) => (
                          <motion.a
                            key={index}
                            href="#"
                            whileHover={{ scale: 1.1, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            className={`w-8 h-8 bg-gradient-to-br ${social.color} rounded flex items-center justify-center text-white shadow-lg transition-all`}
                          >
                            {social.icon}
                          </motion.a>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Enhanced Footer */}
          <footer className="py-6 sm:py-8 px-4 sm:px-6 border-t border-gray-100 bg-gradient-to-r from-blue-50/30 to-indigo-50/20">
            <div className="container mx-auto">
              <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
                <motion.div className="flex items-center space-x-4" whileHover={{ scale: 1.02 }}>
                  <Image src="/wave3-logo.png" alt="Wave3" width={60} height={24} className="h-4 w-auto" />
                  <span className="text-gray-500 text-sm">© 2024 Wave3. All rights reserved.</span>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-gray-200 text-gray-600 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50"
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  >
                    <ArrowUp className="h-3 w-3 mr-2" />
                    Top
                  </Button>
                </motion.div>
              </div>
            </div>
          </footer>
        </div>

        {/* Floating CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 3, duration: 0.6 }}
          className="fixed bottom-4 sm:bottom-8 right-4 sm:right-8 z-50"
          whileHover={{ scale: 1.1, y: -5 }}
          whileTap={{ scale: 0.9 }}
        >
          <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-full shadow-2xl shadow-blue-500/25 text-sm sm:text-base px-3 sm:px-4 py-2 sm:py-3">
            <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
            Get Quote
          </Button>
        </motion.div>
      </div>
    </>
  )
}
