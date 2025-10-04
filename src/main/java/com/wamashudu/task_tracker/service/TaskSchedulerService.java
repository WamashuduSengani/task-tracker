package com.wamashudu.task_tracker.service;

import com.wamashudu.task_tracker.entity.Task;
import com.wamashudu.task_tracker.repository.TaskRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TaskSchedulerService {

    private static final Logger logger = LoggerFactory.getLogger(TaskSchedulerService.class);

    private final TaskRepository taskRepository;

    @Value("${app.scheduler.task-overdue.enabled:true}")
    private boolean schedulerEnabled;

    public TaskSchedulerService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    /**
     * Scheduled task that runs every hour to check for overdue tasks
     * Cron expression: "0 0 * * * *" means at minute 0 of every hour
     * Can be configured via application properties: app.scheduler.task-overdue.cron
     */
    @Scheduled(cron = "${app.scheduler.task-overdue.cron:0 0 * * * *}")
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

            int updatedCount = 0;
            for (Task task : overdueTasks) {
                try {
                    task.setStatus(Task.TaskStatus.OVERDUE);
                    taskRepository.save(task);
                    updatedCount++;
                    
                    logger.debug("Marked task '{}' (ID: {}) as OVERDUE. Due date was: {}", 
                                task.getTitle(), task.getId(), task.getDueDate());
                } catch (Exception e) {
                    logger.error("Failed to update task '{}' (ID: {}) to OVERDUE status: {}", 
                                task.getTitle(), task.getId(), e.getMessage(), e);
                }
            }

            logger.info("Successfully marked {} out of {} tasks as OVERDUE", updatedCount, overdueTasks.size());

        } catch (Exception e) {
            logger.error("Error occurred during scheduled overdue task processing: {}", e.getMessage(), e);
        }
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
}