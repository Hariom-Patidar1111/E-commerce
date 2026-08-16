package com.hariom.ecommerce.ecommerceplatform.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Data
public class Cart {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToMany
    private List<CartItem> items;

    @OneToOne
    @JoinColumn(name = "user_id", unique = true)
    private User user;
}
