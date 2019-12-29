package com.hyecheon.socialexample.hoax;

import com.hyecheon.socialexample.file.FileAttachment;
import com.hyecheon.socialexample.file.FileAttachmentRepository;
import com.hyecheon.socialexample.user.User;
import com.hyecheon.socialexample.user.UserService;
import com.querydsl.core.types.ExpressionUtils;
import com.querydsl.core.types.Predicate;
import com.querydsl.core.types.dsl.BooleanExpression;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
@Transactional
public class HoaxService {
    private final HoaxRepository hoaxRepository;
    private final UserService userService;
    private final FileAttachmentRepository fileAttachmentRepository;

    public Hoax save(User user, Hoax hoax) {
        hoax.setUser(user);
        if (hoax.getAttachment() != null) {
            final FileAttachment inDB = fileAttachmentRepository.findById(hoax.getAttachment().getId()).get();
            inDB.setHoax(hoax);
            hoax.setAttachment(inDB);
        }
        return hoaxRepository.save(hoax);
    }

    public Page<Hoax> getHoaxesOfUser(String username, Pageable pageable) {
        final BooleanExpression eqUsername = eqUsername(username);
        if (eqUsername != null) {
            return hoaxRepository.findAll(eqUsername, pageable);
        }
        return hoaxRepository.findAll(pageable);
    }

    public Page<Hoax> getOldHoaxesOfUser(String username, Long id, Pageable pageable) {
        final Predicate predicate = ExpressionUtils.and(eqUsername(username), lessThenId(id));
        return hoaxRepository.findAll(predicate, pageable);
    }

    public Page<Hoax> getNewHoaxesOfUser(String username, Long id, Pageable pageable) {
        final Predicate predicate = ExpressionUtils.and(eqUsername(username), greaterThan(id));
        return hoaxRepository.findAll(predicate, pageable);
    }

    public long getOldHoaxesCount(String username, Long id) {
        final Predicate predicate = ExpressionUtils.and(eqUsername(username), lessThenId(id));
        return hoaxRepository.count(predicate);
    }

    public long getNewHoaxesCount(String username, Long id) {
        final Predicate predicate = ExpressionUtils.and(eqUsername(username), greaterThan(id));
        return hoaxRepository.count(predicate);
    }


    private BooleanExpression eqUsername(String username) {
        if (StringUtils.hasText(username)) {
            final User user = userService.findByUsername(username);
            return QHoax.hoax.user.eq(user);
        }
        return null;
    }

    private BooleanExpression greaterThan(Long id) {
        if (id != null) {
            return QHoax.hoax.id.gt(id);
        }
        return null;
    }

    private BooleanExpression lessThenId(Long id) {
        return QHoax.hoax.id.lt(id);
    }
}
