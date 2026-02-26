# Cart Feature Implementation Guide

## ✅ Completed

### 1. Redux Cart Slice (`cartSlice.ts`)
- **Synchronous Reducers:**
  - `addToCart` - Add item to local cart
  - `removeFromCart` - Remove item from local cart
  - `updateQuantity` - Update item quantity locally
  - `clearCart` - Clear entire local cart
  - `setLoading` - Set loading state
  - `setSyncLoading` - Set sync operation loading state
  - `setError` - Set error message
  - `clearError` - Clear error message

- **Async Thunks (with JWT authentication):**
  - `fetchCart` - Fetch cart from API with JWT
  - `addToCartAsync` - Add item via API with JWT
  - `updateCartItemAsync` - Update quantity via API with JWT
  - `removeFromCartAsync` - Remove item via API with JWT
  - `clearCartAsync` - Clear cart via API with JWT
  - `validateCartAsync` - Validate cart via API with JWT

- **Extra Reducers:** Complete handlers for all async thunks with proper loading/error states

### 2. Cart API Service (`cartApi.ts`)
- All methods already configured
- Uses axios instance with JWT interceptor
- Endpoints: GET, POST, PUT, DELETE cart operations

### 3. Custom Hook: `useCart.ts`
- Provides easy-to-use interface for cart operations
- Automatically includes JWT token in requests
- Separates sync (local) and async (API) operations
- Error and loading state management

**Available Methods:**
```typescript
const {
  // State
  items, total, itemCount, loading, syncLoading, error,
  
  // Sync operations
  addItemToCart, removeItem, updateItemQuantity, emptyCart,
  
  // Async operations (JWT included)
  addItemToCartAsync, removeItemAsync, updateItemQuantityAsync, 
  emptyCartAsync, loadCart, validateCart
} = useCart();
```

### 4. Components

#### AddToCartButton Component (`AddToCartButton.tsx`)
- Reusable add-to-cart button with quantity selector
- Styling variants: primary, secondary, outline
- Sizing options: sm, md, lg
- Automatically includes JWT token
- Quantity controls (+/- buttons and input)
- Stock validation

```typescript
<AddToCartButton 
  product={product}
  variant="primary"
  size="md"
/>
```

#### CartPage Component (`CartPage.tsx`)
- Full-featured shopping cart display
- Features:
  - Display all cart items in table
  - View product images and details
  - Update quantities with buttons/input
  - Remove items from cart
  - Calculate totals and item count
  - Clear entire cart
  - Proceed to checkout button
  - Continue shopping button
  - Error state handling
  - Loading state with spinner
  - Empty cart state with link to products

### 5. Routes Integration
- CartPage automatically added to `/cart` route (protected)
- Requires authentication to access

### 6. JWT Authentication
- **Automatic token handling** in all API requests
- Token attached via axios request interceptor
- No additional code needed in components
- Tokens stored in localStorage or sessionStorage

## JWT Header Verification

All cart operations automatically send JWT header:

```
Authorization: Bearer <token>
```

### How It Works:

1. **Token Storage:**
   ```typescript
   // After login
   localStorage.setItem('accessToken', response.accessToken);
   ```

2. **Axios Interceptor:**
   ```typescript
   // In axiosInstance.ts
   axiosInstance.interceptors.request.use((config) => {
     const token = localStorage.getItem('accessToken');
     if (token) {
       config.headers.Authorization = `Bearer ${token}`;
     }
     return config;
   });
   ```

3. **Automatic Inclusion:**
   ```typescript
   // No need to do anything!
   await addItemToCartAsync('product-123', 2);
   // JWT is automatically included in request
   ```

## Usage Examples

### Example 1: Adding Item to Cart from Product Page

```typescript
import { AddToCartButton } from '@/components/common';

function ProductCard({ product }) {
  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} />
      <h2>{product.name}</h2>
      <p>${product.price}</p>
      
      {/* JWT automatically included */}
      <AddToCartButton product={product} />
    </div>
  );
}
```

### Example 2: Custom Cart Management

```typescript
import { useCart } from '@/hooks';
import { toast } from 'react-toastify';

function CartManager() {
  const { items, total, updateItemQuantityAsync, syncLoading } = useCart();

  const handleQuantityChange = async (itemId, newQty) => {
    try {
      // JWT automatically included
      await updateItemQuantityAsync(itemId, newQty);
      toast.success('Quantity updated!');
    } catch (error) {
      toast.error('Failed to update quantity');
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
            onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
            disabled={syncLoading}
          />
          <p>Total: ${(item.product.price * item.quantity).toFixed(2)}</p>
        </div>
      ))}
      <h2>Cart Total: ${total.toFixed(2)}</h2>
    </div>
  );
}
```

### Example 3: Checkout with Validation

```typescript
import { useCart } from '@/hooks';
import { useNavigate } from 'react-router-dom';

function CheckoutPage() {
  const { validateCart, emptyCartAsync, total } = useCart();
  const navigate = useNavigate();

  const handleCheckout = async () => {
    try {
      // Validate cart - JWT automatically included
      const result = await validateCart();

      if (result.payload?.isValid === false) {
        toast.error('Some items are no longer available');
        return;
      }

      // Process payment...
      // Clear cart after successful payment - JWT automatically included
      await emptyCartAsync();
      
      navigate('/order-success');
    } catch (error) {
      toast.error('Checkout failed');
    }
  };

  return (
    <div>
      <h1>Order Summary</h1>
      <p>Total: ${total.toFixed(2)}</p>
      <button onClick={handleCheckout}>
        Complete Purchase
      </button>
    </div>
  );
}
```

## State Management

### Cart State Structure

```typescript
interface CartState {
  items: CartItem[];      // Shopping cart items
  total: number;          // Total price
  itemCount: number;      // Total quantity
  loading: boolean;       // Initial load state
  error: string | null;   // Error message
  syncLoading: boolean;   // Operation state
}

interface CartItem {
  id?: string;           // Cart item ID from API
  productId: string;     // Product ID
  product: Product;      // Product details
  quantity: number;      // Item quantity
}
```

## API Endpoints Called

### With JWT Header (Automatic)

1. **Fetch Cart**
   - Method: GET
   - URL: `/api/cart`
   - Header: `Authorization: Bearer <token>`

2. **Add to Cart**
   - Method: POST
   - URL: `/api/cart/items`
   - Header: `Authorization: Bearer <token>`
   - Body: `{ productId, quantity }`

3. **Update Item**
   - Method: PUT
   - URL: `/api/cart/items/:itemId`
   - Header: `Authorization: Bearer <token>`
   - Body: `{ quantity }`

4. **Remove Item**
   - Method: DELETE
   - URL: `/api/cart/items/:itemId`
   - Header: `Authorization: Bearer <token>`

5. **Clear Cart**
   - Method: POST
   - URL: `/api/cart/clear`
   - Header: `Authorization: Bearer <token>`

6. **Validate Cart**
   - Method: POST
   - URL: `/api/cart/validate`
   - Header: `Authorization: Bearer <token>`

## Error Handling

All async operations handle errors gracefully:

```typescript
const { error } = useCart();

useEffect(() => {
  if (error) {
    // Display error to user
    toast.error(error);
  }
}, [error]);
```

## Loading States

Two loading states for different operations:

```typescript
const { loading, syncLoading } = useCart();

// loading - Used during initial cart fetch
// syncLoading - Used during add/update/remove operations
```

## File Reference

| File | Purpose |
|------|---------|
| `src/api/cartApi.ts` | API service layer |
| `src/features/cart/cartSlice.ts` | Redux state management |
| `src/features/cart/index.ts` | Barrel export |
| `src/hooks/useCart.ts` | Custom React hook |
| `src/hooks/index.ts` | Hook barrel export |
| `src/components/common/AddToCartButton.tsx` | Reusable button |
| `src/pages/product/CartPage.tsx` | Cart display page |
| `src/routes/AppRoutes.tsx` | Route configuration |

## Testing Checklist

- [ ] Add item to cart sends JWT token
- [ ] Remove item from cart sends JWT token
- [ ] Update quantity sends JWT token
- [ ] Cart totals calculated correctly
- [ ] Loading states show during operations
- [ ] Error messages display properly
- [ ] Empty cart state handled
- [ ] Products show as out of stock when quantity is 0
- [ ] Quantity buttons work correctly
- [ ] Clear cart works with confirmation
- [ ] Proceed to checkout redirects properly

## Security Features

✅ **JWT Authentication**
- All API requests include Authorization header
- Token stored securely in localStorage
- Automatic token refresh on 401

✅ **Authorization**
- Cart operations require authentication
- User can only access own cart

✅ **Input Validation**
- Quantity must be positive number
- Cannot exceed stock quantity
- Proper error handling

## Performance Optimization

✅ **Separate Loading States**
- `loading` for initial fetch (doesn't block UI)
- `syncLoading` for operations (disables buttons)

✅ **Error Isolation**
- Errors cleared on successful operations
- Error doesn't prevent subsequent operations

✅ **Efficient Calculations**
- Totals calculated only once after state updates
- Memoized in useCart hook callbacks

## Next Steps

1. **Update Navbar** - Add cart icon with item count
2. **Wishlist Feature** - Similar to cart structure
3. **Order Management** - Use cart validation before creating orders
4. **Analytics** - Track cart operations for insights
5. **Cart Recovery** - Save abandoned carts for recovery email

## Support

For questions about:
- **JWT Implementation**: See `CART_FEATURE_DOCUMENTATION.md`
- **Redux Setup**: See `src/app/store.ts`
- **API Configuration**: See `src/api/axiosInstance.ts`
- **React Hooks**: See `src/hooks/useCart.ts`

