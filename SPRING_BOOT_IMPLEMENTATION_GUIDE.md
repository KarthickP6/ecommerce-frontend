# Spring Boot Backend - Complete Implementation Guide

## Project Structure

```
furniture-backend/
├── src/main/java/com/furniture
│   ├── config/
│   │   ├── SecurityConfig.java
│   │   ├── CorsConfig.java
│   │   ├── SwaggerConfig.java
│   │   └── JwtConfig.java
│   ├── security/
│   │   ├── JwtAuthenticationFilter.java
│   │   ├── JwtTokenProvider.java
│   │   ├── CustomUserDetailsService.java
│   │   └── SecurityConstants.java
│   ├── controller/
│   │   ├── AuthController.java
│   │   ├── ProductController.java
│   │   ├── CartController.java
│   │   ├── OrderController.java
│   │   ├── UserController.java
│   │   └── AdminController.java
│   ├── service/
│   │   ├── impl/
│   │   │   ├── AuthServiceImpl.java
│   │   │   ├── ProductServiceImpl.java
│   │   │   ├── CartServiceImpl.java
│   │   │   ├── OrderServiceImpl.java
│   │   │   └── UserServiceImpl.java
│   │   └── (Interface files)
│   ├── repository/
│   │   ├── UserRepository.java
│   │   ├── ProductRepository.java
│   │   ├── CartRepository.java
│   │   ├── OrderRepository.java
│   │   ├── RoleRepository.java
│   │   └── (Other repositories)
│   ├── entity/
│   │   ├── User.java
│   │   ├── Product.java
│   │   ├── Category.java
│   │   ├── Cart.java
│   │   ├── CartItem.java
│   │   ├── Order.java
│   │   ├── OrderItem.java
│   │   ├── Payment.java
│   │   ├── Review.java
│   │   ├── Role.java
│   │   ├── Address.java
│   │   ├── Wishlist.java
│   │   └── ProductImage.java
│   ├── dto/
│   │   ├── request/
│   │   │   ├── LoginRequest.java
│   │   │   ├── RegisterRequest.java
│   │   │   ├── CreateProductRequest.java
│   │   │   ├── AddToCartRequest.java
│   │   │   ├── CreateOrderRequest.java
│   │   │   └── (Other request DTOs)
│   │   └── response/
│   │       ├── AuthResponse.java
│   │       ├── ProductResponse.java
│   │       ├── CartResponse.java
│   │       ├── OrderResponse.java
│   │       └── (Other response DTOs)
│   ├── mapper/
│   │   ├── UserMapper.java
│   │   ├── ProductMapper.java
│   │   ├── OrderMapper.java
│   │   └── (Other mappers)
│   ├── exception/
│   │   ├── GlobalExceptionHandler.java
│   │   ├── ResourceNotFoundException.java
│   │   ├── BadRequestException.java
│   │   ├── UnauthorizedException.java
│   │   └── ConflictException.java
│   ├── util/
│   │   ├── ApiResponse.java
│   │   ├── PageableUtil.java
│   │   ├── ValidationUtil.java
│   │   └── ConstantUtil.java
│   ├── constant/
│   │   ├── UserRoles.java
│   │   ├── OrderStatus.java
│   │   ├── PaymentStatus.java
│   │   └── AppConstants.java
│   └── FurnitureBackendApplication.java
├── src/main/resources/
│   ├── application.yml
│   ├── application-dev.yml
│   ├── application-prod.yml
│   └── db/migration/
│       ├── V1__create_users_table.sql
│       ├── V2__create_products_table.sql
│       ├── V3__create_cart_table.sql
│       └── (Other migrations)
├── pom.xml
└── Dockerfile
```

---

## Maven Dependencies (pom.xml)

```xml
<dependencies>
    <!-- Spring Boot Starters -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-security</artifactId>
    </dependency>
    
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-validation</artifactId>
    </dependency>
    
    <!-- Database -->
    <dependency>
        <groupId>org.postgresql</groupId>
        <artifactId>postgresql</artifactId>
        <version>42.7.1</version>
        <scope>runtime</scope>
    </dependency>
    
    <!-- JWT -->
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-api</artifactId>
        <version>0.12.3</version>
    </dependency>
    
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-impl</artifactId>
        <version>0.12.3</version>
        <scope>runtime</scope>
    </dependency>
    
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-jackson</artifactId>
        <version>0.12.3</version>
        <scope>runtime</scope>
    </dependency>
    
    <!-- Lombok -->
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <optional>true</optional>
    </dependency>
    
    <!-- MapStruct -->
    <dependency>
        <groupId>org.mapstruct</groupId>
        <artifactId>mapstruct</artifactId>
        <version>1.5.5.Final</version>
    </dependency>
    
    <!-- Flyway -->
    <dependency>
        <groupId>org.flywaydb</groupId>
        <artifactId>flyway-core</artifactId>
    </dependency>
    
    <!-- Swagger/OpenAPI -->
    <dependency>
        <groupId>org.springdoc</groupId>
        <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
        <version>2.1.0</version>
    </dependency>
    
    <!-- Spring Boot DevTools -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-devtools</artifactId>
        <scope>runtime</scope>
        <optional>true</optional>
    </dependency>
    
    <!-- Testing -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-test</artifactId>
        <scope>test</scope>
    </dependency>
</dependencies>
```

---

## application.yml Configuration

```yaml
spring:
  application:
    name: furniture-backend
  
  datasource:
    url: jdbc:postgresql://localhost:5432/furniture_db
    username: postgres
    password: your_password
    driver-class-name: org.postgresql.Driver
  
  jpa:
    hibernate:
      ddl-auto: validate
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect
        format_sql: true
        jdbc:
          batch_size: 20
    show-sql: false
  
  servlet:
    multipart:
      max-file-size: 10MB
      max-request-size: 10MB
  
  jackson:
    serialization:
      write-dates-as-timestamps: false
    default-property-inclusion: non_null

server:
  port: 8080
  servlet:
    context-path: /api

# JWT Configuration
app:
  jwt:
    secret: your-super-secret-jwt-key-min-256-chars-long-for-production
    expiration: 900000 # 15 minutes in milliseconds
    refresh-expiration: 604800000 # 7 days in milliseconds

logging:
  level:
    root: INFO
    com.furniture: DEBUG
    org.springframework.security: DEBUG
  pattern:
    console: "%d{yyyy-MM-dd HH:mm:ss} - %msg%n"

springdoc:
  swagger-ui:
    path: /swagger-ui.html
    enabled: true
  api-docs:
    path: /v3/api-docs
```

---

## Key Files to Create (In Order)

### 1. ApiResponse.java (Utility)
```java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApiResponse<T> {
    private boolean success;
    private String message;
    private T data;
    private LocalDateTime timestamp = LocalDateTime.now();
    
    public ApiResponse(boolean success, String message, T data) {
        this.success = success;
        this.message = message;
        this.data = data;
    }
}
```

### 2. Entities
- User.java
- Product.java
- Category.java
- Cart.java, CartItem.java
- Order.java, OrderItem.java
- Payment.java
- Review.java
- Role.java
- Address.java
- Wishlist.java

### 3. DTOs
- Request: LoginRequest, RegisterRequest, etc.
- Response: AuthResponse, ProductResponse, etc.

### 4. Repositories
- UserRepository extends JpaRepository
- ProductRepository extends JpaRepository, JpaSpecificationExecutor
- etc.

### 5. Services
- AuthService
- ProductService
- CartService
- OrderService
- UserService

### 6. Controllers
- AuthController
- ProductController
- CartController
- OrderController
- UserController
- AdminController

### 7. Security
- JwtTokenProvider
- JwtAuthenticationFilter
- SecurityConfig

### 8. Exception Handling
- GlobalExceptionHandler

---

## Implementation Notes

1. **Access Token**: Store in memory (Frontend)
2. **Refresh Token**: HttpOnly, Secure cookie (Backend)
3. **JWT Expiry**: 15 minutes access, 7 days refresh
4. **Pagination**: Use Spring Data Page<T>
5. **Filtering**: Use JPA Specifications
6. **Audit Fields**: created_at, updated_at on all entities
7. **Soft Delete**: Use @Where annotation for logical deletion
8. **Role-Based Access**: Use @PreAuthorize("hasRole('ROLE_ADMIN')")
9. **File Upload**: Use multipart/form-data for products with images
10. **CORS**: Configure for frontend URL

---

## Next Steps

1. Create Maven project structure
2. Add all dependencies
3. Create application.yml
4. Create database migration scripts
5. Create entity classes
6. Create DTOs and Mappers
7. Create repository interfaces
8. Create service layer
9. Create controller layer
10. Configure security
11. Add global exception handling
12. Test all endpoints


