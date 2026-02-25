import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getProductById } from '@/features/product/productSlice';
import type { RootState } from '@/app/store';

const ProductDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const { product, loading, error } = useSelector((state: RootState) => state.product);

  useEffect(() => {
    if (id) dispatch(getProductById(id));
  }, [dispatch, id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!product) return <div>No product found.</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row gap-8">
        <img src={product.image} alt={product.name} className="w-full md:w-1/3 h-64 object-cover rounded" />
        <div>
          <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
          <div className="mb-2 text-lg font-semibold">${product.price}</div>
          <p className="mb-4 text-gray-700">{product.description}</p>
          <div className="text-sm text-gray-500">Category: {product.category}</div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;

