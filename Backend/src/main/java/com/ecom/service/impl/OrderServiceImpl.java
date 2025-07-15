package com.ecom.service.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicReference;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.ecom.dto.request.OrderDto;
import com.ecom.dto.request.ProductDto;
import com.ecom.dto.response.PageableResponseDto;
import com.ecom.entity.Cart;
import com.ecom.entity.CartItem;
import com.ecom.entity.Order;
import com.ecom.entity.OrderItem;
import com.ecom.entity.Product;
import com.ecom.entity.User;
import com.ecom.exception.ResourceNotFoundException;
import com.ecom.repository.CartRepository;
import com.ecom.repository.OrderRepository;
import com.ecom.repository.ProductRepository;
import com.ecom.repository.UserRepository;
import com.ecom.service.OrderService;
import com.ecom.utils.Helper;

import lombok.extern.slf4j.Slf4j;
@Service
@Slf4j
public class OrderServiceImpl implements OrderService {
	@Autowired
	private UserRepository userRepository;
	@Autowired
	private OrderRepository orderRepository;
	@Autowired
	private CartRepository cartRepository;
	@Autowired
	private ModelMapper mapper;
	@Autowired
	private ProductRepository productRepository;

	@Override
	public OrderDto createOrder(OrderDto orderDto, String userId) {
		log.info("Create Order Service Invoked");
		User user = userRepository.findById(userId).orElseThrow(()->new ResourceNotFoundException("User Not Found"));
		Cart cart = cartRepository.findByUser(user).orElseThrow(()->new ResourceNotFoundException("Cart With Given User Not Found"));
		AtomicReference<Double> totalOrderPrice=new AtomicReference<>(0.0);
		List<CartItem> cartItem = cart.getCartItem();
		
		if(cartItem.isEmpty()) {
			throw new ResourceNotFoundException("Please Add Items in Cart First");
		}
		List<OrderItem> listOfOrderItem = cartItem.stream().map((item)->{
			OrderItem orderItem=new OrderItem();
			orderItem.setQuantity(item.getQuantity());
			orderItem.setTotalPrice(item.getTotalPrice());
			orderItem.setProduct(item.getProduct());
			totalOrderPrice.set(totalOrderPrice.get()+item.getTotalPrice());
			return orderItem;
		}).toList();
		
		Order order=new Order();
		order.setBillingAddress(orderDto.getBillingAddress());
		order.setBillingName(orderDto.getBillingName());
		order.setBillingPhone(orderDto.getBillingPhone());
		order.setOrderedDate(LocalDateTime.now());
		order.setDeliveredDate(orderDto.getDeliveredDate());
		order.setPaymentStatus(orderDto.isPaymentStatus());
		order.setOrderStatus(orderDto.getOrderStatus());
		order.setOrderId(UUID.randomUUID().toString());
		order.setUser(user);
		order.setOrderAmount(totalOrderPrice.get());
		//This Code Set Order to OrderItem
		for(OrderItem x:listOfOrderItem) {
			x.setOrder(order);
		}
		order.setOrderItem(listOfOrderItem);
		
		order=orderRepository.save(order);
		
		//Now We Must Clear This Items from CartItem Table
		cartItem.clear();
		cart.setCartItem(cartItem);
		cartRepository.save(cart);
		
		return mapper.map(order, OrderDto.class);
	}

	@Override
	public void removeOrder(String orderId) {
		log.info("Delete Order From Cart Service Invoked");
		Order order = orderRepository.findById(orderId).orElseThrow(()->new ResourceNotFoundException("Order With Given Id Not Found"));
		List<OrderItem> orderItem = order.getOrderItem();
		orderItem.forEach(x->{
			Product product=x.getProduct();
			product.setQuantity(product.getQuantity()+x.getQuantity());
			productRepository.save(product);
		});
		orderRepository.delete(order);
		
	}

	@Override
	public PageableResponseDto<OrderDto> getOrderOfUser(int pageNumber, int pageSize, String sortDirection,
			String sortBy, String userId) {
		log.info("Get Order of User Invoked");
		User user = userRepository.findById(userId).orElseThrow(()->new ResourceNotFoundException("User Not Found"));
		Sort sort = sortDirection.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
		PageRequest page = PageRequest.of(pageNumber, pageSize, sort);
		Page<Order> ordersOfUser = orderRepository.findByUser(user, page);
		return Helper.getPageableResponse(ordersOfUser, OrderDto.class);
	}

	@Override
	public PageableResponseDto<OrderDto> getAllOrder(int pageNumber, int pageSize, String sortDirection,
			String sortBy) {
		log.info("Get Order of All User Invoked");
		Sort sort = sortDirection.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
		PageRequest page = PageRequest.of(pageNumber, pageSize, sort);
		Page<Order> findAllOrder = orderRepository.findAll(page);
		return Helper.getPageableResponse(findAllOrder, OrderDto.class);
	}

	@Override
	public OrderDto updateOrder(OrderDto orderDto, String orderId) {
		Order order = orderRepository.findById(orderId).orElseThrow(()->new ResourceNotFoundException("Order Not Found"));
		order.setPaymentStatus(orderDto.isPaymentStatus());
		order.setDeliveredDate(orderDto.getDeliveredDate());
		order.setOrderStatus(orderDto.getOrderStatus());
		order.setBillingAddress(orderDto.getBillingAddress());
		order.setBillingPhone(orderDto.getBillingPhone());
		order=orderRepository.save(order);
		return mapper.map(order, OrderDto.class);
	}

	@Override
	public PageableResponseDto<OrderDto> searchOrder(int pageNumber, int pageSize, String sortDirection, String sortBy,
			String keyword) {
		Sort sort = sortDirection.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
		PageRequest page = PageRequest.of(pageNumber, pageSize, sort);
		Page<Order> findByOrderByOrderId = orderRepository.findByOrderIdContaining(keyword,page);
		return Helper.getPageableResponse(findByOrderByOrderId, OrderDto.class);
//		return null;
	}

}
