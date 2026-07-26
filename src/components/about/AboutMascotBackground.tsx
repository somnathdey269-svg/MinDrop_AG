import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AboutSketchBackgroundProps {
  currentSlide: number;
  isDark: boolean;
}

export function AboutMascotBackground({ currentSlide, isDark }: AboutSketchBackgroundProps) {
  // Stroke colors based on light vs dark slide background with crisp contrast
  const strokeColor = isDark ? "#FFFFFF" : "#0284C7";
  const dimStroke = isDark ? "#38BDF8" : "#0369A1";

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10 select-none w-full h-full">
      {/* 1. Full-Screen Architectural Grid Pattern */}
      <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="full-sketch-grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <circle cx="30" cy="30" r="1.8" fill={strokeColor} />
            <line x1="0" y1="30" x2="60" y2="30" stroke={strokeColor} strokeWidth="0.5" opacity="0.3" strokeDasharray="4 4" />
            <line x1="30" y1="0" x2="30" y2="60" stroke={strokeColor} strokeWidth="0.5" opacity="0.3" strokeDasharray="4 4" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#full-sketch-grid)" />
      </svg>

      {/* 2. Full-Screen Full-Bleed Edge-to-Edge Animated Vector Schematics */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`full-sketch-slide-${currentSlide}`}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: isDark ? 0.45 : 0.38, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 w-full h-full"
        >
          <svg
            viewBox="0 0 1400 900"
            preserveAspectRatio="none"
            className="w-full h-full absolute inset-0 transition-all duration-500"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* ────── SLIDE 0: Full-Screen Neural Thought Web -> Second Brain ────── */}
            {currentSlide === 0 && (
              <g stroke={strokeColor} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                {/* Full-width chaotic squiggles starting from top-left */}
                <motion.path
                  d="M 50 150 Q 200 40 350 250 T 650 120 T 950 300 T 1350 180"
                  strokeDasharray="10 10"
                  initial={{ pathOffset: 0 }}
                  animate={{ pathOffset: [0, 1] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                />

                {/* Sweeping diagonal thought funnel connecting edge to edge */}
                <path d="M 100 800 C 400 650, 700 750, 1300 450" strokeWidth="4" strokeDasharray="8 8" />

                {/* Massive Second Brain Central & Corner Nodes */}
                <circle cx="200" cy="450" r="60" strokeWidth="4" />
                <circle cx="700" cy="450" r="90" strokeWidth="5" />
                <circle cx="1200" cy="500" r="75" strokeWidth="4" />

                {/* Edge-to-Edge Connecting Node Cables */}
                <line x1="260" y1="450" x2="610" y2="450" strokeWidth="4" strokeDasharray="12 12" />
                <line x1="790" y1="450" x2="1125" y2="500" strokeWidth="4" strokeDasharray="12 12" />

                {/* Central Lightbulb & Synapses */}
                <path d="M 700 410 C 680 410, 670 430, 680 450 C 690 466, 695 474, 695 486 L 705 486 C 705 474, 710 466, 720 450 C 730 430, 720 410, 700 410 Z" strokeWidth="3.5" />
                <circle cx="700" cy="450" r="160" strokeDasharray="10 10" strokeWidth="3" opacity="0.7">
                  <animateTransform attributeName="transform" type="rotate" from="0 700 450" to="360 700 450" dur="25s" repeatCount="indefinite" />
                </circle>
              </g>
            )}

            {/* ────── SLIDE 1: Full-Screen Balance Scale & Unburdening Waves ────── */}
            {currentSlide === 1 && (
              <g stroke={strokeColor} strokeWidth="3.5" strokeLinecap="round">
                {/* Full-width baseline scale beam across entire screen */}
                <line x1="80" y1="480" x2="1320" y2="480" strokeWidth="5" />
                <line x1="700" y1="480" x2="700" y2="820" strokeWidth="6" />
                <path d="M 600 820 L 800 820" strokeWidth="6" />

                {/* Heavy mental fatigue boxes on left quadrant */}
                <g opacity="0.95">
                  <rect x="150" y="320" width="220" height="150" rx="16" strokeWidth="4" strokeDasharray="6 6" />
                  <rect x="180" y="190" width="160" height="120" rx="16" strokeWidth="4" />
                  <rect x="210" y="80" width="100" height="100" rx="16" strokeWidth="4" />
                </g>

                {/* Light floating notes ascending on right quadrant */}
                <motion.g
                  animate={{ y: [-15, 15, -15] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <rect x="1000" y="240" width="220" height="160" rx="24" strokeWidth="4.5" />
                  <line x1="1040" y1="290" x2="1180" y2="290" strokeWidth="4" />
                  <line x1="1040" y1="340" x2="1140" y2="340" strokeWidth="3.5" strokeDasharray="6 6" />
                  {/* Upward unburdening arrow spanning to top right */}
                  <path d="M 1110 200 L 1110 80 M 1080 110 L 1110 80 L 1140 110" strokeWidth="5" />
                </motion.g>

                {/* Full-width ocean waves across bottom viewport */}
                <path d="M 0 850 Q 350 780 700 850 T 1400 850" strokeDasharray="12 12" strokeWidth="3.5" />
              </g>
            )}

            {/* ────── SLIDE 2: Full-Screen Lightning 2-Second Speed Track ────── */}
            {currentSlide === 2 && (
              <g stroke={strokeColor} strokeWidth="4" strokeLinecap="round">
                {/* Z-shaped lightning trajectory spanning all four corners */}
                <motion.path
                  d="M 50 100 L 1350 250 L 50 650 L 1350 800"
                  strokeWidth="6"
                  strokeDasharray="16 16"
                  initial={{ pathOffset: 0 }}
                  animate={{ pathOffset: [0, 1] }}
                  transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                />

                {/* Large Note Pad Frame in Center */}
                <rect x="450" y="200" width="500" height="500" rx="32" strokeWidth="5" fill="none" />
                <line x1="530" y1="320" x2="870" y2="320" strokeWidth="4" />
                <line x1="530" y1="400" x2="810" y2="400" strokeWidth="4" strokeDasharray="8 8" />
                <line x1="530" y1="480" x2="750" y2="480" strokeWidth="4" strokeDasharray="8 8" />

                {/* Large Checkmark inside Note Frame */}
                <motion.path
                  d="M 520 580 L 600 640 L 720 520"
                  strokeWidth="7"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1.5 }}
                />

                {/* Large Corner Stopwatch Dials */}
                <circle cx="200" cy="300" r="110" strokeDasharray="10 10" strokeWidth="4" />
                <line x1="200" y1="300" x2="200" y2="220" strokeWidth="5" />
                <line x1="200" y1="300" x2="260" y2="330" strokeWidth="5" />

                <circle cx="1200" cy="650" r="100" strokeDasharray="10 10" strokeWidth="4" />
              </g>
            )}

            {/* ────── SLIDE 3: Full-Screen Hardware-Native Blueprint ────── */}
            {currentSlide === 3 && (
              <g stroke={strokeColor} strokeWidth="3.5" strokeLinecap="round">
                {/* Android Phone Device Blueprint Frame on left */}
                <rect x="80" y="150" width="380" height="650" rx="48" strokeWidth="5" />
                <line x1="220" y1="200" x2="320" y2="200" strokeWidth="4" />
                <circle cx="270" cy="740" r="18" strokeWidth="4" />

                {/* Massive SQLite Database Cylinder on right */}
                <g opacity="0.95">
                  <ellipse cx="1100" cy="250" rx="180" ry="50" strokeWidth="5" />
                  <line x1="920" y1="250" x2="920" y2="650" strokeWidth="5" />
                  <line x1="1280" y1="250" x2="1280" y2="650" strokeWidth="5" />
                  <ellipse cx="1100" cy="450" rx="180" ry="50" strokeDasharray="10 10" strokeWidth="4" />
                  <ellipse cx="1100" cy="650" rx="180" ry="50" strokeWidth="5" />
                </g>

                {/* Connecting WorkManager Circuit Tracks across center */}
                <path d="M 460 350 C 650 350, 650 300, 920 300" strokeWidth="4" strokeDasharray="10 10" />
                <path d="M 460 550 C 650 550, 650 500, 920 500" strokeWidth="4" strokeDasharray="10 10" />

                {/* Large Center WorkManager Gear Wheel */}
                <motion.g
                  animate={{ rotate: 360 }}
                  style={{ transformOrigin: "690px 420px" }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <circle cx="690" cy="420" r="80" strokeDasharray="8 8" strokeWidth="4" />
                  <circle cx="690" cy="420" r="30" strokeWidth="4" />
                </motion.g>
              </g>
            )}

            {/* ────── SLIDE 4: Full-Screen Data Vault Shield ────── */}
            {currentSlide === 4 && (
              <g stroke={strokeColor} strokeWidth="4" strokeLinecap="round">
                {/* Full-width Privacy Shield Frame spanning center */}
                <path
                  d="M 700 80 C 1000 80, 1250 160, 1250 420 C 1250 680, 900 820, 700 870 C 500 820, 150 680, 150 420 C 150 160, 400 80, 700 80 Z"
                  strokeWidth="6"
                  fill="none"
                />

                {/* Center Vault Lock Mechanism */}
                <rect x="580" y="440" width="240" height="200" rx="28" strokeWidth="5" />
                <path d="M 630 440 V 350 C 630 300, 770 300, 770 350 V 440" strokeWidth="5" fill="none" />
                <circle cx="700" cy="520" r="20" strokeWidth="4" />
                <line x1="700" y1="540" x2="700" y2="580" strokeWidth="5" />

                {/* Orbiting Encryption Radar Rings covering all 4 quadrants */}
                <motion.circle
                  cx="700" cy="480" r="340"
                  strokeDasharray="14 14"
                  strokeWidth="3.5"
                  animate={{ rotate: -360 }}
                  style={{ transformOrigin: "700px 480px" }}
                  transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                />
              </g>
            )}

            {/* ────── SLIDE 5: Full-Screen Chapter Portal & Bridge ────── */}
            {currentSlide === 5 && (
              <g stroke={strokeColor} strokeWidth="4" strokeLinecap="round">
                {/* Grand Trajectory Bridge from bottom-left to top-right */}
                <motion.path
                  d="M 100 800 C 400 400, 900 700, 1250 350"
                  strokeWidth="6"
                  strokeDasharray="14 14"
                  initial={{ pathOffset: 0 }}
                  animate={{ pathOffset: [0, 1] }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                />

                {/* Gateway Portal Frame on Right */}
                <rect x="1050" y="150" width="260" height="480" rx="36" strokeWidth="6" />
                <circle cx="1100" cy="390" r="12" strokeWidth="4" />

                {/* Constellation Starbursts across left screen */}
                <path d="M 300 300 L 320 340 L 360 360 L 320 380 L 300 420 L 280 380 L 240 360 L 280 340 Z" strokeWidth="3.5" />
                <path d="M 650 500 L 665 530 L 695 545 L 665 560 L 650 590 L 635 560 L 605 545 L 635 530 Z" strokeWidth="3.5" />
              </g>
            )}
          </svg>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
