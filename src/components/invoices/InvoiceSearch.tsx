import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/search-input";
import { Badge } from "@/components/ui/badge";
import { Calendar, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";

interface InvoiceSearchProps {
  onSearch: (query: string) => void;
  onStatusFilter: (status: string) => void;
  onDateFilter: (dateRange: { start?: string; end?: string }) => void;
  currentStatus: string;
  resultsCount?: number;
  searchQuery?: string;
}

export const InvoiceSearch = ({ 
  onSearch, 
  onStatusFilter, 
  onDateFilter, 
  currentStatus, 
  resultsCount,
  searchQuery 
}: InvoiceSearchProps) => {
  const [showFilters, setShowFilters] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleDateFilter = () => {
    onDateFilter({ start: startDate, end: endDate });
  };

  const clearDateFilter = () => {
    setStartDate("");
    setEndDate("");
    onDateFilter({});
  };

  const statusOptions = [
    { value: 'all', label: 'Toutes', color: 'default' },
    { value: 'draft', label: 'Brouillon', color: 'secondary' },
    { value: 'sent', label: 'Envoyée', color: 'default' },
    { value: 'paid', label: 'Payée', color: 'success' },
    { value: 'overdue', label: 'En retard', color: 'destructive' }
  ];

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Search and main filters */}
          <div className="flex items-center space-x-4">
            <SearchInput
              placeholder="Rechercher une facture (numéro, client, montant)..."
              onSearch={onSearch}
              className="flex-1"
            />
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2"
            >
              <Filter className="w-4 h-4" />
              <span>Filtres</span>
            </Button>
          </div>

          {/* Status filters */}
          <div className="flex items-center space-x-2 flex-wrap">
            {statusOptions.map((status) => (
              <Button
                key={status.value}
                variant={currentStatus === status.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => onStatusFilter(status.value)}
                className="mb-2"
              >
                {status.label}
              </Button>
            ))}
          </div>

          {/* Advanced filters */}
          {showFilters && (
            <div className="border-t pt-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date de début
                  </label>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date de fin
                  </label>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
                <div className="flex items-end space-x-2">
                  <Button onClick={handleDateFilter} size="sm">
                    <Calendar className="w-4 h-4 mr-2" />
                    Appliquer
                  </Button>
                  <Button onClick={clearDateFilter} variant="outline" size="sm">
                    Effacer
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Results count */}
          {(searchQuery || currentStatus !== 'all' || startDate || endDate) && (
            <div className="text-sm text-gray-500 flex items-center space-x-2">
              <span>{resultsCount || 0} résultat(s) trouvé(s)</span>
              {(searchQuery || currentStatus !== 'all' || startDate || endDate) && (
                <div className="flex items-center space-x-1">
                  {searchQuery && (
                    <Badge variant="outline" className="text-xs">
                      Recherche: {searchQuery}
                    </Badge>
                  )}
                  {currentStatus !== 'all' && (
                    <Badge variant="outline" className="text-xs">
                      Statut: {statusOptions.find(s => s.value === currentStatus)?.label}
                    </Badge>
                  )}
                  {(startDate || endDate) && (
                    <Badge variant="outline" className="text-xs">
                      Date: {startDate || '...'} - {endDate || '...'}
                    </Badge>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};