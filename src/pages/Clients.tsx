
import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Plus, 
  Search, 
  Mail, 
  Phone, 
  MapPin,
  Euro,
  AlertTriangle,
  Edit,
  Trash2,
  FileText
} from "lucide-react";
import { mockClients } from "@/data/mockData";
import { ClientForm } from "@/components/forms/ClientForm";
import { DeleteConfirmModal } from "@/components/modals/DeleteConfirmModal";
import { Client } from "@/types";
import { toast } from "sonner";

const Clients = () => {
  const [clients, setClients] = useState(mockClients);
  const [showClientForm, setShowClientForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  const handleCreateClient = () => {
    setEditingClient(null);
    setShowClientForm(true);
  };

  const handleEditClient = (client: Client) => {
    setEditingClient(client);
    setShowClientForm(true);
  };

  const handleDeleteClient = (client: Client) => {
    setSelectedClient(client);
    setShowDeleteModal(true);
  };

  const handleSubmitClient = (clientData: Partial<Client>) => {
    if (editingClient) {
      setClients(prev => prev.map(client => 
        client.id === editingClient.id 
          ? { ...client, ...clientData }
          : client
      ));
      toast.success("Client modifié avec succès");
    } else {
      const newClient: Client = {
        id: Date.now().toString(),
        createdAt: new Date(),
        totalInvoices: 0,
        totalAmount: 0,
        pendingAmount: 0,
        ...clientData as Client
      };
      setClients(prev => [...prev, newClient]);
      toast.success("Client créé avec succès");
    }
  };

  const confirmDeleteClient = () => {
    if (selectedClient) {
      setClients(prev => prev.filter(client => client.id !== selectedClient.id));
      toast.success("Client supprimé avec succès");
    }
  };

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
                    <Users className="w-8 h-8 mr-3 text-primary-600" />
                    Clients
                  </h1>
                  <p className="text-gray-600">Gérez vos clients et leurs informations</p>
                </div>
              </div>
              <Button onClick={handleCreateClient} className="bg-primary-600 hover:bg-primary-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Nouveau Client
              </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Clients</p>
                      <p className="text-2xl font-bold text-gray-900">{mockClients.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Euro className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">CA Total</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {mockClients.reduce((acc, client) => acc + client.totalAmount, 0).toLocaleString('fr-FR')} €
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <AlertTriangle className="w-6 h-6 text-orange-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Impayés</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {mockClients.reduce((acc, client) => acc + client.pendingAmount, 0).toLocaleString('fr-FR')} €
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Users className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Clients Actifs</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {mockClients.filter(client => client.totalAmount > 0).length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Search and Filters */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Rechercher un client..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <Button variant="outline">Filtrer</Button>
                </div>
              </CardContent>
            </Card>

            {/* Clients List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {clients.map((client) => (
                <Card key={client.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-gray-900 flex items-center justify-between">
                      {client.name}
                      <div className="flex items-center space-x-2">
                        {client.pendingAmount > 0 && (
                          <Badge variant="destructive">Impayé</Badge>
                        )}
                        <div className="flex space-x-1">
                          <Button size="sm" variant="ghost" onClick={() => handleEditClient(client)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handleDeleteClient(client)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="w-4 h-4 mr-2" />
                        {client.email}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="w-4 h-4 mr-2" />
                        {client.phone}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-2" />
                        {client.address.city}, {client.address.country}
                      </div>
                      
                      <div className="pt-3 border-t border-gray-100">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500">Factures</p>
                            <p className="font-semibold">{client.totalInvoices}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">CA Total</p>
                            <p className="font-semibold">{client.totalAmount.toLocaleString('fr-FR')} €</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2 pt-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <FileText className="w-4 h-4 mr-1" />
                          Nouvelle Facture
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>

        {/* Modals */}
        <ClientForm
          open={showClientForm}
          onOpenChange={setShowClientForm}
          client={editingClient}
          onSubmit={handleSubmitClient}
        />

        <DeleteConfirmModal
          open={showDeleteModal}
          onOpenChange={setShowDeleteModal}
          title="Supprimer le client"
          description={`Êtes-vous sûr de vouloir supprimer le client ${selectedClient?.name} ? Cette action supprimera également toutes les factures associées.`}
          onConfirm={confirmDeleteClient}
        />
      </div>
    </SidebarProvider>
  );
};

export default Clients;
