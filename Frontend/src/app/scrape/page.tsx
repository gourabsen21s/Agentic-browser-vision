import { BackgroundBeams } from "@/components/ui/background-beams";
import ScrapeChat from "@/components/ScrapeChat";
import ScrapeNavbar from "@/components/ScrapeNavbar";

export default function ScrapePage() {
  return (
    <main className="relative min-h-screen bg-background overflow-hidden transition-colors duration-300">
      <BackgroundBeams />
      <ScrapeNavbar />
      <ScrapeChat />
    </main>
  );
}

