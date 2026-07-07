import { Bell, Film, Star } from "lucide-react";
import Header from "@/components/Header";
import MobileNav from "@/components/MobileNav";

const notifications = [
  { id: 1, icon: Star, title: "New Release", message: "Oppenheimer is now streaming", time: "2h ago", unread: true },
  { id: 2, icon: Film, title: "Recommended", message: "Based on your history: Interstellar", time: "5h ago", unread: true },
  { id: 3, icon: Film, title: "Continue Watching", message: "Resume Inception", time: "1d ago", unread: false },
];

const NotificationsPage = () => {
  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0">
      <Header />
      
      <main className="pt-14 pb-4">
        <div className="px-4 mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Notifications</h1>
          <button className="text-xs text-primary">Mark all read</button>
        </div>

        <div className="px-4 space-y-2">
          {notifications.map((n) => (
            <div key={n.id} className={`flex items-start gap-3 p-3 rounded-md ${n.unread ? "bg-primary/10" : "bg-card"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${n.unread ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground"}`}>
                <n.icon className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="text-sm font-medium">{n.title}</p>
                  {n.unread && <span className="w-1.5 h-1.5 bg-primary rounded-full" />}
                </div>
                <p className="text-xs text-muted-foreground">{n.message}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{n.time}</p>
              </div>
            </div>
          ))}
        </div>

        {notifications.length === 0 && (
          <div className="text-center py-12">
            <Bell className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm">No notifications</p>
          </div>
        )}
      </main>

      <MobileNav />
    </div>
  );
};

export default NotificationsPage;
