package com.ecom.controller;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ecom.config.CustomUserDetailsService;
import com.ecom.dto.request.JwtRequest;
import com.ecom.dto.request.RefreshTokenDto;
import com.ecom.dto.request.RegenerateJwtReqDto;
import com.ecom.dto.request.SwaggerAuthRequest;
import com.ecom.dto.request.UserReqDto;
import com.ecom.dto.response.JwtResponse;
import com.ecom.entity.CustomUserDetail;
import com.ecom.jwtConfig.JwtHelper;
import com.ecom.service.RefreshTokenService;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/auth")
@Slf4j
public class AuthController {

	@Autowired
	private JwtHelper jwtHelper;
	@Autowired
	private CustomUserDetailsService customUserDetailsService;
	@Autowired
	private ModelMapper mapper;
	@Autowired
	private AuthenticationManager authenticationManager;
	@Autowired
	private RefreshTokenService refreshTokenService;
	
	@Operation(summary = "This API is to generate JWT token WHile Login")
	@PostMapping("/generate-token")
	public ResponseEntity<JwtResponse> login(@Valid @RequestBody JwtRequest jwtRequest) throws Exception{
	
		log.info("JwtRequest{}",jwtRequest);
		this.doAuthenticate(jwtRequest.getEmail(), jwtRequest.getPassword());
		UserDetails userDetails = customUserDetailsService.loadUserByUsername(jwtRequest.getEmail());
		CustomUserDetail customUserDetail = mapper.map(userDetails, CustomUserDetail.class);
		String token=jwtHelper.generateToken(userDetails);
		
		//Generate Refresh Token
		
		RefreshTokenDto refreshTokenDto = refreshTokenService.createRefreshToken(jwtRequest.getEmail());
		JwtResponse jwtResponse=new JwtResponse();
		jwtResponse.setToken(token);
		jwtResponse.setUser(mapper.map(customUserDetail.getUser(), UserReqDto.class));
		jwtResponse.setRefreshTokenDto(refreshTokenDto);
		return ResponseEntity.ok(jwtResponse);
	}
	
	private void doAuthenticate(String email,String password) throws Exception {
		try {
			Authentication authentication= new UsernamePasswordAuthenticationToken(email, password);
			authenticationManager.authenticate(authentication);
		}catch (Exception e) {
			throw new Exception("Invalid Email and Password");
		}
	}
	@PostMapping("/regenerate-token")
	public ResponseEntity<JwtResponse> regenerateJwtTokenFromRefreshToken(@RequestBody RegenerateJwtReqDto regenrate){
		RefreshTokenDto refreshTokenDto = refreshTokenService.findByToken(regenrate.getRefreshToken());
		RefreshTokenDto verifRefreshToken = refreshTokenService.verifyRefreshToken(refreshTokenDto);
		UserDetails userFromRefreshToken = refreshTokenService.getUserFromRefreshToken(verifRefreshToken);
		CustomUserDetail customUserDetail = mapper.map(userFromRefreshToken, CustomUserDetail.class);
		String token=jwtHelper.generateToken(userFromRefreshToken);
		RefreshTokenDto newRefreshTokenDto = refreshTokenService.createRefreshToken(customUserDetail.getUsername());
		JwtResponse jwtResponse=new JwtResponse();
		jwtResponse.setToken(token);
		jwtResponse.setUser(mapper.map(customUserDetail.getUser(), UserReqDto.class));
		jwtResponse.setRefreshTokenDto(newRefreshTokenDto);
		return ResponseEntity.ok(jwtResponse);
	}
	
//	@PostMapping("/authenticate")
//    public ResponseEntity<String> authenticateUser(@RequestBody SwaggerAuthRequest authRequest) {
//        // Validate user credentials (this is just a mock example)
//        if ("user@example.com".equals(authRequest.getEmail()) && "password".equals(authRequest.getPassword())) {
//            // Generate a mock JWT token (replace with your actual JWT implementation)
//            String token = "mock-jwt-token";
//            return ResponseEntity.ok(token);
//        } else {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
//        }
//    }
}
