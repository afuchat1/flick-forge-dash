import { Link, useLocation } from "react-router-dom";
import { Sparkles } from "lucide-react";

/**
 * Floating action button that opens the AI Finder from anywhere.
 * Hidden while already on the AI Finder page.
 */
const AiFab = () => {
  const location = useLocation();
  if (location.pathname === "/ai") return null;

  return (
    <Link
      to="/ai"
      aria-label="Open AI Finder"
      className="fixed right-4 z-50 flex items-center gap-2 rounded-full bg-primary px-4 py-3 text-primary-foreground shadow-lg shadow-primary/30 ring-1 ring-primary/40 transition-transform hover:scale-105 active:scale-95 bottom-20 md:bottom-6"
      style={{ marginBottom: "env(safe-area-inset-bottom)" }}
    >
      <Sparkles className="h-5 w-5" strokeWidth={2.2} />
      <span className="hidden sm:inline text-sm font-semibold">AI Finder</span>
    </Link>
  );
};

export default AiFab;
