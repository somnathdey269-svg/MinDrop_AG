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

export interface PricingPageFields {
  openingEyebrow?: string;
  openingLine1?: string;
  openingLine2?: string;
  openingLine3?: string;
  openingHeadline?: string;

  tiersEyebrow?: string;
  tiersTitle?: string;
  freeTierTitle?: string;
  freeTierFeature1?: string;
  freeTierFeature2?: string;
  freeTierFeature3?: string;
  freeTierFeature4?: string;
  freeTierFooter?: string;

  premiumTierTitle?: string;
  premiumTierFeature1?: string;
  premiumTierFeature2?: string;
  premiumTierFeature3?: string;
  premiumTierFeature4?: string;
  premiumTierFooter?: string;

  flowEyebrow?: string;
  flowTitle?: string;
  step1Badge?: string;
  step1Title?: string;
  step1Desc?: string;
  step2Badge?: string;
  step2Title?: string;
  step2Desc?: string;
  step3Badge?: string;
  step3Title?: string;
  step3Desc?: string;

  closerEyebrow?: string;
  closerTitle?: string;
  spec1Title?: string;
  spec1Desc?: string;
  spec2Title?: string;
  spec2Desc?: string;
  spec3Title?: string;
  spec3Desc?: string;
  closerCtaText?: string;
}

export interface MarketingPageData {
  id?: string;
  slug: string;
  page_name: string;
  meta_title?: string;
  meta_description?: string;
  blocks: CMSBlock[];
  fields?: Record<string, string>;
  is_published?: boolean;
  updated_at?: string;
}
