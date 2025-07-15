package com.ecom.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CartItemDto {

	private long cartItemId;
	private ProductDto product;
	private long quantity;
	private double totalPrice;
//	private CartDto cart;  No need of this field
}
