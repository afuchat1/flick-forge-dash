import { Bell, Check, Film, Star, Sparkles } from "lucide-react";
import Header from "@/components/Header";
import MobileNav from "@/components/MobileNav";

const notifications = [
  { id: 1, icon: Sparkles, title: "New Release!", message: "Oppenheimer is now streaming", time: "2 hours ago", unread: true },
  { id: 2, icon: Film, title: "Recommended for You", message: "Based on your watch history: Interstellar", time: "5 hours ago", unread: true },
  { id: 3, icon: Star, title: "Top Rated", message: "The Shawshank Redemption is trending", time: "1 day ago", unread: false },
  { id: 4, icon: Film, title: "Continue Watching", message: "Resume Inception where you left off", time: "2 days ago", unread: false },
];

const NotificationsPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20 pb-24 md:pb-16">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-2xl">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-extrabold">Notifications</h1>
              <p className="text-muted-foreground">Stay updated with new releases</p>
            </div>
            <button className="text-sm text-primary font-medium hover:underline">
              Mark all read
            </button>
          </div>

          {/* Notifications List */}
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`flex items-start gap-4 p-4 rounded-xl transition-colors ${
                  notification.unread ? "bg-primary/10" : "bg-card"
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  notification.unread ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground"
                }`}>
                  <notification.icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{notification.title}</p>
                    {notification.unread && (
                      <span className="w-2 h-2 bg-primary rounded-full" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">{notification.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {notifications.length === 0 && (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto rounded-full bg-muted flex items-center justify-center mb-4">
                <Bell className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No notifications</h3>
              <p className="text-muted-foreground">We'll notify you about new releases</p>
            </div>
          )}
        </div>
      </main>

      <MobileNav />
    </div>
  );
};

export default NotificationsPage;
