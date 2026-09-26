package com.dispatchdesk;

import com.dispatchdesk.entity.User;
import com.dispatchdesk.enums.Role;
import com.dispatchdesk.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
class UserRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();
    }

    @Test
    void testUserSaveAndFindByEmail() {
        User user = User.builder()
            .name("Samuel Tesfaye")
            .email("samuel@dispatchdesk.local")
            .passwordHash(passwordEncoder.encode("secretpass"))
            .role(Role.DRIVER)
            .build();

        User saved = userRepository.save(user);
        assertNotNull(saved.getId());

        Optional<User> found = userRepository.findByEmail("samuel@dispatchdesk.local");
        assertTrue(found.isPresent());
        assertEquals("Samuel Tesfaye", found.get().getName());
        assertEquals(Role.DRIVER, found.get().getRole());
    }
}
