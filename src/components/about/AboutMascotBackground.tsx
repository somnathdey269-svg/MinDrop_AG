import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AboutSketchBackgroundProps {
  currentSlide: number;
  isDark: boolean;
}

export function AboutMascotBackground({ currentSlide, isDark }: AboutSketchBackgroundProps) {
  // Theme contrast colors
  const strokeColor = isDark ? "#FFFFFF" : "#0284C7";
  const accentColor = isDark ? "#38BDF8" : "#0369A1";
  const textColor = isDark ? "rgba(255,255,255,0.7)" : "rgba(2,132,199,0.7)";

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none w-full h-full">
      {/* Soft Background Grid */}
      <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="meaningful-grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <circle cx="30" cy="30" r="1.5" fill={strokeColor} />
            <line x1="0" y1="30" x2="60" y2="30" stroke={strokeColor} strokeWidth="0.5" opacity="0.2" strokeDasharray="4 4" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#meaningful-grid)" />
      </svg>

      {/* Slide-Specific Content-Relevant Animated Vector Sketches */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`meaningful-slide-${currentSlide}`}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: isDark ? 0.28 : 0.20, scale: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 w-full h-full"
        >
          <svg
            viewBox="0 0 1400 900"
            preserveAspectRatio="xMidYMid meet"
            className="w-full h-full absolute inset-0 transition-all duration-500"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* ────── SLIDE 0: "Your mind is for having ideas, not holding them" ────── */}
            {currentSlide === 0 && (
              <g stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round">
                {/* Profile Mind Silhouette on Left */}
                <path
                  d="M 120 480 C 100 380, 160 250, 280 250 C 380 250, 440 320, 420 420 C 460 440, 480 480, 460 530 C 440 580, 390 600, 360 620 L 360 700 L 220 700 L 220 620 C 180 600, 140 540, 120 480 Z"
                  strokeWidth="3"
                  strokeDasharray="6 6"
                />

                {/* Floating ideas releasing from mind */}
                <motion.g
                  animate={{ y: [-8, 8, -8] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <circle cx="280" cy="350" r="28" strokeWidth="2.5" />
                  <path d="M 280 338 V 362 M 268 350 H 292" strokeWidth="2.5" />
                  <text x="280" y="398" fill={textColor} fontSize="12" fontWeight="900" textAnchor="middle">HAVING IDEAS</text>
                </motion.g>

                {/* Flow trajectory arrow from Mind -> Second Brain */}
                <motion.path
                  d="M 440 360 Q 700 180 1000 360"
                  strokeWidth="3.5"
                  strokeDasharray="10 10"
                  initial={{ pathOffset: 0 }}
                  animate={{ pathOffset: [0, 1] }}
                  transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                />
                <path d="M 980 345 L 1000 360 L 985 375" strokeWidth="3.5" />

                {/* Second Brain Storage Vault Node on Right */}
                <rect x="1000" y="280" width="260" height="340" rx="28" strokeWidth="3.5" />
                <rect x="1040" y="340" width="180" height="50" rx="12" strokeDasharray="4 4" />
                <rect x="1040" y="415" width="180" height="50" rx="12" strokeDasharray="4 4" />
                <rect x="1040" y="490" width="180" height="50" rx="12" strokeDasharray="4 4" />
                <text x="1130" y="655" fill={textColor} fontSize="13" fontWeight="900" textAnchor="middle">SECOND BRAIN (HOLDING THEM)</text>
              </g>
            )}

            {/* ────── SLIDE 1: "Small tasks create big mental fatigue (Milk, Reply, Alert)" ────── */}
            {currentSlide === 1 && (
              <g stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round">
                {/* 3 Everyday Micro-Thought Badges floating on left */}
                <g>
                  {/* Badge 1: Pick up milk */}
                  <rect x="80" y="220" width="220" height="60" rx="18" strokeWidth="2.5" />
                  <text x="130" y="256" fill={textColor} fontSize="14" fontWeight="900">🥛 Pick up milk</text>

                  {/* Badge 2: Urgent reply */}
                  <rect x="120" y="320" width="240" height="60" rx="18" strokeWidth="2.5" />
                  <text x="170" y="356" fill={textColor} fontSize="14" fontWeight="900">✉️ Reply to message</text>

                  {/* Badge 3: Check alert at place */}
                  <rect x="90" y="420" width="230" height="60" rx="18" strokeWidth="2.5" />
                  <text x="140" y="456" fill={textColor} fontSize="14" fontWeight="900">📍 Location alert</text>
                </g>

                {/* Funnel unburdening path converting micro-thoughts to peace */}
                <path d="M 380 350 Q 550 350 700 500 T 1100 500" strokeWidth="3.5" strokeDasharray="8 8" />

                {/* MinDrop Unburdened Peace Waves on right */}
                <motion.g
                  animate={{ y: [-6, 6, -6] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <rect x="1080" y="380" width="240" height="240" rx="32" strokeWidth="3.5" />
                  <path d="M 1120 500 Q 1200 460 1280 500" strokeWidth="3" />
                  <path d="M 1120 530 Q 1200 490 1280 530" strokeWidth="3" opacity="0.6" />
                  <text x="1200" y="655" fill={textColor} fontSize="13" fontWeight="900" textAnchor="middle">MINDFUL UNBURDENED PEACE</text>
                </motion.g>
              </g>
            )}

            {/* ────── SLIDE 2: "Capture in under 2 seconds. Zero setup friction" ────── */}
            {currentSlide === 2 && (
              <g stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round">
                {/* Stopwatch timer drawing 1.8s */}
                <circle cx="200" cy="380" r="90" strokeWidth="3.5" />
                <line x1="200" y1="380" x2="200" y2="310" strokeWidth="4" />
                <line x1="200" y1="380" x2="240" y2="400" strokeWidth="4" />
                <text x="200" y="510" fill={textColor} fontSize="18" fontWeight="900" textAnchor="middle">&lt; 2 SECONDS</text>

                {/* Lightning Bolt Fast Capture Track */}
                <motion.path
                  d="M 320 380 L 480 380 L 440 430 L 600 430"
                  strokeWidth="4"
                  strokeDasharray="8 8"
                  initial={{ pathOffset: 0 }}
                  animate={{ pathOffset: [0, 1] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                />

                {/* Instant Dropped Note Card on Right */}
                <rect x="1050" y="260" width="260" height="320" rx="24" strokeWidth="3.5" />
                <line x1="1090" y1="340" x2="1270" y2="340" strokeWidth="3" />
                <line x1="1090" y1="400" x2="1230" y2="400" strokeWidth="2.5" strokeDasharray="4 4" />

                {/* Instant Checkmark */}
                <motion.path
                  d="M 1090 480 L 1130 520 L 1230 430"
                  strokeWidth="5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
                />
                <text x="1180" y="620" fill={textColor} fontSize="13" fontWeight="900" textAnchor="middle">ZERO FORM FRICTION</text>
              </g>
            )}

            {/* ────── SLIDE 3: "Built directly on Android WorkManager & SQLite" ────── */}
            {currentSlide === 3 && (
              <g stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round">
                {/* Left: Android Hardware WorkManager Gear */}
                <g>
                  <circle cx="200" cy="380" r="75" strokeWidth="3.5" strokeDasharray="6 6" />
                  <circle cx="200" cy="380" r="25" strokeWidth="3.5" />
                  <text x="200" y="490" fill={textColor} fontSize="13" fontWeight="900" textAnchor="middle">ANDROID WORKMANAGER</text>
                </g>

                {/* Interconnecting Circuit Bus */}
                <path d="M 280 380 H 1080" strokeWidth="3.5" strokeDasharray="10 10" />

                {/* Right: Local SQLite Database Cylinder */}
                <g>
                  <ellipse cx="1180" cy="280" rx="100" ry="32" strokeWidth="3.5" />
                  <line x1="1080" y1="280" x2="1080" y2="480" strokeWidth="3.5" />
                  <line x1="1280" y1="280" x2="1280" y2="480" strokeWidth="3.5" />
                  <ellipse cx="1180" cy="380" rx="100" ry="32" strokeDasharray="6 6" />
                  <ellipse cx="1180" cy="480" rx="100" ry="32" strokeWidth="3.5" />
                  <text x="1180" y="540" fill={textColor} fontSize="13" fontWeight="900" textAnchor="middle">LOCAL SQLITE DB</text>
                </g>
              </g>
            )}

            {/* ────── SLIDE 4: "100% Local Privacy. Your thoughts never leave your phone" ────── */}
            {currentSlide === 4 && (
              <g stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round">
                {/* On-Device Phone Vault Schematic on left */}
                <rect x="120" y="240" width="240" height="420" rx="36" strokeWidth="3.5" />
                <circle cx="240" cy="420" r="45" strokeWidth="3" />
                <rect x="220" y="405" width="40" height="35" rx="8" fill={strokeColor} />
                <text x="240" y="695" fill={textColor} fontSize="13" fontWeight="900" textAnchor="middle">100% ON-DEVICE SQLITE</text>

                {/* Red/Blocked Cloud Connection Symbol on right */}
                <g>
                  {/* Cloud shape with strikethrough NO symbol */}
                  <path d="M 1100 380 C 1080 340, 1140 300, 1200 320 C 1240 290, 1300 330, 1290 380 C 1330 400, 1310 460, 1260 460 H 1100 C 1050 460, 1060 400, 1100 380 Z" strokeWidth="3" strokeDasharray="4 4" />
                  <line x1="1060" y1="460" x2="1320" y2="300" strokeWidth="4" strokeLinecap="round" />
                  <text x="1190" y="500" fill={textColor} fontSize="13" fontWeight="900" textAnchor="middle">NO CLOUD / ZERO TELEMETRY</text>
                </g>
              </g>
            )}

            {/* ────── SLIDE 5: "Up Next · Chapter 01 Smart Notifications" ────── */}
            {currentSlide === 5 && (
              <g stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round">
                {/* Notification Bell on Left */}
                <g>
                  <path d="M 200 340 C 200 300, 280 300, 280 340 V 420 L 300 440 H 180 L 200 420 Z" strokeWidth="3.5" />
                  <circle cx="240" cy="460" r="12" strokeWidth="3" />
                  <text x="240" y="505" fill={textColor} fontSize="13" fontWeight="900" textAnchor="middle">SMART NOTIFICATIONS</text>
                </g>

                {/* Trajectory Arrow leading to Chapter 01 Gateway */}
                <motion.path
                  d="M 340 400 Q 700 250, 1050 400"
                  strokeWidth="3.5"
                  strokeDasharray="10 10"
                  initial={{ pathOffset: 0 }}
                  animate={{ pathOffset: [0, 1] }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                />

                {/* Chapter 01 Gateway Doorway on Right */}
                <g>
                  <rect x="1080" y="260" width="200" height="340" rx="20" strokeWidth="4" />
                  <circle cx="1120" cy="430" r="8" strokeWidth="3" />
                  <text x="1180" y="630" fill={textColor} fontSize="13" fontWeight="900" textAnchor="middle">CHAPTER 01 ALARMS</text>
                </g>
              </g>
            )}
          </svg>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
