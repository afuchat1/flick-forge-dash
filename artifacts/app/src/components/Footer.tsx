import { Link } from "react-router-dom";
import AtlLogo from "./AtlLogo";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card/30 py-8 md:py-10">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-4 px-4 md:flex-row">
        <div className="flex flex-col items-center gap-2 md:items-start">
          <p className="text-[11px] text-muted-foreground">
            AfuChat Movies is a discovery library. We do not stream or host video.
          </p>
          <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
            <Link to="/privacy" className="hover:text-foreground">Privacy</Link>
            <Link to="/terms" className="hover:text-foreground">Terms</Link>
            <Link to="/help" className="hover:text-foreground">Help</Link>
          </div>
        </div>

        <a
          href="https://afuchat.com"
          target="_blank"
          rel="noopener noreferrer"
          className="opacity-80 transition-opacity hover:opacity-100"
        >
          <img
            src="/atl-developed-by.svg"
            alt="Developed by ATL"
            className="h-8 w-auto md:h-9"
            loading="lazy"
          />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
