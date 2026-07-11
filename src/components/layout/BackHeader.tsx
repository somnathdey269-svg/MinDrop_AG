import { useEffect, useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

export function BackHeader({ label = "Settings", to = "/settings", from = "settings" }: { label?: string; to?: string; from?: string }) {
  const router = useRouter();
  const [show, setShow] = useState(false);
  useEffect(() => {
    let flag: string | null = null;
    try { flag = sessionStorage.getItem("gmd:from"); } catch {}
    const params = new URLSearchParams(window.location.search);
    setShow(flag === from || params.get("from") === from);
  }, [from]);

  if (!show) return null;
  return (
    <button
      onClick={() => {
        try { sessionStorage.removeItem("gmd:from"); } catch {}
        if (window.history.length > 1) router.history.back();
        else router.navigate({ to: to as any });
      }}
      className="t-eyebrow inline-flex items-center gap-1.5 text-ink/75 hover:text-ink transition-colors mb-4"
    >
      <ArrowLeft className="size-3.5" />
      Back to {label}
    </button>
  );
}
