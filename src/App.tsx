import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import AboutStats from "./components/AboutStats";
import BentoSkills from "./components/BentoSkills";
import Timeline from "./components/Timeline";
import ServicesPortfolio from "./components/ServicesPortfolio";
import ContactMap from "./components/ContactMap";
import ScrollToTopButton from "./components/ScrollToTopButton";

function App() {
  return (
    <div className="min-h-screen text-text">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-bg">
        <div className="absolute -left-32 -top-32 h-56 w-56 rounded-full bg-accent/35 blur-[150px] dark:bg-accent/20 sm:h-80 sm:w-80" />
        <div className="absolute -right-32 top-1/3 h-56 w-56 rounded-full bg-accent-2/35 blur-[150px] dark:bg-accent-2/20 sm:h-80 sm:w-80" />
        <div className="absolute -bottom-32 -left-16 h-56 w-56 rounded-full bg-accent/35 blur-[150px] dark:bg-accent/20 sm:h-80 sm:w-80" />
      </div>

      <Navbar />
      <main>
        <Hero />
        <AboutStats />
        <BentoSkills />
        <Timeline />
        <ServicesPortfolio />
        <ContactMap />
      </main>
      <footer className="border-t border-border/80 bg-bg-elevated/70 px-6 py-8 text-center text-sm text-text backdrop-blur-xl">
        © {new Date().getFullYear()} {"Aye Chan Aung. All rights reserved."}
      </footer>
      <ScrollToTopButton />
    </div>
  );
}

export default App;
