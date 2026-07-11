import { useRouterState } from "@tanstack/react-router";
import { Archive, MapPin, SlidersHorizontal, Trash2 } from "lucide-react";
import { SegmentedTabBar, type SegmentedTab } from "@/components/layout/SegmentedTabBar";
import { useCountryTheme } from "@/lib/theme/useCountryTheme";

export type PlacesTab = "saved" | "rules" | "archived" | "erased";

interface Props {
  activeId: PlacesTab;
  onSelect: (id: PlacesTab) => void;
  savedCount?: number;
  rulesCount?: number;
  archivedCount?: number;
  erasedCount?: number;
}

export function PlacesTabs({ activeId, onSelect, savedCount, rulesCount, archivedCount, erasedCount }: Props) {
  useRouterState({ select: (s) => s.location.pathname });
  const { accent3 } = useCountryTheme();
  const tabs: SegmentedTab[] = [
    { id: "saved",    label: "Saved",    icon: MapPin,           count: savedCount,    onClick: () => onSelect("saved") },
    { id: "rules",    label: "Rules",    icon: SlidersHorizontal, count: rulesCount,   onClick: () => onSelect("rules") },
    { id: "archived", label: "Archived", icon: Archive,          count: archivedCount, onClick: () => onSelect("archived") },
    { id: "erased",   label: "Erased",   icon: Trash2,           count: erasedCount,   onClick: () => onSelect("erased") },
  ];
  return (
    <SegmentedTabBar
      tabs={tabs}
      activeId={activeId}
      accent={accent3}
      ariaLabel="Places sections"
      layoutId="places-pill"
    />
  );
}

