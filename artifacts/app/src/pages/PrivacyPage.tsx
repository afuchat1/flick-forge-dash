import { Link } from "react-router-dom";
import { ArrowLeft, Shield, Eye, Lock, Trash2 } from "lucide-react";
import Header from "@/components/Header";
import MobileNav from "@/components/MobileNav";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const PrivacyPage = () => {
  const [shareActivity, setShareActivity] = useState(false);
  const [personalizedAds, setPersonalizedAds] = useState(false);
  const [viewingHistory, setViewingHistory] = useState(true);

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Header />
      
      <main className="pt-32 px-4">
        <div className="flex items-center gap-3 py-4">
          <Link to="/profile" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-xl font-bold">Privacy</h1>
        </div>

        <div className="space-y-6">
          {/* Privacy Settings */}
          <div>
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Privacy Controls
            </h2>
            <div className="space-y-1">
              <div className="flex items-center justify-between p-3 bg-card rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center">
                    <Eye className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-sm font-medium">Share Viewing Activity</span>
                    <p className="text-xs text-muted-foreground">Allow friends to see what you watch</p>
                  </div>
                </div>
                <Switch checked={shareActivity} onCheckedChange={setShareActivity} />
              </div>

              <div className="flex items-center justify-between p-3 bg-card rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center">
                    <Shield className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-sm font-medium">Personalized Recommendations</span>
                    <p className="text-xs text-muted-foreground">Use viewing history for suggestions</p>
                  </div>
                </div>
                <Switch checked={personalizedAds} onCheckedChange={setPersonalizedAds} />
              </div>

              <div className="flex items-center justify-between p-3 bg-card rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center">
                    <Lock className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-sm font-medium">Save Viewing History</span>
                    <p className="text-xs text-muted-foreground">Track recently watched content</p>
                  </div>
                </div>
                <Switch checked={viewingHistory} onCheckedChange={setViewingHistory} />
              </div>
            </div>
          </div>

          {/* Data Management */}
          <div>
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Data Management
            </h2>
            <div className="space-y-1">
              <Button variant="outline" className="w-full justify-start gap-3 h-auto p-3">
                <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center">
                  <Trash2 className="h-4 w-4" />
                </div>
                <div className="text-left">
                  <span className="text-sm font-medium">Clear Viewing History</span>
                  <p className="text-xs text-muted-foreground">Remove all watched content history</p>
                </div>
              </Button>
            </div>
          </div>

          {/* Privacy Policy */}
          <div className="p-4 bg-card rounded-lg">
            <h3 className="font-medium mb-2">Privacy Policy</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              We value your privacy. Your personal data is encrypted and never shared with third parties 
              without your explicit consent. We only collect data necessary to provide and improve our services.
            </p>
            <Button variant="link" className="p-0 h-auto mt-2 text-primary text-xs">
              Read Full Privacy Policy →
            </Button>
          </div>
        </div>
      </main>

      <MobileNav />
    </div>
  );
};

export default PrivacyPage;
