package com.example.MoneyManager1.controller;

import com.example.MoneyManager1.dto.AuthDTO;
import com.example.MoneyManager1.dto.ProfileDTO;
import com.example.MoneyManager1.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequiredArgsConstructor
public class ProfileController  {
    private final ProfileService profileService;

    @PostMapping("/register")
    public ResponseEntity<ProfileDTO> registerProfile(@RequestBody ProfileDTO profileDTO){
        ProfileDTO registerProfile = profileService.registerProfile(profileDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(registerProfile);
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody AuthDTO authDTO) {
        try {
            // The account activation check has been removed from here.
            Map<String, Object> response = profileService.authenticateAndGenerateToken(authDTO);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                    "message", e.getMessage()
            ));
        }
    }
    @GetMapping("/test")
    public String test(){
        return "Test Successful";
    }
}
