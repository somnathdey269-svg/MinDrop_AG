export type HeadingTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p";

export interface TypographyStyle {
  fontFamily?: string;
  fontSize?: string; // e.g. "36px", "2.5rem"
  fontWeight?: "normal" | "medium" | "semibold" | "bold" | "800" | "900";
  fontStyle?: "normal" | "italic";
  color?: string; // hex, hsl, rgb
  textAlign?: "left" | "center" | "right";
  lineHeight?: string;
  letterSpacing?: string;
  backgroundColor?: string;
  backgroundGradient?: string;
  padding?: string;
  borderRadius?: string;
}

export interface CardItem {
  id: string;
  title: string;
  titleTag?: HeadingTag;
  titleStyle?: TypographyStyle;
  description: string;
  descriptionStyle?: TypographyStyle;
  icon?: string; // Lucide icon name or image URL
  badgeText?: string;
  badgeColor?: string;
  buttonText?: string;
  buttonLink?: string;
  backgroundColor?: string;
  borderColor?: string;
}

export interface HeadingBlock {
  id: string;
  type: "heading";
  tag: HeadingTag;
  eyebrowText?: string;
  eyebrowStyle?: TypographyStyle;
  text: string;
  style: TypographyStyle;
}

export interface CardGridBlock {
  id: string;
  type: "card_grid";
  sectionTitle?: string;
  sectionTitleTag?: HeadingTag;
  sectionTitleStyle?: TypographyStyle;
  layoutConfig: {
    columns: "auto-fit" | "1" | "2" | "3" | "4";
    minCardWidth?: string; // e.g. "280px"
    gap?: string; // e.g. "24px"
  };
  cards: CardItem[];
}

export interface CtaBandBlock {
  id: string;
  type: "cta_band";
  title: string;
  titleTag?: HeadingTag;
  titleStyle?: TypographyStyle;
  subtitle?: string;
  subtitleStyle?: TypographyStyle;
  buttonText: string;
  buttonLink: string;
  buttonStyle?: TypographyStyle;
  backgroundColor?: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

export interface FaqBlock {
  id: string;
  type: "faq_list";
  title?: string;
  titleTag?: HeadingTag;
  titleStyle?: TypographyStyle;
  items: FaqItem[];
}

export interface MediaBoxBlock {
  id: string;
  type: "media_box";
  title?: string;
  description?: string;
  mediaUrl?: string;
  mediaType?: "image" | "video" | "embed";
  style?: TypographyStyle;
}

export type CMSBlock =
  | HeadingBlock
  | CardGridBlock
  | CtaBandBlock
  | FaqBlock
  | MediaBoxBlock;

export interface MarketingPageData {
  id?: string;
  slug: string;
  page_name: string;
  meta_title?: string;
  meta_description?: string;
  blocks: CMSBlock[];
  is_published?: boolean;
  updated_at?: string;
}
