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
  Upload,
  Camera
} from "lucide-react";
import { useCompanySettings, useUserSettings, useUpdateCompanySettings, useUpdateUserSettings, useUploadLogo } from "@/hooks/useSettings";
import { useState, useRef } from "react";

const Settings = () => {
  const { data: companySettings, isLoading: companyLoading } = useCompanySettings();
  const { data: userSettings, isLoading: userLoading } = useUserSettings();
  const updateCompanyMutation = useUpdateCompanySettings();
  const updateUserMutation = useUpdateUserSettings();
  const uploadLogoMutation = useUploadLogo();
  
  const [activeSection, setActiveSection] = useState('profile');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [userForm, setUserForm] = useState(userSettings || {
    name: '',
    email: '',
    phone: '',
    position: ''
  });

  const [companyForm, setCompanyForm] = useState(companySettings || {
    companyName: '',
    siret: '',
    vatNumber: '',
    address: '',
    logo: '',
    invoicePrefix: '',
    paymentDelay: 30,
    defaultVatRate: 20,
    currency: 'FCFA',
    legalMentions: ''
  });

  // Update forms when data loads
  useState(() => {
    if (userSettings) setUserForm(userSettings);
    if (companySettings) setCompanyForm(companySettings);
  });

  const handleUserSave = () => {
    updateUserMutation.mutate(userForm);
  };

  const handleCompanySave = () => {
    updateCompanyMutation.mutate(companyForm);
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadLogoMutation.mutate(file, {
        onSuccess: (data) => {
          setCompanyForm(prev => ({ ...prev, logo: data.logoUrl }));
        }
      });
    }
  };

  if (companyLoading || userLoading) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-gray-50">
          <AppSidebar />
          <main className="flex-1 p-6">
            <div className="max-w-7xl mx-auto">
              <div className="text-center py-20">
                <div className="text-lg">Chargement des paramètres...</div>
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
                      <button
                        onClick={() => setActiveSection('profile')}
                        className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg ${
                          activeSection === 'profile' 
                            ? 'text-gray-900 bg-primary-50' 
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <User className="w-4 h-4 mr-3" />
                        Profil utilisateur
                      </button>
                      <button
                        onClick={() => setActiveSection('company')}
                        className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg ${
                          activeSection === 'company' 
                            ? 'text-gray-900 bg-primary-50' 
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <Building className="w-4 h-4 mr-3" />
                        Informations entreprise
                      </button>
                      <button
                        onClick={() => setActiveSection('invoices')}
                        className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg ${
                          activeSection === 'invoices' 
                            ? 'text-gray-900 bg-primary-50' 
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <FileText className="w-4 h-4 mr-3" />
                        Paramètres factures
                      </button>
                    </nav>
                  </CardContent>
                </Card>
              </div>

              {/* Contenu principal */}
              <div className="lg:col-span-2 space-y-6">
                {/* Profil utilisateur */}
                {activeSection === 'profile' && (
                  <Card>
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
                            value={userForm.name}
                            onChange={(e) => setUserForm(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                          </label>
                          <input
                            type="email"
                            value={userForm.email}
                            onChange={(e) => setUserForm(prev => ({ ...prev, email: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Téléphone
                          </label>
                          <input
                            type="tel"
                            value={userForm.phone}
                            onChange={(e) => setUserForm(prev => ({ ...prev, phone: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Fonction
                          </label>
                          <input
                            type="text"
                            value={userForm.position}
                            onChange={(e) => setUserForm(prev => ({ ...prev, position: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                      <Button 
                        onClick={handleUserSave}
                        disabled={updateUserMutation.isPending}
                      >
                        {updateUserMutation.isPending ? 'Enregistrement...' : 'Enregistrer les modifications'}
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {/* Informations entreprise */}
                {activeSection === 'company' && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Building className="w-5 h-5 mr-2" />
                        Informations entreprise
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Logo Upload */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Logo de l'entreprise
                        </label>
                        <div className="flex items-center space-x-4">
                          {companyForm.logo && (
                            <img 
                              src={companyForm.logo} 
                              alt="Logo entreprise" 
                              className="w-16 h-16 object-contain border border-gray-200 rounded-lg"
                            />
                          )}
                          <div>
                            <input
                              ref={fileInputRef}
                              type="file"
                              accept="image/*"
                              onChange={handleLogoUpload}
                              className="hidden"
                            />
                            <Button
                              variant="outline"
                              onClick={() => fileInputRef.current?.click()}
                              disabled={uploadLogoMutation.isPending}
                              className="flex items-center"
                            >
                              <Camera className="w-4 h-4 mr-2" />
                              {uploadLogoMutation.isPending ? 'Téléchargement...' : 'Changer le logo'}
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nom de l'entreprise
                          </label>
                          <input
                            type="text"
                            value={companyForm.companyName}
                            onChange={(e) => setCompanyForm(prev => ({ ...prev, companyName: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            SIRET
                          </label>
                          <input
                            type="text"
                            value={companyForm.siret}
                            onChange={(e) => setCompanyForm(prev => ({ ...prev, siret: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            TVA Intracommunautaire
                          </label>
                          <input
                            type="text"
                            value={companyForm.vatNumber}
                            onChange={(e) => setCompanyForm(prev => ({ ...prev, vatNumber: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Adresse
                          </label>
                          <textarea
                            value={companyForm.address}
                            onChange={(e) => setCompanyForm(prev => ({ ...prev, address: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            rows={3}
                          />
                        </div>
                      </div>
                      <Button 
                        onClick={handleCompanySave}
                        disabled={updateCompanyMutation.isPending}
                      >
                        {updateCompanyMutation.isPending ? 'Enregistrement...' : 'Enregistrer les modifications'}
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {/* Paramètres des factures */}
                {activeSection === 'invoices' && (
                  <Card>
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
                            value={companyForm.invoicePrefix}
                            onChange={(e) => setCompanyForm(prev => ({ ...prev, invoicePrefix: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Délai de paiement (jours)
                          </label>
                          <input
                            type="number"
                            value={companyForm.paymentDelay}
                            onChange={(e) => setCompanyForm(prev => ({ ...prev, paymentDelay: parseInt(e.target.value) }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Taux de TVA par défaut (%)
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            value={companyForm.defaultVatRate}
                            onChange={(e) => setCompanyForm(prev => ({ ...prev, defaultVatRate: parseFloat(e.target.value) }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Devise
                          </label>
                          <select 
                            value={companyForm.currency}
                            onChange={(e) => setCompanyForm(prev => ({ ...prev, currency: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          >
                            <option value="EUR">Euro (€)</option>
                            <option value="USD">Dollar ($)</option>
                            <option value="GBP">Livre (£)</option>
                            <option value="FCFA">FCFA</option>
                          </select>
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Mentions légales
                          </label>
                          <textarea
                            value={companyForm.legalMentions}
                            onChange={(e) => setCompanyForm(prev => ({ ...prev, legalMentions: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            rows={3}
                          />
                        </div>
                      </div>
                      <Button 
                        onClick={handleCompanySave}
                        disabled={updateCompanyMutation.isPending}
                      >
                        {updateCompanyMutation.isPending ? 'Enregistrement...' : 'Enregistrer les modifications'}
                      </Button>
                    </CardContent>
                  </Card>
                )}

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