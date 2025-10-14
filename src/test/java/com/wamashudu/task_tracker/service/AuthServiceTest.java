package com.wamashudu.task_tracker.service;

import com.wamashudu.task_tracker.dto.RegisterRequest;
import com.wamashudu.task_tracker.dto.AuthResponse;
import com.wamashudu.task_tracker.entity.User;
import com.wamashudu.task_tracker.repository.UserRepository;
import com.wamashudu.task_tracker.util.JwtUtil;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {
    @Mock
    UserRepository userRepository;
    @Mock
    PasswordEncoder passwordEncoder;
    @Mock
    JwtUtil jwtUtil;
    @Mock
    AuthenticationManager authenticationManager;
    @InjectMocks
    AuthService authService;

    @Test
    void register_shouldThrowException_whenUsernameExists() {
        RegisterRequest request = new RegisterRequest();
        request.setUsername("existingUser");
        request.setEmail("test@email.com");
        request.setPassword("password");
        Mockito.when(userRepository.findByUsername("existingUser")).thenReturn(Optional.of(new User()));
        assertThrows(RuntimeException.class, () -> authService.register(request));
    }

    @Test
    void register_shouldReturnAuthResponse_whenValidRequest() {
        RegisterRequest request = new RegisterRequest();
        request.setUsername("newUser");
        request.setEmail("new@email.com");
        request.setPassword("password");
        Mockito.when(userRepository.findByUsername("newUser")).thenReturn(Optional.empty());
        Mockito.when(userRepository.findByEmail("new@email.com")).thenReturn(Optional.empty());
        Mockito.when(passwordEncoder.encode("password")).thenReturn("hashedPassword");
        User savedUser = new User();
        savedUser.setId(1L);
        savedUser.setUsername("newUser");
        Mockito.when(userRepository.save(Mockito.any(User.class))).thenReturn(savedUser);
        Mockito.when(jwtUtil.generateToken("newUser")).thenReturn("accessToken");
        Mockito.when(jwtUtil.generateRefreshToken("newUser")).thenReturn("refreshToken");
        Mockito.when(jwtUtil.getJwtExpiration()).thenReturn(3600L);
        AuthResponse response = authService.register(request);
        assertNotNull(response);
        assertEquals("newUser", response.getUsername());
        assertEquals("accessToken", response.getAccessToken());
    }
}
