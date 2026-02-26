package com.meenatchi.furniture.repository;

import com.meenatchi.furniture.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;



@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
}

