package com.dispatchdesk.dto;

import com.dispatchdesk.enums.Role;

public class AuthResponse {
    private String token;
    private UserInfo user;

    public AuthResponse() {}

    public AuthResponse(String token, UserInfo user) {
        this.token = token;
        this.user = user;
    }

    public static AuthResponseBuilder builder() {
        return new AuthResponseBuilder();
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public UserInfo getUser() { return user; }
    public void setUser(UserInfo user) { this.user = user; }

    public static class UserInfo {
        private Long id;
        private String name;
        private String email;
        private Role role;

        public UserInfo() {}

        public UserInfo(Long id, String name, String email, Role role) {
            this.id = id;
            this.name = name;
            this.email = email;
            this.role = role;
        }

        public static UserInfoBuilder builder() {
            return new UserInfoBuilder();
        }

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public Role getRole() { return role; }
        public void setRole(Role role) { this.role = role; }

        public static class UserInfoBuilder {
            private Long id;
            private String name;
            private String email;
            private Role role;

            public UserInfoBuilder id(Long id) { this.id = id; return this; }
            public UserInfoBuilder name(String name) { this.name = name; return this; }
            public UserInfoBuilder email(String email) { this.email = email; return this; }
            public UserInfoBuilder role(Role role) { this.role = role; return this; }

            public UserInfo build() {
                return new UserInfo(id, name, email, role);
            }
        }
    }

    public static class AuthResponseBuilder {
        private String token;
        private UserInfo user;

        public AuthResponseBuilder token(String token) { this.token = token; return this; }
        public AuthResponseBuilder user(UserInfo user) { this.user = user; return this; }

        public AuthResponse build() {
            return new AuthResponse(token, user);
        }
    }
}
