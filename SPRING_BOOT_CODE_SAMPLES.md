// ============================================
// 1. SECURITY - JwtTokenProvider.java
// ============================================

package com.furniture.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtTokenProvider {

    @Value("${app.jwt.secret}")
    private String jwtSecret;

    @Value("${app.jwt.expiration}")
    private long jwtExpirationMs;

    @Value("${app.jwt.refresh-expiration}")
    private long refreshTokenExpirationMs;

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes());
    }

    public String generateAccessToken(Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        return generateTokenFromUsername(userPrincipal.getUsername(), jwtExpirationMs);
    }

    public String generateAccessToken(String username) {
        return generateTokenFromUsername(username, jwtExpirationMs);
    }

    public String generateRefreshToken(String username) {
        return generateTokenFromUsername(username, refreshTokenExpirationMs);
    }

    private String generateTokenFromUsername(String username, long expirationTime) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expirationTime);

        return Jwts.builder()
                .subject(username)
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(getSigningKey(), SignatureAlgorithm.HS512)
                .compact();
    }

    public String getUsernameFromToken(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
        return claims.getSubject();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (SecurityException e) {
            System.err.println("Invalid JWT signature");
        } catch (MalformedJwtException e) {
            System.err.println("Invalid JWT token");
        } catch (ExpiredJwtException e) {
            System.err.println("Expired JWT token");
        } catch (UnsupportedJwtException e) {
            System.err.println("Unsupported JWT token");
        } catch (IllegalArgumentException e) {
            System.err.println("JWT claims string is empty");
        }
        return false;
    }
}


// ============================================
// 2. SECURITY - JwtAuthenticationFilter.java
// ============================================

package com.furniture.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@AllArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private JwtTokenProvider jwtTokenProvider;
    private CustomUserDetailsService customUserDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, 
                                   HttpServletResponse response, 
                                   FilterChain filterChain)
            throws ServletException, IOException {
        try {
            String jwt = getJwtFromRequest(request);

            if (StringUtils.hasText(jwt) && jwtTokenProvider.validateToken(jwt)) {
                String username = jwtTokenProvider.getUsernameFromToken(jwt);
                UserDetails userDetails = customUserDetailsService.loadUserByUsername(username);

                UsernamePasswordAuthenticationToken authentication = 
                    new UsernamePasswordAuthenticationToken(
                        userDetails, 
                        null, 
                        userDetails.getAuthorities()
                    );
                
                authentication.setDetails(
                    new WebAuthenticationDetailsSource().buildDetails(request)
                );

                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        } catch (Exception ex) {
            System.err.println("Could not set user authentication in security context: " + ex);
        }

        filterChain.doFilter(request, response);
    }

    private String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}


// ============================================
// 3. DTO - LoginRequest.java
// ============================================

package com.furniture.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {
    
    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    private String email;
    
    @NotBlank(message = "Password is required")
    private String password;
}


// ============================================
// 4. DTO - RegisterRequest.java
// ============================================

package com.furniture.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequest {
    
    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    private String name;
    
    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    private String email;
    
    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;
    
    @NotBlank(message = "Confirm password is required")
    private String confirmPassword;
}


// ============================================
// 5. DTO - AuthResponse.java
// ============================================

package com.furniture.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {
    private String accessToken;
    private String refreshToken;
    private String tokenType = "Bearer";
    private UserResponse user;
}


// ============================================
// 6. ENTITY - User.java
// ============================================

package com.furniture.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.*;

@Entity
@Table(name = "users", uniqueConstraints = {
    @UniqueConstraint(columnNames = "email")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false, unique = true)
    private String email;
    
    @Column(nullable = false)
    private String password;
    
    @Column
    private String phone;
    
    @Column
    private String profileImageUrl;
    
    @Column(nullable = false)
    private boolean enabled = true;
    
    @Column(nullable = false)
    private boolean locked = false;
    
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "user_roles",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private Set<Role> roles = new HashSet<>();
    
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Address> addresses = new HashSet<>();
    
    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private Cart cart;
    
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Order> orders = new ArrayList<>();
    
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Review> reviews = new ArrayList<>();
    
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Wishlist> wishlist = new HashSet<>();
    
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;
}


// ============================================
// 7. ENTITY - Product.java
// ============================================

package com.furniture.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

@Entity
@Table(name = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Product {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    @Column(nullable = false, unique = true)
    private String name;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(nullable = false)
    private BigDecimal price;
    
    @Column(nullable = false)
    private Integer stock;
    
    @Column
    private Double rating = 0.0;
    
    @Column
    private Integer reviewCount = 0;
    
    @Column
    private String sku;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;
    
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProductImage> images = new ArrayList<>();
    
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Review> reviews = new ArrayList<>();
    
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Wishlist> wishlists = new HashSet<>();
    
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;
}


// ============================================
// 8. REPOSITORY - ProductRepository.java
// ============================================

package com.furniture.repository;

import com.furniture.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, String>, JpaSpecificationExecutor<Product> {
    
    Optional<Product> findByNameIgnoreCase(String name);
    
    Optional<Product> findBySku(String sku);
    
    Page<Product> findByCategoryId(String categoryId, Pageable pageable);
    
    @Query("SELECT p FROM Product p WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(p.description) LIKE LOWER(CONCAT('%', :search, '%'))")
    Page<Product> searchByNameOrDescription(@Param("search") String search, Pageable pageable);
    
    @Query("SELECT p FROM Product p WHERE p.stock > 0 ORDER BY p.rating DESC")
    Page<Product> findTopRatedProducts(Pageable pageable);
}


// ============================================
// 9. SERVICE INTERFACE - ProductService.java
// ============================================

package com.furniture.service;

import com.furniture.dto.request.CreateProductRequest;
import com.furniture.dto.response.ProductResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ProductService {
    
    Page<ProductResponse> getAllProducts(Pageable pageable);
    
    Page<ProductResponse> searchProducts(String query, Pageable pageable);
    
    Page<ProductResponse> filterProducts(
        Double minPrice, 
        Double maxPrice, 
        String categoryId, 
        String sort,
        Pageable pageable
    );
    
    ProductResponse getProductById(String id);
    
    Page<ProductResponse> getProductsByCategory(String categoryId, Pageable pageable);
    
    ProductResponse createProduct(CreateProductRequest request);
    
    ProductResponse updateProduct(String id, CreateProductRequest request);
    
    void deleteProduct(String id);
    
    Double rateProduct(String id, Integer rating);
    
    void addReview(String id, String title, String comment, Integer rating);
}


// ============================================
// 10. SERVICE IMPLEMENTATION - ProductServiceImpl.java
// ============================================

package com.furniture.service.impl;

import com.furniture.dto.request.CreateProductRequest;
import com.furniture.dto.response.ProductResponse;
import com.furniture.entity.Category;
import com.furniture.entity.Product;
import com.furniture.exception.ResourceNotFoundException;
import com.furniture.mapper.ProductMapper;
import com.furniture.repository.CategoryRepository;
import com.furniture.repository.ProductRepository;
import com.furniture.service.ProductService;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@AllArgsConstructor
public class ProductServiceImpl implements ProductService {
    
    private ProductRepository productRepository;
    private CategoryRepository categoryRepository;
    private ProductMapper productMapper;
    
    @Override
    @Transactional(readOnly = true)
    public Page<ProductResponse> getAllProducts(Pageable pageable) {
        return productRepository.findAll(pageable)
            .map(productMapper::toResponse);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Page<ProductResponse> searchProducts(String query, Pageable pageable) {
        return productRepository.searchByNameOrDescription(query, pageable)
            .map(productMapper::toResponse);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Page<ProductResponse> filterProducts(
        Double minPrice, 
        Double maxPrice, 
        String categoryId, 
        String sort,
        Pageable pageable) {
        
        Specification<Product> spec = Specification.where(null);
        
        if (minPrice != null && maxPrice != null) {
            spec = spec.and((root, query, cb) -> 
                cb.between(root.get("price"), minPrice, maxPrice)
            );
        }
        
        if (categoryId != null && !categoryId.isEmpty()) {
            spec = spec.and((root, query, cb) -> 
                cb.equal(root.get("category").get("id"), categoryId)
            );
        }
        
        return productRepository.findAll(spec, pageable)
            .map(productMapper::toResponse);
    }
    
    @Override
    @Transactional(readOnly = true)
    public ProductResponse getProductById(String id) {
        Product product = productRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        return productMapper.toResponse(product);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Page<ProductResponse> getProductsByCategory(String categoryId, Pageable pageable) {
        return productRepository.findByCategoryId(categoryId, pageable)
            .map(productMapper::toResponse);
    }
    
    @Override
    @Transactional
    public ProductResponse createProduct(CreateProductRequest request) {
        Category category = categoryRepository.findById(request.getCategoryId())
            .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        
        Product product = productMapper.toEntity(request);
        product.setCategory(category);
        
        Product savedProduct = productRepository.save(product);
        return productMapper.toResponse(savedProduct);
    }
    
    @Override
    @Transactional
    public ProductResponse updateProduct(String id, CreateProductRequest request) {
        Product product = productRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        
        productMapper.updateEntity(request, product);
        Product updatedProduct = productRepository.save(product);
        return productMapper.toResponse(updatedProduct);
    }
    
    @Override
    @Transactional
    public void deleteProduct(String id) {
        if (!productRepository.existsById(id)) {
            throw new ResourceNotFoundException("Product not found");
        }
        productRepository.deleteById(id);
    }
    
    @Override
    @Transactional
    public Double rateProduct(String id, Integer rating) {
        Product product = productRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        
        // Update rating logic
        double newRating = (product.getRating() * product.getReviewCount() + rating) / (product.getReviewCount() + 1);
        product.setRating(newRating);
        product.setReviewCount(product.getReviewCount() + 1);
        
        productRepository.save(product);
        return newRating;
    }
    
    @Override
    @Transactional
    public void addReview(String id, String title, String comment, Integer rating) {
        Product product = productRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        
        // Add review logic will be implemented with Review entity
    }
}


// ============================================
// 11. CONTROLLER - AuthController.java
// ============================================

package com.furniture.controller;

import com.furniture.dto.request.LoginRequest;
import com.furniture.dto.request.RegisterRequest;
import com.furniture.dto.response.AuthResponse;
import com.furniture.service.AuthService;
import com.furniture.util.ApiResponse;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@AllArgsConstructor
public class AuthController {
    
    private AuthService authService;
    
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(
            new ApiResponse<>(true, "Login successful", response)
        );
    }
    
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(
            new ApiResponse<>(true, "Registration successful", response)
        );
    }
    
    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout() {
        authService.logout();
        return ResponseEntity.ok(
            new ApiResponse<>(true, "Logout successful", null)
        );
    }
    
    @PostMapping("/refresh-token")
    public ResponseEntity<ApiResponse<AuthResponse>> refreshToken(
        @RequestBody Map<String, String> request) {
        AuthResponse response = authService.refreshToken(request.get("refreshToken"));
        return ResponseEntity.ok(
            new ApiResponse<>(true, "Token refreshed", response)
        );
    }
    
    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<Void>> forgotPassword(@RequestParam String email) {
        authService.forgotPassword(email);
        return ResponseEntity.ok(
            new ApiResponse<>(true, "Password reset link sent to email", null)
        );
    }
    
    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<Void>> resetPassword(
        @RequestParam String token,
        @RequestParam String newPassword,
        @RequestParam String confirmPassword) {
        authService.resetPassword(token, newPassword, confirmPassword);
        return ResponseEntity.ok(
            new ApiResponse<>(true, "Password reset successful", null)
        );
    }
    
    @GetMapping("/verify-token")
    public ResponseEntity<ApiResponse<Void>> verifyToken() {
        return ResponseEntity.ok(
            new ApiResponse<>(true, "Token is valid", null)
        );
    }
}


// ============================================
// 12. CONTROLLER - ProductController.java
// ============================================

package com.furniture.controller;

import com.furniture.dto.request.CreateProductRequest;
import com.furniture.dto.response.ProductResponse;
import com.furniture.service.ProductService;
import com.furniture.util.ApiResponse;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/products")
@AllArgsConstructor
public class ProductController {
    
    private ProductService productService;
    
    @GetMapping
    public ResponseEntity<ApiResponse<Page<ProductResponse>>> getAllProducts(
        @RequestParam(required = false) Double minPrice,
        @RequestParam(required = false) Double maxPrice,
        @RequestParam(required = false) String category,
        @RequestParam(required = false) String search,
        @RequestParam(required = false) String sort,
        @PageableDefault(size = 12, page = 0, sort = "createdAt", direction = Sort.Direction.DESC) 
        Pageable pageable) {
        
        Page<ProductResponse> products;
        
        if (search != null && !search.isEmpty()) {
            products = productService.searchProducts(search, pageable);
        } else {
            products = productService.filterProducts(minPrice, maxPrice, category, sort, pageable);
        }
        
        return ResponseEntity.ok(
            new ApiResponse<>(true, "Products retrieved successfully", products)
        );
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductResponse>> getProductById(@PathVariable String id) {
        ProductResponse product = productService.getProductById(id);
        return ResponseEntity.ok(
            new ApiResponse<>(true, "Product retrieved successfully", product)
        );
    }
    
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<ApiResponse<Page<ProductResponse>>> getProductsByCategory(
        @PathVariable String categoryId,
        @PageableDefault(size = 12, page = 0) Pageable pageable) {
        
        Page<ProductResponse> products = productService.getProductsByCategory(categoryId, pageable);
        return ResponseEntity.ok(
            new ApiResponse<>(true, "Category products retrieved", products)
        );
    }
    
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ProductResponse>> createProduct(
        @ModelAttribute CreateProductRequest request) {
        ProductResponse product = productService.createProduct(request);
        return ResponseEntity.ok(
            new ApiResponse<>(true, "Product created successfully", product)
        );
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ProductResponse>> updateProduct(
        @PathVariable String id,
        @ModelAttribute CreateProductRequest request) {
        ProductResponse product = productService.updateProduct(id, request);
        return ResponseEntity.ok(
            new ApiResponse<>(true, "Product updated successfully", product)
        );
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteProduct(@PathVariable String id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok(
            new ApiResponse<>(true, "Product deleted successfully", null)
        );
    }
    
    @PostMapping("/{id}/rate")
    public ResponseEntity<ApiResponse<Double>> rateProduct(
        @PathVariable String id,
        @RequestParam Integer rating) {
        Double averageRating = productService.rateProduct(id, rating);
        return ResponseEntity.ok(
            new ApiResponse<>(true, "Product rated successfully", averageRating)
        );
    }
    
    @PostMapping("/{id}/reviews")
    public ResponseEntity<ApiResponse<Void>> addReview(
        @PathVariable String id,
        @RequestParam String title,
        @RequestParam String comment,
        @RequestParam Integer rating) {
        productService.addReview(id, title, comment, rating);
        return ResponseEntity.ok(
            new ApiResponse<>(true, "Review added successfully", null)
        );
    }
}


// ============================================
// 13. EXCEPTION HANDLER - GlobalExceptionHandler.java
// ============================================

package com.furniture.exception;

import com.furniture.util.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiResponse<?>> handleResourceNotFound(ResourceNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(new ApiResponse<>(false, ex.getMessage(), null));
    }
    
    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<ApiResponse<?>> handleBadRequest(BadRequestException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
            .body(new ApiResponse<>(false, ex.getMessage(), null));
    }
    
    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<ApiResponse<?>> handleUnauthorized(UnauthorizedException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
            .body(new ApiResponse<>(false, ex.getMessage(), null));
    }
    
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<?>> handleValidationErrors(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
            .body(new ApiResponse<>(false, "Validation failed", errors));
    }
    
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<?>> handleGenericException(Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(new ApiResponse<>(false, "An error occurred", ex.getMessage()));
    }
}


