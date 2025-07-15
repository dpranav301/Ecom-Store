package com.ecom.service.impl;

import java.io.IOException;
import java.util.UUID;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.ecom.dto.request.ProductDto;
import com.ecom.dto.response.PageableResponseDto;
import com.ecom.entity.Category;
import com.ecom.entity.Product;
import com.ecom.exception.ResourceNotFoundException;
import com.ecom.repository.CategoryRepository;
import com.ecom.repository.ProductRepository;
import com.ecom.service.ProductService;
import com.ecom.utils.Helper;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class ProductServiceImpl implements ProductService {

	@Autowired
	private ProductRepository productRepo;

	@Autowired
	private ModelMapper modelMapper;
	@Autowired
	private FileServiceImpl fileServiceImpl;
	@Value("${product.image.path}")
	private String productImgPath;
	@Autowired
	CategoryRepository categoryRepository;

	@Override
	public ProductDto create(ProductDto productDto,MultipartFile file) throws IOException {
		log.info("Create Product Service Invoked");
		Product product = modelMapper.map(productDto, Product.class);
		String productId = UUID.randomUUID().toString();
		String fileName = fileServiceImpl.uploadFile(file, productImgPath);
		product.setProductImage(fileName);
		product.setProductId(productId);
		productRepo.save(product);
		return modelMapper.map(product, ProductDto.class);
	}

	@Override
	public ProductDto update(String productId, ProductDto productDto) {
		log.info("Update Product Service");
		Product product = productRepo.findById(productId)
				.orElseThrow(() -> new ResourceNotFoundException("Product With Given Id Not Found"));
		product.setTitle(productDto.getTitle());
		product.setDescription(productDto.getDescription());
		product.setDiscountedPrice(productDto.getDiscountedPrice());
		product.setLive(productDto.isLive());
		product.setPrice(productDto.getPrice());
		product.setQuantity(productDto.getQuantity());
		product.setStock(productDto.isStock());
		product.setProductImage(productDto.getProductImage());
		productRepo.save(product);
		return modelMapper.map(product, ProductDto.class);
	}

	@Override
	public void delete(String productId) {
		Product product = productRepo.findById(productId)
				.orElseThrow(() -> new ResourceNotFoundException("Product With Given Id Not Found"));
		productRepo.delete(product);

	}

	@Override
	public PageableResponseDto<ProductDto> getAllProduct(int pageNumber, int pageSize, String sortDirection,
			String sortBy) {
		Sort sort = sortDirection.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
		PageRequest page = PageRequest.of(pageNumber, pageSize, sort);
		Page<Product> allProduct = productRepo.findAll(page);
		return Helper.getPageableResponse(allProduct, ProductDto.class);

	}

	@Override
	public ProductDto getSingleProduct(String productId) {
		Product product = productRepo.findById(productId)
				.orElseThrow(() -> new ResourceNotFoundException("Product With Given Id Not Found"));
		return modelMapper.map(product, ProductDto.class);
	}

	@Override
	public PageableResponseDto<ProductDto> getAllLiveProduct(int pageNumber, int pageSize, String sortDirection,
			String sortBy) {
		Sort sort = sortDirection.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
		PageRequest page = PageRequest.of(pageNumber, pageSize, sort);
		Page<Product> allLiveProduct = productRepo.findByLiveTrue(page);
		return Helper.getPageableResponse(allLiveProduct, ProductDto.class);
	}

	@Override
	public PageableResponseDto<ProductDto> searchProduct(int pageNumber, int pageSize, String sortDirection,
			String sortBy, String keyword) {
		Sort sort = sortDirection.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
		PageRequest page = PageRequest.of(pageNumber, pageSize, sort);
		Page<Product> productByKeyword = productRepo.findByTitleContaining(keyword, page);
		return Helper.getPageableResponse(productByKeyword, ProductDto.class);
	}

	@Override
	public ProductDto createProductWithCategory(String categoryId,MultipartFile file ,ProductDto productDto) throws IOException {
		log.info("Creating Product With Catgeory Service Invoked");
		Category category = categoryRepository.findById(categoryId)
				.orElseThrow(() -> new ResourceNotFoundException("Category With Given id Not Found"));
		String fileName = fileServiceImpl.uploadFile(file, productImgPath);
		Product product = modelMapper.map(productDto, Product.class);
		String productId = UUID.randomUUID().toString();
		product.setProductId(productId);
		product.setCategory(category);
		product.setProductImage(fileName);
		product = productRepo.save(product);
		return modelMapper.map(product, ProductDto.class);
	}

	@Override
	public ProductDto addCategoryToExistingProduct(String productId, String categoryId) {
		log.info("Add Category To Existing Product");
		Category category = categoryRepository.findById(categoryId)
				.orElseThrow(() -> new ResourceNotFoundException("Category With Given id Not Found"));
		Product singleProd = productRepo.findById(productId)
				.orElseThrow(() -> new ResourceNotFoundException("Product With Given Id Not Found"));
		singleProd.setCategory(category);
		singleProd = productRepo.save(singleProd);
		return modelMapper.map(singleProd, ProductDto.class);
	}

	@Override
	public PageableResponseDto<ProductDto> getAllProductsFromCategory(int pageNumber, int pageSize,
			String sortDirection, String sortBy, String categoryId) {
		Category category = categoryRepository.findById(categoryId)
				.orElseThrow(() -> new ResourceNotFoundException("Category With Given id Not Found"));
		Sort sort = sortDirection.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
		PageRequest page = PageRequest.of(pageNumber, pageSize, sort);
		Page<Product> findProductByCategory = productRepo.findByCategory(category, page);
		return Helper.getPageableResponse(findProductByCategory, ProductDto.class);
	}

}
