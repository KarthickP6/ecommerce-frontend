import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts, setPagination, setFilters, getCategories } from '@/features/product/productSlice';
import type { RootState, AppDispatch } from '@/app/store';
import Pagination from '@/components/common/Pagination';
import SearchFilter from '@/components/common/SearchFilter';

const ProductListPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { products, loading, error, pagination, filters, categories } = useSelector((state: RootState) => state.product);

  useEffect(() => {
    dispatch(getProducts({
      page: pagination.page,
      limit: pagination.limit,
      search: filters.search,
      category: filters.category
    }));
  }, [dispatch, pagination.page, pagination.limit, filters.search, filters.category]);

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Product Listing</h1>
      <SearchFilter
        search={filters.search}
        filter={filters.category}
        categories={categories}
        onSearch={(val) => dispatch(setFilters({ search: val }))}
        onFilter={(val) => dispatch(setFilters({ category: val }))}
      />
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {products.map((product) => (
          <div key={product.id} className="border rounded p-4">
            <img src={product.image} alt={product.name} className="w-full h-48 object-cover mb-2" />
            <h2 className="text-lg font-semibold">{product.name}</h2>
            <p className="text-gray-600">{product.description}</p>
            <div className="mt-2 font-bold">${product.price}</div>
            <a href={`/products/${product.id}`} className="mt-2 block text-blue-600">View Details</a>
          </div>
        ))}
      </div>
      <Pagination
        page={pagination.page}
        totalPages={Math.ceil(pagination.total / pagination.limit)}
        onPageChange={(p) => dispatch(setPagination({ page: p }))}
      />
    </div>
  );
};

export default ProductListPage;

