import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { RecentInvoices } from "@/components/dashboard/RecentInvoices";
import { 
  Euro, 
  TrendingUp, 
  FileText, 
  Users, 
  AlertTriangle,
  Calendar
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDashboardStats } from "@/hooks/useDashboard";

const Index = () => {
  const { data: stats, isLoading } = useDashboardStats();

  if (isLoading) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-gray-50">
          <AppSidebar />
          <main className="flex-1 p-6">
            <div className="max-w-7xl mx-auto">
              <div className="text-center py-20">
                <div className="text-lg">Chargement du dashboard...</div>
              </div>
            </div>
          </main>
        </div>
      </SidebarProvider>
    );
  }

  if (!stats) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-gray-50">
          <AppSidebar />
          <main className="flex-1 p-6">
            <div className="max-w-7xl mx-auto">
              <div className="text-center py-20">
                <div className="text-lg text-red-600">Erreur lors du chargement des données</div>
              </div>
            </div>
          </main>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <SidebarTrigger className="p-2 hover:bg-gray-100 rounded-lg transition-colors" />
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                  <p className="text-gray-600">Aperçu de votre activité</p>
                </div>
              </div>
              <div className="text-sm text-gray-500 flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>{new Date().toLocaleDateString('fr-FR', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatsCard
                title="Chiffre d'affaires total"
                value={`${stats.totalRevenue.toLocaleString('fr-FR')} €`}
  
                changeType="positive"
                icon={Euro}
                iconColor="text-success-600"
              />
              <StatsCard
                title="CA ce mois"
                value={`${stats.monthlyRevenue.toLocaleString('fr-FR')} €`}
                changeType="positive"
                icon={TrendingUp}
              />
              <StatsCard
                title="Factures en attente"
                value={stats.pendingInvoices.toString()}
                changeType="neutral"
                icon={FileText}
                iconColor="text-primary-600"
              />
              <StatsCard
                title="Clients actifs"
                value={stats.totalClients.toString()}
                changeType="positive"
                icon={Users}
                iconColor="text-blue-600"
              />
            </div>

            

            {/* Recent Invoices */}
            <RecentInvoices invoices={stats.recentInvoices} />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;
