package com.hariom.ecommerce.ecommerceplatform.repository;

import com.hariom.ecommerce.ecommerceplatform.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.net.InterfaceAddress;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User,Long> {

    Optional<User> findByName(String username);
    Optional<User> findByEmail(String email);

}
