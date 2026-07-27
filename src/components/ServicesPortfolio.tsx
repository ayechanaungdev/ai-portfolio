import { motion } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";
import portfolioData from "../data/portfolioData.json";
import type { PortfolioData } from "../types/portfolio";

const data = portfolioData as PortfolioData;

const COPY = {
  en: {
    title: "Projects & Services",
    subtitle: "A selection of platforms and systems I've built",
    featured: "Featured",
  },
  jp: {
    title: "実績・サービス",
    subtitle: "これまでに手がけたプラットフォーム・システム",
    featured: "注目",
  },
};

export default function ServicesPortfolio() {
  const { language } = useLanguage();
  const copy = COPY[language];

  return (
    <section id="projects" className="relative px-6 py-24">
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
          {data.projects.map((project, index) => (
            <motion.article
              key={project.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-3xl border border-border bg-bg-elevated p-6 transition-all hover:-translate-y-1 hover:border-accent/60 hover:shadow-xl hover:shadow-accent/10"
            >
              {project.featured && (
                <span className="absolute right-4 top-4 rounded-full bg-gradient-to-r from-accent to-accent-2 px-3 py-1 text-xs font-semibold text-white">
                  {copy.featured}
                </span>
              )}
              <span className="text-xs font-semibold uppercase tracking-wide text-accent">
                {project.category[language]}
              </span>
              <h3 className="mt-2 text-lg font-semibold text-text-h">{project.title[language]}</h3>
              <p className="mt-2 text-sm text-text">{project.description[language]}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full border border-border bg-bg px-3 py-1 text-xs text-text"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
