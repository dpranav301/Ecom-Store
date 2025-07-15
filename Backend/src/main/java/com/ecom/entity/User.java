package com.ecom.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name="user_tbl")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class User {

	@Id
//	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="user_Id")
	private String userId;
	@Column(name="user_name")
	private String name;
	@Column(name="user_email",unique = true)
	private String email;
	@Column(name="user_pass")
	private String password;
	private String gender;
	@Column(length = 1000)
	private String about;
	@Column(name="user_img_name")
	private String imageName;
	@CreationTimestamp
	private LocalDateTime createdAt;
	@OneToMany(fetch = FetchType.LAZY,mappedBy = "user")
	private List<Order> order;
	@ManyToMany(cascade = CascadeType.ALL,fetch = FetchType.EAGER,mappedBy = "user")
	private List<Role> roles=new ArrayList<>();
}
