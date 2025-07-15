package com.ecom.validation;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

@Target({ElementType.FIELD,ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Constraint(validatedBy = ImageNameValidator.class)
public @interface ImageNameValid {

	//This is Error Message
	String message() default "Invalid Image Name";

	//Represents Group of Constraints
	Class<?>[] groups() default { };

	//Additional information about annotation
	Class<? extends Payload>[] payload() default { };
}
