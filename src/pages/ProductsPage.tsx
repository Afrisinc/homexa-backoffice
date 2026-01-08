import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Eye, Edit, Trash2, TrendingUp, Loader } from 'lucide-react';
import DashboardLayout from '@/layouts/DashboardLayout';
import { DataTable } from '@/components/DataTable';
import { Tabs } from '@/components/Tabs';
import { Button } from '@/components/Button';
import { toast } from 'sonner';
import { productsAPI } from '@/lib/api';

const getStockStatusColor = (stock: number) => {
  if (stock === 0) return 'text-destructive';
  if (stock < 50) return 'text-orange-500';
  return 'text-success';
};

export const ProductsPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedProducts, setSelectedProducts] = React.useState<string[]>([]);
  const [products, setProducts] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  // Fetch products
  React.useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await productsAPI.getAll();
        console.log('Fetched products data:', data);
        setProducts(data || []);
      } catch (error) {
        console.error('Error fetching products:', error);
        toast.error('Failed to load products');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async (productId: string, productName: string) => {
    if (!confirm(`Are you sure you want to delete "${productName}"?`)) {
      return;
    }

    try {
      await productsAPI.delete(productId);

      toast.success('Product deleted successfully!');
      // Refresh products list
      setProducts(products.filter(prod => prod.id !== productId));
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
  };

  const columns = [
    {
      id: 'name',
      header: 'Product',
      searchable: true,
      render: (row: any) => (
        <div>
          <p className="font-medium text-foreground">{row.name}</p>
          <p className="text-xs text-muted-foreground">{row.sku}</p>
        </div>
      ),
    },
    {
      id: 'brand',
      header: 'Brand',
      searchable: true,
      render: (row: any) => <span className="text-sm text-foreground">{row.brand}</span>,
    },
    {
      id: 'category',
      header: 'Category',
      searchable: true,
      render: (row: any) => (
        <span className="text-sm text-muted-foreground">{row.category}</span>
      ),
    },
    {
      id: 'price',
      header: 'Price',
      render: (row: any) => (
        <div>
          <p className="font-semibold text-foreground">${row.price}</p>
          {row.discountPercent > 0 && (
            <p className="text-xs text-success">-{row.discountPercent}%</p>
          )}
        </div>
      ),
    },
    {
      id: 'stockQuantity',
      header: 'Stock',
      render: (row: any) => (
        <span className={`font-semibold ${getStockStatusColor(row.stockQuantity)}`}>
          {row.stockQuantity === 0 ? 'Out of Stock' : `${row.stockQuantity} units`}
        </span>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      render: (row: any) => (
        <span
          className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
            row.status === 'active'
              ? 'bg-success/20 text-success'
              : 'bg-muted text-muted-foreground'
          }`}
        >
          {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
        </span>
      ),
    },
    {
      id: 'isFeatured',
      header: 'Featured',
      render: (row: any) =>
        row.isFeatured ? (
          <TrendingUp className="h-4 w-4 text-primary" />
        ) : (
          <span className="text-muted-foreground">—</span>
        ),
    },
    {
      id: 'actions',
      header: 'Actions',
      render: (row: any) => (
        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/dashboard/products/${row.id}/view`)}
            className="p-2 hover:bg-muted rounded-md transition-colors"
            title="View"
          >
            <Eye className="h-4 w-4 text-muted-foreground hover:text-foreground" />
          </button>
          <button
            onClick={() => navigate(`/dashboard/products/${row.id}/edit`)}
            className="p-2 hover:bg-muted rounded-md transition-colors"
            title="Edit"
          >
            <Edit className="h-4 w-4 text-muted-foreground hover:text-foreground" />
          </button>
          <button
            onClick={() => handleDelete(row.id, row.name)}
            className="p-2 hover:bg-destructive/10 rounded-md transition-colors"
            title="Delete"
          >
            <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
          </button>
        </div>
      ),
    },
  ];

  const allProducts = products;
  const activeProducts = products.filter(p => p.status === 'active');
  const lowStockProducts = products.filter(p => p.stockQuantity > 0 && p.stockQuantity < 50);
  const outOfStockProducts = products.filter(p => p.stockQuantity === 0);

  const tabs = [
    {
      id: 'all',
      label: `All Products (${allProducts.length})`,
      content: (
        <DataTable
          columns={columns}
          data={allProducts}
          searchPlaceholder="Search products..."
          onSelectionChange={setSelectedProducts}
        />
      ),
    },
    {
      id: 'active',
      label: `Active (${activeProducts.length})`,
      content: (
        <DataTable
          columns={columns}
          data={activeProducts}
          searchPlaceholder="Search active products..."
          onSelectionChange={setSelectedProducts}
        />
      ),
    },
    {
      id: 'low-stock',
      label: `Low Stock (${lowStockProducts.length})`,
      content: (
        <DataTable
          columns={columns}
          data={lowStockProducts}
          searchPlaceholder="Search low stock products..."
          onSelectionChange={setSelectedProducts}
        />
      ),
    },
    {
      id: 'out-of-stock',
      label: `Out of Stock (${outOfStockProducts.length})`,
      content: (
        <DataTable
          columns={columns}
          data={outOfStockProducts}
          searchPlaceholder="Search out of stock products..."
          onSelectionChange={setSelectedProducts}
        />
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-serif font-semibold text-foreground">Products</h1>
            <p className="text-muted-foreground mt-1">Manage all products across your platform</p>
          </div>
          <Button
            onClick={() => navigate('/dashboard/products/create')}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Product
          </Button>
        </div>

        {/* Selection info */}
        {selectedProducts.length > 0 && (
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 flex items-center justify-between">
            <p className="text-sm text-foreground">
              {selectedProducts.length} product{selectedProducts.length !== 1 ? 's' : ''} selected
            </p>
            <div className="flex gap-2">
              <button className="text-xs px-3 py-1 hover:bg-primary/20 rounded transition-colors text-primary">
                Publish
              </button>
              <button className="text-xs text-destructive hover:underline">Delete Selected</button>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center gap-3">
                <Loader className="h-8 w-8 text-primary animate-spin" />
                <p className="text-sm text-muted-foreground">Loading products...</p>
              </div>
            </div>
          ) : products.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-4">No products found</p>
                <Button
                  onClick={() => navigate('/dashboard/products/create')}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Create First Product
                </Button>
              </div>
            </div>
          ) : (
            <Tabs tabs={tabs} variant="underline" />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProductsPage;
