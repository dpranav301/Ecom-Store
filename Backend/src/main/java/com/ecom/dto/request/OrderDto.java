package com.ecom.dto.request;

import java.time.LocalDateTime;
import java.util.List;

import org.hibernate.validator.constraints.Length;

import com.ecom.entity.OrderItem;
import com.ecom.entity.User;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderDto {

	private String orderId;
	private String orderStatus="PENDING"; //PENDING,DELIVERED,DISPATCHED
	private boolean paymentStatus=false; //true==paid false=not paid
	private double orderAmount;
	
	@NotBlank(message = "Billing Address Is Compulsory")
	private String billingAddress;
	@NotBlank(message = "Billing Phone Number Is Compulsory")
	@Length(min = 10,max = 10,message = "Please Enter Billing Phone Number of 10 digit")
	private String billingPhone;
	private String billingName;
	
	private LocalDateTime orderedDate;
	private LocalDateTime deliveredDate;
	
	private UserReqDto user;
	
	private List<OrderItemDto> orderItem;
}
