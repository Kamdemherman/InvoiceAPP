import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Euro,
  Users,
  FileText,
  Calendar
} from "lucide-react";
import { useStatistics } from "@/hooks/useStatistics";

const Reports = () => {
  const { data: stats, isLoading } = useStatistics();

  if (isLoading) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-gray-50">
          <AppSidebar />
          <main className="flex-1 p-6">
            <div className="max-w-7xl mx-auto">
              <div className="text-center py-20">
                <div className="text-lg">Chargement des statistiques...</div>
              </div>
            </div>
          </main>
        </div>
      </SidebarProvider>
    );
  }

  const currentMonth = new Date().toLocaleDateString('fr-FR', { month: 'long' });
  const lastMonthRevenue = stats.monthlyEvolution.length > 1 ? stats.monthlyEvolution[stats.monthlyEvolution.length - 2].revenue : 0;
  const growthRate = lastMonthRevenue > 0 ? 
    ((stats.monthlyRevenue - lastMonthRevenue) / lastMonthRevenue * 100) : 0;

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
                  <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                    <BarChart3 className="w-8 h-8 mr-3 text-primary-600" />
                    Statistiques & Rapports
                  </h1>
                  <p className="text-gray-600">Analyse de votre activité commerciale</p>
                </div>
              </div>
              <div className="text-sm text-gray-500 flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>Données au {new Date().toLocaleDateString('fr-FR')}</span>
              </div>
            </div>


            {/* Graphiques et analyses */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Évolution mensuelle */}
              <Card>
                <CardHeader>
                  <CardTitle>Évolution du chiffre d'affaires</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {stats.monthlyEvolution.map((month, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{month.month}</span>
                        <div className="flex items-center space-x-3">
                          <div 
                            className="bg-primary-500 h-2 rounded"
                            style={{ 
                              width: `${Math.max((month.revenue / Math.max(...stats.monthlyEvolution.map(m => m.revenue))) * 100, 5)}px`,
                              minWidth: '20px'
                            }}
                          />
                          <span className="text-sm font-medium min-w-[80px] text-right">
                            {month.revenue.toLocaleString('fr-FR')} FCFA
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Répartition par statut */}
              <Card>
                <CardHeader>
                  <CardTitle>Répartition des factures</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Payées</span>
                      <span className="text-sm text-gray-600">
                        {stats.paidInvoices} factures ({stats.paymentRate}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${stats.paymentRate}%` }}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">En attente</span>
                      <span className="text-sm text-gray-600">
                        {stats.pendingInvoices} factures
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ 
                          width: `${stats.totalInvoices > 0 ? (stats.pendingInvoices / stats.totalInvoices) * 100 : 0}%` 
                        }}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">En retard</span>
                      <span className="text-sm text-gray-600">
                        {stats.overdueInvoices} factures
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-red-600 h-2 rounded-full" 
                        style={{ 
                          width: `${stats.totalInvoices > 0 ? (stats.overdueInvoices / stats.totalInvoices) * 100 : 0}%` 
                        }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Rapports détaillés */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Top 5 Clients</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {stats.topClients.length > 0 ? stats.topClients.map((client, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div>
                          <p className="font-medium">{client.name}</p>
                          <p className="text-sm text-gray-600">#{index + 1}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{client.revenue.toFixed(0)} FCFA</p>
                        </div>
                      </div>
                    )) : (
                      <p className="text-gray-500 text-center py-4">Aucune données disponibles</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Répartition par statut</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                      <span className="font-medium text-green-800">Payées</span>
                      <span className="font-bold text-green-800">{stats.paidInvoices}</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                      <span className="font-medium text-blue-800">En attente</span>
                      <span className="font-bold text-blue-800">{stats.pendingInvoices}</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-red-50 rounded">
                      <span className="font-medium text-red-800">En retard</span>
                      <span className="font-bold text-red-800">{stats.overdueInvoices}</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="font-medium text-gray-800">Brouillons</span>
                      <span className="font-bold text-gray-800">{stats.draftInvoices}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Métriques clés</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600">Délai moyen de paiement</p>
                      <p className="text-2xl font-bold">{stats.averagePaymentDelay} jours</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Taux de paiement</p>
                      <p className="text-2xl font-bold">{stats.paymentRate}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Panier moyen</p>
                      <p className="text-2xl font-bold">{stats.averageBasket.toFixed(0)} FCFA</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Créances en retard</p>
                      <p className="text-2xl font-bold text-red-600">{stats.overdueAmount.toFixed(0)} FCFA</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Reports;