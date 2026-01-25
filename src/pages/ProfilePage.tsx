import { User, Settings, Bell, Download, History, ChevronRight, LogOut, HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import MobileNav from "@/components/MobileNav";

const ProfilePage = () => {
  const menuItems = [
    { icon: Bell, label: "Notifications", href: "/notifications" },
    { icon: Download, label: "Downloads", href: "/my-list" },
    { icon: History, label: "Watch History", href: "/my-list" },
    { icon: Settings, label: "Settings", href: "/profile" },
    { icon: HelpCircle, label: "Help Center", href: "/profile" },
  ];

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Header />
      
      <main className="pt-14">
        <div className="px-3">
          {/* Profile Header */}
          <div className="text-center py-6">
            <div className="w-20 h-20 mx-auto rounded-full bg-primary/20 flex items-center justify-center mb-3">
              <User className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-lg font-bold">Guest User</h1>
            <p className="text-xs text-muted-foreground mb-3">Sign in to sync your data</p>
            <div className="flex justify-center gap-2">
              <Button size="sm" className="h-8">Sign Up</Button>
              <Button size="sm" variant="secondary" className="h-8">Log In</Button>
            </div>
          </div>

          {/* Menu */}
          <div className="bg-card rounded-lg overflow-hidden">
            {menuItems.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.label}
                  to={item.href}
                  className={`flex items-center justify-between p-3 ${
                    index !== menuItems.length - 1 ? "border-b border-border" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <IconComponent className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm">{item.label}</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              );
            })}
          </div>

          {/* Sign Out */}
          <button className="w-full flex items-center justify-center gap-2 p-3 bg-card rounded-lg text-destructive mt-4">
            <LogOut className="h-5 w-5" />
            <span className="text-sm font-medium">Sign Out</span>
          </button>

          {/* App Info */}
          <div className="text-center mt-6 text-xs text-muted-foreground">
            <p>AfuChat Movies v1.0.0</p>
          </div>
        </div>
      </main>

      <MobileNav />
    </div>
  );
};

export default ProfilePage;
