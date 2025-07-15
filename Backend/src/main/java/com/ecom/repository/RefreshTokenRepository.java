package com.ecom.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ecom.entity.RefreshToken;
import com.ecom.entity.User;
@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Integer> {

	Optional<RefreshToken> findByRefToken(String refToken);
	
	Optional<RefreshToken> findByRefTokenAndUser(String refToken,User user);
	
	RefreshToken findByUser(User user);
}
