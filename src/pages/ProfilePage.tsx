import { useNavigate, Link } from "react-router-dom";
import { User, Settings, LogOut, ChevronRight, Download, Heart, Bell, Shield, HelpCircle, ShieldCheck } from "lucide-react";
import Header from "@/components/Header";
import MobileNav from "@/components/MobileNav";
import { useAuth } from "@/hooks/useAuth";
import { useWatchlist } from "@/hooks/useWatchlist";
import { useDownloads } from "@/hooks/useDownloads";
import { useUserRole } from "@/hooks/useUserRole";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useEffect } from "react";
import { toast } from "sonner";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, loading, signOut } = useAuth();
  const { watchlist } = useWatchlist();
  const { downloads } = useDownloads();
  const { isAdmin } = useUserRole();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast.error("Failed to sign out");
    } else {
      toast.success("Signed out successfully");
      navigate("/auth");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
    );
  }

  if (!user) return null;

  const menuItems = [
    { icon: Heart, label: "My List", count: watchlist.length, href: "/my-list" },
    { icon: Download, label: "Downloads", count: downloads.length, href: "/downloads" },
    { icon: Bell, label: "Notifications", href: "/notifications" },
    { icon: Settings, label: "Settings", href: "/settings" },
    { icon: Shield, label: "Privacy", href: "/privacy" },
    { icon: HelpCircle, label: "Help & Support", href: "/help" },
  ];

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Header />
      
      <main className="pt-14">
        {/* Profile Header */}
        <div className="px-4 py-6 text-center">
          <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-primary/20 flex items-center justify-center">
            <User className="h-10 w-10 text-primary" />
          </div>
          <div className="flex items-center justify-center gap-2 mb-1">
            <h1 className="text-lg font-bold">{user.email}</h1>
            {isAdmin && (
              <Badge className="bg-primary text-primary-foreground text-[10px]">Admin</Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground">Member since {new Date(user.created_at).toLocaleDateString()}</p>
        </div>

        {/* Stats */}
        <div className="px-4 mb-4">
          <div className="flex gap-4 justify-center">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{watchlist.length}</p>
              <p className="text-xs text-muted-foreground">In My List</p>
            </div>
            <div className="w-px bg-border" />
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{downloads.length}</p>
              <p className="text-xs text-muted-foreground">Downloads</p>
            </div>
          </div>
        </div>

        {/* Admin Dashboard Link */}
        {isAdmin && (
          <div className="px-3 mb-2">
            <Link
              to="/admin"
              className="flex items-center gap-3 p-3 bg-gradient-to-r from-primary/20 to-primary/10 border border-primary/30 rounded-lg"
            >
              <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center">
                <ShieldCheck className="h-4 w-4 text-primary" />
              </div>
              <span className="flex-1 text-sm font-medium text-primary">Admin Dashboard</span>
              <ChevronRight className="h-4 w-4 text-primary" />
            </Link>
          </div>
        )}

        {/* Menu Items */}
        <div className="px-3 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className="flex items-center gap-3 p-3 bg-card rounded-lg"
            >
              <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center">
                <item.icon className="h-4 w-4" />
              </div>
              <span className="flex-1 text-sm font-medium">{item.label}</span>
              {item.count !== undefined && (
                <span className="text-xs text-muted-foreground">{item.count}</span>
              )}
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Link>
          ))}
        </div>

        {/* Sign Out Button */}
        <div className="px-3 mt-4">
          <Button
            variant="outline"
            className="w-full justify-start gap-3 h-12"
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4 text-destructive" />
            <span className="text-destructive">Sign Out</span>
          </Button>
        </div>
      </main>

      <MobileNav />
    </div>
  );
};

export default ProfilePage;
