package com.wamashudu.task_tracker.service;

import com.wamashudu.task_tracker.dto.CreateTaskRequest;
import com.wamashudu.task_tracker.dto.TaskResponse;
import com.wamashudu.task_tracker.entity.Task;
import com.wamashudu.task_tracker.repository.TaskRepository;
import com.wamashudu.task_tracker.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.Mockito;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;

@ExtendWith(MockitoExtension.class)
class TaskServiceTest {
    @Mock
    TaskRepository taskRepository;
    @Mock
    UserRepository userRepository;
    @InjectMocks
    TaskService taskService;

    @Test
    void createTask_shouldReturnTaskResponse_whenValidRequest() {
        CreateTaskRequest request = new CreateTaskRequest();
        request.setTitle("Test Task");
        request.setDescription("Test Description");
        request.setDueDate(LocalDateTime.now().plusDays(1));
        request.setAssignedUserId(null);

        Task mockTask = new Task();
        mockTask.setId(1L);
        mockTask.setTitle(request.getTitle());
        mockTask.setDescription(request.getDescription());
        mockTask.setDueDate(request.getDueDate());
        mockTask.setStatus(Task.TaskStatus.NEW);
        mockTask.setCreatedDate(LocalDateTime.now());

        Mockito.when(taskRepository.save(any(Task.class))).thenReturn(mockTask);

        TaskResponse response = taskService.createTask(request);
        assertNotNull(response);
        assertEquals("Test Task", response.getTitle());
    }

    @Test
    void getTaskById_shouldThrowException_whenTaskNotFound() {
        Mockito.when(taskRepository.findById(99L)).thenReturn(Optional.empty());
        assertThrows(RuntimeException.class, () -> taskService.getTaskById(99L));
    }
}
