
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Download } from "lucide-react";
import { Invoice } from "@/types";

interface RecentInvoicesProps {
  invoices: Invoice[];
}

export function RecentInvoices({ invoices }: RecentInvoicesProps) {
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
                      {invoice.date.toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                {getStatusBadge(invoice.status)}
                <div className="flex space-x-1">
                  <Button size="sm" variant="ghost" className="p-2">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="p-2">
                    <Download className="w-4 h-4" />
                  </Button>
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
