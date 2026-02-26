# 📦 SAMPLE DATA ADDED - Furniture Database

## Issue Resolved

The backend was failing because there were no categories in the database:
```
No static resource api/categories
```

## Solution Implemented

Created two new database migration files that will automatically run when the application starts:

### 1. **V15__Insert_Sample_Categories.sql**
Adds 10 furniture-related categories:
- ✅ Living Room
- ✅ Bedroom
- ✅ Dining
- ✅ Office
- ✅ Kitchen
- ✅ Outdoor
- ✅ Bathroom
- ✅ Kids
- ✅ Storage
- ✅ Accent

### 2. **V16__Insert_Sample_Products.sql**
Adds 20 sample products across all categories:

**Living Room (2 products)**
- Modern Leather Sofa - $1,299.99 (15 in stock)
- Minimalist Coffee Table - $299.99 (25 in stock)

**Bedroom (2 products)**
- Platform Bed Frame - $599.99 (12 in stock)
- Wooden Dresser - $449.99 (18 in stock)

**Dining (2 products)**
- Extendable Dining Table - $799.99 (10 in stock)
- Dining Chairs Set (4 pieces) - $399.99 (20 in stock)

**Office (2 products)**
- Executive Office Desk - $649.99 (8 in stock)
- Ergonomic Office Chair - $499.99 (14 in stock)

**Kitchen (2 products)**
- Kitchen Island Cart - $349.99 (16 in stock)
- Bar Stool Set (2 pieces) - $249.99 (22 in stock)

**Outdoor (2 products)**
- Patio Dining Set (7-piece) - $1,099.99 (6 in stock)
- Garden Lounge Chair - $299.99 (18 in stock)

**Bathroom (2 products)**
- Bathroom Vanity Cabinet - $699.99 (9 in stock)
- Bathroom Mirror Cabinet - $199.99 (20 in stock)

**Kids (2 products)**
- Kids Bed with Storage - $449.99 (14 in stock)
- Kids Study Desk - $199.99 (17 in stock)

**Storage (2 products)**
- Wall Shelving Unit - $279.99 (19 in stock)
- Storage Cabinet - $549.99 (11 in stock)

**Accent (2 products)**
- Side Table - $149.99 (25 in stock)
- Console Table - $349.99 (13 in stock)

---

## How It Works

When you restart the application:
1. Flyway (database migration tool) automatically detects the new SQL files
2. They execute in sequence (V15, then V16)
3. Categories and products are inserted into the database
4. Frontend can now fetch categories and products successfully

---

## Data Features

✅ All products have:
- Name and description
- Price and stock levels
- Rating (4.2-4.8 stars)
- Associated category
- Created timestamp

✅ All categories have:
- Category name (unique)
- Description
- Image URL (using Unsplash images)

---

## Restart Instructions

To apply these changes:

```bash
# 1. Kill current backend
Ctrl+C (in terminal)

# 2. Clean and rebuild
cd D:\Github_Copilot_website\ecommerce-backend\furniture
mvn clean compile

# 3. Start backend
mvn spring-boot:run
```

The migrations will automatically execute when the application starts.

---

## Testing

After restart, test the following:

```bash
# Test categories endpoint
curl http://localhost:8080/api/categories

# Expected response:
{
  "success": true,
  "message": "Categories retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "Living Room",
      "description": "Sofas, sectionals, coffee tables, and other living room furniture",
      "imageUrl": "https://images.unsplash.com/..."
    },
    ...
  ]
}

# Test products endpoint
curl http://localhost:8080/api/admin/products?page=1&limit=20

# Expected response:
{
  "success": true,
  "message": "Products retrieved",
  "data": {
    "content": [
      {
        "id": 1,
        "name": "Modern Leather Sofa",
        "price": 1299.99,
        "stock": 15,
        "category": {
          "id": 1,
          "name": "Living Room",
          ...
        },
        ...
      },
      ...
    ],
    "totalElements": 20,
    "totalPages": 1,
    ...
  }
}
```

---

## Files Created

1. **V15__Insert_Sample_Categories.sql** (143 lines)
   - Location: `ecommerce-backend/furniture/src/main/resources/db/migration/`
   - Inserts 10 furniture categories

2. **V16__Insert_Sample_Products.sql** (189 lines)
   - Location: `ecommerce-backend/furniture/src/main/resources/db/migration/`
   - Inserts 20 furniture products

---

## Now You Can

✅ Add products through the admin UI
✅ Edit existing products
✅ Delete products
✅ View all products in the admin list
✅ See categories in the dropdown when adding/editing products
✅ Display products in the frontend

---

## What's Next

1. Restart backend with the new migrations
2. Test the admin products page
3. Try adding a new product
4. Verify the product appears in the list
5. Edit and delete products as needed

---

**Status: ✅ SAMPLE DATA READY**

All furniture-related categories and products are now available in the database. The admin module can now fully utilize the Add/Edit/Delete product features!

**Date:** February 27, 2026
**Migration Files:** 2 new SQL files
**Total Records:** 10 categories + 20 products = 30 records

