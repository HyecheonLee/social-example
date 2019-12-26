package com.hyecheon.socialexample.user;

import com.hyecheon.socialexample.shared.GenericResponse;
import com.hyecheon.socialexample.user.vm.UserUpdateVM;
import com.hyecheon.socialexample.user.vm.UserVM;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/api/1.0/users")
    public GenericResponse createUser(@Valid @RequestBody User user) {
        userService.save(user);
        return new GenericResponse("User saved");
    }

    @GetMapping("/api/1.0/users")
    public ResponseEntity<Page<?>> getUsers(@AuthenticationPrincipal User loggedInUser, @PageableDefault(page = 0, size = 10) Pageable pageable) {
        final Page<?> userPage = userService.findAll(loggedInUser, pageable).map(UserVM::new);
        return new ResponseEntity<>(userPage, HttpStatus.OK);
    }

    @GetMapping("/api/1.0/users/{username}")
    public ResponseEntity<?> getUserByName(@PathVariable String username) {
        return new ResponseEntity<>(new UserVM(userService.findByUsername(username)), HttpStatus.OK);
    }

    @PutMapping("/api/1.0/users/{id:[0-9]+}")
    @PreAuthorize("#id == principal.id")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @Valid @RequestBody UserUpdateVM userUpdate) {
        final User updatedUser = userService.update(id, userUpdate);
        return new ResponseEntity<>(new UserVM(updatedUser), HttpStatus.OK);
    }
}
