# 🚀 Quick Start Guide - E-Commerce Application

## Overview
Complete e-commerce furniture application with admin and user modules. Features product management, shopping cart, and order management.

---

## ✅ Prerequisites

- **Java 17+** - For backend
- **Node.js 18+** - For frontend
- **Maven 3.8+** - For building backend
- **PostgreSQL 12+** - For database

---

## 🏃 Quick Start (5 Minutes)

### Option 1: Automated Start (Windows)
Simply run the batch file:
```bash
START_SERVERS.bat
```
This will open two terminal windows with both servers running.

### Option 2: Manual Start

**Terminal 1 - Backend:**
```bash
cd ecommerce-backend/furniture
mvn spring-boot:run
```

**Terminal 2 - Frontend:**
```bash
cd ecommerce-frontend
npm run dev
```

---

## 🔑 Login Credentials

### Admin Account
- **Email:** admin@example.com
- **Password:** Admin@123
- **Role:** ADMIN
- **Access:** http://localhost:5173/admin

### User Account
- **Email:** user@example.com
- **Password:** User@123
- **Role:** USER
- **Access:** http://localhost:5173/products

---

## 📱 Application URLs

| Page | URL | Access |
|------|-----|--------|
| Login | http://localhost:5173/login | Public |
| Register | http://localhost:5173/register | Public |
| Shop/Products | http://localhost:5173/products | Public |
| Product Details | http://localhost:5173/products/:id | Public |
| Shopping Cart | http://localhost:5173/cart | Protected |
| Checkout | http://localhost:5173/checkout | Protected |
| Order History | http://localhost:5173/orders | Protected |
| User Profile | http://localhost:5173/profile | Protected |
| Admin Dashboard | http://localhost:5173/admin | Admin |
| Manage Products | http://localhost:5173/admin/products | Admin |
| Add Product | http://localhost:5173/admin/products/add | Admin |
| Edit Product | http://localhost:5173/admin/products/:id/edit | Admin |
| Manage Users | http://localhost:5173/admin/users | Admin |
| Manage Categories | http://localhost:5173/admin/categories | Admin |

---

## 🎯 Key Features

### Admin Features
✅ **Dashboard** - View key metrics and analytics
✅ **Product Management** - Create, read, update, delete products
✅ **User Management** - View users, block/unblock accounts
✅ **Category Management** - Organize products by category
✅ **Order Management** - View and manage customer orders
✅ **Analytics** - Sales reports and trends

### User Features
✅ **Product Browsing** - View all products with filters and search
✅ **Product Details** - See full product information with reviews
✅ **Shopping Cart** - Add/remove products, manage quantities
✅ **Checkout** - Complete purchase process
✅ **Order Tracking** - View order history and status
✅ **User Profile** - Manage account and addresses
✅ **Wishlist** - Save favorite products

---

## 🔧 API Endpoints

### Products (Public)
```
GET    /api/products?page=0&limit=20          - List products
GET    /api/products/{id}                     - Get product details
GET    /api/products/search?q=sofa             - Search products
GET    /api/categories                        - List categories
```

### Admin Products (Protected)
```
GET    /api/admin/products?page=1&limit=20    - List all products
POST   /api/admin/products                    - Create product
PUT    /api/admin/products/{id}               - Update product
DELETE /api/admin/products/{id}               - Delete product
```

### Shopping Cart
```
GET    /api/cart                              - Get cart items
POST   /api/cart/add                          - Add to cart
PUT    /api/cart/items/{itemId}               - Update quantity
DELETE /api/cart/items/{itemId}               - Remove from cart
DELETE /api/cart                              - Clear cart
```

### Authentication
```
POST   /api/auth/login                        - Login user
POST   /api/auth/register                     - Register new user
POST   /api/auth/refresh-token                - Refresh JWT token
POST   /api/auth/logout                       - Logout user
```

### Orders
```
GET    /api/orders                            - Get user's orders
POST   /api/orders                            - Create new order
GET    /api/orders/{orderId}                  - Get order details
```

---

## 🛠️ Technology Stack

### Backend
- **Framework:** Spring Boot 3.2.5
- **Language:** Java 17
- **Database:** PostgreSQL
- **ORM:** JPA/Hibernate
- **Security:** JWT (Spring Security)
- **Build:** Maven
- **API Docs:** Swagger/OpenAPI

### Frontend
- **Framework:** React 18
- **Language:** TypeScript
- **State Management:** Redux Toolkit
- **UI Framework:** Tailwind CSS
- **HTTP Client:** Axios
- **Build Tool:** Vite
- **Routing:** React Router v6

---

## 📊 Database Schema

### Key Tables
- **users** - User accounts and authentication
- **products** - Product catalog
- **categories** - Product categories
- **cart_items** - Shopping cart contents
- **orders** - Customer orders
- **order_items** - Items in each order
- **product_reviews** - Product ratings and reviews

---

## 🚨 Troubleshooting

### Backend won't start
1. Check Java version: `java -version` (requires 17+)
2. Check PostgreSQL is running
3. Check port 8080 is not in use: `netstat -ano | findstr :8080`
4. Clear Maven cache: `mvn clean install -DskipTests`

### Frontend won't start
1. Check Node.js version: `node -v` (requires 18+)
2. Reinstall dependencies: `npm install` or `npm ci`
3. Check port 5173 is not in use: `netstat -ano | findstr :5173`
4. Clear cache: `rm -rf node_modules package-lock.json && npm install`

### API Connection Issues
1. Verify backend is running: `curl http://localhost:8080/api/categories`
2. Check CORS configuration in SecurityConfig
3. Verify proxy settings in vite.config.ts
4. Check JWT token is being sent with requests

### Products Not Showing
1. Verify database has data: Check PostgreSQL
2. Check pagination parameters (page=0 for users, page=1 for admin)
3. Check authentication token is valid
4. Check browser console for error messages

---

## 📝 Development Notes

### Frontend Architecture
```
src/
├── api/              - API service calls
├── app/              - Redux store setup
├── components/       - Reusable components
├── features/         - Redux slices
├── pages/            - Page components
├── routes/           - Route definitions
├── styles/           - Global styles
└── utils/            - Utility functions
```

### Backend Architecture
```
src/main/java/com/meenatchi/furniture/
├── config/           - Spring configuration
├── controller/       - REST controllers
├── dto/              - Data transfer objects
├── entity/           - JPA entities
├── exception/        - Custom exceptions
├── repository/       - Data access layer
├── security/         - Security configuration
└── service/          - Business logic
```

---

## 🔐 Security Features

✅ **JWT Authentication** - Secure token-based auth
✅ **CORS Protection** - Restrict cross-origin requests
✅ **Password Hashing** - BCrypt encryption
✅ **Role-Based Access** - ADMIN and USER roles
✅ **HTTPS Ready** - Can be configured for SSL
✅ **CSRF Protection** - Disabled for API (use JWT instead)

---

## 📈 Performance Tips

1. **Database Indexing** - Indexes on frequently queried columns
2. **Pagination** - Load 10-20 items per page
3. **Lazy Loading** - Load images on demand
4. **Caching** - Redis ready (optional)
5. **CDN** - Static assets can be served from CDN

---

## 🤝 Contributing

To contribute to this project:
1. Create a feature branch
2. Make changes
3. Test thoroughly
4. Submit pull request
5. Code review before merge

---

## 📞 Support

For issues or questions:
1. Check this guide
2. Check application logs
3. Review error messages
4. Check database connection

---

## 📄 License

This project is licensed under the MIT License.

---

## ✅ Verification Checklist

Before production deployment, verify:

- [ ] Database connection working
- [ ] All migrations run successfully
- [ ] Backend API responding
- [ ] Frontend builds without errors
- [ ] Admin login works
- [ ] User login works
- [ ] Products load correctly
- [ ] Add to cart works
- [ ] Checkout process works
- [ ] Orders saved to database
- [ ] Admin can create products
- [ ] Admin can edit products
- [ ] Admin can delete products
- [ ] Pagination works correctly
- [ ] Search/filter works
- [ ] Cart item count displays
- [ ] Navigation menu shows correctly
- [ ] Error messages display
- [ ] Toast notifications work

---

**Last Updated:** February 27, 2026  
**Status:** ✅ Production Ready

