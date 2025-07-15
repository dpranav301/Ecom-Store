package com.ecom.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ecom.dto.request.AddItemsToCartDto;
import com.ecom.dto.request.CartDto;
import com.ecom.dto.response.ApiResponseMsg;
import com.ecom.service.CartService;

@RestController
@RequestMapping("/cart")
public class CartController {
	
	@Autowired
	private CartService cartService;

	@PreAuthorize("hasAnyRole('ADMIN','USER')")
	@PostMapping("/{userId}")
	public ResponseEntity<CartDto> addItemToCartController(@PathVariable String userId,@RequestBody AddItemsToCartDto addItemsToCartDto){
		return new ResponseEntity<>(cartService.addItemsToCart(userId, addItemsToCartDto), HttpStatus.OK);
	}
	@PreAuthorize("hasAnyRole('USER','ADMIN')")
	@GetMapping("/{userId}")
	public ResponseEntity<CartDto> getCartOfUser(@PathVariable String userId){
		return new ResponseEntity<>(cartService.fetchCartOfUser(userId), HttpStatus.OK);
	}
	@PreAuthorize("hasRole('USER')")
	@PutMapping("/items/{userId}/{cartItemId}")
	public ResponseEntity<CartDto> removeItemsFromCart(@PathVariable String userId,@PathVariable Long cartItemId){
		return new ResponseEntity<CartDto>(cartService.removeItemsFromCart(userId,cartItemId),HttpStatus.OK);
//		ApiResponseMsg apiResponseMsg=new ApiResponseMsg();
//		apiResponseMsg.setMessage("Cart Item Removed Successfully");
//		apiResponseMsg.setStatus(HttpStatus.OK);
//		apiResponseMsg.setSuccess(true);
		
//		return new ResponseEntity<>(apiResponseMsg, HttpStatus.OK);
	}
	@PreAuthorize("hasRole('USER')")
	@DeleteMapping("/{userId}")
	public ResponseEntity<ApiResponseMsg> clearCart(@PathVariable String userId){
		cartService.clearCart(userId);
		ApiResponseMsg apiResponseMsg=new ApiResponseMsg();
		apiResponseMsg.setMessage("Cart Clear Successfully");
		apiResponseMsg.setStatus(HttpStatus.OK);
		apiResponseMsg.setSuccess(true);
		
		return new ResponseEntity<>(apiResponseMsg, HttpStatus.OK);
	}
}
