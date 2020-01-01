package com.hyecheon.socialexample.hoax;

import com.hyecheon.socialexample.user.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;

import java.util.List;

public interface HoaxRepository extends JpaRepository<Hoax, Long>, QuerydslPredicateExecutor<Hoax> {

    Page<Hoax> findByUser(User user, Pageable pageable);

    boolean existsByUserAndId(User user, Long id);
}
