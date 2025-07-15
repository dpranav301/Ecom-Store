package com.ecom.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import lombok.extern.slf4j.Slf4j;
@Slf4j
public class ImageNameValidator implements ConstraintValidator<ImageNameValid, String> {

	@Override
	public boolean isValid(String value, ConstraintValidatorContext context) {
		
		log.info("The Value is {}",value);
		return !value.equals("");
	}

}
