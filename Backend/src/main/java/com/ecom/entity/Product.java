package com.ecom.entity;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name="Product")
public class Product {

	@Id
	private String productId;
	private String title;
	@Column(name="description",length = 10000)
	private String description;
	@Column(name="price")
	private double price;
	private long quantity;
	@CreationTimestamp
	private LocalDateTime createdAt=LocalDateTime.now();
	private boolean live;
	private boolean stock;
	private double discountedPrice;
	
	private String productImage;
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name="category_id")
	private Category category;
}
