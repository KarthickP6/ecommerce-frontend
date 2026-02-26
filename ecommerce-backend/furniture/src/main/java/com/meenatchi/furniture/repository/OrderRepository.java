package com.meenatchi.furniture.repository;

import com.meenatchi.furniture.entity.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;



@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    Page<Order> findByUserId(long userId, Pageable pageable);
    Page<Order> findByUserIdAndStatus(long userId, String status, Pageable pageable);
    Page<Order> findByStatus(String status, Pageable pageable);
}

