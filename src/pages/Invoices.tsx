
import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  Trash2
} from "lucide-react";
import { mockInvoices } from "@/data/mockData";
import { InvoiceForm } from "@/components/forms/InvoiceForm";
import { ViewInvoiceModal } from "@/components/modals/ViewInvoiceModal";
import { DeleteConfirmModal } from "@/components/modals/DeleteConfirmModal";
import { Invoice } from "@/types";
import { toast } from "sonner";

const Invoices = () => {
  const [invoices, setInvoices] = useState(mockInvoices);
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);

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

  const handleSubmitInvoice = (invoiceData: Partial<Invoice>) => {
    if (editingInvoice) {
      setInvoices(prev => prev.map(inv => 
        inv._id === editingInvoice._id 
          ? { ...inv, ...invoiceData }
          : inv
      ));
      toast.success("Facture modifiée avec succès");
    } else {
      const newInvoice: Invoice = {
        _id: Date.now().toString(),
        number: `FAC-2024-${String(invoices.length + 1).padStart(3, '0')}`,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...invoiceData as Invoice
      };
      setInvoices(prev => [...prev, newInvoice]);
      toast.success("Facture créée avec succès");
    }
  };

  const confirmDeleteInvoice = () => {
    if (selectedInvoice) {
      setInvoices(prev => prev.filter(inv => inv._id !== selectedInvoice._id));
      toast.success("Facture supprimée avec succès");
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
              <Button onClick={handleCreateInvoice} className="bg-primary-600 hover:bg-primary-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Nouvelle Facture
              </Button>
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
                    />
                  </div>
                  <Button variant="outline">Toutes</Button>
                  <Button variant="outline">Payées</Button>
                  <Button variant="outline">En attente</Button>
                  <Button variant="outline">En retard</Button>
                </div>
              </CardContent>
            </Card>

            {/* Invoices List */}
            <div className="space-y-4">
              {invoices.map((invoice) => (
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
                                {invoice.date.toLocaleDateString('fr-FR')}
                              </div>
                              <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                Échéance: {invoice.dueDate.toLocaleDateString('fr-FR')}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            {getStatusBadge(invoice.status)}
                            <div className="text-right">
                              <div className="flex items-center text-xl font-bold text-gray-900">
                                <Euro className="w-5 h-5 mr-1" />
                                {invoice.total.toFixed(2)} €
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
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4 mr-1" />
                          PDF
                        </Button>
                        <Button size="sm" variant="outline">
                          <Mail className="w-4 h-4 mr-1" />
                          Envoyer
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDeleteInvoice(invoice)}>
                          <Trash2 className="w-4 h-4 mr-1" />
                          Supprimer
                        </Button>
                      </div>
                    </div>
                    
                    {/* Invoice Items Summary */}
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
