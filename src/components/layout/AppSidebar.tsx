
import {
  LayoutDashboard,
  Users,
  Package,
  FileText,
  CreditCard,
  BarChart3,
  Settings,
  Plus
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const mainMenuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Clients",
    url: "/clients",
    icon: Users,
  },
  {
    title: "Produits/Services",
    url: "/products",
    icon: Package,
  },
  {
    title: "Factures",
    url: "/invoices",
    icon: FileText,
  },
  {
    title: "Paiements",
    url: "/payments",
    icon: CreditCard,
  },
];

const reportMenuItems = [
  {
    title: "Statistiques",
    url: "/reports",
    icon: BarChart3,
  },
  {
    title: "Paramètres",
    url: "/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  return (
    <Sidebar className="border-r border-gray-200 bg-white">
      <SidebarHeader className="p-6 border-b border-gray-100">
        <div className="flex items-center space-x-3 mb-4">
           <img 
        src="https://res.cloudinary.com/dh0ymxrfe/image/upload/v1751978047/jes2ic5phx8rga4kthsr.png" 
        alt="Logo Invoice App" 
        className="w-10 h-10" 
      />
          <div>
            <h1 className="text-lg font-bold text-gray-900">FacturEZ</h1>
            <p className="text-sm text-gray-500">Gestion de Facturation</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {mainMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className="w-full justify-start px-3 py-2 text-sm font-medium rounded-lg hover:bg-primary-50 hover:text-primary-700 transition-all duration-200"
                  >
                    <a href={item.url} className="flex items-center space-x-3">
                      <item.icon className="w-5 h-5" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-8">
          <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Gestion
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {reportMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className="w-full justify-start px-3 py-2 text-sm font-medium rounded-lg hover:bg-primary-50 hover:text-primary-700 transition-all duration-200"
                  >
                    <a href={item.url} className="flex items-center space-x-3">
                      <item.icon className="w-5 h-5" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-gray-100">
        <div className="text-xs text-gray-500 text-center">
          Version 1.0.0
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
