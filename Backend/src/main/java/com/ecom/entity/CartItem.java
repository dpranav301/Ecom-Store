package com.ecom.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name="cart_Items")
public class CartItem {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long cartItemId;
	@ManyToOne
	@JoinColumn(name="product_Id")
	private Product product;
	private long quantity;
	private double totalPrice;
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name="cart_Id")
	private Cart cart;
}
