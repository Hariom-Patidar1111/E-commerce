package com.hariom.ecommerce.ecommerceplatform.controller;

import com.hariom.ecommerce.ecommerceplatform.dto.UserProfileDTO;
import com.hariom.ecommerce.ecommerceplatform.entity.CartItem;
import com.hariom.ecommerce.ecommerceplatform.entity.Product;
import org.springframework.beans.factory.annotation.Autowired;
import com.hariom.ecommerce.ecommerceplatform.service.Service;
import org.springframework.data.repository.query.Param;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/product")
@CrossOrigin(origins = {
        "http://localhost:5173",
        "https://e-commerce-tau-topaz-13.vercel.app"
})
public class ProductController {

    @Autowired
    private Service service;
    @Autowired
    private OrderIdController orderIdController;

    @PostMapping("/add")
    public List<Product> addProduct(@RequestBody List<Product> product) {
        return service.save(product);

    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        Product product = service.getProductById(id);
        if (product != null) {
            return ResponseEntity.ok(product);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/user/{id}")
    public UserProfileDTO getUserProfile(@PathVariable Long id) {
        return service.getUserProfile(id);
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<Product>> getProductsByCategory(@PathVariable String category) {
        return ResponseEntity.ok(service.getProductsByCategory(category));
    }

    @GetMapping("/get")
    public List<Product> getProduct() {
        return service.getProducts();
    }

    // ✅ NEW - Search products
    @GetMapping("/search")
    public ResponseEntity<List<Product>> searchProducts(@RequestParam(required = false) String name) {
        if (name == null || name.trim().isEmpty()) {
            return ResponseEntity.ok(service.getProducts());
        }
        List<Product> products = service.searchProducts(name.trim());
        return ResponseEntity.ok(products);
    }

    @PostMapping("/productId")
    public String quantity(@PathVariable Long orderId, @PathVariable int quantity) {
        return orderIdController.productId(orderId, quantity);
    }

    // %%% Card ###

    @PostMapping("/add/{cartid}/{productid}/{quantity}")
    public String CardAdd(@PathVariable Long cartid, @PathVariable Long productid, @PathVariable int quantity) {
        return service.cardAdd(cartid, productid, quantity);
    }

    @GetMapping("/cartItem")
    public List<CartItem> cardResponse() {
        return service.cartResponse();
    }

    @PostMapping("/cartId")
    public String cartId(@PathVariable Long cardId) {
        return orderIdController.cartId(cardId);
    }

    @PostMapping("/count/{cartId}")
    public int getCartCount(@PathVariable Long cartId) {
        return service.cartCount(cartId);
    }

}
