import { LucideIcon } from "lucide-react";

export enum Page {
  HOME = 'HOME',
  SEARCH = 'SEARCH',
  PUBLISH = 'PUBLISH',
  // Footer Pages
  ABOUT = 'ABOUT',
  CAREERS = 'CAREERS',
  PRESS = 'PRESS',
  BLOG = 'BLOG',
  HELP = 'HELP',
  SECURITY = 'SECURITY',
  CANCELLATION = 'CANCELLATION',
  REPORT = 'REPORT'
}

export interface Category {
  id: string;
  name: string;
  icon: LucideIcon;
  image: string;
  description: string;
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  content: string;
  avatar: string;
  rating: number;
}