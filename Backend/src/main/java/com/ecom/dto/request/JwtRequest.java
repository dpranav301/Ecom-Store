package com.ecom.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class JwtRequest {

	@Pattern(regexp = "^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$",message = "Invalid Email")
	@NotBlank(message = "Email Is Required")
	private String email;
	@NotBlank(message = "Password Is Required")
	@Size(min=3,message = "Invalid Password It Must be Of Min of 3 character")
	private String password;
}
