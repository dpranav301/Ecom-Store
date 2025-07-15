package com.ecom.entity;

import java.time.LocalDateTime;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name="cart")
public class Cart {

	@Id
	private String cartId;
	@CreationTimestamp
	private LocalDateTime createdAt=LocalDateTime.now();
	@OneToOne
	@JoinColumn(name="user_Id")
	private User user;
	@OneToMany(cascade = CascadeType.ALL,fetch = FetchType.EAGER,mappedBy = "cart",orphanRemoval = true)
	private List<CartItem> cartItem;
	
}
