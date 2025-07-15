package com.ecom.dto.request;

import java.util.List;

import com.ecom.validation.StringLength;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CategoryReqDto {

	
	private String categoryId;
	@NotBlank(message = "Category Title Cannot be Empty")
	@StringLength(message = "Length Of Title must greater than 4 character")
	private String title;
	@NotBlank(message = "Description Cannot be Empty")
	@StringLength(message = "Length Of Description must be greater than 4 character")
	private String description;
	private String coverImage;
//	private List<ProductDto> product;
}
