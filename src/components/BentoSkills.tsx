import { motion } from "framer-motion";
import { Code2, Languages as LanguagesIcon, Layers, Palette, type LucideIcon } from "lucide-react";
import { useLanguage, type Language } from "../context/LanguageContext";
import portfolioData from "../data/portfolioData.json";
import type { PortfolioData, SkillItem } from "../types/portfolio";

const data = portfolioData as PortfolioData;

const COPY = {
  en: { title: "Skills", subtitle: "Technologies and tools I work with" },
  jp: { title: "スキル", subtitle: "得意な技術・ツール" },
};

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  "coding-languages": Code2,
  "frameworks-technologies": Layers,
  "design-skills": Palette,
  languages: LanguagesIcon,
};

function skillName(skill: SkillItem, language: Language): string {
  return typeof skill.name === "string" ? skill.name : skill.name[language];
}

export default function BentoSkills() {
  const { language } = useLanguage();
  const copy = COPY[language];

  return (
    <section id="skills" className="relative px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-text-h">{copy.title}</h2>
          <p className="mt-2 text-text">{copy.subtitle}</p>
        </motion.div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {data.skills.map((category, index) => {
            const Icon = CATEGORY_ICONS[category.id] ?? Code2;
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`rounded-3xl border border-border bg-bg-elevated p-6 transition-transform hover:-translate-y-1 ${
                  index === 0 || category.id === "languages" ? "md:col-span-2" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-accent-2 text-white">
                    <Icon size={18} />
                  </span>
                  <h3 className="text-lg font-semibold text-text-h">{category.title[language]}</h3>
                </div>

                <div className="mt-6 space-y-4">
                  {category.skills.map((skill) => (
                    <div key={skillName(skill, language)}>
                      <div className="mb-1.5 flex items-center justify-between gap-3 text-sm">
                        <span className="min-w-0 truncate font-medium text-text-h">
                          {skillName(skill, language)}
                        </span>
                        <span className="shrink-0 text-text">{skill.level}%</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-border/60">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                          className="h-full rounded-full bg-gradient-to-r from-accent to-accent-2"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
