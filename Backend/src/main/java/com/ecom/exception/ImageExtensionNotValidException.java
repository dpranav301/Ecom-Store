package com.ecom.exception;

public class ImageExtensionNotValidException extends RuntimeException{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public ImageExtensionNotValidException() {
		super("The Provided Image With Extension Is Not Allowed Only .png , .jpg, .jped format Allowed");
	}
	
	public ImageExtensionNotValidException(String msg) {
		super(msg);
	}
}
