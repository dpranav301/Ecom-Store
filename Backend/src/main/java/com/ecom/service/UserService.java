package com.ecom.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.ecom.dto.request.UserReqDto;
import com.ecom.dto.response.PageableResponseDto;

@Service
public interface UserService {

	//create User
	public UserReqDto createUser(UserReqDto userDto);
	//update
	public UserReqDto updateUser(UserReqDto userDto,String userId);
	//Delete
	public void deleteUser(String userId);
	//get All User
	public PageableResponseDto<UserReqDto> getAllUser(int pageNumber,int pageSize,String sortDirection,String sortBy) throws Exception;
	//get single user by id
	
	public UserReqDto getUserById(String userId);
	//get single user by email
	public UserReqDto getUserByEmail(String email);
	//search user
	public PageableResponseDto<UserReqDto> searchUser(int pageNumber, int pageSize, String sortDirection, String sortBy,String keyword);
	
}
