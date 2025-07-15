package com.ecom.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderItemDto {

	private int orderItemId;
	private long quantity;
	private double totalPrice;
	private ProductDto product;
}
