export type CategoryStatus = "active" | "inactive";
export type WorkStatus = "draft" | "published";
export type MessageStatus = "unread" | "read";

export type WebsiteInfo = {
  id: number;
  portfolio_name: string;
  intro_line: string;
  main_title: string;
  description: string;
  primary_button_text: string;
  secondary_button_text: string;
  email: string;
  phone: string;
  instagram: string;
  behance: string;
  linkedin: string;
  footer_text: string;
  created_at: string;
  updated_at: string;
};

export type Category = {
  id: string;
  title: string;
  slug: string;
  description: string;
  thumbnail_url: string;
  show_on_home: boolean;
  display_order: number;
  status: CategoryStatus;
  created_at: string;
  updated_at: string;
};

export type Work = {
  id: string;
  title: string;
  slug: string;
  category_id: string;
  short_description: string;
  full_description: string;
  thumbnail_url: string;
  gallery_images: string[];
  tools: string[];
  client_name: string | null;
  project_link: string | null;
  status: WorkStatus;
  created_at: string;
  updated_at: string;
  categories?: Pick<Category, "id" | "title" | "slug"> | null;
};

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: MessageStatus;
  created_at: string;
};

export const emptyWebsiteInfo: Omit<WebsiteInfo, "id" | "created_at" | "updated_at"> = {
  portfolio_name: "Creative Portfolio",
  intro_line: "Independent designer and maker",
  main_title: "Selected work with clarity, craft, and purpose.",
  description: "A modern portfolio powered by a simple CMS. Add categories, publish projects, and keep the public site current from one admin panel.",
  primary_button_text: "View Work",
  secondary_button_text: "Contact",
  email: "hello@example.com",
  phone: "+1 000 000 0000",
  instagram: "",
  behance: "",
  linkedin: "",
  footer_text: "Built with care."
};
