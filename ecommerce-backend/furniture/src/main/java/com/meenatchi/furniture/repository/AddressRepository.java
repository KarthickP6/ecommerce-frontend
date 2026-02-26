package com.meenatchi.furniture.repository;

import com.meenatchi.furniture.entity.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AddressRepository extends JpaRepository<Address, Long> {
    List<Address> findByUserId(long userId);
    void deleteByUserIdAndId(long userId, long addressId);
}

