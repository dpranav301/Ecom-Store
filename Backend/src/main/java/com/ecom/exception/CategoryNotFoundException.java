package com.ecom.exception;

public class CategoryNotFoundException extends RuntimeException {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public CategoryNotFoundException() {
		super("Category Not Found");
	}
	
	public CategoryNotFoundException(String message){
		super(message);
	}
}
