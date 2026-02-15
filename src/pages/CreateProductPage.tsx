import * as React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, X, Trash2, Play, Upload, ChevronDown } from 'lucide-react';
import DashboardLayout from '@/layouts/DashboardLayout';
import { toast } from 'sonner';
import { productsAPI, categoriesAPI, sellersAPI } from '@/lib/api';

interface ProductFormData {
  name: string;
  sku: string;
  description: string;
  category_id?: string;
  seller_id?: string;
  brand: string;
  price: number;
  compareAtPrice?: number;
  stockQuantity: number;
  images?: string[];
  videos?: string[];
  status: 'active' | 'inactive';
  isFeatured: boolean;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
}

interface Category {
  id: string;
  name: string;
}

interface Seller {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: string;
}

export const CreateProductPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const location = window.location.pathname;
  const isViewing = location.includes('/view');
  const isEditing = location.includes('/edit');

  const [formData, setFormData] = React.useState<ProductFormData>({
    name: '',
    sku: '',
    description: '',
    category_id: '',
    seller_id: '',
    brand: '',
    price: 0,
    compareAtPrice: 0,
    stockQuantity: 0,
    images: [],
    videos: [],
    status: 'active',
    isFeatured: false,
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
  });

  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [loading, setLoading] = React.useState(false);
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = React.useState(false);
  const [sellers, setSellers] = React.useState<Seller[]>([]);
  const [loadingSellers, setLoadingSellers] = React.useState(false);
  const [sellerSearch, setSellerSearch] = React.useState('');
  const [showSellerDropdown, setShowSellerDropdown] = React.useState(false);
  const [newImageUrl, setNewImageUrl] = React.useState('');
  const [newVideoUrl, setNewVideoUrl] = React.useState('');

  // Fetch categories and sellers
  React.useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        const data = await categoriesAPI.getAll();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
        // Silently fail - form can still work without categories list
      } finally {
        setLoadingCategories(false);
      }
    };

    const fetchSellers = async () => {
      setLoadingSellers(true);
      try {
        const data = await sellersAPI.getAll(1, 10, '');
        const sellersList = Array.isArray(data) ? data : data?.items || [];
        setSellers(sellersList);
      } catch (error) {
        console.error('Error fetching sellers:', error);
        // Silently fail - form can still work without sellers list
      } finally {
        setLoadingSellers(false);
      }
    };

    fetchCategories();
    fetchSellers();
  }, []);

  // Search sellers as user types
  React.useEffect(() => {
    const searchTimeoutId = setTimeout(async () => {
      if (showSellerDropdown && sellerSearch.length > 0) {
        setLoadingSellers(true);
        try {
          const data = await sellersAPI.getAll(1, 10, sellerSearch);
          const sellersList = Array.isArray(data) ? data : data?.items || [];
          setSellers(sellersList);
        } catch (error) {
          console.error('Error searching sellers:', error);
        } finally {
          setLoadingSellers(false);
        }
      }
    }, 300);

    return () => clearTimeout(searchTimeoutId);
  }, [sellerSearch, showSellerDropdown]);

  // Load product data if editing or viewing
  React.useEffect(() => {
    if ((isEditing || isViewing) && id) {
      const fetchProduct = async () => {
        try {
          const product = await productsAPI.getById(id);
          setFormData({
            name: product.name || '',
            sku: product.sku || '',
            description: product.description || '',
            category_id: product.categoryId || product.category_id || '',
            seller_id: product.sellerId || product.seller_id || '',
            brand: product.brand || '',
            price: product.price || 0,
            compareAtPrice: product.compareAtPrice || 0,
            stockQuantity: product.stockQuantity || 0,
            images: product.images || [],
            videos: product.videos || [],
            status: product.status || 'active',
            isFeatured: product.isFeatured || false,
            meta_title: product.metaTitle || product.meta_title || '',
            meta_description: product.metaDescription || product.meta_description || '',
            meta_keywords: product.seoKeywords?.join(', ') || product.meta_keywords || '',
          });

          // Set seller search display if seller exists
          if (product.seller) {
            setSellerSearch(
              `${product.seller.firstName} ${product.seller.lastName}`
            );
          }
        } catch (error) {
          console.error('Error fetching product:', error);
          toast.error('Failed to load product details');
        }
      };
      fetchProduct();
    }
  }, [isEditing, isViewing, id]);

  const generateSKU = () => {
    const timestamp = Date.now().toString().slice(-6);
    return `SKU-${timestamp}`;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    setFormData((prev) => {
      const updated = { ...prev } as any;

      if (type === 'checkbox') {
        updated[name] = (e.target as HTMLInputElement).checked;
      } else if (type === 'number') {
        updated[name] = parseFloat(value);
      } else {
        updated[name] = value;
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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }
    if (!formData.sku.trim()) {
      newErrors.sku = 'SKU is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }
    if (!formData.brand.trim()) {
      newErrors.brand = 'Brand is required';
    }
    if (!formData.seller_id) {
      newErrors.seller_id = 'Seller is required';
    }
    if (formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }
    if (formData.stockQuantity < 0) {
      newErrors.stockQuantity = 'Stock quantity cannot be negative';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const discountPercent = formData.compareAtPrice && formData.price < formData.compareAtPrice
    ? Math.round(((formData.compareAtPrice - formData.price) / formData.compareAtPrice) * 100)
    : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // Transform form data to match API requirements
      const apiData = {
        name: formData.name,
        sku: formData.sku,
        description: formData.description,
        categoryId: formData.category_id || undefined,
        sellerId: formData.seller_id,
        brand: formData.brand,
        price: formData.price,
        compareAtPrice: formData.compareAtPrice,
        stockQuantity: formData.stockQuantity,
        images: formData.images,
        videos: formData.videos,
        status: formData.status,
        isFeatured: formData.isFeatured,
        metaTitle: formData.meta_title,
        metaDescription: formData.meta_description,
        seoKeywords: formData.meta_keywords
          ? formData.meta_keywords.split(',').map(k => k.trim())
          : undefined,
      };

      if (isEditing && id) {
        await productsAPI.update(id, apiData);
        toast.success('Product updated successfully!');
      } else {
        await productsAPI.create(apiData);
        toast.success('Product created successfully!');
      }

      navigate('/dashboard/products');
    } catch (error) {
      console.error('Error submitting form:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to save product. Please try again.';
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
            onClick={() => navigate('/dashboard/products')}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            title="Go back"
          >
            <ArrowLeft className="h-5 w-5 text-muted-foreground" />
          </button>
          <div>
            <h1 className="text-3xl font-serif font-semibold text-foreground">
              {isViewing ? 'View Product' : isEditing ? 'Edit Product' : 'Create New Product'}
            </h1>
            <p className="text-muted-foreground mt-1">
              {isViewing
                ? 'Product details'
                : isEditing
                  ? 'Update product information'
                  : 'Add a new product to your marketplace'}
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
                  {/* Product Name */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Product Name <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g., Samsung Galaxy A25"
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

                  {/* SKU */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      SKU <span className="text-destructive">*</span>
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        name="sku"
                        value={formData.sku}
                        onChange={handleInputChange}
                        placeholder="e.g., SKU-000123"
                        disabled={isViewing}
                        className={`flex-1 px-4 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed ${
                          errors.sku
                            ? 'border-destructive bg-destructive/5'
                            : 'border-border bg-muted/30'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newSKU = generateSKU();
                          setFormData((prev) => ({ ...prev, sku: newSKU }));
                        }}
                        disabled={isViewing}
                        className="px-4 py-2 bg-muted hover:bg-muted/80 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-sm font-medium text-foreground transition-colors"
                      >
                        Generate
                      </button>
                    </div>
                    {errors.sku && (
                      <p className="text-xs text-destructive mt-1">{errors.sku}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      Stock keeping unit - unique identifier for the product
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Brand */}
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Brand <span className="text-destructive">*</span>
                      </label>
                      <input
                        type="text"
                        name="brand"
                        value={formData.brand}
                        onChange={handleInputChange}
                        placeholder="e.g., Samsung"
                        disabled={isViewing}
                        className={`w-full px-4 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed ${
                          errors.brand
                            ? 'border-destructive bg-destructive/5'
                            : 'border-border bg-muted/30'
                        }`}
                      />
                      {errors.brand && (
                        <p className="text-xs text-destructive mt-1">{errors.brand}</p>
                      )}
                    </div>

                    {/* Category */}
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Category (Optional)
                      </label>
                      <select
                        name="category_id"
                        value={formData.category_id}
                        onChange={handleInputChange}
                        disabled={isViewing || loadingCategories}
                        className="w-full px-4 py-2 rounded-lg border border-border bg-muted/30 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <option value="">
                          {loadingCategories ? 'Loading categories...' : 'Select a category'}
                        </option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Seller */}
                    <div className="relative">
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Seller <span className="text-destructive">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Search seller by name or email..."
                          value={sellerSearch}
                          onChange={(e) => {
                            setSellerSearch(e.target.value);
                            setShowSellerDropdown(true);
                          }}
                          onFocus={() => setShowSellerDropdown(true)}
                          disabled={isViewing || loadingSellers}
                          className={`w-full px-4 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed pr-10 ${
                            errors.seller_id
                              ? 'border-destructive bg-destructive/5'
                              : 'border-border bg-muted/30'
                          }`}
                        />
                        <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-muted-foreground pointer-events-none" />
                      </div>

                      {/* Dropdown */}
                      {showSellerDropdown && !isViewing && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                          {loadingSellers ? (
                            <div className="p-3 text-sm text-muted-foreground text-center">
                              Loading sellers...
                            </div>
                          ) : sellers.length === 0 ? (
                            <div className="p-3 text-sm text-muted-foreground text-center">
                              No sellers found
                            </div>
                          ) : (
                            sellers.map((seller) => (
                                <button
                                  key={seller.id}
                                  type="button"
                                  onClick={() => {
                                    setFormData((prev) => ({
                                      ...prev,
                                      seller_id: seller.id,
                                    }));
                                    setSellerSearch(
                                      `${seller.firstName} ${seller.lastName}`
                                    );
                                    setShowSellerDropdown(false);
                                  }}
                                  className="w-full text-left px-4 py-2.5 hover:bg-muted transition-colors flex flex-col gap-0.5"
                                >
                                  <span className="text-sm font-medium text-foreground">
                                    {seller.firstName} {seller.lastName}
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    {seller.email}
                                    {seller.phone && ` • ${seller.phone}`}
                                  </span>
                                </button>
                              ))
                          )}
                        </div>
                      )}

                      {/* Selected Seller Display */}
                      {formData.seller_id && (
                        <div className="mt-2 p-2 bg-primary/10 border border-primary/20 rounded-lg">
                          <p className="text-xs text-foreground">
                            <span className="font-medium">Selected:</span> {sellerSearch}
                          </p>
                        </div>
                      )}

                      {errors.seller_id && (
                        <p className="text-xs text-destructive mt-1">{errors.seller_id}</p>
                      )}
                    </div>
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
                      placeholder="Enter a detailed description of this product..."
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

              {/* Pricing & Stock */}
              <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-foreground mb-4">Pricing & Stock</h2>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {/* Price */}
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Price <span className="text-destructive">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-2.5 text-muted-foreground">$</span>
                        <input
                          type="number"
                          name="price"
                          value={formData.price}
                          onChange={handleInputChange}
                          placeholder="0.00"
                          step="0.01"
                          min="0"
                          disabled={isViewing}
                          className={`w-full pl-8 pr-4 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed ${
                            errors.price
                              ? 'border-destructive bg-destructive/5'
                              : 'border-border bg-muted/30'
                          }`}
                        />
                      </div>
                      {errors.price && (
                        <p className="text-xs text-destructive mt-1">{errors.price}</p>
                      )}
                    </div>

                    {/* Compare At Price */}
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Compare At Price (Optional)
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-2.5 text-muted-foreground">$</span>
                        <input
                          type="number"
                          name="compareAtPrice"
                          value={formData.compareAtPrice}
                          onChange={handleInputChange}
                          placeholder="0.00"
                          step="0.01"
                          min="0"
                          disabled={isViewing}
                          className="w-full pl-8 pr-4 py-2 rounded-lg border border-border bg-muted/30 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Original price before discount
                      </p>
                    </div>
                  </div>

                  {/* Discount Display */}
                  {discountPercent > 0 && (
                    <div className="p-3 bg-success/10 border border-success/20 rounded-lg">
                      <p className="text-sm text-success">
                        Discount: <span className="font-semibold">{discountPercent}%</span>
                      </p>
                    </div>
                  )}

                  {/* Stock Quantity */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Stock Quantity <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="number"
                      name="stockQuantity"
                      value={formData.stockQuantity}
                      onChange={handleInputChange}
                      placeholder="0"
                      min="0"
                      disabled={isViewing}
                      className={`w-full px-4 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed ${
                        errors.stockQuantity
                          ? 'border-destructive bg-destructive/5'
                          : 'border-border bg-muted/30'
                      }`}
                    />
                    {errors.stockQuantity && (
                      <p className="text-xs text-destructive mt-1">{errors.stockQuantity}</p>
                    )}
                  </div>

                  {/* Featured Checkbox */}
                  <div>
                    <label className={`flex items-center gap-2 ${isViewing ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>
                      <input
                        type="checkbox"
                        name="isFeatured"
                        checked={formData.isFeatured}
                        onChange={handleInputChange}
                        disabled={isViewing}
                        className="w-4 h-4 rounded disabled:cursor-not-allowed"
                      />
                      <span className="text-sm font-medium text-foreground">Featured Product</span>
                    </label>
                    <p className="text-xs text-muted-foreground mt-1">
                      Show this product prominently on the homepage
                    </p>
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
                      placeholder="e.g., Samsung Galaxy A25 - Buy Online"
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
                      placeholder="e.g., Buy Samsung Galaxy A25 with great features and affordable price..."
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
                      placeholder="e.g., Samsung, Galaxy A25, smartphone, mobile phone"
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
              {/* Images Upload */}
              <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-foreground mb-4">Product Images</h2>

                <div className="space-y-4">
                  {/* Image List */}
                  {formData.images && formData.images.length > 0 && (
                    <div className="grid grid-cols-2 gap-3">
                      {formData.images.map((image, idx) => (
                        <div key={idx} className="relative group">
                          <img
                            src={image}
                            alt={`Product ${idx + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          {!isViewing && (
                            <button
                              type="button"
                              onClick={() => {
                                setFormData((prev) => ({
                                  ...prev,
                                  images: prev.images?.filter((_, i) => i !== idx) || [],
                                }));
                              }}
                              className="absolute top-1 right-1 p-1 bg-destructive hover:bg-destructive/90 rounded text-white transition-colors opacity-0 group-hover:opacity-100"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* File Upload */}
                  {!isViewing && (
                    <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:bg-muted/30 transition-colors">
                      <Upload className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
                      <p className="text-xs text-muted-foreground mb-2">
                        Upload images or drag and drop
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              const result = reader.result as string;
                              setFormData((prev) => ({
                                ...prev,
                                images: [...(prev.images || []), result],
                              }));
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="hidden"
                        id="image-file-upload"
                        disabled={isViewing}
                      />
                      <label
                        htmlFor="image-file-upload"
                        className="inline-block px-3 py-1.5 bg-primary hover:bg-primary/90 text-white rounded text-xs font-medium cursor-pointer transition-colors"
                      >
                        Select Image
                      </label>
                    </div>
                  )}

                  {/* Add Image URL */}
                  {!isViewing && (
                    <div className="space-y-2">
                      <label className="block text-xs font-medium text-foreground">
                        Or paste image URL
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="url"
                          value={newImageUrl}
                          onChange={(e) => setNewImageUrl(e.target.value)}
                          placeholder="https://example.com/image.jpg"
                          className="flex-1 px-3 py-2 rounded-lg border border-border bg-muted/30 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors text-xs"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (newImageUrl.trim()) {
                              setFormData((prev) => ({
                                ...prev,
                                images: [...(prev.images || []), newImageUrl],
                              }));
                              setNewImageUrl('');
                            }
                          }}
                          className="px-3 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-xs font-medium transition-colors whitespace-nowrap"
                        >
                          Add URL
                        </button>
                      </div>
                    </div>
                  )}

                  <p className="text-xs text-muted-foreground">
                    First image will be the primary image. Supports JPG, PNG, WebP.
                  </p>
                </div>
              </div>

              {/* Videos Upload */}
              <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-foreground mb-4">Product Videos</h2>

                <div className="space-y-4">
                  {/* Video List */}
                  {formData.videos && formData.videos.length > 0 && (
                    <div className="space-y-2">
                      {formData.videos.map((video, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 p-2 bg-muted/30 rounded-lg group hover:bg-muted/50 transition-colors"
                        >
                          <Play className="h-4 w-4 text-primary flex-shrink-0" />
                          <span className="flex-1 text-xs text-foreground truncate">
                            {video.length > 50 ? video.substring(0, 47) + '...' : video}
                          </span>
                          {!isViewing && (
                            <button
                              type="button"
                              onClick={() => {
                                setFormData((prev) => ({
                                  ...prev,
                                  videos: prev.videos?.filter((_, i) => i !== idx) || [],
                                }));
                              }}
                              className="p-1 hover:bg-destructive/20 rounded text-destructive transition-colors opacity-0 group-hover:opacity-100"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* File Upload */}
                  {!isViewing && (
                    <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:bg-muted/30 transition-colors">
                      <Upload className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
                      <p className="text-xs text-muted-foreground mb-2">
                        Upload videos or drag and drop
                      </p>
                      <input
                        type="file"
                        accept="video/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              const result = reader.result as string;
                              setFormData((prev) => ({
                                ...prev,
                                videos: [...(prev.videos || []), result],
                              }));
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="hidden"
                        id="video-file-upload"
                        disabled={isViewing}
                      />
                      <label
                        htmlFor="video-file-upload"
                        className="inline-block px-3 py-1.5 bg-primary hover:bg-primary/90 text-white rounded text-xs font-medium cursor-pointer transition-colors"
                      >
                        Select Video
                      </label>
                    </div>
                  )}

                  {/* Add Video URL */}
                  {!isViewing && (
                    <div className="space-y-2">
                      <label className="block text-xs font-medium text-foreground">
                        Or paste video URL
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="url"
                          value={newVideoUrl}
                          onChange={(e) => setNewVideoUrl(e.target.value)}
                          placeholder="https://youtube.com/... or https://example.com/video.mp4"
                          className="flex-1 px-3 py-2 rounded-lg border border-border bg-muted/30 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors text-xs"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (newVideoUrl.trim()) {
                              setFormData((prev) => ({
                                ...prev,
                                videos: [...(prev.videos || []), newVideoUrl],
                              }));
                              setNewVideoUrl('');
                            }
                          }}
                          className="px-3 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-xs font-medium transition-colors whitespace-nowrap"
                        >
                          Add URL
                        </button>
                      </div>
                    </div>
                  )}

                  <p className="text-xs text-muted-foreground">
                    Supports MP4, WebM, YouTube links. Multiple videos supported.
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
                      {loading ? 'Saving...' : isEditing ? 'Update Product' : 'Create Product'}
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate('/dashboard/products')}
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
                    onClick={() => navigate('/dashboard/products')}
                    className="w-full px-4 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition-colors"
                  >
                    Back to Products
                  </button>
                </div>
              )}

              {/* Help */}
              <div className="rounded-xl border border-border/50 bg-muted/30 p-4">
                <h3 className="text-sm font-semibold text-foreground mb-2">Tips</h3>
                <ul className="space-y-2 text-xs text-muted-foreground">
                  <li>• Use clear and descriptive product names</li>
                  <li>• Add detailed descriptions for better SEO</li>
                  <li>• Include original price for better discounts</li>
                  <li>• Add multiple images for better product showcase</li>
                  <li>• Include product videos for higher engagement</li>
                  <li>• Mark featured products to highlight them</li>
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

export default CreateProductPage;
