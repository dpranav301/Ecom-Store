package com.ecom.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ecom.entity.User;
@Repository
public interface UserRepository extends JpaRepository<User, String> {

	public Optional<User> findByEmail(String email);
	
	 Page<User> findByNameContaining(String keyword,Pageable page); //This is behaving like LIKE query
}
