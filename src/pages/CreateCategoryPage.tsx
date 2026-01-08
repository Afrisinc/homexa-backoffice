import * as React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, X, Upload } from 'lucide-react';
import DashboardLayout from '@/layouts/DashboardLayout';
import { toast } from 'sonner';
import { categoriesAPI } from '@/lib/api';

interface CategoryFormData {
  name: string;
  slug: string;
  description: string;
  parent_id?: string;
  image_url?: string;
  status: 'active' | 'inactive';
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
}

interface ParentCategory {
  id: string;
  name: string;
}

export const CreateCategoryPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const location = window.location.pathname;
  const isViewing = location.includes('/view');
  const isEditing = location.includes('/edit');

  const [formData, setFormData] = React.useState<CategoryFormData>({
    name: '',
    slug: '',
    description: '',
    parent_id: '',
    image_url: '',
    status: 'active',
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
  });

  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [loading, setLoading] = React.useState(false);
  const [imagePreview, setImagePreview] = React.useState<string>('');
  const [parentCategories, setParentCategories] = React.useState<ParentCategory[]>([]);
  const [loadingCategories, setLoadingCategories] = React.useState(false);

  // Fetch parent categories
  React.useEffect(() => {
    const fetchParentCategories = async () => {
      setLoadingCategories(true);
      try {
        const data = await categoriesAPI.getAll();
        // Filter out current category from parent list
        const filtered = data.filter((cat: any) => cat.id !== id);
        setParentCategories(filtered);
      } catch (error) {
        console.error('Error fetching categories:', error);
        // Silently fail - form can still work without parent categories list
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchParentCategories();
  }, [id]);

  // Load category data if editing or viewing
  React.useEffect(() => {
    if ((isEditing || isViewing) && id) {
      const fetchCategory = async () => {
        try {
          const category = await categoriesAPI.getById(id);
          setFormData({
            name: category.name || '',
            slug: category.slug || '',
            description: category.description || '',
            parent_id: category.parent_id || '',
            image_url: category.image_url || '',
            status: category.status || 'active',
            meta_title: category.meta_title || '',
            meta_description: category.meta_description || '',
            meta_keywords: category.meta_keywords || '',
          });
          if (category.image_url) {
            setImagePreview(category.image_url);
          }
        } catch (error) {
          console.error('Error fetching category:', error);
          toast.error('Failed to load category details');
        }
      };
      fetchCategory();
    }
  }, [isEditing, isViewing, id]);

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };

      // Auto-generate slug when name changes
      if (name === 'name' && !isEditing) {
        updated.slug = generateSlug(value);
      }

      return updated;
    });

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you'd upload to a server
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setFormData((prev) => ({ ...prev, image_url: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Category name is required';
    }
    if (!formData.slug.trim()) {
      newErrors.slug = 'Slug is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      if (isEditing && id) {
        await categoriesAPI.update(id, formData);
        toast.success('Category updated successfully!');
      } else {
        await categoriesAPI.create(formData);
        toast.success('Category created successfully!');
      }

      navigate('/dashboard/categories');
    } catch (error) {
      console.error('Error submitting form:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to save category. Please try again.';
      setErrors({ submit: errorMessage });
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard/categories')}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            title="Go back"
          >
            <ArrowLeft className="h-5 w-5 text-muted-foreground" />
          </button>
          <div>
            <h1 className="text-3xl font-serif font-semibold text-foreground">
              {isViewing ? 'View Category' : isEditing ? 'Edit Category' : 'Create New Category'}
            </h1>
            <p className="text-muted-foreground mt-1">
              {isViewing
                ? 'Category details'
                : isEditing
                  ? 'Update category information'
                  : 'Add a new product category to your marketplace'}
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-foreground mb-4">Basic Information</h2>

                <div className="space-y-4">
                  {/* Category Name */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Category Name <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g., Electronics"
                      disabled={isViewing}
                      className={`w-full px-4 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed ${
                        errors.name
                          ? 'border-destructive bg-destructive/5'
                          : 'border-border bg-muted/30'
                      }`}
                    />
                    {errors.name && (
                      <p className="text-xs text-destructive mt-1">{errors.name}</p>
                    )}
                  </div>

                  {/* Slug */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Slug <span className="text-destructive">*</span>
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        name="slug"
                        value={formData.slug}
                        onChange={handleInputChange}
                        placeholder="e.g., electronics"
                        disabled={isViewing}
                        className={`flex-1 px-4 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed ${
                          errors.slug
                            ? 'border-destructive bg-destructive/5'
                            : 'border-border bg-muted/30'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newSlug = generateSlug(formData.name);
                          setFormData((prev) => ({ ...prev, slug: newSlug }));
                        }}
                        disabled={isViewing}
                        className="px-4 py-2 bg-muted hover:bg-muted/80 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-sm font-medium text-foreground transition-colors"
                      >
                        Auto-generate
                      </button>
                    </div>
                    {errors.slug && (
                      <p className="text-xs text-destructive mt-1">{errors.slug}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      URL-friendly identifier for the category
                    </p>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Description <span className="text-destructive">*</span>
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Enter a detailed description of this category..."
                      rows={4}
                      disabled={isViewing}
                      className={`w-full px-4 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none disabled:opacity-50 disabled:cursor-not-allowed ${
                        errors.description
                          ? 'border-destructive bg-destructive/5'
                          : 'border-border bg-muted/30'
                      }`}
                    />
                    <div className="flex justify-between mt-1">
                      {errors.description && (
                        <p className="text-xs text-destructive">{errors.description}</p>
                      )}
                      <p className={`text-xs ${formData.description.length >= 10 ? 'text-success' : 'text-muted-foreground'}`}>
                        {formData.description.length} characters
                      </p>
                    </div>
                  </div>

                  {/* Parent Category */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Parent Category (Optional)
                    </label>
                    <select
                      name="parent_id"
                      value={formData.parent_id}
                      onChange={handleInputChange}
                      disabled={isViewing || loadingCategories}
                      className="w-full px-4 py-2 rounded-lg border border-border bg-muted/30 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="">
                        {loadingCategories ? 'Loading categories...' : 'None - This is a root category'}
                      </option>
                      {parentCategories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-muted-foreground mt-1">
                      Select a parent if this is a subcategory
                    </p>
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Status
                    </label>
                    <div className="flex gap-4">
                      <label className={`flex items-center gap-2 ${isViewing ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>
                        <input
                          type="radio"
                          name="status"
                          value="active"
                          checked={formData.status === 'active'}
                          onChange={handleInputChange}
                          disabled={isViewing}
                          className="w-4 h-4 disabled:cursor-not-allowed"
                        />
                        <span className="text-sm text-foreground">Active</span>
                      </label>
                      <label className={`flex items-center gap-2 ${isViewing ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>
                        <input
                          type="radio"
                          name="status"
                          value="inactive"
                          checked={formData.status === 'inactive'}
                          onChange={handleInputChange}
                          disabled={isViewing}
                          className="w-4 h-4 disabled:cursor-not-allowed"
                        />
                        <span className="text-sm text-foreground">Inactive</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* SEO Information */}
              <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-foreground mb-4">SEO Information</h2>

                <div className="space-y-4">
                  {/* Meta Title */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Meta Title (Optional)
                    </label>
                    <input
                      type="text"
                      name="meta_title"
                      value={formData.meta_title}
                      onChange={handleInputChange}
                      placeholder="e.g., Electronics - Homexa Marketplace"
                      maxLength={60}
                      disabled={isViewing}
                      className="w-full px-4 py-2 rounded-lg border border-border bg-muted/30 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {(formData.meta_title || '').length}/60 characters
                    </p>
                  </div>

                  {/* Meta Description */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Meta Description (Optional)
                    </label>
                    <textarea
                      name="meta_description"
                      value={formData.meta_description}
                      onChange={handleInputChange}
                      placeholder="e.g., Browse our wide selection of electronics including phones, laptops, and accessories."
                      rows={3}
                      maxLength={160}
                      disabled={isViewing}
                      className="w-full px-4 py-2 rounded-lg border border-border bg-muted/30 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {(formData.meta_description || '').length}/160 characters
                    </p>
                  </div>

                  {/* Meta Keywords */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Meta Keywords (Optional)
                    </label>
                    <input
                      type="text"
                      name="meta_keywords"
                      value={formData.meta_keywords}
                      onChange={handleInputChange}
                      placeholder="e.g., electronics, gadgets, devices, phones"
                      disabled={isViewing}
                      className="w-full px-4 py-2 rounded-lg border border-border bg-muted/30 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Separate keywords with commas
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Image Upload */}
              <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-foreground mb-4">Category Image</h2>

                <div className="space-y-4">
                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Category preview"
                        className="w-full h-40 object-cover rounded-lg"
                      />
                      {!isViewing && (
                        <button
                          type="button"
                          onClick={() => {
                            setImagePreview('');
                            setFormData((prev) => ({ ...prev, image_url: '' }));
                          }}
                          className="absolute top-2 right-2 p-1.5 bg-destructive hover:bg-destructive/90 rounded-lg text-white transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ) : !isViewing ? (
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                      <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground mb-2">
                        Drag and drop your image here or click to select
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        id="image-upload"
                        disabled={isViewing}
                      />
                      <label
                        htmlFor="image-upload"
                        className="inline-block px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium cursor-pointer transition-colors"
                      >
                        Select Image
                      </label>
                    </div>
                  ) : null}

                  <p className="text-xs text-muted-foreground">
                    Recommended: 500x500px PNG or JPG. Max 5MB.
                  </p>
                </div>
              </div>

              {/* Submit Actions */}
              {!isViewing && (
                <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                  <div className="space-y-3">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full px-4 py-2.5 bg-primary hover:bg-primary/90 disabled:bg-muted disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <Save className="h-4 w-4" />
                      {loading ? 'Saving...' : isEditing ? 'Update Category' : 'Create Category'}
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate('/dashboard/categories')}
                      className="w-full px-4 py-2.5 bg-muted hover:bg-muted/80 text-foreground rounded-lg font-medium transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* View Mode - Back Button */}
              {isViewing && (
                <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                  <button
                    type="button"
                    onClick={() => navigate('/dashboard/categories')}
                    className="w-full px-4 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition-colors"
                  >
                    Back to Categories
                  </button>
                </div>
              )}

              {/* Help */}
              <div className="rounded-xl border border-border/50 bg-muted/30 p-4">
                <h3 className="text-sm font-semibold text-foreground mb-2">Tips</h3>
                <ul className="space-y-2 text-xs text-muted-foreground">
                  <li>• Keep category names short and descriptive</li>
                  <li>• Slugs are used in URLs, use lowercase</li>
                  <li>• Add detailed descriptions for better SEO</li>
                  <li>• Upload a clear category image</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {errors.submit && (
            <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-4">
              <p className="text-sm text-destructive">{errors.submit}</p>
            </div>
          )}
        </form>
      </div>
    </DashboardLayout>
  );
};

export default CreateCategoryPage;
