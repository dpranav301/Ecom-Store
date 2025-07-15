package com.ecom.dto.response;

import com.ecom.dto.request.RefreshTokenDto;
import com.ecom.dto.request.UserReqDto;

import lombok.Data;

@Data
public class JwtResponse {

	private String token;
	private UserReqDto user;
	private RefreshTokenDto refreshTokenDto;
}
