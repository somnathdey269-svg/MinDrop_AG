import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface UniversalSketchStoryProps {
  currentSlide: number;
  isDark: boolean;
}

export function UniversalSketchStory({ currentSlide, isDark }: UniversalSketchStoryProps) {
  // Bold, crisp stroke colors for maximum clarity and universal understanding
  const strokeColor = isDark ? "#38BDF8" : "#0284C7";
  const dimColor = isDark ? "rgba(255,255,255,0.7)" : "rgba(2,132,199,0.8)";
  const cardBg = isDark ? "rgba(12, 74, 110, 0.6)" : "rgba(255, 255, 255, 0.7)";
  const textColor = isDark ? "#E0F2FE" : "#0F172A";

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none w-full h-full">
      {/* Background Architectural Canvas Pattern */}
      <svg className="absolute inset-0 w-full h-full opacity-15 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="universal-story-grid" width="80" height="80" patternUnits="userSpaceOnUse">
            <circle cx="40" cy="40" r="2" fill={strokeColor} opacity="0.4" />
            <line x1="0" y1="40" x2="80" y2="40" stroke={strokeColor} strokeWidth="0.5" opacity="0.15" strokeDasharray="4 4" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#universal-story-grid)" />
      </svg>

      {/* Universal Animated Story Schematics per Slide */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`universal-story-${currentSlide}`}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: isDark ? 0.75 : 0.65, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 w-full h-full"
        >
          <svg
            viewBox="0 0 1400 900"
            preserveAspectRatio="xMidYMid meet"
            className="w-full h-full absolute inset-0 transition-all duration-500"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* ────── SLIDE 0: Mind (Having Ideas) -> Second Brain (Holding Them) ────── */}
            {currentSlide === 0 && (
              <g stroke={strokeColor} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                {/* LEFT: Human Head Profile releasing thoughts */}
                <g>
                  <path
                    d="M 100 480 C 80 360, 140 220, 260 220 C 350 220, 400 290, 380 390 C 420 410, 440 450, 420 500 C 400 550, 350 570, 320 590 L 320 680 L 180 680 L 180 590 C 140 570, 110 520, 100 480 Z"
                    strokeWidth="4"
                    fill={cardBg}
                  />
                  {/* Floating Lightbulb Thought */}
                  <motion.g
                    animate={{ y: [-8, 8, -8] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <circle cx="250" cy="310" r="35" strokeWidth="4" fill={isDark ? "#0C4A6E" : "#E0F2FE"} />
                    <path d="M 250 292 V 328 M 232 310 H 268" strokeWidth="4" />
                  </motion.g>
                  <text x="250" y="730" fill={dimColor} fontSize="16" fontWeight="900" textAnchor="middle">🧠 MIND = HAVING IDEAS</text>
                </g>

                {/* Trajectory Arrow from Mind -> Second Brain */}
                <motion.path
                  d="M 420 260 Q 700 140, 980 260"
                  strokeWidth="4"
                  strokeDasharray="10 10"
                  initial={{ pathOffset: 0 }}
                  animate={{ pathOffset: [0, 1] }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                />
                <path d="M 960 245 L 980 260 L 965 275" strokeWidth="4" />

                {/* RIGHT: Second Brain Vault Notebook */}
                <g>
                  <rect x="980" y="210" width="320" height="480" rx="36" strokeWidth="4.5" fill={cardBg} />
                  <rect x="1020" y="270" width="240" height="75" rx="18" strokeWidth="3.5" strokeDasharray="6 6" fill={isDark ? "#0C4A6E" : "#FFFFFF"} />
                  <text x="1140" y="315" fill={textColor} fontSize="15" fontWeight="900" textAnchor="middle">📄 Idea Note 01</text>

                  <rect x="1020" y="370" width="240" height="75" rx="18" strokeWidth="3.5" strokeDasharray="6 6" fill={isDark ? "#0C4A6E" : "#FFFFFF"} />
                  <text x="1140" y="415" fill={textColor} fontSize="15" fontWeight="900" textAnchor="middle">⚡ Quick Task 02</text>

                  <rect x="1020" y="470" width="240" height="75" rx="18" strokeWidth="3.5" strokeDasharray="6 6" fill={isDark ? "#0C4A6E" : "#FFFFFF"} />
                  <text x="1140" y="515" fill={textColor} fontSize="15" fontWeight="900" textAnchor="middle">📍 Place Alert 03</text>

                  <text x="1140" y="730" fill={dimColor} fontSize="16" fontWeight="900" textAnchor="middle">📦 SECOND BRAIN = HOLDING THEM</text>
                </g>
              </g>
            )}

            {/* ────── SLIDE 1: Everyday Micro-Tasks -> Unburdened Peace ────── */}
            {currentSlide === 1 && (
              <g stroke={strokeColor} strokeWidth="3.5" strokeLinecap="round">
                {/* LEFT: 3 Micro-Task Badges */}
                <g>
                  <rect x="50" y="210" width="300" height="80" rx="22" strokeWidth="4" fill={cardBg} />
                  <text x="200" y="258" fill={textColor} fontSize="17" fontWeight="900" textAnchor="middle">🥛 Pick up milk</text>

                  <rect x="90" y="320" width="320" height="80" rx="22" strokeWidth="4" fill={cardBg} />
                  <text x="250" y="368" fill={textColor} fontSize="17" fontWeight="900" textAnchor="middle">✉️ Reply to urgent email</text>

                  <rect x="60" y="430" width="300" height="80" rx="22" strokeWidth="4" fill={cardBg} />
                  <text x="210" y="478" fill={textColor} fontSize="17" fontWeight="900" textAnchor="middle">📍 Check alert at store</text>

                  <text x="200" y="560" fill={dimColor} fontSize="15" fontWeight="900" textAnchor="middle">⚡ MENTAL FATIGUE</text>
                </g>

                {/* Trajectory funnel to peace */}
                <path d="M 420 360 Q 700 360 1000 480" strokeWidth="4" strokeDasharray="10 10" />

                {/* RIGHT: MinDrop Unburdened Peace Card */}
                <g>
                  <motion.g
                    animate={{ y: [-8, 8, -8] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <rect x="1000" y="240" width="320" height="380" rx="40" strokeWidth="4.5" fill={cardBg} />
                    <path d="M 1050 390 Q 1160 330 1270 390" strokeWidth="4.5" />
                    <path d="M 1050 440 Q 1160 380 1270 440" strokeWidth="4" opacity="0.7" />
                    <path d="M 1050 490 Q 1160 430 1270 490" strokeWidth="3.5" opacity="0.4" />
                  </motion.g>

                  <text x="1160" y="670" fill={dimColor} fontSize="16" fontWeight="900" textAnchor="middle">🌿 UNBURDENED PEACE</text>
                </g>
              </g>
            )}

            {/* ────── SLIDE 2: Capture in under 2 seconds. Zero setup friction ────── */}
            {currentSlide === 2 && (
              <g stroke={strokeColor} strokeWidth="3.5" strokeLinecap="round">
                {/* LEFT: Stopwatch < 2.0s */}
                <g>
                  <circle cx="210" cy="380" r="120" strokeWidth="5" fill={cardBg} />
                  <line x1="210" y1="380" x2="210" y2="280" strokeWidth="6" />
                  <line x1="210" y1="380" x2="265" y2="415" strokeWidth="6" />
                  <text x="210" y="555" fill={dimColor} fontSize="22" fontWeight="900" textAnchor="middle">⏱️ &lt; 2.0 SECONDS</text>
                </g>

                {/* Fast Speed Track */}
                <motion.path
                  d="M 340 380 H 980"
                  strokeWidth="4.5"
                  strokeDasharray="12 12"
                  initial={{ pathOffset: 0 }}
                  animate={{ pathOffset: [0, 1] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                />

                {/* RIGHT: Instant Checkmark Note Card */}
                <g>
                  <rect x="980" y="210" width="340" height="440" rx="36" strokeWidth="4.5" fill={cardBg} />
                  <line x1="1030" y1="300" x2="1270" y2="300" strokeWidth="4.5" />
                  <line x1="1030" y1="360" x2="1220" y2="360" strokeWidth="4" strokeDasharray="6 6" />

                  <motion.path
                    d="M 1040 480 L 1110 550 L 1240 420"
                    strokeWidth="7"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
                  />
                  <text x="1150" y="700" fill={dimColor} fontSize="16" fontWeight="900" textAnchor="middle">⚡ ZERO SETUP FRICTION</text>
                </g>
              </g>
            )}

            {/* ────── SLIDE 3: Hardware-Native Android WorkManager & SQLite ────── */}
            {currentSlide === 3 && (
              <g stroke={strokeColor} strokeWidth="3.5" strokeLinecap="round">
                {/* LEFT: Android WorkManager Gear */}
                <g>
                  <motion.g
                    animate={{ rotate: 360 }}
                    style={{ transformOrigin: "210px 380px" }}
                    transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                  >
                    <circle cx="210" cy="380" r="105" strokeWidth="5" strokeDasharray="10 10" />
                    <circle cx="210" cy="380" r="38" strokeWidth="4.5" fill={cardBg} />
                  </motion.g>
                  <text x="210" y="540" fill={dimColor} fontSize="16" fontWeight="900" textAnchor="middle">⚙️ ANDROID WORKMANAGER</text>
                </g>

                {/* Circuit Bus Line */}
                <path d="M 330 380 H 960" strokeWidth="4" strokeDasharray="12 12" />

                {/* RIGHT: SQLite Database Cylinder */}
                <g>
                  <ellipse cx="1140" cy="250" rx="140" ry="45" strokeWidth="5" fill={cardBg} />
                  <line x1="1000" y1="250" x2="1000" y2="510" strokeWidth="5" />
                  <line x1="1280" y1="250" x2="1280" y2="510" strokeWidth="5" />
                  <ellipse cx="1140" cy="380" rx="140" ry="45" strokeDasharray="8 8" strokeWidth="4" />
                  <ellipse cx="1140" cy="510" rx="140" ry="45" strokeWidth="5" fill={cardBg} />
                  <text x="1140" y="600" fill={dimColor} fontSize="16" fontWeight="900" textAnchor="middle">🗄️ LOCAL SQLITE DB</text>
                </g>
              </g>
            )}

            {/* ────── SLIDE 4: 100% Local Privacy (On-Device Vault vs Blocked Cloud) ────── */}
            {currentSlide === 4 && (
              <g stroke={strokeColor} strokeWidth="3.5" strokeLinecap="round">
                {/* LEFT: Local Vault Lock Card */}
                <g>
                  <rect x="80" y="220" width="280" height="460" rx="44" strokeWidth="5" fill={cardBg} />
                  <rect x="180" y="420" width="80" height="70" rx="16" strokeWidth="4.5" fill={isDark ? "#0C4A6E" : "#FFFFFF"} />
                  <path d="M 195 420 V 375 C 195 350, 245 350, 245 375 V 420" strokeWidth="4.5" fill="none" />
                  <text x="220" y="730" fill={dimColor} fontSize="16" fontWeight="900" textAnchor="middle">🔒 100% ON-DEVICE VAULT</text>
                </g>

                {/* RIGHT: Blocked Cloud Symbol */}
                <g>
                  <path d="M 1020 390 C 1000 340, 1060 290, 1130 310 C 1180 270, 1260 320, 1250 380 C 1300 400, 1280 470, 1220 470 H 1020 C 960 470, 970 400, 1020 390 Z" strokeWidth="4.5" strokeDasharray="6 6" fill={cardBg} />
                  <line x1="960" y1="490" x2="1310" y2="280" strokeWidth="7" strokeLinecap="round" />
                  <text x="1140" y="540" fill={dimColor} fontSize="16" fontWeight="900" textAnchor="middle">🚫 ZERO CLOUD TELEMETRY</text>
                </g>
              </g>
            )}

            {/* ────── SLIDE 5: Up Next · Chapter 01 Smart Notifications ────── */}
            {currentSlide === 5 && (
              <g stroke={strokeColor} strokeWidth="3.5" strokeLinecap="round">
                {/* LEFT: Notification Bell */}
                <g>
                  <path d="M 160 330 C 160 270, 270 270, 270 330 V 440 L 300 470 H 130 L 160 440 Z" strokeWidth="5" fill={cardBg} />
                  <circle cx="215" cy="495" r="18" strokeWidth="4.5" fill={isDark ? "#0C4A6E" : "#FFFFFF"} />
                  <text x="215" y="560" fill={dimColor} fontSize="16" fontWeight="900" textAnchor="middle">🔔 SMART NOTIFICATIONS</text>
                </g>

                {/* RIGHT: Chapter 01 Gateway Doorway */}
                <g>
                  <rect x="1000" y="220" width="280" height="420" rx="32" strokeWidth="5" fill={cardBg} />
                  <circle cx="1060" cy="430" r="12" strokeWidth="4" />
                  <text x="1140" y="690" fill={dimColor} fontSize="16" fontWeight="900" textAnchor="middle">🚨 CHAPTER 01 ALARMS</text>
                </g>
              </g>
            )}
          </svg>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
