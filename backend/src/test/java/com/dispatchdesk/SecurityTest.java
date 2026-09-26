package com.dispatchdesk;

import com.dispatchdesk.entity.User;
import com.dispatchdesk.enums.Role;
import com.dispatchdesk.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class SecurityTest {

    @Autowired
    private MockMvc mockMvc;

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
    void testLoginEndpointIsPublic() throws Exception {
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\":\"admin@dispatchdesk.local\",\"password\":\"password123\"}"))
            .andExpect(status().isOk());
    }

    @Test
    void testProtectedEndpointRequiresAuthentication() throws Exception {
        mockMvc.perform(get("/api/dashboard/stats"))
            .andExpect(status().isForbidden());
    }
}
