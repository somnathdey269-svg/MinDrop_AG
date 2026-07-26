import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AboutSketchBackgroundProps {
  currentSlide: number;
  isDark: boolean;
}

export function AboutMascotBackground({ currentSlide, isDark }: AboutSketchBackgroundProps) {
  // Darker, bolder stroke colors for maximum clarity and understandability
  const strokeColor = isDark ? "#FFFFFF" : "#0284C7";
  const labelColor = isDark ? "#38BDF8" : "#0369A1";
  const subtextColor = isDark ? "#BAE6FD" : "#0C4A6E";

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none w-full h-full">
      {/* Soft Background Architectural Grid */}
      <svg className="absolute inset-0 w-full h-full opacity-15 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="darker-sketch-grid" width="70" height="70" patternUnits="userSpaceOnUse">
            <circle cx="35" cy="35" r="2" fill={strokeColor} opacity="0.4" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#darker-sketch-grid)" />
      </svg>

      {/* Bold, Crisp, Relatable Vector Diagrams Flanking Left & Right of Text */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`darker-relatable-slide-${currentSlide}`}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: isDark ? 0.60 : 0.48, scale: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 w-full h-full"
        >
          <svg
            viewBox="0 0 1400 900"
            preserveAspectRatio="xMidYMid meet"
            className="w-full h-full absolute inset-0 transition-all duration-500"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* ────── SLIDE 0: "Your mind is for having ideas, not holding them. MinDrop is your second brain" ────── */}
            {currentSlide === 0 && (
              <g stroke={strokeColor} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                {/* LEFT FLANK: Human Head releasing Ideas */}
                <g>
                  {/* Head Profile Silhouette */}
                  <path
                    d="M 120 480 C 100 360, 160 220, 280 220 C 370 220, 420 290, 400 390 C 440 410, 460 450, 440 500 C 420 550, 370 570, 340 590 L 340 680 L 200 680 L 200 590 C 160 570, 130 520, 120 480 Z"
                    strokeWidth="4"
                    fill="none"
                  />
                  {/* Floating Lightbulb Idea */}
                  <motion.g
                    animate={{ y: [-10, 10, -10] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <circle cx="270" cy="310" r="32" strokeWidth="3.5" fill={isDark ? "#0C4A6E" : "#E0F2FE"} />
                    <path d="M 270 295 V 325 M 255 310 H 285" strokeWidth="3.5" />
                  </motion.g>
                  <text x="270" y="730" fill={labelColor} fontSize="15" fontWeight="900" textAnchor="middle">🧠 MIND = HAVING IDEAS</text>
                </g>

                {/* Flow Arrow across top margin */}
                <motion.path
                  d="M 460 260 Q 700 160, 960 260"
                  strokeWidth="4"
                  strokeDasharray="10 10"
                  initial={{ pathOffset: 0 }}
                  animate={{ pathOffset: [0, 1] }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                />
                <path d="M 940 245 L 960 260 L 945 275" strokeWidth="4" />

                {/* RIGHT FLANK: Second Brain Storage Vault */}
                <g>
                  <rect x="980" y="220" width="300" height="460" rx="32" strokeWidth="4.5" fill={isDark ? "#0C4A6E" : "#FFFFFF"} opacity="0.9" />
                  <rect x="1020" y="280" width="220" height="70" rx="16" strokeWidth="3.5" strokeDasharray="6 6" />
                  <text x="1130" y="322" fill={subtextColor} fontSize="14" fontWeight="900" textAnchor="middle">📄 Idea Note 01</text>

                  <rect x="1020" y="380" width="220" height="70" rx="16" strokeWidth="3.5" strokeDasharray="6 6" />
                  <text x="1130" y="422" fill={subtextColor} fontSize="14" fontWeight="900" textAnchor="middle">⚡ Quick Task 02</text>

                  <rect x="1020" y="480" width="220" height="70" rx="16" strokeWidth="3.5" strokeDasharray="6 6" />
                  <text x="1130" y="522" fill={subtextColor} fontSize="14" fontWeight="900" textAnchor="middle">📍 Place Alert 03</text>

                  <text x="1130" y="730" fill={labelColor} fontSize="15" fontWeight="900" textAnchor="middle">📦 SECOND BRAIN = HOLDING THEM</text>
                </g>
              </g>
            )}

            {/* ────── SLIDE 1: "Small tasks create big mental fatigue. MinDrop unburdens your mind" ────── */}
            {currentSlide === 1 && (
              <g stroke={strokeColor} strokeWidth="3.5" strokeLinecap="round">
                {/* LEFT FLANK: Heavy Mental Fatigue Micro-Task Badges */}
                <g>
                  {/* Task 1: Milk */}
                  <rect x="60" y="220" width="280" height="75" rx="20" strokeWidth="4" fill={isDark ? "#0C4A6E" : "#FFFFFF"} />
                  <text x="200" y="266" fill={labelColor} fontSize="16" fontWeight="900" textAnchor="middle">🥛 Pick up milk</text>

                  {/* Task 2: Reply */}
                  <rect x="100" y="330" width="300" height="75" rx="20" strokeWidth="4" fill={isDark ? "#0C4A6E" : "#FFFFFF"} />
                  <text x="250" y="376" fill={labelColor} fontSize="16" fontWeight="900" textAnchor="middle">✉️ Reply to urgent email</text>

                  {/* Task 3: Alert */}
                  <rect x="70" y="440" width="280" height="75" rx="20" strokeWidth="4" fill={isDark ? "#0C4A6E" : "#FFFFFF"} />
                  <text x="210" y="486" fill={labelColor} fontSize="16" fontWeight="900" textAnchor="middle">📍 Check alert at store</text>

                  <text x="200" y="570" fill={subtextColor} fontSize="14" fontWeight="900" textAnchor="middle">⚡ MENTAL FATIGUE</text>
                </g>

                {/* RIGHT FLANK: MinDrop Unburdened Mindful Calm */}
                <g>
                  <motion.g
                    animate={{ y: [-8, 8, -8] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <rect x="1020" y="240" width="280" height="360" rx="36" strokeWidth="4.5" fill={isDark ? "#0C4A6E" : "#FFFFFF"} />
                    <path d="M 1070 380 Q 1160 320 1250 380" strokeWidth="4" />
                    <path d="M 1070 430 Q 1160 370 1250 430" strokeWidth="3.5" opacity="0.7" />
                    <path d="M 1070 480 Q 1160 420 1250 480" strokeWidth="3" opacity="0.4" />
                  </motion.g>

                  <text x="1160" y="650" fill={labelColor} fontSize="15" fontWeight="900" textAnchor="middle">🌿 UNBURDENED PEACE</text>
                </g>
              </g>
            )}

            {/* ────── SLIDE 2: "Capture in under 2 seconds. Zero setup friction" ────── */}
            {currentSlide === 2 && (
              <g stroke={strokeColor} strokeWidth="3.5" strokeLinecap="round">
                {/* LEFT FLANK: Stopwatch Timer < 2.0s */}
                <g>
                  <circle cx="220" cy="380" r="110" strokeWidth="4.5" fill={isDark ? "#0C4A6E" : "#FFFFFF"} />
                  <line x1="220" y1="380" x2="220" y2="290" strokeWidth="5" />
                  <line x1="220" y1="380" x2="270" y2="410" strokeWidth="5" />
                  <text x="220" y="540" fill={labelColor} fontSize="20" fontWeight="900" textAnchor="middle">⏱️ &lt; 2.0 SECONDS</text>
                </g>

                {/* RIGHT FLANK: Instant Dropped Note Card with Checkmark */}
                <g>
                  <rect x="1000" y="220" width="320" height="420" rx="32" strokeWidth="4.5" fill={isDark ? "#0C4A6E" : "#FFFFFF"} />
                  <line x1="1050" y1="310" x2="1270" y2="310" strokeWidth="4" />
                  <line x1="1050" y1="370" x2="1220" y2="370" strokeWidth="3.5" strokeDasharray="6 6" />

                  {/* Checkmark */}
                  <motion.path
                    d="M 1060 480 L 1120 540 L 1240 420"
                    strokeWidth="6"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
                  />
                  <text x="1160" y="690" fill={labelColor} fontSize="15" fontWeight="900" textAnchor="middle">⚡ ZERO SETUP FRICTION</text>
                </g>
              </g>
            )}

            {/* ────── SLIDE 3: "Hardware-native architecture. WorkManager & SQLite" ────── */}
            {currentSlide === 3 && (
              <g stroke={strokeColor} strokeWidth="3.5" strokeLinecap="round">
                {/* LEFT FLANK: Android WorkManager Gear */}
                <g>
                  <motion.g
                    animate={{ rotate: 360 }}
                    style={{ transformOrigin: "220px 380px" }}
                    transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                  >
                    <circle cx="220" cy="380" r="95" strokeWidth="4.5" strokeDasharray="8 8" />
                    <circle cx="220" cy="380" r="35" strokeWidth="4" />
                  </motion.g>
                  <text x="220" y="530" fill={labelColor} fontSize="15" fontWeight="900" textAnchor="middle">⚙️ ANDROID WORKMANAGER</text>
                </g>

                {/* RIGHT FLANK: Local SQLite Database Cylinder */}
                <g>
                  <ellipse cx="1160" cy="260" rx="120" ry="40" strokeWidth="4.5" fill={isDark ? "#0C4A6E" : "#FFFFFF"} />
                  <line x1="1040" y1="260" x2="1040" y2="500" strokeWidth="4.5" />
                  <line x1="1280" y1="260" x2="1280" y2="500" strokeWidth="4.5" />
                  <ellipse cx="1160" cy="380" rx="120" ry="40" strokeDasharray="8 8" strokeWidth="3.5" />
                  <ellipse cx="1160" cy="500" rx="120" ry="40" strokeWidth="4.5" />
                  <text x="1160" y="580" fill={labelColor} fontSize="15" fontWeight="900" textAnchor="middle">🗄️ LOCAL SQLITE DB</text>
                </g>
              </g>
            )}

            {/* ────── SLIDE 4: "100% LOCAL PRIVACY. Your thoughts never leave your phone" ────── */}
            {currentSlide === 4 && (
              <g stroke={strokeColor} strokeWidth="3.5" strokeLinecap="round">
                {/* LEFT FLANK: On-Device Vault Lock */}
                <g>
                  <rect x="100" y="240" width="260" height="420" rx="40" strokeWidth="4.5" fill={isDark ? "#0C4A6E" : "#FFFFFF"} />
                  <rect x="195" y="420" width="70" height="60" rx="12" strokeWidth="4" />
                  <path d="M 210 420 V 380 C 210 355, 250 355, 250 380 V 420" strokeWidth="4" />
                  <text x="230" y="700" fill={labelColor} fontSize="15" fontWeight="900" textAnchor="middle">🔒 100% ON-DEVICE VAULT</text>
                </g>

                {/* RIGHT FLANK: Blocked Cloud Symbol */}
                <g>
                  <path d="M 1040 400 C 1020 350, 1080 300, 1150 320 C 1200 280, 1280 330, 1270 390 C 1320 410, 1300 480, 1240 480 H 1040 C 980 480, 990 410, 1040 400 Z" strokeWidth="4" strokeDasharray="6 6" />
                  <line x1="990" y1="490" x2="1320" y2="290" strokeWidth="6" strokeLinecap="round" />
                  <text x="1160" y="540" fill={labelColor} fontSize="15" fontWeight="900" textAnchor="middle">🚫 ZERO CLOUD TELEMETRY</text>
                </g>
              </g>
            )}

            {/* ────── SLIDE 5: "UP NEXT · CHAPTER 01 Smart Notifications" ────── */}
            {currentSlide === 5 && (
              <g stroke={strokeColor} strokeWidth="3.5" strokeLinecap="round">
                {/* LEFT FLANK: Smart Notification Bell */}
                <g>
                  <path d="M 180 340 C 180 290, 280 290, 280 340 V 440 L 310 470 H 150 L 180 440 Z" strokeWidth="4.5" fill={isDark ? "#0C4A6E" : "#FFFFFF"} />
                  <circle cx="230" cy="495" r="16" strokeWidth="4" />
                  <text x="230" y="550" fill={labelColor} fontSize="15" fontWeight="900" textAnchor="middle">🔔 SMART NOTIFICATIONS</text>
                </g>

                {/* RIGHT FLANK: Chapter 01 Alarm Gateway */}
                <g>
                  <rect x="1020" y="240" width="240" height="380" rx="28" strokeWidth="4.5" fill={isDark ? "#0C4A6E" : "#FFFFFF"} />
                  <circle cx="1070" cy="430" r="10" strokeWidth="3.5" />
                  <text x="1140" y="660" fill={labelColor} fontSize="15" fontWeight="900" textAnchor="middle">🚨 CHAPTER 01 ALARMS</text>
                </g>
              </g>
            )}
          </svg>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
