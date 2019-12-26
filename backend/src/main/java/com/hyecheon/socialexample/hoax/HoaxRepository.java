package com.hyecheon.socialexample.hoax;

import com.hyecheon.socialexample.user.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HoaxRepository extends JpaRepository<Hoax, Long> {

    Page<Hoax> findByUser(User user, Pageable pageable);
}
