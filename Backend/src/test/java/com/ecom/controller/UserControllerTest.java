package com.ecom.controller;

import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import com.ecom.dto.request.UserReqDto;
import com.ecom.entity.Role;
import com.ecom.entity.User;
import com.ecom.service.UserService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

@SpringBootTest
@AutoConfigureMockMvc
class UserControllerTest {

	@MockBean
	private UserService userService;
	
	private Role role;
	
	private User user;
	
	private String roleName;
	
	@Autowired
	private ModelMapper mapper;
	
	@Autowired
	private MockMvc mockMvc;
	@Autowired
	private ObjectMapper objectMapper;
	
	@BeforeEach
	public void init() {
		role = new Role();
		role.setRoleId("abc");
		role.setRoleName("ROLE_ADMIN");

		user = User.builder().userId("1").about("This is Test User").email("pranav@Test.com").gender("Male")
				.name("Pran").password("Test").imageName("abc.png").roles(List.of(role)).build();
		
		roleName = "ROLE_USER";
	}
	@Test
	@Disabled
	void createUserTest() throws JsonProcessingException, Exception {
		UserReqDto userReqDto=mapper.map(user, UserReqDto.class);
		
		Mockito.when(userService.createUser(Mockito.any())).thenReturn(userReqDto);
		
		//actual Request for api
		
		mockMvc.perform(
				MockMvcRequestBuilders.post("/user")
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(userReqDto))
				.accept(MediaType.APPLICATION_JSON)
				).andDo(print())
		.andExpect(status().isCreated())
		.andExpect(jsonPath("$.name").exists());
	}
	
	@Test
	void updateUser() throws JsonProcessingException, Exception {
		
		UserReqDto userReqDto=new UserReqDto();
		userReqDto.setAbout("Updated About");
		userReqDto.setEmail("Updated@Email.com");
		userReqDto.setGender("Update");
		userReqDto.setImageName("update.png");
		userReqDto.setName("Update Name");
		userReqDto.setUserId("abc");
		userReqDto.setPassword("Updated Password");
		
		String userId="123";
		Mockito.when(userService.updateUser(userReqDto,userId)).thenReturn(userReqDto);
		mockMvc.perform(
				MockMvcRequestBuilders.put("/user/"+userId)
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(userReqDto))
				.header(HttpHeaders.AUTHORIZATION, "Bearer "+"eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJqb2huZG9lQGV4YW1wbGUuY29tIiwiaWF0IjoxNzM2NzA1Mzk1LCJleHAiOjE3MzY3MDU5OTV9.uv9cr8T7kXo2a8w0eWI1DdNFCZeX9lnjftXsyGMIE74blXD7UICepK_eTK224I4cgyjDR9ZuTOr2BI3VFdYMwA")
				.accept(MediaType.APPLICATION_JSON)
				).andDo(print())
		.andExpect(status().isOk())
		.andExpect(jsonPath("$.name").exists());
	}
}
