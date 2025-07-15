package com.ecom.service.impl;

import java.time.Instant;
import java.util.UUID;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import com.ecom.config.CustomUserDetailsService;
import com.ecom.dto.request.RefreshTokenDto;
import com.ecom.entity.CustomUserDetail;
import com.ecom.entity.RefreshToken;
import com.ecom.entity.User;
import com.ecom.exception.ResourceNotFoundException;
import com.ecom.repository.RefreshTokenRepository;
import com.ecom.repository.UserRepository;
import com.ecom.service.RefreshTokenService;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class RefreshTokenServiceImpl implements RefreshTokenService {

	@Autowired
	private UserRepository userRepo;
	@Autowired
	private RefreshTokenRepository refreshTokenRepository;
	@Value("${refresh.token.validity}")
	private String refreshTokenValidity;
	@Autowired
	private ModelMapper mapper;
	
	@Autowired
	private CustomUserDetailsService customUserDetailsService;

	@Override
	public RefreshTokenDto createRefreshToken(String email) {
		User user = userRepo.findByEmail(email)
				.orElseThrow(() -> new ResourceNotFoundException("User With Username Does not Exist"));
		RefreshToken findTokenByUser = refreshTokenRepository.findByUser(user);
		if (findTokenByUser != null) {

			log.info("Refresh Token Not Expired");
			findTokenByUser.setRefToken(UUID.randomUUID().toString());
			findTokenByUser.setExpiryDate(Instant.now().plusSeconds(Long.valueOf(refreshTokenValidity)));
			refreshTokenRepository.save(findTokenByUser);
			return mapper.map(findTokenByUser, RefreshTokenDto.class);

		} else {
			RefreshToken refreshToken = new RefreshToken();
			refreshToken.setUser(user);
			refreshToken.setRefToken(UUID.randomUUID().toString());
			refreshToken.setExpiryDate(Instant.now().plusSeconds(Long.valueOf(refreshTokenValidity))); // Its Expiry is
																										// Always
																										// Greater than
																										// JWT Token

			refreshTokenRepository.save(refreshToken);
			log.info("Refresh Token Generated and Saved Successfully");
			return mapper.map(refreshToken, RefreshTokenDto.class);
		}

	}

	@Override
	public RefreshTokenDto findByToken(String refToken) {
		log.info("Service To Find User By Token Invoked");
		RefreshToken refreshToken = refreshTokenRepository.findByRefToken(refToken)
				.orElseThrow(() -> new ResourceNotFoundException("Refresh Token Is Invalid"));
		return mapper.map(refreshToken, RefreshTokenDto.class);
	}

	@Override
	public RefreshTokenDto verifyRefreshToken(RefreshTokenDto refreshTokenDto) {
		log.info("Service To Verify RefreshToken");
		RefreshToken refreshToken = refreshTokenRepository.findByRefToken(refreshTokenDto.getRefToken())
				.orElseThrow(() -> new ResourceNotFoundException("Refresh Token Is Invalid"));
		Instant expiryDate = refreshToken.getExpiryDate();

		if (expiryDate.isBefore(Instant.now())) {
			refreshTokenRepository.delete(refreshToken); // if refresh token expire then remove the entry from db
			throw new RuntimeException("Refresh Token Expired");

		}

		return mapper.map(refreshToken, RefreshTokenDto.class);
	}

	@Override
	public UserDetails getUserFromRefreshToken(RefreshTokenDto refToken) {
		RefreshToken refreshToken = refreshTokenRepository.findByRefToken(refToken.getRefToken()).orElseThrow(()->new ResourceNotFoundException("Refresh Token is Invalid"));
		User user = refreshToken.getUser();
		String userEmail=user.getEmail();
		UserDetails loadUserByUsername = customUserDetailsService.loadUserByUsername(userEmail);
		return  loadUserByUsername;
	}

}
