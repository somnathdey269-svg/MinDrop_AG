import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ArtisticSketchBackgroundProps {
  currentSlide: number;
  isDark: boolean;
}

export function ArtisticSketchBackground({ currentSlide, isDark }: ArtisticSketchBackgroundProps) {
  // Auto-adjusting stroke colors for Light vs Dark theme slides
  const mainStroke = isDark ? "#38BDF8" : "#0284C7";
  const softStroke = isDark ? "#7DD3FC" : "#0369A1";
  const cloudFill = isDark ? "rgba(56, 189, 248, 0.08)" : "rgba(2, 132, 199, 0.05)";

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none w-full h-full">
      {/* Dynamic Background Fine-Art Pencil Sketch Canvas */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`artistic-sketch-slide-${currentSlide}`}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: isDark ? 0.32 : 0.22, scale: 1 }}
          exit={{ opacity: 0, scale: 1.03 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 w-full h-full flex items-center justify-center"
        >
          <svg
            viewBox="0 0 1400 900"
            preserveAspectRatio="xMidYMid meet"
            className="w-full h-full absolute inset-0 transition-all duration-700"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Soft Pencil Texture Filter */}
              <filter id="pencilTexture" x="-10%" y="-10%" width="120%" height="120%">
                <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
                <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G" />
              </filter>
            </defs>

            {/* ────── SLIDE 0: Serene Mind & Branching Tree Roots with Thought Clouds (Reference Match) ────── */}
            {currentSlide === 0 && (
              <g stroke={mainStroke} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" filter="url(#pencilTexture)">
                {/* Central Serene Face Line-Art Sketch */}
                <path
                  d="M 700 320 C 660 320, 630 350, 620 400 C 610 450, 620 510, 640 560 C 655 595, 680 620, 700 640 C 720 620, 745 595, 760 560 C 780 510, 790 450, 780 400 C 770 350, 740 320, 700 320 Z"
                  strokeWidth="2"
                  fill="none"
                />
                {/* Closed Eyes & Nose Line Art */}
                <path d="M 655 450 Q 675 460 690 450 M 710 450 Q 725 460 745 450" strokeWidth="1.8" fill="none" />
                <path d="M 700 450 V 500 Q 695 510 705 512" strokeWidth="1.8" fill="none" />
                <path d="M 675 540 Q 700 552 725 540" strokeWidth="1.8" fill="none" />

                {/* Branching Mind-Tree Roots & Synapses Growing Upward */}
                <path d="M 700 320 C 690 260, 640 210, 580 180 C 510 140, 420 160, 320 120" strokeWidth="2.2" />
                <path d="M 580 180 C 520 130, 440 90, 350 70" strokeWidth="1.6" strokeDasharray="4 4" />
                <path d="M 640 220 C 560 170, 490 120, 410 90" strokeWidth="1.6" />

                <path d="M 700 320 C 710 260, 760 210, 820 180 C 890 140, 980 160, 1080 120" strokeWidth="2.2" />
                <path d="M 820 180 C 880 130, 960 90, 1050 70" strokeWidth="1.6" strokeDasharray="4 4" />
                <path d="M 760 220 C 840 170, 910 120, 990 90" strokeWidth="1.6" />

                {/* Thought Clouds Floating in Top Left & Right (Matching Reference) */}
                {/* Top-Left Cloud */}
                <path
                  d="M 160 180 C 130 180, 110 150, 130 120 C 150 90, 200 80, 230 110 C 260 80, 320 100, 330 140 C 360 160, 350 210, 310 230 C 280 250, 200 240, 160 180 Z"
                  fill={cloudFill}
                  strokeWidth="1.8"
                />
                {/* Top-Right Cloud */}
                <path
                  d="M 1240 180 C 1270 180, 1290 150, 1270 120 C 1250 90, 1200 80, 1170 110 C 1140 80, 1080 100, 1070 140 C 1040 160, 1050 210, 1090 230 C 1120 250, 1200 240, 1240 180 Z"
                  fill={cloudFill}
                  strokeWidth="1.8"
                />
                {/* Floating Micro-Clouds */}
                <path d="M 280 320 C 260 320, 250 300, 260 280 C 280 260, 310 270, 330 290 Z" fill={cloudFill} strokeWidth="1.5" />
                <path d="M 1120 320 C 1140 320, 1150 300, 1140 280 C 1120 260, 1090 270, 1070 290 Z" fill={cloudFill} strokeWidth="1.5" />

                {/* Hand-Drawn Sparkle Stars (Matching Reference) */}
                <path d="M 200 380 L 205 395 L 220 400 L 205 405 L 200 420 L 195 405 L 180 400 L 195 395 Z" strokeWidth="1.4" opacity="0.8" />
                <path d="M 1200 380 L 1205 395 L 1220 400 L 1205 405 L 1200 420 L 1195 405 L 1180 400 L 1195 395 Z" strokeWidth="1.4" opacity="0.8" />
                <path d="M 380 620 L 384 632 L 396 636 L 384 640 L 380 652 L 376 640 L 364 636 L 376 632 Z" strokeWidth="1.4" opacity="0.8" />
                <path d="M 1020 620 L 1024 632 L 1036 636 L 1024 640 L 1020 652 L 1016 640 L 1004 636 L 1016 632 Z" strokeWidth="1.4" opacity="0.8" />
              </g>
            )}

            {/* ────── SLIDE 1: Unburdening Mental Fatigue into Soft Ripple Waves ────── */}
            {currentSlide === 1 && (
              <g stroke={mainStroke} strokeWidth="1.8" strokeLinecap="round" filter="url(#pencilTexture)">
                {/* Releasing Thought Clouds */}
                <path d="M 220 250 C 200 210, 260 170, 320 190 C 360 160, 420 200, 410 250 C 450 280, 420 340, 360 340 Z" fill={cloudFill} strokeWidth="1.8" />
                <path d="M 1180 250 C 1200 210, 1140 170, 1080 190 C 1040 160, 980 200, 990 250 C 950 280, 980 340, 1040 340 Z" fill={cloudFill} strokeWidth="1.8" />

                {/* Calming Horizontal Concentric Ripple Waves */}
                <path d="M 100 600 Q 700 520 1300 600" strokeWidth="2" />
                <path d="M 150 650 Q 700 570 1250 650" strokeWidth="1.8" strokeDasharray="6 6" />
                <path d="M 200 700 Q 700 620 1200 700" strokeWidth="1.5" opacity="0.6" />

                {/* Floating Feather Sketch */}
                <motion.g
                  animate={{ y: [-10, 10, -10] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <path d="M 700 380 Q 750 450 650 520 M 700 380 Q 640 430 650 520" strokeWidth="1.8" fill={cloudFill} />
                  <line x1="700" y1="380" x2="650" y2="520" strokeWidth="1.8" />
                </motion.g>
              </g>
            )}

            {/* ────── SLIDE 2: Lightning Fast 2-Second Capture ────── */}
            {currentSlide === 2 && (
              <g stroke={mainStroke} strokeWidth="1.8" strokeLinecap="round" filter="url(#pencilTexture)">
                {/* Hand Sketch holding a fast spark drop */}
                <path d="M 250 450 C 220 400, 240 350, 280 330 C 320 310, 360 340, 350 390 L 330 460" strokeWidth="2" fill="none" />
                <path d="M 290 320 L 305 280 L 285 280 L 310 230" strokeWidth="2.2" />

                {/* Right: Quick Note Card Line Art */}
                <rect x="1020" y="260" width="280" height="380" rx="28" strokeWidth="2" fill={cloudFill} />
                <line x1="1060" y1="340" x2="1240" y2="340" strokeWidth="2" />
                <line x1="1060" y1="400" x2="1200" y2="400" strokeWidth="1.6" strokeDasharray="4 4" />

                {/* Instant Checkmark */}
                <motion.path
                  d="M 1070 510 L 1120 560 L 1230 440"
                  strokeWidth="4"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
                />
              </g>
            )}

            {/* ────── SLIDE 3: Hardware Native Blueprint & WorkManager Gears ────── */}
            {currentSlide === 3 && (
              <g stroke={mainStroke} strokeWidth="1.8" strokeLinecap="round" filter="url(#pencilTexture)">
                {/* Android Hardware Device Blueprint Lines */}
                <rect x="120" y="200" width="240" height="480" rx="36" strokeWidth="2.2" fill={cloudFill} />
                <circle cx="240" cy="240" r="12" strokeWidth="1.8" />

                {/* SQLite Database Cylinder */}
                <ellipse cx="1180" cy="280" rx="110" ry="35" strokeWidth="2.2" fill={cloudFill} />
                <line x1="1070" y1="280" x2="1070" y2="520" strokeWidth="2.2" />
                <line x1="1290" y1="280" x2="1290" y2="520" strokeWidth="2.2" />
                <ellipse cx="1180" cy="400" rx="110" ry="35" strokeDasharray="5 5" strokeWidth="1.6" />
                <ellipse cx="1180" cy="520" rx="110" ry="35" strokeWidth="2.2" fill={cloudFill} />

                {/* WorkManager Gears */}
                <motion.g
                  animate={{ rotate: 360 }}
                  style={{ transformOrigin: "700px 440px" }}
                  transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                >
                  <circle cx="700" cy="440" r="80" strokeWidth="2" strokeDasharray="6 6" />
                  <circle cx="700" cy="440" r="30" strokeWidth="2" fill={cloudFill} />
                </motion.g>
              </g>
            )}

            {/* ────── SLIDE 4: 100% Local Privacy Vault & Crossed-Out Cloud ────── */}
            {currentSlide === 4 && (
              <g stroke={mainStroke} strokeWidth="1.8" strokeLinecap="round" filter="url(#pencilTexture)">
                {/* Local Phone Vault Sketch */}
                <rect x="140" y="220" width="260" height="460" rx="40" strokeWidth="2.2" fill={cloudFill} />
                <rect x="230" y="420" width="80" height="70" rx="14" strokeWidth="2" />
                <path d="M 245 420 V 380 C 245 355, 295 355, 295 380 V 420" strokeWidth="2" fill="none" />

                {/* Crossed-Out Cloud Symbol */}
                <path d="M 1040 390 C 1020 340, 1080 290, 1150 310 C 1200 270, 1280 320, 1270 390 C 1320 410, 1300 470, 1240 470 H 1040 C 960 470, 970 400, 1020 390 Z" strokeWidth="2" fill={cloudFill} strokeDasharray="5 5" />
                <line x1="970" y1="480" x2="1310" y2="280" strokeWidth="3.5" strokeLinecap="round" />
              </g>
            )}

            {/* ────── SLIDE 5: Chapter 01 Gateway Portal & Constellations ────── */}
            {currentSlide === 5 && (
              <g stroke={mainStroke} strokeWidth="1.8" strokeLinecap="round" filter="url(#pencilTexture)">
                {/* Notification Bell */}
                <path d="M 180 340 C 180 290, 270 290, 270 340 V 440 L 300 470 H 150 L 180 440 Z" strokeWidth="2.2" fill={cloudFill} />
                <circle cx="225" cy="495" r="16" strokeWidth="2" />

                {/* Gateway Doorway Portal */}
                <rect x="1040" y="230" width="260" height="420" rx="32" strokeWidth="2.2" fill={cloudFill} />
                <circle cx="1090" cy="440" r="10" strokeWidth="2" />

                {/* Constellation Starbursts */}
                <path d="M 680 320 L 685 335 L 700 340 L 685 345 L 680 360 L 675 345 L 660 340 L 675 335 Z" strokeWidth="1.5" opacity="0.8" />
                <path d="M 720 500 L 724 512 L 736 516 L 724 520 L 720 532 L 716 520 L 704 516 L 716 512 Z" strokeWidth="1.5" opacity="0.8" />
              </g>
            )}
          </svg>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
