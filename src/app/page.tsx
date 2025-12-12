import GridScanWrapper from "@/components/GridScanWrapper";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";

export default function Home() {
  return (
    <main className="relative min-h-screen flex flex-col bg-[#0a0a0f]">
      <GridScanWrapper />
      <div className="relative z-10 flex flex-col min-h-screen pointer-events-none">
        <Navbar />
        <Hero />
        </div>
      </main>
  );
}
