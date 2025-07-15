package com.ecom.service.impl;

import java.util.List;
import java.util.UUID;

import org.hibernate.query.SortDirection;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.ecom.dto.request.CategoryReqDto;
import com.ecom.dto.response.PageableResponseDto;
import com.ecom.entity.Category;
import com.ecom.exception.CategoryNotFoundException;
import com.ecom.exception.ResourceNotFoundException;
import com.ecom.repository.CategoryRepository;
import com.ecom.service.CategoryService;
import com.ecom.utils.Helper;

import lombok.extern.slf4j.Slf4j;
@Service
@Slf4j
public class CategoryServiceImpl implements CategoryService {

	@Autowired
	private CategoryRepository categoryRepo;
	@Autowired
	private ModelMapper modelMapper;
	@Override
	public CategoryReqDto createCategory(CategoryReqDto categoryReqDto) {
		log.info("Create Category Service Invoked");
		Category category = modelMapper.map(categoryReqDto, Category.class);
		String categoryId=UUID.randomUUID().toString();
		category.setCategoryId(categoryId);
		categoryRepo.save(category);
		return modelMapper.map(category, CategoryReqDto.class);
	}

	@Override
	public CategoryReqDto updateCategory(String categoryId, CategoryReqDto categoryReqDto) {
		log.info("Update Category Service Invoked");
		Category category = categoryRepo.findById(categoryId).orElseThrow(()->new CategoryNotFoundException("This Category Is Not Found"));
		category.setTitle(categoryReqDto.getTitle());
		category.setDescription(categoryReqDto.getDescription());
		category.setCoverImage(categoryReqDto.getCoverImage());
		categoryRepo.save(category);
		return modelMapper.map(category, CategoryReqDto.class);
	}

	@Override
	public void deleteCategory(String categoryId) {
		log.info("Delete Catgory Service Invoked");
		Category category = categoryRepo.findById(categoryId).orElseThrow(()->new CategoryNotFoundException("This Category Is Not Found"));
		categoryRepo.delete(category);
	}

	@Override
	public PageableResponseDto<CategoryReqDto> getAllCategories(int pageNumber, int pageSize, String sortDirection,
			String sortBy) {
		log.info("Get All Category Service Invoked");
		Sort sort=sortDirection.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
		PageRequest page = PageRequest.of(pageNumber, pageSize, sort);
		Page<Category> findAll = categoryRepo.findAll(page);
		return Helper.getPageableResponse(findAll, CategoryReqDto.class);
	}

	@Override
	public CategoryReqDto getCategory(String categoryId) {
		log.info("Find Category By Id Service Invoked");
		Category category = categoryRepo.findById(categoryId).orElseThrow(()->new ResourceNotFoundException("Category Not Found"));
		
		return modelMapper.map(category, CategoryReqDto.class);
	}

	@Override
	public List<CategoryReqDto> searchCategory(String keyword) {
		List<Category> listOfCategory = categoryRepo.findByTitleContaining(keyword);
		List<CategoryReqDto> list = listOfCategory.stream().map(cat->
			modelMapper.map(cat,CategoryReqDto.class)
		).toList();
		return list;
	}

}
