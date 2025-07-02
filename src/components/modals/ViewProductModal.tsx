import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Package, Tag, Euro, Archive, Calendar } from "lucide-react";
import { Product } from "@/types";

interface ViewProductModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
  onEdit?: (product: Product) => void;
}

export const ViewProductModal = ({ open, onOpenChange, product, onEdit }: ViewProductModalProps) => {
  if (!product) return null;

  const formatDate = (dateValue: string | Date) => {
    const date = typeof dateValue === 'string' ? new Date(dateValue) : dateValue;
    return date.toLocaleDateString('fr-FR');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl flex items-center">
              <Package className="w-6 h-6 mr-2" />
              {product.name}
            </DialogTitle>
            <Badge variant={product.isService ? "secondary" : "default"}>
              {product.isService ? "Service" : "Produit"}
            </Badge>
          </div>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Description</h3>
            <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
              {product.description}
            </p>
          </div>

          <Separator />

          {/* Détails */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Détails</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <Tag className="w-4 h-4 mr-2 text-gray-500" />
                <span className="text-sm">Catégorie: {product.category}</span>
              </div>
              <div className="flex items-center">
                <Euro className="w-4 h-4 mr-2 text-gray-500" />
                <span className="text-sm">Prix: {product.price.toFixed(2)} €</span>
              </div>
              {!product.isService && (
                <div className="flex items-center">
                  <Archive className="w-4 h-4 mr-2 text-gray-500" />
                  <span className="text-sm">Stock: {product.stock} unités</span>
                </div>
              )}
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                <span className="text-sm">Créé le: {formatDate(product.createdAt)}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Prix en évidence */}
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center justify-center">
              <Euro className="w-6 h-6 text-green-600 mr-2" />
              <span className="text-3xl font-bold text-green-600">
                {product.price.toFixed(2)} €
              </span>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Fermer
            </Button>
            <Button onClick={() => onEdit?.(product)}>
              Modifier
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};