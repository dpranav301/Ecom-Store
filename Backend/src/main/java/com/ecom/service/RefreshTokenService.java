package com.ecom.service;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import com.ecom.dto.request.RefreshTokenDto;
import com.ecom.entity.CustomUserDetail;

@Service
public interface RefreshTokenService {

	//create
	RefreshTokenDto createRefreshToken(String email);
	//findbyToken
	RefreshTokenDto findByToken(String refToken);
	//verify token
	RefreshTokenDto verifyRefreshToken(RefreshTokenDto refreshTokenDto);
	
	UserDetails getUserFromRefreshToken(RefreshTokenDto refToken);
}
