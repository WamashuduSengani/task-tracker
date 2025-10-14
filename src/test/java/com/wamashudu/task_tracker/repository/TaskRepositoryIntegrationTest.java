package com.wamashudu.task_tracker.repository;

import com.wamashudu.task_tracker.entity.Task;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@ExtendWith(SpringExtension.class)
class TaskRepositoryIntegrationTest {
    @Autowired
    TaskRepository taskRepository;

    @Test
    void testSaveAndFindTask() {
        Task task = new Task();
        task.setTitle("Integration Test Task");
        task.setDescription("Integration Test Description");
        task.setDueDate(LocalDateTime.now().plusDays(2));
        task.setStatus(Task.TaskStatus.NEW);
        task.setCreatedDate(LocalDateTime.now());
        Task saved = taskRepository.save(task);
        assertNotNull(saved.getId());
        List<Task> found = taskRepository.findAll();
        assertTrue(found.stream().anyMatch(t -> t.getTitle().equals("Integration Test Task")));
    }
}
