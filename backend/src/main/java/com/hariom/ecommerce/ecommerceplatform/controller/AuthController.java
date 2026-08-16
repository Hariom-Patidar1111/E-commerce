package com.hariom.ecommerce.ecommerceplatform.controller;

import com.hariom.ecommerce.ecommerceplatform.dto.LoginRequest;
import com.hariom.ecommerce.ecommerceplatform.dto.LoginResponse;
import com.hariom.ecommerce.ecommerceplatform.dto.SignupRequest;
import com.hariom.ecommerce.ecommerceplatform.entity.User;
import com.hariom.ecommerce.ecommerceplatform.service.Service;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/auth")
public class AuthController {
    @Autowired
    private Service service;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request){
        LoginResponse response = service.login(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/sign")
    public ResponseEntity<String> Sign( @Valid @RequestBody  SignupRequest request){
         service.signup(request);
        return ResponseEntity.status(HttpStatus.CREATED).body("✅ User registered successfully!");
    }
}
