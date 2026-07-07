import { Link } from "react-router-dom";
import { ArrowLeft, MessageCircle, Mail, FileText, ExternalLink } from "lucide-react";
import Header from "@/components/Header";
import MobileNav from "@/components/MobileNav";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const HelpPage = () => {
  const faqs = [
    {
      question: "How do I add movies to my watchlist?",
      answer: "Click the '+' button on any movie or TV show card, or use the 'Add to My List' button on the detail page. Your watchlist syncs across all devices when you're signed in.",
    },
    {
      question: "Why can't I watch certain content?",
      answer: "Some content may not have full videos available yet. You'll see a 'Coming Soon' label on episodes that aren't available. Trailers are always available for preview.",
    },
    {
      question: "How does Picture-in-Picture mode work?",
      answer: "While watching a video, click the PiP icon in the player controls. This minimizes the video to a corner so you can browse while watching. Press ESC or click the expand icon to return to full view.",
    },
    {
      question: "How do AI recommendations work?",
      answer: "Our AI analyzes your watchlist, viewing history, and preferences to suggest personalized content. The more you use the app, the better our recommendations become.",
    },
    {
      question: "Can I watch movies on this platform?",
      answer: "This is a movie discovery platform. We help you discover movies and TV shows with rich information, cast, trailers, reviews, and AI-powered recommendations — but we don't stream or download content. Save titles to My List to keep track of what you want to watch.",
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Header />
      
      <main className="pt-32 px-4">
        <div className="flex items-center gap-3 py-4">
          <Link to="/profile" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-xl font-bold">Help & Support</h1>
        </div>

        <div className="space-y-6">
          {/* Contact Options */}
          <div>
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Contact Us
            </h2>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" className="h-auto flex-col gap-2 p-4">
                <MessageCircle className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">Live Chat</span>
                <span className="text-[10px] text-muted-foreground">Available 24/7</span>
              </Button>
              <Button variant="outline" className="h-auto flex-col gap-2 p-4">
                <Mail className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">Email</span>
                <span className="text-[10px] text-muted-foreground">support@flickforge.com</span>
              </Button>
            </div>
          </div>

          {/* FAQs */}
          <div>
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Frequently Asked Questions
            </h2>
            <Accordion type="single" collapsible className="space-y-1">
              {faqs.map((faq, idx) => (
                <AccordionItem key={idx} value={`faq-${idx}`} className="bg-card rounded-lg border-0">
                  <AccordionTrigger className="px-3 py-3 text-sm font-medium hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="px-3 pb-3 text-xs text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* Additional Resources */}
          <div>
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Resources
            </h2>
            <div className="space-y-1">
              <Button variant="outline" className="w-full justify-between h-auto p-3">
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4" />
                  <span className="text-sm">Terms of Service</span>
                </div>
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
              </Button>
              <Button variant="outline" className="w-full justify-between h-auto p-3">
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4" />
                  <span className="text-sm">Community Guidelines</span>
                </div>
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
              </Button>
            </div>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            App Version 1.0.0 • © 2025 FlickForge
          </p>
        </div>
      </main>

      <MobileNav />
    </div>
  );
};

export default HelpPage;
