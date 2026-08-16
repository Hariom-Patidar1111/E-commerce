package com.hariom.ecommerce.ecommerceplatform.controller;

import com.hariom.ecommerce.ecommerceplatform.entity.*;
import com.hariom.ecommerce.ecommerceplatform.repository.*;
import com.hariom.ecommerce.ecommerceplatform.service.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/Order")
public class OrderIdController {
    @Autowired
    private Service service;
//    @Autowired
//    private Product product;
    @Autowired
    private Repository repository;
    @Autowired
    private OrderRepository orderRepository;
//    @Autowired
//    private Order order;
    @Autowired
//    private OrderItem orderItem;
//    @Autowired
    private OrderItemRepository orderItemRepository;
    @Autowired
    private CartRepository cartRepository;
    @Autowired
    private CartItemRepository cartItemRepository;

    @Transactional
    public String productId(Long productId,int quantity){
        Product product = repository.findById(productId).get();

        if(product.getQuantity()<=0){
            return "Out of Stock";
        }
        if(product.getQuantity()<quantity){
            return "Not enough stock";
        }
        Order order = new Order();

        OrderItem orderItem = new OrderItem();
        orderItem.setOrder(order);
        orderItem.setProduct(product);
        orderItem.setQuantity(quantity);
        orderItem.setPrice(product.getPrice());
        order.getOrderItems().add(orderItem);
        //orderItemRepository.save(orderItem);


        product.setQuantity(product.getQuantity()-quantity);
        repository.save(product);

        double price = product.getPrice();
        double amount = price * quantity;

        order.setTotalAmount(amount);
        order.setStatus("created");
        orderRepository.save(order);
        return "Order Placed";
    }

    @GetMapping("/cartId")
    @Transactional
    public String cartId(Long cartId){
        List<CartItem> list = cartItemRepository.findByCartId(cartId);
        Order  order = new Order();
        double amount= 0;
        for(CartItem cartItem : list){

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(cartItem.getProduct());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setPrice(cartItem.getProduct().getPrice());
            order.getOrderItems().add(orderItem);

            int quantity = cartItem.getQuantity();
            amount+=cartItem.getProduct().getPrice()*quantity;
            Product product = repository.findById(cartItem.getProduct().getId()).get();
            product.setQuantity(product.getQuantity()-quantity);
        }
        order.setTotalAmount(amount);
        order.setStatus("created");
        orderRepository.save(order);
        cartItemRepository.deleteAll(list);

        return "All Cart Items Placed";
    }
}
