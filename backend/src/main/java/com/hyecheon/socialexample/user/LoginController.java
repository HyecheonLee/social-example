package com.hyecheon.socialexample.user;

import com.fasterxml.jackson.annotation.JsonView;
import com.hyecheon.socialexample.error.ApiError;
import com.hyecheon.socialexample.shared.CurrentUser;
import com.hyecheon.socialexample.user.vm.UserVM;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.nio.file.AccessDeniedException;

@RestController
public class LoginController {
    @PostMapping("/api/1.0/login")
    UserVM handleLogin(@CurrentUser User loggedUser) {
        return new UserVM(loggedUser);
    }

    @ExceptionHandler({AccessDeniedException.class})
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    ApiError handleAccessDeniedException() {
        return new ApiError(401, "Access error", "/api/1.0/login");
    }
}
