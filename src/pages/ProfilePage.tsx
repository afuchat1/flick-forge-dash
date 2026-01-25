import { User, Settings, Bell, Shield, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import MobileNav from "@/components/MobileNav";

const ProfilePage = () => {
  const menuItems = [
    { icon: User, label: "Account", href: "/profile" },
    { icon: Bell, label: "Notifications", href: "/notifications" },
    { icon: Shield, label: "Privacy", href: "/profile" },
    { icon: Settings, label: "Settings", href: "/profile" },
  ];

  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0">
      <Header />
      
      <main className="pt-14 pb-4">
        <div className="px-4">
          {/* Profile Header */}
          <div className="text-center py-6">
            <div className="w-16 h-16 mx-auto rounded-full bg-primary flex items-center justify-center mb-3">
              <User className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-lg font-bold">Guest User</h1>
            <p className="text-xs text-muted-foreground">Free Account</p>
            <div className="flex justify-center gap-2 mt-3">
              <Button size="sm">Sign Up</Button>
              <Button size="sm" variant="secondary">Log In</Button>
            </div>
          </div>

          {/* Menu */}
          <div className="space-y-1 mt-4">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className="flex items-center justify-between p-3 bg-card rounded-md"
              >
                <div className="flex items-center gap-3">
                  <item.icon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{item.label}</span>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            ))}
          </div>

          {/* App Info */}
          <div className="text-center mt-8 text-xs text-muted-foreground">
            <p>AfuChat Movies v1.0</p>
            <p className="mt-1">© 2024 AfuChat Movies</p>
          </div>
        </div>
      </main>

      <MobileNav />
    </div>
  );
};

export default ProfilePage;
