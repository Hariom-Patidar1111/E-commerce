package com.hariom.ecommerce.ecommerceplatform.repository;

import com.hariom.ecommerce.ecommerceplatform.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Long> {
}
