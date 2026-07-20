import { Link } from "react-router-dom";
import { ArrowLeft, Bell, Shield, Globe, HelpCircle, ChevronRight, Sparkles, Check } from "lucide-react";
import Header from "@/components/Header";
import MobileNav from "@/components/MobileNav";
import { useAuth } from "@/hooks/useAuth";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getStoredEngageraKey, setEngageraApiKey, hasEngagera } from "@/lib/engagera";
import { toast } from "sonner";

const SettingsPage = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [autoplay, setAutoplay] = useState(true);
  const [hdStreaming, setHdStreaming] = useState(true);
  const [engageraKey, setLocalEngageraKey] = useState(getStoredEngageraKey());
  const [engageraConnected, setEngageraConnected] = useState(hasEngagera());

  const saveEngageraKey = () => {
    setEngageraApiKey(engageraKey);
    setEngageraConnected(hasEngagera());
    toast.success(engageraKey.trim() ? "Engagera AI connected" : "Engagera AI key cleared");
  };


  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const settingsGroups: Array<{ title: string; items: any[] }> = [
    {
      title: "Account",
      items: [
        { icon: Bell, label: "Notifications", toggle: true, value: notifications, onChange: setNotifications },
      ],
    },
    {
      title: "Preferences",
      items: [
        { icon: Globe, label: "Language & Region", description: "English (US)" },
      ],
    },
    {
      title: "Playback",
      items: [
        { label: "Autoplay Next Episode", toggle: true, value: autoplay, onChange: setAutoplay },
        { label: "HD Streaming on Mobile", toggle: true, value: hdStreaming, onChange: setHdStreaming },
      ],
    },
    {
      title: "Support",
      items: [
        { icon: Shield, label: "Privacy Policy", href: "/privacy" },
        { icon: HelpCircle, label: "Help & Support", href: "/help" },
      ],
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
          <h1 className="text-xl font-bold">Settings</h1>
        </div>

        <div className="space-y-6">
          {/* Engagera AI Setup */}
          <div>
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              AI (Engagera)
            </h2>
            <div className="p-4 bg-card rounded-lg space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Engagera API Key</span>
                {engageraConnected && (
                  <span className="ml-auto inline-flex items-center gap-1 text-xs text-emerald-400">
                    <Check className="h-3 w-3" /> Connected
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                All AI recommendations, mood matches, and search suggestions are powered by Engagera AI (AfuBot). Paste your key from{" "}
                <a href="https://engagera.com/dashboard" target="_blank" rel="noreferrer" className="text-primary underline">
                  engagera.com/dashboard
                </a>
                . Stored only in this browser.
              </p>
              <div className="flex gap-2">
                <Input
                  type="password"
                  placeholder="eng_..."
                  value={engageraKey}
                  onChange={(e) => setLocalEngageraKey(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={saveEngageraKey} size="sm">Save</Button>
              </div>
            </div>
          </div>


          {settingsGroups.map((group) => (
            <div key={group.title}>
              <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                {group.title}
              </h2>
              <div className="space-y-1">
                {group.items.map((item, idx) => (
                  <div key={idx}>
                    {item.toggle ? (
                      <div className="flex items-center justify-between p-3 bg-card rounded-lg">
                        <div className="flex items-center gap-3">
                          {item.icon && (
                            <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center">
                              <item.icon className="h-4 w-4" />
                            </div>
                          )}
                          <span className="text-sm font-medium">{item.label}</span>
                        </div>
                        <Switch
                          checked={item.value}
                          onCheckedChange={item.onChange}
                        />
                      </div>
                    ) : item.href ? (
                      <Link
                        to={item.href}
                        className="flex items-center gap-3 p-3 bg-card rounded-lg hover:bg-accent transition-colors"
                      >
                        {item.icon && (
                          <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center">
                            <item.icon className="h-4 w-4" />
                          </div>
                        )}
                        <div className="flex-1">
                          <span className="text-sm font-medium">{item.label}</span>
                          {item.description && (
                            <p className="text-xs text-muted-foreground">{item.description}</p>
                          )}
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </Link>
                    ) : (
                      <div className="flex items-center gap-3 p-3 bg-card rounded-lg">
                        {item.icon && (
                          <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center">
                            <item.icon className="h-4 w-4" />
                          </div>
                        )}
                        <div className="flex-1">
                          <span className="text-sm font-medium">{item.label}</span>
                          {item.description && (
                            <p className="text-xs text-muted-foreground">{item.description}</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {user && (
          <p className="text-xs text-muted-foreground text-center mt-8">
            Signed in as {user.email}
          </p>
        )}
      </main>

      <MobileNav />
    </div>
  );
};

export default SettingsPage;
