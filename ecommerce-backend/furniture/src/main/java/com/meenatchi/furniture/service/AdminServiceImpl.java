package com.meenatchi.furniture.service;

import com.meenatchi.furniture.dto.request.BlockUserRequest;
import com.meenatchi.furniture.dto.request.ProductRequest;
import com.meenatchi.furniture.dto.request.UpdateOrderStatusRequest;
import com.meenatchi.furniture.dto.response.AdminDashboardResponse;
import com.meenatchi.furniture.dto.response.OrderResponse;
import com.meenatchi.furniture.dto.response.ProductResponse;
import com.meenatchi.furniture.dto.response.UserResponse;
import com.meenatchi.furniture.entity.Category;
import com.meenatchi.furniture.entity.Order;
import com.meenatchi.furniture.entity.Product;
import com.meenatchi.furniture.entity.User;
import com.meenatchi.furniture.exception.ResourceNotFoundException;
import com.meenatchi.furniture.repository.CategoryRepository;
import com.meenatchi.furniture.repository.OrderRepository;
import com.meenatchi.furniture.repository.ProductRepository;
import com.meenatchi.furniture.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final CategoryRepository categoryRepository;

    @Override
    @Transactional(readOnly = true)
    public AdminDashboardResponse getDashboardStats() {
        long totalUsers = userRepository.count();
        long totalProducts = productRepository.count();
        long totalOrders = orderRepository.count();
        long pendingOrders = orderRepository.findByStatus("PENDING", PageRequest.of(0, Integer.MAX_VALUE)).getTotalElements();

        BigDecimal totalRevenue = orderRepository.findAll()
                .stream()
                .map(Order::getTotalPrice)
                .filter(price -> price != null)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return AdminDashboardResponse.builder()
                .totalUsers(totalUsers)
                .totalProducts(totalProducts)
                .totalOrders(totalOrders)
                .totalRevenue(totalRevenue)
                .pendingOrders(pendingOrders)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public Page<UserResponse> getAllUsers(int page, int limit, String search, String status) {
        Pageable pageable = PageRequest.of(page - 1, limit);
        Page<User> users;

        if (search != null && !search.isEmpty()) {
            users = userRepository.searchUsers(search, pageable);
        } else if (status != null && !status.isEmpty()) {
            Boolean blocked = "blocked".equalsIgnoreCase(status);
            users = userRepository.findByBlocked(blocked, pageable);
        } else {
            users = userRepository.findAll(pageable);
        }

        return users.map(this::mapToUserResponse);
    }

    @Override
    @Transactional
    public UserResponse blockUser(Long userId, BlockUserRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        user.setBlocked(request.getBlocked());
        User savedUser = userRepository.save(user);
        return mapToUserResponse(savedUser);
    }

    @Override
    @Transactional
    public UserResponse unblockUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        user.setBlocked(false);
        User savedUser = userRepository.save(user);
        return mapToUserResponse(savedUser);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ProductResponse> getAllProducts(int page, int limit) {
        Pageable pageable = PageRequest.of(page - 1, limit);
        return productRepository.findAll(pageable)
                .map(this::mapToProductResponse);
    }

    @Override
    @Transactional
    public ProductResponse createProduct(ProductRequest request) {
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.getCategoryId()));

        Product product = Product.builder()
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .stock(request.getStock())
                .category(category)
                .rating(0.0)
                .build();

        Product savedProduct = productRepository.save(product);
        return mapToProductResponse(savedProduct);
    }

    @Override
    @Transactional
    public ProductResponse updateProduct(Long productId, ProductRequest request) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setStock(request.getStock());

        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.getCategoryId()));
            product.setCategory(category);
        }

        Product savedProduct = productRepository.save(product);
        return mapToProductResponse(savedProduct);
    }

    @Override
    @Transactional
    public void deleteProduct(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));

        productRepository.delete(product);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<OrderResponse> getAllOrders(int page, int limit) {
        Pageable pageable = PageRequest.of(page - 1, limit);
        return orderRepository.findAll(pageable)
                .map(this::mapToOrderResponse);
    }

    @Override
    @Transactional
    public OrderResponse updateOrderStatus(Long orderId, UpdateOrderStatusRequest request) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));

        order.setStatus(request.getStatus());
        Order savedOrder = orderRepository.save(order);
        return mapToOrderResponse(savedOrder);
    }

    private UserResponse mapToUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .avatar(user.getAvatar())
                .roles(user.getRoles().stream()
                        .map(r -> r.getName())
                        .collect(Collectors.toSet()))
                .createdAt(user.getCreatedAt())
                .build();
    }

    private ProductResponse mapToProductResponse(Product product) {
        return ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .stock(product.getStock())
                .rating(product.getRating())
                .images(product.getImages().stream()
                        .map(img -> img.getImageUrl())
                        .collect(Collectors.toSet()))
                .createdAt(product.getCreatedAt())
                .build();
    }

    private OrderResponse mapToOrderResponse(Order order) {
        return OrderResponse.builder()
                .id(order.getId())
                .orderNumber(order.getOrderNumber())
                .status(order.getStatus())
                .totalPrice(order.getTotalPrice())
                .shippingAddress(order.getShippingAddress() != null ? order.getShippingAddress().getStreet() : "")
                .notes(order.getNotes())
                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt())
                .build();
    }
}

