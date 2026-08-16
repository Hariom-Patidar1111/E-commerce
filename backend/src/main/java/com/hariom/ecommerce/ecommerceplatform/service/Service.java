package com.hariom.ecommerce.ecommerceplatform.service;

import com.hariom.ecommerce.ecommerceplatform.dto.LoginRequest;
import com.hariom.ecommerce.ecommerceplatform.dto.LoginResponse;
import com.hariom.ecommerce.ecommerceplatform.dto.SignupRequest;
import com.hariom.ecommerce.ecommerceplatform.dto.UserProfileDTO;
import com.hariom.ecommerce.ecommerceplatform.entity.*;
import com.hariom.ecommerce.ecommerceplatform.exception.DuplicateUserException;
import com.hariom.ecommerce.ecommerceplatform.repository.*;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@org.springframework.stereotype.Service
public class Service {

    @Autowired
    private Repository repo;
    @Autowired
    private CartRepository cartRepository;
    @Autowired
    private CartItemRepository cartItemRepository;
    @Autowired
    private ModelMapper modelMapper;
    @Autowired
    UserRepository userRepository;
    @Autowired
    PasswordEncoder passwordEncoder;
    @Autowired
    JwtService jwtService;


    public User signup(SignupRequest request) {
        // Check if user exists
        if (userRepository.findByName(request.getName()).isPresent()) {
            throw new DuplicateUserException("Username '" + request.getName() + "' already exists!");
        }
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new DuplicateUserException("Email '" + request.getEmail() + "' already registered!");
        }

        User user = new User();
        modelMapper.map(request,user);
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        return userRepository.save(user);
    }

    public List<Product> getProductsByCategory(String category) {
        return repo.findByCategory(category);
    }

    public List<Product> searchProducts(String name) {
        if (name == null || name.trim().isEmpty()) {
            return repo.findAll();  // ✅ Empty search = all products
        }
        return repo.findByNameContainingIgnoreCase(name.trim());
    }

    public LoginResponse login(LoginRequest request) {
        // Find user by username

        User user = userRepository.findByEmail(request.getEmail())  // ✅ email use karo
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        // Check password
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid username or password");
        }

        String token = jwtService.generateToken(user);


        return new LoginResponse(
                token,
                user.getName(),
                user.getEmail(),
                user.getRole().name(),
                user.getId()
        );
    }

    public UserProfileDTO getUserProfile(Long id){
        User user = userRepository.findById(id).get();
        return modelMapper.map(user, UserProfileDTO.class);
    }
    public Product getProductById(Long id){
        return repo.findById(id).orElse(null);

    }


    public List<Product> save(List<Product> product){
        return  repo.saveAll(product);

    }
    public List<Product> getProducts(){
        return repo.findAll();
    }

    public Cart getOrCreateCart(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        Cart cart = cartRepository.findByUser(user);

        if (cart == null) {
            cart = new Cart();
            cart.setUser(user);
            cart = cartRepository.save(cart);
            System.out.println("✅ New cart created for user: " + userId);
        }

        return cart;
    }
    @Transactional
    public String cardAdd(Long userId, Long productId, int quantity) {  // ✅ userId lo, cartId nahi

        // 1. Product check
        Product product = repo.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + productId));

        // 2. ✅ Get or Create Cart (userId se)
        Cart cart = getOrCreateCart(userId);
        Long cartId = cart.getId();  // ✅ Actual cart ID

        System.out.println("Cart ID: " + cartId + " for user: " + userId);

        // 3. CartItem find karo
        Optional<CartItem> existingOpt = cartItemRepository.findByCartIdAndProductId(cartId, productId);

        if (quantity > 0) {
            // ===== ADD LOGIC =====
            if (product.getQuantity() <= 0) {
                return "Out of stock";
            }

            if (existingOpt.isPresent()) {
                CartItem item = existingOpt.get();
                item.setQuantity(item.getQuantity() + quantity);
                product.setQuantity(product.getQuantity() - quantity);
                return "Quantity Added Successfully";
            } else {
                CartItem newItem = new CartItem();
                newItem.setProduct(product);
                newItem.setCart(cart);
                newItem.setQuantity(quantity);
                cartItemRepository.save(newItem);
                product.setQuantity(product.getQuantity() - quantity);
                return "Item Added in Cart";
            }

        } else {
            // ===== REMOVE LOGIC =====
            if (existingOpt.isEmpty()) {
                return "Item not found in cart";
            }

            CartItem item = existingOpt.get();
            int newQuantity = item.getQuantity() + quantity;

            if (newQuantity > 0) {
                item.setQuantity(newQuantity);
                product.setQuantity(product.getQuantity() + Math.abs(quantity));
                return "Quantity removed. Remaining: " + newQuantity;
            } else {
                product.setQuantity(product.getQuantity() + item.getQuantity());
                cartItemRepository.delete(item);
                return "Item removed from cart";
            }
        }
    }

//    public String cardAdd(long cartid,long productid, int quantity){
//        Product product = repo.findById(productid).get();
//        if(quantity>0){
//            if (product.getQuantity() <= 0) {
//                return "Out of stock";
//            }
//            Cart cart = cartRepository.findById(cartid).get();
//            if (cartItemRepository.findById(product.getId()).isPresent()) {
//                CartItem item = cartItemRepository.findById(product.getId()).get();
//                item.setQuantity(item.getQuantity() + quantity);
//                cartItemRepository.save(item);
//                return "Quantity Added Successfully";
//            }
//            CartItem item  = new CartItem();
//            item.setProduct(product);
//            item.setCart(cart);
//            item.setQuantity(quantity);
//            cartItemRepository.save(item);
//
//            return "Item Added in Cart";
//        }
//        else{
//            CartItem item = cartItemRepository.findById(product.getId()).get();
//            if(item.getQuantity()+quantity>0){
//                item.setQuantity(item.getQuantity()+quantity);
//                cartItemRepository.save(item);
//                return "Quantity remove Successfully";
//            }
//            else{
//                return "Not Sufficint Quntity";
//            }
//        }
//    }

    public List<CartItem> cartResponse(){
        return  cartItemRepository.findAll();
    }

    public int cartCount(Long cartid){
        return cartItemRepository.countByCartId(cartid);

    }
}
