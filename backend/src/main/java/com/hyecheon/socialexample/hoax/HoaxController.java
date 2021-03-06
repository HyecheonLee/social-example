package com.hyecheon.socialexample.hoax;

import com.hyecheon.socialexample.hoax.vm.HoaxVM;
import com.hyecheon.socialexample.shared.GenericResponse;
import com.hyecheon.socialexample.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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

    @GetMapping({"/hoaxes", "/users/{username}/hoaxes"})
    public ResponseEntity<Page<?>> getAllHoaxes(@PathVariable(required = false, name = "username") String username, Pageable pageable) {
        return ResponseEntity.ok(hoaxService.getHoaxesOfUser(username, pageable).map(HoaxVM::new));
    }

    @GetMapping({"/hoaxes/{id:[0-9]+}", "/users/{username}/hoaxes/{id:[0-9]+}"})
    ResponseEntity<Page<HoaxVM>> getHoaxesRelative(@PathVariable(required = false) String username,
                                                   @PathVariable Long id, Pageable pageable,
                                                   @RequestParam(name = "direction", defaultValue = "after") String direction) {
        final Page<Hoax> hoaxes;
        if (!direction.equalsIgnoreCase("after")) {
            hoaxes = hoaxService.getOldHoaxesOfUser(username, id, pageable);
        } else {
            hoaxes = hoaxService.getNewHoaxesOfUser(username, id, pageable);
        }
        return ResponseEntity.ok(hoaxes.map(HoaxVM::new));
    }

    @GetMapping({"/hoaxes/{id:[0-9]+}/count", "/users/{username}/hoaxes/{id:[0-9]+}/count"})
    ResponseEntity<Long> getHoaxesCount(@PathVariable(required = false) String username,
                                        @PathVariable Long id,
                                        @RequestParam(name = "direction", defaultValue = "after") String direction) {
        final long count;
        if (!direction.equalsIgnoreCase("after")) {
            count = hoaxService.getOldHoaxesCount(username, id);
        } else {
            count = hoaxService.getNewHoaxesCount(username, id);
        }
        return ResponseEntity.ok(count);
    }

    @DeleteMapping("/hoaxes/{id:[0-9]+}")
    @PreAuthorize("@hoaxSecurityService.isAllowedToDelete(#id, principal)")
    ResponseEntity<?> deleteHoax(@PathVariable long id) {
        hoaxService.deleteHoax(id);
        return ResponseEntity.ok("Hoax is removed");
    }
}
