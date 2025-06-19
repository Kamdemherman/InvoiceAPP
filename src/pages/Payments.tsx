
import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  CreditCard, 
  Plus, 
  Search, 
  Euro, 
  Calendar,
  FileText,
  TrendingUp,
  DollarSign,
  Edit,
  Trash2
} from "lucide-react";
import { mockPayments, mockInvoices } from "@/data/mockData";
import { PaymentForm } from "@/components/forms/PaymentForm";
import { DeleteConfirmModal } from "@/components/modals/DeleteConfirmModal";
import { Payment } from "@/types";
import { toast } from "sonner";

const Payments = () => {
  const [payments, setPayments] = useState(mockPayments);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);

  const totalPayments = payments.reduce((acc, payment) => acc + payment.amount, 0);
  const paymentsThisMonth = payments.filter(payment => 
    payment.date.getMonth() === new Date().getMonth()
  ).reduce((acc, payment) => acc + payment.amount, 0);

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

  const handleSubmitPayment = (paymentData: Partial<Payment>) => {
    if (editingPayment) {
      setPayments(prev => prev.map(payment => 
        payment._id === editingPayment._id 
          ? { ...payment, ...paymentData }
          : payment
      ));
      toast.success("Paiement modifié avec succès");
    } else {
      const newPayment: Payment = {
        _id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
        ...paymentData as Payment
      };
      setPayments(prev => [...prev, newPayment]);
      toast.success("Paiement enregistré avec succès");
    }
  };

  const confirmDeletePayment = () => {
    if (selectedPayment) {
      setPayments(prev => prev.filter(payment => payment._id !== selectedPayment._id));
      toast.success("Paiement supprimé avec succès");
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
                      <p className="text-2xl font-bold text-gray-900">{mockPayments.length}</p>
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
                        {(totalPayments / mockPayments.length).toFixed(0)} €
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
                      placeholder="Rechercher un paiement..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <Button variant="outline">Tous</Button>
                  <Button variant="outline">Carte</Button>
                  <Button variant="outline">Virement</Button>
                  <Button variant="outline">Espèces</Button>
                </div>
              </CardContent>
            </Card>

            {/* Payments List */}
            <div className="space-y-4">
              {payments.map((payment) => {
                const invoice = mockInvoices.find(inv => inv._id === payment.invoiceId);
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
                                {payment.date.toLocaleDateString('fr-FR')}
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
