package com.ecom.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.ecom.entity.Category;
import com.ecom.entity.Product;

public interface ProductRepository extends JpaRepository<Product,String> {

	Page<Product> findByTitleContaining(String title,Pageable pageable);
	
	Page<Product> findByLiveTrue(Pageable pageable);
	
	Page<Product> findByCategory(Category category,Pageable pageable);
}
