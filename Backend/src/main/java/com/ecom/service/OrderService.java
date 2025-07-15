package com.ecom.service;

import org.springframework.stereotype.Service;

import com.ecom.dto.request.OrderDto;
import com.ecom.dto.response.PageableResponseDto;

@Service
public interface OrderService {

	//create order
	public OrderDto createOrder(OrderDto orderDto,String userId);
	//remove order
	public void removeOrder(String orderId);
	//get order of user
	public PageableResponseDto<OrderDto> getOrderOfUser(int pageNumber,int pageSize,String sortDirection,String sortBy,String userId);
	//get All orders
	public PageableResponseDto<OrderDto> getAllOrder(int pageNumber,int pageSize,String sortDirection,String sortBy);
	//other methods
	public OrderDto updateOrder(OrderDto orderDto,String orderId);
	
	//search product
	PageableResponseDto<OrderDto> searchOrder(int pageNumber, int pageSize, String sortDirection,String sortBy,String keyword);
}
