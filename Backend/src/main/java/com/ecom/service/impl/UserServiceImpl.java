package com.ecom.service.impl;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.ecom.constant.CommonConstant.RoleConstant;
import com.ecom.dto.request.OrderDto;
import com.ecom.dto.request.UserReqDto;
import com.ecom.dto.response.PageableResponseDto;
import com.ecom.entity.Role;
import com.ecom.entity.User;
import com.ecom.exception.ResourceNotFoundException;
import com.ecom.repository.RoleRepository;
import com.ecom.repository.UserRepository;
import com.ecom.service.UserService;
import com.ecom.utils.Helper;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class UserServiceImpl implements UserService {

	@Autowired
	private UserRepository userRepo;

	@Autowired
	private ModelMapper mapper;
	@Autowired
	private ObjectMapper objMapper;
	@Autowired
	private RoleRepository roleRepository;
	@Autowired
	private PasswordEncoder passwordEncoder;

	@Override
	public UserReqDto createUser(UserReqDto userDto) {

		log.info("Create User Service Invoked");
		// Generate Unique Id for user
		Role role = roleRepository.findByRoleName("ROLE_" + RoleConstant.USER)
				.orElseThrow(() -> new RuntimeException("This Role Does Not Exist"));
		Optional<User> alreadyPresentUser = userRepo.findByEmail(userDto.getEmail());
		if (alreadyPresentUser.isPresent()) {
			throw new ResourceNotFoundException("User With Given Email Id Already Present Please Choose Another Email");
		}
		String userId = UUID.randomUUID().toString();
		User user = mapper.map(userDto, User.class);
		user.setPassword(passwordEncoder.encode(userDto.getPassword()));
		user.setUserId(userId);
		user.getRoles().add(role);
		role.getUser().add(user);
		userRepo.save(user);
		return mapper.map(user, UserReqDto.class);
	}

	@Override
	public UserReqDto updateUser(UserReqDto userDto, String userId) {
		log.info("Update User Update Service Invoked");
		User userToUpdate = userRepo.findById(userId)
				.orElseThrow(() -> new ResourceNotFoundException("User Not Found"));

		userToUpdate.setAbout(userDto.getAbout());
		userToUpdate.setEmail(userDto.getEmail());
		userToUpdate.setGender(userDto.getGender());
		userToUpdate.setName(userDto.getName());
		if (!userToUpdate.getPassword().equals(userDto.getPassword())) {
			userToUpdate.setPassword(passwordEncoder.encode(userDto.getPassword()));
		}
		userToUpdate.setImageName(userDto.getImageName());

		userRepo.save(userToUpdate);
		UserReqDto mapUserDto = mapper.map(userToUpdate, UserReqDto.class);
		return mapUserDto;
	}

	@Override
	public void deleteUser(String userId) {
		log.info("Delete User Method Invoked");
		User userToDelete = userRepo.findById(userId)
				.orElseThrow(() -> new ResourceNotFoundException("User Not Found"));
		userRepo.delete(userToDelete);
	}

	@Override
	public PageableResponseDto<UserReqDto> getAllUser(int pageNumber, int pageSize, String sortDirection, String sortBy)
			throws Exception {
		log.info("Get All user Invoked");
		Sort sort = sortDirection.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
//		Pageable pageable=PageRequest.of(pageNumber-1, pageSize,sort); //Here We Set Page No from 1
		Pageable pageable = PageRequest.of(pageNumber, pageSize, sort);
		Page<User> findAll = userRepo.findAll(pageable);
		return Helper.getPageableResponse(findAll, UserReqDto.class);
	}

	@Override
	public UserReqDto getUserById(String userId) {
		log.info("Get User By Service Invoked");
		User user = userRepo.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User Not Found"));
		return mapper.map(user, UserReqDto.class);
	}

	@Override
	public UserReqDto getUserByEmail(String email) {
		log.info("get User By Email");
		User user = userRepo.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("user Not Found"));
		return mapper.map(user, UserReqDto.class);
	}

	@Override
	public PageableResponseDto<UserReqDto> searchUser(int pageNumber, int pageSize, String sortDirection, String sortBy,String keyword) {
		log.info("Search user");
		Sort sort = sortDirection.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
		PageRequest page = PageRequest.of(pageNumber, pageSize, sort);
		Page<User> listofuser = userRepo.findByNameContaining(keyword,page);
		return Helper.getPageableResponse(listofuser, UserReqDto.class);

	}

}
