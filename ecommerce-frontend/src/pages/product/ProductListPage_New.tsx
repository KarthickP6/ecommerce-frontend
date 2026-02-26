import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Enhanced Product List Page with Beautiful UI
 * Features:
 * - Grid layout with product cards
 * - Product images from Unsplash
 * - Filter and sort options
 * - Search functionality
 * - Rating display
 * - Quick add to cart
 */
const ProductListPageNew = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock products data with Unsplash images
  useEffect(() => {
    const mockProducts = [
      {
        id: 1,
        name: 'Premium Wireless Headphones',
        price: 199.99,
        originalPrice: 299.99,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
        category: 'electronics',
        rating: 4.5,
        reviews: 128,
        discount: 33,
      },
      {
        id: 2,
        name: 'Smart Watch Pro',
        price: 299.99,
        originalPrice: 399.99,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
        category: 'electronics',
        rating: 4.8,
        reviews: 256,
        discount: 25,
      },
      {
        id: 3,
        name: 'Ultra Slim Laptop',
        price: 999.99,
        originalPrice: 1299.99,
        image: 'https://images.unsplash.com/photo-1515522141207-5a88fb12ce338?w=400&h=400&fit=crop',
        category: 'electronics',
        rating: 4.6,
        reviews: 89,
        discount: 23,
      },
      {
        id: 4,
        name: 'Professional Camera',
        price: 749.99,
        originalPrice: 999.99,
        image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=400&fit=crop',
        category: 'electronics',
        rating: 4.7,
        reviews: 167,
        discount: 25,
      },
      {
        id: 5,
        name: 'Leather Backpack',
        price: 89.99,
        originalPrice: 129.99,
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
        category: 'fashion',
        rating: 4.4,
        reviews: 95,
        discount: 30,
      },
      {
        id: 6,
        name: 'Sport Running Shoes',
        price: 129.99,
        originalPrice: 179.99,
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
        category: 'fashion',
        rating: 4.6,
        reviews: 203,
        discount: 28,
      },
      {
        id: 7,
        name: 'Organic Tea Set',
        price: 34.99,
        originalPrice: 49.99,
        image: 'https://images.unsplash.com/photo-1597318925635-6cef5ee55dff?w=400&h=400&fit=crop',
        category: 'home',
        rating: 4.3,
        reviews: 67,
        discount: 30,
      },
      {
        id: 8,
        name: 'Modern Desk Lamp',
        price: 49.99,
        originalPrice: 79.99,
        image: 'https://images.unsplash.com/photo-1565636191335-14c46266acb9?w=400&h=400&fit=crop',
        category: 'home',
        rating: 4.5,
        reviews: 112,
        discount: 37,
      },
    ];
    setProducts(mockProducts);
    setFilteredProducts(mockProducts);
  }, []);

  // Handle search and filter
  useEffect(() => {
    let filtered = products;

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort
    if (sortBy === 'price-low') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    }

    setFilteredProducts(filtered);
  }, [searchTerm, selectedCategory, sortBy, products]);

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">Discover Our Collection</h1>
          <p className="text-xl opacity-90">Find the perfect products for your lifestyle</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Search and Filters */}
        <div className="mb-12">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Search Products</label>
                <div className="relative">
                  <svg className="absolute left-4 top-3 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search for products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                >
                  <option value="all">All Categories</option>
                  <option value="electronics">Electronics</option>
                  <option value="fashion">Fashion</option>
                  <option value="home">Home</option>
                </select>
              </div>

              {/* Sort */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                >
                  <option value="popular">Popular</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Product Results */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="mt-4 text-xl text-gray-600">No products found</p>
          </div>
        ) : (
          <>
            {/* Results count */}
            <div className="mb-6">
              <p className="text-gray-600">
                Showing <span className="font-semibold text-gray-900">{filteredProducts.length}</span> products
              </p>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map(product => (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all overflow-hidden group cursor-pointer transform hover:scale-105"
                  onClick={() => navigate(`/products/${product.id}`)}
                >
                  {/* Image Container */}
                  <div className="relative h-64 overflow-hidden bg-gray-200">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />

                    {/* Discount Badge */}
                    {product.discount && (
                      <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full font-bold text-sm">
                        -{product.discount}%
                      </div>
                    )}

                    {/* Quick Add to Cart */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        alert('Added to cart!');
                      }}
                      className="absolute bottom-0 left-0 right-0 bg-blue-600 hover:bg-blue-700 text-white py-2 font-semibold transition-all transform translate-y-full group-hover:translate-y-0"
                    >
                      Add to Cart
                    </button>
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    {/* Category */}
                    <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-2">
                      {product.category}
                    </p>

                    {/* Product Name */}
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                      {product.name}
                    </h3>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-3">
                      {renderStars(product.rating)}
                      <span className="text-sm text-gray-600">
                        ({product.reviews})
                      </span>
                    </div>

                    {/* Price */}
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-gray-900">
                        ${product.price.toFixed(2)}
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">
                          ${product.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductListPageNew;
