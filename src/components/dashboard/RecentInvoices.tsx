import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Eye, Download, MoreHorizontal, Mail, Edit } from "lucide-react";
import { Invoice } from "@/types";
import { useUpdateInvoice } from "@/hooks/useInvoices";

interface RecentInvoicesProps {
  invoices: Invoice[];
  onViewInvoice?: (invoice: Invoice) => void;
}

export function RecentInvoices({ invoices, onViewInvoice }: RecentInvoicesProps) {
  const updateInvoiceMutation = useUpdateInvoice();

  const getStatusBadge = (status: Invoice['status']) => {
    const statusConfig = {
      draft: { color: 'bg-gray-100 text-gray-800', text: 'Brouillon' },
      sent: { color: 'bg-blue-100 text-blue-800', text: 'Envoyée' },
      paid: { color: 'bg-success-100 text-success-800', text: 'Payée' },
      overdue: { color: 'bg-red-100 text-red-800', text: 'En retard' }
    };

    const config = statusConfig[status];
    return (
      <Badge className={`${config.color} border-0`}>
        {config.text}
      </Badge>
    );
  };

  const formatDate = (dateValue: string | Date) => {
    const date = typeof dateValue === 'string' ? new Date(dateValue) : dateValue;
    return date.toLocaleDateString('fr-FR');
  };

  const handleStatusChange = (invoice: Invoice, newStatus: Invoice['status']) => {
    updateInvoiceMutation.mutate({
      id: invoice._id,
      data: { status: newStatus }
    });
  };

  const handleSendEmail = async (invoice: Invoice) => {
    try {
      // Simuler l'envoi d'email
      console.log('Envoi d\'email pour la facture:', invoice.number);
      // Ici vous pourriez appeler votre service d'email
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'email:', error);
    }
  };

  return (
    <Card className="bg-white shadow-sm border border-gray-100">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-gray-900">
          Factures récentes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {invoices.map((invoice) => (
            <div
              key={invoice._id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              <div className="flex-1">
                <div className="flex items-center space-x-4">
                  <div>
                    <p className="font-medium text-gray-900">{invoice.number}</p>
                    <p className="text-sm text-gray-500">{invoice.clientName}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">
                      {invoice.total.toFixed(2)} €
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatDate(invoice.date)}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                {getStatusBadge(invoice.status)}
                <div className="flex space-x-1">
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="p-2"
                    onClick={() => onViewInvoice?.(invoice)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="p-2">
                    <Download className="w-4 h-4" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="sm" variant="ghost" className="p-2">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleSendEmail(invoice)}>
                        <Mail className="w-4 h-4 mr-2" />
                        Envoyer par email
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleStatusChange(invoice, 'sent')}>
                        <Edit className="w-4 h-4 mr-2" />
                        Marquer comme envoyée
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleStatusChange(invoice, 'paid')}>
                        <Edit className="w-4 h-4 mr-2" />
                        Marquer comme payée
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleStatusChange(invoice, 'overdue')}>
                        <Edit className="w-4 h-4 mr-2" />
                        Marquer en retard
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          ))}
        </div>
        <Button variant="outline" className="w-full mt-4">
          Voir toutes les factures
        </Button>
      </CardContent>
    </Card>
  );
}