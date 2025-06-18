
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
import { mockDashboardStats, mockInvoices, mockPayments } from "@/data/mockData";

const Reports = () => {
  const stats = mockDashboardStats;
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  // Calculs pour les statistiques
  const monthlyPayments = mockPayments.filter(payment => 
    payment.date.getMonth() === currentMonth && payment.date.getFullYear() === currentYear
  ).reduce((acc, payment) => acc + payment.amount, 0);
  
  const lastMonthPayments = mockPayments.filter(payment => 
    payment.date.getMonth() === currentMonth - 1 && payment.date.getFullYear() === currentYear
  ).reduce((acc, payment) => acc + payment.amount, 0);
  
  const growthRate = lastMonthPayments > 0 ? 
    ((monthlyPayments - lastMonthPayments) / lastMonthPayments * 100) : 0;

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

            {/* Principales métriques */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Chiffre d'affaires total</CardTitle>
                  <Euro className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalRevenue.toLocaleString('fr-FR')} €</div>
                  <p className="text-xs text-muted-foreground">
                    {growthRate > 0 ? '+' : ''}{growthRate.toFixed(1)}% vs mois dernier
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">CA ce mois</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{monthlyPayments.toLocaleString('fr-FR')} €</div>
                  <p className="text-xs text-muted-foreground">
                    {growthRate > 0 ? 
                      <span className="text-green-600 flex items-center">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        +{growthRate.toFixed(1)}%
                      </span> :
                      <span className="text-red-600 flex items-center">
                        <TrendingDown className="w-3 h-3 mr-1" />
                        {growthRate.toFixed(1)}%
                      </span>
                    }
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Clients actifs</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalClients}</div>
                  <p className="text-xs text-muted-foreground">
                    +3 nouveaux ce mois
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Factures émises</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockInvoices.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.pendingInvoices} en attente
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Graphiques et analyses */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Évolution mensuelle */}
              <Card>
                <CardHeader>
                  <CardTitle>Évolution du chiffre d'affaires</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">Graphique d'évolution</p>
                      <p className="text-sm text-gray-400">À implémenter avec Recharts</p>
                    </div>
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
                        {mockInvoices.filter(inv => inv.status === 'paid').length} factures
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ 
                          width: `${(mockInvoices.filter(inv => inv.status === 'paid').length / mockInvoices.length) * 100}%` 
                        }}
                      ></div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">En attente</span>
                      <span className="text-sm text-gray-600">
                        {mockInvoices.filter(inv => inv.status === 'sent').length} factures
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ 
                          width: `${(mockInvoices.filter(inv => inv.status === 'sent').length / mockInvoices.length) * 100}%` 
                        }}
                      ></div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">En retard</span>
                      <span className="text-sm text-gray-600">
                        {mockInvoices.filter(inv => inv.status === 'overdue').length} factures
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-red-600 h-2 rounded-full" 
                        style={{ 
                          width: `${(mockInvoices.filter(inv => inv.status === 'overdue').length / mockInvoices.length) * 100}%` 
                        }}
                      ></div>
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
                    {[1, 2, 3, 4, 5].map((rank) => (
                      <div key={rank} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div>
                          <p className="font-medium">Client #{rank}</p>
                          <p className="text-sm text-gray-600">
                            {Math.floor(Math.random() * 10 + 1)} factures
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            {(Math.random() * 10000 + 1000).toFixed(0)} €
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Produits/Services populaires</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map((rank) => (
                      <div key={rank} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div>
                          <p className="font-medium">Produit #{rank}</p>
                          <p className="text-sm text-gray-600">
                            {Math.floor(Math.random() * 20 + 5)} ventes
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            {(Math.random() * 500 + 50).toFixed(0)} €
                          </p>
                        </div>
                      </div>
                    ))}
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
                      <p className="text-2xl font-bold">18 jours</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Taux de paiement</p>
                      <p className="text-2xl font-bold">92%</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Panier moyen</p>
                      <p className="text-2xl font-bold">
                        {(stats.totalRevenue / mockInvoices.length).toFixed(0)} €
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Croissance mensuelle</p>
                      <p className="text-2xl font-bold text-green-600">+12%</p>
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
