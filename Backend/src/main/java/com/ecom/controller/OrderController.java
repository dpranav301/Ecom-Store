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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ecom.constant.CommonConstant.RoleConstant;
import com.ecom.dto.request.OrderDto;
import com.ecom.dto.response.ApiResponseMsg;
import com.ecom.dto.response.PageableResponseDto;
import com.ecom.service.OrderService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/orders")
public class OrderController {
	@Autowired
	private OrderService orderService;

	@PreAuthorize("hasRole('"+RoleConstant.USER+"')")
	@PostMapping("/{userId}")
	public ResponseEntity<OrderDto> createOrder(@Valid @RequestBody OrderDto orderDto,@PathVariable String userId){
		return new ResponseEntity<>(orderService.createOrder(orderDto, userId), HttpStatus.OK);
	}
	
	@PreAuthorize("hasRole('"+RoleConstant.ADMIN+"')")
	@DeleteMapping("/{orderId}")
	public ResponseEntity<ApiResponseMsg> removeOrder(@PathVariable String orderId){
		ApiResponseMsg apiResponseMsg=new ApiResponseMsg();
		apiResponseMsg.setMessage("Order Deleted Successfully");
		apiResponseMsg.setSuccess(true);
		apiResponseMsg.setStatus(HttpStatus.OK);
		orderService.removeOrder(orderId);
		return new ResponseEntity<>(apiResponseMsg, HttpStatus.OK);
	}
	
	@PreAuthorize("hasAnyRole('"+RoleConstant.ADMIN+"','"+RoleConstant.USER+"')")
	@GetMapping("/user/{userId}")
	public ResponseEntity<PageableResponseDto<OrderDto>> getOrderOfUser(@RequestParam(value = "pageNumber", defaultValue = "0", required = false) int pageNumber,
			@RequestParam(value = "pageSize", defaultValue = "5", required = false) int pageSize,
			@RequestParam(value = "sortDirection", defaultValue = "asc", required = false) String sortDirection,
			@RequestParam(value = "sortBy", defaultValue = "orderedDate", required = false) String sortBy,@PathVariable String userId){
		PageableResponseDto<OrderDto> orderOfUser = orderService.getOrderOfUser(pageNumber, pageSize, sortDirection, sortBy, userId);
		return new ResponseEntity<>(orderOfUser, HttpStatus.OK);
	}
	@PreAuthorize("hasRole('"+RoleConstant.ADMIN+"')")
	@GetMapping
	public ResponseEntity<PageableResponseDto<OrderDto>> getAllOrder(@RequestParam(value = "pageNumber", defaultValue = "0", required = false) int pageNumber,
			@RequestParam(value = "pageSize", defaultValue = "5", required = false) int pageSize,
			@RequestParam(value = "sortDirection", defaultValue = "desc", required = false) String sortDirection,
			@RequestParam(value = "sortBy", defaultValue = "orderedDate", required = false) String sortBy){
		PageableResponseDto<OrderDto> allOrder = orderService.getAllOrder(pageNumber, pageSize, sortDirection, sortBy);
		return new ResponseEntity<>(allOrder, HttpStatus.OK);
	}
	@PreAuthorize("hasAnyRole('ADMIN','USER')")
	@PutMapping("/{orderId}")
	public ResponseEntity<OrderDto> updateOrder(@Valid @RequestBody OrderDto orderDto,@PathVariable String orderId){
		return new ResponseEntity<>(orderService.updateOrder(orderDto, orderId), HttpStatus.OK);
	}
	
	@GetMapping("/search/{keyword}")
//	@PreAuthorize("hasRole('"+RoleConstant.ADMIN+"')")
	public ResponseEntity<PageableResponseDto<OrderDto>> searchOrder(@RequestParam(value = "pageNumber", defaultValue = "0", required = false) int pageNumber,
			@RequestParam(value = "pageSize", defaultValue = "5", required = false) int pageSize,
			@RequestParam(value = "sortDirection", defaultValue = "asc", required = false) String sortDirection,
			@RequestParam(value = "sortBy", defaultValue = "orderedDate", required = false) String sortBy,
			@PathVariable String keyword){
		PageableResponseDto<OrderDto> allOrder = orderService.searchOrder(pageNumber, pageSize, sortDirection, sortBy,keyword);
		return new ResponseEntity<>(allOrder, HttpStatus.OK);
	}
}
