package com.ecom.config;

import java.io.IOException;
import java.net.URI;
import java.util.List;

import org.apache.tomcat.util.file.ConfigurationSource;
import org.apache.tomcat.util.file.ConfigurationSource.Resource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;

import com.ecom.constant.CommonConstant.RoleConstant;
import com.ecom.jwtConfig.JwtAuthenticationEntryPoint;
import com.ecom.jwtConfig.JwtAuthenticationFilter;

import jakarta.servlet.http.HttpServletRequest;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {
	@Autowired
	private JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;
	@Autowired
	private JwtAuthenticationFilter jwtAuthenticationFilter;
	private static final String ADMIN="ADMIN";
	private static final String USER="USER";

	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Bean
	public AuthenticationManager authenticationManager(AuthenticationConfiguration builder) throws Exception {
		return builder.getAuthenticationManager();
	}
	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {

//		httpSecurity.cors(httpSecurityCorsConfigurer->httpSecurityCorsConfigurer.disable());
		
		httpSecurity.cors(httpSecurityCorsConfigurer->httpSecurityCorsConfigurer.configurationSource(new CorsConfigurationSource() {
			
			@Override
			public CorsConfiguration getCorsConfiguration(HttpServletRequest request) {
				CorsConfiguration corsConfiguration=new CorsConfiguration();
				corsConfiguration.addAllowedOriginPattern("*"); //All Origins Allowed
//				corsConfiguration.setAllowedMethods(List.of("POST","GET"));
				corsConfiguration.setAllowedMethods(List.of("*")); //All Methods Allowed
				corsConfiguration.setAllowedHeaders(List.of("*"));
				corsConfiguration.setMaxAge(120L);
				corsConfiguration.setAllowCredentials(true);
				return corsConfiguration;
			}
		 
		}));
		httpSecurity.csrf(httpSecurityCsrfConfigurer->httpSecurityCsrfConfigurer.disable());
		httpSecurity.authorizeHttpRequests(request -> 
	    request.requestMatchers(HttpMethod.GET, "/products/**", "/category/**").permitAll()
	        .requestMatchers("/products/**", "/category/**").hasRole(RoleConstant.ADMIN)
	        .requestMatchers(HttpMethod.POST, "/user").permitAll()
	        .requestMatchers(HttpMethod.PUT, "/user").permitAll()
	        .requestMatchers(HttpMethod.GET,"/user/**").permitAll()
//	        .requestMatchers(HttpMethod.GET, "/user/**", "/user/email/**" ).hasAnyRole(RoleConstant.ADMIN, RoleConstant.USER)
	        .requestMatchers(HttpMethod.DELETE, "/user").hasRole(RoleConstant.ADMIN)
	        .requestMatchers(HttpMethod.POST, "/auth/**").permitAll()
	        .requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html","/v3/api-docs.yaml/**").permitAll()
	        .anyRequest().authenticated()
	);
//		httpSecurity.formLogin(Customizer.withDefaults());
//		httpSecurity.httpBasic(Customizer.withDefaults());
		httpSecurity.exceptionHandling(ex->ex.authenticationEntryPoint(jwtAuthenticationEntryPoint));
		httpSecurity.sessionManagement(session->session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
		httpSecurity.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
		return httpSecurity.build();
	}
}
