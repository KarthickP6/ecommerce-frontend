import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '@/app/store';
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';
import UserLayout from '@/components/layout/UserLayout';
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';
import ProductListPageNew from '@/pages/product/ProductListPage_New';
import ProductDetailsPage from '@/pages/product/ProductDetailsPage';
import CartPage from '@/pages/product/CartPage';
import CheckoutPage from '@/pages/order/CheckoutPage';
import OrderSuccessPage from '@/pages/order/OrderSuccessPage';
import OrderHistoryPage from '@/pages/order/OrderHistoryPage';
import OrderDetailsPage from '@/pages/order/OrderDetailsPage';
import AdminDashboardPage from '@/pages/admin/AdminDashboardPage';
import ManageProductsPage from '@/pages/admin/ManageProductsPage';
import ManageUsersPage from '@/pages/admin/ManageUsersPage';
import ManageCategoriesPage from '@/pages/admin/ManageCategoriesPage';
import ManageOrdersPage from '@/pages/admin/ManageOrdersPage';
import ViewPaymentsPage from '@/pages/admin/ViewPaymentsPage';
import SalesAnalyticsPage from '@/pages/admin/SalesAnalyticsPage';
import AddEditProductPage from '@/pages/admin/AddEditProductPage';
import UserDashboardPage from '@/pages/UserDashboardPage';

// Placeholder components
const HomePage = () => <div className="p-8"><h1>Home Page</h1></div>;
const CategoryPage = () => <div className="p-8"><h1>Category Page</h1></div>;
const SearchPage = () => <div className="p-8"><h1>Search Page</h1></div>;
const ForgotPasswordPage = () => <div className="p-8"><h1>Forgot Password</h1></div>;
const ResetPasswordPage = () => <div className="p-8"><h1>Reset Password</h1></div>;

// User protected pages
const ProfilePage = () => <div className="p-8"><h1>User Profile</h1></div>;
const AddressPage = () => <div className="p-8"><h1>Address Management</h1></div>;
const WishlistPage = () => <div className="p-8"><h1>Wishlist</h1></div>;
const ReviewPage = () => <div className="p-8"><h1>Add Review</h1></div>;

// Admin pages
const UpdateOrderStatusPage = () => <div className="p-8"><h1>Update Order Status</h1></div>;

/**
 * RootRedirect Component
 * Redirects unauthenticated users to login
 * Redirects authenticated users to dashboard
 */
const RootRedirect = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Root redirect - authenticates users are sent to /dashboard, others to /login */}
      <Route path="/" element={<RootRedirect />} />

      {/* Public Routes */}
      <Route
        path="/products"
        element={
          <UserLayout>
            <ProductListPageNew />
          </UserLayout>
        }
      />
      <Route
        path="/products/:id"
        element={
          <UserLayout>
            <ProductDetailsPage />
          </UserLayout>
        }
      />
      <Route path="/category/:categoryId" element={<CategoryPage />} />
      <Route path="/search" element={<SearchPage />} />

      {/* Auth Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

      {/* Protected User Routes */}
      <Route element={<ProtectedRoute />}>
        <Route
          path="/dashboard"
          element={
            <UserLayout>
              <UserDashboardPage />
            </UserLayout>
          }
        />
        <Route
          path="/profile"
          element={
            <UserLayout>
              <ProfilePage />
            </UserLayout>
          }
        />
        <Route
          path="/address"
          element={
            <UserLayout>
              <AddressPage />
            </UserLayout>
          }
        />
        <Route
          path="/cart"
          element={
            <UserLayout>
              <CartPage />
            </UserLayout>
          }
        />
        <Route
          path="/checkout"
          element={
            <UserLayout>
              <CheckoutPage />
            </UserLayout>
          }
        />
        <Route
          path="/order-success"
          element={
            <UserLayout>
              <OrderSuccessPage />
            </UserLayout>
          }
        />
        <Route
          path="/orders"
          element={
            <UserLayout>
              <OrderHistoryPage />
            </UserLayout>
          }
        />
        <Route
          path="/orders/:orderId"
          element={
            <UserLayout>
              <OrderDetailsPage />
            </UserLayout>
          }
        />
        <Route
          path="/wishlist"
          element={
            <UserLayout>
              <WishlistPage />
            </UserLayout>
          }
        />
        <Route
          path="/review/:productId"
          element={
            <UserLayout>
              <ReviewPage />
            </UserLayout>
          }
        />
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

      {/* Catch-all - Redirect to root (which will handle auth) */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;

