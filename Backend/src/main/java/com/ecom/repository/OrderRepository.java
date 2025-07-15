package com.ecom.repository;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ecom.entity.Order;
import com.ecom.entity.User;

@Repository
public interface OrderRepository extends JpaRepository<Order, String>{

	Page<Order> findByUser(User user,Pageable pageable);
	Page<Order> findByOrderIdContaining(String orderId,Pageable pageable);
}
