package com.hyecheon.socialexample.hoax;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/1.0/hoaxes")
@RequiredArgsConstructor
public class HoaxController {

    private final HoaxService hoaxService;

    @PostMapping("")
    public ResponseEntity<?> createHoax(@RequestBody Hoax hoax) {
        final Hoax created = hoaxService.save(hoax);
        return ResponseEntity.ok(created);
    }
}
