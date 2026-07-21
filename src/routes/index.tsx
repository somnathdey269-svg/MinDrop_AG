import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { DesktopShowcase } from "../components/marketing/desktop/DesktopShowcase";
import { MobileShowcase } from "../components/marketing/mobile/MobileShowcase";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MinDrop — A Kind Second Brain" },
      { name: "description", content: "Discover how MinDrop can carry the small things your brain shouldn't have to. Loop alarms, smart notification filters, and geofences." },
      { property: "og:title", content: "MinDrop — A Kind Second Brain" },
      { property: "og:description", content: "Discover how MinDrop can carry the small things your brain shouldn't have to." },
      { property: "og:url", content: "https://www.mindrop.in/" },
    ],
  }),
  component: ShowcaseDeckPage,
});

function ShowcaseDeckPage() {
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth < 768;
    }
    return false;
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMobile ? <MobileShowcase /> : <DesktopShowcase />;
}
