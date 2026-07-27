/** English / Japanese pair for any translatable text field. */
export interface LocalizedString {
  en: string;
  jp: string;
}

/** English / Japanese pair for a list of translatable strings (e.g. bullet points). */
export interface LocalizedStringList {
  en: string[];
  jp: string[];
}

export interface SocialLink {
  platform: "github" | "linkedin" | "twitter" | "facebook" | "instagram" | "youtube" | "website";
  url: string;
}

export interface Profile {
  name: string;
  title: LocalizedString;
  tagline: LocalizedString;
  bio: LocalizedString;
  location: LocalizedString;
  /** ISO 8601 date (YYYY-MM-DD), used by dateHelpers to compute a dynamic age badge. */
  birthDate: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  resumeUrl?: string;
  socialLinks: SocialLink[];
}

export interface StatItem {
  id: string;
  label: LocalizedString;
  value: number;
  suffix?: string;
}

export interface WorkExperience {
  id: string;
  role: LocalizedString;
  company: LocalizedString;
  companyUrl?: string;
  location: LocalizedString;
  /** ISO 8601 date (YYYY-MM-DD). */
  startDate: string;
  /** ISO 8601 date (YYYY-MM-DD), or null if this is the current position. */
  endDate: string | null;
  /** Short one-sentence summary, used for the compact CV PDF (the site shows the fuller `responsibilities` instead). */
  summary: LocalizedString;
  responsibilities: LocalizedStringList;
  technologies: string[];
}

export interface Education {
  id: string;
  degree: LocalizedString;
  institution: LocalizedString;
  institutionUrl?: string;
  location: LocalizedString;
  /** ISO 8601 date (YYYY-MM-DD, day unused) of graduation or expected completion. */
  date: string;
  details: LocalizedStringList;
}

export interface SkillItem {
  /** Plain string for proper nouns (e.g. "Python") that don't need translation, or a LocalizedString for skills whose label itself needs translating (e.g. language proficiency). */
  name: string | LocalizedString;
  /** Proficiency level as a percentage, 0-100. */
  level: number;
}

export interface SkillCategory {
  id: string;
  title: LocalizedString;
  skills: SkillItem[];
}

export interface Project {
  id: string;
  title: LocalizedString;
  description: LocalizedString;
  category: LocalizedString;
  technologies: string[];
  imageUrl?: string;
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
}

export interface PortfolioData {
  profile: Profile;
  stats: StatItem[];
  workExperience: WorkExperience[];
  education: Education[];
  skills: SkillCategory[];
  projects: Project[];
}
