import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ArtisticSketchBackgroundProps {
  currentSlide: number;
  isDark: boolean;
}

export function ArtisticSketchBackground({ currentSlide, isDark }: ArtisticSketchBackgroundProps) {
  // Master charcoal/graphite stroke colors for Light vs Dark theme slides
  const mainStroke = isDark ? "rgba(125, 211, 252, 0.45)" : "rgba(51, 65, 85, 0.38)";
  const softStroke = isDark ? "rgba(56, 189, 248, 0.30)" : "rgba(2, 132, 199, 0.25)";
  const detailStroke = isDark ? "rgba(186, 230, 253, 0.20)" : "rgba(100, 116, 139, 0.18)";
  const cloudFill = isDark ? "rgba(56, 189, 248, 0.05)" : "rgba(2, 132, 199, 0.04)";

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none w-full h-full">
      {/* Central Soft Vignette Mask to keep middle text corridor 100% readable while sketch fills outer flanks */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`artistic-sketch-master-slide-${currentSlide}`}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 w-full h-full flex items-center justify-center"
        >
          <svg
            viewBox="0 0 1600 1000"
            preserveAspectRatio="xMidYMid slice"
            className="w-full h-full absolute inset-0 transition-all duration-700"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Fine Pencil Texture Filter */}
              <filter id="pencilDetail" x="-10%" y="-10%" width="120%" height="120%">
                <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="4" result="noise" />
                <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" xChannelSelector="R" yChannelSelector="G" />
              </filter>
              {/* Radial gradient mask so central text corridor is clean & sketch framing shines on margins */}
              <mask id="centerCorridorMask">
                <rect x="0" y="0" width="1600" height="1000" fill="white" />
                <ellipse cx="800" cy="500" rx="420" ry="320" fill="black" opacity="0.82" />
              </mask>
            </defs>

            {/* ────── SLIDE 0: Serene Mind, Branching Synapse Tree & Intricate Thought Clouds (Framed in Margins) ────── */}
            {currentSlide === 0 && (
              <g stroke={mainStroke} strokeLinecap="round" strokeLinejoin="round" filter="url(#pencilDetail)">
                {/* Outer Flank Branching Synapses & Tree Tendrils (Left) */}
                <path d="M 220 900 C 210 750, 160 620, 120 480 C 80 340, 140 220, 240 120" strokeWidth="2.2" fill="none" />
                <path d="M 120 480 C 180 430, 260 380, 310 290" strokeWidth="1.6" strokeDasharray="3 3" />
                <path d="M 160 620 C 100 560, 60 420, 90 320" strokeWidth="1.4" />
                <path d="M 240 120 C 290 80, 380 60, 480 80" strokeWidth="1.8" />
                
                {/* Outer Flank Branching Synapses & Tree Tendrils (Right) */}
                <path d="M 1380 900 C 1390 750, 1440 620, 1480 480 C 1520 340, 1460 220, 1360 120" strokeWidth="2.2" fill="none" />
                <path d="M 1480 480 C 1420 430, 1340 380, 1290 290" strokeWidth="1.6" strokeDasharray="3 3" />
                <path d="M 1440 620 C 1500 560, 1540 420, 1510 320" strokeWidth="1.4" />
                <path d="M 1360 120 C 1310 80, 1220 60, 1120 80" strokeWidth="1.8" />

                {/* Top Header Canopy Thought Clouds (Left & Right Top Margins) */}
                <g stroke={softStroke} strokeWidth="1.8">
                  {/* Left Top Detailed Cloud Cluster */}
                  <path d="M 120 180 C 80 180, 50 140, 80 100 C 110 60, 180 50, 220 90 C 260 50, 340 80, 350 130 C 390 150, 380 220, 320 240 C 270 260, 170 250, 120 180 Z" fill={cloudFill} />
                  <path d="M 160 120 C 180 100, 220 100, 240 120" strokeWidth="1.2" strokeDasharray="2 2" />
                  <path d="M 200 160 C 220 150, 260 150, 280 170" strokeWidth="1.2" />

                  {/* Right Top Detailed Cloud Cluster */}
                  <path d="M 1480 180 C 1520 180, 1550 140, 1520 100 C 1490 60, 1420 50, 1380 90 C 1340 50, 1260 80, 1250 130 C 1210 150, 1220 220, 1280 240 C 1330 260, 1430 250, 1480 180 Z" fill={cloudFill} />
                  <path d="M 1440 120 C 1420 100, 1380 100, 1360 120" strokeWidth="1.2" strokeDasharray="2 2" />
                  <path d="M 1400 160 C 1380 150, 1340 150, 1320 170" strokeWidth="1.2" />
                </g>

                {/* Hand-Drawn Stippling & Sparkle Particles on Margins */}
                <g stroke={detailStroke} strokeWidth="1.4">
                  <circle cx="180" cy="320" r="3" fill={softStroke} />
                  <circle cx="220" cy="380" r="2" fill={softStroke} />
                  <circle cx="140" cy="440" r="4" fill={softStroke} opacity="0.6" />
                  <circle cx="1420" cy="320" r="3" fill={softStroke} />
                  <circle cx="1380" cy="380" r="2" fill={softStroke} />
                  <circle cx="1460" cy="440" r="4" fill={softStroke} opacity="0.6" />

                  {/* Starburst Constellations */}
                  <path d="M 280 480 L 285 495 L 300 500 L 285 505 L 280 520 L 275 505 L 260 500 L 275 495 Z" />
                  <path d="M 1320 480 L 1325 495 L 1340 500 L 1325 505 L 1320 520 L 1315 505 L 1300 500 L 1315 495 Z" />
                </g>
              </g>
            )}

            {/* ────── SLIDE 1: Mental Overload Unburdened into Wave Ripples (Flank Framed) ────── */}
            {currentSlide === 1 && (
              <g stroke={mainStroke} strokeLinecap="round" filter="url(#pencilDetail)">
                {/* Heavy Cloud Formations (Top Flanks) */}
                <path d="M 80 220 C 40 170, 120 110, 200 140 C 260 90, 360 140, 340 220 C 400 260, 350 350, 260 340 C 180 360, 100 300, 80 220 Z" strokeWidth="2" fill={cloudFill} />
                <path d="M 1520 220 C 1560 170, 1480 110, 1400 140 C 1340 90, 1240 140, 1260 220 C 1200 260, 1250 350, 1340 340 C 1420 360, 1500 300, 1520 220 Z" strokeWidth="2" fill={cloudFill} />

                {/* Bottom Water Wave Ripples Framing Bottom Margin */}
                <path d="M 50 820 Q 800 720 1550 820" strokeWidth="2.4" />
                <path d="M 100 870 Q 800 770 1500 870" strokeWidth="1.8" strokeDasharray="5 5" />
                <path d="M 150 920 Q 800 820 1450 920" strokeWidth="1.4" opacity="0.6" />

                {/* Left Flank Floating Feather */}
                <g stroke={softStroke} strokeWidth="1.8">
                  <path d="M 220 540 Q 280 620 160 700 M 220 540 Q 140 600 160 700" fill={cloudFill} />
                  <line x1="220" y1="540" x2="160" y2="700" strokeWidth="2" />
                  <line x1="200" y1="580" x2="230" y2="600" />
                  <line x1="190" y1="620" x2="220" y2="640" />
                </g>

                {/* Right Flank Floating Feather */}
                <g stroke={softStroke} strokeWidth="1.8">
                  <path d="M 1380 540 Q 1320 620 1440 700 M 1380 540 Q 1460 600 1440 700" fill={cloudFill} />
                  <line x1="1380" y1="540" x2="1440" y2="700" strokeWidth="2" />
                  <line x1="1400" y1="580" x2="1370" y2="600" />
                  <line x1="1410" y1="620" x2="1380" y2="640" />
                </g>
              </g>
            )}

            {/* ────── SLIDE 2: Lightning Fast 2-Second Capture (Left/Right Flanks) ────── */}
            {currentSlide === 2 && (
              <g stroke={mainStroke} strokeLinecap="round" filter="url(#pencilDetail)">
                {/* Left Flank Hand & Lightning Spark Sketch */}
                <g transform="translate(60, 220)">
                  <path d="M 140 320 C 110 260, 130 200, 180 170 C 230 140, 290 180, 270 240 L 240 340" strokeWidth="2.4" fill="none" />
                  <path d="M 200 150 L 220 100 L 195 100 L 230 30" strokeWidth="2.6" strokeLinejoin="miter" />
                  <circle cx="230" cy="30" r="6" fill={softStroke} />
                  <path d="M 210 20 L 250 40 M 230 10 L 230 50" strokeWidth="1.4" />
                </g>

                {/* Right Flank Note Card & Instant Execution Checkmark */}
                <g transform="translate(1180, 220)">
                  <rect x="0" y="0" width="300" height="420" rx="32" strokeWidth="2.4" fill={cloudFill} />
                  <line x1="40" y1="80" x2="260" y2="80" strokeWidth="2.2" />
                  <line x1="40" y1="140" x2="220" y2="140" strokeWidth="1.8" strokeDasharray="6 6" />
                  <line x1="40" y1="200" x2="240" y2="200" strokeWidth="1.8" strokeDasharray="6 6" />
                  <path d="M 60 310 L 120 370 L 260 220" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" stroke={softStroke} />
                </g>
              </g>
            )}

            {/* ────── SLIDE 3: Hardware Native Blueprint Engine (Outer Left & Right Flanks) ────── */}
            {currentSlide === 3 && (
              <g stroke={mainStroke} strokeLinecap="round" filter="url(#pencilDetail)">
                {/* Left Flank Android Device Blueprint Lines */}
                <g transform="translate(80, 200)">
                  <rect x="0" y="0" width="280" height="520" rx="44" strokeWidth="2.6" fill={cloudFill} />
                  <circle cx="140" cy="50" r="14" strokeWidth="2" />
                  <line x1="40" y1="100" x2="240" y2="100" strokeWidth="1.8" strokeDasharray="4 4" />
                  <line x1="40" y1="460" x2="240" y2="460" strokeWidth="1.8" />
                  {/* Circuit Tendrils */}
                  <path d="M 280 260 L 360 260 L 400 320" strokeWidth="2" strokeDasharray="4 4" />
                  <circle cx="400" cy="320" r="6" fill={softStroke} />
                </g>

                {/* Right Flank SQLite Database Blueprint */}
                <g transform="translate(1220, 220)">
                  <ellipse cx="140" cy="40" rx="130" ry="40" strokeWidth="2.6" fill={cloudFill} />
                  <line x1="10" y1="40" x2="10" y2="360" strokeWidth="2.6" />
                  <line x1="270" y1="40" x2="270" y2="360" strokeWidth="2.6" />
                  <ellipse cx="140" cy="200" rx="130" ry="40" strokeWidth="2" strokeDasharray="6 6" />
                  <ellipse cx="140" cy="360" rx="130" ry="40" strokeWidth="2.6" fill={cloudFill} />
                  {/* Cross-Hatching Texture */}
                  <line x1="40" y1="100" x2="80" y2="140" strokeWidth="1.2" stroke={detailStroke} />
                  <line x1="60" y1="100" x2="100" y2="140" strokeWidth="1.2" stroke={detailStroke} />
                </g>
              </g>
            )}

            {/* ────── SLIDE 4: 100% Local Privacy Vault (Framed Strictly in Left & Right Margins) ────── */}
            {currentSlide === 4 && (
              <g stroke={mainStroke} strokeLinecap="round" filter="url(#pencilDetail)">
                {/* LEFT MARGIN ONLY: On-Device Vault Outline */}
                <g transform="translate(80, 220)">
                  <rect x="0" y="0" width="280" height="500" rx="44" strokeWidth="2.6" fill={cloudFill} />
                  <rect x="90" y="240" width="100" height="90" rx="18" strokeWidth="2.4" />
                  <path d="M 110 240 V 190 C 110 160, 170 160, 170 190 V 240" strokeWidth="2.4" fill="none" />
                  <circle cx="140" cy="285" r="8" fill={softStroke} />
                </g>

                {/* RIGHT MARGIN ONLY: Crossed-Out Cloud Symbol */}
                <g transform="translate(1220, 240)">
                  <path d="M 80 180 C 50 120, 120 60, 200 80 C 260 30, 360 80, 340 160 C 400 180, 380 260, 300 260 H 80 C -10 260, 0 180, 80 180 Z" strokeWidth="2.6" strokeDasharray="6 6" fill={cloudFill} />
                  {/* Heavy Cross Line */}
                  <line x1="-30" y1="290" x2="410" y2="40" strokeWidth="4.5" stroke={softStroke} />
                </g>
              </g>
            )}

            {/* ────── SLIDE 5: Gateway Portal & Constellations (Flank Framed) ────── */}
            {currentSlide === 5 && (
              <g stroke={mainStroke} strokeLinecap="round" filter="url(#pencilDetail)">
                {/* Left Flank Notification Bell */}
                <g transform="translate(100, 240)">
                  <path d="M 40 180 C 40 100, 160 100, 160 180 V 300 L 200 340 H 0 L 40 300 Z" strokeWidth="2.6" fill={cloudFill} />
                  <circle cx="100" cy="380" r="22" strokeWidth="2.4" />
                </g>

                {/* Right Flank Chapter 01 Gateway Doorway Archway */}
                <g transform="translate(1240, 200)">
                  <rect x="0" y="0" width="280" height="520" rx="44" strokeWidth="2.6" fill={cloudFill} />
                  <path d="M 40 120 Q 140 40 240 120 V 480 H 40 Z" strokeWidth="2" strokeDasharray="6 6" />
                  <circle cx="90" cy="300" r="10" strokeWidth="2.2" fill={softStroke} />
                </g>
              </g>
            )}
          </svg>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
