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
import { getCategories } from '@/features/product/productSlice';
import type { RootState } from '@/app/store';
import * as productApi from '@/api/productApi';

interface FormData {
  name: string;
  description: string;
  price: string;
  stock: string;
  categoryId: string;
}

export default function AddEditProductPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const isEdit = !!id;

  const { loading, error } = useSelector((state: RootState) => state.admin);
  const { products: allProducts } = useSelector(
    (state: RootState) => state.product
  );
  const { data: categories } = useSelector(
    (state: RootState) => state.product.categories || { data: [] }
  );

  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    price: '',
    stock: '',
    categoryId: '',
  });

  const [loadingProduct, setLoadingProduct] = useState(false);
  const [localCategories, setLocalCategories] = useState<any[]>([]);

  // Load categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await productApi.getCategories();
        setLocalCategories(response.data || []);
      } catch (error) {
        console.error('Failed to load categories:', error);
        toast.error('Failed to load categories');
      }
    };

    loadCategories();
  }, []);

  // Load product data if editing
  useEffect(() => {
    if (isEdit) {
      const loadProduct = async () => {
        setLoadingProduct(true);
        try {
          const response = await productApi.getProductById(id);
          const product = response.data;
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
      if (isEdit) {
        await dispatch(
          updateProductThunk({ id: id as string, data: productPayload }) as any
        );
        toast.success('Product updated successfully');
      } else {
        await dispatch(createProductThunk(productPayload) as any);
        toast.success('Product created successfully');
      }
      navigate('/admin/products');
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Failed to save product');
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

        {/* Loading State */}
        {loadingProduct && (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Form */}
        {!loadingProduct && (
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
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select a category</option>
                {localCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                disabled={loading || loadingProduct}
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

