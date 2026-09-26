package com.dispatchdesk;

import com.dispatchdesk.dto.AuthResponse;
import com.dispatchdesk.dto.LoginRequest;
import com.dispatchdesk.entity.User;
import com.dispatchdesk.enums.Role;
import com.dispatchdesk.repository.UserRepository;
import com.dispatchdesk.service.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
class AuthServiceTest {

    @Autowired
    private AuthService authService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();
        User testUser = User.builder()
            .name("Admin User")
            .email("admin@dispatchdesk.local")
            .passwordHash(passwordEncoder.encode("password123"))
            .role(Role.ADMIN)
            .build();
        userRepository.save(testUser);
    }

    @Test
    void testLoginSuccessReturnsJwtToken() {
        LoginRequest request = new LoginRequest("admin@dispatchdesk.local", "password123");
        AuthResponse response = authService.login(request);

        assertNotNull(response);
        assertNotNull(response.getToken());
        assertFalse(response.getToken().isEmpty());
        assertEquals("admin@dispatchdesk.local", response.getUser().getEmail());
        assertEquals(Role.ADMIN, response.getUser().getRole());
    }

    @Test
    void testLoginWithWrongPasswordThrowsException() {
        LoginRequest request = new LoginRequest("admin@dispatchdesk.local", "wrongpassword");
        assertThrows(RuntimeException.class, () -> authService.login(request));
    }

    @Test
    void testLoginWithNonExistentUserThrowsException() {
        LoginRequest request = new LoginRequest("nonexistent@dispatchdesk.local", "password123");
        assertThrows(RuntimeException.class, () -> authService.login(request));
    }
}
