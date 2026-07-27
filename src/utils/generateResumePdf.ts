import { jsPDF } from "jspdf";
import heroPhotoBase64 from "../assets/hero.jpg?inline";
import { calculateDuration, formatDateRange, formatMonthYear } from "./dateHelpers";
import type { Language } from "../context/LanguageContext";
import type { PortfolioData, SkillItem } from "../types/portfolio";

function skillName(skill: SkillItem, language: Language): string {
  return typeof skill.name === "string" ? skill.name : skill.name[language];
}

const ACCENT = [79, 70, 229] as const; // indigo #4f46e5
const ACCENT_2 = [124, 58, 237] as const; // violet #7c3aed
const TEXT_H = [15, 23, 42] as const; // slate-900
const TEXT = [71, 85, 105] as const; // slate-600

const COPY = {
  en: { experience: "Work Experience", education: "Education", skills: "Skills", present: "Present" },
  jp: { experience: "職務経歴", education: "学歴", skills: "スキル", present: "現在" },
};

const JP_FONT_NAME = "NotoSansJP";

/** Crops an image to fill a square box (like CSS `object-fit: cover`), centered, returned as a JPEG data URL. */
async function getCoverCroppedSquarePhoto(src: string, sizePx = 300): Promise<string> {
  const img = new Image();
  img.src = src;
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error("Failed to load profile photo"));
  });

  const canvas = document.createElement("canvas");
  canvas.width = sizePx;
  canvas.height = sizePx;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context unavailable");

  const scale = Math.max(sizePx / img.naturalWidth, sizePx / img.naturalHeight);
  const scaledWidth = img.naturalWidth * scale;
  const scaledHeight = img.naturalHeight * scale;
  ctx.drawImage(img, (sizePx - scaledWidth) / 2, (sizePx - scaledHeight) / 2, scaledWidth, scaledHeight);

  return canvas.toDataURL("image/jpeg", 0.92);
}

async function registerJapaneseFont(doc: jsPDF): Promise<void> {
  const [{ default: regularBase64 }, { default: boldBase64 }] = await Promise.all([
    import("../assets/fonts/notoSansJpFont"),
    import("../assets/fonts/notoSansJpBoldFont"),
  ]);

  doc.addFileToVFS("NotoSansJP-Regular.ttf", regularBase64);
  doc.addFont("NotoSansJP-Regular.ttf", JP_FONT_NAME, "normal");
  doc.addFileToVFS("NotoSansJP-Bold.ttf", boldBase64);
  doc.addFont("NotoSansJP-Bold.ttf", JP_FONT_NAME, "bold");
}

/** Generates and downloads a branded CV PDF in the given language, built live from portfolio data. */
export async function generateResumePdf(data: PortfolioData, language: Language): Promise<void> {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const copy = COPY[language];
  const fontName = language === "jp" ? JP_FONT_NAME : "helvetica";

  if (language === "jp") {
    await registerJapaneseFont(doc);
  }

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginX = 48;
  const bottomLimit = pageHeight - 48;
  let y = 56;

  const setColor = (rgb: readonly [number, number, number]) => doc.setTextColor(rgb[0], rgb[1], rgb[2]);

  const ensureSpace = (needed: number) => {
    if (y + needed > bottomLimit) {
      doc.addPage();
      y = 56;
    }
  };

  const paragraphLineHeight = language === "jp" ? 17 : 14;

  const renderParagraph = (text: string) => {
    doc.setFont(fontName, "normal");
    doc.setFontSize(10);
    setColor(TEXT);
    const lines = doc.splitTextToSize(text, pageWidth - marginX * 2);
    ensureSpace(lines.length * paragraphLineHeight);
    doc.text(lines, marginX, y, { lineHeightFactor: paragraphLineHeight / 10 });
    y += lines.length * paragraphLineHeight;
  };

  const sectionHeading = (label: string) => {
    ensureSpace(40);
    doc.setFont(fontName, "bold");
    doc.setFontSize(13);
    setColor(ACCENT);
    doc.text(label, marginX, y);
    y += 6;
    doc.setDrawColor(...ACCENT);
    doc.setLineWidth(0.75);
    doc.line(marginX, y, pageWidth - marginX, y);
    y += 18;
  };

  // Photo (top-right) — cropped to a square, "cover" style, so it isn't stretched to fit the box
  const photoSize = 70;
  const croppedPhoto = await getCoverCroppedSquarePhoto(heroPhotoBase64);
  doc.addImage(croppedPhoto, "JPEG", pageWidth - marginX - photoSize, 36, photoSize, photoSize);

  // Name
  doc.setFont(fontName, "bold");
  doc.setFontSize(24);
  setColor(ACCENT);
  doc.text(data.profile.name, marginX, y);
  y += 26;

  // Title
  doc.setFont(fontName, "normal");
  doc.setFontSize(13);
  setColor(TEXT_H);
  doc.text(data.profile.title[language], marginX, y);
  y += 18;

  // Contact line
  doc.setFontSize(10);
  setColor(TEXT);
  const contactLine = [data.profile.email, data.profile.phone, data.profile.location[language]]
    .filter(Boolean)
    .join("   |   ");
  doc.text(contactLine, marginX, y);
  y += 20;

  doc.setDrawColor(...ACCENT_2);
  doc.setLineWidth(1.2);
  doc.line(marginX, y, pageWidth - marginX, y);
  y += 20;

  // Bio
  doc.setFont(fontName, "normal");
  doc.setFontSize(10.5);
  setColor(TEXT);
  const bioLines = doc.splitTextToSize(data.profile.bio[language], pageWidth - marginX * 2);
  doc.text(bioLines, marginX, y, { lineHeightFactor: paragraphLineHeight / 10 });
  y += bioLines.length * paragraphLineHeight + 16;

  // Work experience
  sectionHeading(copy.experience);
  for (const job of data.workExperience) {
    ensureSpace(60);
    doc.setFont(fontName, "bold");
    doc.setFontSize(11);
    setColor(TEXT_H);
    doc.text(job.role[language], marginX, y);

    const dateRange = formatDateRange(job.startDate, job.endDate, language);
    const duration = calculateDuration(job.startDate, job.endDate ?? undefined, language);
    const separator = language === "jp" ? "・" : "·";
    doc.setFont(fontName, "normal");
    doc.setFontSize(9.5);
    setColor(ACCENT_2);
    doc.text(`${dateRange} ${separator} ${duration}`, pageWidth - marginX, y, { align: "right" });
    y += 14;

    doc.setFont(fontName, "normal");
    doc.setFontSize(10);
    setColor(TEXT);
    doc.text(`${job.company[language]} — ${job.location[language]}`, marginX, y);
    y += 14;

    renderParagraph(job.summary[language]);
    y += 10;
  }

  // Education
  sectionHeading(copy.education);
  for (const edu of data.education) {
    ensureSpace(40);
    doc.setFont(fontName, "bold");
    doc.setFontSize(11);
    setColor(TEXT_H);
    doc.text(edu.degree[language], marginX, y);

    doc.setFont(fontName, "normal");
    doc.setFontSize(9.5);
    setColor(ACCENT_2);
    doc.text(formatMonthYear(edu.date, language), pageWidth - marginX, y, { align: "right" });
    y += 14;

    doc.setFont(fontName, "normal");
    doc.setFontSize(10);
    setColor(TEXT);
    doc.text(`${edu.institution[language]} — ${edu.location[language]}`, marginX, y);
    y += 14;

    renderParagraph(edu.details[language].join(", "));
    y += 10;
  }

  // Skills
  sectionHeading(copy.skills);
  for (const category of data.skills) {
    ensureSpace(32);
    doc.setFont(fontName, "bold");
    doc.setFontSize(10.5);
    setColor(TEXT_H);
    doc.text(category.title[language], marginX, y);
    y += 13;

    doc.setFont(fontName, "normal");
    doc.setFontSize(10);
    setColor(TEXT);
    const skillsLine = category.skills.map((skill) => skillName(skill, language)).join(", ");
    const skillsLines = doc.splitTextToSize(skillsLine, pageWidth - marginX * 2);
    doc.text(skillsLines, marginX, y);
    y += skillsLines.length * 12 + 10;
  }

  doc.save(`Aye-Chan-Aung-CV-${language}.pdf`);
}
