# 📊 Admin Module - Complete Documentation

**Version:** 1.0.0  
**Last Updated:** February 26, 2026  
**Status:** Production Ready

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture & Flow](#architecture--flow)
3. [Module Components](#module-components)
4. [Redux State Management](#redux-state-management)
5. [Admin Pages](#admin-pages)
6. [Workflows & Scenarios](#workflows--scenarios)
7. [API Endpoints](#api-endpoints)
8. [Security & Permissions](#security--permissions)
9. [User Flows](#user-flows)
10. [Database Relations](#database-relations)

---

## Overview

### What is the Admin Module?

The Admin Module is a comprehensive administrative dashboard system that enables platform administrators to:
- Monitor business metrics and analytics
- Manage users and their permissions
- Manage product inventory
- Manage product categories
- Monitor and manage orders
- View payment information
- Analyze sales performance

### Key Statistics

| Metric | Value |
|--------|-------|
| Admin Pages | 8 |
| Admin Functions | 40+ |
| Redux Slices | 1 (admin) |
| Protected Routes | 10 |
| Data Management Capabilities | 5 (Users, Products, Orders, Categories, Payments) |

### Tech Stack

```
Frontend:
  - React 18 + TypeScript
  - Redux Toolkit (State Management)
  - React Router v6 (Routing)
  - Tailwind CSS (Styling)
  - Axios (API Communication)

Backend:
  - Spring Boot 3.2.5
  - PostgreSQL (Database)
  - JWT (Authentication)
  - Swagger/OpenAPI (Documentation)
```

---

## Architecture & Flow

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Admin Module System                       │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────┐  ┌──────────────────┐                 │
│  │  Admin User      │  │ Regular User     │                 │
│  │  (Auth + Admin)  │  │ (Cannot Access)  │                 │
│  └────────┬─────────┘  └────────┬─────────┘                 │
│           │                      │                           │
│           ↓                      ↓                           │
│  ┌───────────────────────────────────────┐                 │
│  │     AdminRoute (Role Check)           │                 │
│  │  - user.role === 'admin'? → Allow    │                 │
│  │  - user.role === 'user' → Redirect   │                 │
│  └────────────┬────────────────────────┘                   │
│               │                                             │
│               ↓                                             │
│  ┌───────────────────────────────────────┐                 │
│  │      Admin Pages                      │                 │
│  │  - Dashboard                          │                 │
│  │  - Manage Users                       │                 │
│  │  - Manage Products                    │                 │
│  │  - Manage Categories                  │                 │
│  │  - Manage Orders                      │                 │
│  │  - View Payments                      │                 │
│  │  - Sales Analytics                    │                 │
│  └────────────┬────────────────────────┘                   │
│               │                                             │
│               ↓                                             │
│  ┌───────────────────────────────────────┐                 │
│  │    Redux Admin Slice                  │                 │
│  │  - Analytics state                    │                 │
│  │  - Filter state                       │                 │
│  │  - Selected item tracking             │                 │
│  └────────────┬────────────────────────┘                   │
│               │                                             │
│               ↓                                             │
│  ┌───────────────────────────────────────┐                 │
│  │     Axios Interceptor                 │                 │
│  │  - Attach JWT Token                   │                 │
│  │  - Handle 401/403 Errors              │                 │
│  └────────────┬────────────────────────┘                   │
│               │                                             │
│               ↓                                             │
│  ┌───────────────────────────────────────┐                 │
│  │     Backend API Endpoints             │                 │
│  │  - /api/admin/users                   │                 │
│  │  - /api/admin/products                │                 │
│  │  - /api/admin/orders                  │                 │
│  │  - /api/admin/categories              │                 │
│  │  - /api/admin/payments                │                 │
│  │  - /api/admin/analytics               │                 │
│  └────────────┬────────────────────────┘                   │
│               │                                             │
│               ↓                                             │
│  ┌───────────────────────────────────────┐                 │
│  │   PostgreSQL Database                 │                 │
│  │  - Users Table                        │                 │
│  │  - Products Table                     │                 │
│  │  - Orders Table                       │                 │
│  │  - Categories Table                   │                 │
│  │  - Payments Table                     │                 │
│  └───────────────────────────────────────┘                 │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### Authentication & Authorization Flow

```
1. Admin Login
   ↓
2. AuthService.login() → Backend
   ↓
3. Backend validates credentials
   ↓
4. Backend checks user.role = 'admin'
   ↓
5. Backend returns JWT token + user data
   ↓
6. Frontend stores JWT in Redux + localStorage
   ↓
7. User redirected to /admin dashboard
   ↓
8. AdminRoute verifies:
   - isAuthenticated = true
   - user.role = 'admin'
   ↓
9. Access granted to admin pages
```

---

## Module Components

### Component Hierarchy

```
AdminLayout (Wrapper)
├── AdminSidebar (Navigation)
└── Admin Pages
    ├── AdminDashboardPage
    ├── ManageUsersPage
    ├── ManageProductsPage
    ├── ManageCategoriesPage
    ├── ManageOrdersPage
    ├── ViewPaymentsPage
    └── SalesAnalyticsPage
```

### Component Descriptions

#### 1. **AdminRoute** (`src/routes/AdminRoute.tsx`)
**Purpose:** Protects admin routes from unauthorized access

```typescript
// Checks:
✓ User is authenticated (isAuthenticated = true)
✓ User has admin role (user.role = 'admin')

// If fails: Redirects to home (/)
// If passes: Shows admin pages
```

#### 2. **AdminLayout** (`src/components/admin/AdminLayout.tsx`)
**Purpose:** Provides consistent layout for all admin pages

```typescript
// Features:
- Sidebar navigation
- Page title header
- Content wrapper
- Responsive design
```

#### 3. **AdminSidebar** (`src/components/admin/AdminSidebar.tsx`)
**Purpose:** Navigation menu for admin pages

```typescript
// Menu Items:
- Dashboard → /admin
- Manage Users → /admin/users
- Manage Products → /admin/products
- Manage Categories → /admin/categories
- Manage Orders → /admin/orders
- View Payments → /admin/payments
- Sales Analytics → /admin/analytics
```

---

## Redux State Management

### Admin Slice Structure

```typescript
interface AdminState {
  analytics: Analytics | null;
  selectedUserId: string | null;
  selectedProductId: string | null;
  filters: {
    dateRange: string;      // 'day' | 'week' | 'month' | 'year'
    status: string;          // 'all' | 'active' | 'inactive' | ...
  };
  loading: boolean;
  error: string | null;
}
```

### Available Actions

| Action | Purpose | Parameters |
|--------|---------|-----------|
| `setLoading(boolean)` | Toggle loading state | Boolean |
| `setAnalytics(data)` | Store analytics data | Analytics object |
| `setSelectedUserId(id)` | Track selected user | User ID string |
| `setSelectedProductId(id)` | Track selected product | Product ID string |
| `setFilters(filters)` | Update filters | Partial filters object |
| `resetFilters()` | Clear all filters | None |
| `setError(message)` | Set error message | Error string |
| `clearError()` | Clear errors | None |
| `clearSelectedItems()` | Clear selections | None |

### Usage Example

```typescript
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '@/app/store';
import { setAnalytics, setFilters } from '@/features/admin/adminSlice';

export default function AdminPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { analytics, filters, loading } = useSelector(
    (state: RootState) => state.admin
  );

  // Update analytics
  dispatch(setAnalytics({
    totalRevenue: 125680,
    totalOrders: 523,
    totalUsers: 1250,
    totalProducts: 345,
    recentOrders: 45,
    topProducts: [...]
  }));

  // Update filters
  dispatch(setFilters({
    dateRange: 'month',
    status: 'active'
  }));
}
```

---

## Admin Pages

### 1. Admin Dashboard (`/admin`)

**Purpose:** Central hub showing business metrics and key performance indicators

**Components:**
- Total Revenue card
- Total Orders card
- Total Users card
- Total Products card
- Recent Orders list
- Top Products chart
- System Health status

**Data Displayed:**
```typescript
interface Analytics {
  totalRevenue: number;           // Total revenue in dollars
  totalOrders: number;            // Total orders count
  totalUsers: number;             // Total registered users
  totalProducts: number;          // Total products count
  recentOrders: number;           // Orders in last 24 hours
  topProducts: Array<{
    id: string;
    name: string;
    sales: number;
  }>;
}
```

**Key Features:**
- Real-time metrics
- Growth indicators (↑ X% from last month)
- Visual cards with icons
- Loading states
- Error handling

**Access:** Only admin users

---

### 2. Manage Users (`/admin/users`)

**Purpose:** View, search, filter, and manage user accounts

**Features:**

| Feature | Description |
|---------|-------------|
| **User List** | Paginated table of all users |
| **Search** | Search by name or email |
| **Filter by Role** | Filter: all, user, admin |
| **Filter by Status** | Filter: all, active, inactive, suspended |
| **View Details** | Click row to see user details |
| **Change Role** | Promote user to admin or demote |
| **Ban/Suspend** | Temporarily disable account |
| **View Orders** | See user's order history |
| **View Spending** | Total amount spent |
| **Bulk Actions** | Select multiple users |
| **Pagination** | 10 users per page |

**User Object Structure:**
```typescript
interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  status: 'active' | 'inactive' | 'suspended';
  joinDate: string;
  orders: number;
  totalSpent: number;
}
```

**Workflow:**
```
1. Admin opens /admin/users
2. Page loads user list (paginated)
3. Admin can:
   a) Search by name/email
   b) Filter by role/status
   c) Click user to view details
   d) Change user role
   e) Suspend/ban user
   f) Select multiple users for bulk action
4. Changes are saved to database
5. Confirmation toast shows result
```

---

### 3. Manage Products (`/admin/products`)

**Purpose:** Manage product inventory, pricing, and availability

**Features:**

| Feature | Description |
|---------|-------------|
| **Product List** | Paginated table of products |
| **Search** | Search by name or SKU |
| **Filter by Status** | Filter: all, active, inactive |
| **Add Product** | Create new product |
| **Edit Product** | Modify existing product |
| **Delete Product** | Remove product from catalog |
| **Bulk Actions** | Select and edit multiple |
| **Stock Management** | Update inventory levels |
| **Price Management** | View and update prices |
| **Category Assignment** | Assign products to categories |
| **Image Upload** | Add product images |
| **Pagination** | 10 products per page |

**Product Object Structure:**
```typescript
interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  category: string;
  image?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt?: string;
}
```

**Workflow:**
```
1. Admin opens /admin/products
2. Product list loads with filters
3. Admin can:
   a) Add new product → Fill form → Save
   b) Edit product → Click row → Update → Save
   c) Delete product → Confirm → Remove
   d) Bulk edit → Select multiple → Update → Save
4. Stock automatically decreases on orders
5. Low stock alerts generated at threshold
```

---

### 4. Manage Categories (`/admin/categories`)

**Purpose:** Organize products into categories

**Features:**
- View all categories
- Add new category
- Edit category name/description
- Delete category (if no products)
- Set category image
- Order categories

**Category Object:**
```typescript
interface Category {
  id: string;
  name: string;
  description: string;
  image?: string;
  productCount: number;
  status: 'active' | 'inactive';
}
```

---

### 5. Manage Orders (`/admin/orders`)

**Purpose:** Monitor and manage customer orders

**Features:**

| Feature | Description |
|---------|-------------|
| **Order List** | All orders with status |
| **Search** | Search by order ID |
| **Filter by Status** | Pending, processing, shipped, delivered |
| **View Details** | See full order information |
| **Update Status** | Change order status |
| **Track Shipment** | View tracking info |
| **Cancel Order** | Allow cancellation |
| **Refund** | Issue refunds |
| **Generate Invoice** | Create invoices |
| **Pagination** | Manage large order volumes |

**Order Object:**
```typescript
interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  total: number;
  shippingAddress: Address;
  createdAt: string;
  updatedAt?: string;
}
```

**Workflow:**
```
1. Customer places order
2. Admin sees order in pending status
3. Admin can:
   a) Approve order → Status: processing
   b) Ship order → Status: shipped
   c) Deliver order → Status: delivered
   d) Cancel order (if pending)
   e) Issue refund (if needed)
4. Customer receives notifications
5. Analytics updated accordingly
```

---

### 6. View Payments (`/admin/payments`)

**Purpose:** Monitor payment transactions

**Features:**
- Payment history
- Payment methods breakdown
- Failed payments
- Refunds
- Revenue tracking
- Export statements

---

### 7. Sales Analytics (`/admin/analytics`)

**Purpose:** Deep dive into sales data and trends

**Charts & Reports:**
- Daily/Weekly/Monthly revenue trends
- Product sales distribution
- Category performance
- Customer acquisition trends
- Top-performing products
- Customer lifetime value
- Conversion rates

---

## Workflows & Scenarios

### Scenario 1: Admin User First Login

```
1. Admin user navigates to http://localhost:5173/
2. RootRedirect checks isAuthenticated
3. Since not authenticated → Redirect to /login
4. Admin enters credentials
5. Backend validates (user.role = 'admin')
6. JWT tokens returned
7. Redux updated: isAuthenticated = true, user.role = 'admin'
8. RootRedirect now redirects to /dashboard
9. Admin navigates to /admin
10. AdminRoute checks:
    ✓ isAuthenticated = true
    ✓ user.role = 'admin'
11. Access granted → Show dashboard
12. Analytics loaded and displayed
```

**Code Flow:**
```typescript
// LoginPage.tsx
const handleLogin = async () => {
  const result = await dispatch(loginUser({ email, password })).unwrap();
  if (result) {
    navigate('/dashboard');  // Regular user
    // Admin would also redirect here, but can navigate to /admin next
  }
};

// AppRoutes.tsx
<Route element={<AdminRoute />}>
  <Route path="/admin" element={<AdminDashboardPage />} />
  {/* Other admin routes */}
</Route>
```

---

### Scenario 2: Admin Manages Users

```
Step 1: Navigate to Users Page
├─ Admin clicks "Manage Users" in sidebar
├─ URL: http://localhost:5173/admin/users
└─ ManageUsersPage component loads

Step 2: Load User Data
├─ useEffect triggers on mount
├─ dispatch(setLoading(true))
├─ Axios GET /api/admin/users
├─ Backend validates JWT
├─ Returns paginated user list
└─ dispatch(setLoading(false))

Step 3: Filter Users
├─ Admin enters search term: "john"
├─ Filters applied client-side (no new API call)
├─ Table updates: Shows only matching users
└─ Users table re-renders

Step 4: Change User Role
├─ Admin clicks "Make Admin" button for user
├─ Axios PUT /api/admin/users/{id}/role
├─ Body: { role: 'admin' }
├─ Backend validates request
├─ Database updated
├─ Toast: "User promoted to admin"
└─ Table refreshes

Step 5: Suspend User
├─ Admin clicks "Suspend" button
├─ Confirmation dialog appears
├─ Admin confirms
├─ Axios PUT /api/admin/users/{id}/status
├─ Body: { status: 'suspended' }
├─ Backend updates database
├─ Toast: "User suspended"
└─ User row status changes
```

---

### Scenario 3: Admin Adds New Product

```
Step 1: Navigate to Products
├─ Admin clicks "Manage Products"
├─ ProductsPage loads
└─ Current products displayed in table

Step 2: Open Add Product Modal
├─ Admin clicks "+ Add Product" button
├─ Modal dialog opens
└─ Empty form displayed

Step 3: Fill Product Details
├─ Name: "Wireless Headphones"
├─ SKU: "SKU-00001"
├─ Price: "$79.99"
├─ Stock: "50"
├─ Category: "Electronics"
├─ Status: "active"
└─ Description: "High-quality..."

Step 4: Upload Product Image
├─ Click file input
├─ Select image: "headphones.jpg"
├─ Preview shows in modal
└─ Ready to submit

Step 5: Save Product
├─ Click "Save" button
├─ Axios POST /api/admin/products
├─ Body: { name, sku, price, stock, category, image, status }
├─ Backend validates data
├─ Database stores product
├─ Toast: "Product created successfully"
├─ Modal closes
├─ New product appears in table
└─ New product ID assigned: "prod-xyz"

Step 6: Verify in Catalog
├─ Admin navigates to /products
├─ New product visible in catalog
├─ Product can be added to cart
└─ Regular users can purchase
```

---

### Scenario 4: Process Customer Order

```
Step 1: Order Arrives
├─ Customer places order
├─ Admin dashboard shows new order
├─ Notification: "New Order #1234"
└─ Status: "pending"

Step 2: View Order Details
├─ Admin clicks order in list
├─ Detailed view shows:
│  ├─ Items ordered
│  ├─ Total amount
│  ├─ Shipping address
│  ├─ Order notes
│  └─ Timeline
└─ Edit options available

Step 3: Approve Order
├─ Admin reviews order details
├─ Clicks "Approve" button
├─ Axios POST /api/admin/orders/{id}/approve
├─ Status: "pending" → "processing"
├─ Customer notification sent
└─ Toast: "Order approved"

Step 4: Prepare Shipment
├─ Warehouse prepares items
├─ Admin updates tracking number
├─ Clicks "Mark as Shipped"
├─ Axios PUT /api/admin/orders/{id}/ship
├─ Body: { tracking_number: "TRK-123..." }
├─ Status: "processing" → "shipped"
├─ Customer gets tracking email
└─ Toast: "Order shipped"

Step 5: Deliver Order
├─ Delivery confirmed
├─ Admin clicks "Mark as Delivered"
├─ Axios PUT /api/admin/orders/{id}/deliver
├─ Status: "shipped" → "delivered"
├─ Order marked complete
└─ Customer can leave review

Step 6: Analytics Update
├─ Order analytics recalculated
├─ Revenue updated
├─ Dashboard refreshes
└─ Metrics reflect new order
```

---

## API Endpoints

### User Management

```
GET /api/admin/users
└─ Get paginated list of users
   Query: ?page=1&limit=10&search=john&role=all&status=active

POST /api/admin/users/{id}/role
└─ Change user role
   Body: { role: 'admin' | 'user' }

PUT /api/admin/users/{id}/status
└─ Update user status
   Body: { status: 'active' | 'inactive' | 'suspended' }

GET /api/admin/users/{id}
└─ Get user details

DELETE /api/admin/users/{id}
└─ Delete user account
```

### Product Management

```
GET /api/admin/products
└─ Get all products
   Query: ?page=1&limit=10&status=all&search=

POST /api/admin/products
└─ Create new product
   Body: { name, sku, price, stock, category, status }

PUT /api/admin/products/{id}
└─ Update product
   Body: { name, price, stock, status, ... }

DELETE /api/admin/products/{id}
└─ Delete product

PUT /api/admin/products/{id}/stock
└─ Update stock level
   Body: { quantity: 50 }
```

### Order Management

```
GET /api/admin/orders
└─ Get all orders
   Query: ?page=1&limit=10&status=pending

PUT /api/admin/orders/{id}/status
└─ Update order status
   Body: { status: 'processing' | 'shipped' | 'delivered' }

PUT /api/admin/orders/{id}/ship
└─ Mark order shipped
   Body: { tracking_number: 'TRK-123...' }

POST /api/admin/orders/{id}/refund
└─ Issue refund
   Body: { amount: 99.99, reason: 'damaged' }

GET /api/admin/orders/{id}
└─ Get order details
```

### Analytics

```
GET /api/admin/analytics/dashboard
└─ Get dashboard metrics
   Returns: { totalRevenue, totalOrders, totalUsers, ... }

GET /api/admin/analytics/revenue
└─ Get revenue trends
   Query: ?period=month&year=2026

GET /api/admin/analytics/products
└─ Get top products
   Returns: [ { id, name, sales, revenue } ]

GET /api/admin/analytics/customers
└─ Get customer metrics
```

---

## Security & Permissions

### Role-Based Access Control (RBAC)

```
┌─────────────────────────────────────────────────────────┐
│                  User Roles & Permissions                 │
├──────────────┬──────────────┬──────────────┬────────────┤
│ Resource     │ Regular User │ Admin User   │ Public     │
├──────────────┼──────────────┼──────────────┼────────────┤
│ /admin       │ ❌ Blocked   │ ✅ Allowed   │ ❌         │
│ /admin/users │ ❌ Blocked   │ ✅ Allowed   │ ❌         │
│ /admin/...   │ ❌ Blocked   │ ✅ Allowed   │ ❌         │
│ /dashboard   │ ✅ Allowed   │ ✅ Allowed   │ ❌         │
│ /products    │ ✅ Allowed   │ ✅ Allowed   │ ✅ Allowed │
│ /login       │ ✅ Allowed   │ ✅ Allowed   │ ✅ Allowed │
└──────────────┴──────────────┴──────────────┴────────────┘
```

### Security Features

```
✅ JWT Authentication
   └─ Tokens verified on every admin request

✅ Role-Based Routing
   └─ AdminRoute checks user.role = 'admin'

✅ Backend Authorization
   └─ All /api/admin endpoints require ADMIN role

✅ CORS Protection
   └─ Only localhost:5173 allowed

✅ HTTPS (Production)
   └─ All API calls encrypted

✅ Token Refresh
   └─ Automatic token refresh on 401

✅ CSRF Protection
   └─ Spring Security enabled

✅ SQL Injection Prevention
   └─ Parameterized queries used
```

### Authentication Checks

```typescript
// Frontend - AdminRoute
const AdminRoute = () => {
  const { isAuthenticated, user } = useSelector(...);
  
  // Check 1: Authenticated?
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  // Check 2: Admin role?
  if (user?.role !== 'admin') {
    return <Navigate to="/" />;
  }
  
  return <Outlet />;
};

// Backend - @PreAuthorize
@GetMapping("/users")
@PreAuthorize("hasRole('ADMIN')")  // Only ADMIN can access
public ResponseEntity<List<UserResponse>> getAllUsers() {
  // Implementation
}
```

---

## User Flows

### Complete Admin Workflow (Day in Life)

```
9:00 AM - Morning Standup
├─ Admin logs in
├─ Views dashboard
├─ Checks overnight metrics
│  ├─ 23 new orders
│  ├─ 5 new users registered
│  └─ Revenue: $4,500
└─ Identifies action items

9:30 AM - Process Orders
├─ Navigate to /admin/orders
├─ View 15 pending orders
├─ Approve and mark for processing
├─ Generate picking lists
├─ Notify warehouse team
└─ Status updates sent to customers

10:00 AM - Manage Inventory
├─ Navigate to /admin/products
├─ Check low stock items
│  ├─ "USB Cable" - 5 units
│  ├─ "Phone Case" - 3 units
│  └─ "Screen Protector" - 2 units
├─ Restock from supplier
├─ Update inventory in system
└─ Set up low stock alerts

11:00 AM - Handle Customer Issues
├─ View dashboard notifications
├─ Check customer complaints
│  ├─ "Order #1001 - Damaged item"
│  └─ "Order #1002 - Wrong item received"
├─ Review orders
├─ Issue refunds
├─ Send apology messages
└─ Offer replacements

12:00 PM - Add New Products
├─ Receive new shipment from supplier
├─ Add products to catalog
│  ├─ Create 5 new products
│  ├─ Upload product images
│  ├─ Set prices
│  └─ Assign to categories
├─ Activate for sale
└─ Email marketing team

2:00 PM - Analytics Review
├─ Navigate to /admin/analytics
├─ Review daily metrics
│  ├─ Top 5 products
│  ├─ Revenue trends
│  ├─ Customer acquisition
│  └─ Conversion rates
├─ Analyze performance
├─ Plan marketing campaigns
└─ Report to management

4:00 PM - User Management
├─ Review new user registrations
├─ Promote active sellers to admin
├─ Suspend fraudulent accounts
├─ Review customer feedback
└─ Update customer segments

5:00 PM - Close of Business
├─ Final dashboard review
├─ All orders processed
├─ Inventory updated
├─ Issues resolved
├─ Log off
└─ System secure
```

---

## Database Relations

### Database Schema

```
┌─────────────────┐
│     Users       │
├─────────────────┤
│ id (PK)         │
│ name            │
│ email (UNIQUE)  │
│ password        │
│ role            │◄────┐
│ status          │     │
│ created_at      │     │
└─────────────────┘     │
         │              │
         │ 1:M          │
         ├──────────────┤
         │              │
    ┌────▼──────────┐   │
    │   Orders      │   │
    ├───────────────┤   │
    │ id (PK)       │   │
    │ user_id (FK)  │───┘
    │ total         │
    │ status        │
    │ created_at    │
    └────┬──────────┘
         │ 1:M
         │
    ┌────▼──────────────┐
    │  Order Items      │
    ├───────────────────┤
    │ id (PK)           │
    │ order_id (FK)     │
    │ product_id (FK)───────┐
    │ quantity          │    │
    │ price             │    │
    └───────────────────┘    │
                             │
                    ┌────────▼────────────┐
                    │    Products         │
                    ├────────────────────┤
                    │ id (PK)            │
                    │ name               │
                    │ price              │
                    │ stock              │
                    │ category_id (FK)───┐
                    │ status             │ │
                    │ created_at         │ │
                    └────────────────────┘ │
                                           │
                                 ┌─────────▼────┐
                                 │ Categories   │
                                 ├──────────────┤
                                 │ id (PK)      │
                                 │ name         │
                                 │ description  │
                                 └──────────────┘
```

---

## Summary

The Admin Module is a **comprehensive, production-ready management system** that provides administrators with complete control over:
- User accounts and permissions
- Product catalog and inventory
- Order processing and fulfillment
- Payment and revenue tracking
- Analytics and business intelligence

**Key Strengths:**
✅ Secure role-based access  
✅ Intuitive user interface  
✅ Real-time data updates  
✅ Comprehensive reporting  
✅ Scalable architecture  

---

**For more information, refer to related documentation:**
- Authentication Flow: `AUTH_FLOW_IMPLEMENTATION_COMPLETE.md`
- Backend API: `SPRING_BOOT_BACKEND_FINAL_STATUS.md`
- Complete Project Guide: `COMPLETE_PROJECT_DELIVERY_CHECKLIST.md`

