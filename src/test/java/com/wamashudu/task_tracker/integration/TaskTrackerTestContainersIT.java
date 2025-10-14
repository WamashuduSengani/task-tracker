package com.wamashudu.task_tracker.integration;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.containers.PostgreSQLContainer;
import org.springframework.beans.factory.annotation.Autowired;
import com.wamashudu.task_tracker.repository.TaskRepository;
import com.wamashudu.task_tracker.entity.Task;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Testcontainers
class TaskTrackerTestContainersIT {
    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:15")
            .withDatabaseName("testdb")
            .withUsername("test")
            .withPassword("test");

    @Autowired
    TaskRepository taskRepository;

    @Test
    void testCreateTaskWithTestContainers() {
        Task task = new Task();
        task.setTitle("TC Task");
        task.setDescription("TC Desc");
        task.setDueDate(LocalDateTime.now().plusDays(3));
        task.setStatus(Task.TaskStatus.NEW);
        task.setCreatedDate(LocalDateTime.now());
        Task saved = taskRepository.save(task);
        assertNotNull(saved.getId());
        assertEquals("TC Task", saved.getTitle());
    }
}
