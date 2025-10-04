package com.wamashudu.task_tracker.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.wamashudu.task_tracker.entity.Task;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    
    /**
     * Find tasks by assigned user ID
     */
    List<Task> findByAssignedUserId(Long assignedUserId);
    
    /**
     * Find tasks by status
     */
    List<Task> findByStatus(Task.TaskStatus status);
    
    /**
     * Find tasks by assigned user and status
     */
    List<Task> findByAssignedUserIdAndStatus(Long assignedUserId, Task.TaskStatus status);
    
    /**
     * Find overdue tasks (due date passed and not completed)
     */
    @Query("SELECT t FROM Task t WHERE t.dueDate < :currentDate AND t.status != 'COMPLETED'")
    List<Task> findOverdueTasks(@Param("currentDate") LocalDateTime currentDate);
    
    /**
     * Find tasks that need to be marked as overdue (past due date but not already overdue or completed)
     */
    @Query("SELECT t FROM Task t WHERE t.dueDate < :currentDate AND t.status NOT IN ('COMPLETED', 'OVERDUE')")
    List<Task> findTasksForOverdueUpdate(@Param("currentDate") LocalDateTime currentDate);
    
    /**
     * Find tasks by assigned user ordered by creation date (newest first)
     */
    @Query("SELECT t FROM Task t WHERE t.assignedUserId = :userId ORDER BY t.createdDate DESC")
    List<Task> findByAssignedUserIdOrderByCreatedDateDesc(@Param("userId") Long userId);
    
    /**
     * Find tasks due between specific dates
     */
    @Query("SELECT t FROM Task t WHERE t.dueDate BETWEEN :startDate AND :endDate")
    List<Task> findTasksDueBetween(@Param("startDate") LocalDateTime startDate, 
                                  @Param("endDate") LocalDateTime endDate);
    
    /**
     * Find tasks by title containing (case insensitive search)
     */
    @Query("SELECT t FROM Task t WHERE LOWER(t.title) LIKE LOWER(CONCAT('%', :title, '%'))")
    List<Task> findByTitleContainingIgnoreCase(@Param("title") String title);
    
    /**
     * Find tasks due today for a specific user
     */
    @Query("SELECT t FROM Task t WHERE t.assignedUserId = :userId AND DATE(t.dueDate) = DATE(:today)")
    List<Task> findTasksDueToday(@Param("userId") Long userId, @Param("today") LocalDateTime today);
    
    /**
     * Find tasks due this week for a specific user
     */
    @Query("SELECT t FROM Task t WHERE t.assignedUserId = :userId AND t.dueDate BETWEEN :startOfWeek AND :endOfWeek")
    List<Task> findTasksDueThisWeek(@Param("userId") Long userId, 
                                   @Param("startOfWeek") LocalDateTime startOfWeek,
                                   @Param("endOfWeek") LocalDateTime endOfWeek);
    
    /**
     * Count tasks by status for a specific user
     */
    @Query("SELECT COUNT(t) FROM Task t WHERE t.assignedUserId = :userId AND t.status = :status")
    Long countTasksByUserAndStatus(@Param("userId") Long userId, @Param("status") Task.TaskStatus status);
    
    /**
     * Find unassigned tasks
     */
    @Query("SELECT t FROM Task t WHERE t.assignedUserId IS NULL")
    List<Task> findUnassignedTasks();
    
    /**
     * Find tasks with no due date
     */
    @Query("SELECT t FROM Task t WHERE t.dueDate IS NULL")
    List<Task> findTasksWithoutDueDate();
    
    /**
     * Find completed tasks for a user in a date range
     */
    @Query("SELECT t FROM Task t WHERE t.assignedUserId = :userId AND t.status = 'COMPLETED' AND t.createdDate BETWEEN :startDate AND :endDate")
    List<Task> findCompletedTasksByUserInDateRange(@Param("userId") Long userId,
                                                  @Param("startDate") LocalDateTime startDate,
                                                  @Param("endDate") LocalDateTime endDate);
}