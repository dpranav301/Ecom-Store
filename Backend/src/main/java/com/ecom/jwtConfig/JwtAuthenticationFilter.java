package com.ecom.jwtConfig;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.ecom.config.CustomUserDetailsService;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.security.SignatureException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
//This Class Will Perform token analysis before hitting to api
@Component
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {

	@Autowired
	private JwtHelper jwtHelper;
	@Autowired
	private CustomUserDetailsService customUserDetailsService;
	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {
		log.info("doFilterInternal Method Invoked");
		//Steps
		//Step 1-> get Token from request
		String authorization=request.getHeader("Authorization");
		log.info("Authorization Header={}",authorization);
		//Step 2->Validate Token
		String username=null;
		String token=null;
		
		if(authorization!=null && authorization.startsWith("Bearer")) {
			//Then it is Ok We can Proceed Further
			
			token = authorization.substring(7);
			try {
			username=jwtHelper.getUsernameFromToken(token);
			log.info("UserName is {}",username);
			}catch (IllegalArgumentException e) {
				log.info("IileagalArgument Exception Occure While Fetching username from token"+e.getMessage());
			}catch (ExpiredJwtException e) {
				log.info("The Jwt Token is Expired"+e.getMessage());
			}catch (MalformedJwtException e) {
				log.info("Some Change has done in Jwt Token"+e.getMessage());
			}catch(SignatureException e) {
				log.info("Some modification in jWT Token is Done{}",e.getMessage());
			}
			catch (Exception e) {
				e.printStackTrace();
			}
			
		}
		
		if(username!=null && SecurityContextHolder.getContext().getAuthentication()==null) 
		{
			UserDetails userDetails = customUserDetailsService.loadUserByUsername(username);
			
			if(jwtHelper.validateToken(userDetails, token)) {
				//This block will work only when token is valid
				
				//We Need to Set the SecurityContextHolder with user for this We need Authentication object
				 
				UsernamePasswordAuthenticationToken auth=new UsernamePasswordAuthenticationToken(userDetails.getUsername(), userDetails.getPassword(),userDetails.getAuthorities());
				auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
				SecurityContextHolder.getContext().setAuthentication(auth);
				
			}
		}
		filterChain.doFilter(request, response);
	}

}
