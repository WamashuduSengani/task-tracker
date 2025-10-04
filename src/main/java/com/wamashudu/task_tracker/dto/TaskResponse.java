package com.wamashudu.task_tracker.dto;

import com.wamashudu.task_tracker.entity.Task;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskResponse {
    
    private Long id;
    private String title;
    private String description;
    private Task.TaskStatus status;
    private LocalDateTime dueDate;
    private LocalDateTime createdDate;
    private Long assignedUserId;
    private String assignedUserName;
}