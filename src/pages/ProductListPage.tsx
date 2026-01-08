import { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { DataTable } from '@/components/DataTable';
import { Tabs } from '@/components/Tabs';
import { Button } from '@/components/Button';

// Mock data
const mockProducts = [
  {
    id: '1',
    name: 'Premium Wireless Headphones',
    stock: 45,
    price: 299.99,
    publish: 'Published',
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    name: 'USB-C Charging Cable',
    stock: 120,
    price: 19.99,
    publish: 'Draft',
    createdAt: '2024-01-10',
  },
  {
    id: '3',
    name: 'Laptop Stand',
    stock: 0,
    price: 49.99,
    publish: 'Published',
    createdAt: '2024-01-08',
  },
  {
    id: '4',
    name: 'Mechanical Keyboard',
    stock: 78,
    price: 129.99,
    publish: 'Published',
    createdAt: '2024-01-12',
  },
  {
    id: '5',
    name: 'Wireless Mouse',
    stock: 156,
    price: 34.99,
    publish: 'Published',
    createdAt: '2024-01-14',
  },
];

export const ProductListPage = () => {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [, setActiveTab] = useState('all');

  const columns = [
    {
      id: 'name',
      header: 'Product',
      searchable: true,
      render: (row: any) => <span className="font-medium text-foreground">{row.name}</span>,
    },
    {
      id: 'createdAt',
      header: 'Create at',
      render: (row: any) => <span className="text-muted-foreground">{row.createdAt}</span>,
    },
    {
      id: 'stock',
      header: 'Stock',
      render: (row: any) => (
        <span
          className={`font-semibold ${
            row.stock === 0 ? 'text-destructive' : row.stock < 50 ? 'text-orange-500' : 'text-success'
          }`}
        >
          {row.stock}
        </span>
      ),
    },
    {
      id: 'price',
      header: 'Price',
      render: (row: any) => <span className="font-medium text-foreground">${row.price.toFixed(2)}</span>,
    },
    {
      id: 'publish',
      header: 'Publish',
      render: (row: any) => (
        <span
          className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
            row.publish === 'Published' ? 'bg-success/20 text-success' : 'bg-muted text-muted-foreground'
          }`}
        >
          {row.publish}
        </span>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      render: () => (
        <div className="flex gap-2">
          <button className="p-2 hover:bg-muted rounded-md transition-colors">
            <Edit className="h-4 w-4 text-muted-foreground hover:text-foreground" />
          </button>
          <button className="p-2 hover:bg-destructive/10 rounded-md transition-colors">
            <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
          </button>
        </div>
      ),
    },
  ];

  const tabsData = [
    {
      id: 'all',
      label: `All (${mockProducts.length})`,
      content: (
        <DataTable
          columns={columns}
          data={mockProducts}
          searchPlaceholder="Search products..."
          onSelectionChange={setSelectedProducts}
        />
      ),
    },
    {
      id: 'published',
      label: `Published (${mockProducts.filter((p) => p.publish === 'Published').length})`,
      content: (
        <DataTable
          columns={columns}
          data={mockProducts.filter((p) => p.publish === 'Published')}
          searchPlaceholder="Search products..."
          onSelectionChange={setSelectedProducts}
        />
      ),
    },
    {
      id: 'draft',
      label: `Draft (${mockProducts.filter((p) => p.publish === 'Draft').length})`,
      content: (
        <DataTable
          columns={columns}
          data={mockProducts.filter((p) => p.publish === 'Draft')}
          searchPlaceholder="Search products..."
          onSelectionChange={setSelectedProducts}
        />
      ),
    },
    {
      id: 'low-stock',
      label: `Low Stock (${mockProducts.filter((p) => p.stock < 50).length})`,
      content: (
        <DataTable
          columns={columns}
          data={mockProducts.filter((p) => p.stock < 50)}
          searchPlaceholder="Search products..."
          onSelectionChange={setSelectedProducts}
        />
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-semibold text-foreground">Product List</h1>
          <p className="text-muted-foreground mt-1">Manage and organize your products</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New product
        </Button>
      </div>

      {/* Selection info */}
      {selectedProducts.length > 0 && (
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
          <p className="text-sm text-foreground">
            {selectedProducts.length} product{selectedProducts.length !== 1 ? 's' : ''} selected
          </p>
        </div>
      )}

      {/* Tabs with table */}
      <Tabs tabs={tabsData} onChange={setActiveTab} variant="underline" />
    </div>
  );
};

export default ProductListPage;
