import React from "react";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { DynamicText } from "./DynamicText";
import type { CardGridBlock, CardItem } from "@/lib/cms/cms.types";
import { ArrowRight, Sparkles, Check, ShieldCheck, Zap } from "lucide-react";

interface AdaptiveGridProps {
  block: CardGridBlock;
  className?: string;
}

export const AdaptiveGrid: React.FC<AdaptiveGridProps> = ({ block, className = "" }) => {
  const { layoutConfig, cards, sectionTitle, sectionTitleTag, sectionTitleStyle } = block;

  // Determine dynamic grid columns rule
  let gridStyle: React.CSSProperties = {
    display: "grid",
    gap: layoutConfig.gap || "24px",
  };

  if (layoutConfig.columns === "auto-fit") {
    gridStyle.gridTemplateColumns = `repeat(auto-fit, minmax(${layoutConfig.minCardWidth || "280px"}, 1fr))`;
  } else {
    const cols = parseInt(layoutConfig.columns || "3", 10);
    gridStyle.gridTemplateColumns = `repeat(${cols}, minmax(0, 1fr))`;
  }

  return (
    <section className={`w-full py-8 md:py-12 ${className}`}>
      {sectionTitle && (
        <div className="text-center mb-8 sm:mb-12">
          <DynamicText
            tag={sectionTitleTag || "h2"}
            text={sectionTitle}
            style={sectionTitleStyle}
            className="text-3xl sm:text-4xl md:text-5xl font-black text-ink tracking-tight"
          />
        </div>
      )}

      <div style={gridStyle} className="w-full">
        {cards.map((card, idx) => (
          <motion.div
            key={card.id || idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45, delay: idx * 0.06 }}
            className="group flex flex-col h-full rounded-[2rem] border-3 border-ink bg-white p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-y-[-2px]"
            style={{
              backgroundColor: card.backgroundColor || undefined,
              borderColor: card.borderColor || undefined,
            }}
          >
            {card.badgeText && (
              <span
                className="self-start inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-4 border border-ink/15 shadow-sm"
                style={{
                  backgroundColor: card.badgeColor || "#E0F2FE",
                  color: "#0284C7",
                }}
              >
                {card.badgeText}
              </span>
            )}

            <DynamicText
              tag={card.titleTag || "h3"}
              text={card.title}
              style={card.titleStyle}
              className="text-xl sm:text-2xl font-black text-ink mb-3"
            />

            <DynamicText
              tag="p"
              text={card.description}
              style={card.descriptionStyle}
              className="text-sm sm:text-base font-semibold text-ink/75 leading-relaxed flex-1"
            />

            {card.buttonText && card.buttonLink && (
              <div className="mt-6 pt-4 border-t border-ink/10 flex items-center justify-between">
                <Link
                  to={card.buttonLink as any}
                  className="inline-flex items-center gap-2 font-black text-sm uppercase tracking-wider text-brand hover:underline"
                >
                  {card.buttonText} <ArrowRight className="size-4 group-hover:translate-x-1 transition" />
                </Link>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
};
