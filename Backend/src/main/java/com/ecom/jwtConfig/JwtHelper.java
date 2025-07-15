package com.ecom.jwtConfig;

import java.time.Instant;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;

//This Class is Use To Perform JWT Releated Operation like (create,fetch Data from JWT etc)
@Component
@Slf4j
public class JwtHelper {

	// Validity of Token
	@Value("${token.validity}")
    public String TOKEN_VALIDITY ; // in milliseconds

    // Secret Key to Generate Token
    @Value("${security.secret}")
    private  String SECRET_KEY;


    // Method to fetch username from JWT token
    public String getUsernameFromToken(String token) {
        return getClaimFromToken(token, Claims::getSubject);
    }

    // This method is to get specific claims from JWT token
    public <T> T getClaimFromToken(String token, Function<Claims, T> claimResolver) {
        final Claims claims = getAllClaimsFromToken(token);
        return claimResolver.apply(claims);
    }

    // For retrieving all claims from the token
    public Claims getAllClaimsFromToken(String token) {
    return Jwts.parser()
    		.verifyWith(generateKey())
    		.build()
    		.parseSignedClaims(token)
    		.getPayload();
    	
    	
    }

    // Check if token has expired
    public Boolean isTokenExpired(String token) {
        final Date expiration = getExpirationDateFromToken(token);
        return expiration.before(new Date());
    }

    // This method is to get the expiration date from the token
    private Date getExpirationDateFromToken(String token) {
        return getClaimFromToken(token, Claims::getExpiration);
    }
	
	
	//Method To Generate Token
	public String generateToken(UserDetails userDetails) {
		Map<String, Object> claims=new HashMap<>();
		return doGenerateToken(claims,userDetails.getUsername());
	}
	
	//Method To generate Token
	private String doGenerateToken(Map<String,Object> claims,String userName) {
//		log.info("Secret is {}",SECRET_KEY);
		return Jwts.builder()
				.subject(userName)
				.issuedAt(Date.from(Instant.now()))
				.expiration(new Date(Long.valueOf(TOKEN_VALIDITY)+System.currentTimeMillis()))
				.signWith(generateKey())
				.claims(claims)
				.compact();
	}
	
	private SecretKey generateKey() {
		byte[] decode = Base64.getDecoder().decode(SECRET_KEY);
		return Keys.hmacShaKeyFor(decode);
	}
	
	//method to validate a token
	
	public Boolean validateToken(UserDetails userDetail,String token) {
		boolean isTokenExpire=this.isTokenExpired(token);
		String userNameFromToken=this.getUsernameFromToken(token);
		String userNameFromUserDetail=userDetail.getUsername();
		
		boolean isUserNameMatch=userNameFromToken.equals(userNameFromUserDetail);
		if(!isTokenExpire && isUserNameMatch) {
			return true;
		}else {
			return false;
		}
	}
}
