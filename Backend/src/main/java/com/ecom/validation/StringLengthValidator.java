package com.ecom.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class StringLengthValidator implements ConstraintValidator<StringLength, String>{

	@Override
	public boolean isValid(String value, ConstraintValidatorContext context) {
		
		value=value.trim();
		return value.length()>3;
	}

}
