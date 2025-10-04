package com.wamashudu.task_tracker.controller;

import com.wamashudu.task_tracker.service.TaskSchedulerService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AdminController {

    private final TaskSchedulerService taskSchedulerService;

    public AdminController(TaskSchedulerService taskSchedulerService) {
        this.taskSchedulerService = taskSchedulerService;
    }

    /**
     * Manual trigger for overdue task check - Admin only
     * Useful for testing and immediate processing without waiting for scheduled execution
     */
    @PostMapping("/tasks/check-overdue")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> triggerOverdueTaskCheck() {
        try {
            int updatedCount = taskSchedulerService.triggerOverdueTaskCheck();
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Overdue task check completed successfully",
                "tasksUpdated", updatedCount
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                "success", false,
                "message", "Failed to process overdue tasks: " + e.getMessage(),
                "tasksUpdated", 0
            ));
        }
    }

    /**
     * Get scheduler status and configuration - Admin only
     */
    @GetMapping("/scheduler/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getSchedulerStatus() {
        return ResponseEntity.ok(Map.of(
            "schedulerEnabled", true,
            "cronExpression", "${app.scheduler.task-overdue.cron:0 0 * * * *}",
            "description", "Task overdue scheduler runs every hour to mark overdue tasks"
        ));
    }
}