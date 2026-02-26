package com.meenatchi.furniture.repository;

import com.meenatchi.furniture.entity.Wishlist;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface WishlistRepository extends JpaRepository<Wishlist, Long> {
    Page<Wishlist> findByUserId(long userId, Pageable pageable);
    Optional<Wishlist> findByUserIdAndProductId(long userId, long productId);
    void deleteByUserIdAndProductId(long userId, long productId);
}

