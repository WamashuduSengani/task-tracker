package com.wamashudu.task_tracker.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class TestController {

    @GetMapping("/test")
    public ResponseEntity<Map<String, Object>> test() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        
        return ResponseEntity.ok(Map.of(
            "message", "JWT Authentication is working!",
            "username", auth.getName(),
            "authorities", auth.getAuthorities(),
            "authenticated", auth.isAuthenticated()
        ));
    }

    @GetMapping("/admin/test")
    public ResponseEntity<Map<String, String>> adminTest() {
        return ResponseEntity.ok(Map.of(
            "message", "Admin endpoint accessed successfully!",
            "role", "ADMIN"
        ));
    }
}