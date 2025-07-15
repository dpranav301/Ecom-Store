package com.ecom.controller;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StreamUtils;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.ecom.dto.request.ProductDto;
import com.ecom.dto.response.ApiResponseMsg;
import com.ecom.dto.response.ImageResponseDto;
import com.ecom.dto.response.PageableResponseDto;
import com.ecom.entity.Product;
import com.ecom.exception.ResourceNotFoundException;
import com.ecom.repository.ProductRepository;
import com.ecom.service.FileService;
import com.ecom.service.ProductService;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/products")
@Slf4j
public class ProductController {

	@Autowired
	private ProductService productService;

	@Autowired
	private FileService fileService;

	@Value("${product.image.path}")
	private String productImgPath;
	
	@Autowired
	private ProductRepository productRepository;

	// create
	@PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<ProductDto> createProduct(@RequestParam("productImageFile") MultipartFile productImageFile, @Valid @ModelAttribute ProductDto productDto ) throws IOException {
		ProductDto product = productService.create(productDto,productImageFile);
		return new ResponseEntity<>(product, HttpStatus.OK);
	}

	// update
	@PutMapping("/{productId}")
	public ResponseEntity<ProductDto> updateProduct(@RequestBody ProductDto productDto,
			@PathVariable String productId) {
		ProductDto updatedProductDto = productService.update(productId, productDto);
		return new ResponseEntity<>(updatedProductDto, HttpStatus.OK);
	}

	// delete
	@DeleteMapping("/{productId}")
	public ResponseEntity<ApiResponseMsg> deleteProduct(@PathVariable String productId) {
		Product product = productRepository.findById(productId).orElseThrow(()->new ResourceNotFoundException("Product With Given Id Not Found"));
		String fullPathName = productImgPath  + product.getProductImage();
		Path path = Paths.get(fullPathName);
		try {
			Files.delete(path);
		} catch (IOException e) {
			log.info("Image Not Found");
		}
		productService.delete(productId);
		ApiResponseMsg apiResponseMsg = new ApiResponseMsg();
		apiResponseMsg.setMessage("Product Deleted Successfully");
		apiResponseMsg.setStatus(HttpStatus.OK);
		apiResponseMsg.setSuccess(true);
		return new ResponseEntity<>(apiResponseMsg, HttpStatus.OK);

	}

	// get single
	@GetMapping("/{productId}")
	public ResponseEntity<ProductDto> getSingleProduct(@PathVariable String productId) {
		return new ResponseEntity<>(productService.getSingleProduct(productId), HttpStatus.OK);
	}

	// get all
	@GetMapping
	public ResponseEntity<PageableResponseDto<ProductDto>> getAllProduct(
			@RequestParam(value = "pageNumber", defaultValue = "0", required = false) int pageNumber,
			@RequestParam(value = "pageSize", defaultValue = "5", required = false) int pageSize,
			@RequestParam(value = "sortDirection", defaultValue = "asc", required = false) String sortDirection,
			@RequestParam(value = "sortBy", defaultValue = "title", required = false) String sortBy) {

		PageableResponseDto<ProductDto> allProduct = productService.getAllProduct(pageNumber, pageSize, sortDirection,
				sortBy);
		return new ResponseEntity<>(allProduct, HttpStatus.OK);
	}

	// get all live
	@GetMapping("/live")
	public ResponseEntity<PageableResponseDto<ProductDto>> getAllLiveProduct(
			@RequestParam(value = "pageNumber", defaultValue = "0", required = false) int pageNumber,
			@RequestParam(value = "pageSize", defaultValue = "5", required = false) int pageSize,
			@RequestParam(value = "sortDirection", defaultValue = "asc", required = false) String sortDirection,
			@RequestParam(value = "sortBy", defaultValue = "title", required = false) String sortBy) {
		PageableResponseDto<ProductDto> allLiveProduct = productService.getAllLiveProduct(pageNumber, pageSize,
				sortDirection, sortBy);
		return new ResponseEntity<>(allLiveProduct, HttpStatus.OK);
	}

	// search
	@GetMapping("/search/{keyword}")
	public ResponseEntity<PageableResponseDto<ProductDto>> searchProduct(
			@RequestParam(value = "pageNumber", defaultValue = "0", required = false) int pageNumber,
			@RequestParam(value = "pageSize", defaultValue = "5", required = false) int pageSize,
			@RequestParam(value = "sortDirection", defaultValue = "asc", required = false) String sortDirection,
			@RequestParam(value = "sortBy", defaultValue = "title", required = false) String sortBy,
			@PathVariable String keyword) {
		PageableResponseDto<ProductDto> searchProduct = productService.searchProduct(pageNumber, pageSize,
				sortDirection, sortBy, keyword);
		return new ResponseEntity<>(searchProduct, HttpStatus.OK);
	}

	// Upload Product Image
	@PostMapping("/image/{productId}")
	public ResponseEntity<ImageResponseDto> uploadProductImage(@RequestParam("productImage") MultipartFile productImage,
			@PathVariable("productId") String productId) throws IOException {

		String fileImageName = fileService.uploadFile(productImage, productImgPath);

		ImageResponseDto imgRespDto = new ImageResponseDto();
		imgRespDto.setFileName(fileImageName);
		imgRespDto.setMessage("Image Uploaded Successfully");
		imgRespDto.setStatus(HttpStatus.CREATED);
		imgRespDto.setSuccess(true);
		ProductDto productDto = productService.getSingleProduct(productId);
		productDto.setProductImage(fileImageName);
		productService.update(productId, productDto);
		return new ResponseEntity<>(imgRespDto, HttpStatus.CREATED);
	}

	@GetMapping("/image/{productId}")
	public void downloadCategoryImg(@PathVariable String productId, HttpServletResponse httpServletResponse)
			throws IOException {

		ProductDto productById = productService.getSingleProduct(productId);
		String fileName = productById.getProductImage();

		log.info("User File Name {}", fileName);
		InputStream resource = fileService.getResource(productImgPath, fileName);

		httpServletResponse.setContentType(MediaType.ALL_VALUE);

		StreamUtils.copy(resource, httpServletResponse.getOutputStream());

	}
	
	
	
}
