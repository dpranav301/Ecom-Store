package com.ecom.service;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import com.ecom.dto.request.UserReqDto;
import com.ecom.entity.Role;
import com.ecom.entity.User;
import com.ecom.repository.RoleRepository;
import com.ecom.repository.UserRepository;

import lombok.extern.slf4j.Slf4j;

@SpringBootTest
@Slf4j
class UserServiceTest {

	@MockBean
	private UserRepository userRepository;

	@MockBean
	private RoleRepository roleRepository;

	@Autowired
	private UserService userService;

	@Autowired
	private ModelMapper mapper;

	User user;

	Role role;

	String roleName;

	@BeforeEach
	public void init() {
		role = new Role();
		role.setRoleId("abc");
		role.setRoleName("ROLE_ADMIN");

		user = User.builder().userId("1").about("This is Test User").email("pranav@Test.com").gender("Male")
				.name("Pranav").password("Test").imageName("abc.png").roles(List.of(role)).build();
		
		roleName = "ROLE_USER";
	}

	// create User Service mocking
	@Test
	@Disabled
	void createUserTest() {

		
		Mockito.when(userRepository.save(Mockito.any())).thenReturn(user);

		Mockito.when(roleRepository.findByRoleName(Mockito.anyString())).thenReturn(Optional.of(role));

		UserReqDto createdUserActual = userService.createUser(mapper.map(user, UserReqDto.class));

		Assertions.assertNotNull(createdUserActual);
	}
	
	//update user 
	@Test
	@DisplayName("updateUserTest")
	@Disabled
	void updateUserTest() {
		Mockito.when(userRepository.findById(Mockito.anyString())).thenReturn(Optional.of(user));
		Mockito.when(userRepository.save(Mockito.any())).thenReturn(user);
		
		UserReqDto actualUpdatedUser = userService.updateUser(mapper.map(user, UserReqDto.class), roleName);
		Assertions.assertNotNull(actualUpdatedUser);
	}
}
