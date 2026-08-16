package com.hariom.ecommerce.ecommerceplatform.dto;

import jakarta.persistence.Entity;
import lombok.Data;

@Data
public class CartResponse {
    private String name;
    private double price;
    private String category;
    private int quantity;
}
