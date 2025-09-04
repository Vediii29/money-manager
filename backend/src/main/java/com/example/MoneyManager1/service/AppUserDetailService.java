package com.example.MoneyManager1.service;


import com.example.MoneyManager1.entity.ProfileEntity;
import com.example.MoneyManager1.repository.ProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority; // Import this new class
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.Collections;
import java.util.List; // Import List

@Service
@RequiredArgsConstructor
public class AppUserDetailService implements UserDetailsService {

    private final ProfileRepository profileRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {

        ProfileEntity existingProfile = profileRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Profile not found with email: " + email));


        // This gives them permission to access protected endpoints like /categories.
       // List<SimpleGrantedAuthority> authorities = Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"));

        return User.builder()
                .username(existingProfile.getEmail())
                .password(existingProfile.getPassword())
                .authorities(Collections.emptyList()) // Use the new list of authorities here
                .build();
    }
}
