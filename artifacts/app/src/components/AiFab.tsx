import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import AiChat from "@/components/AiChat";

/**
 * Floating action button that opens the AI Finder as a modal from anywhere.
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

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl w-[calc(100vw-1.5rem)] h-[85dvh] md:h-[80vh] p-4 md:p-5 flex flex-col gap-0">
          <DialogHeader className="shrink-0">
            <DialogTitle className="flex items-center gap-2 text-lg">
              <Sparkles className="h-5 w-5 text-primary" /> AI Discovery
            </DialogTitle>
            <DialogDescription className="sr-only">
              Describe a movie or mood and the assistant finds it in the library.
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 min-h-0">
            <AiChat onNavigate={() => setOpen(false)} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AiFab;
