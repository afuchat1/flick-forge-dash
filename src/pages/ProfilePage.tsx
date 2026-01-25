import { User, Settings, CreditCard, Bell, Shield, LogOut, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import MobileNav from "@/components/MobileNav";

const menuItems = [
  { icon: User, label: "Account", description: "Manage your account settings", href: "/profile" },
  { icon: Bell, label: "Notifications", description: "Configure alerts and updates", href: "/notifications" },
  { icon: CreditCard, label: "Subscription", description: "Free plan", href: "/profile" },
  { icon: Shield, label: "Privacy & Security", description: "Manage your data", href: "/profile" },
  { icon: Settings, label: "Preferences", description: "App settings and display", href: "/profile" },
];

const ProfilePage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20 pb-24 md:pb-16">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-2xl">
          {/* Profile Header */}
          <div className="text-center py-8">
            <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4">
              <User className="h-12 w-12 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold">Guest User</h1>
            <p className="text-muted-foreground">Free Account</p>
            <div className="mt-4 flex justify-center gap-3">
              <Button>Sign Up</Button>
              <Button variant="secondary">Log In</Button>
            </div>
          </div>

          {/* Menu Items */}
          <div className="space-y-2 mt-8">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className="flex items-center gap-4 p-4 rounded-xl bg-card hover:bg-secondary/50 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                  <item.icon className="h-5 w-5 text-foreground" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{item.label}</p>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </Link>
            ))}
          </div>

          {/* Logout */}
          <button className="flex items-center gap-4 p-4 rounded-xl w-full mt-8 text-destructive hover:bg-destructive/10 transition-colors">
            <div className="w-10 h-10 rounded-full bg-destructive/20 flex items-center justify-center">
              <LogOut className="h-5 w-5" />
            </div>
            <span className="font-medium">Log Out</span>
          </button>

          {/* App Info */}
          <div className="mt-12 text-center text-sm text-muted-foreground">
            <p>AfuChat Movies v1.0.0</p>
            <p className="mt-1">© 2024 AfuChat Movies. All rights reserved.</p>
          </div>
        </div>
      </main>

      <MobileNav />
    </div>
  );
};

export default ProfilePage;
