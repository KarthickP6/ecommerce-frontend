# Admin Module - Quick Reference Guide

## API Endpoints Summary

### Dashboard
```bash
GET /api/admin/dashboard
Authorization: Bearer {token}

Response:
{
  "success": true,
  "data": {
    "totalUsers": 45,
    "totalProducts": 120,
    "totalOrders": 890,
    "totalRevenue": 125000.00,
    "pendingOrders": 15
  }
}
```

### Users Management

#### Get All Users (Paginated)
```bash
GET /api/admin/users?page=1&limit=20&search=john&status=active
Authorization: Bearer {token}

Response:
{
  "success": true,
  "data": {
    "content": [
      {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "+1234567890",
        "avatar": "url",
        "roles": ["USER"],
        "createdAt": "2024-02-27T10:00:00"
      }
    ],
    "totalElements": 45,
    "totalPages": 3,
    "currentPage": 1
  }
}
```

#### Block User
```bash
PUT /api/admin/users/{userId}/block
Authorization: Bearer {token}
Content-Type: application/json

Request:
{
  "blocked": true,
  "reason": "Suspicious activity detected"
}

Response:
{
  "success": true,
  "message": "User blocked successfully",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "blocked": true,
    ...
  }
}
```

#### Unblock User
```bash
PUT /api/admin/users/{userId}/unblock
Authorization: Bearer {token}

Response:
{
  "success": true,
  "message": "User unblocked successfully",
  "data": { ... }
}
```

### Products Management

#### Get All Products (Paginated)
```bash
GET /api/admin/products?page=1&limit=20
Authorization: Bearer {token}

Response:
{
  "success": true,
  "data": {
    "content": [
      {
        "id": 1,
        "name": "Sofa",
        "description": "Comfortable sofa",
        "price": 499.99,
        "stock": 10,
        "rating": 4.5,
        "category": { "id": 1, "name": "Living Room" },
        "images": ["url1", "url2"],
        "createdAt": "2024-02-27T10:00:00"
      }
    ],
    "totalElements": 120,
    "currentPage": 1
  }
}
```

#### Create Product
```bash
POST /api/admin/products
Authorization: Bearer {token}
Content-Type: application/json

Request:
{
  "name": "Dining Table",
  "description": "Modern dining table",
  "price": 299.99,
  "stock": 50,
  "categoryId": 2
}

Response:
{
  "success": true,
  "message": "Product created successfully",
  "data": { ... }
}
```

#### Update Product
```bash
PUT /api/admin/products/{productId}
Authorization: Bearer {token}
Content-Type: application/json

Request:
{
  "name": "Updated Dining Table",
  "description": "Updated description",
  "price": 349.99,
  "stock": 45,
  "categoryId": 2
}

Response:
{
  "success": true,
  "message": "Product updated successfully",
  "data": { ... }
}
```

#### Delete Product
```bash
DELETE /api/admin/products/{productId}
Authorization: Bearer {token}

Response:
{
  "success": true,
  "message": "Product deleted successfully"
}
```

### Orders Management

#### Get All Orders (Paginated)
```bash
GET /api/admin/orders?page=1&limit=20
Authorization: Bearer {token}

Response:
{
  "success": true,
  "data": {
    "content": [
      {
        "id": 1,
        "orderNumber": "ORD-2024-001",
        "status": "PENDING",
        "totalPrice": 1299.99,
        "shippingAddress": "123 Main St",
        "notes": "Handle with care",
        "createdAt": "2024-02-27T10:00:00",
        "updatedAt": "2024-02-27T10:00:00"
      }
    ],
    "totalElements": 890,
    "currentPage": 1
  }
}
```

#### Update Order Status
```bash
PUT /api/admin/orders/{orderId}/status
Authorization: Bearer {token}
Content-Type: application/json

Request:
{
  "status": "SHIPPED"
}

Valid Status Values:
- PENDING
- PROCESSING
- SHIPPED
- DELIVERED
- CANCELLED

Response:
{
  "success": true,
  "message": "Order status updated successfully",
  "data": { ... }
}
```

---

## Frontend Usage

### Using in React Component

```typescript
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchUsers, 
  blockUserThunk,
  fetchProducts,
  createProductThunk,
  deleteProductThunk,
  fetchOrders,
  updateOrderStatusThunk,
  fetchDashboardStats
} from '@/features/admin/adminSlice';

export function AdminDashboard() {
  const dispatch = useDispatch();
  const { dashboard, users, products, orders, loading, error } = useSelector(
    state => state.admin
  );

  // Load dashboard on mount
  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, []);

  return (
    <div>
      {/* Display stats */}
      <div>
        <p>Total Users: {dashboard?.totalUsers}</p>
        <p>Total Products: {dashboard?.totalProducts}</p>
        <p>Total Orders: {dashboard?.totalOrders}</p>
        <p>Total Revenue: ${dashboard?.totalRevenue}</p>
        <p>Pending Orders: {dashboard?.pendingOrders}</p>
      </div>
    </div>
  );
}

export function ManageUsers() {
  const dispatch = useDispatch();
  const { users, loading } = useSelector(state => state.admin);

  useEffect(() => {
    dispatch(fetchUsers({ page: 1, limit: 20 }));
  }, []);

  const handleBlockUser = (userId) => {
    dispatch(blockUserThunk({
      id: userId,
      blocked: true,
      reason: "Admin action"
    }));
  };

  return (
    <div>
      {users.data.map(user => (
        <div key={user.id}>
          <p>{user.name} - {user.email}</p>
          <button onClick={() => handleBlockUser(user.id)}>
            Block User
          </button>
        </div>
      ))}
    </div>
  );
}

export function ManageProducts() {
  const dispatch = useDispatch();
  const { products, loading } = useSelector(state => state.admin);

  useEffect(() => {
    dispatch(fetchProducts({ page: 1, limit: 20 }));
  }, []);

  const handleCreateProduct = (productData) => {
    dispatch(createProductThunk({
      name: "New Product",
      description: "Description",
      price: 299.99,
      stock: 100,
      categoryId: 1
    }));
  };

  const handleDeleteProduct = (productId) => {
    dispatch(deleteProductThunk(productId.toString()));
  };

  return (
    <div>
      <button onClick={handleCreateProduct}>Create Product</button>
      {products.data.map(product => (
        <div key={product.id}>
          <p>{product.name} - ${product.price}</p>
          <button onClick={() => handleDeleteProduct(product.id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export function ManageOrders() {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector(state => state.admin);

  useEffect(() => {
    dispatch(fetchOrders({ page: 1, limit: 20 }));
  }, []);

  const handleUpdateStatus = (orderId, newStatus) => {
    dispatch(updateOrderStatusThunk({
      id: orderId.toString(),
      status: newStatus
    }));
  };

  return (
    <div>
      {orders.data.map(order => (
        <div key={order.id}>
          <p>{order.orderNumber} - {order.status}</p>
          <select onChange={(e) => handleUpdateStatus(order.id, e.target.value)}>
            <option value="PENDING">Pending</option>
            <option value="PROCESSING">Processing</option>
            <option value="SHIPPED">Shipped</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      ))}
    </div>
  );
}
```

---

## Security Features

### Blocked User Behavior

1. **Blocked User Cannot Login**
   - When user is blocked via `PUT /admin/users/{id}/block`
   - User's `blocked` field set to `true` in database
   - Next login attempt fails with error
   - Spring Security disables account (CustomUserDetailsService)

2. **Admin Can Unblock**
   - Admin calls `PUT /admin/users/{id}/unblock`
   - User's `blocked` field set to `false` in database
   - User can login again immediately

### Admin Protection

- All endpoints require `@PreAuthorize("hasRole('ADMIN')")`
- JWT token must contain ADMIN role
- Unauthorized requests return 403 Forbidden
- Method-level security enforced at controller layer

---

## Database Tables

### Users Table
```sql
CREATE TABLE users (
  id BIGINT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  avatar TEXT,
  blocked BOOLEAN DEFAULT false,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL
);
```

### Products Table
```sql
CREATE TABLE products (
  id BIGINT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(19,2) NOT NULL,
  stock INT NOT NULL,
  rating DOUBLE DEFAULT 0.0,
  category_id BIGINT NOT NULL,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  FOREIGN KEY (category_id) REFERENCES categories(id)
);
```

### Orders Table
```sql
CREATE TABLE orders (
  id BIGINT PRIMARY KEY,
  order_number VARCHAR(50) UNIQUE NOT NULL,
  user_id BIGINT NOT NULL,
  status VARCHAR(50) NOT NULL,
  total_price DECIMAL(19,2),
  shipping_address_id BIGINT,
  notes TEXT,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (shipping_address_id) REFERENCES addresses(id)
);
```

---

## Error Handling

### Backend Errors
```json
{
  "success": false,
  "message": "Product not found with id: 999",
  "timestamp": "2024-02-27T10:00:00"
}
```

### Frontend Redux Error
```typescript
const { error } = useSelector(state => state.admin);

if (error) {
  return <div className="error">{error}</div>;
}
```

---

## Pagination

All list endpoints support pagination:

```typescript
dispatch(fetchUsers({ 
  page: 1,        // Page number (1-indexed)
  limit: 20,      // Items per page
  search: 'john', // Optional search
  status: 'active' // Optional filter
}));

// Result structure
{
  content: [...],        // Array of items
  totalElements: 45,     // Total count
  totalPages: 3,         // Total pages
  currentPage: 1         // Current page
}
```

---

## Testing Commands

```bash
# Get Dashboard Stats
curl -H "Authorization: Bearer ${TOKEN}" \
  http://localhost:8080/api/admin/dashboard

# Get Users
curl -H "Authorization: Bearer ${TOKEN}" \
  "http://localhost:8080/api/admin/users?page=1&limit=20&search=john&status=active"

# Block User
curl -X PUT -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"blocked":true,"reason":"Suspicious"}' \
  http://localhost:8080/api/admin/users/1/block

# Create Product
curl -X POST -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "name":"Sofa",
    "description":"Comfortable",
    "price":499.99,
    "stock":10,
    "categoryId":1
  }' \
  http://localhost:8080/api/admin/products

# Update Order Status
curl -X PUT -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"status":"SHIPPED"}' \
  http://localhost:8080/api/admin/orders/1/status
```

---

**Implementation:** 100% Complete ✅
**Database-Driven:** Yes ✅
**Security:** JWT + Role-Based ✅
**Error Handling:** Global + Local ✅

