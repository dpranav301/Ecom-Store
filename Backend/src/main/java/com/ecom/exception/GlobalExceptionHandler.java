package com.ecom.exception;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authorization.AuthorizationDeniedException;
import org.springframework.validation.FieldError;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.ecom.dto.response.ApiResponseMsg;

import lombok.extern.slf4j.Slf4j;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

	// handle Resource Not Found Exception
	@ExceptionHandler(ResourceNotFoundException.class)
	public ResponseEntity<ApiResponseMsg> resourceNotFoundException(ResourceNotFoundException e) {
		ApiResponseMsg apiResponse = new ApiResponseMsg();
		apiResponse.setMessage(e.getMessage());
		apiResponse.setStatus(HttpStatus.NOT_FOUND);
		apiResponse.setSuccess(false);

		return new ResponseEntity<>(apiResponse, HttpStatus.NOT_FOUND);
	}

	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<Map<String, Object>> handleMethodArgumentNotValidException(MethodArgumentNotValidException e){
		List<ObjectError> allErrors = e.getBindingResult().getAllErrors();
		Map<String, Object> response=new HashMap<>();
		allErrors.stream().forEach(objError->{
			String message=objError.getDefaultMessage();
			String field=((FieldError)objError).getField();
			response.put(field, message);
		});
		return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
	}
	
	@ExceptionHandler(ImageExtensionNotValidException.class)
	public ResponseEntity<ApiResponseMsg> imageExtNotValidException(ImageExtensionNotValidException e) {
		StackTraceElement[] stackTraceArray = e.getStackTrace();
		String exception = e.getMessage();
		for (StackTraceElement stackTrace : stackTraceArray) {
			if(stackTrace.getClassName().startsWith("com.ecom")) {
			String fileName = stackTrace.getFileName();
			String className = stackTrace.getClassName();
			String methodName = stackTrace.getMethodName();
			int lineNo = stackTrace.getLineNumber();

			log.info("Exception Occur At ClassName {} at method {} in file {} at line no {} and exception is {}",
					className, methodName, fileName, lineNo, exception);
			}
		}
		ApiResponseMsg apiResponse = new ApiResponseMsg();
		apiResponse.setMessage(e.getMessage());
		apiResponse.setStatus(HttpStatus.NOT_ACCEPTABLE);
		apiResponse.setSuccess(false);

		return new ResponseEntity<>(apiResponse, HttpStatus.NOT_ACCEPTABLE);
	}
	
	@ExceptionHandler(CategoryNotFoundException.class)
	public ResponseEntity<ApiResponseMsg> categoryNotFoundException(ResourceNotFoundException e) {
		ApiResponseMsg apiResponse = new ApiResponseMsg();
		apiResponse.setMessage(e.getMessage());
		apiResponse.setStatus(HttpStatus.NOT_FOUND);
		apiResponse.setSuccess(false);

		return new ResponseEntity<>(apiResponse, HttpStatus.NOT_FOUND);
	}
	
	@ExceptionHandler(AuthorizationDeniedException.class)
	public ResponseEntity<ApiResponseMsg> authorizationDeniedException(ResourceNotFoundException e) {
		ApiResponseMsg apiResponse = new ApiResponseMsg();
		apiResponse.setMessage(e.getMessage());
		apiResponse.setStatus(HttpStatus.UNAUTHORIZED);
		apiResponse.setSuccess(false);

		return new ResponseEntity<>(apiResponse, HttpStatus.NOT_FOUND);
	}
	@ExceptionHandler(Exception.class)
	public ResponseEntity<ApiResponseMsg> handleGenericException(Exception e) {
		StackTraceElement[] stackTraceArray = e.getStackTrace();
		String exception = e.getMessage();
		for (StackTraceElement stackTrace : stackTraceArray) {
			if(stackTrace.getClassName().startsWith("com.ecom")) {
			String fileName = stackTrace.getFileName();
			String className = stackTrace.getClassName();
			String methodName = stackTrace.getMethodName();
			int lineNo = stackTrace.getLineNumber();

			log.info("Exception Occur At ClassName {} at method {} in file {} at line no {} and exception is {}",
					className, methodName, fileName, lineNo, exception);
			}
		}
		ApiResponseMsg apiResponse = new ApiResponseMsg();
		apiResponse.setMessage(e.getMessage());
		apiResponse.setStatus(HttpStatus.NOT_FOUND);
		apiResponse.setSuccess(false);

		return new ResponseEntity<>(apiResponse, HttpStatus.NOT_FOUND);
	}
	
	
	
}
