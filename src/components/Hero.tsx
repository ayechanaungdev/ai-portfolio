import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Download, Loader2 } from "lucide-react";
import heroImg from "../assets/hero.jpg";
import { useLanguage } from "../context/LanguageContext";
import { calculateAge } from "../utils/dateHelpers";
import portfolioData from "../data/portfolioData.json";
import type { PortfolioData } from "../types/portfolio";

const data = portfolioData as PortfolioData;

const COPY = {
  en: {
    greeting: "Hello, I'm",
    viewProjects: "View Projects",
    downloadCv: "Download CV",
    age: "years old",
  },
  jp: {
    greeting: "こんにちは、",
    viewProjects: "実績を見る",
    downloadCv: "履歴書をダウンロード",
    age: "歳",
  },
};

export default function Hero() {
  const { language } = useLanguage();
  const copy = COPY[language];
  const age = calculateAge(data.profile.birthDate);
  const [isGeneratingCv, setIsGeneratingCv] = useState(false);

  const handleDownloadCv = async () => {
    setIsGeneratingCv(true);
    try {
      const { generateResumePdf } = await import("../utils/generateResumePdf");
      await generateResumePdf(data, language);
    } finally {
      setIsGeneratingCv(false);
    }
  };

  return (
    <section id="home" className="relative flex min-h-screen items-center pt-24">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-6 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-bg-elevated px-4 py-1.5 text-xs font-medium text-text">
            {age} {copy.age}
          </span>

          <h1 className="mt-6 text-4xl font-bold tracking-tight text-text-h sm:text-5xl lg:text-6xl">
            {copy.greeting}{" "}
            <div className="py-3 bg-gradient-to-r from-accent to-accent-2 bg-clip-text text-transparent">
              {data.profile.name}
            </div>
          </h1>

          <p className="mt-4 text-xl font-medium text-text-h">{data.profile.title[language]}</p>
          <p className="mt-4 max-w-lg text-text">{data.profile.tagline[language]}</p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#projects"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-accent to-accent-2 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-accent/30 transition-transform hover:scale-105"
            >
              {copy.viewProjects}
              <ArrowRight size={16} />
            </a>
            <button
              type="button"
              onClick={handleDownloadCv}
              disabled={isGeneratingCv}
              className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-semibold text-text-h transition-colors hover:border-accent hover:text-accent disabled:opacity-60"
            >
              {isGeneratingCv ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
              {copy.downloadCv}
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative mx-auto flex h-72 w-72 items-center justify-center sm:h-80 sm:w-80"
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-accent/40 to-accent-2/40 blur-2xl" />
          <img
            src={heroImg}
            alt={data.profile.name}
            className="my-3 relative h-full w-full rounded-full border border-border object-cover"
          />
        </motion.div>
      </div>
    </section>
  );
}
