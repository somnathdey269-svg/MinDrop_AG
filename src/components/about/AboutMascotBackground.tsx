import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Zap, Shield, Sparkles, BookOpen, Lock, CheckCircle2 } from "lucide-react";

interface AboutMascotBackgroundProps {
  currentSlide: number;
  isDark: boolean;
}

export function AboutMascotBackground({ currentSlide, isDark }: AboutMascotBackgroundProps) {
  // Mascot contextual poses & speech bubbles per slide
  const mascotStates = [
    {
      // Slide 0: Opening / Second Brain
      badge: "Meet Droppy!",
      thought: "Hi! I'm Droppy. Your mind is for thinking, not holding tasks!",
      icon: Sparkles,
      color: "#0284C7",
      positionClass: "bottom-20 right-4 sm:right-12 md:right-16",
    },
    {
      // Slide 1: Problem / Mental Overload
      badge: "Mental Relief",
      thought: "Micro-tasks fatigue your brain. MinDrop unburdens you!",
      icon: Brain,
      color: "#38BDF8",
      positionClass: "bottom-20 right-4 sm:right-12 md:right-16",
    },
    {
      // Slide 2: Speed & Frictionless Capture
      badge: "Lightning Fast",
      thought: "Drop notes in under 2 seconds without form friction!",
      icon: Zap,
      color: "#0284C7",
      positionClass: "bottom-20 right-4 sm:right-12 md:right-16",
    },
    {
      // Slide 3: Native Android Power
      badge: "100% Native",
      thought: "Built with WorkManager & SQLite so alerts survive reboots!",
      icon: BookOpen,
      color: "#0284C7",
      positionClass: "bottom-20 right-4 sm:right-12 md:right-16",
    },
    {
      // Slide 4: Data Sovereignty / Privacy
      badge: "100% Private",
      thought: "Zero cloud tracking! Your thoughts stay locked on device.",
      icon: Lock,
      color: "#38BDF8",
      positionClass: "bottom-20 right-4 sm:right-12 md:right-16",
    },
    {
      // Slide 5: Transition Bridge
      badge: "Up Next",
      thought: "Let's discover Chapter 01 Smart Notifications!",
      icon: CheckCircle2,
      color: "#0284C7",
      positionClass: "bottom-24 right-4 sm:right-12 md:right-16",
    },
  ];

  const currentState = mascotStates[currentSlide] || mascotStates[0];
  const IconComponent = currentState.icon;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-30 select-none">
      {/* 1. Subtle Animated Background Lines */}
      <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="sketch-grid-vibrant" width="50" height="50" patternUnits="userSpaceOnUse">
            <circle cx="25" cy="25" r="1.5" fill={isDark ? "#38BDF8" : "#0284C7"} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#sketch-grid-vibrant)" />
      </svg>

      {/* 2. Vibrant Interactive Mascot Floating Companion ("Droppy") */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`mascot-vibrant-${currentSlide}`}
          initial={{ opacity: 0, scale: 0.7, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.7, y: -30 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className={`absolute ${currentState.positionClass} flex flex-col items-end gap-2 max-w-[280px] sm:max-w-[320px] pointer-events-auto`}
        >
          {/* Speech Bubble floating above mascot */}
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.15, duration: 0.35 }}
            className={`px-4 py-3 rounded-2xl border-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] backdrop-blur-md flex items-start gap-2.5 ${
              isDark
                ? "bg-[#0C4A6E] border-white text-white"
                : "bg-white border-[#0284C7] text-ink"
            }`}
          >
            <div className="p-1 rounded-lg bg-[#0284C7]/15 shrink-0 mt-0.5">
              <IconComponent className="size-4 text-[#0284C7]" />
            </div>
            <div className="flex flex-col gap-0.5 text-left">
              <span className={`text-[10px] font-black uppercase tracking-wider ${isDark ? "text-[#38BDF8]" : "text-[#0284C7]"}`}>
                {currentState.badge}
              </span>
              <p className="text-xs sm:text-sm font-extrabold leading-snug">
                {currentState.thought}
              </p>
            </div>
          </motion.div>

          {/* Droppy Mascot Character */}
          <motion.div
            animate={{
              y: [0, -12, 0],
              rotate: [0, 2, -2, 0]
            }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="relative size-24 sm:size-32 md:size-36 cursor-pointer drop-shadow-2xl shrink-0"
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg viewBox="0 0 200 220" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              <defs>
                <linearGradient id="droppyBodyGrad" x1="100" y1="10" x2="100" y2="200" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#38BDF8" />
                  <stop offset="50%" stopColor="#0284C7" />
                  <stop offset="100%" stopColor="#0369A1" />
                </linearGradient>
                <filter id="droppyShadow" x="-10%" y="-10%" width="120%" height="120%">
                  <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#000000" floodOpacity="0.3" />
                </filter>
              </defs>

              {/* Glowing Halo */}
              <circle cx="100" cy="120" r="82" stroke="#38BDF8" strokeWidth="3" strokeDasharray="6 6" opacity="0.7">
                <animateTransform attributeName="transform" type="rotate" from="0 100 120" to="360 100 120" dur="14s" repeatCount="indefinite" />
              </circle>

              {/* Waterdrop Body */}
              <path
                d="M 100 15 C 138 65, 180 105, 180 145 C 180 188, 144 208, 100 208 C 56 208, 20 188, 20 145 C 20 105, 62 65, 100 15 Z"
                fill="url(#droppyBodyGrad)"
                stroke="#000000"
                strokeWidth="6"
                filter="url(#droppyShadow)"
              />

              {/* White Belly Accent */}
              <path
                d="M 60 145 C 60 175, 80 190, 100 190 C 120 190, 140 175, 140 145 C 140 135, 130 125, 100 125 C 70 125, 60 135, 60 145 Z"
                fill="#FFFFFF"
                opacity="0.25"
              />

              {/* Expressive Eyes */}
              <g>
                <ellipse cx="72" cy="125" rx="12" ry="14" fill="#FFFFFF" stroke="#000000" strokeWidth="4" />
                <ellipse cx="128" cy="125" rx="12" ry="14" fill="#FFFFFF" stroke="#000000" strokeWidth="4" />
                <circle cx="75" cy="126" r="6" fill="#0C4A6E" />
                <circle cx="131" cy="126" r="6" fill="#0C4A6E" />
                <circle cx="77" cy="123" r="2.5" fill="#FFFFFF" />
                <circle cx="133" cy="123" r="2.5" fill="#FFFFFF" />
              </g>

              {/* Cheerful Smile */}
              <path d="M 82 152 Q 100 168 118 152" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" fill="none" />
              <path d="M 82 152 Q 100 168 118 152" stroke="#000000" strokeWidth="2" strokeLinecap="round" fill="none" />

              {/* Sparkle Brain Antenna */}
              <path d="M 100 15 L 100 0" stroke="#000000" strokeWidth="5" strokeLinecap="round" />
              <circle cx="100" cy="0" r="7" fill="#FACC15" stroke="#000000" strokeWidth="3" />
            </svg>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
