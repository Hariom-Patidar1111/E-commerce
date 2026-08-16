package com.hariom.ecommerce.ecommerceplatform.exception;

public class DuplicateUserException extends RuntimeException{
    public DuplicateUserException(String message){
        super(message);
    }
}
