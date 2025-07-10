
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Payment } from "@/types";
import { useInvoices } from "@/hooks/useInvoices";
import { paymentsAPI } from "@/services/api";

interface PaymentFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payment?: Payment | null;
  onSubmit: (payment: Partial<Payment>) => void;
}

export const PaymentForm = ({ open, onOpenChange, payment, onSubmit }: PaymentFormProps) => {
  const { data: invoices = [] } = useInvoices();
  const [existingPayments, setExistingPayments] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    invoiceId: payment?.invoiceId || '',
    amount: payment?.amount || 0,
    date: payment?.date ? new Date(payment.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    method: payment?.method || 'card' as const,
    reference: payment?.reference || '',
    status: payment?.status || 'completed' as const
  });

  // Charger les paiements existants pour la facture sélectionnée
  useEffect(() => {
    if (formData.invoiceId) {
      fetchExistingPayments(formData.invoiceId);
    } else {
      setExistingPayments(null);
    }
  }, [formData.invoiceId]);

  const fetchExistingPayments = async (invoiceId: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/payments/invoice/${invoiceId}`);
      if (response.ok) {
        const data = await response.json();
        setExistingPayments(data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des paiements:', error);
    }
  };

  const selectedInvoice = invoices.find(inv => inv._id === formData.invoiceId);
  const remainingAmount = selectedInvoice && existingPayments 
    ? selectedInvoice.total - existingPayments.totalPaid 
    : selectedInvoice?.total || 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      invoice: formData.invoiceId,
      date: new Date(formData.date)
    });
    onOpenChange(false);
  };

  const handleAmountQuickFill = (amount: number) => {
    setFormData(prev => ({ ...prev, amount }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {payment ? 'Modifier le paiement' : 'Enregistrer un paiement'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="invoice">Facture *</Label>
            <Select value={formData.invoiceId} onValueChange={(value) => setFormData(prev => ({ ...prev, invoiceId: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une facture" />
              </SelectTrigger>
              <SelectContent>
                {invoices.map(invoice => (
                  <SelectItem key={invoice._id} value={invoice._id}>
                    <div className="flex items-center justify-between w-full">
                      <span>{invoice.number} - {invoice.clientName}</span>
                      <div className="flex items-center space-x-2">
                        <span>{invoice.total.toFixed(2)} €</span>
                        <Badge variant={
                          invoice.status === 'paid' ? 'default' : 
                          invoice.status === 'partially_paid' ? 'secondary' : 
                          'outline'
                        }>
                          {invoice.status === 'paid' ? 'Payée' : 
                           invoice.status === 'partially_paid' ? 'Partiel' : 
                           'Non payée'}
                        </Badge>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Affichage des informations de paiement existantes */}
          {selectedInvoice && existingPayments && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Total facture:</strong> {selectedInvoice.total.toFixed(2)} €
                  </div>
                  <div>
                    <strong>Déjà payé:</strong> {existingPayments.totalPaid.toFixed(2)} €
                  </div>
                  <div>
                    <strong>Restant à payer:</strong> {remainingAmount.toFixed(2)} €
                  </div>
                  <div>
                    <strong>Paiements existants:</strong> {existingPayments.paymentCount}
                  </div>
                </div>
                
                {remainingAmount > 0 && (
                  <div className="mt-3 flex gap-2">
                    <Button 
                      type="button" 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleAmountQuickFill(remainingAmount)}
                    >
                      Paiement complet ({remainingAmount.toFixed(2)} €)
                    </Button>
                    <Button 
                      type="button" 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleAmountQuickFill(remainingAmount / 2)}
                    >
                      50% ({(remainingAmount / 2).toFixed(2)} €)
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="amount">Montant (€) *</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                max={remainingAmount > 0 ? remainingAmount : undefined}
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: parseFloat(e.target.value) }))}
                required
              />
              {remainingAmount > 0 && formData.amount > remainingAmount && (
                <p className="text-sm text-red-600 mt-1">
                  ⚠️ Le montant dépasse le reste à payer ({remainingAmount.toFixed(2)} €)
                </p>
              )}
            </div>
            
            <div>
              <Label htmlFor="date">Date du paiement *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="method">Méthode de paiement *</Label>
              <Select value={formData.method} onValueChange={(value: any) => setFormData(prev => ({ ...prev, method: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="card">Carte bancaire</SelectItem>
                  <SelectItem value="transfer">Virement</SelectItem>
                  <SelectItem value="cash">Espèces</SelectItem>
                  <SelectItem value="check">Chèque</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="status">Statut *</Label>
              <Select value={formData.status} onValueChange={(value: any) => setFormData(prev => ({ ...prev, status: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="completed">Confirmé</SelectItem>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="failed">Échoué</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="reference">Référence (optionnel)</Label>
            <Input
              id="reference"
              value={formData.reference}
              onChange={(e) => setFormData(prev => ({ ...prev, reference: e.target.value }))}
              placeholder="Numéro de transaction, référence..."
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit">
              {payment ? 'Modifier' : 'Enregistrer'} le paiement
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};