package com.hariom.ecommerce.ecommerceplatform.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class SignupRequest {
    @NotBlank(message = "Name is required")
    private String name;
    @NotBlank
    @Email
    private String email;
    @NotBlank
    @Size(min=6)
    private String password;
}
