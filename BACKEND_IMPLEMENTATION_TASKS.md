# Spring Boot Backend - Complete Implementation Checklist

## ✅ Phase 1: Project Setup

### Step 1.1: Create Maven Project Structure
```bash
mvn archetype:generate -DgroupId=com.furniture \
  -DartifactId=furniture-backend \
  -DarchetypeArtifactId=maven-archetype-quickstart
```

### Step 1.2: Dependencies Configuration
✅ All dependencies ready in pom.xml:
- Spring Boot 3.x starters
- PostgreSQL driver
- JWT libraries
- Lombok
- MapStruct
- Flyway
- SpringDoc OpenAPI

### Step 1.3: Configuration Files
✅ Create files:
- application.yml
- application-dev.yml
- application-prod.yml

---

## 🔐 Phase 2: Security Layer (Priority High)

### Files to Implement:
1. **JwtTokenProvider.java**
   - Generate access token (15 mins)
   - Generate refresh token (7 days)
   - Validate token
   - Extract username from token

2. **JwtAuthenticationFilter.java**
   - Extract JWT from request
   - Validate and authenticate

3. **CustomUserDetailsService.java**
   - Load user by username
   - Implement UserDetails

4. **SecurityConfig.java**
   - Setup security filter chain
   - Configure CORS
   - Password encoder (BCrypt)

5. **Exception Classes**
   - ResourceNotFoundException
   - BadRequestException
   - UnauthorizedException

---

## 📦 Phase 3: Entity Models (Priority High)

### Core Entities:
1. **User.java** - User account
2. **Role.java** - User roles (ADMIN, USER)
3. **Product.java** - Product catalog
4. **Category.java** - Product categories
5. **ProductImage.java** - Product images
6. **Cart.java** - User shopping cart
7. **CartItem.java** - Items in cart
8. **Order.java** - User orders
9. **OrderItem.java** - Items in order
10. **Payment.java** - Payment records
11. **Review.java** - Product reviews
12. **Address.java** - Shipping addresses
13. **Wishlist.java** - Favorite products

---

## 🗄️ Phase 4: Repository Layer (Priority High)

### Repositories to Create:
```
UserRepository.java
RoleRepository.java
ProductRepository.java (with JpaSpecificationExecutor)
CategoryRepository.java
CartRepository.java
CartItemRepository.java
OrderRepository.java
OrderItemRepository.java
PaymentRepository.java
ReviewRepository.java
AddressRepository.java
WishlistRepository.java
```

### Key Methods to Implement:
- ProductRepository: search, findByCategory, filter by price
- OrderRepository: findByUser, findByStatus
- CartRepository: findByUser
- ReviewRepository: findByProduct
- AddressRepository: findByUser, findDefault

---

## 🛠️ Phase 5: Service Layer (Priority High)

### 1. AuthService
```
- login(email, password) → AuthResponse
- register(name, email, password) → AuthResponse
- logout()
- refreshToken(token) → AuthResponse
- forgotPassword(email)
- resetPassword(token, newPassword)
- validateToken()
```

### 2. ProductService
```
- getAllProducts(page, limit, filters) → Page<ProductResponse>
- getProductById(id) → ProductResponse
- searchProducts(query) → Page<ProductResponse>
- filterProducts(minPrice, maxPrice, category) → Page<ProductResponse>
- createProduct(request) → ProductResponse [ADMIN]
- updateProduct(id, request) → ProductResponse [ADMIN]
- deleteProduct(id) [ADMIN]
- rateProduct(id, rating) → Double
- addReview(id, review)
```

### 3. CartService
```
- getCart() → CartResponse
- addToCart(productId, quantity) → CartResponse
- updateCartItem(itemId, quantity) → CartResponse
- removeFromCart(itemId) → CartResponse
- clearCart()
- validateCart() → Boolean
```

### 4. OrderService
```
- createOrder(items, shippingAddress) → OrderResponse
- getOrders(page, limit) → Page<OrderResponse>
- getOrderById(id) → OrderResponse
- getOrderHistory(userId) → Page<OrderResponse>
- updateOrderStatus(id, status) → OrderResponse [ADMIN]
- cancelOrder(id) → OrderResponse
- processPayment(orderId, amount)
```

### 5. UserService
```
- getUserProfile() → UserResponse
- updateProfile(request) → UserResponse
- getAddresses() → List<AddressResponse>
- addAddress(request) → AddressResponse
- updateAddress(id, request) → AddressResponse
- deleteAddress(id)
- getWishlist() → List<ProductResponse>
- addToWishlist(productId)
- removeFromWishlist(productId)
```

### 6. AdminService
```
- getDashboard() → DashboardResponse
- getAllUsers(page) → Page<UserResponse>
- blockUser(id, reason)
- getOrders(page, filters) → Page<OrderResponse>
- getSalesAnalytics(period) → SalesAnalyticsResponse
- getPaymentMethods() → List<String>
```

---

## 🌐 Phase 6: REST Controllers (Priority High)

### 1. AuthController
```
POST   /api/auth/login
POST   /api/auth/register
POST   /api/auth/logout
POST   /api/auth/refresh-token
POST   /api/auth/forgot-password
POST   /api/auth/reset-password
GET    /api/auth/verify-token
```

### 2. ProductController
```
GET    /api/products?page=1&limit=12&minPrice=100&maxPrice=5000
GET    /api/products/{id}
GET    /api/products/search?q=sofa
GET    /api/categories
GET    /api/products/category/{categoryId}
POST   /api/products [ADMIN]
PUT    /api/products/{id} [ADMIN]
DELETE /api/products/{id} [ADMIN]
POST   /api/products/{id}/rate
POST   /api/products/{id}/reviews
```

### 3. CartController
```
GET    /api/cart
POST   /api/cart/items
PUT    /api/cart/items/{itemId}
DELETE /api/cart/items/{itemId}
POST   /api/cart/clear
POST   /api/cart/validate
```

### 4. OrderController
```
POST   /api/orders
GET    /api/orders?page=1&limit=10
GET    /api/orders/{id}
GET    /api/orders/user/history
PUT    /api/orders/{id}/status [ADMIN]
POST   /api/orders/{id}/cancel
POST   /api/orders/{id}/payment
GET    /api/payment-methods
```

### 5. UserController
```
GET    /api/users/profile
PUT    /api/users/profile
POST   /api/users/addresses
GET    /api/users/addresses
PUT    /api/users/addresses/{id}
DELETE /api/users/addresses/{id}
GET    /api/users/wishlist
POST   /api/users/wishlist
DELETE /api/users/wishlist/{productId}
```

### 6. AdminController
```
GET    /api/admin/dashboard
GET    /api/admin/users?page=1&search=name
PUT    /api/admin/users/{id}/block
GET    /api/admin/orders?page=1&status=pending
GET    /api/admin/analytics/sales?period=monthly
GET    /api/payment-methods
```

---

## 💾 Phase 7: Database Configuration

### Flyway Migrations:
```sql
V1__create_roles_table.sql
V2__create_users_table.sql
V3__create_user_roles_table.sql
V4__create_categories_table.sql
V5__create_products_table.sql
V6__create_product_images_table.sql
V7__create_carts_table.sql
V8__create_cart_items_table.sql
V9__create_orders_table.sql
V10__create_order_items_table.sql
V11__create_payments_table.sql
V12__create_reviews_table.sql
V13__create_addresses_table.sql
V14__create_wishlist_table.sql
```

### Sample SQL for Users Table:
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    profile_image_url TEXT,
    enabled BOOLEAN DEFAULT true,
    locked BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_roles (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);

-- Insert default roles
INSERT INTO roles (name) VALUES ('ROLE_USER'), ('ROLE_ADMIN');
```

---

## 📊 API Response Format

```json
{
  "success": true,
  "message": "Operation successful",
  "data": { /* actual data */ },
  "timestamp": "2024-02-25T10:30:00"
}
```

### Error Response:
```json
{
  "success": false,
  "message": "User not found",
  "data": null,
  "timestamp": "2024-02-25T10:30:00"
}
```

---

## 🔍 Testing Endpoints

### Using Postman or cURL:

**1. Register User**
```
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

**2. Login**
```
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "password123"
}
```

**3. Get All Products**
```
GET /api/products?page=1&limit=12&minPrice=100&maxPrice=5000
Headers: Authorization: Bearer {accessToken}
```

**4. Add to Cart**
```
POST /api/cart/items
{
  "productId": "uuid",
  "quantity": 2
}
```

---

## 📋 Summary

| Module | Endpoints | Services | Controllers |
|--------|-----------|----------|-------------|
| Auth | 7 | 1 | 1 |
| Products | 10 | 1 | 1 |
| Cart | 6 | 1 | 1 |
| Orders | 8 | 1 | 1 |
| Users | 9 | 1 | 1 |
| Admin | 5 | 1 | 1 |
| **Total** | **45** | **6** | **6** |

---

## ⏱️ Estimated Timeline

- Phase 1-2 (Setup & Security): **1 day**
- Phase 3-4 (Models & Repositories): **1 day**
- Phase 5 (Services): **2 days**
- Phase 6 (Controllers): **1 day**
- Phase 7 (Database): **1 day**
- Testing & Refinement: **1 day**

**Total: 7 days for complete implementation**

---

## 🚀 Next Steps

1. Create Maven project structure
2. Add all dependencies to pom.xml
3. Configure application.yml
4. Implement security layer (JWT)
5. Create all entity classes
6. Create database migration scripts
7. Implement repositories
8. Implement services
9. Implement controllers
10. Test all endpoints
11. Deploy to production


