package com.ecom.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ecom.entity.Cart;
import com.ecom.entity.User;

@Repository
public interface CartRepository extends JpaRepository<Cart, String> {

	Optional<Cart> findByUser(User user);
}
