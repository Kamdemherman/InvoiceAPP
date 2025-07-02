import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { User, Mail, Phone, MapPin, Building, Euro, FileText } from "lucide-react";
import { Client } from "@/types";

interface ViewClientModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client: Client | null;
  onEdit?: (client: Client) => void;
}

export const ViewClientModal = ({ open, onOpenChange, client, onEdit }: ViewClientModalProps) => {
  if (!client) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl flex items-center">
              <Building className="w-6 h-6 mr-2" />
              {client.name}
            </DialogTitle>
            <Badge variant={client.totalAmount && client.totalAmount > 0 ? "default" : "secondary"}>
              {client.totalAmount && client.totalAmount > 0 ? "Actif" : "Inactif"}
            </Badge>
          </div>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Informations de contact */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Informations de contact</h3>
            <div className="space-y-3">
              <div className="flex items-center text-sm">
                <Mail className="w-4 h-4 mr-2 text-gray-500" />
                <span>{client.email}</span>
              </div>
              <div className="flex items-center text-sm">
                <Phone className="w-4 h-4 mr-2 text-gray-500" />
                <span>{client.phone}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Adresse */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Adresse</h3>
            <div className="flex items-start text-sm">
              <MapPin className="w-4 h-4 mr-2 mt-1 text-gray-500" />
              <div>
                <p>{client.address.street}</p>
                <p>{client.address.postalCode} {client.address.city}</p>
                <p>{client.address.country}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Statistiques */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Statistiques</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <FileText className="w-5 h-5 text-blue-600 mr-2" />
                  <div>
                    <p className="text-sm text-gray-600">Factures</p>
                    <p className="text-xl font-bold text-blue-600">{client.totalInvoices || 0}</p>
                  </div>
                </div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <Euro className="w-5 h-5 text-green-600 mr-2" />
                  <div>
                    <p className="text-sm text-gray-600">CA Total</p>
                    <p className="text-xl font-bold text-green-600">
                      {(client.totalAmount || 0).toLocaleString('fr-FR')} €
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Fermer
            </Button>
            <Button onClick={() => onEdit?.(client)}>
              Modifier
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};