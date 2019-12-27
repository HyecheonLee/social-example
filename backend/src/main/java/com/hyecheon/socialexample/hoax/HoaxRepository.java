package com.hyecheon.socialexample.hoax;

import com.hyecheon.socialexample.user.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface HoaxRepository extends JpaRepository<Hoax, Long> {

    Page<Hoax> findByUser(User user, Pageable pageable);

    Page<Hoax> findByIdLessThan(Long id, Pageable pageable);

    Page<Hoax> findByIdGreaterThan(Long id, Pageable pageable);

    Page<Hoax> findByUserAndIdLessThan(User user, Long id, Pageable pageable);
}
