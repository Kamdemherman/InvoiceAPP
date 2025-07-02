import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import { Invoice, InvoiceItem } from "@/types";
import { useClients } from "@/hooks/useClients";
import { useProducts } from "@/hooks/useProducts";

interface InvoiceFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice?: Invoice;
  onSubmit: (invoice: Partial<Invoice>) => void;
}

export const InvoiceForm = ({ open, onOpenChange, invoice, onSubmit }: InvoiceFormProps) => {
  const { data: clients = [] } = useClients();
  const { data: products = [] } = useProducts();

  const [formData, setFormData] = useState({
    client: invoice?.client || '',
    date: invoice?.date ? new Date(invoice.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    dueDate: invoice?.dueDate ? new Date(invoice.dueDate).toISOString().split('T')[0] : '',
    items: invoice?.items || [{ product: '', productName: '', quantity: 1, unitPrice: 0, total: 0 }] as InvoiceItem[],
    notes: invoice?.notes || ''
  });

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { product: '', productName: '', quantity: 1, unitPrice: 0, total: 0 }]
    }));
  };

  const removeItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const updateItem = (index: number, field: keyof InvoiceItem, value: any) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map((item, i) => {
        if (i === index) {
          const updatedItem = { ...item, [field]: value };
          if (field === 'product') {
            const product = products.find(p => p._id === value);
            if (product) {
              updatedItem.productName = product.name;
              updatedItem.unitPrice = product.price;
            }
          }
          if (field === 'quantity' || field === 'unitPrice') {
            updatedItem.total = updatedItem.quantity * updatedItem.unitPrice;
          }
          return updatedItem;
        }
        return item;
      })
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subtotal = formData.items.reduce((sum, item) => sum + item.total, 0);
    const tax = subtotal * 0.2; // 20% TVA
    const total = subtotal + tax;
    
    const client = clients.find(c => c._id === formData.client);
    
    const invoiceData: any = {
      client: formData.client,
      clientName: client?.name || '',
      date: new Date(formData.date),
      dueDate: new Date(formData.dueDate),
      items: formData.items,
      subtotal,
      tax,
      total,
      status: invoice?.status || 'draft',
      notes: formData.notes
    };

    // Pour les factures existantes, inclure l'ID et le numéro
    if (invoice?._id) {
      invoiceData._id = invoice._id;
      invoiceData.number = invoice.number;
    }
    // Pour les nouvelles factures, ne pas inclure le champ number du tout
    
    console.log('Submitting invoice data:', invoiceData);
    onSubmit(invoiceData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {invoice ? 'Modifier la facture' : 'Nouvelle facture'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="client">Client</Label>
              <Select value={formData.client} onValueChange={(value) => setFormData(prev => ({ ...prev, client: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un client" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map(client => (
                    <SelectItem key={client._id} value={client._id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="dueDate">Date d'échéance</Label>
              <Input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                required
              />
            </div>
          </div>

          {/* Items */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Articles</h3>
              <Button type="button" onClick={addItem} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Ajouter un article
              </Button>
            </div>
            
            {formData.items.map((item, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                    <div>
                      <Label>Produit/Service</Label>
                      <Select 
                        value={item.product} 
                        onValueChange={(value) => updateItem(index, 'product', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                        <SelectContent>
                          {products.map(product => (
                            <SelectItem key={product._id} value={product._id}>
                              {product.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label>Quantité</Label>
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value))}
                      />
                    </div>
                    
                    <div>
                      <Label>Prix unitaire</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={item.unitPrice}
                        onChange={(e) => updateItem(index, 'unitPrice', parseFloat(e.target.value))}
                      />
                    </div>
                    
                    <div>
                      <Label>Total</Label>
                      <Input
                        type="number"
                        value={item.total.toFixed(2)}
                        readOnly
                        className="bg-gray-50"
                      />
                    </div>
                    
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeItem(index)}
                      disabled={formData.items.length === 1}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Notes additionnelles..."
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit">
              {invoice ? 'Modifier' : 'Créer'} la facture
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};