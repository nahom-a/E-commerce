package com.dispatchdesk;

import com.dispatchdesk.entity.User;
import com.dispatchdesk.enums.Role;
import com.dispatchdesk.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.assertions.Assertions.*;

@SpringBootTest
class UserRepositoryTest {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Test
    void testUserCreation() {
        User user = User.builder()
            .name("Test User")
            .email("test@example.com")
            .passwordHash(passwordEncoder.encode("password"))
            .role(Role.ADMIN)
            .build();
        assertNotNull(user);
    }
}
