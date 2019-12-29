package com.hyecheon.socialexample.file;

import com.hyecheon.socialexample.TestUtil;
import com.hyecheon.socialexample.hoax.Hoax;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import javax.persistence.PersistenceContext;
import java.time.LocalDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(SpringExtension.class)
//@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@DataJpaTest
@ActiveProfiles("test")
class FileAttachmentRepositoryTest {

    @Autowired
    TestEntityManager testEntityManager;

    @Autowired
    FileAttachmentRepository fileAttachmentRepository;

    @Test
    public void findByDateBeforeAndHoaxIsNull_whenAttachmentsDateOlderThanOneHour_returnsAll() {
        testEntityManager.persist(getOneHourOldFileAttachment());
        testEntityManager.persist(getOneHourOldFileAttachment());
        testEntityManager.persist(getOneHourOldFileAttachment());
        LocalDateTime oneHourAgo = LocalDateTime.now().minusHours(1);
        List<FileAttachment> attachments = fileAttachmentRepository.findByCreatedAtBeforeAndHoaxIsNull(oneHourAgo);
        assertThat(attachments.size()).isEqualTo(3);
    }

    @Test
    public void findByDateBeforeAndHoaxIsNull_whenAttachmentsDateOlderThanOneHorButHaveHoax_returnsNone() {
        Hoax hoax1 = testEntityManager.persist(TestUtil.createValidHoax());
        Hoax hoax2 = testEntityManager.persist(TestUtil.createValidHoax());
        Hoax hoax3 = testEntityManager.persist(TestUtil.createValidHoax());

        testEntityManager.persist(getOldFileAttachmentWithHoax(hoax1));
        testEntityManager.persist(getOldFileAttachmentWithHoax(hoax2));
        testEntityManager.persist(getOldFileAttachmentWithHoax(hoax3));
        var oneHourAgo = LocalDateTime.now().minusHours(1);
        List<FileAttachment> attachments = fileAttachmentRepository.findByCreatedAtBeforeAndHoaxIsNull(oneHourAgo);
        assertThat(attachments.size()).isEqualTo(0);
    }

    @Test
    public void findByDateBeforeAndHoaxIsNull_whenAttachmentsDateWithinOneHour_returnsNone() {
        testEntityManager.persist(getFileAttachmentWithinOneHour());
        testEntityManager.persist(getFileAttachmentWithinOneHour());
        testEntityManager.persist(getFileAttachmentWithinOneHour());
        var oneHourAgo = LocalDateTime.now().minusHours(1);
        List<FileAttachment> attachments = fileAttachmentRepository.findByCreatedAtBeforeAndHoaxIsNull(oneHourAgo);
        assertThat(attachments.size()).isEqualTo(0);
    }

    @Test
    public void findByDateBeforeAndHoaxIsNull_whenSomeAttachmentsOldSomeNewAndSomeWithHoax_returnsAttachmentsWithOlderAndNoHoaxAssigned() {
        Hoax hoax1 = testEntityManager.persist(TestUtil.createValidHoax());
        testEntityManager.persist(getOldFileAttachmentWithHoax(hoax1));
        testEntityManager.persist(getOneHourOldFileAttachment());
        testEntityManager.persist(getFileAttachmentWithinOneHour());
        var oneHourAgo = LocalDateTime.now().minusMinutes(1);
        List<FileAttachment> attachments = fileAttachmentRepository.findByCreatedAtBeforeAndHoaxIsNull(oneHourAgo);
        assertThat(attachments.size()).isEqualTo(1);
    }

    private FileAttachment getOneHourOldFileAttachment() {
        final LocalDateTime date = LocalDateTime.now().minusHours(1).plusMinutes(1);
        FileAttachment fileAttachment = new FileAttachment();
        fileAttachment.setCreatedAt(date);
        return fileAttachment;
    }

    private FileAttachment getFileAttachmentWithinOneHour() {
        final LocalDateTime date = LocalDateTime.now().minusMinutes(1);
        FileAttachment fileAttachment = new FileAttachment();
        fileAttachment.setCreatedAt(date);
        return fileAttachment;
    }

    private FileAttachment getOldFileAttachmentWithHoax(Hoax hoax) {
        FileAttachment fileAttachment = getOneHourOldFileAttachment();
        fileAttachment.setHoax(hoax);
        return fileAttachment;
    }
}