import { Link } from "react-router-dom";
import { ArrowLeft, Trash2, Loader2 } from "lucide-react";
import Header from "@/components/Header";
import Seo from "@/components/Seo";
import MobileNav from "@/components/MobileNav";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";
import { toast } from "sonner";

const sections = [
  {
    title: "What we collect",
    body: "If you create an account we store your email address and the account identifier issued by our authentication provider. When signed in we also store the titles you save to My List and the titles you open (recently viewed), so those lists follow you across devices. If you browse without an account, we store nothing about you.",
  },
  {
    title: "What we do not collect",
    body: "We do not track viewing or playback — AfuChat Movies never streams or downloads video, so there is no watch history to record. We do not sell data, run advertising profiles, or share your lists with other users.",
  },
  {
    title: "Third-party data",
    body: "Title metadata, artwork, cast, ratings, reviews and streaming availability are supplied by The Movie Database (TMDB) and its JustWatch availability feed. AI features are processed by Engagera AI (engagera.afuchat.com) using only the title or prompt text needed to generate a suggestion — your account identity is not sent.",
  },
  {
    title: "Storage and security",
    body: "Your data is stored in our managed backend with row-level security, meaning only your own account can read or write your saved lists. Traffic is encrypted in transit over HTTPS.",
  },
  {
    title: "Your controls",
    body: "You can remove any title from My List at any time, clear your recently viewed list below, or sign out. To have your account and all associated rows deleted, email support@afuchat.com from the address on the account and we will action it.",
  },
  {
    title: "Contact",
    body: "Questions about this policy can be sent to support@afuchat.com.",
  },
];

const PrivacyPage = () => {
  const { user } = useAuth();
  const { recentlyViewed, clearRecentlyViewed, isClearing } = useRecentlyViewed();

  const handleClear = () => {
    clearRecentlyViewed(undefined, {
      onSuccess: () => toast.success("Recently viewed cleared"),
      onError: () => toast.error("Could not clear recently viewed"),
    });
  };

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-10">
      <Seo
        title="Privacy Policy — AfuChat Movies"
        description="How AfuChat Movies collects, stores and protects your data as a movie discovery library."
        path="/privacy"
      />
      <Header />

      <main className="pt-28 md:pt-24">
        <div className="mx-auto w-full max-w-3xl px-4">
          <div className="flex items-center gap-3 py-4">
            <Link to="/settings" className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-xl md:text-2xl font-bold">Privacy Policy</h1>
          </div>
          <p className="text-xs text-muted-foreground mb-6">Last updated 11 August 2026</p>

          <div className="space-y-5">
            {sections.map((s) => (
              <section key={s.title} className="p-4 bg-card rounded-lg">
                <h2 className="text-sm font-semibold mb-1.5">{s.title}</h2>
                <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">{s.body}</p>
              </section>
            ))}

            {user && (
              <section className="p-4 bg-card rounded-lg">
                <h2 className="text-sm font-semibold mb-1.5">Your data</h2>
                <p className="text-xs md:text-sm text-muted-foreground leading-relaxed mb-3">
                  You currently have {recentlyViewed.length} recently viewed{" "}
                  {recentlyViewed.length === 1 ? "title" : "titles"} stored.
                </p>
                <Button
                  variant="outline"
                  className="gap-2"
                  disabled={isClearing || recentlyViewed.length === 0}
                  onClick={handleClear}
                >
                  {isClearing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                  Clear recently viewed
                </Button>
              </section>
            )}
          </div>
        </div>
      </main>

      <MobileNav />
    </div>
  );
};

export default PrivacyPage;
