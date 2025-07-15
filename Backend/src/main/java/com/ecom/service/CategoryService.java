package com.ecom.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.ecom.dto.request.CategoryReqDto;
import com.ecom.dto.response.PageableResponseDto;

@Service
public interface CategoryService {

	//create
	public CategoryReqDto createCategory(CategoryReqDto  categoryReqDto);
	//update
	public CategoryReqDto updateCategory(String categoryId,CategoryReqDto categoryReqDto);
	//delete
	public void deleteCategory(String categoryId);
	//get all
	public PageableResponseDto<CategoryReqDto> getAllCategories(int pageNumber,int pageSize,String sortDirection,String sortBy);
	//Get single category details
	public CategoryReqDto getCategory(String categoryId);
	
	//Search Category
	public List<CategoryReqDto> searchCategory(String categoryId);
	
	

}
