package com.hariom.ecommerce.ecommerceplatform.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor  // ✅ Sab fields ke saath constructor
@NoArgsConstructor   // ✅ Default constructor (optional)
public class LoginResponse {
    private String token;
    private String name;
    private String email;
    private String role;
    private Long id;
}
