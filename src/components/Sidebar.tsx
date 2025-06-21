
import { Search, History, Settings, FileText, Database } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";

const navigationItems = [
  {
    title: "New Search",
    url: "#",
    icon: Search,
  },
  {
    title: "Search History",
    url: "#",
    icon: History,
  },
  {
    title: "Databases",
    url: "#",
    icon: Database,
  },
  {
    title: "Documentation",
    url: "#",
    icon: FileText,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
];

export function AppSidebar() {
  return (
    <Sidebar className="border-r border-gray-200 bg-gray-50/50">
      <SidebarHeader className="border-b border-gray-200 p-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-gray-900 flex items-center justify-center">
            <span className="text-white font-semibold text-sm">P</span>
          </div>
          <div>
            <h2 className="font-semibold text-gray-900 text-sm">ProteinAgent</h2>
            <p className="text-xs text-gray-500">Research Platform</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-500 font-medium text-xs uppercase tracking-wide mb-3">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="hover:bg-gray-100 text-gray-700 text-sm">
                    <a href={item.url} className="flex items-center gap-3 px-3 py-2 rounded-md">
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

export { AppSidebar as Sidebar };
