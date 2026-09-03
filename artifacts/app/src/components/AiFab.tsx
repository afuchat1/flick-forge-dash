import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import AiChat from "@/components/AiChat";

/**
 * Vertical floating action bar that opens the AI Finder as a modal from anywhere.
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
        className="fixed right-0 top-1/2 z-50 -translate-y-1/2 translate-x-0 flex flex-col items-center justify-center gap-3 rounded-l-2xl bg-primary px-2 py-6 text-primary-foreground shadow-xl shadow-primary/30 ring-1 ring-primary/40 transition-all hover:pr-4 hover:shadow-primary/50 active:scale-95"
        style={{
          width: "44px",
          minHeight: "140px",
          marginRight: "env(safe-area-inset-right)",
        }}
      >
        <Sparkles className="h-5 w-5 shrink-0" strokeWidth={2.2} />
        <span
          className="text-[11px] font-semibold uppercase tracking-widest leading-tight"
          style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
        >
          AI Finder
        </span>
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
