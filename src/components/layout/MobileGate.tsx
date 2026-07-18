import { Link } from "@tanstack/react-router";
import { Smartphone, Download, Globe } from "lucide-react";
import { motion } from "framer-motion";

export function MobileGate() {
  return (
    <div className="min-h-screen w-full bg-[#f9f7f2] flex flex-col items-center justify-center p-6 text-center select-none font-sans">
      <div className="max-w-md w-full flex flex-col items-center">
        {/* Animated App Icon Wrapper */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 80, delay: 0.1 }}
          className="size-20 rounded-[1.8rem] bg-gradient-to-tr from-[#FF671F] to-[#FFA06E] shadow-xl shadow-[#FF671F]/20 grid place-items-center mb-8 border border-white/20"
        >
          <span className="text-white font-black text-3xl select-none font-sans">m</span>
        </motion.div>

        {/* Device Outline Frame */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="w-full bg-white border border-ink/8 rounded-[2.5rem] p-8 shadow-xl shadow-ink/3 mb-8 relative overflow-hidden"
        >
          {/* Subtle phone-top speaker mockup */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-16 h-1 rounded-full bg-ink/10" />

          <Smartphone className="size-10 text-[#FF671F]/80 mx-auto mb-4" />

          <h1 className="t-display text-2xl text-ink leading-tight mb-3">
            MinDrop is built for your pocket.
          </h1>

          <p className="t-body-sm text-ink/65 leading-relaxed max-w-xs mx-auto mb-6">
            MinDrop is designed to run natively on mobile devices to trigger precise, system-level alarms and real-time location-based alerts.
          </p>

          <div className="flex flex-col gap-3">
            <Link
              to="/download"
              className="t-button inline-flex items-center justify-center gap-2 text-white bg-[#FF671F] hover:opacity-95 shadow-md shadow-[#FF671F]/15 py-3.5 rounded-2xl transition"
            >
              <Download className="size-4.5" />
              <span>Get the Mobile App</span>
            </Link>

            <Link
              to="/"
              className="t-button inline-flex items-center justify-center gap-2 text-ink/70 hover:text-ink bg-ink/[0.03] hover:bg-ink/[0.06] border border-ink/5 py-3.5 rounded-2xl transition"
            >
              <Globe className="size-4.5" />
              <span>Explore Website</span>
            </Link>
          </div>
        </motion.div>

        {/* Developer Bypass Tip */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 0.5 }}
          className="t-meta text-[10px] uppercase tracking-wider text-ink"
        >
          Developer? Append <code className="bg-ink/5 px-1 py-0.5 rounded font-mono text-[9px] lowercase">?native=1</code> to test on desktop.
        </motion.p>
      </div>
    </div>
  );
}
