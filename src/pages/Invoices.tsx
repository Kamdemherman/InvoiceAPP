import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  FileText, 
  Plus, 
  Search, 
  Euro, 
  Calendar,
  User,
  Download,
  Mail,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  CheckCircle,
  Clock,
  AlertCircle,
  FileEdit,
  Bell
} from "lucide-react";
import { InvoiceForm } from "@/components/forms/InvoiceForm";
import { ViewInvoiceModal } from "@/components/modals/ViewInvoiceModal";
import { DeleteConfirmModal } from "@/components/modals/DeleteConfirmModal";
import { Invoice } from "@/types";
import { useInvoices, useCreateInvoice, useUpdateInvoice, useDeleteInvoice } from "@/hooks/useInvoices";
import { useClients } from "@/hooks/useClients";
import { usePagination } from "@/hooks/usePagination";
import { generateInvoicePDF } from "@/utils/pdfGenerator";
import { sendInvoiceByEmail } from "@/utils/emailService";
import { toast } from "sonner";

const Invoices = () => {
  const { data: invoices = [], isLoading } = useInvoices();
  const { data: clients = [] } = useClients();
  const createInvoiceMutation = useCreateInvoice();
  const updateInvoiceMutation = useUpdateInvoice();
  const deleteInvoiceMutation = useDeleteInvoice();

  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Filter invoices based on search and status
  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = !searchQuery || 
      invoice.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.clientName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || invoice.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Pagination - explicitly type the hook call
  const {
    currentPage,
    totalPages,
    paginatedData: paginatedInvoices,
    goToPage,
    goToPrevious,
    goToNext,
    totalItems,
    startIndex,
    endIndex
  } = usePagination<Invoice>(filteredInvoices, 10);

  // Fonction utilitaire pour convertir les dates
  const formatDate = (dateValue: string | Date) => {
    const date = typeof dateValue === 'string' ? new Date(dateValue) : dateValue;
    return date.toLocaleDateString('fr-FR');
  };

  const totalInvoices = invoices.length;
  const paidInvoices = invoices.filter(inv => inv.status === 'paid').length;
  const pendingInvoices = invoices.filter(inv => inv.status === 'sent').length;
  const overdueInvoices = invoices.filter(inv => inv.status === 'overdue').length;

  const handleCreateInvoice = () => {
    setEditingInvoice(null);
    setShowInvoiceForm(true);
  };

  const handleEditInvoice = (invoice: Invoice) => {
    setEditingInvoice(invoice);
    setShowInvoiceForm(true);
  };

  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setShowViewModal(true);
  };

  const handleDeleteInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setShowDeleteModal(true);
  };

  const handleSubmitInvoice = async (invoiceData: Partial<Invoice>) => {
    try {
      if (editingInvoice) {
        await updateInvoiceMutation.mutateAsync({
          id: editingInvoice._id,
          data: invoiceData
        });
      } else {
        await createInvoiceMutation.mutateAsync(invoiceData);
      }
      setShowInvoiceForm(false);
    } catch (error) {
      console.error('Error submitting invoice:', error);
    }
  };

  const confirmDeleteInvoice = async () => {
    if (selectedInvoice) {
      try {
        await deleteInvoiceMutation.mutateAsync(selectedInvoice._id);
        setShowDeleteModal(false);
        setSelectedInvoice(null);
      } catch (error) {
        console.error('Error deleting invoice:', error);
      }
    }
  };

  const handleStatusChange = async (invoice: Invoice, newStatus: string) => {
    try {
      console.log(`Changing status of invoice ${invoice.number} to ${newStatus}`);
      await updateInvoiceMutation.mutateAsync({
        id: invoice._id,
        data: { status: newStatus }
      });
      
      const statusMessages = {
        'paid': 'Facture marquée comme payée',
        'sent': 'Facture marquée comme envoyée', 
        'overdue': 'Facture marquée en retard',
        'draft': 'Facture marquée comme brouillon'
      };
      
      toast.success(statusMessages[newStatus as keyof typeof statusMessages] || 'Statut mis à jour');
    } catch (error) {
      console.error('Error updating invoice status:', error);
      toast.error('Erreur lors de la mise à jour du statut');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-100 text-green-800">Payée</Badge>;
      case 'sent':
        return <Badge className="bg-blue-100 text-blue-800">Envoyée</Badge>;
      case 'overdue':
        return <Badge variant="destructive">En retard</Badge>;
      case 'draft':
        return <Badge variant="secondary">Brouillon</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleDownloadPDF = async (invoice: Invoice) => {
    try {
      console.log('Attempting to generate PDF for invoice:', invoice._id);
      console.log('Available clients:', clients.length);
      
      let client = clients.find(c => c._id === invoice.client);
      
      if (!client) {
        client = clients.find(c => c.name === invoice.clientName);
      }
      
      if (!client) {
        console.error('Client not found for invoice:', invoice);
        toast.error(`Client non trouvé pour la facture ${invoice.number}`);
        return;
      }
      
      await generateInvoicePDF(invoice, client);
      toast.success('PDF généré avec succès');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Erreur lors de la génération du PDF');
    }
  };

  const handleSendEmail = async (invoice: Invoice) => {
    try {
      console.log('Attempting to send email for invoice:', invoice._id);
      console.log('Available clients:', clients.length);
      
      let client = clients.find(c => c._id === invoice.client);
      
      if (!client) {
        client = clients.find(c => c.name === invoice.clientName);
      }
      
      if (!client) {
        console.error('Client not found for invoice:', invoice);
        toast.error(`Client non trouvé pour la facture ${invoice.number}`);
        return;
      }
      
      await sendInvoiceByEmail(invoice, client);
      toast.success(`Email envoyé à ${client.email}`);
      
      if (invoice.status === 'draft') {
        await handleStatusChange(invoice, 'sent');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error('Erreur lors de l\'envoi de l\'email');
    }
  };

  if (isLoading) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-gray-50">
          <AppSidebar />
          <main className="flex-1 p-6">
            <div className="max-w-7xl mx-auto">
              <div className="text-center py-20">
                <div className="text-lg">Chargement des factures...</div>
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
                    <FileText className="w-8 h-8 mr-3 text-primary-600" />
                    Factures
                  </h1>
                  <p className="text-gray-600">Gérez toutes vos factures</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Button 
                  onClick={() => window.location.href = '/reminders'} 
                  variant="outline"
                  className="border-orange-200 hover:bg-orange-50 text-orange-700"
                >
                  <Bell className="w-4 h-4 mr-2" />
                  Relances Client
                </Button>
                <Button onClick={handleCreateInvoice} className="bg-primary-600 hover:bg-primary-700 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Nouvelle Facture
                </Button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Factures</p>
                      <p className="text-2xl font-bold text-gray-900">{totalInvoices}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <FileText className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Payées</p>
                      <p className="text-2xl font-bold text-gray-900">{paidInvoices}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <FileText className="w-6 h-6 text-orange-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">En Attente</p>
                      <p className="text-2xl font-bold text-gray-900">{pendingInvoices}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <FileText className="w-6 h-6 text-red-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">En Retard</p>
                      <p className="text-2xl font-bold text-gray-900">{overdueInvoices}</p>
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
                      placeholder="Rechercher une facture..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button 
                    variant={statusFilter === "all" ? "default" : "outline"}
                    onClick={() => setStatusFilter("all")}
                  >
                    Toutes
                  </Button>
                  <Button 
                    variant={statusFilter === "paid" ? "default" : "outline"}
                    onClick={() => setStatusFilter("paid")}
                  >
                    Payées
                  </Button>
                  <Button 
                    variant={statusFilter === "sent" ? "default" : "outline"}
                    onClick={() => setStatusFilter("sent")}
                  >
                    En attente
                  </Button>
                  <Button 
                    variant={statusFilter === "overdue" ? "default" : "outline"}
                    onClick={() => setStatusFilter("overdue")}
                  >
                    En retard
                  </Button>
                </div>
                <div className="mt-4 text-sm text-gray-500">
                  {searchQuery && `${filteredInvoices.length} résultat(s) trouvé(s) - `}
                  Affichage de {startIndex} à {endIndex} sur {totalItems} factures
                </div>
              </CardContent>
            </Card>

            {/* Invoices List */}
            <div className="space-y-4 mb-6">
              {paginatedInvoices.map((invoice) => (
                <Card key={invoice._id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              Facture #{invoice.number}
                            </h3>
                            <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                              <div className="flex items-center">
                                <User className="w-4 h-4 mr-1" />
                                {invoice.clientName}
                              </div>
                              <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                {formatDate(invoice.date)}
                              </div>
                              <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                Échéance: {formatDate(invoice.dueDate)}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            {getStatusBadge(invoice.status)}
                            <div className="text-right">
                              <div className="flex items-center text-xl font-bold text-gray-900">
                                <Euro className="w-5 h-5 mr-1" />
                                {invoice.total.toFixed(2)} FCFA
                              </div>
                              <div className="text-sm text-gray-500">
                                TTC
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-6">
                        <Button size="sm" variant="outline" onClick={() => handleViewInvoice(invoice)}>
                          <Eye className="w-4 h-4 mr-1" />
                          Voir
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleEditInvoice(invoice)}>
                          <Edit className="w-4 h-4 mr-1" />
                          Modifier
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDownloadPDF(invoice)}>
                          <Download className="w-4 h-4 mr-1" />
                          PDF
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleSendEmail(invoice)}>
                          <Mail className="w-4 h-4 mr-1" />
                          Envoyer
                        </Button>    
                        <Button size="sm" variant="outline" onClick={() => handleDeleteInvoice(invoice)}>
                          <Trash2 className="w-4 h-4 mr-1" />
                          Supprimer
                        </Button>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">{invoice.items.length} article(s)</span>
                        {invoice.items.length > 0 && (
                          <span className="ml-2">
                            - {invoice.items[0].productName}
                            {invoice.items.length > 1 && ` et ${invoice.items.length - 1} autre(s)`}
                          </span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mb-8">
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
            {searchQuery && filteredInvoices.length === 0 && (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune facture trouvée</h3>
                <p className="text-gray-500">Essayez de modifier vos critères de recherche</p>
              </div>
            )}
          </div>
        </main>

        {/* Modals */}
        <InvoiceForm
          open={showInvoiceForm}
          onOpenChange={setShowInvoiceForm}
          invoice={editingInvoice}
          onSubmit={handleSubmitInvoice}
        />

        <ViewInvoiceModal
          open={showViewModal}
          onOpenChange={setShowViewModal}
          invoice={selectedInvoice}
        />

        <DeleteConfirmModal
          open={showDeleteModal}
          onOpenChange={setShowDeleteModal}
          title="Supprimer la facture"
          description={`Êtes-vous sûr de vouloir supprimer la facture ${selectedInvoice?.number} ? Cette action est irréversible.`}
          onConfirm={confirmDeleteInvoice}
        />
      </div>
    </SidebarProvider>
  );
};

export default Invoices;