import { createFileRoute, Link } from "@tanstack/react-router";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { Smartphone, Download, ArrowLeft, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/download")({
  head: () => ({
    meta: [
      { title: "Download MinDrop — Android APK" },
      { name: "description", content: "Download the MinDrop mobile application. Install the Android APK directly or get it on the Play Store." },
    ],
  }),
  component: DownloadPage,
});

// Configure Play Store and APK download link placeholders.
const PLAY_STORE_URL: string | null = null;
const APK_URL: string | null = "https://github.com/somnathdey269-svg/MinDrop_AG/releases"; // Update when direct release exists

function DownloadPage() {
  return (
    <MarketingLayout>
      <section className="relative overflow-hidden bg-canvas py-16 md:py-24 border-b border-ink/5">
        <div aria-hidden="true" className="pointer-events-none absolute -top-24 -left-24 size-[520px] rounded-full bg-orange-500/5 blur-[100px]" />
        
        <div className="mx-auto max-w-4xl px-5 md:px-8 text-center">
          <Link to="/" className="inline-flex items-center gap-1.5 text-[#FF671F] hover:underline font-bold text-xs uppercase tracking-wider mb-6">
            <ArrowLeft className="size-3.5" /> Back to Home
          </Link>

          <span className="t-eyebrow inline-flex items-center gap-2 rounded-full bg-orange-50 px-3.5 py-1.5 text-[#FF671F] font-bold border border-orange-100 mb-5">
            📲 Download Center
          </span>

          <h1 className="t-display text-4xl sm:text-5xl font-black leading-tight text-ink">
            Take the Keeper <span className="text-[#FF671F]">home.</span>
          </h1>

          <p className="t-body mt-4 text-ink/75 max-w-md mx-auto leading-relaxed">
            MinDrop is designed natively for mobile platforms. Download the Android app below to start offloading your mental burden.
          </p>
        </div>
      </section>

      {/* Download Options */}
      <section className="py-20 bg-[#f9f7f2]">
        <div className="mx-auto max-w-4xl px-5 md:px-8 grid gap-8 md:grid-cols-2 items-stretch">
          
          {/* Play Store */}
          <div className="bg-white border border-ink/8 p-8 rounded-[2.5rem] shadow-sm flex flex-col justify-between text-center items-center">
            <div className="flex flex-col items-center">
              <span className="text-4xl mb-4">🤖</span>
              <h2 className="t-display text-2xl font-black text-ink">Google Play Store</h2>
              <p className="t-body-sm text-ink/70 mt-3 leading-relaxed max-w-xs">
                Install directly from the Play Store. Automatic updates, certified secure by Google Play Protect.
              </p>
            </div>

            <a
              href={PLAY_STORE_URL ?? undefined}
              onClick={(e) => { if (!PLAY_STORE_URL) e.preventDefault(); }}
              className={`t-button mt-8 w-full inline-flex items-center justify-center gap-2 rounded-2xl py-3.5 font-bold transition ${
                PLAY_STORE_URL 
                  ? "bg-ink text-canvas hover:opacity-95" 
                  : "bg-ink/5 text-ink/30 cursor-not-allowed border border-ink/10"
              }`}
            >
              <Smartphone className="size-4.5" />
              <span>{PLAY_STORE_URL ? "Get it on Google Play" : "Play Store — Coming Soon"}</span>
            </a>
          </div>

          {/* APK Link */}
          <div className="bg-white border-2 border-dashed border-[#FF671F]/40 p-8 rounded-[2.5rem] shadow-sm flex flex-col justify-between text-center items-center">
            <div className="flex flex-col items-center">
              <span className="text-4xl mb-4">📦</span>
              <h2 className="t-display text-2xl font-black text-ink">Direct APK Download</h2>
              <p className="t-body-sm text-ink/70 mt-3 leading-relaxed max-w-xs">
                For developers and power users. Download and install the raw Android package (.apk) file directly.
              </p>
            </div>

            <a
              href={APK_URL ?? undefined}
              onClick={(e) => { if (!APK_URL) e.preventDefault(); }}
              className={`t-button mt-8 w-full inline-flex items-center justify-center gap-2 rounded-2xl py-3.5 font-bold transition ${
                APK_URL 
                  ? "bg-[#FF671F] text-white hover:opacity-95 shadow-md shadow-[#FF671F]/15" 
                  : "bg-ink/5 text-ink/30 cursor-not-allowed border border-ink/10"
              }`}
            >
              <Download className="size-4.5" />
              <span>{APK_URL ? "Download APK Package" : "APK — Soon"}</span>
            </a>
          </div>

        </div>
      </section>

      {/* Instructions */}
      <section className="py-20 bg-canvas border-b border-ink/5">
        <div className="mx-auto max-w-3xl px-5 md:px-8">
          <h2 className="t-display text-center text-2xl font-extrabold text-ink mb-10">How to install the APK</h2>
          
          <div className="space-y-6">
            <div className="flex gap-4">
              <span className="shrink-0 size-8 rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center text-xs font-bold text-[#FF671F]">1</span>
              <div>
                <h4 className="t-title font-bold text-ink text-base">Download the file</h4>
                <p className="t-body-sm text-ink/75 mt-1">Click the "Download APK Package" button above to save the package file on your phone.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <span className="shrink-0 size-8 rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center text-xs font-bold text-[#FF671F]">2</span>
              <div>
                <h4 className="t-title font-bold text-ink text-base">Enable Unknown Sources</h4>
                <p className="t-body-sm text-ink/75 mt-1">If prompted, allow your browser or files app to install applications from unknown sources in your Android settings.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <span className="shrink-0 size-8 rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center text-xs font-bold text-[#FF671F]">3</span>
              <div>
                <h4 className="t-title font-bold text-ink text-base">Run the installer</h4>
                <p className="t-body-sm text-ink/75 mt-1">Open the downloaded file and click "Install" to complete. You're ready to drop your first thought!</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
