import React from "react";
import type { HeadingTag, TypographyStyle } from "@/lib/cms/cms.types";

interface DynamicTextProps {
  tag?: HeadingTag;
  text: string;
  style?: TypographyStyle;
  className?: string;
}

export const DynamicText: React.FC<DynamicTextProps> = ({
  tag = "p",
  text,
  style = {},
  className = "",
}) => {
  const Component = tag as React.ElementType;

  const inlineStyles: React.CSSProperties = {
    fontFamily: style.fontFamily || undefined,
    fontSize: style.fontSize || undefined,
    fontWeight: style.fontWeight || undefined,
    fontStyle: style.fontStyle || undefined,
    color: style.color || undefined,
    textAlign: style.textAlign || undefined,
    lineHeight: style.lineHeight || undefined,
    letterSpacing: style.letterSpacing || undefined,
    backgroundColor: style.backgroundColor || undefined,
    backgroundImage: style.backgroundGradient ? style.backgroundGradient : undefined,
    WebkitBackgroundClip: style.backgroundGradient ? "text" : undefined,
    WebkitTextFillColor: style.backgroundGradient ? "transparent" : undefined,
    padding: style.padding || undefined,
    borderRadius: style.borderRadius || undefined,
  };

  return (
    <Component className={`transition-all ${className}`} style={inlineStyles}>
      {text}
    </Component>
  );
};
