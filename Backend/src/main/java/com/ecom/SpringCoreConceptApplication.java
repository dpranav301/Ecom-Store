package com.ecom;

import java.util.Optional;
import java.util.UUID;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import com.ecom.entity.Role;
import com.ecom.repository.RoleRepository;

@SpringBootApplication
public class SpringCoreConceptApplication implements CommandLineRunner{

	@Autowired
	private RoleRepository roleRepository;
//	@Autowired
//	private JwtHelper jwtHelper;
//	@Autowired
//	private UserRepository userRepository;
	public static void main(String[] args) {
		SpringApplication.run(SpringCoreConceptApplication.class, args);
	}
	
	@Bean
	ModelMapper modelMapper() {
		return new ModelMapper();
	}
	

	@Override
	public void run(String... args) throws Exception {
		Optional<Role> adminRole = roleRepository.findByRoleName("ROLE_ADMIN");
		Optional<Role> userRole = roleRepository.findByRoleName("ROLE_USER");
		
		if(adminRole.isEmpty()) {
			Role newAdminRole=new Role();
			newAdminRole.setRoleId(UUID.randomUUID().toString());
			newAdminRole.setRoleName("ROLE_ADMIN");
			roleRepository.save(newAdminRole);
		}
		if(userRole.isEmpty()) {
			Role newUserRole=new Role();
			newUserRole.setRoleId(UUID.randomUUID().toString());
			newUserRole.setRoleName("ROLE_USER");
			roleRepository.save(newUserRole);
		}
//		CustomUserDetail custom=new CustomUserDetail(userRepository.findByEmail("janesmith@example.com").orElseThrow());
//		String token=jwtHelper.generateToken(custom);
//		log.info("Token=={}",token);
//		
//		log.info("UserName from Token {}",jwtHelper.getUsernameFromToken(token));
//		
//		log.info("Is Token Expire {}",jwtHelper.isTokenExpired(token));
//		
//		log.info("All Claims From Token {}",jwtHelper.getAllClaimsFromToken(token));
		
//}
	

}
}
