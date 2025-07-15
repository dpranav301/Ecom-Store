package com.ecom.controller;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

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

import com.ecom.dto.request.CategoryReqDto;
import com.ecom.dto.request.ProductDto;
import com.ecom.dto.response.ApiResponseMsg;
import com.ecom.dto.response.ImageResponseDto;
import com.ecom.dto.response.PageableResponseDto;
import com.ecom.entity.Category;
import com.ecom.exception.ResourceNotFoundException;
import com.ecom.repository.CategoryRepository;
import com.ecom.service.CategoryService;
import com.ecom.service.FileService;
import com.ecom.service.ProductService;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/category")
@Slf4j
public class CategoryController {

	@Autowired
	private CategoryService categoryService;
	
	@Autowired
	private FileService fileService;
	
	@Value("${category.image.path}")
	private String categoryImgFilePath;
	
	@Autowired
	private CategoryRepository categoryRepository;
	
	@Autowired
	private ProductService productService;
	
	@PostMapping
	public ResponseEntity<CategoryReqDto> createCategory(@Valid @RequestBody CategoryReqDto categoryReqDto) {
		CategoryReqDto createCategoryDto = categoryService.createCategory(categoryReqDto);
		return new ResponseEntity<>(createCategoryDto, HttpStatus.CREATED);
	}

	// Update
	@PutMapping("/{categoryId}")
	public ResponseEntity<CategoryReqDto> updateCategory(@Valid @RequestBody CategoryReqDto categoryReqDto,
			@PathVariable("categoryId") String categoryId) {
		CategoryReqDto updatedCategoryDto = categoryService.updateCategory(categoryId,categoryReqDto);
		return new ResponseEntity<>(updatedCategoryDto, HttpStatus.OK);
	}
	
	//Delete
	@DeleteMapping("/{categoryId}")
	public ResponseEntity<ApiResponseMsg> deleteCategory(@PathVariable("categoryId") String categoryId) {

		Category category = categoryRepository.findById(categoryId).orElseThrow(() -> new ResourceNotFoundException("Catgeory Not Found"));
		String fullPathName = categoryImgFilePath  + category.getCoverImage();

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
		categoryService.deleteCategory(categoryId);
		ApiResponseMsg apiRespMsg = new ApiResponseMsg();
		apiRespMsg.setMessage("Catgory Deleted Successfully");
		apiRespMsg.setStatus(HttpStatus.OK);
		apiRespMsg.setSuccess(true);
		return new ResponseEntity<>(apiRespMsg, HttpStatus.OK);
	}
	
	//Get All
	@GetMapping
	public ResponseEntity<PageableResponseDto<CategoryReqDto>> getAllCategory(
			@RequestParam(value = "pageNumber", defaultValue = "0", required = false) int pageNumber,
			@RequestParam(value = "pageSize", defaultValue = "5", required = false) int pageSize,
			@RequestParam(value = "sortDirection", defaultValue = "asc", required = false) String sortDirection,
			@RequestParam(value = "sortBy", defaultValue = "title", required = false) String sortBy) throws Exception {
		PageableResponseDto<CategoryReqDto> allUser = categoryService.getAllCategories(pageNumber, pageSize, sortDirection, sortBy);
		return new ResponseEntity<>(allUser, HttpStatus.OK);
	}
	//Get Single Category
	@GetMapping("/{categoryId}")
	public ResponseEntity<CategoryReqDto> getSingleCategory(@PathVariable("categoryId") String categoryId){
		CategoryReqDto categoryReqDto=categoryService.getCategory(categoryId);
		return new ResponseEntity<>(categoryReqDto, HttpStatus.OK);
		
	}
	
	//Search
	@GetMapping("/search/{keywords}")
	public ResponseEntity<List<CategoryReqDto>> searchCategory(@PathVariable String keywords){
		List<CategoryReqDto> searchCategory = categoryService.searchCategory(keywords);
		return new ResponseEntity<>(searchCategory, HttpStatus.OK);
	}
	
	// Upload user Image
		@PostMapping("/image/{categoryId}")
		public ResponseEntity<ImageResponseDto> uploadCategoryImage(@RequestParam("categoryImage") MultipartFile categoryImage,
				@PathVariable("categoryId") String categoryId) throws IOException {

			String fileImageName = fileService.uploadFile(categoryImage, categoryImgFilePath);

			ImageResponseDto imgRespDto = new ImageResponseDto();
			imgRespDto.setFileName(fileImageName);
			imgRespDto.setMessage("Image Uploaded Successfully");
			imgRespDto.setStatus(HttpStatus.CREATED);
			imgRespDto.setSuccess(true);
			CategoryReqDto categoryReqDto = categoryService.getCategory(categoryId);
			categoryReqDto.setCoverImage(fileImageName);
			categoryService.updateCategory(categoryId,categoryReqDto);
			return new ResponseEntity<>(imgRespDto, HttpStatus.CREATED);
		}

		@GetMapping("/image/{categoryId}")
		public void downloadCategoryImg(@PathVariable String categoryId, HttpServletResponse httpServletResponse)
				throws IOException {

			CategoryReqDto categoryById = categoryService.getCategory(categoryId);
			String fileName = categoryById.getCoverImage();

			log.info("User File Name {}", fileName);
			InputStream resource = fileService.getResource(categoryImgFilePath, fileName);

			httpServletResponse.setContentType(MediaType.ALL_VALUE);

			StreamUtils.copy(resource, httpServletResponse.getOutputStream());

		}
		
		//create Product With Category
		@PostMapping(value="/{categoryId}/product",consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
		public ResponseEntity<ProductDto> createProductWithCategory(@PathVariable String categoryId,@RequestParam("productImageFile") MultipartFile productImageFile,@ModelAttribute ProductDto productDto) throws IOException{
			return new ResponseEntity<>(productService.createProductWithCategory(categoryId, productImageFile,productDto), HttpStatus.OK);
		}
		
		//add category for existing products
		@PutMapping("/{categoryId}/product/{productId}")
		public ResponseEntity<ProductDto> addCategoryToExistingProduct(@PathVariable String categoryId,@PathVariable String productId){
			return new ResponseEntity<>(productService.addCategoryToExistingProduct(productId, categoryId), HttpStatus.OK);
		}
		
		//Fetch Products By Category
		@GetMapping("/products/{categoryId}")
		public ResponseEntity<PageableResponseDto<ProductDto>> getAllProductsByCategory(@RequestParam(value = "pageNumber", defaultValue = "0", required = false) int pageNumber,
			@RequestParam(value = "pageSize", defaultValue = "5", required = false) int pageSize,
			@RequestParam(value = "sortDirection", defaultValue = "asc", required = false) String sortDirection,
			@RequestParam(value = "sortBy", defaultValue = "title", required = false) String sortBy,@PathVariable String categoryId){
			return new ResponseEntity<>(productService.getAllProductsFromCategory(pageNumber, pageSize, sortDirection, sortBy, categoryId), HttpStatus.OK);
		}
}
