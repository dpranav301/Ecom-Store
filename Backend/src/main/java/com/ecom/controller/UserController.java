package com.ecom.controller;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StreamUtils;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.ecom.dto.request.UserReqDto;
import com.ecom.dto.response.ApiResponseMsg;
import com.ecom.dto.response.ImageResponseDto;
import com.ecom.dto.response.PageableResponseDto;
import com.ecom.entity.User;
import com.ecom.exception.ResourceNotFoundException;
import com.ecom.repository.UserRepository;
import com.ecom.service.FileService;
import com.ecom.service.UserService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/user")
@Slf4j
@Tag(name="User Controller",description = "This Is User Controller")
public class UserController {

	@Autowired
	private UserService userService;

	@Autowired
	private FileService fileService;

	@Value("${user.profile.image.path}")
	private String userFilePath;

	@Autowired
	private UserRepository userRepo;

	// Create
	@PostMapping
	@Operation(summary = "This API is Use To CReate User")
	@ApiResponse(responseCode = "401",description = "When Something Went Wrong")
	public ResponseEntity<UserReqDto> createUser(@Valid @RequestBody UserReqDto userReqDto) {
		UserReqDto createUserDto = userService.createUser(userReqDto);
		return new ResponseEntity<>(createUserDto, HttpStatus.CREATED);
	}

	// Update
	@PutMapping("/{userId}")
	public ResponseEntity<UserReqDto> updateUser(@Valid @RequestBody UserReqDto userReqDto,
			@PathVariable("userId") String userId) {
		UserReqDto updatedUserDto = userService.updateUser(userReqDto, userId);
		return new ResponseEntity<>(updatedUserDto, HttpStatus.OK);
	}

	// Delete
	@DeleteMapping("/{userId}")
	public ResponseEntity<ApiResponseMsg> deleteUser(@PathVariable("userId") String userId) {

		User user = userRepo.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User Not Found"));
		String fullPathName = userFilePath +  user.getImageName();

//		File fileTodelete=new File(fullPathName);
//		
//		if(fileTodelete.exists()) {
//			if(fileTodelete.delete()) {
//				log.info("File Deleted Successfully");
//			}else {
//				log.info("Something Went Wrong While Deleting The File");
//			}
//		}
		Path path = Paths.get(fullPathName);
		try {
			Files.delete(path);
		} catch (IOException e) {
			log.info("Image Not Found");
		}
		userService.deleteUser(userId);
		ApiResponseMsg apiRespMsg = new ApiResponseMsg();
		apiRespMsg.setMessage("User Deleted Successfully");
		apiRespMsg.setStatus(HttpStatus.OK);
		apiRespMsg.setSuccess(true);
		return new ResponseEntity<>(apiRespMsg, HttpStatus.OK);
	}

	// Get All User
	@GetMapping
	public ResponseEntity<PageableResponseDto<UserReqDto>> getAllUser(
			@RequestParam(value = "pageNumber", defaultValue = "0", required = false) int pageNumber,
			@RequestParam(value = "pageSize", defaultValue = "5", required = false) int pageSize,
			@RequestParam(value = "sortDirection", defaultValue = "asc", required = false) String sortDirection,
			@RequestParam(value = "sortBy", defaultValue = "name", required = false) String sortBy) throws Exception {
		PageableResponseDto<UserReqDto> allUser = userService.getAllUser(pageNumber, pageSize, sortDirection, sortBy);
		return new ResponseEntity<>(allUser, HttpStatus.OK);
	}

	// Get Single User By Id
	@GetMapping("/{userId}")
	public ResponseEntity<UserReqDto> getSingleUser(@PathVariable String userId) {
		UserReqDto userById = userService.getUserById(userId);
		return new ResponseEntity<>(userById, HttpStatus.OK);
	}

	// Get user By email
	@GetMapping("/email/{email}")
	public ResponseEntity<UserReqDto> getUserByEmail(@PathVariable String email) {
		UserReqDto userByEmail = userService.getUserByEmail(email);
		return new ResponseEntity<>(userByEmail, HttpStatus.OK);
	}

	// search User
	@GetMapping("/search/{keywords}")
	public ResponseEntity<PageableResponseDto<UserReqDto>> searchUser(@RequestParam(value = "pageNumber", defaultValue = "0", required = false) int pageNumber,
			@RequestParam(value = "pageSize", defaultValue = "5", required = false) int pageSize,
			@RequestParam(value = "sortDirection", defaultValue = "asc", required = false) String sortDirection,
			@RequestParam(value = "sortBy", defaultValue = "name", required = false) String sortBy,@PathVariable String keywords) {
		PageableResponseDto<UserReqDto> userByEmail = userService.searchUser(pageNumber, pageSize,  sortDirection,  sortBy,keywords);
		return new ResponseEntity<>(userByEmail, HttpStatus.OK);
	}

	// Upload user Image
	@PostMapping("/image/{userId}")
	public ResponseEntity<ImageResponseDto> uploadUserImage(@RequestParam("userImage") MultipartFile userImage,
			@PathVariable("userId") String userId) throws IOException {

		String fileImageName = fileService.uploadFile(userImage, userFilePath);

		ImageResponseDto imgRespDto = new ImageResponseDto();
		imgRespDto.setFileName(fileImageName);
		imgRespDto.setMessage("Image Uploaded Successfully");
		imgRespDto.setStatus(HttpStatus.CREATED);
		imgRespDto.setSuccess(true);
		UserReqDto userReqDto = userService.getUserById(userId);
		userReqDto.setImageName(fileImageName);
		userService.updateUser(userReqDto, userId);
		return new ResponseEntity<>(imgRespDto, HttpStatus.CREATED);
	}

	@GetMapping("/image/{userId}")
	public void downloadUserImg(@PathVariable String userId, HttpServletResponse httpServletResponse)
			throws IOException {

		UserReqDto userById = userService.getUserById(userId);
		String fileName = userById.getImageName();

		log.info("User File Name {}", fileName);
		InputStream resource = fileService.getResource(userFilePath, fileName);

		httpServletResponse.setContentType(MediaType.ALL_VALUE);

		StreamUtils.copy(resource, httpServletResponse.getOutputStream());

	}

}
