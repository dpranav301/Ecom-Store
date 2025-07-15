package com.ecom.dto.request;

import java.time.LocalDateTime;

import com.ecom.validation.StringLength;
import com.fasterxml.jackson.annotation.JsonAlias;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductDto {

	private String productId;
	@NotBlank(message = "Product Title Cannot be Empty")
	@StringLength(message = "Product Title Must of At Least 4 Chracter")
	private String title;
	@NotBlank(message = "Product Description Cannot be Empty")
	@StringLength(message = "Product Description Must of At Least 4 Chracter")
	private String description;
	private double price;
	@Min(value = 1,message = "Quantity Of Product Must At Least 1")
	private int quantity;
	private LocalDateTime createdAt;
	private boolean live;
	private boolean stock;
	private double discountedPrice;
//	@NotBlank(message = "Product Image Must Not Be Blank")
	private String productImage;
	private CategoryReqDto category;
}
