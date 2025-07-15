package com.ecom.dto.request;

import java.util.ArrayList;
import java.util.List;

import com.ecom.validation.ImageNameValid;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserReqDto {

	private String userId;

	@Size(min=3,max=15,message = "Invalid Name.")
	private String name;

//	@Email(message = "Invalid Email")
	@Pattern(regexp = "^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$",message = "Invalid Email")
	@NotBlank(message = "Email Is Required")
	private String email;

	@NotBlank(message = "Password Is Required")
	@Size(min=3,message = "Invalid Password It Must be Of Min of 3 character")
	private String password;
	@Size(min=3,max=6,message = "Invalid Gender")
	private String gender;

	@NotBlank(message = "Write Something About Yourself")
	private String about;

//	@ImageNameValid
	private String imageName;
	
	private List<RoleDto> roles=new ArrayList<>();
}
