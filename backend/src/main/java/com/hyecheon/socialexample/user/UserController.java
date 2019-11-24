package com.hyecheon.socialexample.user;

import com.hyecheon.socialexample.shared.GenericResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/api/1.0/users")
    public GenericResponse createUser(@RequestBody User user) {
        userService.save(user);
        return new GenericResponse("User saved");
    }
}
