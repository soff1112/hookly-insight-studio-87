import { Home, BarChart3, Video, Wrench, Settings, HelpCircle, Send, Users, Sparkles, Lightbulb, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

const menuItems = [
  { icon: Home, label: "Dashboard", href: "/" },
  { icon: Users, label: "My Accounts", href: "/my-accounts" },
  { icon: BarChart3, label: "Competitor Analysis", href: "/competitor-analysis" },
  { icon: Video, label: "Video Analysis", href: "/video-analysis" },
  { icon: Wrench, label: "In Work", href: "/in-work" },
  { icon: Search, label: "Deep Analysis", href: "/deep-analysis" },
  { icon: Lightbulb, label: "AI Insights", href: "/ai-insights" },
  { icon: Sparkles, label: "Marketing Strategy", href: "/marketing-strategy" },
];

const bottomMenuItems = [
  { icon: Settings, label: "Settings", href: "/settings" },
];

export const Sidebar = () => {
  const location = useLocation();
  const { toast } = useToast();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const handleLogout = () => {
    setShowLogoutDialog(false);
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
  };

  return (
    <aside className="w-64 bg-card border-r border-border flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-purple flex items-center justify-center">
            <Send className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-foreground">Hookly</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Button
              key={item.label}
              variant="ghost"
              asChild
              className={`w-full justify-start gap-3 ${
                isActive
                  ? "bg-primary/10 text-primary hover:bg-primary/15"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <Link to={item.href}>
                <item.icon className="w-5 h-5" />
                <span className="flex-1 text-left">{item.label}</span>
              </Link>
            </Button>
          );
        })}

        <div className="my-4 border-t border-border" />

        {bottomMenuItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Button
              key={item.label}
              variant="ghost"
              asChild
              className={`w-full justify-start gap-3 ${
                isActive
                  ? "bg-primary/10 text-primary hover:bg-primary/15"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <Link to={item.href}>
                <item.icon className="w-5 h-5" />
                <span className="flex-1 text-left">{item.label}</span>
              </Link>
            </Button>
          );
        })}
      </nav>

      {/* Help & Support */}
      <div className="p-4 border-t border-border space-y-3">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground hover:bg-muted"
          onClick={() => window.open("https://t.me/hookly_support", "_blank")}
        >
          <HelpCircle className="w-5 h-5" />
          <span className="flex-1 text-left">Help & Support</span>
        </Button>

        {/* User Profile */}
        <div className="space-y-2">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
            <Avatar className="w-10 h-10">
              <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sofiia" />
              <AvatarFallback>SD</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-foreground">Sofiia D</div>
              <div className="text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-semibold">
                  PRO
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Dialog */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to log out?</AlertDialogTitle>
            <AlertDialogDescription>
              You'll need to sign in again to access your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout} className="bg-destructive hover:bg-destructive/90">
              Log out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </aside>
  );
};
