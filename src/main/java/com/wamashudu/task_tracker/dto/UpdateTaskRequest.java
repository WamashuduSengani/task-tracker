package com.wamashudu.task_tracker.dto;

import com.wamashudu.task_tracker.entity.Task;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateTaskRequest {
    
    @Size(min = 1, max = 255, message = "Title must be between 1 and 255 characters")
    private String title;
    
    @Size(max = 1000, message = "Description cannot exceed 1000 characters")
    private String description;
    
    @Future(message = "Due date must be in the future")
    private LocalDateTime dueDate;
    
    private Task.TaskStatus status;
    
    private Long assignedUserId;
}