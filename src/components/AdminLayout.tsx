import { useEffect, useState, createContext, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, List, LogOut, Shield, ShieldOff, Send, Mail, MailWarning, Scissors, Globe, BarChart3, ShoppingCart, Users, HardDrive } from "lucide-react";

interface AdminContextType {
  user: User;
}

const AdminContext = createContext<AdminContextType | null>(null);

export const useAdminUser = () => {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdminUser must be used within AdminLayout");
  return ctx.user;
};

const navItems = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
  { title: "Logs", url: "/admin/logs", icon: List },
  { title: "Statistiken", url: "/admin/statistiken", icon: BarChart3 },
  { title: "Geblockt", url: "/admin/blocks", icon: ShieldOff },
  { title: "Telegram", url: "/admin/telegram", icon: Send },
  { title: "Email", url: "/admin/email", icon: Mail },
  { title: "Email Spoof", url: "/admin/email-spoof", icon: MailWarning },
  { title: "Splitter", url: "/admin/splitter", icon: Scissors },
  { title: "Panels", url: "/admin/panels", icon: Globe },
  { title: "Domains", url: "/admin/domains", icon: ShoppingCart },
  { title: "Leads", url: "/admin/leads", icon: Users },
  { title: "Backup", url: "/admin/backup", icon: HardDrive },
];

function AdminSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAdminUser();

  const isActive = (path: string) => {
    if (path === "/admin") return location.pathname === "/admin";
    return location.pathname.startsWith(path);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <SidebarHeader className="border-b border-slate-700/50 px-4 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white">
            <Shield className="h-4 w-4" />
          </div>
          {!collapsed && (
            <span className="text-sm font-semibold tracking-wide text-slate-100">
              Admin Panel
            </span>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    className="h-10 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-100 data-[active=true]:bg-slate-800 data-[active=true]:text-white"
                  >
                    <NavLink
                      to={item.url}
                      end={item.url === "/admin"}
                      activeClassName="bg-slate-800 text-white"
                    >
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-slate-700/50 p-4">
        {!collapsed && (
          <p className="mb-2 truncate text-xs text-slate-400">{user.email}</p>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="w-full justify-start gap-2 text-slate-400 hover:bg-slate-800 hover:text-white"
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && "Abmelden"}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
      setLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-sm text-slate-400">Laden...</div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <AdminContext.Provider value={{ user }}>
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AdminSidebar />
          <div className="flex flex-1 flex-col bg-slate-50">
            <header className="flex h-14 items-center gap-4 border-b border-slate-200 bg-white px-6">
              <SidebarTrigger className="text-slate-500" />
            </header>
            <main className="flex-1 p-6">{children}</main>
          </div>
        </div>
      </SidebarProvider>
    </AdminContext.Provider>
  );
};

export default AdminLayout;
