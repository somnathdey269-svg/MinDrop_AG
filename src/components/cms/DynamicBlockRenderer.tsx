import React from "react";
import { Link } from "@tanstack/react-router";
import { DynamicText } from "./DynamicText";
import { AdaptiveGrid } from "./AdaptiveGrid";
import type { CMSBlock } from "@/lib/cms/cms.types";
import { ArrowRight, Sparkles, HelpCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface DynamicBlockRendererProps {
  blocks: CMSBlock[];
  className?: string;
}

export const DynamicBlockRenderer: React.FC<DynamicBlockRendererProps> = ({
  blocks,
  className = "",
}) => {
  if (!blocks || blocks.length === 0) return null;

  return (
    <div className={`w-full flex flex-col gap-10 sm:gap-16 ${className}`}>
      {blocks.map((block) => {
        switch (block.type) {
          case "heading":
            return (
              <section key={block.id} className="w-full text-center py-6">
                {block.eyebrowText && (
                  <div className="mb-4">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-ink/15 bg-white px-4 py-1.5 text-xs font-black uppercase tracking-widest text-brand shadow-sm">
                      {block.eyebrowText}
                    </span>
                  </div>
                )}
                <DynamicText
                  tag={block.tag || "h2"}
                  text={block.text}
                  style={block.style}
                  className="text-3xl sm:text-5xl md:text-6xl font-black text-ink tracking-tight max-w-4xl mx-auto leading-tight"
                />
              </section>
            );

          case "card_grid":
            return <AdaptiveGrid key={block.id} block={block} />;

          case "cta_band":
            return (
              <section
                key={block.id}
                className="w-full rounded-[2.5rem] border-3 border-ink bg-brand text-white p-8 sm:p-12 md:p-16 text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] my-6"
                style={{ backgroundColor: block.backgroundColor || undefined }}
              >
                <div className="max-w-3xl mx-auto flex flex-col items-center gap-6">
                  <DynamicText
                    tag={block.titleTag || "h2"}
                    text={block.title}
                    style={block.titleStyle}
                    className="text-3xl sm:text-5xl font-black leading-tight tracking-tight"
                  />
                  {block.subtitle && (
                    <DynamicText
                      tag="p"
                      text={block.subtitle}
                      style={block.subtitleStyle}
                      className="text-base sm:text-xl font-semibold opacity-90 leading-relaxed"
                    />
                  )}
                  <Link
                    to={block.buttonLink as any}
                    className="inline-flex items-center justify-center gap-3 px-8 sm:px-10 py-4.5 rounded-2xl bg-white text-ink font-black text-sm sm:text-base uppercase tracking-wider border-3 border-ink shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-canvas transition active:translate-x-[2px] active:translate-y-[2px] active:shadow-none cursor-pointer mt-2"
                  >
                    <Sparkles className="size-5 text-amber-500 fill-current" /> {block.buttonText} <ArrowRight className="size-5" />
                  </Link>
                </div>
              </section>
            );

          case "faq_list":
            return (
              <section key={block.id} className="w-full py-8 max-w-4xl mx-auto">
                {block.title && (
                  <div className="text-center mb-8">
                    <DynamicText
                      tag={block.titleTag || "h2"}
                      text={block.title}
                      style={block.titleStyle}
                      className="text-3xl sm:text-4xl font-black text-ink tracking-tight"
                    />
                  </div>
                )}
                <Accordion type="single" collapsible className="w-full space-y-4">
                  {block.items.map((item) => (
                    <AccordionItem
                      key={item.id}
                      value={item.id}
                      className="border-3 border-ink bg-white rounded-2xl px-6 py-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden"
                    >
                      <AccordionTrigger className="text-left font-black text-lg text-ink hover:no-underline py-4">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-sm sm:text-base font-semibold text-ink/75 leading-relaxed pb-4">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </section>
            );

          case "media_box":
            return (
              <section key={block.id} className="w-full text-center py-6">
                {block.title && (
                  <h3 className="text-2xl font-black text-ink mb-4">{block.title}</h3>
                )}
                {block.mediaUrl && (
                  <div className="max-w-4xl mx-auto rounded-3xl border-3 border-ink overflow-hidden bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                    <img
                      src={block.mediaUrl}
                      alt={block.title || "Media content"}
                      className="w-full h-auto object-cover max-h-[500px]"
                    />
                  </div>
                )}
                {block.description && (
                  <p className="mt-4 text-base font-semibold text-ink/70">{block.description}</p>
                )}
              </section>
            );

          default:
            return null;
        }
      })}
    </div>
  );
};
