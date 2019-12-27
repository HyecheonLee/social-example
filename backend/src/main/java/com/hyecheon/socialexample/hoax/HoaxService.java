package com.hyecheon.socialexample.hoax;

import com.hyecheon.socialexample.user.User;
import com.hyecheon.socialexample.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class HoaxService {
    private final HoaxRepository hoaxRepository;
    private final UserService userService;

    public Hoax save(User user, Hoax hoax) {
        hoax.setUser(user);
        return hoaxRepository.save(hoax);
    }

    public Page<Hoax> getHoaxes(Pageable pageable) {
        return hoaxRepository.findAll(pageable);
    }

    public Page<Hoax> getHoaxesOfUser(String username, Pageable pageable) {
        final User user = userService.findByUsername(username);
        return hoaxRepository.findByUser(user, pageable);
    }

    public Page<Hoax> getHoaxesOfUser(String username) {
        return getHoaxesOfUser(username, PageRequest.of(0, 20));
    }

    public Page<Hoax> getOldHoaxes(Long id, Pageable pageable) {
        return hoaxRepository.findByIdLessThan(id, pageable);
    }
}
