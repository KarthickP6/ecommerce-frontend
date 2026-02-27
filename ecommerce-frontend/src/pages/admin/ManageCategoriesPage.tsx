import { useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useDispatch, useSelector } from 'react-redux';
import { getCategories } from '@/features/product/productSlice';
import type { RootState } from '@/app/store';
import { toast } from 'react-toastify';

export default function ManageCategoriesPage() {
  const dispatch = useDispatch();
  const { categories, loading, error } = useSelector((state: RootState) => state.product);

  useEffect(() => {
    const fetch = async () => {
      console.log('ManageCategoriesPage: dispatching getCategories');
      try {
        await dispatch(getCategories() as any).unwrap?.();
        console.log('ManageCategoriesPage: getCategories fulfilled');
      } catch (err: any) {
        console.error('ManageCategoriesPage: getCategories error', err);
        toast.error(err?.message || 'Failed to load categories from server');
      }
    };
    fetch();
  }, [dispatch]);

  return (
    <AdminLayout title="Manage Categories">
      <div className="bg-white rounded-lg shadow p-6">
        {loading && (
          <div className="flex items-center justify-center h-48">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        )}

        {!loading && (
          <div>
            {categories && categories.length === 0 ? (
              <div className="text-center text-gray-600">No categories found</div>
            ) : (
              <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories && categories.map((cat: any) => (
                  <li key={cat.id} className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    {cat.imageUrl && (
                      <img src={cat.imageUrl} alt={cat.name} className="w-full h-48 object-cover rounded-lg mb-3" />
                    )}
                    <div className="text-lg font-bold text-gray-900">{cat.name}</div>
                    <div className="text-sm text-gray-600 mt-2">{cat.description}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {error && <div className="text-red-600 mt-4 text-center">Error: {error}</div>}
      </div>
    </AdminLayout>
  );
}
