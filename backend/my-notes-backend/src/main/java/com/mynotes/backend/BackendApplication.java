package com.mynotes.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.core.userdetails.UserDetailsService;

@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

	@Bean
	public UserDetailsService userDetailsService(com.mynotes.backend.repository.UserRepository userRepository) {
		return username -> userRepository.findByUsername(username)
				.map(u -> org.springframework.security.core.userdetails.User.withUsername(u.getUsername()).password(u.getPassword()).authorities(java.util.Collections.emptyList()).build())
				.orElseThrow(() -> new RuntimeException("User not found"));
	}

}
