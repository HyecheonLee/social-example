package com.hyecheon.socialexample.user;

import com.hyecheon.socialexample.error.ApiError;
import com.hyecheon.socialexample.shared.GenericResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import java.util.HashMap;

@RestController
@RequiredArgsConstructor
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/api/1.0/users")
    public GenericResponse createUser(@Valid @RequestBody User user) {
        userService.save(user);
        return new GenericResponse("User saved");
    }

    @GetMapping("/api/1.0/users")
    public ResponseEntity<Page<?>> getUsers(Pageable pageable) {
        final Page<User> userPage = userService.findAll(pageable);
        return new ResponseEntity<>(userPage, HttpStatus.OK);
    }

    @ExceptionHandler({MethodArgumentNotValidException.class})
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ApiError handleValidationException(MethodArgumentNotValidException exception, HttpServletRequest request) {
        final var apiError = new ApiError(400, "Validation error", request.getServletPath());
        final var result = exception.getBindingResult();
        final var validationErrors = new HashMap<String, String>();
        for (var fieldError : result.getFieldErrors()) {
            validationErrors.put(fieldError.getField(), fieldError.getDefaultMessage());
        }
        apiError.setValidationErrors(validationErrors);
        return apiError;
    }
}
