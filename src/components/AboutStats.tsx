import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLanguage, type Language } from "../context/LanguageContext";
import portfolioData from "../data/portfolioData.json";
import type { PortfolioData, StatItem } from "../types/portfolio";

const data = portfolioData as PortfolioData;

const COPY = {
  en: { title: "About Me" },
  jp: { title: "自己紹介" },
};

function useCountUp(end: number, start: boolean, duration = 1200) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!start) return;
    let frame: number;
    const startTime = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      setValue(Math.round(progress * end));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [start, end, duration]);

  return value;
}

function StatCard({ stat, language, start }: { stat: StatItem; language: Language; start: boolean }) {
  const value = useCountUp(stat.value, start);

  return (
    <div className="rounded-2xl border border-border bg-bg-elevated p-6 text-center">
      <p className="text-3xl font-bold text-text-h">
        {value}
        {stat.suffix}
      </p>
      <p className="mt-2 text-sm text-text">{stat.label[language]}</p>
    </div>
  );
}

export default function AboutStats() {
  const { language } = useLanguage();
  const copy = COPY[language];
  const [start, setStart] = useState(false);

  return (
    <section id="about" className="relative px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          onViewportEnter={() => setStart(true)}
        >
          <h2 className="text-3xl font-bold text-text-h">{copy.title}</h2>
          <p className="mt-4 max-w-3xl text-text">{data.profile.bio[language]}</p>
        </motion.div>

        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {data.stats.map((stat) => (
            <StatCard key={stat.id} stat={stat} language={language} start={start} />
          ))}
        </div>
      </div>
    </section>
  );
}
