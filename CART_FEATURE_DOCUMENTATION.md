# Cart Feature Implementation

## Overview

The cart feature provides a complete shopping cart system with Redux state management and JWT authentication. All API requests automatically include JWT tokens through axios interceptors.

## Architecture

### Files Structure

```
src/
├── api/
│   └── cartApi.ts                 # Cart API service
├── features/
│   └── cart/
│       ├── cartSlice.ts           # Redux slice with async thunks
│       └── index.ts               # Barrel export
├── hooks/
│   ├── useCart.ts                 # Custom hook for cart operations
│   └── index.ts                   # Hook barrel export
├── components/
│   └── common/
│       └── AddToCartButton.tsx     # Reusable add to cart button
└── pages/
    └── product/
        └── CartPage.tsx            # Cart display page
```

## Redux State Structure

```typescript
interface CartState {
  items: CartItem[];           // Array of cart items
  total: number;               // Total cart price
  itemCount: number;           // Total quantity of items
  loading: boolean;            // Loading state for fetch
  error: string | null;        // Error message
  syncLoading: boolean;        // Loading state for sync operations
}

interface CartItem {
  id?: string;                 // Cart item ID from API
  productId: string;           // Product ID
  product: Product;            // Product details
  quantity: number;            // Item quantity
}
```

## API Integration

### Cart API Endpoints

All endpoints automatically include JWT token through axios interceptor:

- `GET /cart` - Fetch user's cart
- `POST /cart/items` - Add item to cart
- `PUT /cart/items/:itemId` - Update item quantity
- `DELETE /cart/items/:itemId` - Remove item from cart
- `POST /cart/clear` - Clear entire cart
- `POST /cart/validate` - Validate cart items

## Redux Async Thunks

### 1. fetchCart
Retrieves the user's cart from the API with JWT token.

```typescript
const result = await dispatch(fetchCart());
```

### 2. addToCartAsync
Adds an item to cart via API. JWT token sent automatically.

```typescript
const result = await dispatch(addToCartAsync({
  productId: '123',
  quantity: 2
}));
```

### 3. updateCartItemAsync
Updates quantity of a cart item via API. JWT token sent automatically.

```typescript
const result = await dispatch(updateCartItemAsync({
  itemId: 'cart-item-456',
  quantity: 5
}));
```

### 4. removeFromCartAsync
Removes an item from cart via API. JWT token sent automatically.

```typescript
const result = await dispatch(removeFromCartAsync('cart-item-456'));
```

### 5. clearCartAsync
Clears the entire cart via API. JWT token sent automatically.

```typescript
const result = await dispatch(clearCartAsync());
```

### 6. validateCartAsync
Validates cart items before checkout. JWT token sent automatically.

```typescript
const result = await dispatch(validateCartAsync());
```

## Custom Hook: useCart

The `useCart` hook provides both synchronous and asynchronous cart operations.

### Usage

```typescript
import { useCart } from '@/hooks';

function MyComponent() {
  const {
    // State
    items,
    total,
    itemCount,
    loading,
    syncLoading,
    error,

    // Sync operations (local)
    addItemToCart,
    removeItem,
    updateItemQuantity,
    emptyCart,

    // Async operations (API + JWT)
    addItemToCartAsync,
    removeItemAsync,
    updateItemQuantityAsync,
    emptyCartAsync,
    loadCart,
    validateCart,
  } = useCart();
}
```

### Async Operations (with JWT)

```typescript
// Add item to cart (JWT sent automatically)
await addItemToCartAsync('product-123', 2);

// Update quantity (JWT sent automatically)
await updateItemQuantityAsync('cart-item-456', 5);

// Remove item (JWT sent automatically)
await removeItemAsync('cart-item-456');

// Load cart (JWT sent automatically)
await loadCart();

// Validate cart (JWT sent automatically)
await validateCart();

// Clear cart (JWT sent automatically)
await emptyCartAsync();
```

### Sync Operations (local state only)

```typescript
// Add to local cart without API call
addItemToCart(productObject, 2);

// Update local quantity without API call
updateItemQuantity('product-123', 5);

// Remove from local cart without API call
removeItem('product-123');

// Clear local cart without API call
emptyCart();
```

## Components

### AddToCartButton

Reusable button component for adding products to cart with quantity selector.

```typescript
import { AddToCartButton } from '@/components/common';

function ProductCard({ product }) {
  return (
    <div>
      <h3>{product.name}</h3>
      <AddToCartButton 
        product={product}
        variant="primary"
        size="md"
      />
    </div>
  );
}
```

**Props:**
- `product: Product` - Product object to add
- `className?: string` - Additional CSS classes
- `variant?: 'primary' | 'secondary' | 'outline'` - Button style
- `size?: 'sm' | 'md' | 'lg'` - Button size

### CartPage

Full-featured shopping cart display page with operations.

```typescript
import CartPage from '@/pages/product/CartPage';

// Use in routes
<Route path="/cart" element={<CartPage />} />
```

**Features:**
- Display cart items in table format
- Update quantities with buttons or input
- Remove items
- Calculate totals
- Clear cart
- Proceed to checkout

## JWT Authentication

### Automatic JWT Handling

All cart API calls automatically include JWT token through axios interceptor:

```typescript
// In axiosInstance.ts
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken') || 
                sessionStorage.getItem('accessToken');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});
```

**No additional configuration needed!** The `useCart` hook handles all JWT inclusion automatically.

### Example: Adding Item with JWT

```typescript
// This automatically sends: Authorization: Bearer <token>
await addItemToCartAsync('product-123', 2);

// The axios interceptor attaches the token
// Request headers will include:
// Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Usage Examples

### Example 1: Add Item from Product List

```typescript
import { AddToCartButton } from '@/components/common';

function ProductListItem({ product }) {
  return (
    <div className="product-card">
      <img src={product.image} />
      <h3>{product.name}</h3>
      <p>${product.price}</p>
      <AddToCartButton product={product} />
    </div>
  );
}
```

### Example 2: Update Cart Page

```typescript
import { useCart } from '@/hooks';
import { toast } from 'react-toastify';

function CartPage() {
  const { items, total, updateItemQuantityAsync } = useCart();

  const handleQuantityChange = async (itemId, newQty) => {
    try {
      // JWT automatically included
      await updateItemQuantityAsync(itemId, newQty);
      toast.success('Updated!');
    } catch (error) {
      toast.error('Failed to update');
    }
  };

  return (
    <div>
      {items.map(item => (
        <div key={item.id}>
          <h3>{item.product.name}</h3>
          <input 
            type="number"
            value={item.quantity}
            onChange={(e) => handleQuantityChange(item.id, e.target.value)}
          />
          <p>${item.product.price * item.quantity}</p>
        </div>
      ))}
      <h2>Total: ${total}</h2>
    </div>
  );
}
```

### Example 3: Checkout with Cart Validation

```typescript
import { useCart } from '@/hooks';
import { useNavigate } from 'react-router-dom';

function CheckoutPage() {
  const { validateCart, emptyCartAsync } = useCart();
  const navigate = useNavigate();

  const handleCheckout = async () => {
    try {
      // Validate cart (JWT automatically included)
      const validation = await validateCart();
      
      if (validation.payload?.isValid) {
        // Process payment...
        
        // Clear cart after successful payment
        await emptyCartAsync();
        navigate('/order-success');
      }
    } catch (error) {
      toast.error('Checkout failed');
    }
  };

  return (
    <button onClick={handleCheckout}>
      Complete Purchase
    </button>
  );
}
```

## Error Handling

All async operations include error handling:

```typescript
const { error, syncLoading, addItemToCartAsync } = useCart();

useEffect(() => {
  if (error) {
    toast.error(error);
  }
}, [error]);

const handleAdd = async () => {
  try {
    await addItemToCartAsync('product-123', 1);
    toast.success('Added to cart');
  } catch (err) {
    toast.error('Failed to add');
  }
};
```

## Loading States

- `loading` - Used during `fetchCart` (initial load)
- `syncLoading` - Used during add/update/remove operations

```typescript
const { loading, syncLoading } = useCart();

{loading && <div>Loading cart...</div>}
{syncLoading && <div>Updating...</div>}
```

## Best Practices

1. **Use Async Operations for API**: Always use `*Async` methods for server persistence
2. **Show Loading States**: Use `syncLoading` to disable buttons during operations
3. **Error Handling**: Display error messages to users
4. **Toast Notifications**: Use react-toastify for user feedback
5. **JWT Automatic**: Don't worry about token - it's sent automatically
6. **Validation**: Use `validateCartAsync` before checkout
7. **Sync for Optimistic Updates**: Use sync methods for instant UI feedback

## Testing

```typescript
// Test adding item with JWT
it('should add item with JWT token', async () => {
  const { result } = renderHook(() => useCart());
  
  await act(async () => {
    await result.current.addItemToCartAsync('product-123', 2);
  });
  
  expect(result.current.itemCount).toBe(2);
  expect(axiosInstance.get).toHaveBeenCalledWith(
    expect.any(String),
    expect.objectContaining({
      headers: expect.objectContaining({
        Authorization: expect.stringContaining('Bearer ')
      })
    })
  );
});
```

## Troubleshooting

### JWT Token Not Sent
- Verify token is in localStorage or sessionStorage
- Check axios interceptor is configured
- Use browser DevTools Network tab to verify headers

### Cart Not Loading
- Check API endpoint is correct
- Verify backend is running
- Check for CORS issues
- Verify JWT token is valid

### Items Not Syncing
- Use `fetchCart` to reload from server
- Check for API errors in console
- Verify item IDs match between client and server

## Future Enhancements

- [ ] Cart persistence to localStorage
- [ ] Cart recovery on page refresh
- [ ] Wishlist integration
- [ ] Cart sharing/collaborative features
- [ ] Abandoned cart recovery
- [ ] Cart analytics and tracking
- [ ] Coupon/discount code integration

