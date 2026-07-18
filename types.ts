/**
 * TypeScript Definitions for Amit Joshi Portfolio CMS
 */

export interface CMSData {
  settings: {
    siteName: string;
    connectTextEN: string;
    connectTextNP: string;
    faviconUrl: string;
    nepaliFlagUrl: string;
    headerBgUrl: string;
    temporaryMapEmbed: string;
    permanentMapEmbed: string;
    adminPasswordHash: string; // fallback password
    whatsappNumber: string;
    contactEmail: string;
    customPopupActive: boolean;
    customPopupTitleEN: string;
    customPopupTitleNP: string;
    customPopupTextEN: string;
    customPopupTextNP: string;
    customPopupImageUrl: string;
  };
  sliders: SliderItem[];
  socials: SocialItem[];
  initiatives: {
    facebookEmbedUrl: string;
    titleEN: string;
    titleNP: string;
    introEN: string;
    introNP: string;
    detailsEN: string;
    detailsNP: string;
    followUrl: string;
  };
  blogs: {
    iframeUrl: string;
  };
  educations: EducationItem[];
  tools: ToolItem[];
  interests: InterestItem[];
  services: ServiceItem[];
  adminLog: {
    lastLoggedInEmail: string;
    lastLoggedInTime: string;
    previousLoggedInTime: string; // The session before last
    lastModification: string;
    viewerCount: number;
  };
}

export interface SliderItem {
  id: string;
  imageUrl: string;
  titleEN: string;
  titleNP: string;
  subtitleEN: string;
  subtitleNP: string;
}

export interface SocialItem {
  id: string;
  name: string;
  biographyEN: string;
  biographyNP: string;
  iconName: string; // e.g. "facebook", "instagram", "tiktok", "whatsapp", "mail", "link"
  iconUrl?: string; // fallback uploaded image
  redirectUrl: string;
}

export interface EducationItem {
  id: string;
  institutionEN: string;
  institutionNP: string;
  shortIntroEN: string;
  shortIntroNP: string;
  detailsEN: string;
  detailsNP: string;
  redirectUrl: string;
}

export interface ToolItem {
  id: string;
  titleEN: string;
  titleNP: string;
  shortIntroEN: string;
  shortIntroNP: string;
  logoUrl: string; // or icon name
  redirectUrl: string;
}

export interface InterestItem {
  id: string;
  titleEN: string;
  titleNP: string;
  shortIntroEN: string;
  shortIntroNP: string;
  detailsEN: string;
  detailsNP: string;
  logoUrl: string;
}

export interface ServiceItem {
  id: string;
  titleEN: string;
  titleNP: string;
  shortIntroEN: string;
  shortIntroNP: string;
  detailsEN: string;
  detailsNP: string;
  imageUrl: string;
  redirectUrl: string;
  helpWhatsappMessageEN: string;
  helpWhatsappMessageNP: string;
}

export interface TextFormatConfig {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  align?: "left" | "center" | "right";
  color?: string; // custom or hex or VIBGYOR
  letterSpacing?: string; // px or tracking class
  lineSpacing?: string; // leading class
  marginTop?: string;
}
