package com.hyecheon.socialexample.hoax;

import com.hyecheon.socialexample.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class HoaxService {
    private final HoaxRepository hoaxRepository;

    public Hoax save(User user, Hoax hoax) {
        hoax.setUser(user);
        return hoaxRepository.save(hoax);
    }

    public Page<Hoax> getHoaxes(Pageable pageable) {
        return hoaxRepository.findAll(pageable);
    }
}
