
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Payment } from "@/types";
import { useInvoices } from "@/hooks/useInvoices";

interface PaymentFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payment?: Payment | null;
  onSubmit: (payment: Partial<Payment>) => void;
}

export const PaymentForm = ({ open, onOpenChange, payment, onSubmit }: PaymentFormProps) => {
  const { data: invoices = [] } = useInvoices();
  
  const [formData, setFormData] = useState({
    invoiceId: payment?.invoiceId || '',
    amount: payment?.amount || 0,
    date: payment?.date ? new Date(payment.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    method: payment?.method || 'card' as const,
    reference: payment?.reference || '',
    status: payment?.status || 'completed' as const
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      invoice: formData.invoiceId,
      date: new Date(formData.date)
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {payment ? 'Modifier le paiement' : 'Enregistrer un paiement'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="invoice">Facture</Label>
            <Select value={formData.invoiceId} onValueChange={(value) => setFormData(prev => ({ ...prev, invoiceId: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une facture" />
              </SelectTrigger>
              <SelectContent>
                {invoices.map(invoice => (
                  <SelectItem key={invoice._id} value={invoice._id}>
                    {invoice.number} - {invoice.clientName} ({invoice.total.toFixed(2)} €)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="amount">Montant (€)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: parseFloat(e.target.value) }))}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="date">Date du paiement</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="method">Méthode de paiement</Label>
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
