package com.ecom.service;

import java.io.IOException;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.ecom.dto.request.ProductDto;
import com.ecom.dto.response.PageableResponseDto;
@Service
public interface ProductService {

	//create
	ProductDto create(ProductDto productDto,MultipartFile file) throws IOException;
	//update
	ProductDto update(String productId,ProductDto productDto);
	//delete
	void delete(String productId);
	//getAll
	PageableResponseDto<ProductDto> getAllProduct(int pageNumber, int pageSize, String sortDirection,String sortBy);
	//getSingle
	ProductDto getSingleProduct(String productId);
	//getAll : live
	PageableResponseDto<ProductDto> getAllLiveProduct(int pageNumber, int pageSize, String sortDirection,String sortBy);
	//search product
	PageableResponseDto<ProductDto> searchProduct(int pageNumber, int pageSize, String sortDirection,String sortBy,String keyword);
	
	
	//create Product With Catgeory
	ProductDto createProductWithCategory(String categoryId,MultipartFile file,ProductDto productDto) throws IOException;
	//Add Category To Existing Product
	ProductDto addCategoryToExistingProduct(String productId,String categoryId);
	
	//Fetch All Products From One Category
	PageableResponseDto<ProductDto> getAllProductsFromCategory(int pageNumber, int pageSize, String sortDirection,String sortBy,String categoryId);
}
