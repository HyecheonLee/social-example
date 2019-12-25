package com.hyecheon.socialexample.hoax;

import com.hyecheon.socialexample.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class HoaxService {
    private final HoaxRepository hoaxRepository;

    public Hoax save(User user, Hoax hoax) {
        hoax.setUser(user);
        return hoaxRepository.save(hoax);
    }
}
