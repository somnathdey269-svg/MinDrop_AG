import { useCallback, useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Bell, BellOff, Send } from "lucide-react";
import { onForegroundMessage } from "@/lib/firebase";
import { enablePush, isNative } from "@/lib/push";
import {
  getVapidPublicKey,
  savePushToken,
  sendTestPush,
} from "@/lib/push.functions";

type Status = "idle" | "enabling" | "enabled" | "denied" | "unsupported" | "sending";

export function EnablePushButton() {
  const [status, setStatus] = useState<Status>("idle");
  const fetchVapid = useServerFn(getVapidPublicKey);
  const save = useServerFn(savePushToken);
  const sendTest = useServerFn(sendTestPush);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (isNative()) {
      // Native: assume supported; permission checked on enable.
      return;
    }
    if (!("Notification" in window) || !("serviceWorker" in navigator)) {
      setStatus("unsupported");
      return;
    }
    if (Notification.permission === "denied") setStatus("denied");
    if (Notification.permission === "granted") setStatus("enabled");

    let unsub: (() => void) | undefined;
    onForegroundMessage((payload) => {
      const p = payload as { notification?: { title?: string; body?: string } };
      toast(p.notification?.title || "Notification", {
        description: p.notification?.body,
      });
    }).then((fn) => {
      unsub = fn as () => void;
    });
    return () => unsub?.();
  }, []);

  const enable = useCallback(async () => {
    try {
      setStatus("enabling");
      const { vapidKey } = await fetchVapid();
      const res = await enablePush(vapidKey);
      if (!res.ok || !res.token) {
        setStatus(res.error?.toLowerCase().includes("denied") ? "denied" : "idle");
        toast.error(res.error || "Notifications not enabled");
        return;
      }
      await save({
        data: {
          token: res.token,
          userAgent: typeof navigator !== "undefined" ? navigator.userAgent : undefined,
          platform: res.platform,
        },
      });
      setStatus("enabled");
      toast.success(`Notifications enabled (${res.platform})`);
    } catch (err) {
      setStatus("idle");
      toast.error(err instanceof Error ? err.message : "Failed to enable notifications");
    }
  }, [fetchVapid, save]);

  const test = useCallback(async () => {
    try {
      setStatus("sending");
      const res = await sendTest({ data: {} });
      setStatus("enabled");
      if (res.sent > 0) toast.success(`Sent to ${res.sent}/${res.tokens} device(s)`);
      else toast.error("No notification delivered");
    } catch (err) {
      setStatus("enabled");
      toast.error(err instanceof Error ? err.message : "Failed to send test");
    }
  }, [sendTest]);

  if (status === "unsupported") {
    return (
      <div className="t-body-sm text-ink/60 flex items-center gap-2">
        <BellOff className="h-4 w-4" aria-hidden="true" />
        Notifications aren't supported on this browser.
      </div>
    );
  }
  if (status === "denied") {
    return (
      <div className="t-body-sm text-ink/60 flex items-center gap-2">
        <BellOff className="h-4 w-4" aria-hidden="true" />
        Notifications blocked — enable them in your browser settings.
      </div>
    );
  }
  if (status === "enabled" || status === "sending") {
    return (
      <Button onClick={test} disabled={status === "sending"} variant="secondary">
        <Send className="mr-2 h-4 w-4" aria-hidden="true" />
        {status === "sending" ? "Sending…" : "Send test notification"}
      </Button>
    );
  }
  return (
    <Button onClick={enable} disabled={status === "enabling"}>
      <Bell className="mr-2 h-4 w-4" aria-hidden="true" />
      {status === "enabling" ? "Enabling…" : "Enable notifications"}
    </Button>
  );
}
