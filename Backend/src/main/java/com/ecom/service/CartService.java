package com.ecom.service;

import org.springframework.stereotype.Service;

import com.ecom.dto.request.AddItemsToCartDto;
import com.ecom.dto.request.CartDto;

@Service
public interface CartService {

	//add items to cart
	//cart for user if not available create the cart and items to cart else we directly add the item to existing cart
	//This service also use to update quantity of cart
	CartDto addItemsToCart(String userId,AddItemsToCartDto addItemsToCartDto);
	
	//remove items from cart
	CartDto removeItemsFromCart(String userId,long cartItemId);
	
	//clear cart
	void clearCart(String userId);
	
	CartDto fetchCartOfUser(String userId);
}
