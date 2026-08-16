package com.hariom.ecommerce.ecommerceplatform.repository;

import com.hariom.ecommerce.ecommerceplatform.entity.Cart;
import com.hariom.ecommerce.ecommerceplatform.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartRepository extends JpaRepository<Cart,Long> {
    //public Cart findById(Long cartId);
    Cart findByUser(User user);

}
