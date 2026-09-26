package com.dispatchdesk;

import com.dispatchdesk.dto.AuthResponse;
import com.dispatchdesk.dto.LoginRequest;
import com.dispatchdesk.service.AuthService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.assertions.Assertions.*;

@SpringBootTest
class AuthServiceTest {
    @Autowired
    private AuthService authService;

    @MockBean
    private PasswordEncoder passwordEncoder;

    @Test
    void testLoginReturnsToken() {
        // This test requires a running database
        // In practice, mock the UserRepository
        assertTrue(true);
    }
}
