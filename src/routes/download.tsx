import { createFileRoute, Link } from "@tanstack/react-router";
import { Download, Check, X } from "lucide-react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/download")({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      from: (search.from as string) || undefined,
    };
  },
  head: () => ({
    meta: [
      { title: "Download MinDrop — Android APK" },
      { name: "description", content: "Download the MinDrop mobile application. Install the Android APK directly or get it on the Play Store." },
    ],
  }),
  component: DownloadDetailView,
});

const PLAY_STORE_URL: string | null = null;
const APK_URL: string | null = "https://github.com/somnathdey269-svg/MinDrop_AG/releases";

function DownloadDetailView() {
  const { from } = Route.useSearch();

  return (
    <div className="fixed inset-0 bg-[#EFF6FF] flex flex-col justify-between p-6 overflow-hidden h-[100dvh] w-screen select-none">
      
      {/* Top Header Sync */}
      <header className="flex justify-between items-center w-full z-10 shrink-0">
        <span className="text-xs uppercase tracking-wider font-black text-ink/40">Spec Sheet</span>
        <div className="flex items-center gap-2">
          <span className="inline-grid place-items-center size-8 rounded-lg bg-[#FF671F] text-white font-black border-2 border-ink shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-sm">M</span>
          <span className="text-xs font-black uppercase tracking-wider hidden sm:inline text-ink/80">MinDrop Specs</span>
        </div>
        <Link
          to="/"
          hash={from === "grid" ? "grid" : undefined}
          className="text-xs uppercase tracking-wider font-black text-ink hover:text-[#FF671F] border-b-2 border-ink pb-0.5"
        >
          View Deck
        </Link>
      </header>

      {/* Main Centered Showcase Card */}
      <main className="flex-1 flex items-center justify-center relative w-full my-4">
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          className="w-full max-w-5xl bg-white border-3 border-ink rounded-[2.5rem] p-8 md:p-12 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative grid md:grid-cols-12 gap-8 items-center max-h-[80vh] overflow-y-auto"
        >
          {/* Close Button X linking back to homepage */}
          <Link
            to="/"
            hash={from === "grid" ? "grid" : undefined}
            className="absolute top-6 right-6 size-10 rounded-full border-2 border-ink bg-white grid place-items-center hover:bg-ink/5 transition z-20 cursor-pointer active:scale-95"
            aria-label="Close"
          >
            <X className="size-5 text-ink" />
          </Link>

          {/* Left Side Content Column */}
          <div className="md:col-span-7 text-left w-full">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-ink/15 bg-[#EFF6FF] px-3.5 py-1 text-[10px] font-black uppercase tracking-wider text-[#3B82F6] mb-6">
              📲 Download Center
            </span>

            <h1 className="text-4xl sm:text-5xl font-black text-ink leading-tight tracking-tight">
              Get the MinDrop Android app.
            </h1>

            <div className="mt-6">
              <p className="text-[#EA3323] text-xs font-black uppercase tracking-widest">TL;DR</p>
              <p className="text-sm font-semibold text-ink/75 mt-1 leading-relaxed">
                MinDrop is designed to run natively on Android devices. Download the compiled package (.apk) file directly below to install it on your device in seconds.
              </p>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <a
                href={APK_URL ?? undefined}
                className="flex-1 text-center py-4 rounded-2xl bg-ink text-canvas border-2 border-ink hover:bg-[#FF671F] hover:text-white transition font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px]"
              >
                Download APK Package
              </a>
              <button
                disabled
                className="flex-1 text-center py-4 rounded-2xl border-3 border-ink bg-[#f1ede4]/40 text-ink/30 font-black text-xs uppercase tracking-wider cursor-not-allowed select-none"
              >
                Play Store — Soon
              </button>
            </div>
            
            <p className="text-[10px] text-ink/50 font-bold mt-4">
              *Requires Android 8.0 or above. Install instructions: Download the file, open it, allow install from unknown sources, and launch.
            </p>
          </div>

          {/* Right Side Graphics Column */}
          <div className="md:col-span-5 flex justify-center items-center">
            <motion.div
              animate={{ rotate: [0, 360], scale: [1, 1.05, 1] }}
              transition={{
                rotate: { duration: 45, repeat: Infinity, ease: "linear" },
                scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
              }}
              className="size-48 md:size-60 bg-[#EFF6FF] border-3 border-ink rounded-[2rem] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] grid place-items-center relative"
            >
              <Download className="size-20 md:size-24 text-ink stroke-[2.5px]" />
            </motion.div>
          </div>
        </motion.div>
      </main>

      {/* Bottom Footer Sync */}
      <footer className="flex justify-between items-center w-full z-10 shrink-0">
        <span className="text-xs font-black uppercase tracking-wider text-ink/40">India · Direct Installer</span>
        <Link
          to="/privacy"
          className="text-xs uppercase tracking-wider font-black text-ink hover:text-[#FF671F] border-b-2 border-ink pb-0.5"
        >
          Privacy Promise
        </Link>
      </footer>
    </div>
  );
}
