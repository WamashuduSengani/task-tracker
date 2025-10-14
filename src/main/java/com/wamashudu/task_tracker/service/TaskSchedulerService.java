package com.wamashudu.task_tracker.service;

import com.wamashudu.task_tracker.entity.Task;
import com.wamashudu.task_tracker.repository.TaskRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.wamashudu.task_tracker.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TaskSchedulerService {

    private static final Logger logger = LoggerFactory.getLogger(TaskSchedulerService.class);

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    @Value("${app.scheduler.task-overdue.enabled:true}")
    private boolean schedulerEnabled;

    public TaskSchedulerService(TaskRepository taskRepository, UserRepository userRepository) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
    }
    /**
     * Manual trigger method for testing purposes
     * Can be called from a REST endpoint or during application testing
     */
    public int triggerOverdueTaskCheck() {
        logger.info("Manual trigger for overdue task check initiated");
        try {
            LocalDateTime now = LocalDateTime.now();
            List<Task> overdueTasks = taskRepository.findTasksForOverdueUpdate(now);
            int updatedCount = 0;
            for (Task task : overdueTasks) {
                task.setStatus(Task.TaskStatus.OVERDUE);
                taskRepository.save(task);
                updatedCount++;
            }
            logger.info("Manual overdue check completed. Updated {} tasks", updatedCount);
            return updatedCount;
        } catch (Exception e) {
            logger.error("Error during manual overdue task check: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to process overdue tasks", e);
        }
    }

    @Transactional
    public void markOverdueTasks() {
        if (!schedulerEnabled) {
            logger.debug("Task overdue scheduler is disabled");
            return;
        }

        try {
            logger.info("Starting scheduled task to mark overdue tasks");

            LocalDateTime now = LocalDateTime.now();

            List<Task> overdueTasks = taskRepository.findTasksForOverdueUpdate(now);

            if (overdueTasks.isEmpty()) {
                logger.info("No tasks found that need to be marked as overdue");
                return;
            }

            logger.info("Found {} tasks that are overdue", overdueTasks.size());

            for (Task task : overdueTasks) {
                try {
                    task.setStatus(Task.TaskStatus.OVERDUE);
                    taskRepository.save(task);
                } catch (Exception e) {
                    logger.error("Error marking task as overdue: {}", task.getId(), e);
                }
            }
        } catch (Exception e) {
            logger.error("Error in scheduled overdue task marking", e);
        }

    }

}