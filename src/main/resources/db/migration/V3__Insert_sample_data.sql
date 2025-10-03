
INSERT INTO users (username, email, password_hash, role) 
VALUES ('admin', 'admin@tasktracker.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'ADMIN');

INSERT INTO users (username, email, password_hash, role) 
VALUES ('user1', 'user1@tasktracker.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'USER');

INSERT INTO tasks (title, description, status, assigned_user_id, due_date) 
VALUES 
    ('Fetch Amu from daycare', 'Pick up Amu from Little Stars Daycare at 5:30 PM', 'COMPLETED', 1, '2025-10-02 17:30:00'),
    ('Go to the car wash', 'Take the car to Quick Clean car wash on Main Street', 'COMPLETED', 1, '2025-10-01 14:00:00'),
    ('Go to the gym', 'Workout session - focus on cardio and upper body', 'IN_PROGRESS', 1, '2025-10-03 18:00:00'),
    ('Clean the house', 'Deep clean living room, kitchen, and bathrooms', 'NEW', 2, '2025-10-04 10:00:00'),
    ('Grocery shopping', 'Buy groceries for the week - milk, bread, vegetables, and fruits', 'NEW', 2, '2025-10-05 16:00:00'),
    ('Pay electricity bill', 'Monthly electricity bill payment - due before 10th', 'NEW', 1, '2025-10-08 23:59:00'),
    ('Call mom', 'Weekly check-in call with mom to catch up', 'DELAYED', 2, '2025-10-02 19:00:00')

