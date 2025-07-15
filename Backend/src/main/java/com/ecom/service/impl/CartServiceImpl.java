package com.ecom.service.impl;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicReference;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ecom.dto.request.AddItemsToCartDto;
import com.ecom.dto.request.CartDto;
import com.ecom.dto.request.CartItemDto;
import com.ecom.dto.request.ProductDto;
import com.ecom.entity.Cart;
import com.ecom.entity.CartItem;
import com.ecom.entity.Product;
import com.ecom.entity.User;
import com.ecom.exception.ResourceNotFoundException;
import com.ecom.repository.CartItemRepository;
import com.ecom.repository.CartRepository;
import com.ecom.repository.ProductRepository;
import com.ecom.repository.UserRepository;
import com.ecom.service.CartService;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class CartServiceImpl implements CartService {

	@Autowired
	ProductRepository productRepository;
	@Autowired
	CartRepository cartRepository;
	@Autowired
	CartItemRepository cartItemRepository;
	@Autowired
	UserRepository userRepository;
	@Autowired
	ModelMapper mapper;

	@Override
	public CartDto addItemsToCart(String userId, AddItemsToCartDto addItemsToCartDto) {
		AtomicReference<Boolean> isCartItemListUpdated = new AtomicReference<Boolean>(false);
		log.info("Add Items To Cart Service Invoked");
		String produtId = addItemsToCartDto.getProductId();
		int quantity = addItemsToCartDto.getQuantity();

		Product product = productRepository.findById(produtId)
				.orElseThrow(() -> new ResourceNotFoundException("Product Not Found"));
		if (quantity <= 0) {
			throw new ResourceNotFoundException("Requested Quantity Is invalid");
		}
		if (product.getQuantity()==0) {
			product.setStock(false);
			productRepository.save(product);
			throw new ResourceNotFoundException("This Product Is Out Of Stock.It Will Stocked Up Soon");
		}
		double productPrice = product.getDiscountedPrice();

		User user = userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User Not Found"));

		Optional<Cart> optionalCart = cartRepository.findByUser(user);
		Cart cart = null;
		if (optionalCart.isEmpty()) {
			log.info("New Cart Block");
			cart = new Cart();
			String cartId = UUID.randomUUID().toString();
			cart.setCartId(cartId);
			CartItem cartItem = new CartItem();
			cartItem.setProduct(product);
			cartItem.setQuantity(quantity);
			cartItem.setTotalPrice(productPrice * quantity);
			cartItem.setCart(cart);
			List<CartItem> listOfCartItem = new ArrayList<>();
			listOfCartItem.add(cartItem);
			cart.setCartItem(listOfCartItem);
			cart.setUser(user);

		} else {
			log.info("Updated Cart Block");
			// Get All CartItem
//			List<CartItem> existingCartItem=optionalCart.get().getCartItem();
			cart = optionalCart.get();
//			List<CartItem> updatedCartItemList=existingCartItem.stream().map(cartItem->{
//				String productId=cartItem.getProduct().getProductId();
//				if(productId!=null&&productId.equals(addItemsToCartDto.getProductId())) {
//					cartItem.setQuantity(cartItem.getQuantity()+addItemsToCartDto.getQuantity());
//					cartItem.setTotalPrice(cartItem.getTotalPrice()+addItemsToCartDto.getQuantity()*product.getDiscountedPrice());
//					isCartItemListUpdated.set(true);
//				}
//				return cartItem;
//			}).collect(Collectors.toList());

			for (CartItem cartItem : cart.getCartItem()) {
				String productId = cartItem.getProduct().getProductId();
				if (productId != null && productId.equals(addItemsToCartDto.getProductId())) {
					cartItem.setQuantity(cartItem.getQuantity() + addItemsToCartDto.getQuantity());
					cartItem.setTotalPrice(
							cartItem.getTotalPrice() + addItemsToCartDto.getQuantity() * product.getDiscountedPrice());
					isCartItemListUpdated.set(true);
					break;
				}
			}

			// This Code Is When There New Product Came other than Present in list
			if (Boolean.FALSE.equals(isCartItemListUpdated.get())) {
				CartItem cartItem = new CartItem();
				cartItem.setProduct(product);
				cartItem.setQuantity(quantity);
				cartItem.setTotalPrice(productPrice * quantity);
				cartItem.setCart(cart);
				cart.getCartItem().add(cartItem);
			}
			cart.setCartItem(cart.getCartItem());
		}

		// Save CartItemToCartRepo
		cart = cartRepository.save(cart);

		// Now Update the Quantity in Product Table Also
		product.setQuantity(product.getQuantity() - quantity);
		productRepository.save(product);
		return mapper.map(cart, CartDto.class);
	}

//	@Override
//	public CartDto removeItemsFromCart(String userId, long cartItemId) {
//		// First We Fetch The Product and The Quantity of That CArtItem
//		User user = userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User Not Found"));
//		Cart cart = cartRepository.findByUser(user)
//				.orElseThrow(() -> new ResourceNotFoundException("Please Add Items To The Cart"));
//
////		CartItem cartItemToDelete = cartItemRepository.findById(cartItemId).orElseThrow(()->new ResourceNotFoundException("Given Item Is Not Present in cart"));
//
//		List<CartItem> listOfcartItemToDelete = cart.getCartItem();
//		for (CartItem cartItemToDelete : listOfcartItemToDelete) {
//			if (cartItemToDelete.getCartItemId() == cartItemId) {
//				long quantityOfCartItem = cartItemToDelete.getQuantity();
//				if (quantityOfCartItem != 1) {
//					Product productIdOfCartItemTodelete = cartItemToDelete.getProduct();
//					productIdOfCartItemTodelete.setQuantity(productIdOfCartItemTodelete.getQuantity() + 1);
//					cartItemToDelete.setQuantity(quantityOfCartItem - 1);
//					cartItemToDelete.setTotalPrice(cartItemToDelete.getTotalPrice()-productIdOfCartItemTodelete.getDiscountedPrice());
//					productRepository.save(productIdOfCartItemTodelete);
//					cartItemRepository.save(cartItemToDelete);
//				} else {
//					Product productIdOfCartItemTodelete = cartItemToDelete.getProduct();
//					productIdOfCartItemTodelete.setQuantity(productIdOfCartItemTodelete.getQuantity() + 1);
//					productRepository.save(productIdOfCartItemTodelete);
//					cartItemRepository.delete(cartItemToDelete);
//					listOfcartItemToDelete.remove(cartItemToDelete);
//				}
//
//			}
//		}
//		cart.setCartItem(listOfcartItemToDelete);
//		return mapper.map(cartRepository.save(cart), CartDto.class);
//		
//	}
	
	@Override
	public CartDto removeItemsFromCart(String userId, long cartItemId) {
	    // Fetch user and cart
	    User user = userRepository.findById(userId)
	        .orElseThrow(() -> new ResourceNotFoundException("User Not Found"));
	    Cart cart = cartRepository.findByUser(user)
	        .orElseThrow(() -> new ResourceNotFoundException("Please Add Items To The Cart"));

	    List<CartItem> cartItems = cart.getCartItem();
	    Iterator<CartItem> iterator = cartItems.iterator();

	    while (iterator.hasNext()) {
	        CartItem cartItem = iterator.next();
	        if (cartItem.getCartItemId() == cartItemId) {
	            long quantity = cartItem.getQuantity();
	            Product product = cartItem.getProduct();

	            // Increase product stock
	            product.setQuantity(product.getQuantity() + 1);
	            productRepository.save(product);

	            if (quantity > 1) {
	                cartItem.setQuantity(quantity - 1);
	                cartItem.setTotalPrice(cartItem.getTotalPrice() - product.getDiscountedPrice());
	                // cartItemRepository.save(cartItem); // Uncomment if needed
	            } else {
	                iterator.remove(); // Safe removal during iteration
	                // cartItemRepository.delete(cartItem); // Uncomment if you're using DB-level cart items
	            }
	            break; // Exit after handling the matching cart item
	        }
	    }

	    cart.setCartItem(cartItems);
	    return mapper.map(cartRepository.save(cart), CartDto.class);
	}


	@Override
	public void clearCart(String userId) {
		User user = userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User Not Found"));
		Cart cart = cartRepository.findByUser(user)
				.orElseThrow(() -> new ResourceNotFoundException("Please Add Items To The Cart"));
		List<CartItem> listOfCartItemTodelete = cart.getCartItem();
		for (CartItem cartItemToDelete : listOfCartItemTodelete) {
			long quantityOfCartItem = cartItemToDelete.getQuantity();
			Product productIdOfCartItemTodelete = cartItemToDelete.getProduct();
			productIdOfCartItemTodelete.setQuantity(productIdOfCartItemTodelete.getQuantity() + quantityOfCartItem);

			productRepository.save(productIdOfCartItemTodelete);
		}
		listOfCartItemTodelete.forEach(cartItem -> cartItem.setCart(null));
		listOfCartItemTodelete.clear(); // To Remove All CartItem Without Deleting Cart
		cartRepository.save(cart); // This Will Remove the cartItem entry from cartItem Table as we added cascade

	}

	@Override
	public CartDto fetchCartOfUser(String userId) {
		User user = userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User Not Found"));
		Cart cart = cartRepository.findByUser(user)
				.orElseThrow(() -> new ResourceNotFoundException("Please Add Items To The Cart"));

		return mapper.map(cart, CartDto.class);
	}

}
