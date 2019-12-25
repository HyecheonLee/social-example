package com.hyecheon.socialexample.hoax;

import com.hyecheon.socialexample.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;

@RestController
@RequestMapping("/api/1.0/hoaxes")
@RequiredArgsConstructor
public class HoaxController {

    private final HoaxService hoaxService;

    @PostMapping("")
    public ResponseEntity<?> createHoax(@AuthenticationPrincipal User user, @Valid @RequestBody Hoax hoax) {
        final Hoax created = hoaxService.save(user,hoax);
        return ResponseEntity.ok(created);
    }
}
