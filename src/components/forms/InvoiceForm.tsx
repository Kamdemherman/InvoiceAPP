
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Calculator } from "lucide-react";
import { Invoice, InvoiceItem, Client, Product } from "@/types";
import { useClients } from "@/hooks/useClients";
import { useProducts } from "@/hooks/useProducts";
import { useCompanySettings } from "@/hooks/useSettings";

interface InvoiceFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice?: Invoice | null;
  onSubmit: (invoice: Partial<Invoice>) => void;
}

export const InvoiceForm = ({ open, onOpenChange, invoice, onSubmit }: InvoiceFormProps) => {
  const { data: clients = [] } = useClients();
  const { data: products = [] } = useProducts();
  const { data: companySettings } = useCompanySettings();
  
  const [formData, setFormData] = useState({
    client: invoice?.client || '',
    clientName: invoice?.clientName || '',
    date: invoice?.date ? new Date(invoice.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    dueDate: invoice?.dueDate ? new Date(invoice.dueDate).toISOString().split('T')[0] : '',
    items: invoice?.items || [],
    subtotal: invoice?.subtotal || 0,
    tax: invoice?.tax || 0,
    total: invoice?.total || 0,
    status: invoice?.status || 'draft',
    notes: invoice?.notes || ''
  });

  const [selectedItems, setSelectedItems] = useState<InvoiceItem[]>(
    invoice?.items || []
  );

  // Utiliser le taux de TVA par défaut des paramètres de l'entreprise
  const defaultVatRate = companySettings?.defaultVatRate || 20;

  useEffect(() => {
    if (invoice) {
      setFormData({
        client: invoice.client || '',
        clientName: invoice.clientName || '',
        date: new Date(invoice.date).toISOString().split('T')[0],
        dueDate: new Date(invoice.dueDate).toISOString().split('T')[0],
        items: invoice.items || [],
        subtotal: invoice.subtotal || 0,
        tax: invoice.tax || 0,
        total: invoice.total || 0,
        status: invoice.status || 'draft',
        notes: invoice.notes || ''
      });
      setSelectedItems(invoice.items || []);
    } else {
      // Calculer la date d'échéance par défaut (30 jours)
      const paymentDelay = companySettings?.paymentDelay || 30;
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + paymentDelay);
      
      setFormData({
        client: '',
        clientName: '',
        date: new Date().toISOString().split('T')[0],
        dueDate: dueDate.toISOString().split('T')[0],
        items: [],
        subtotal: 0,
        tax: 0,
        total: 0,
        status: 'draft',
        notes: ''
      });
      setSelectedItems([]);
    }
  }, [invoice, companySettings]);

  const handleClientChange = (clientId: string) => {
    const selectedClient = clients.find((c: Client) => c._id === clientId);
    if (selectedClient) {
      setFormData(prev => ({
        ...prev,
        client: clientId,
        clientName: selectedClient.name
      }));
    }
  };

  const addItem = () => {
    const newItem: InvoiceItem = {
      product: '',
      productName: '',
      quantity: 1,
      unitPrice: 0,
      total: 0
    };
    setSelectedItems([...selectedItems, newItem]);
  };

  const updateItem = (index: number, field: keyof InvoiceItem, value: any) => {
    const updatedItems = [...selectedItems];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    
    if (field === 'product') {
      const selectedProduct = products.find((p: Product) => p._id === value);
      if (selectedProduct) {
        updatedItems[index].productName = selectedProduct.name;
        updatedItems[index].unitPrice = selectedProduct.price;
      }
    }
    
    // Recalculer le total de l'item
    if (field === 'quantity' || field === 'unitPrice' || field === 'product') {
      updatedItems[index].total = updatedItems[index].quantity * updatedItems[index].unitPrice;
    }
    
    setSelectedItems(updatedItems);
    calculateTotals(updatedItems);
  };

  const removeItem = (index: number) => {
    const updatedItems = selectedItems.filter((_, i) => i !== index);
    setSelectedItems(updatedItems);
    calculateTotals(updatedItems);
  };

  const calculateTotals = (items: InvoiceItem[]) => {
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const tax = subtotal * (defaultVatRate / 100);
    const total = subtotal + tax;
    
    setFormData(prev => ({
      ...prev,
      items,
      subtotal,
      tax,
      total
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      items: selectedItems,
      date: new Date(formData.date),
      dueDate: new Date(formData.dueDate)
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {invoice ? 'Modifier la facture' : 'Créer une nouvelle facture'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Client et dates */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="client">Client *</Label>
              <Select value={formData.client} onValueChange={handleClientChange} required>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un client" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client: Client) => (
                    <SelectItem key={client._id} value={client._id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="date">Date de facture</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="dueDate">Date d'échéance</Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                required
              />
            </div>
          </div>

          {/* Articles */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Calculator className="w-5 h-5 mr-2" />
                  Articles
                </CardTitle>
                <Button type="button" onClick={addItem} size="sm">
                  <Plus className="w-4 h-4 mr-1" />
                  Ajouter un article
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {selectedItems.map((item, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border rounded-lg">
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
                          {products.map((product: Product) => (
                            <SelectItem key={product._id} value={product._id}>
                              {product.name} - {product.price.toFixed(2)} €
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
                        onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                      />
                    </div>
                    
                    <div>
                      <Label>Prix unitaire (€)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        value={item.unitPrice}
                        onChange={(e) => updateItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    
                    <div>
                      <Label>Total (€)</Label>
                      <div className="h-10 flex items-center px-3 border rounded-md bg-gray-50">
                        {item.total.toFixed(2)} €
                      </div>
                    </div>
                    
                    <div className="flex items-end">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeItem(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                
                {selectedItems.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    Aucun article ajouté. Cliquez sur "Ajouter un article" pour commencer.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Totaux */}
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-end">
                <div className="w-64 space-y-2">
                  <div className="flex justify-between">
                    <span>Sous-total HT:</span>
                    <span className="font-medium">{formData.subtotal.toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between">
                    <span>TVA ({defaultVatRate}%):</span>
                    <span className="font-medium">{formData.tax.toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t pt-2">
                    <span>Total TTC:</span>
                    <span>{formData.total.toFixed(2)} €</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Notes (optionnel)</Label>
            <Textarea
              id="notes"
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Notes additionnelles pour cette facture..."
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