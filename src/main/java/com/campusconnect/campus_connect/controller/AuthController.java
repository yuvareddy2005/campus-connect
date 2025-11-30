package com.campusconnect.campus_connect.controller;

import com.campusconnect.campus_connect.dto.ApiResponse; // Import the new wrapper
import com.campusconnect.campus_connect.dto.AuthResponseDto;
import com.campusconnect.campus_connect.dto.LoginDto;
import com.campusconnect.campus_connect.dto.RegisterDto;
import com.campusconnect.campus_connect.entity.User;
import com.campusconnect.campus_connect.service.AuthService;
import com.campusconnect.campus_connect.service.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtService jwtService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<User>> registerUser(@RequestBody RegisterDto registerDto) {

        User newUser = new User();
        newUser.setName(registerDto.getName());
        newUser.setEmail(registerDto.getEmail());
        newUser.setPassword(registerDto.getPassword());
        User registeredUser = authService.registerUser(newUser);
        registeredUser.setPassword(null);
        ApiResponse<User> response = new ApiResponse<>(true, "User registered successfully", registeredUser);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponseDto>> loginUser(@RequestBody LoginDto loginDto) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginDto.getEmail(), loginDto.getPassword()));

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String token = jwtService.generateToken(userDetails);

        AuthResponseDto authResponse = new AuthResponseDto(token);
        ApiResponse<AuthResponseDto> response = new ApiResponse<>(true, "Login successful", authResponse);

        return ResponseEntity.ok(response);
    }
}