
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Settings as SettingsIcon, 
  User, 
  Building,
  FileText,
  Bell,
  Shield,
  Palette,
  Download,
  Upload
} from "lucide-react";

const Settings = () => {
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
                    <SettingsIcon className="w-8 h-8 mr-3 text-primary-600" />
                    Paramètres
                  </h1>
                  <p className="text-gray-600">Configuration de votre application</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Menu latéral des paramètres */}
              <div className="space-y-2">
                <Card>
                  <CardContent className="p-4">
                    <nav className="space-y-1">
                      <a href="#profile" className="flex items-center px-3 py-2 text-sm font-medium text-gray-900 bg-primary-50 rounded-lg">
                        <User className="w-4 h-4 mr-3" />
                        Profil utilisateur
                      </a>
                      <a href="#company" className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg">
                        <Building className="w-4 h-4 mr-3" />
                        Informations entreprise
                      </a>
                      <a href="#invoices" className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg">
                        <FileText className="w-4 h-4 mr-3" />
                        Paramètres factures
                      </a>
                      <a href="#notifications" className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg">
                        <Bell className="w-4 h-4 mr-3" />
                        Notifications
                      </a>
                      <a href="#security" className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg">
                        <Shield className="w-4 h-4 mr-3" />
                        Sécurité
                      </a>
                      <a href="#appearance" className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg">
                        <Palette className="w-4 h-4 mr-3" />
                        Apparence
                      </a>
                    </nav>
                  </CardContent>
                </Card>
              </div>

              {/* Contenu principal */}
              <div className="lg:col-span-2 space-y-6">
                {/* Profil utilisateur */}
                <Card id="profile">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <User className="w-5 h-5 mr-2" />
                      Profil utilisateur
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nom
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          defaultValue="Jean Dupont"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          defaultValue="jean.dupont@example.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Téléphone
                        </label>
                        <input
                          type="tel"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          defaultValue="+33 1 23 45 67 89"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Fonction
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          defaultValue="Gérant"
                        />
                      </div>
                    </div>
                    <Button>Enregistrer les modifications</Button>
                  </CardContent>
                </Card>

                {/* Informations entreprise */}
                <Card id="company">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Building className="w-5 h-5 mr-2" />
                      Informations entreprise
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nom de l'entreprise
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          defaultValue="FactureZenith SARL"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          SIRET
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          defaultValue="12345678901234"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          TVA Intracommunautaire
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          defaultValue="FR12345678901"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Adresse
                        </label>
                        <textarea
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          rows={3}
                          defaultValue="123 Rue de la Facturation&#10;75001 Paris&#10;France"
                        ></textarea>
                      </div>
                    </div>
                    <Button>Enregistrer les modifications</Button>
                  </CardContent>
                </Card>

                {/* Paramètres des factures */}
                <Card id="invoices">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FileText className="w-5 h-5 mr-2" />
                      Paramètres des factures
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Préfixe numérotation
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          defaultValue="FZ-"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Délai de paiement (jours)
                        </label>
                        <input
                          type="number"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          defaultValue="30"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Taux de TVA par défaut (%)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          defaultValue="20"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Devise
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                          <option value="EUR">Euro (€)</option>
                          <option value="USD">Dollar ($)</option>
                          <option value="GBP">Livre (£)</option>
                        </select>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Mentions légales
                        </label>
                        <textarea
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          rows={3}
                          defaultValue="En cas de retard de paiement, des pénalités de retard au taux de 3 fois le taux d'intérêt légal seront appliquées."
                        ></textarea>
                      </div>
                    </div>
                    <Button>Enregistrer les modifications</Button>
                  </CardContent>
                </Card>

                {/* Sauvegarde et restauration */}
                <Card>
                  <CardHeader>
                    <CardTitle>Sauvegarde et restauration</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Exporter les données</h4>
                        <p className="text-sm text-gray-600 mb-3">
                          Téléchargez une sauvegarde complète de vos données
                        </p>
                        <Button variant="outline" className="w-full">
                          <Download className="w-4 h-4 mr-2" />
                          Exporter
                        </Button>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Importer des données</h4>
                        <p className="text-sm text-gray-600 mb-3">
                          Restaurer à partir d'une sauvegarde
                        </p>
                        <Button variant="outline" className="w-full">
                          <Upload className="w-4 h-4 mr-2" />
                          Importer
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Settings;
