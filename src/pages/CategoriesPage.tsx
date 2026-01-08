import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Eye, Edit, Trash2, ChevronRight, Loader } from 'lucide-react';
import DashboardLayout from '@/layouts/DashboardLayout';
import { DataTable } from '@/components/DataTable';
import { Button } from '@/components/Button';
import { toast } from 'sonner';
import { categoriesAPI } from '@/lib/api';

export const CategoriesPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>([]);
  const [categories, setCategories] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  // Fetch categories
  React.useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const data = await categoriesAPI.getAll();
        setCategories(data || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast.error('Failed to load categories');
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleDelete = async (categoryId: string, categoryName: string) => {
    if (!confirm(`Are you sure you want to delete "${categoryName}"?`)) {
      return;
    }

    try {
      await categoriesAPI.delete(categoryId);

      toast.success('Category deleted successfully!');
      // Refresh categories list
      setCategories(categories.filter(cat => cat.id !== categoryId));
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Failed to delete category');
    }
  };

  const columns = [
    {
      id: 'name',
      header: 'Category Name',
      searchable: true,
      render: (row: any) => (
        <div>
          <p className="font-medium text-foreground">{row.name}</p>
          <p className="text-xs text-muted-foreground">{row.slug}</p>
        </div>
      ),
    },
    {
      id: 'description',
      header: 'Description',
      searchable: true,
      render: (row: any) => (
        <span className="text-sm text-muted-foreground line-clamp-1">{row.description}</span>
      ),
    },
    {
      id: 'childCount',
      header: 'Subcategories',
      render: (row: any) => (
        <span className="inline-flex items-center gap-2 text-sm text-foreground">
          {row.childCount}
          {row.childCount > 0 && <ChevronRight className="h-4 w-4" />}
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
      id: 'createdAt',
      header: 'Created',
      render: (row: any) => (
        <span className="text-muted-foreground text-sm">{row.createdAt}</span>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      render: (row: any) => (
        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/dashboard/categories/${row.id}/view`)}
            className="p-2 hover:bg-muted rounded-md transition-colors"
            title="View"
          >
            <Eye className="h-4 w-4 text-muted-foreground hover:text-foreground" />
          </button>
          <button
            onClick={() => navigate(`/dashboard/categories/${row.id}/edit`)}
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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-serif font-semibold text-foreground">Categories</h1>
            <p className="text-muted-foreground mt-1">Manage product categories and subcategories</p>
          </div>
          <Button
            onClick={() => navigate('/dashboard/categories/create')}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            New Category
          </Button>
        </div>

        {/* Selection info */}
        {selectedCategories.length > 0 && (
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 flex items-center justify-between">
            <p className="text-sm text-foreground">
              {selectedCategories.length} categor{selectedCategories.length === 1 ? 'y' : 'ies'} selected
            </p>
            <button className="text-xs text-destructive hover:underline">Delete Selected</button>
          </div>
        )}

        {/* Table */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center gap-3">
                <Loader className="h-8 w-8 text-primary animate-spin" />
                <p className="text-sm text-muted-foreground">Loading categories...</p>
              </div>
            </div>
          ) : categories.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-4">No categories found</p>
                <Button
                  onClick={() => navigate('/dashboard/categories/create')}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Create First Category
                </Button>
              </div>
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={categories}
              searchPlaceholder="Search categories..."
              onSelectionChange={setSelectedCategories}
            />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CategoriesPage;
