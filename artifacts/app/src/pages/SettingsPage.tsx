import { Link } from "react-router-dom";
import { ArrowLeft, Globe, Shield, HelpCircle, ChevronRight, Sparkles, Check, FileText, Database } from "lucide-react";
import Header from "@/components/Header";
import Seo from "@/components/Seo";
import MobileNav from "@/components/MobileNav";
import { useAuth } from "@/hooks/useAuth";
import { hasEngagera } from "@/lib/engagera";

const SettingsPage = () => {
  const { user } = useAuth();
  const engageraConnected = hasEngagera();

  const links = [
    { icon: Shield, label: "Privacy & Data", description: "How your data is handled", href: "/privacy" },
    { icon: FileText, label: "Terms of Service", description: "Rules for using AfuChat Movies", href: "/terms" },
    { icon: HelpCircle, label: "Help & Support", description: "FAQs and contact", href: "/help" },
  ];

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-10">
      <Seo title="Settings — AfuChat Movies" description="Manage your AfuChat Movies account, data sources and support options." path="/settings" />
      <Header />

      <main className="pt-28 md:pt-24">
        <div className="mx-auto w-full max-w-3xl px-4">
          <div className="flex items-center gap-3 py-4">
            <Link to="/profile" className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-xl md:text-2xl font-bold">Settings</h1>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                AI (Engagera)
              </h2>
              <div className="p-4 bg-card rounded-lg space-y-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Engagera AI</span>
                  <span className={`ml-auto inline-flex items-center gap-1 text-xs ${engageraConnected ? "text-emerald-400" : "text-muted-foreground"}`}>
                    {engageraConnected ? (<><Check className="h-3 w-3" /> Active</>) : "Unavailable"}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Recommendations, mood matching and smart search are powered by Engagera AI (AfuBot) on a single
                  platform key — available to everyone, no account or personal key needed. Learn more at{" "}
                  <a href="https://engagera.afuchat.com" target="_blank" rel="noreferrer" className="text-primary underline">
                    engagera.afuchat.com
                  </a>{" "}
                  (source:{" "}
                  <a href="https://github.com/afuchat1/EngageraAi" target="_blank" rel="noreferrer" className="text-primary underline">
                    afuchat1/EngageraAi
                  </a>
                  ).
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Catalogue Data
              </h2>
              <div className="p-4 bg-card rounded-lg space-y-2">
                <div className="flex items-center gap-2">
                  <Database className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">The Movie Database (TMDB)</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  All titles, artwork, cast, crew, ratings, reviews and where-to-watch availability come from TMDB and
                  its JustWatch provider data. AfuChat Movies is a discovery library — it does not host, stream or
                  download any video.
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Globe className="h-3 w-3" /> Region for availability: United States (US)
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Legal & Support
              </h2>
              <div className="space-y-1">
                {links.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className="flex items-center gap-3 p-3 bg-card rounded-lg hover:bg-accent transition-colors"
                  >
                    <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center">
                      <item.icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <span className="text-sm font-medium">{item.label}</span>
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {user && (
            <p className="text-xs text-muted-foreground text-center mt-8">Signed in as {user.email}</p>
          )}
        </div>
      </main>

      <MobileNav />
    </div>
  );
};

export default SettingsPage;
