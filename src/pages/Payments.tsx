import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SearchInput } from "@/components/ui/search-input";
import { 
  CreditCard, 
  Plus, 
  Euro, 
  Calendar,
  FileText,
  TrendingUp,
  DollarSign,
  Edit,
  Trash2
} from "lucide-react";
import { PaymentForm } from "@/components/forms/PaymentForm";
import { DeleteConfirmModal } from "@/components/modals/DeleteConfirmModal";
import { Payment } from "@/types";
import { usePayments, useCreatePayment, useUpdatePayment, useDeletePayment } from "@/hooks/usePayments";
import { useInvoices } from "@/hooks/useInvoices";
import { useSearch } from "@/hooks/useSearch";

const Payments = () => {
  const { data: payments = [], isLoading } = usePayments();
  const { data: invoices = [] } = useInvoices();
  const createPaymentMutation = useCreatePayment();
  const updatePaymentMutation = useUpdatePayment();
  const deletePaymentMutation = useDeletePayment();

  // Search functionality
  const { searchQuery, setSearchQuery, filteredData: filteredPayments } = useSearch(
    payments,
    [
      (payment: Payment) => payment._id.slice(0, 8),
      'method',
      'reference',
      (payment: Payment) => payment.amount.toString(),
      (payment: Payment) => {
        const invoice = invoices.find(inv => inv._id === payment.invoiceId);
        return invoice ? `${invoice.number} ${invoice.clientName}` : '';
      }
    ]
  );

  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);
  const [methodFilter, setMethodFilter] = useState<string>('all');

  const totalPayments = payments.reduce((acc, payment) => acc + payment.amount, 0);
  const paymentsThisMonth = payments.filter(payment => 
    new Date(payment.date).getMonth() === new Date().getMonth()
  ).reduce((acc, payment) => acc + payment.amount, 0);

  // Filter by payment method
  const methodFilteredPayments = methodFilter === 'all' 
    ? filteredPayments 
    : filteredPayments.filter(p => p.method === methodFilter);

  const handleCreatePayment = () => {
    setEditingPayment(null);
    setShowPaymentForm(true);
  };

  const handleEditPayment = (payment: Payment) => {
    setEditingPayment(payment);
    setShowPaymentForm(true);
  };

  const handleDeletePayment = (payment: Payment) => {
    setSelectedPayment(payment);
    setShowDeleteModal(true);
  };

  const handleSubmitPayment = async (paymentData: Partial<Payment>) => {
    if (editingPayment) {
      await updatePaymentMutation.mutateAsync({
        id: editingPayment._id,
        data: paymentData
      });
    } else {
      await createPaymentMutation.mutateAsync(paymentData);
    }
    setShowPaymentForm(false);
  };

  const confirmDeletePayment = async () => {
    if (selectedPayment) {
      await deletePaymentMutation.mutateAsync(selectedPayment._id);
      setShowDeleteModal(false);
      setSelectedPayment(null);
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'card':
        return <CreditCard className="w-4 h-4" />;
      case 'transfer':
        return <DollarSign className="w-4 h-4" />;
      case 'cash':
        return <Euro className="w-4 h-4" />;
      case 'check':
        return <FileText className="w-4 h-4" />;
      default:
        return <CreditCard className="w-4 h-4" />;
    }
  };

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case 'card':
        return 'Carte bancaire';
      case 'transfer':
        return 'Virement';
      case 'cash':
        return 'Espèces';
      case 'check':
        return 'Chèque';
      default:
        return method;
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
                <div className="text-lg">Chargement des paiements...</div>
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
                    <CreditCard className="w-8 h-8 mr-3 text-primary-600" />
                    Paiements
                  </h1>
                  <p className="text-gray-600">Suivi des paiements reçus</p>
                </div>
              </div>
              <Button onClick={handleCreatePayment} className="bg-primary-600 hover:bg-primary-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Enregistrer Paiement
              </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Euro className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Encaissé</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {totalPayments.toLocaleString('fr-FR')} €
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <TrendingUp className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Ce Mois</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {paymentsThisMonth.toLocaleString('fr-FR')} €
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <CreditCard className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Nb Paiements</p>
                      <p className="text-2xl font-bold text-gray-900">{payments.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <Euro className="w-6 h-6 text-orange-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Paiement Moyen</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {payments.length > 0 ? (totalPayments / payments.length).toFixed(0) : 0} €
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
                  <SearchInput
                    placeholder="Rechercher un paiement (ID, montant, méthode, référence, facture)..."
                    onSearch={setSearchQuery}
                    className="flex-1"
                  />
                  <Button 
                    variant={methodFilter === 'all' ? 'default' : 'outline'}
                    onClick={() => setMethodFilter('all')}
                  >
                    Tous
                  </Button>
                  <Button 
                    variant={methodFilter === 'card' ? 'default' : 'outline'}
                    onClick={() => setMethodFilter('card')}
                  >
                    Carte
                  </Button>
                  <Button 
                    variant={methodFilter === 'transfer' ? 'default' : 'outline'}
                    onClick={() => setMethodFilter('transfer')}
                  >
                    Virement
                  </Button>
                  <Button 
                    variant={methodFilter === 'cash' ? 'default' : 'outline'}
                    onClick={() => setMethodFilter('cash')}
                  >
                    Espèces
                  </Button>
                </div>
                {(searchQuery || methodFilter !== 'all') && (
                  <div className="mt-2 text-sm text-gray-500">
                    {methodFilteredPayments.length} résultat(s) trouvé(s)
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Payments List */}
            <div className="space-y-4">
              {methodFilteredPayments.map((payment) => {
                const invoice = invoices.find(inv => inv._id === payment.invoiceId);
                return (
                  <Card key={payment._id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="p-3 bg-green-100 rounded-lg">
                            {getPaymentMethodIcon(payment.method)}
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <h3 className="text-lg font-semibold text-gray-900">
                                Paiement #{payment._id.slice(0, 8)}
                              </h3>
                              <Badge variant="secondary">
                                {getPaymentMethodLabel(payment.method)}
                              </Badge>
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                              <div className="flex items-center">
                                <FileText className="w-4 h-4 mr-1" />
                                {invoice ? `Facture #${invoice.number}` : 'Facture inconnue'}
                              </div>
                              <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                {new Date(payment.date).toLocaleDateString('fr-FR')}
                              </div>
                              {payment.reference && (
                                <div className="text-xs bg-gray-100 px-2 py-1 rounded">
                                  Réf: {payment.reference}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <div className="flex items-center text-xl font-bold text-green-600">
                              <Euro className="w-5 h-5 mr-1" />
                              {payment.amount.toFixed(2)} €
                            </div>
                            <div className="text-sm text-gray-500">
                              {invoice ? invoice.clientName : 'Client inconnu'}
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Button size="sm" variant="outline" onClick={() => handleEditPayment(payment)}>
                              <Edit className="w-4 h-4 mr-1" />
                              Modifier
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleDeletePayment(payment)}>
                              <Trash2 className="w-4 h-4 mr-1" />
                              Supprimer
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* No results message */}
            {(searchQuery || methodFilter !== 'all') && methodFilteredPayments.length === 0 && (
              <div className="text-center py-12">
                <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun paiement trouvé</h3>
                <p className="text-gray-500">Essayez de modifier vos critères de recherche</p>
              </div>
            )}
          </div>
        </main>

        {/* Modals */}
        <PaymentForm
          open={showPaymentForm}
          onOpenChange={setShowPaymentForm}
          payment={editingPayment}
          onSubmit={handleSubmitPayment}
        />

        <DeleteConfirmModal
          open={showDeleteModal}
          onOpenChange={setShowDeleteModal}
          title="Supprimer le paiement"
          description={`Êtes-vous sûr de vouloir supprimer ce paiement ? Cette action est irréversible.`}
          onConfirm={confirmDeletePayment}
        />
      </div>
    </SidebarProvider>
  );
};

export default Payments;