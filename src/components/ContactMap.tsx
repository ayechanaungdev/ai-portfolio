import { useState, type FormEvent } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { divIcon } from "leaflet";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";
import { sendContactMessage } from "../services/emailService";
import portfolioData from "../data/portfolioData.json";
import type { PortfolioData } from "../types/portfolio";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const data = portfolioData as PortfolioData;
const YANGON: [number, number] = [16.8409, 96.1735];

const COPY = {
  en: {
    title: "Get In Touch",
    subtitle: "Have a project in mind? Let's talk.",
    name: "Name",
    email: "Email",
    message: "Message",
    send: "Send Message",
    sending: "Sending...",
    success: "Message sent! I'll get back to you soon.",
    invalidEmail: "Please enter a valid email address.",
    genericError: "Something went wrong. Please try again or email me directly.",
  },
  jp: {
    title: "お問い合わせ",
    subtitle: "プロジェクトのご相談はこちらから",
    name: "お名前",
    email: "メールアドレス",
    message: "メッセージ",
    send: "送信する",
    sending: "送信中...",
    success: "送信しました。追ってご連絡いたします。",
    invalidEmail: "有効なメールアドレスを入力してください。",
    genericError: "送信に失敗しました。時間をおいて再度お試しいただくか、直接メールでご連絡ください。",
  },
};

const markerIcon = divIcon({
  className: "",
  html: '<span style="display:flex;height:2rem;width:2rem;align-items:center;justify-content:center;border-radius:9999px;background:var(--accent);box-shadow:0 0 0 6px color-mix(in srgb, var(--accent) 25%, transparent);border:2px solid white;"></span>',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

type Status = "idle" | "sending" | "success" | "error";

export default function ContactMap() {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const copy = COPY[language];
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const tileUrl =
    theme === "dark"
      ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!EMAIL_PATTERN.test(form.email)) {
      setStatus("error");
      setErrorMessage(copy.invalidEmail);
      return;
    }

    setStatus("sending");
    setErrorMessage(null);

    try {
      await sendContactMessage(form);
      setStatus("success");
      setForm({ name: "", email: "", message: "" });
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : copy.genericError);
    }
  };

  return (
    <section id="contact" className="relative px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-3xl font-bold text-text-h">{copy.title}</h2>
        <p className="mt-2 text-text">{copy.subtitle}</p>

        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="h-full min-h-[320px] overflow-hidden rounded-3xl border border-border dark:brightness-125 dark:contrast-75">
            <MapContainer
              center={YANGON}
              zoom={12}
              scrollWheelZoom={false}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                key={theme}
                url={tileUrl}
                attribution='&copy; OpenStreetMap contributors &copy; CARTO'
              />
              <Marker position={YANGON} icon={markerIcon}>
                <Popup>{data.profile.location[language]}</Popup>
              </Marker>
            </MapContainer>
          </div>

          <div className="rounded-3xl border border-border bg-bg-elevated p-6">
            <div className="mb-6 space-y-3 text-sm text-text">
              <p className="flex items-center gap-2">
                <Mail size={16} className="text-accent" /> {data.profile.email}
              </p>
              {data.profile.phone && (
                <p className="flex items-center gap-2">
                  <Phone size={16} className="text-accent" /> {data.profile.phone}
                </p>
              )}
              <p className="flex items-center gap-2">
                <MapPin size={16} className="text-accent" /> {data.profile.location[language]}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-text-h" htmlFor="name">
                  {copy.name}
                </label>
                <input
                  id="name"
                  required
                  value={form.name}
                  onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                  className="w-full rounded-xl border border-border bg-bg px-4 py-2.5 text-sm text-text-h outline-none focus:border-accent"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-text-h" htmlFor="email">
                  {copy.email}
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                  className="w-full rounded-xl border border-border bg-bg px-4 py-2.5 text-sm text-text-h outline-none focus:border-accent"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-text-h" htmlFor="message">
                  {copy.message}
                </label>
                <textarea
                  id="message"
                  required
                  rows={4}
                  value={form.message}
                  onChange={(event) => setForm((prev) => ({ ...prev, message: event.target.value }))}
                  className="w-full rounded-xl border border-border bg-bg px-4 py-2.5 text-sm text-text-h outline-none focus:border-accent"
                />
              </div>

              <button
                type="submit"
                disabled={status === "sending"}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-accent to-accent-2 px-6 py-3 text-sm font-semibold text-white transition-transform hover:scale-105 disabled:opacity-60"
              >
                <Send size={16} />
                {status === "sending" ? copy.sending : copy.send}
              </button>

              {status === "success" && <p className="text-sm text-accent">{copy.success}</p>}
              {status === "error" && (
                <p className="text-sm text-red-500 dark:text-red-400">
                  {errorMessage ?? copy.genericError}
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
