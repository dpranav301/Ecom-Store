package com.ecom.config;

import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;

import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public GroupedOpenApi publicApi() {
        return GroupedOpenApi.builder()
        		.group("public")
                .pathsToMatch("/auth/**","/user")
                .build();
    }
    @Bean
    public GroupedOpenApi privateApi() {
    	 return GroupedOpenApi.builder()
         		.group("private")
                 .pathsToMatch("/cart/**","/category/**","/orders/**","/products/**")
                 .build();
    }

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Ecommerce Project API Doc")
                        .description("API Documentation For Ecommerce Project")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Pranav Desai")
                                .email("pranav@test.com")
                                .url("https://testwebsite.com")))
                .addSecurityItem(new SecurityRequirement().addList("bearerAuth"))
                .components(new io.swagger.v3.oas.models.Components()
                        .addSecuritySchemes("bearerAuth", new SecurityScheme()
                            .type(SecurityScheme.Type.HTTP)
                            .scheme("bearer")
                            .bearerFormat("JWT")
                            .description("Please enter your JWT token")));
    }
}

