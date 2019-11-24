package com.hyecheon.socialexample.user;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserController {

    @PostMapping("/api/1.0/users")
    public ResponseEntity<?> createUser() {
        return ResponseEntity.ok("");
    }
}
