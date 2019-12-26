package com.hyecheon.socialexample.hoax;

import com.hyecheon.socialexample.hoax.vm.HoaxVM;
import com.hyecheon.socialexample.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;

@RestController
@RequestMapping("/api/1.0")
@RequiredArgsConstructor
public class HoaxController {

    private final HoaxService hoaxService;

    @PostMapping("/hoaxes")
    public ResponseEntity<?> createHoax(@AuthenticationPrincipal User user, @Valid @RequestBody Hoax hoax) throws URISyntaxException {
        final HoaxVM hoaxVM = new HoaxVM(hoaxService.save(user, hoax));
        return ResponseEntity.created(new URI("/api/1.0/hoaxes/" + hoax.getId())).body(hoaxVM);
    }

    @GetMapping("/hoaxes")
    public ResponseEntity<Page<?>> getAllHoaxes(Pageable pageable) {
        final Page<HoaxVM> map = hoaxService.getHoaxes(pageable).map(HoaxVM::new);
        return ResponseEntity.ok(map);
    }
}
