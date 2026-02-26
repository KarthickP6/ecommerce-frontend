# Cart Feature - Quick Start Guide

## 🚀 5-Minute Quick Start

### 1. Add Item to Cart (Simplest Way)

```typescript
import { AddToCartButton } from '@/components/common';

function ProductCard({ product }) {
  return (
    <div>
      <h2>{product.name}</h2>
      <p>${product.price}</p>
      {/* That's it! JWT is automatic */}
      <AddToCartButton product={product} />
    </div>
  );
}
```

### 2. Display Shopping Cart

```typescript
import { useCart } from '@/hooks';

function CartPage() {
  const { items, total, removeItemAsync, updateItemQuantityAsync } = useCart();

  return (
    <div>
      {items.map(item => (
        <div key={item.id}>
          <h3>{item.product.name}</h3>
          <input
            type="number"
            value={item.quantity}
            onChange={(e) => updateItemQuantityAsync(item.id, parseInt(e.target.value))}
          />
          <button onClick={() => removeItemAsync(item.id)}>Remove</button>
        </div>
      ))}
      <h2>Total: ${total}</h2>
    </div>
  );
}
```

### 3. Custom Add to Cart Logic

```typescript
import { useCart } from '@/hooks';
import { toast } from 'react-toastify';

function ProductDetails({ product }) {
  const { addItemToCartAsync, syncLoading } = useCart();

  const handleAddToCart = async () => {
    try {
      // JWT automatically included!
      await addItemToCartAsync(product.id, 2);
      toast.success('Added to cart!');
    } catch (error) {
      toast.error('Failed to add');
    }
  };

  return (
    <button onClick={handleAddToCart} disabled={syncLoading}>
      {syncLoading ? 'Adding...' : 'Add to Cart'}
    </button>
  );
}
```

---

## 📚 Complete API Reference

### useCart Hook - All Methods

```typescript
const {
  // STATE
  items,              // CartItem[] - all items in cart
  total,              // number - total price
  itemCount,          // number - total items count
  loading,            // boolean - initial fetch loading
  syncLoading,        // boolean - operation loading
  error,              // string | null - error message

  // SYNC METHODS (local state only, instant)
  addItemToCart,      // (product, quantity) => void
  removeItem,         // (productId) => void
  updateItemQuantity, // (productId, quantity) => void
  emptyCart,          // () => void

  // ASYNC METHODS (API + JWT, persistent)
  addItemToCartAsync,        // (productId, quantity) => Promise
  removeItemAsync,           // (itemId) => Promise
  updateItemQuantityAsync,   // (itemId, quantity) => Promise
  emptyCartAsync,            // () => Promise
  loadCart,                  // () => Promise
  validateCart,              // () => Promise
} = useCart();
```

---

## 🔐 JWT - Automatic Authentication

**You don't need to do anything!** All cart operations automatically send JWT token:

```typescript
// This automatically sends: Authorization: Bearer <token>
await addItemToCartAsync('product-123', 1);

// Same with all other operations
await updateItemQuantityAsync('item-456', 5);
await removeItemAsync('item-456');
await loadCart();
```

---

## 🧩 Components Ready to Use

### AddToCartButton

```typescript
<AddToCartButton 
  product={product}
  variant="primary"    // 'primary' | 'secondary' | 'outline'
  size="md"            // 'sm' | 'md' | 'lg'
  className="custom"   // optional CSS classes
/>
```

### CartPage

```typescript
import CartPage from '@/pages/product/CartPage';

// Already in routes at /cart
// <Route path="/cart" element={<CartPage />} />
```

---

## 📊 Redux State Structure

```typescript
// Full state shape
{
  cart: {
    items: [
      {
        id: 'cart-1',
        productId: 'prod-123',
        product: {
          id: 'prod-123',
          name: 'Product Name',
          price: 99.99,
          image: 'url',
          stock: 10,
          // ... more product fields
        },
        quantity: 2
      }
    ],
    total: 199.98,        // sum of (price * quantity)
    itemCount: 2,         // sum of quantities
    loading: false,       // initial fetch
    syncLoading: false,   // operations in progress
    error: null           // error message
  }
}
```

---

## 🔄 Common Operations

### Add Item to Cart

**Simple with AddToCartButton:**
```typescript
<AddToCartButton product={product} />
```

**Custom code:**
```typescript
const { addItemToCartAsync } = useCart();
await addItemToCartAsync(productId, quantity);
```

### Remove Item from Cart

```typescript
const { removeItemAsync } = useCart();
await removeItemAsync(cartItemId);
```

### Update Quantity

```typescript
const { updateItemQuantityAsync } = useCart();
await updateItemQuantityAsync(cartItemId, newQuantity);
```

### Load Cart

```typescript
const { loadCart } = useCart();

useEffect(() => {
  loadCart();
}, [loadCart]);
```

### Validate Before Checkout

```typescript
const { validateCart } = useCart();

const handleCheckout = async () => {
  const result = await validateCart();
  if (result.payload?.isValid) {
    // proceed
  }
};
```

### Clear Cart

```typescript
const { emptyCartAsync } = useCart();
await emptyCartAsync();
```

---

## 🎯 Real-World Examples

### Example 1: Product List with Add to Cart

```typescript
import { AddToCartButton } from '@/components/common';
import { useCart } from '@/hooks';

function ProductList({ products }) {
  const { itemCount } = useCart();

  return (
    <div>
      <h1>Products</h1>
      <p>Cart Items: {itemCount}</p>
      
      {products.map(product => (
        <div key={product.id} className="product-card">
          <img src={product.image} />
          <h3>{product.name}</h3>
          <p>${product.price}</p>
          <AddToCartButton product={product} variant="primary" />
        </div>
      ))}
    </div>
  );
}
```

### Example 2: Shopping Cart with Operations

```typescript
import { useCart } from '@/hooks';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

export default function ShoppingCart() {
  const {
    items,
    total,
    itemCount,
    loading,
    syncLoading,
    error,
    loadCart,
    removeItemAsync,
    updateItemQuantityAsync,
    emptyCartAsync,
  } = useCart();

  // Load cart on mount
  useEffect(() => {
    loadCart();
  }, [loadCart]);

  // Show errors
  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  if (loading) return <div>Loading cart...</div>;
  if (items.length === 0) {
    return (
      <div>
        <h1>Your cart is empty</h1>
        <a href="/products">Continue shopping</a>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1>Shopping Cart ({itemCount} items)</h1>

      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Subtotal</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id}>
              <td>{item.product.name}</td>
              <td>${item.product.price}</td>
              <td>
                <button
                  onClick={() =>
                    updateItemQuantityAsync(item.id, item.quantity - 1)
                  }
                  disabled={syncLoading}
                >
                  −
                </button>
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) =>
                    updateItemQuantityAsync(item.id, parseInt(e.target.value))
                  }
                  disabled={syncLoading}
                />
                <button
                  onClick={() =>
                    updateItemQuantityAsync(item.id, item.quantity + 1)
                  }
                  disabled={syncLoading}
                >
                  +
                </button>
              </td>
              <td>${(item.product.price * item.quantity).toFixed(2)}</td>
              <td>
                <button
                  onClick={() => removeItemAsync(item.id)}
                  disabled={syncLoading}
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        <h2>Total: ${total.toFixed(2)}</h2>
        <button
          onClick={() => (window.location.href = '/checkout')}
          disabled={syncLoading}
        >
          Proceed to Checkout
        </button>
        <button
          onClick={() => emptyCartAsync()}
          disabled={syncLoading}
        >
          Clear Cart
        </button>
      </div>
    </div>
  );
}
```

### Example 3: Product Details with Custom Add to Cart

```typescript
import { useCart } from '@/hooks';
import { useState } from 'react';
import { toast } from 'react-toastify';

function ProductDetails({ product }) {
  const [qty, setQty] = useState(1);
  const { addItemToCartAsync, syncLoading } = useCart();

  const handleAddToCart = async () => {
    try {
      // JWT automatically included!
      await addItemToCartAsync(product.id, qty);
      toast.success(`${product.name} added to cart!`);
      setQty(1);
    } catch (error) {
      toast.error('Failed to add to cart');
    }
  };

  return (
    <div className="product-details">
      <h1>{product.name}</h1>
      <p>Price: ${product.price}</p>
      <p>Stock: {product.stock}</p>

      <div className="quantity-selector">
        <button onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
        <input
          type="number"
          value={qty}
          onChange={(e) => setQty(parseInt(e.target.value) || 1)}
          min="1"
          max={product.stock}
        />
        <button onClick={() => setQty(Math.min(product.stock, qty + 1))}>
          +
        </button>
      </div>

      <button
        onClick={handleAddToCart}
        disabled={syncLoading || product.stock === 0}
        className="btn-primary"
      >
        {syncLoading ? 'Adding...' : 'Add to Cart'}
      </button>
    </div>
  );
}
```

---

## ⚡ Performance Tips

1. **Use useCart at component level** - Don't hoist it too high
2. **Memoize callbacks** - Use useCallback for handlers
3. **Use syncLoading not loading** - For add/remove/update operations
4. **Lazy load cart page** - Use React.lazy()

```typescript
import { lazy, Suspense } from 'react';

const CartPage = lazy(() => import('@/pages/product/CartPage'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CartPage />
    </Suspense>
  );
}
```

---

## 🐛 Debugging

### Check Redux State in DevTools

```typescript
// Install Redux DevTools browser extension
// Click on Redux tab in DevTools
// Look for cart slice
// Check items, total, loading, error states
```

### Check Network Requests

```typescript
// Open Network tab in DevTools
// Look for cart API requests
// Check headers tab for Authorization: Bearer <token>
// Verify token is present
```

### Check Console Errors

```typescript
// Open Console tab
// Look for error messages
// Check if token is stored: localStorage.getItem('accessToken')
```

---

## ✅ Verification Checklist

- [ ] Can add item to cart ✓
- [ ] JWT token sent in request ✓
- [ ] Item quantity updates ✓
- [ ] Item can be removed ✓
- [ ] Cart totals calculated ✓
- [ ] Empty cart state displays ✓
- [ ] Error messages show ✓
- [ ] Loading spinners display ✓

---

## 📖 File Quick Reference

| File | What | Import |
|------|------|--------|
| `useCart.ts` | Hook for all cart ops | `import { useCart } from '@/hooks'` |
| `AddToCartButton.tsx` | Button component | `import { AddToCartButton } from '@/components/common'` |
| `CartPage.tsx` | Cart display page | `import CartPage from '@/pages/product/CartPage'` |
| `cartSlice.ts` | Redux logic | Auto (via store) |
| `cartApi.ts` | API calls | Auto (via hook) |

---

## 🆘 Common Issues & Solutions

### Issue: JWT token not sent
**Solution:** Check token in localStorage
```typescript
console.log(localStorage.getItem('accessToken'));
```

### Issue: Cart not loading
**Solution:** Call loadCart() in useEffect
```typescript
useEffect(() => {
  loadCart();
}, [loadCart]);
```

### Issue: Quantity not updating
**Solution:** Use updateItemQuantityAsync not updateQuantity
```typescript
// ✗ Wrong
dispatch(updateQuantity(...));

// ✓ Correct
updateItemQuantityAsync(...);
```

### Issue: Button always loading
**Solution:** Use syncLoading not loading
```typescript
// ✗ Wrong
disabled={loading}

// ✓ Correct
disabled={syncLoading}
```

---

## 🎓 Learning Path

1. **Start simple:** Use `<AddToCartButton />`
2. **Build shopping cart:** Use `useCart` hook
3. **Checkout flow:** Use `validateCart`
4. **Advanced:** Create custom components using hook

---

## 📞 Need Help?

Refer to:
- `CART_FEATURE_DOCUMENTATION.md` - Complete reference
- `CART_IMPLEMENTATION_GUIDE.md` - Detailed guide
- Code comments in components - JSDoc documentation

---

**You're all set! 🎉**

Start using the cart feature now:
```typescript
import { useCart } from '@/hooks';
import { AddToCartButton } from '@/components/common';

// Everything includes JWT automatically!
```

