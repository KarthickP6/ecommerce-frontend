import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import AdminLayout from '@/components/admin/AdminLayout';
import { toast } from 'react-toastify';
import {
  createProductThunk,
  updateProductThunk,
  clearError,
} from '@/features/admin/adminSlice';
import type { RootState } from '@/app/store';
import axios from 'axios';

interface FormData {
  name: string;
  description: string;
  price: string;
  stock: string;
  categoryId: string;
}

interface Category {
  id: number;
  name: string;
  description: string;
  imageUrl?: string;
}

export default function AddEditProductPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const isEdit = !!id;

  const { loading, error } = useSelector((state: RootState) => state.admin);

  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    price: '',
    stock: '',
    categoryId: '',
  });

  const [loadingProduct, setLoadingProduct] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [pageReady, setPageReady] = useState(false);

  // Load categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoadingCategories(true);
        const response = await axios.get('/api/categories');
        console.log('Categories loaded:', response.data);

        if (response.data && response.data.data) {
          setCategories(Array.isArray(response.data.data) ? response.data.data : []);
        } else if (Array.isArray(response.data)) {
          setCategories(response.data);
        }
        setPageReady(true);
      } catch (error) {
        console.error('Failed to load categories:', error);
        toast.error('Failed to load categories');
        setCategories([]);
        setPageReady(true);
      } finally {
        setLoadingCategories(false);
      }
    };

    loadCategories();
  }, []);

  // Load product data if editing
  useEffect(() => {
    if (isEdit && id) {
      const loadProduct = async () => {
        setLoadingProduct(true);
        try {
          const response = await axios.get(`/api/products/${id}`);
          const product = response.data?.data || response.data;
          setFormData({
            name: product.name || '',
            description: product.description || '',
            price: product.price?.toString() || '',
            stock: product.stock?.toString() || '',
            categoryId: product.category?.id?.toString() || '',
          });
        } catch (error) {
          console.error('Failed to load product:', error);
          toast.error('Failed to load product');
          navigate('/admin/products');
        } finally {
          setLoadingProduct(false);
        }
      };

      loadProduct();
    }
  }, [isEdit, id, navigate]);

  // Clear error on unmount
  useEffect(() => {
    return () => {
      if (error) {
        dispatch(clearError());
      }
    };
  }, [dispatch, error]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      toast.error('Product name is required');
      return;
    }

    if (!formData.price || parseFloat(formData.price) < 0) {
      toast.error('Valid price is required');
      return;
    }

    if (!formData.stock || parseInt(formData.stock) < 0) {
      toast.error('Valid stock is required');
      return;
    }

    if (!formData.categoryId) {
      toast.error('Category is required');
      return;
    }

    const productPayload = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      categoryId: parseInt(formData.categoryId),
    };

    try {
      // Show loading state
      let result;

      if (isEdit) {
        result = await dispatch(
          updateProductThunk({ id: id as string, data: productPayload }) as any
        );
        if (result?.payload) {
          toast.success('Product updated successfully!');
        } else {
          toast.error('Failed to update product');
          return;
        }
      } else {
        result = await dispatch(createProductThunk(productPayload) as any);
        if (result?.payload) {
          toast.success('Product created successfully!');
        } else {
          toast.error('Failed to create product');
          return;
        }
      }

      // Small delay to ensure toast is visible before navigation
      setTimeout(() => {
        navigate('/admin/products', { replace: true });
      }, 500);
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Failed to save product: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  return (
    <AdminLayout title={isEdit ? 'Edit Product' : 'Add Product'}>
      <div className="bg-white rounded-lg shadow p-8 max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {isEdit ? 'Edit Product' : 'Add New Product'}
          </h2>
          <p className="text-gray-600">
            {isEdit
              ? 'Update the product information below'
              : 'Fill in the form below to create a new product'}
          </p>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 font-medium">Error: {error}</p>
          </div>
        )}

        {/* Loading State - Show spinner while loading */}
        {(loadingProduct || loadingCategories) && (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Form - Show only when page is ready and not loading */}
        {pageReady && !loadingProduct && !loadingCategories && (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Product Name */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter product name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter product description"
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Price <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Enter product price"
                step="0.01"
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Stock */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Stock <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                placeholder="Enter product stock"
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              {categories.length > 0 ? (
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-yellow-800">No categories available</p>
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                disabled={loading || loadingProduct || loadingCategories || categories.length === 0}
                className="flex-1 px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition"
              >
                {loading ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/admin/products')}
                disabled={loading}
                className="flex-1 px-6 py-2 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-400 text-gray-900 rounded-lg font-medium transition"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </AdminLayout>
  );
}

