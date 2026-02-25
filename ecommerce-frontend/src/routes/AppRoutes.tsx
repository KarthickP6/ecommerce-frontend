import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';

// Placeholder components
const HomePage = () => <div className="p-8"><h1>Home Page</h1></div>;
const ProductListPage = () => <div className="p-8"><h1>Product List</h1></div>;
const ProductDetailsPage = () => <div className="p-8"><h1>Product Details</h1></div>;
const CategoryPage = () => <div className="p-8"><h1>Category Page</h1></div>;
const SearchPage = () => <div className="p-8"><h1>Search Page</h1></div>;
const ForgotPasswordPage = () => <div className="p-8"><h1>Forgot Password</h1></div>;
const ResetPasswordPage = () => <div className="p-8"><h1>Reset Password</h1></div>;

// User protected pages
const UserDashboardPage = () => <div className="p-8"><h1>User Dashboard</h1></div>;
const ProfilePage = () => <div className="p-8"><h1>User Profile</h1></div>;
const AddressPage = () => <div className="p-8"><h1>Address Management</h1></div>;
const CartPage = () => <div className="p-8"><h1>Shopping Cart</h1></div>;
const CheckoutPage = () => <div className="p-8"><h1>Checkout</h1></div>;
const OrderSuccessPage = () => <div className="p-8"><h1>Order Success</h1></div>;
const OrderHistoryPage = () => <div className="p-8"><h1>Order History</h1></div>;
const OrderDetailsPage = () => <div className="p-8"><h1>Order Details</h1></div>;
const WishlistPage = () => <div className="p-8"><h1>Wishlist</h1></div>;
const ReviewPage = () => <div className="p-8"><h1>Add Review</h1></div>;

// Admin protected pages
const AdminDashboardPage = () => <div className="p-8"><h1>Admin Dashboard</h1></div>;
const ManageUsersPage = () => <div className="p-8"><h1>Manage Users</h1></div>;
const ManageProductsPage = () => <div className="p-8"><h1>Manage Products</h1></div>;
const AddEditProductPage = () => <div className="p-8"><h1>Add/Edit Product</h1></div>;
const ManageCategoriesPage = () => <div className="p-8"><h1>Manage Categories</h1></div>;
const ManageOrdersPage = () => <div className="p-8"><h1>Manage Orders</h1></div>;
const UpdateOrderStatusPage = () => <div className="p-8"><h1>Update Order Status</h1></div>;
const ViewPaymentsPage = () => <div className="p-8"><h1>View Payments</h1></div>;
const SalesAnalyticsPage = () => <div className="p-8"><h1>Sales Analytics</h1></div>;

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/products" element={<ProductListPage />} />
      <Route path="/products/:id" element={<ProductDetailsPage />} />
      <Route path="/category/:categoryId" element={<CategoryPage />} />
      <Route path="/search" element={<SearchPage />} />

      {/* Auth Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

      {/* Protected User Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<UserDashboardPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/address" element={<AddressPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/order-success" element={<OrderSuccessPage />} />
        <Route path="/orders" element={<OrderHistoryPage />} />
        <Route path="/orders/:orderId" element={<OrderDetailsPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/review/:productId" element={<ReviewPage />} />
      </Route>

      {/* Protected Admin Routes */}
      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="/admin/users" element={<ManageUsersPage />} />
        <Route path="/admin/products" element={<ManageProductsPage />} />
        <Route path="/admin/products/add" element={<AddEditProductPage />} />
        <Route path="/admin/products/:id/edit" element={<AddEditProductPage />} />
        <Route path="/admin/categories" element={<ManageCategoriesPage />} />
        <Route path="/admin/orders" element={<ManageOrdersPage />} />
        <Route path="/admin/orders/:orderId/status" element={<UpdateOrderStatusPage />} />
        <Route path="/admin/payments" element={<ViewPaymentsPage />} />
        <Route path="/admin/analytics" element={<SalesAnalyticsPage />} />
      </Route>

      {/* Catch-all - Redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;

