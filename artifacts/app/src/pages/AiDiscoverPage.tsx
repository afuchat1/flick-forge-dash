import { Sparkles } from "lucide-react";
import Header from "@/components/Header";
import Seo from "@/components/Seo";
import MobileNav from "@/components/MobileNav";
import AiChat from "@/components/AiChat";

const AiDiscoverPage = () => {
  return (
    <div className="min-h-screen bg-background pb-24 md:pb-0">
      <Seo
        title="AI Movie Finder — Describe It, Discover It | AfuChat Movies"
        description="Describe a plot, a scene, a mood or a half-remembered detail and our AI finds the exact movie or series, with full details from the library."
        path="/ai"
      />
      <Header />

      <main className="pt-28 md:pt-24">
        <div className="mx-auto w-full max-w-4xl px-3 md:px-6 flex flex-col h-[calc(100dvh-7rem)] md:h-[calc(100dvh-6rem)]">
          <div className="flex items-center gap-2 py-4 shrink-0">
            <Sparkles className="h-5 w-5 text-primary" />
            <h1 className="text-xl md:text-3xl font-bold">AI Discovery</h1>
          </div>
          <div className="flex-1 min-h-0">
            <AiChat />
          </div>
        </div>
      </main>

      <MobileNav />
    </div>
  );
};

export default AiDiscoverPage;
