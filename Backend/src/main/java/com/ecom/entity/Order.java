package com.ecom.entity;

import java.time.LocalDateTime;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name="orders")
public class Order {

	@Id
	private String orderId;
	private String orderStatus; //PENDING,DELIVERED,DISPATCHED
	private boolean paymentStatus; //true==paid false=not paid
	private double orderAmount;
	@Column(length = 1000)
	private String billingAddress;
	private String billingPhone;
	private String billingName;
	@CreationTimestamp
	private LocalDateTime orderedDate;
	private LocalDateTime deliveredDate;
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name="user_Id")
	private User user;
	@OneToMany(fetch = FetchType.EAGER,cascade = CascadeType.ALL,mappedBy = "order",orphanRemoval = true)
	private List<OrderItem> orderItem;
}
