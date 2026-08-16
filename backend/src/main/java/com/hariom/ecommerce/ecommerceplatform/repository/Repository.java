package com.hariom.ecommerce.ecommerceplatform.repository;

import com.hariom.ecommerce.ecommerceplatform.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface Repository extends JpaRepository<Product,Long> {
    // ✅ Find by Category - YEH ADD KARO
    List<Product> findByCategory(String category);

    // Optional: Find by Brand
    List<Product> findByBrand(String brand);

    // ✅ JPA Method - Name se search (case insensitive)
    List<Product> findByNameContainingIgnoreCase(String name);
}
