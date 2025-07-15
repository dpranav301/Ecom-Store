package com.ecom.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.ecom.entity.CustomUserDetail;
import com.ecom.entity.User;
import com.ecom.repository.UserRepository;
@Service
public class CustomUserDetailsService implements UserDetailsService{

	@Autowired
	private UserRepository userRepository;
	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		User findByEmail = userRepository.findByEmail(username).orElseThrow(()->new RuntimeException("User With Given Email Not Found"));
		CustomUserDetail customUserDetail=new CustomUserDetail(findByEmail);
		return customUserDetail;
	}

}
