import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AboutSketchBackgroundProps {
  currentSlide: number;
  isDark: boolean;
}

export function AboutMascotBackground({ currentSlide, isDark }: AboutSketchBackgroundProps) {
  // Stroke colors based on light vs dark slide background
  const strokeColor = isDark ? "#FFFFFF" : "#000000";
  const accentStroke = isDark ? "#7DD3FC" : "#0284C7";

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none">
      {/* Subtle Black & White Architectural Blueprint Grid Pattern */}
      <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="bw-dot-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="20" cy="20" r="1.2" fill={strokeColor} opacity="0.6" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#bw-dot-grid)" />
      </svg>

      {/* Main Meaningful SVG Vector Sketch (Responsive for all screen sizes) */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`sketch-slide-${currentSlide}`}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: isDark ? 0.22 : 0.16, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 flex items-center justify-center p-4 sm:p-8"
        >
          <svg
            viewBox="0 0 1000 800"
            preserveAspectRatio="xMidYMid meet"
            className="w-full h-full max-w-5xl max-h-[85vh] transition-all duration-500"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* ────── SLIDE 0: Tangled Mind -> Organized Second Brain ────── */}
            {currentSlide === 0 && (
              <g stroke={strokeColor} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                {/* Tangled chaotic thoughts on left */}
                <motion.path
                  d="M 120 400 Q 180 320 220 440 T 280 340 T 320 460 T 380 380"
                  strokeDasharray="6 6"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2.5, repeat: Infinity, repeatType: "reverse" }}
                />
                {/* Connecting arrow/funnel */}
                <motion.path
                  d="M 380 400 C 450 400, 480 300, 550 300 M 380 400 C 450 400, 480 500, 550 500"
                  strokeDasharray="4 4"
                />
                {/* Harmonious organized Second Brain node matrix on right */}
                <circle cx="700" cy="300" r="35" strokeWidth="2.5" />
                <circle cx="700" cy="500" r="35" strokeWidth="2.5" />
                <circle cx="850" cy="400" r="45" strokeWidth="3" />

                {/* Connecting node lines */}
                <line x1="735" y1="300" x2="805" y2="400" strokeDasharray="5 5" />
                <line x1="735" y1="500" x2="805" y2="400" strokeDasharray="5 5" />
                <line x1="700" y1="335" x2="700" y2="465" />

                {/* Lightbulb sketch inside central node */}
                <path d="M 850 380 C 840 380, 835 390, 840 400 C 845 408, 848 412, 848 418 L 852 418 C 852 412, 855 408, 860 400 C 865 390, 860 380, 850 380 Z" strokeWidth="2" />

                {/* Orbiting idea rings */}
                <motion.ellipse
                  cx="850" cy="400" rx="90" ry="40"
                  strokeDasharray="8 8"
                  animate={{ rotate: 360 }}
                  style={{ transformOrigin: "850px 400px" }}
                  transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
                />
              </g>
            )}

            {/* ────── SLIDE 1: Unburdening Mental Fatigue ────── */}
            {currentSlide === 1 && (
              <g stroke={strokeColor} strokeWidth="2" strokeLinecap="round">
                {/* Heavy mental weight balance scale */}
                <line x1="200" y1="400" x2="800" y2="400" strokeWidth="3" />
                <line x1="500" y1="400" x2="500" y2="600" strokeWidth="4" />
                <path d="M 440 600 L 560 600" strokeWidth="4" />

                {/* Left side: Heavy stack of mental tasks */}
                <g opacity="0.8">
                  <rect x="220" y="320" width="120" height="70" rx="8" strokeDasharray="4 4" />
                  <rect x="235" y="240" width="90" height="70" rx="8" />
                  <rect x="250" y="170" width="60" height="60" rx="8" />
                </g>

                {/* Right side: MinDrop feather-light floating notes unburdening */}
                <motion.g
                  animate={{ y: [-10, 10, -10] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <rect x="660" y="260" width="110" height="80" rx="16" strokeWidth="3" />
                  <path d="M 690 290 L 740 290 M 690 310 L 720 310" strokeWidth="2.5" />
                  {/* Floating upward arrow */}
                  <path d="M 715 220 L 715 160 M 700 175 L 715 160 L 730 175" strokeWidth="2.5" />
                </motion.g>

                {/* Gentle ripple waves below */}
                <path d="M 150 650 Q 500 620 850 650" strokeDasharray="6 6" />
              </g>
            )}

            {/* ────── SLIDE 2: Frictionless 2-Second Capture ────── */}
            {currentSlide === 2 && (
              <g stroke={strokeColor} strokeWidth="2.2" strokeLinecap="round">
                {/* Lightning Speed path */}
                <motion.path
                  d="M 150 200 L 450 380 L 400 420 L 700 600"
                  strokeWidth="3"
                  strokeDasharray="10 10"
                  initial={{ pathOffset: 0 }}
                  animate={{ pathOffset: [0, 1] }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                />

                {/* Minimalist Note Pad Sketch */}
                <rect x="350" y="220" width="300" height="360" rx="24" strokeWidth="3.5" fill="none" />
                {/* Note lines */}
                <line x1="400" y1="300" x2="600" y2="300" strokeWidth="3" />
                <line x1="400" y1="360" x2="560" y2="360" strokeWidth="2.5" strokeDasharray="5 5" />
                <line x1="400" y1="420" x2="520" y2="420" strokeWidth="2.5" strokeDasharray="5 5" />

                {/* Instant Checkmark */}
                <motion.path
                  d="M 390 490 L 420 520 L 480 460"
                  strokeWidth="4"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
                />

                {/* Stopwatch dial in background */}
                <circle cx="750" cy="300" r="70" strokeDasharray="6 6" />
                <line x1="750" y1="300" x2="750" y2="250" strokeWidth="3" />
                <line x1="750" y1="300" x2="780" y2="320" strokeWidth="3" />
              </g>
            )}

            {/* ────── SLIDE 3: Hardware-Native Android Architecture ────── */}
            {currentSlide === 3 && (
              <g stroke={strokeColor} strokeWidth="2" strokeLinecap="round">
                {/* Android Phone outline sketch */}
                <rect x="180" y="160" width="280" height="480" rx="36" strokeWidth="3.5" />
                <line x1="280" y1="190" x2="360" y2="190" strokeWidth="3" />

                {/* Internal SQLite Cylinder Database blueprint */}
                <g opacity="0.9">
                  <ellipse cx="680" cy="240" rx="100" ry="30" strokeWidth="3" />
                  <line x1="580" y1="240" x2="580" y2="440" strokeWidth="3" />
                  <line x1="780" y1="240" x2="780" y2="440" strokeWidth="3" />
                  <ellipse cx="680" cy="340" rx="100" ry="30" strokeDasharray="6 6" />
                  <ellipse cx="680" cy="440" rx="100" ry="30" strokeWidth="3" />
                </g>

                {/* Inter-connecting WorkManager gear lines */}
                <path d="M 460 300 C 520 300, 520 280, 580 280" strokeWidth="2.5" strokeDasharray="6 6" />
                <path d="M 460 440 C 520 440, 520 400, 580 400" strokeWidth="2.5" strokeDasharray="6 6" />

                {/* Rotating gear wheel */}
                <motion.g
                  animate={{ rotate: 360 }}
                  style={{ transformOrigin: "520px 370px" }}
                  transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                >
                  <circle cx="520" cy="370" r="30" strokeDasharray="4 4" strokeWidth="2.5" />
                  <circle cx="520" cy="370" r="10" />
                </motion.g>
              </g>
            )}

            {/* ────── SLIDE 4: Data Sovereignty & 100% Local Privacy ────── */}
            {currentSlide === 4 && (
              <g stroke={strokeColor} strokeWidth="2.2" strokeLinecap="round">
                {/* Hand-drawn Privacy Shield Vault */}
                <path
                  d="M 500 160 C 650 160, 750 200, 750 350 C 750 520, 580 620, 500 660 C 420 620, 250 520, 250 350 C 250 200, 350 160, 500 160 Z"
                  strokeWidth="4"
                  fill="none"
                />

                {/* Inner Lock Mechanism Sketch */}
                <rect x="440" y="380" width="120" height="100" rx="16" strokeWidth="3.5" />
                <path d="M 465 380 V 330 C 465 305, 535 305, 535 330 V 380" strokeWidth="3.5" fill="none" />
                <circle cx="500" cy="425" r="10" />
                <line x1="500" y1="435" x2="500" y2="455" strokeWidth="3" />

                {/* Encrypted data particles orbiting within vault */}
                <motion.circle
                  cx="500" cy="400" r="160"
                  strokeDasharray="8 8"
                  animate={{ rotate: -360 }}
                  style={{ transformOrigin: "500px 400px" }}
                  transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                />
              </g>
            )}

            {/* ────── SLIDE 5: Chapter 01 Transition Bridge ────── */}
            {currentSlide === 5 && (
              <g stroke={strokeColor} strokeWidth="2.2" strokeLinecap="round">
                {/* Forward flowing trajectory path */}
                <motion.path
                  d="M 200 400 C 400 250, 600 550, 800 400"
                  strokeWidth="3"
                  strokeDasharray="8 8"
                  initial={{ pathOffset: 0 }}
                  animate={{ pathOffset: [0, 1] }}
                  transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                />

                {/* Chapter Doorway portal frame */}
                <rect x="720" y="260" width="160" height="280" rx="20" strokeWidth="3.5" />
                <circle cx="750" cy="400" r="6" strokeWidth="3" />

                {/* Sparkle constellation icons leading into doorway */}
                <path d="M 300 350 L 310 370 L 330 380 L 310 390 L 300 410 L 290 390 L 270 380 L 290 370 Z" strokeWidth="2" />
                <path d="M 500 420 L 507 435 L 522 442 L 507 449 L 500 464 L 493 449 L 478 442 L 493 435 Z" strokeWidth="2" />
              </g>
            )}
          </svg>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
