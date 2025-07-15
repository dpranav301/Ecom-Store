package com.ecom.dto.request;

import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CartDto {

	private String cartId;
	private LocalDateTime createdAt;
	private UserReqDto user;
	private List<CartItemDto> cartItem;
}
