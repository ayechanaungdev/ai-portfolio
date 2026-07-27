import type { SyntheticEvent } from "react";
import { motion } from "framer-motion";
import { Briefcase, GraduationCap, type LucideIcon } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { calculateDuration, formatDateRange, formatMonthYear } from "../utils/dateHelpers";
import portfolioData from "../data/portfolioData.json";
import type { PortfolioData } from "../types/portfolio";

const data = portfolioData as PortfolioData;

const COPY = {
  en: { title: "Experience & Education", work: "Experience", education: "Education" },
  jp: { title: "経歴・学歴", work: "経歴", education: "学歴" },
};

interface TimelineEntry {
  id: string;
  title: string;
  subtitle: string;
  subtitleUrl?: string;
  location: string;
  dateLabel: string;
  details: string[];
  tags: string[];
}

function faviconUrl(url: string): string | null {
  try {
    const domain = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?sz=64&domain=${domain}`;
  } catch {
    return null;
  }
}

function hideBrokenImage(event: SyntheticEvent<HTMLImageElement>) {
  event.currentTarget.style.display = "none";
}

/** Renders a bullet list item, bolding a leading "Label:" prefix if present (e.g. "Project Development: ..."). */
function DetailLine({ text }: { text: string }) {
  const match = text.match(/^([^:：]{1,40})[:：]\s*(.*)$/);
  const body = match ? (
    <>
      <span className="font-semibold text-text-h">{match[1]}:</span> {match[2]}
    </>
  ) : (
    text
  );

  return (
    <li className="flex gap-2 text-sm text-text">
      <span className="mt-2 h-1 w-1 flex-shrink-0 rounded-full bg-border" />
      <span>{body}</span>
    </li>
  );
}

/** Renders a date label with any 4-digit year highlighted, matching the old portfolio's styling. */
function DateLabel({ text }: { text: string }) {
  const parts = text.split(/(\d{4})/);
  return (
    <>
      {parts.map((part, index) =>
        /^\d{4}$/.test(part) ? (
          <span key={index} className="text-violet-100">
            {part}
          </span>
        ) : (
          <span key={index}>{part}</span>
        ),
      )}
    </>
  );
}

function TimelineColumn({
  heading,
  icon: Icon,
  entries,
}: {
  heading: string;
  icon: LucideIcon;
  entries: TimelineEntry[];
}) {
  return (
    <div>
      <h3 className="mb-6 flex items-center gap-2 text-xl font-bold text-text-h">
        <Icon size={20} className="text-accent" />
        {heading}
      </h3>

      <div className="space-y-8 border-l border-border pl-8">
        {entries.map((entry, index) => {
          const isCurrent = index === 0;
          const favicon = entry.subtitleUrl ? faviconUrl(entry.subtitleUrl) : null;

          const content = (
            <>
              <h4 className="text-base font-semibold text-text-h">{entry.title}</h4>

              {entry.subtitleUrl ? (
                <a
                  href={entry.subtitleUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="mt-1.5 inline-flex items-center gap-1.5 rounded-full border border-border bg-bg px-2.5 py-1 text-xs font-medium text-accent transition-colors hover:border-accent hover:bg-accent/5"
                >
                  {favicon && (
                    <img src={favicon} alt="" className="h-3.5 w-3.5 rounded-full" onError={hideBrokenImage} />
                  )}
                  {entry.subtitle}
                </a>
              ) : (
                <p className="mt-1.5 text-xs text-text">{entry.subtitle}</p>
              )}

              {entry.details.length > 0 && (
                <ul className="mt-2 space-y-2">
                  {entry.details.map((detail, detailIndex) => (
                    <DetailLine key={detailIndex} text={detail} />
                  ))}
                </ul>
              )}

              {entry.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {entry.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-border bg-bg px-3 py-1 text-xs text-text"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </>
          );

          return (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="relative"
            >
              {isCurrent && (
                <span className="absolute -left-[2.6rem] top-1 h-4 w-4 animate-ping rounded-full bg-accent opacity-75" />
              )}
              <span
                className={`absolute -left-[2.6rem] top-1 rounded-full ${
                  isCurrent
                    ? "h-4 w-4 border-[3px] border-accent bg-bg"
                    : "h-3 w-3 bg-gradient-to-br from-accent to-accent-2"
                }`}
              />

              <span className="inline-block rounded-full bg-gradient-to-r from-accent to-accent-2 px-3 py-1 text-xs font-semibold text-white">
                <DateLabel text={entry.dateLabel} />
              </span>

              <div
                className={`mt-2 rounded-2xl p-4 ${
                  isCurrent ? "bg-bg-elevated" : "border border-border"
                }`}
              >
                {content}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export default function Timeline() {
  const { language } = useLanguage();
  const copy = COPY[language];

  const workEntries: TimelineEntry[] = data.workExperience.map((item) => {
    const dateRange = formatDateRange(item.startDate, item.endDate, language);
    const duration = calculateDuration(item.startDate, item.endDate ?? undefined, language);
    const separator = language === "jp" ? "・" : "·";
    return {
      id: item.id,
      title: item.role[language],
      subtitle: item.company[language],
      subtitleUrl: item.companyUrl,
      location: item.location[language],
      dateLabel: `${dateRange} ${separator} ${duration}`,
      details: item.responsibilities[language],
      tags: item.technologies,
    };
  });

  const educationEntries: TimelineEntry[] = data.education.map((item) => ({
    id: item.id,
    title: item.degree[language],
    subtitle: item.institution[language],
    subtitleUrl: item.institutionUrl,
    location: item.location[language],
    dateLabel: formatMonthYear(item.date, language),
    details: item.details[language],
    tags: [],
  }));

  return (
    <section id="experience" className="relative px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-text-h">{copy.title}</h2>
        </motion.div>

        <div className="mt-12 grid grid-cols-1 gap-12 md:grid-cols-3">
          <div className="md:col-span-1">
            <TimelineColumn heading={copy.education} icon={GraduationCap} entries={educationEntries} />
          </div>
          <div className="md:col-span-2">
            <TimelineColumn heading={copy.work} icon={Briefcase} entries={workEntries} />
          </div>
        </div>
      </div>
    </section>
  );
}
