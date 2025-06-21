import { Search, History, Settings, FileText, Database, User } from "lucide-react";
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
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Card, CardContent } from "@/components/ui/card";

interface AppSidebarProps {
  onNewSearch?: () => void;
}

const navigationItems = [
  {
    title: "New Search",
    url: "#",
    icon: Search,
    action: "new-search",
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

export function AppSidebar({ onNewSearch }: AppSidebarProps) {
  const handleItemClick = (item: typeof navigationItems[0], e: React.MouseEvent) => {
    e.preventDefault();
    if (item.action === "new-search" && onNewSearch) {
      onNewSearch();
    }
  };

  return (
    <Sidebar className="border-r border-gray-200 bg-gray-50/50">
      <SidebarHeader className="border-b border-gray-200 p-6">
        <div className="flex items-center gap-3">
          <img 
            src="/logo.png" 
            alt="FoldSearch Logo" 
            className="w-8 h-8 rounded object-contain"
          />
          <div>
            <h2 className="font-semibold text-gray-900 text-sm">FoldSearch</h2>
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
                    <a 
                      href={item.url} 
                      className="flex items-center gap-3 px-3 py-2 rounded-md"
                      onClick={(e) => handleItemClick(item, e)}
                    >
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
      <SidebarFooter className="p-4">
        <Card className="bg-white/50 border-gray-200">
          <CardContent className="p-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">Anindyadeep</p>
                <p className="text-xs text-gray-500 truncate">anindya@litefold.in</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </SidebarFooter>
    </Sidebar>
  );
}

export { AppSidebar as Sidebar };
