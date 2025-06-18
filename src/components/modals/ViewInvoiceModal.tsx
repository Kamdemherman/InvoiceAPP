
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, User, Euro, Mail, Phone, MapPin } from "lucide-react";
import { Invoice } from "@/types";
import { mockClients } from "@/data/mockData";

interface ViewInvoiceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice: Invoice | null;
}

export const ViewInvoiceModal = ({ open, onOpenChange, invoice }: ViewInvoiceModalProps) => {
  if (!invoice) return null;

  const client = mockClients.find(c => c.id === invoice.clientId);

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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl">
              Facture #{invoice.number}
            </DialogTitle>
            {getStatusBadge(invoice.status)}
          </div>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* En-tête de la facture */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Informations de facturation</h3>
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <Calendar className="w-4 h-4 mr-2" />
                  Date: {invoice.date.toLocaleDateString('fr-FR')}
                </div>
                <div className="flex items-center text-sm">
                  <Calendar className="w-4 h-4 mr-2" />
                  Échéance: {invoice.dueDate.toLocaleDateString('fr-FR')}
                </div>
              </div>
            </div>
            
            {client && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Client</h3>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <User className="w-4 h-4 mr-2" />
                    {client.name}
                  </div>
                  <div className="flex items-center text-sm">
                    <Mail className="w-4 h-4 mr-2" />
                    {client.email}
                  </div>
                  <div className="flex items-center text-sm">
                    <Phone className="w-4 h-4 mr-2" />
                    {client.phone}
                  </div>
                  <div className="flex items-center text-sm">
                    <MapPin className="w-4 h-4 mr-2" />
                    {client.address.street}, {client.address.city} {client.address.postalCode}
                  </div>
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Articles de la facture */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Articles</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 px-3 font-medium text-gray-700">Produit/Service</th>
                    <th className="text-right py-2 px-3 font-medium text-gray-700">Quantité</th>
                    <th className="text-right py-2 px-3 font-medium text-gray-700">Prix unitaire</th>
                    <th className="text-right py-2 px-3 font-medium text-gray-700">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item, index) => (
                    <tr key={index} className="border-b border-gray-100">
                      <td className="py-3 px-3">{item.productName}</td>
                      <td className="text-right py-3 px-3">{item.quantity}</td>
                      <td className="text-right py-3 px-3">{item.unitPrice.toFixed(2)} €</td>
                      <td className="text-right py-3 px-3 font-medium">{item.total.toFixed(2)} €</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <Separator />

          {/* Totaux */}
          <div className="flex justify-end">
            <div className="w-64 space-y-2">
              <div className="flex justify-between">
                <span>Sous-total:</span>
                <span>{invoice.subtotal.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between">
                <span>TVA (20%):</span>
                <span>{invoice.tax.toFixed(2)} €</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span className="flex items-center">
                  <Euro className="w-4 h-4 mr-1" />
                  {invoice.total.toFixed(2)} €
                </span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {invoice.notes && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Notes</h3>
              <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">
                {invoice.notes}
              </p>
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Fermer
            </Button>
            <Button>
              Télécharger PDF
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
