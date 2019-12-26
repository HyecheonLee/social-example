package com.hyecheon.socialexample.hoax;

import com.hyecheon.socialexample.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@RequestMapping("/api/1.0")
@RequiredArgsConstructor
public class HoaxController {

    private final HoaxService hoaxService;

    @PostMapping("/hoaxes")
    public ResponseEntity<?> createHoax(@AuthenticationPrincipal User user, @Valid @RequestBody Hoax hoax) {
        final Hoax created = hoaxService.save(user, hoax);
        return ResponseEntity.ok(created);
    }

    @GetMapping("/hoaxes")
    public ResponseEntity<Page<?>> getAllHoaxes(Pageable pageable) {
        return ResponseEntity.ok(hoaxService.getHoaxes(pageable));
    }
}
