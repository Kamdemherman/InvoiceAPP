
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
                change="+12% vs mois dernier"
                changeType="positive"
                icon={Euro}
                iconColor="text-success-600"
              />
              <StatsCard
                title="CA ce mois"
                value={`${stats.monthlyRevenue.toLocaleString('fr-FR')} €`}
                change="+8% vs mois dernier"
                changeType="positive"
                icon={TrendingUp}
              />
              <StatsCard
                title="Factures en attente"
                value={stats.pendingInvoices.toString()}
                change="2 nouvelles"
                changeType="neutral"
                icon={FileText}
                iconColor="text-primary-600"
              />
              <StatsCard
                title="Clients actifs"
                value={stats.totalClients.toString()}
                change="+3 ce mois"
                changeType="positive"
                icon={Users}
                iconColor="text-blue-600"
              />
            </div>

            {/* Quick Actions and Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Urgent Actions */}
              <Card className="bg-white shadow-sm border border-gray-100">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
                    <AlertTriangle className="w-5 h-5 mr-2 text-orange-500" />
                    Actions urgentes
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm font-medium text-red-800">
                      Factures en retard
                    </p>
                    <p className="text-sm text-red-600">
                      {stats.overdueAmount.toFixed(2)} € à recouvrer
                    </p>
                  </div>
                  <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <p className="text-sm font-medium text-orange-800">
                      Rappels à envoyer
                    </p>
                    <p className="text-sm text-orange-600">
                      2 clients à relancer
                    </p>
                  </div>
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm font-medium text-blue-800">
                      Devis en attente
                    </p>
                    <p className="text-sm text-blue-600">
                      3 devis à finaliser
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Monthly Overview */}
              <Card className="lg:col-span-2 bg-white shadow-sm border border-gray-100">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">
                    Aperçu mensuel
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-600">Factures émises</p>
                        <p className="text-2xl font-bold text-gray-900">12</p>
                        <p className="text-sm text-success-600">+3 vs mois dernier</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Paiements reçus</p>
                        <p className="text-2xl font-bold text-gray-900">9</p>
                        <p className="text-sm text-success-600">75% taux de paiement</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-600">Nouveaux clients</p>
                        <p className="text-2xl font-bold text-gray-900">3</p>
                        <p className="text-sm text-blue-600">+1 vs mois dernier</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Délai moyen de paiement</p>
                        <p className="text-2xl font-bold text-gray-900">18j</p>
                        <p className="text-sm text-gray-500">-2j vs mois dernier</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
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
