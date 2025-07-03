
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SearchInput } from "@/components/ui/search-input";
import { 
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis
} from "@/components/ui/pagination";
import { 
  Users, 
  Plus, 
  Mail, 
  Phone, 
  MapPin,
  Euro,
  AlertTriangle,
  Edit,
  Trash2,
  FileText,
  Loader2,
  Eye
} from "lucide-react";
import { ClientForm } from "@/components/forms/ClientForm";
import { ViewClientModal } from "@/components/modals/ViewClientModal";
import { DeleteConfirmModal } from "@/components/modals/DeleteConfirmModal";
import { Client } from "@/types";
import { useClientsWithStats, useCreateClient, useUpdateClient, useDeleteClient } from "@/hooks/useClients";
import { useSearch } from "@/hooks/useSearch";
import { usePagination } from "@/hooks/usePagination";
import { useState } from "react";

const Clients = () => {
  const { data: clients = [], isLoading, error } = useClientsWithStats();
  const createClientMutation = useCreateClient();
  const updateClientMutation = useUpdateClient();
  const deleteClientMutation = useDeleteClient();

  // Search functionality
  const { searchQuery, setSearchQuery, filteredData: filteredClients } = useSearch(
    clients,
    [
      'name',
      'email',
      'phone',
      (client: Client) => `${client.address.city} ${client.address.country}`,
      (client: Client) => client.address.street
    ]
  );

  // Pagination
  const {
    currentPage,
    totalPages,
    paginatedData: paginatedClients,
    goToPage,
    goToPrevious,
    goToNext,
    totalItems,
    startIndex,
    endIndex
  } = usePagination(filteredClients, 9); // 9 items per page for 3x3 grid

  const [showClientForm, setShowClientForm] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  const handleCreateClient = () => {
    setEditingClient(null);
    setShowClientForm(true);
  };

  const handleViewClient = (client: Client) => {
    setSelectedClient(client);
    setShowViewModal(true);
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
      updateClientMutation.mutate({ id: editingClient._id, data: clientData });
    } else {
      createClientMutation.mutate(clientData);
    }
    setShowClientForm(false);
  };

  const confirmDeleteClient = () => {
    if (selectedClient) {
      deleteClientMutation.mutate(selectedClient._id);
      setShowDeleteModal(false);
      setSelectedClient(null);
    }
  };

  if (isLoading) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-gray-50">
          <AppSidebar />
          <main className="flex-1 p-6">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
              </div>
            </div>
          </main>
        </div>
      </SidebarProvider>
    );
  }

  if (error) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-gray-50">
          <AppSidebar />
          <main className="flex-1 p-6">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                  <p className="text-red-600">Erreur de connexion au serveur</p>
                </div>
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
                      <p className="text-2xl font-bold text-gray-900">{clients.length}</p>
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
                        {clients.reduce((acc, client) => acc + (client.totalAmount || 0), 0).toLocaleString('fr-FR')} FCFA
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
                        {clients.reduce((acc, client) => acc + (client.pendingAmount || 0), 0).toLocaleString('fr-FR')} FCFA
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
                        {clients.filter(client => (client.totalAmount || 0) > 0).length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Search */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <SearchInput
                    placeholder="Rechercher un client (nom, email, téléphone, adresse)..."
                    onSearch={setSearchQuery}
                    className="flex-1 mr-96"
                  />
                  <div className="text-sm text-gray-500">
                    {searchQuery && `${filteredClients.length} résultat(s) trouvé(s) - `}
                    Affichage de {startIndex} à {endIndex} sur {totalItems} clients
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Clients List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
              {paginatedClients.map((client) => (
                <Card key={client._id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-gray-900 flex items-center justify-between">
                      {client.name}
                      <div className="flex items-center space-x-2">
                        {(client.pendingAmount || 0) > 0 && (
                          <Badge variant="destructive">Impayé</Badge>
                        )}
                        {(client.totalAmount || 0) > 0 && (client.pendingAmount || 0) === 0 && (
                          <Badge className="bg-green-100 text-green-800">Actif</Badge>
                        )}
                        <div className="flex space-x-1">
                          <Button size="sm" variant="ghost" onClick={() => handleViewClient(client)}>
                            <Eye className="w-4 h-4" />
                          </Button>
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
                            <p className="font-semibold">{client.totalInvoices || 0}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">CA Total</p>
                            <p className="font-semibold">{(client.totalAmount || 0).toLocaleString('fr-FR')} FCFA</p>
                          </div>
                        </div>
                        {(client.pendingAmount || 0) > 0 && (
                          <div className="mt-2 pt-2 border-t border-gray-100">
                            <div className="text-sm">
                              <p className="text-red-600 font-medium">
                                Impayé: {(client.pendingAmount || 0).toLocaleString('fr-FR')} FCFA
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex space-x-2 pt-2">
                        {/* <Button size="sm" variant="outline" className="flex-1">
                          <FileText className="w-4 h-4 mr-1" />
                          Nouvelle Facture
                        </Button> */}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={goToPrevious}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                      if (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      ) {
                        return (
                          <PaginationItem key={page}>
                            <PaginationLink
                              onClick={() => goToPage(page)}
                              isActive={currentPage === page}
                              className="cursor-pointer"
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      } else if (
                        page === currentPage - 2 ||
                        page === currentPage + 2
                      ) {
                        return (
                          <PaginationItem key={page}>
                            <PaginationEllipsis />
                          </PaginationItem>
                        );
                      }
                      return null;
                    })}
                    
                    <PaginationItem>
                      <PaginationNext 
                        onClick={goToNext}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}

            {/* No results message */}
            {searchQuery && filteredClients.length === 0 && (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun client trouvé</h3>
                <p className="text-gray-500">Essayez de modifier vos critères de recherche</p>
              </div>
            )}
          </div>
        </main>

        {/* Modals */}
        <ViewClientModal
          open={showViewModal}
          onOpenChange={setShowViewModal}
          client={selectedClient}
          onEdit={(client) => {
            setShowViewModal(false);
            handleEditClient(client);
          }}
        />

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