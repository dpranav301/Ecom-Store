package com.ecom.dto.request;

import java.time.Instant;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RefreshTokenDto {

	private Integer id;
	private String refToken;
	private Instant expiryDate;
//	private UserReqDto user;
}
