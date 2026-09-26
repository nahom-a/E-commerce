package com.dispatchdesk.service;

import com.dispatchdesk.dto.AuthResponse;
import com.dispatchdesk.dto.LoginRequest;
import com.dispatchdesk.entity.User;
import com.dispatchdesk.repository.UserRepository;
import com.dispatchdesk.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.Collections;
import java.util.stream.Collectors;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public AuthResponse login(LoginRequest request) {
        try {
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
        } catch (BadCredentialsException e) {
            throw new RuntimeException("Invalid credentials");
        }

        User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new RuntimeException("User not found"));

        String token = jwtUtil.generateToken(
            new UsernamePasswordAuthenticationToken(
                user.getEmail(),
                null,
                user.getRole().name() == null ? Collections.emptyList() :
                    Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()))
            )
        );

        return AuthResponse.builder()
            .token(token)
            .user(AuthResponse.UserInfo.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .build())
            .build();
    }
}
