import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SearchInput } from "@/components/ui/search-input";
import { 
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis
} from "@/components/ui/pagination";
import { 
  Package, 
  Plus, 
  Euro, 
  Tag,
  Archive,
  TrendingUp,
  Edit,
  Trash2,
  Loader2,
  AlertTriangle,
  Eye
} from "lucide-react";
import { ProductForm } from "@/components/forms/ProductForm";
import { ViewProductModal } from "@/components/modals/ViewProductModal";
import { DeleteConfirmModal } from "@/components/modals/DeleteConfirmModal";
import { Product } from "@/types";
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from "@/hooks/useProducts";
import { useSearch } from "@/hooks/useSearch";
import { usePagination } from "@/hooks/usePagination";
import { useState } from "react";

const Products = () => {
  const { data: products = [], isLoading, error } = useProducts();
  const createProductMutation = useCreateProduct();
  const updateProductMutation = useUpdateProduct();
  const deleteProductMutation = useDeleteProduct();

  // Search functionality
  const { searchQuery, setSearchQuery, filteredData: filteredProducts } = useSearch(
    products,
    [
      'name',
      'description',
      'category',
      (product: Product) => product.price.toString(),
      (product: Product) => product.isService ? 'service' : 'produit'
    ]
  );

  const [showProductForm, setShowProductForm] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const totalProducts = products.length;
  const services = products.filter(p => p.isService).length;
  const physicalProducts = products.filter(p => !p.isService).length;
  const averagePrice = totalProducts > 0 ? products.reduce((acc, p) => acc + p.price, 0) / totalProducts : 0;

  // Filter by category
  const categoryFilteredProducts = categoryFilter === 'all' 
    ? filteredProducts 
    : categoryFilter === 'services'
    ? filteredProducts.filter(p => p.isService)
    : filteredProducts.filter(p => !p.isService);

  // Pagination
  const {
    currentPage,
    totalPages,
    paginatedData: paginatedProducts,
    goToPage,
    goToPrevious,
    goToNext,
    totalItems,
    startIndex,
    endIndex
  } = usePagination(categoryFilteredProducts, 9); // 9 items per page for 3x3 grid

  const handleCreateProduct = () => {
    setEditingProduct(null);
    setShowProductForm(true);
  };

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
    setShowViewModal(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowProductForm(true);
  };

  const handleDeleteProduct = (product: Product) => {
    setSelectedProduct(product);
    setShowDeleteModal(true);
  };

  const handleSubmitProduct = (productData: Partial<Product>) => {
    if (editingProduct) {
      updateProductMutation.mutate({ id: editingProduct._id, data: productData });
    } else {
      createProductMutation.mutate(productData);
    }
    setShowProductForm(false);
  };

  const confirmDeleteProduct = () => {
    if (selectedProduct) {
      deleteProductMutation.mutate(selectedProduct._id);
      setShowDeleteModal(false);
      setSelectedProduct(null);
    }
  };

  if (isLoading) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-gray-50">
          <AppSidebar />
          <main className="flex-1 p-6">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
              </div>
            </div>
          </main>
        </div>
      </SidebarProvider>
    );
  }

  if (error) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-gray-50">
          <AppSidebar />
          <main className="flex-1 p-6">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                  <p className="text-red-600">Erreur de connexion au serveur</p>
                </div>
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
                    <Package className="w-8 h-8 mr-3 text-primary-600" />
                    Produits & Services
                  </h1>
                  <p className="text-gray-600">Gérez votre catalogue de produits et services</p>
                </div>
              </div>
              <Button onClick={handleCreateProduct} className="bg-primary-600 hover:bg-primary-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Nouveau Produit
              </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Package className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Produits</p>
                      <p className="text-2xl font-bold text-gray-900">{totalProducts}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Archive className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Services</p>
                      <p className="text-2xl font-bold text-gray-900">{services}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Package className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Produits Physiques</p>
                      <p className="text-2xl font-bold text-gray-900">{physicalProducts}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <TrendingUp className="w-6 h-6 text-orange-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Prix Moyen</p>
                      <p className="text-2xl font-bold text-gray-900">{averagePrice.toFixed(2)} FCFA</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Search and Filters */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <SearchInput
                    placeholder="Rechercher un produit (nom, description, catégorie, prix)..."
                    onSearch={setSearchQuery}
                    className="flex-1"
                  />
                  <Button 
                    variant={categoryFilter === 'all' ? 'default' : 'outline'}
                    onClick={() => setCategoryFilter('all')}
                  >
                    Tous
                  </Button>
                  <Button 
                    variant={categoryFilter === 'products' ? 'default' : 'outline'}
                    onClick={() => setCategoryFilter('products')}
                  >
                    Produits
                  </Button>
                  <Button 
                    variant={categoryFilter === 'services' ? 'default' : 'outline'}
                    onClick={() => setCategoryFilter('services')}
                  >
                    Services
                  </Button>
                </div>
                <div className="text-sm text-gray-500">
                  {(searchQuery || categoryFilter !== 'all') && `${categoryFilteredProducts.length} résultat(s) trouvé(s) - `}
                  Affichage de {startIndex} à {endIndex} sur {totalItems} produits
                </div>
              </CardContent>
            </Card>

            {/* Products Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
              {paginatedProducts.map((product) => (
                <Card key={product._id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-gray-900 flex items-center justify-between">
                      {product.name}
                      <div className="flex items-center space-x-2">
                        <Badge variant={product.isService ? "secondary" : "default"}>
                          {product.isService ? "Service" : "Produit"}
                        </Badge>
                        <div className="flex space-x-1">
                          <Button size="sm" variant="ghost" onClick={() => handleViewProduct(product)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handleEditProduct(product)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handleDeleteProduct(product)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <p className="text-sm text-gray-600">{product.description}</p>
                      
                      <div className="flex items-center text-sm text-gray-600">
                        <Tag className="w-4 h-4 mr-2" />
                        {product.category}
                      </div>
                      
                      {!product.isService && product.stock !== undefined && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Archive className="w-4 h-4 mr-2" />
                          Stock: {product.stock} unités
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <div className="flex items-center">
                          <Euro className="w-4 h-4 mr-1 text-green-600" />
                          <span className="text-xl font-bold text-green-600">
                            {product.price.toFixed(2)} FCFA
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">
                          Créé le {new Date(product.createdAt).toLocaleDateString('fr-FR')}
                        </div>
                      </div>
                      
                      <div className="flex space-x-2 pt-2">
                        {/* <Button size="sm" className="flex-1">
                          Ajouter à Facture
                        </Button> */}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mb-6">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={goToPrevious}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                      if (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      ) {
                        return (
                          <PaginationItem key={page}>
                            <PaginationLink
                              onClick={() => goToPage(page)}
                              isActive={currentPage === page}
                              className="cursor-pointer"
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      } else if (
                        page === currentPage - 2 ||
                        page === currentPage + 2
                      ) {
                        return (
                          <PaginationItem key={page}>
                            <PaginationEllipsis />
                          </PaginationItem>
                        );
                      }
                      return null;
                    })}
                    
                    <PaginationItem>
                      <PaginationNext 
                        onClick={goToNext}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}

            {/* No results message */}
            {(searchQuery || categoryFilter !== 'all') && categoryFilteredProducts.length === 0 && (
              <div className="text-center py-12">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun produit trouvé</h3>
                <p className="text-gray-500">Essayez de modifier vos critères de recherche</p>
              </div>
            )}
          </div>
        </main>

        {/* Modals */}
        <ViewProductModal
          open={showViewModal}
          onOpenChange={setShowViewModal}
          product={selectedProduct}
          onEdit={(product) => {
            setShowViewModal(false);
            handleEditProduct(product);
          }}
        />

        <ProductForm
          open={showProductForm}
          onOpenChange={setShowProductForm}
          product={editingProduct}
          onSubmit={handleSubmitProduct}
        />

        <DeleteConfirmModal
          open={showDeleteModal}
          onOpenChange={setShowDeleteModal}
          title="Supprimer le produit/service"
          description={`Êtes-vous sûr de vouloir supprimer ${selectedProduct?.name} ? Cette action est irréversible.`}
          onConfirm={confirmDeleteProduct}
        />
      </div>
    </SidebarProvider>
  );
};

export default Products;