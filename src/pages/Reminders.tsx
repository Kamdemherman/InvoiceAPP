import React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Mail, Clock, Send, X, AlertTriangle } from "lucide-react";
import { 
  useReminders, 
  useSendOverdueReminders, 
  useSendWeeklyReminders, 
  useSendAllReminders,
  useCancelReminder 
} from "@/hooks/useReminders";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const Reminders = () => {
  const { data: reminders, isLoading } = useReminders();
  const sendOverdueMutation = useSendOverdueReminders();
  const sendWeeklyMutation = useSendWeeklyReminders();
  const sendAllMutation = useSendAllReminders();
  const cancelMutation = useCancelReminder();

  const handleSendOverdueReminders = () => {
    sendOverdueMutation.mutate();
  };

  const handleSendWeeklyReminders = () => {
    sendWeeklyMutation.mutate();
  };

  const handleSendAllReminders = () => {
    sendAllMutation.mutate();
  };

  const handleCancelReminder = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir annuler cette relance ?')) {
      cancelMutation.mutate(id);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'sent':
        return <Badge variant="secondary">Envoyée</Badge>;
      case 'failed':
        return <Badge variant="destructive">Échec</Badge>;
      case 'cancelled':
        return <Badge variant="outline">Annulée</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'overdue':
        return <Badge variant="destructive">Retard</Badge>;
      case 'weekly':
        return <Badge variant="default">Hebdomadaire</Badge>;
      default:
        return <Badge>{type}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-gray-50">
          <AppSidebar />
          <main className="flex-1 p-6">
            <div className="max-w-7xl mx-auto">
              <div className="text-center py-20">
                <div className="text-lg">Chargement des relances...</div>
              </div>
            </div>
          </main>
        </div>
      </SidebarProvider>
    );
  }

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
                    <Mail className="w-8 h-8 mr-3 text-primary-600" />
                    Relances Client
                  </h1>
                  <p className="text-gray-600">Gérez les relances automatiques pour les factures impayées</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <AlertTriangle className="w-5 h-5 mr-2 text-red-500" />
                    Factures en retard
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Envoyer des relances pour toutes les factures en retard de paiement
                  </p>
                  <Button 
                    onClick={handleSendOverdueReminders}
                    disabled={sendOverdueMutation.isPending}
                    className="w-full"
                    variant="destructive"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {sendOverdueMutation.isPending ? 'Envoi...' : 'Envoyer relances retard'}
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <Clock className="w-5 h-5 mr-2 text-blue-500" />
                    Relances hebdomadaires
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Traiter les relances hebdomadaires programmées
                  </p>
                  <Button 
                    onClick={handleSendWeeklyReminders}
                    disabled={sendWeeklyMutation.isPending}
                    className="w-full"
                  >
                    <Clock className="w-4 h-4 mr-2" />
                    {sendWeeklyMutation.isPending ? 'Traitement...' : 'Traiter hebdomadaires'}
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <Mail className="w-5 h-5 mr-2 text-green-500" />
                    Toutes les relances
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Traiter automatiquement toutes les relances
                  </p>
                  <Button 
                    onClick={handleSendAllReminders}
                    disabled={sendAllMutation.isPending}
                    className="w-full"
                    variant="outline"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {sendAllMutation.isPending ? 'Traitement...' : 'Traiter toutes'}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Liste des relances */}
            <Card>
              <CardHeader>
                <CardTitle>Historique des relances</CardTitle>
              </CardHeader>
              <CardContent>
                {reminders && reminders.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Facture</TableHead>
                        <TableHead>Client</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Envoyée le</TableHead>
                        <TableHead>Prochaine relance</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reminders.map((reminder) => (
                        <TableRow key={reminder._id}>
                          <TableCell className="font-medium">
                            {reminder.invoiceNumber}
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{reminder.clientName}</div>
                              <div className="text-sm text-gray-500">{reminder.clientEmail}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {getTypeBadge(reminder.type)}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              #{reminder.reminderCount}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {format(new Date(reminder.sentAt), 'dd/MM/yyyy HH:mm', { locale: fr })}
                          </TableCell>
                          <TableCell>
                            {reminder.status === 'sent' ? (
                              format(new Date(reminder.nextReminderDate), 'dd/MM/yyyy', { locale: fr })
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(reminder.status)}
                          </TableCell>
                          <TableCell>
                            {reminder.status === 'sent' && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleCancelReminder(reminder._id)}
                                disabled={cancelMutation.isPending}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <Mail className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>Aucune relance trouvée</p>
                    <p className="text-sm">Les relances apparaîtront ici une fois envoyées</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Reminders;