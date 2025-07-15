package com.ecom.utils;

import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;

import com.ecom.dto.response.PageableResponseDto;

import lombok.Data;

@Data
public class Helper {

	private Helper() {
		
	}
	public static <U,V> PageableResponseDto<V> getPageableResponse(Page<U> page,Class<V> type){
		List<U> entity=page.getContent();
		List<V> listOfUserDto=entity.stream().map(object->
			 new ModelMapper().map(object, type)
		).toList();
		PageableResponseDto<V> pageableRespDto=new PageableResponseDto<>();
		pageableRespDto.setContent(listOfUserDto);
//		pageableRespDto.setPageNumber(page.getNumber()+1);  //Here We Start Page Number from 1 hence this logic
		pageableRespDto.setPageNumber(page.getNumber());
		pageableRespDto.setLastpage(page.isLast());
		pageableRespDto.setPageSize(page.getNumberOfElements());
		pageableRespDto.setTotalElement(page.getTotalElements());
		pageableRespDto.setTotalPages(page.getTotalPages());
		return pageableRespDto;
	}
}
