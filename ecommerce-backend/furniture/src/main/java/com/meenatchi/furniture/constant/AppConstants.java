package com.meenatchi.furniture.constant;

/**
 * Application Constants
 */
public class AppConstants {
    public static final String API_PREFIX = "/api";
    public static final String AUTH_PREFIX = API_PREFIX + "/auth";
    public static final String PRODUCT_PREFIX = API_PREFIX + "/products";
    public static final String CART_PREFIX = API_PREFIX + "/cart";
    public static final String ORDER_PREFIX = API_PREFIX + "/orders";
    public static final String USER_PREFIX = API_PREFIX + "/users";
    public static final String ADMIN_PREFIX = API_PREFIX + "/admin";

    public static final int DEFAULT_PAGE = 0;
    public static final int DEFAULT_PAGE_SIZE = 20;
    public static final int MAX_PAGE_SIZE = 100;

    // JWT
    public static final String AUTHORIZATION_HEADER = "Authorization";
    public static final String BEARER_PREFIX = "Bearer ";
    public static final String TOKEN_TYPE = "Bearer";

    // Roles
    public static final String ROLE_USER = "ROLE_USER";
    public static final String ROLE_ADMIN = "ROLE_ADMIN";

    // Status
    public static final String ORDER_STATUS_PENDING = "PENDING";
    public static final String ORDER_STATUS_PROCESSING = "PROCESSING";
    public static final String ORDER_STATUS_SHIPPED = "SHIPPED";
    public static final String ORDER_STATUS_DELIVERED = "DELIVERED";
    public static final String ORDER_STATUS_CANCELLED = "CANCELLED";
}

