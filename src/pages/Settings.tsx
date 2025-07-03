
import React, { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings as SettingsIcon, Building, User, Upload } from "lucide-react";
import { useCompanySettings, useUserSettings, useUpdateCompanySettings, useUpdateUserSettings, useUploadLogo } from "@/hooks/useSettings";
import { toast } from "sonner";

const Settings = () => {
  const { data: companySettings, isLoading: companyLoading } = useCompanySettings();
  const { data: userSettings, isLoading: userLoading } = useUserSettings();
  const updateCompanyMutation = useUpdateCompanySettings();
  const updateUserMutation = useUpdateUserSettings();
  const uploadLogoMutation = useUploadLogo();

  const [companyForm, setCompanyForm] = useState({
    companyName: '',
    siret: '',
    vatNumber: '',
    address: '',
    invoicePrefix: 'FAC',
    paymentDelay: 30,
    defaultVatRate: 20,
    currency: 'FCFA',
    legalMentions: ''
  });

  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    phone: '',
    position: ''
  });

  // Initialiser les formulaires avec les données existantes
  React.useEffect(() => {
    if (companySettings) {
      setCompanyForm({
        companyName: companySettings.companyName || '',
        siret: companySettings.siret || '',
        vatNumber: companySettings.vatNumber || '',
        address: companySettings.address || '',
        invoicePrefix: companySettings.invoicePrefix || 'FAC',
        paymentDelay: companySettings.paymentDelay || 30,
        defaultVatRate: companySettings.defaultVatRate || 20,
        currency: companySettings.currency || 'FCFA',
        legalMentions: companySettings.legalMentions || ''
      });
    }
  }, [companySettings]);

  React.useEffect(() => {
    if (userSettings) {
      setUserForm({
        name: userSettings.name || '',
        email: userSettings.email || '',
        phone: userSettings.phone || '',
        position: userSettings.position || ''
      });
    }
  }, [userSettings]);

  const handleCompanySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateCompanyMutation.mutateAsync(companyForm);
    } catch (error) {
      console.error('Erreur lors de la mise à jour des paramètres d\'entreprise:', error);
    }
  };

  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateUserMutation.mutateAsync(userForm);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil utilisateur:', error);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        await uploadLogoMutation.mutateAsync(file);
      } catch (error) {
        console.error('Erreur lors du téléchargement du logo:', error);
      }
    }
  };

  if (companyLoading || userLoading) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-gray-50">
          <AppSidebar />
          <main className="flex-1 p-6">
            <div className="max-w-4xl mx-auto">
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
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center space-x-4 mb-8">
              <SidebarTrigger className="p-2 hover:bg-gray-100 rounded-lg transition-colors" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                  <SettingsIcon className="w-8 h-8 mr-3 text-primary-600" />
                  Paramètres
                </h1>
                <p className="text-gray-600">Configurez votre entreprise et profil</p>
              </div>
            </div>

            <Tabs defaultValue="company" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="company" className="flex items-center space-x-2">
                  <Building className="w-4 h-4" />
                  <span>Entreprise</span>
                </TabsTrigger>
                <TabsTrigger value="user" className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>Profil</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="company">
                <Card>
                  <CardHeader>
                    <CardTitle>Informations de l'entreprise</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleCompanySubmit} className="space-y-6">
                      {/* Logo */}
                      <div>
                        <Label htmlFor="logo">Logo de l'entreprise</Label>
                        <div className="mt-2 flex items-center space-x-4">
                          {companySettings?.logo && (
                            <img
                              src={`http://localhost:5000${companySettings.logo}`}
                              alt="Logo"
                              className="w-16 h-16 object-contain border rounded"
                            />
                          )}
                          <div>
                            <Input
                              id="logo"
                              type="file"
                              accept="image/*"
                              onChange={handleLogoUpload}
                              className="hidden"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => document.getElementById('logo')?.click()}
                            >
                              <Upload className="w-4 h-4 mr-2" />
                              Télécharger un logo
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="companyName">Nom de l'entreprise *</Label>
                          <Input
                            id="companyName"
                            value={companyForm.companyName}
                            onChange={(e) => setCompanyForm(prev => ({ ...prev, companyName: e.target.value }))}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="siret">SIRET</Label>
                          <Input
                            id="siret"
                            value={companyForm.siret}
                            onChange={(e) => setCompanyForm(prev => ({ ...prev, siret: e.target.value }))}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="vatNumber">Numéro de TVA</Label>
                          <Input
                            id="vatNumber"
                            value={companyForm.vatNumber}
                            onChange={(e) => setCompanyForm(prev => ({ ...prev, vatNumber: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="currency">Devise</Label>
                          <Input
                            id="currency"
                            value={companyForm.currency}
                            onChange={(e) => setCompanyForm(prev => ({ ...prev, currency: e.target.value }))}
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="address">Adresse *</Label>
                        <Textarea
                          id="address"
                          rows={3}
                          value={companyForm.address}
                          onChange={(e) => setCompanyForm(prev => ({ ...prev, address: e.target.value }))}
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="invoicePrefix">Préfixe des factures</Label>
                          <Input
                            id="invoicePrefix"
                            value={companyForm.invoicePrefix}
                            onChange={(e) => setCompanyForm(prev => ({ ...prev, invoicePrefix: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="paymentDelay">Délai de paiement (jours)</Label>
                          <Input
                            id="paymentDelay"
                            type="number"
                            min="1"
                            value={companyForm.paymentDelay}
                            onChange={(e) => setCompanyForm(prev => ({ ...prev, paymentDelay: parseInt(e.target.value) || 30 }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="defaultVatRate">Taux de TVA par défaut (%)</Label>
                          <Input
                            id="defaultVatRate"
                            type="number"
                            min="0"
                            max="100"
                            step="0.01"
                            value={companyForm.defaultVatRate}
                            onChange={(e) => setCompanyForm(prev => ({ ...prev, defaultVatRate: parseFloat(e.target.value) || 20 }))}
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="legalMentions">Mentions légales</Label>
                        <Textarea
                          id="legalMentions"
                          rows={4}
                          value={companyForm.legalMentions}
                          onChange={(e) => setCompanyForm(prev => ({ ...prev, legalMentions: e.target.value }))}
                          placeholder="Mentions légales à afficher sur les factures..."
                        />
                      </div>

                      <div className="flex justify-end">
                        <Button type="submit" disabled={updateCompanyMutation.isPending}>
                          {updateCompanyMutation.isPending ? 'Enregistrement...' : 'Enregistrer les paramètres'}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="user">
                <Card>
                  <CardHeader>
                    <CardTitle>Profil utilisateur</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleUserSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Nom complet *</Label>
                          <Input
                            id="name"
                            value={userForm.name}
                            onChange={(e) => setUserForm(prev => ({ ...prev, name: e.target.value }))}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email *</Label>
                          <Input
                            id="email"
                            type="email"
                            value={userForm.email}
                            onChange={(e) => setUserForm(prev => ({ ...prev, email: e.target.value }))}
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="phone">Téléphone</Label>
                          <Input
                            id="phone"
                            type="tel"
                            value={userForm.phone}
                            onChange={(e) => setUserForm(prev => ({ ...prev, phone: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="position">Poste</Label>
                          <Input
                            id="position"
                            value={userForm.position}
                            onChange={(e) => setUserForm(prev => ({ ...prev, position: e.target.value }))}
                          />
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <Button type="submit" disabled={updateUserMutation.isPending}>
                          {updateUserMutation.isPending ? 'Enregistrement...' : 'Enregistrer le profil'}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Settings;