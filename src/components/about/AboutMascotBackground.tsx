import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AboutSketchBackgroundProps {
  currentSlide: number;
  isDark: boolean;
}

export function AboutMascotBackground({ currentSlide, isDark }: AboutSketchBackgroundProps) {
  // Ultra-refined stroke colors
  const strokeColor = isDark ? "#FFFFFF" : "#0284C7";

  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden z-10 select-none w-full h-full"
      style={{
        // Radial mask clearing the center 35% radius so no lines interfere with text
        WebkitMaskImage: "radial-gradient(circle at 50% 48%, transparent 28%, black 72%)",
        maskImage: "radial-gradient(circle at 50% 48%, transparent 28%, black 72%)",
      }}
    >
      {/* 1. Very Soft Ambient Corner Dot Grid */}
      <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="clean-sketch-grid" width="80" height="80" patternUnits="userSpaceOnUse">
            <circle cx="40" cy="40" r="1.2" fill={strokeColor} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#clean-sketch-grid)" />
      </svg>

      {/* 2. Elegant Peripheral Animated Sketches (Framing the outer screen margins) */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`clean-sketch-slide-${currentSlide}`}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: isDark ? 0.24 : 0.16, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 w-full h-full"
        >
          <svg
            viewBox="0 0 1400 900"
            preserveAspectRatio="xMidYMid slice"
            className="w-full h-full absolute inset-0 transition-all duration-500"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* ────── SLIDE 0: Outer Peripheral Thought Nodes (Clear Center) ────── */}
            {currentSlide === 0 && (
              <g stroke={strokeColor} strokeWidth="2" strokeLinecap="round">
                {/* Outer sweeping arc on top-left corner */}
                <motion.path
                  d="M -50 120 Q 200 20 400 120 T 700 30"
                  strokeDasharray="6 6"
                  initial={{ pathOffset: 0 }}
                  animate={{ pathOffset: [0, 1] }}
                  transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                />

                {/* Outer sweeping arc on bottom-right corner */}
                <motion.path
                  d="M 700 870 C 1000 870, 1200 780, 1450 820"
                  strokeDasharray="6 6"
                  initial={{ pathOffset: 0 }}
                  animate={{ pathOffset: [1, 0] }}
                  transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                />

                {/* Top-Left Corner Node */}
                <circle cx="120" cy="180" r="45" strokeWidth="2.5" />
                <circle cx="120" cy="180" r="85" strokeDasharray="6 6" opacity="0.6" />

                {/* Top-Right Corner Node */}
                <circle cx="1280" cy="180" r="55" strokeWidth="2.5" />
                <circle cx="1280" cy="180" r="95" strokeDasharray="6 6" opacity="0.6" />

                {/* Bottom-Left Corner Node */}
                <circle cx="150" cy="750" r="50" strokeWidth="2.5" />

                {/* Bottom-Right Corner Second Brain Cluster */}
                <circle cx="1250" cy="720" r="60" strokeWidth="3" />
                <circle cx="1250" cy="720" r="120" strokeDasharray="8 8" opacity="0.5">
                  <animateTransform attributeName="transform" type="rotate" from="0 1250 720" to="360 1250 720" dur="30s" repeatCount="indefinite" />
                </circle>
              </g>
            )}

            {/* ────── SLIDE 1: Peripheral Unburdening Waves (Clear Center) ────── */}
            {currentSlide === 1 && (
              <g stroke={strokeColor} strokeWidth="2" strokeLinecap="round">
                {/* Left Margin Stack */}
                <g opacity="0.8">
                  <rect x="50" y="250" width="140" height="90" rx="12" strokeDasharray="5 5" />
                  <rect x="70" y="160" width="100" height="70" rx="12" />
                </g>

                {/* Right Margin Floating Note */}
                <motion.g
                  animate={{ y: [-10, 10, -10] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <rect x="1200" y="200" width="150" height="110" rx="16" strokeWidth="2.5" />
                  <line x1="1230" y1="240" x2="1320" y2="240" strokeWidth="2" />
                  <line x1="1230" y1="270" x2="1290" y2="270" strokeWidth="2" strokeDasharray="4 4" />
                </motion.g>

                {/* Bottom Edge Ripple Waves */}
                <path d="M 0 860 Q 350 820 700 860 T 1400 860" strokeDasharray="8 8" strokeWidth="2" />
                <path d="M 0 880 Q 350 840 700 880 T 1400 880" strokeDasharray="6 6" strokeWidth="1.5" opacity="0.6" />
              </g>
            )}

            {/* ────── SLIDE 2: Peripheral Speed Tracks (Clear Center) ────── */}
            {currentSlide === 2 && (
              <g stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round">
                {/* Top Edge Speed Line */}
                <motion.path
                  d="M -50 80 L 1450 80"
                  strokeDasharray="12 12"
                  initial={{ pathOffset: 0 }}
                  animate={{ pathOffset: [0, 1] }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                />

                {/* Bottom Edge Speed Line */}
                <motion.path
                  d="M 1450 840 L -50 840"
                  strokeDasharray="12 12"
                  initial={{ pathOffset: 0 }}
                  animate={{ pathOffset: [0, 1] }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                />

                {/* Top-Right Corner Stopwatch */}
                <circle cx="1280" cy="160" r="70" strokeDasharray="6 6" strokeWidth="2.5" />
                <line x1="1280" y1="160" x2="1280" y2="110" strokeWidth="3" />

                {/* Bottom-Left Corner Stopwatch */}
                <circle cx="120" cy="740" r="60" strokeDasharray="6 6" strokeWidth="2.5" />
              </g>
            )}

            {/* ────── SLIDE 3: Peripheral Hardware Blueprint (Clear Center) ────── */}
            {currentSlide === 3 && (
              <g stroke={strokeColor} strokeWidth="2" strokeLinecap="round">
                {/* Left Edge Phone Frame Segment */}
                <rect x="-40" y="200" width="180" height="500" rx="36" strokeWidth="3" />

                {/* Right Edge SQLite Cylinder Segment */}
                <g opacity="0.85">
                  <ellipse cx="1320" cy="300" rx="110" ry="35" strokeWidth="3" />
                  <line x1="1210" y1="300" x2="1210" y2="600" strokeWidth="3" />
                  <line x1="1430" y1="300" x2="1430" y2="600" strokeWidth="3" />
                  <ellipse cx="1320" cy="450" rx="110" ry="35" strokeDasharray="6 6" />
                  <ellipse cx="1320" cy="600" rx="110" ry="35" strokeWidth="3" />
                </g>

                {/* Top Outer Circuit Lines */}
                <path d="M 0 100 H 1400" strokeDasharray="8 8" opacity="0.4" />
              </g>
            )}

            {/* ────── SLIDE 4: Peripheral Privacy Orbit Rings (Clear Center) ────── */}
            {currentSlide === 4 && (
              <g stroke={strokeColor} strokeWidth="2" strokeLinecap="round">
                {/* Top-Left Corner Shield Arc */}
                <path d="M -50 300 C 150 100, 300 50, 450 -50" strokeWidth="3" strokeDasharray="6 6" />

                {/* Bottom-Right Corner Shield Arc */}
                <path d="M 950 950 C 1100 850, 1250 800, 1450 600" strokeWidth="3" strokeDasharray="6 6" />

                {/* Large Outer Radial Orbit Ring framing center */}
                <motion.circle
                  cx="700" cy="450" r="420"
                  strokeDasharray="10 10"
                  strokeWidth="2"
                  animate={{ rotate: 360 }}
                  style={{ transformOrigin: "700px 450px" }}
                  transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
                />
              </g>
            )}

            {/* ────── SLIDE 5: Peripheral Chapter Trajectory (Clear Center) ────── */}
            {currentSlide === 5 && (
              <g stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round">
                {/* Top Outer Arc */}
                <motion.path
                  d="M -50 100 Q 700 -20 1450 100"
                  strokeDasharray="10 10"
                  initial={{ pathOffset: 0 }}
                  animate={{ pathOffset: [0, 1] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                />

                {/* Bottom Outer Arc */}
                <motion.path
                  d="M -50 820 Q 700 920 1450 820"
                  strokeDasharray="10 10"
                  initial={{ pathOffset: 0 }}
                  animate={{ pathOffset: [0, 1] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                />

                {/* Right Edge Gateway Portal Segment */}
                <rect x="1300" y="300" width="140" height="300" rx="24" strokeWidth="3" />
              </g>
            )}
          </svg>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
