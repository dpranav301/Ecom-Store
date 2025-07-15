package com.ecom.dto.response;

import org.springframework.http.HttpStatus;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ImageResponseDto {

	private String fileName;
	private String message;
	private boolean success;
	private HttpStatus status;
}
