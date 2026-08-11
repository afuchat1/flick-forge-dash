import { Link } from "react-router-dom";
import { ArrowLeft, Mail, Shield, FileText, Github } from "lucide-react";
import Header from "@/components/Header";
import Seo from "@/components/Seo";
import MobileNav from "@/components/MobileNav";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Can I watch or download movies here?",
    answer:
      "No. AfuChat Movies is a discovery library. We document everything about a title — synopsis, full cast and crew, budget and revenue, runtime, certification, keywords, trailers, stills, reviews and which services carry it — then link you out to the legitimate service that streams it.",
  },
  {
    question: "How do I add titles to My List?",
    answer:
      "Open any movie or show and use 'Add to My List'. You need to be signed in so the list can sync across your devices. Open My List from the bottom bar on mobile or the top navigation on desktop.",
  },
  {
    question: "Where does the information come from?",
    answer:
      "All catalogue data comes from The Movie Database (TMDB), including artwork, credits, ratings and user reviews. Streaming availability comes from TMDB's JustWatch feed and is region-specific, so a service listed may differ from what you see in your country.",
  },
  {
    question: "How do the AI recommendations work?",
    answer:
      "Engagera AI reads the titles you are looking at (or the trending list if you are browsing anonymously) and suggests related films with a short reason for each. It runs on a platform key, so it works whether or not you have an account.",
  },
  {
    question: "How do I browse the whole catalogue?",
    answer:
      "Use Browse from the navigation. You can filter by movies or TV, pick a genre, sort by popularity, rating, release date or box office, and the grid keeps loading more titles as you scroll on both mobile and desktop.",
  },
  {
    question: "Why is a title missing artwork or details?",
    answer:
      "Some entries in TMDB are incomplete, especially for very new or very obscure releases. The page will still show every field that exists and omit the rest.",
  },
];

const HelpPage = () => {
  return (
    <div className="min-h-screen bg-background pb-24 md:pb-10">
      <Seo
        title="Help & Support — AfuChat Movies"
        description="FAQs about browsing, My List, AI recommendations and data sources on AfuChat Movies."
        path="/help"
      />
      <Header />

      <main className="pt-28 md:pt-24">
        <div className="mx-auto w-full max-w-3xl px-4">
          <div className="flex items-center gap-3 py-4">
            <Link to="/settings" className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-xl md:text-2xl font-bold">Help & Support</h1>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Frequently Asked Questions
              </h2>
              <Accordion type="single" collapsible className="space-y-1">
                {faqs.map((faq, idx) => (
                  <AccordionItem key={idx} value={`faq-${idx}`} className="bg-card rounded-lg border-0 px-1">
                    <AccordionTrigger className="px-3 py-3 text-sm font-medium hover:no-underline text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="px-3 pb-3 text-xs md:text-sm text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            <div>
              <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Contact
              </h2>
              <a
                href="mailto:support@afuchat.com"
                className="flex items-center gap-3 p-3 bg-card rounded-lg hover:bg-accent transition-colors"
              >
                <Mail className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-sm font-medium">support@afuchat.com</p>
                  <p className="text-xs text-muted-foreground">We reply within a couple of business days.</p>
                </div>
              </a>
            </div>

            <div>
              <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Legal
              </h2>
              <div className="space-y-1">
                <Link to="/privacy" className="flex items-center gap-3 p-3 bg-card rounded-lg hover:bg-accent transition-colors">
                  <Shield className="h-4 w-4" />
                  <span className="text-sm">Privacy Policy</span>
                </Link>
                <Link to="/terms" className="flex items-center gap-3 p-3 bg-card rounded-lg hover:bg-accent transition-colors">
                  <FileText className="h-4 w-4" />
                  <span className="text-sm">Terms of Service</span>
                </Link>
                <a
                  href="https://github.com/afuchat1/EngageraAi"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 p-3 bg-card rounded-lg hover:bg-accent transition-colors"
                >
                  <Github className="h-4 w-4" />
                  <span className="text-sm">Engagera AI source</span>
                </a>
              </div>
            </div>

            <p className="text-xs text-muted-foreground text-center">
              AfuChat Movies · Data by TMDB · © 2026 AfuChat
            </p>
          </div>
        </div>
      </main>

      <MobileNav />
    </div>
  );
};

export default HelpPage;
