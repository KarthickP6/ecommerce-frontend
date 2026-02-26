# Cart Feature - Architecture & Data Flow

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      REACT COMPONENTS                       │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ProductCard  →  AddToCartButton  ─→  CartPage             │
│      │                  │                   │                │
│      └──────────────────┼───────────────────┘                │
│                         │                                    │
│                    useCart Hook                             │
│                         │                                    │
└─────────────────────────┼────────────────────────────────────┘
                          │
┌─────────────────────────┼────────────────────────────────────┐
│                   REDUX STORE (cartSlice)                    │
├─────────────────────────┼────────────────────────────────────┤
│                         │                                    │
│      ┌──────────────────┴────────────────────┐               │
│      │  Sync Reducers    │  Async Thunks     │              │
│      │                   │                   │              │
│      │  addToCart        │  addToCartAsync   │              │
│      │  removeFromCart   │  removeFromCartAsync  │         │
│      │  updateQuantity   │  updateCartItemAsync  │         │
│      │  clearCart        │  fetchCart        │              │
│      │  setError         │  clearCartAsync   │              │
│      │                   │  validateCartAsync │             │
│      └──────────────────┬────────────────────┘               │
│                         │                                    │
│                    Cart State:                              │
│                    - items[]                                 │
│                    - total                                   │
│                    - itemCount                               │
│                    - loading                                 │
│                    - syncLoading                             │
│                    - error                                   │
│                                                               │
└─────────────────────────┬────────────────────────────────────┘
                          │
┌─────────────────────────┼────────────────────────────────────┐
│                  AXIOS INSTANCE                              │
├─────────────────────────┼────────────────────────────────────┤
│                         │                                    │
│      Request Interceptor                                    │
│      │                                                       │
│      ├─ Get token from localStorage/sessionStorage          │
│      ├─ Add to headers: Authorization: Bearer <token>      │
│      └─ Send request                                        │
│                                                               │
└─────────────────────────┬────────────────────────────────────┘
                          │
┌─────────────────────────┼────────────────────────────────────┐
│                 BACKEND API (with JWT)                      │
├─────────────────────────┼────────────────────────────────────┤
│                         │                                    │
│  GET    /api/cart              (fetch cart)                 │
│  POST   /api/cart/items        (add item)                   │
│  PUT    /api/cart/items/:id    (update qty)                │
│  DELETE /api/cart/items/:id    (remove item)               │
│  POST   /api/cart/clear        (clear cart)                │
│  POST   /api/cart/validate     (validate)                  │
│                                                               │
│  All requests include:                                      │
│  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5...        │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 Component Hierarchy

```
App
├── BrowserRouter
│   └── AppRoutes
│       ├── Public Routes
│       │   ├── ProductListPage
│       │   │   └── ProductCard
│       │   │       └── AddToCartButton (JWT ✓)
│       │   └── ProductDetailsPage
│       │       └── AddToCartButton (JWT ✓)
│       │
│       ├── Protected Routes (RequireAuth)
│       │   ├── CartPage (JWT ✓)
│       │   │   ├── useCart Hook
│       │   │   ├── Add/Remove/Update items
│       │   │   └── Show totals
│       │   │
│       │   └── CheckoutPage (JWT ✓)
│       │       └── validateCart
│       │
│       └── Admin Routes (RequireAdmin)
│           └── [Admin pages]
│
└── Provider (Redux)
    └── Store (cartSlice)
        ├── items[]
        ├── total
        ├── itemCount
        ├── loading
        ├── syncLoading
        └── error
```

---

## 🔄 Add to Cart Data Flow

```
User clicks "Add to Cart" button
        ↓
AddToCartButton component
        ↓
handleAddToCart() called
        ↓
addItemToCartAsync(productId, quantity) dispatch
        ↓
Redux Async Thunk receives action
        ↓
Set syncLoading = true (UI shows loading)
        ↓
Call cartApi.addToCart(productId, quantity)
        ↓
Axios Request:
├─ URL: POST /api/cart/items
├─ Body: { productId, quantity }
└─ Headers: Authorization: Bearer <token> ← JWT ✓
        ↓
Backend API processes request
├─ Verify JWT token ✓
├─ Add item to cart ✓
└─ Return updated cart
        ↓
Axios Response received
        ↓
Redux fulfilled case:
├─ Set syncLoading = false (UI stops loading)
├─ Update state.items with response
├─ Recalculate total and itemCount
└─ Clear error
        ↓
Component re-renders with new cart
        ↓
Toast notification: "Added to cart!"
```

---

## 🔒 JWT Authentication Flow

```
LOGIN
  ↓
Backend generates tokens
  ├─ accessToken (short-lived, in memory)
  └─ refreshToken (long-lived, in secure storage)
  ↓
Frontend stores tokens
  ├─ localStorage.setItem('accessToken', token)
  └─ sessionStorage.setItem('refreshToken', token)
  ↓

ANY CART OPERATION
  ↓
useCart() dispatches async thunk
  ↓
Axios interceptor runs:
  ├─ Get token: localStorage.getItem('accessToken')
  ├─ Add header: Authorization: Bearer <token>
  └─ Send request
  ↓
Backend receives request
  ├─ Checks Authorization header
  ├─ Verifies JWT signature ✓
  ├─ Processes request
  └─ Returns response
  ↓
Response received
  ├─ Success: Update cart state
  └─ 401 Unauthorized:
      ├─ Clear tokens
      ├─ Redirect to login
      └─ Show error message
```

---

## 📈 State Management Flow

```
┌─────────────────────────────────────────────────────────┐
│                   CART STATE TREE                       │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  CartState {                                           │
│                                                          │
│    items: [                                            │
│      {                                                  │
│        id: "cart-1",                                   │
│        productId: "prod-123",                          │
│        quantity: 2,                                    │
│        product: {                                      │
│          id: "prod-123",                              │
│          name: "Product",                             │
│          price: 99.99,                                │
│          image: "url",                                │
│          stock: 10,                                   │
│          sku: "SKU123",                               │
│          description: "...",                          │
│          category: "electronics"                      │
│        }                                              │
│      },                                               │
│      ...                                              │
│    ]                                                  │
│                                                        │
│    total: 199.98              // sum of all subtotals│
│    itemCount: 2               // sum of quantities    │
│    loading: false             // initial fetch state  │
│    syncLoading: false         // operation state      │
│    error: null                // error message        │
│                                                        │
│  }                                                     │
│                                                        │
└─────────────────────────────────────────────────────────┘

        ↓ (state + action)

┌─────────────────────────────────────────────────────────┐
│                   REDUCER LOGIC                         │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Action received: addToCartAsync/fulfilled             │
│                                                          │
│  Process:                                              │
│  1. Set syncLoading = false                            │
│  2. Replace items with response.items                  │
│  3. Recalculate totals:                                │
│     - total = Σ(price × quantity)                      │
│     - itemCount = Σ(quantity)                          │
│  4. Clear error state                                  │
│                                                          │
└─────────────────────────────────────────────────────────┘

        ↓ (new state)

┌─────────────────────────────────────────────────────────┐
│                 COMPONENT RE-RENDER                     │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  useCart hook returns new state values                 │
│  Component re-renders with:                            │
│  - Updated items list                                  │
│  - New total                                           │
│  - New itemCount                                       │
│  - syncLoading = false (button enabled)                │
│                                                          │
│  UI displays:                                          │
│  ✓ New item in cart                                    │
│  ✓ Updated totals                                      │
│  ✓ Success toast notification                         │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## 🔀 Request/Response Examples

### Add to Cart Request

```http
POST /api/cart/items HTTP/1.1
Host: api.example.com
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "productId": "prod-123",
  "quantity": 2
}
```

### Add to Cart Response

```json
{
  "items": [
    {
      "id": "cart-1",
      "productId": "prod-123",
      "quantity": 2,
      "product": {
        "id": "prod-123",
        "name": "Laptop",
        "price": 999.99,
        "image": "https://...",
        "stock": 5,
        "sku": "PROD-001"
      }
    }
  ],
  "total": 1999.98,
  "itemCount": 2,
  "message": "Item added successfully"
}
```

### Update Quantity Request

```http
PUT /api/cart/items/cart-1 HTTP/1.1
Host: api.example.com
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "quantity": 3
}
```

### Remove Item Request

```http
DELETE /api/cart/items/cart-1 HTTP/1.1
Host: api.example.com
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## ⚙️ Error Handling Flow

```
Error occurs in async operation
        ↓
Try/catch catches error
        ↓
Redux thunk rejected case:
├─ Set syncLoading = false
├─ Set error message
└─ Leave items unchanged
        ↓
useCart hook returns error
        ↓
Component checks error state:
├─ if (error) {
│     toast.error(error)
│ }
        ↓
Display error to user
        ↓
User can retry operation
```

---

## 🔗 Hook Dependencies

```typescript
useCart() {
  dispatch ← from useDispatch()
  state ← from useSelector(state => state.cart)
  
  callbacks ← useCallback(
    [dispatch]  // Only dispatch matters
  )
  
  returns {
    state properties,
    memoized callbacks
  }
}
```

---

## 🧪 Testing Data Flow

```
SCENARIO: User adds 2 items to cart

1. Initial State:
   items: [],
   total: 0,
   itemCount: 0,
   error: null

2. User clicks "Add to Cart" (Product 1)
   Action: addToCartAsync({productId: 'prod-1', quantity: 1})
   
   Pending:
   └─ syncLoading: true
   
   Fulfilled:
   ├─ items: [{id: 'cart-1', product: {...}, quantity: 1}]
   ├─ total: 99.99
   ├─ itemCount: 1
   ├─ error: null
   └─ syncLoading: false

3. User clicks "Add to Cart" (Product 2)
   Action: addToCartAsync({productId: 'prod-2', quantity: 1})
   
   Fulfilled:
   ├─ items: [
   │   {id: 'cart-1', product: {...}, quantity: 1},
   │   {id: 'cart-2', product: {...}, quantity: 1}
   │ ]
   ├─ total: 199.98
   ├─ itemCount: 2
   └─ error: null

4. User updates quantity to 3
   Action: updateCartItemAsync({itemId: 'cart-1', quantity: 3})
   
   Fulfilled:
   ├─ items: [
   │   {id: 'cart-1', product: {...}, quantity: 3},
   │   {id: 'cart-2', product: {...}, quantity: 1}
   │ ]
   ├─ total: 399.96
   └─ itemCount: 4

5. User removes item
   Action: removeFromCartAsync('cart-1')
   
   Fulfilled:
   ├─ items: [{id: 'cart-2', product: {...}, quantity: 1}]
   ├─ total: 99.99
   └─ itemCount: 1
```

---

## 📱 Multi-Device Sync

```
Device 1 (Browser Tab 1)
├─ localStorage: accessToken ← same for both
├─ Redux store: cart state
└─ Adds item to cart → API updates backend

        ↓ API modifies backend

Device 2 (Browser Tab 2)
├─ localStorage: accessToken ← same token
├─ Redux store: cart state (out of sync)
└─ Load cart → fetchCart() → synced!

Note: Each tab has independent Redux store
To keep in sync: call loadCart() periodically
or when tab gains focus
```

---

## 🎯 Key Interactions

### Interaction 1: Add Item
```
Component → useCart → addItemToCartAsync → 
Redux Thunk → Axios Request → Backend → 
Response → Redux Update → State Change → 
Component Re-render → Toast Notification
```

### Interaction 2: Update Quantity
```
Input Change → Handler → updateItemQuantityAsync → 
Redux Thunk → Axios Request → Backend → 
Response → Redux Update → Component Re-render
```

### Interaction 3: Remove Item
```
Remove Button → Handler → removeItemAsync → 
Redux Thunk → Axios Request → Backend → 
Response → Redux Update → Component Re-render → 
Toast: "Item Removed"
```

### Interaction 4: Checkout
```
Checkout Button → validateCart() → 
Verify all items available → 
If valid: Proceed to payment → 
After success: emptyCartAsync() → 
Redirect to success page
```

---

## 📊 Performance Optimization

```
Optimization 1: Memoization
├─ useCallback for all handlers
├─ Prevents unnecessary re-renders
└─ useSelector for only needed state

Optimization 2: Async Operations
├─ syncLoading prevents double-clicks
├─ Disables buttons during operation
└─ Prevents duplicate API calls

Optimization 3: Lazy Loading
├─ CartPage lazy loaded with React.lazy()
├─ Only loads when route accessed
└─ Reduces initial bundle size

Optimization 4: Selective State
├─ useSelector gets only needed properties
├─ Not whole cart state
└─ Prevents unnecessary re-renders
```

---

This architecture ensures:
✅ Clean separation of concerns
✅ Automatic JWT handling
✅ Proper error handling
✅ Loading state management
✅ Scalable and maintainable code
✅ Production-ready implementation

