# 🚀 Quick Start - Product Management Testing Guide

## Prerequisites
- Backend running on `http://localhost:8080`
- Frontend running on `http://localhost:5173`
- Admin user account created
- Categories exist in the database

---

## Testing Steps

### Step 1: Start Backend
```bash
cd ecommerce-backend/furniture
mvn spring-boot:run
```

### Step 2: Start Frontend
```bash
cd ecommerce-frontend
npm run dev
```

### Step 3: Admin Login
1. Navigate to `http://localhost:5173/login`
2. Login with admin credentials
3. You should be redirected to `/admin` (Admin Dashboard)

### Step 4: Navigate to Products
1. Click on **Products** in the sidebar
2. You should see the product list page (ManageProductsPage)
3. **Expected:** Product list loads without "Failed to fetch products" error ✅

### Step 5: Add New Product
1. Click **+ Add Product** button
2. **Expected:** Navigate to `/admin/products/add`
3. **Expected:** Categories dropdown loads with available categories
4. Fill in the form:
   - Product Name: "Modern Sofa"
   - Description: "Comfortable and stylish sofa"
   - Price: "599.99"
   - Stock: "10"
   - Category: Select from dropdown
5. Click **Create Product**
6. **Expected:** 
   - Success toast notification
   - Redirect to product list
   - New product appears in list ✅

### Step 6: Edit Product
1. Click **Edit** button on any product
2. **Expected:** Navigate to `/admin/products/:id/edit`
3. **Expected:** Form populates with product data
4. Modify a field (e.g., change price to "699.99")
5. Click **Update Product**
6. **Expected:**
   - Success toast notification
   - Redirect to product list
   - Product list shows updated data ✅

### Step 7: Delete Product
1. Click **Delete** button on any product
2. **Expected:** Product is removed from list ✅

---

## Expected Behavior

### ✅ Successful Responses:
- **Add Product:** `{ "success": true, "data": { product object }, "message": "Product created successfully" }`
- **Update Product:** `{ "success": true, "data": { product object }, "message": "Product updated successfully" }`
- **Delete Product:** `{ "success": true, "message": "Product deleted successfully" }`
- **Get Categories:** `{ "success": true, "data": [ { id, name, description, imageUrl }, ... ] }`
- **Get Products:** `{ "success": true, "data": { "content": [ ... ], "totalElements": 5, ... } }`

### ✅ Loading States:
- Category dropdown shows loading spinner while fetching
- Submit button shows "Saving..." while processing
- Product list shows spinner while loading

### ✅ Error Handling:
- Invalid form inputs show validation messages
- API errors show toast notifications
- Network errors are handled gracefully

---

## Browser Console Checks

Open DevTools (F12) → Console tab and verify:

1. **No errors** when navigating to product pages
2. **Network requests** show:
   - `GET /api/admin/products` - Product list
   - `GET /api/categories` - Categories dropdown
   - `POST /api/admin/products` - Create product
   - `PUT /api/admin/products/:id` - Update product
   - `DELETE /api/admin/products/:id` - Delete product

3. **Redux DevTools** (if installed) shows:
   - `fetchProducts/pending` → `fetchProducts/fulfilled`
   - `createProductThunk/pending` → `createProductThunk/fulfilled`
   - `updateProductThunk/pending` → `updateProductThunk/fulfilled`
   - `deleteProductThunk/pending` → `deleteProductThunk/fulfilled`

---

## Database Verification

Check your PostgreSQL/MySQL database:

```sql
-- Verify categories exist
SELECT * FROM categories;

-- Verify products created
SELECT p.*, c.name as category_name 
FROM products p 
JOIN categories c ON p.category_id = c.id;

-- Verify relationships
SELECT COUNT(*) as product_count FROM products;
```

---

## Common Issues & Solutions

### Issue 1: "Failed to fetch products"
**Cause:** adminApi methods not found
**Solution:** Verify `adminApi.ts` has `getAllProducts()` method ✅

### Issue 2: Categories dropdown is empty
**Cause:** Categories endpoint not implemented
**Solution:** Verify `GET /api/categories` endpoint exists ✅

### Issue 3: Product not saving to database
**Cause:** Missing database tables or incorrect schema
**Solution:** Run database migrations ✅

### Issue 4: Admin access denied
**Cause:** User role not set to ADMIN
**Solution:** Verify user has ADMIN role in database

### Issue 5: Form validation errors
**Cause:** Invalid input data
**Solution:** Check field requirements in form validation

---

## Success Indicators

✅ All steps complete without errors
✅ Products appear in the database
✅ Add/Edit/Delete operations work smoothly
✅ UI is responsive on all screen sizes
✅ Toast notifications appear correctly
✅ No console errors

---

## Next Steps

Once testing is complete:
1. Run integration tests
2. Test with different user roles
3. Test error scenarios (invalid data, network errors)
4. Performance testing with large datasets
5. Security testing (unauthorized access attempts)

---

## Support

For issues or questions:
1. Check browser console for errors
2. Check backend logs
3. Verify database connectivity
4. Verify all services are running
5. Check API endpoints with Postman/Insomnia

---

**Last Updated:** February 27, 2026
**Status:** ✅ Ready for Testing

