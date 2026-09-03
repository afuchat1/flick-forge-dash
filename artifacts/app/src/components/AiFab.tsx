import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Sparkles, X } from "lucide-react";
import AiChat from "@/components/AiChat";

/**
 * Floating action button (bottom) that opens the AI Finder as a tall
 * stretched side panel on the right edge of the screen.
 * Hidden while already on the AI Finder page.
 */
const AiFab = () => {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  if (location.pathname === "/ai") return null;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Open AI Finder"
        className="fixed right-4 z-50 flex items-center gap-2 rounded-full bg-primary px-4 py-3 text-primary-foreground shadow-lg shadow-primary/30 ring-1 ring-primary/40 transition-transform hover:scale-105 active:scale-95 bottom-20 md:bottom-6"
        style={{ marginBottom: "env(safe-area-inset-bottom)" }}
      >
        <Sparkles className="h-5 w-5" strokeWidth={2.2} />
        <span className="hidden sm:inline text-sm font-semibold">AI Finder</span>
      </button>

      {open && (
        <>
          <button
            aria-label="Close AI Finder"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />
          <aside
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-[360px] flex-col bg-background/95 backdrop-blur-xl shadow-2xl shadow-black/40 ring-1 ring-border/40 animate-in slide-in-from-right duration-200"
            style={{ paddingRight: "env(safe-area-inset-right)" }}
            aria-label="AI Finder panel"
          >
            <div className="flex items-center justify-between gap-3 border-b border-border/40 px-4 py-3 shrink-0">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <h2 className="text-base font-semibold">AI Discovery</h2>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close panel"
                className="rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 min-h-0 overflow-hidden px-4 pb-4">
              <AiChat onNavigate={() => setOpen(false)} />
            </div>
          </aside>
        </>
      )}
    </>
  );
};

export default AiFab;
