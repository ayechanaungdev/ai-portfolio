import { useEffect, useState } from "react";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useLanguage, type Language } from "../context/LanguageContext";
import portfolioData from "../data/portfolioData.json";
import type { PortfolioData } from "../types/portfolio";

const data = portfolioData as PortfolioData;

const NAV_LINKS = [
  { href: "#about", label: { en: "About", jp: "概要" } },
  { href: "#skills", label: { en: "Skills", jp: "スキル" } },
  { href: "#experience", label: { en: "Experience", jp: "経歴" } },
  { href: "#projects", label: { en: "Projects", jp: "実績" } },
  { href: "#contact", label: { en: "Contact", jp: "お問い合わせ" } },
];

function LanguageToggleLabel({ language }: { language: Language }) {
  return (
    <>
      <span className={language === "en" ? "text-accent" : ""}>EN</span>
      <span className="mx-0.5">/</span>
      <span className={language === "jp" ? "text-accent" : ""}>JP</span>
    </>
  );
}

function useActiveSection(): string {
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    const sections = NAV_LINKS.map((link) => document.querySelector(link.href)).filter(
      (el): el is Element => el !== null,
    );

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length > 0) {
          setActiveId(`#${visible[0].target.id}`);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return activeId;
}

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const activeSection = useActiveSection();

  return (
    <header className="fixed inset-x-0 top-0 z-[1100] border-b border-border/80 bg-bg/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a
          href="#home"
          className="bg-gradient-to-r from-accent to-accent-2 bg-clip-text text-lg font-semibold tracking-tight text-transparent"
        >
          {data.profile.name}
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`text-sm transition-colors hover:text-text-h ${
                activeSection === link.href ? "font-bold text-accent" : "font-medium text-text"
              }`}
            >
              {link.label[language]}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <button
            type="button"
            onClick={toggleLanguage}
            aria-label="Toggle language"
            className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-text transition-colors hover:border-accent"
          >
            <LanguageToggleLabel language={language} />
          </button>
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-text transition-colors hover:border-accent hover:text-accent"
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>

        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-text-h md:hidden"
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {open && (
        <div className="flex flex-col gap-4 border-t border-border bg-bg/95 px-6 py-4 backdrop-blur-xl md:hidden">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`text-sm hover:text-text-h ${
                activeSection === link.href ? "font-bold text-accent" : "font-medium text-text"
              }`}
            >
              {link.label[language]}
            </a>
          ))}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={toggleLanguage}
              className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-text"
            >
              <LanguageToggleLabel language={language} />
            </button>
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-text"
            >
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
