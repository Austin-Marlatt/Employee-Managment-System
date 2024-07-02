-- File provides data for seeding the database

-- use the employees database
use employees;

-- insert data into the 'department' table, 'name' column
INSERT INTO department
    (name)
VALUES
    ('Care Team'),
    ('Administartion'),
    ('Engineering');

-- insert data into the 'role' table, 'title, salary, department_id' columns
INSERT INTO role
    (title, salary, department_id)
VALUES
    ('Doctor', 220000, 1),
    ('Nurse', 80000, 1),
    ('CNA', 50000, 1),
    ('Medical Assistant', 44000, 1),
    ('Rad Tech', 75000, 1),
    ('Billing', 60000, 2),
    ('Head Engineer', 110000, 3),
    ('Engineer', 85000, 3);

-- insert data into the 'employee' table, 'first_name, last_name, role_id, manager_id' columns
INSERT INTO employee
    (first_name, last_name, role_id, manager_id)
VALUES
    ('Doctor', 'Mike', 1, NULL),
    ('Sam', 'Fisher', 2, 1),
    ('Barbra', 'McElroy', 2, 1),
    ('Robert', 'Smith', 3, 2),
    ('Sarah', 'Connor', 4, 2),
    ('Megan', 'Slater', 5, NULL),
    ('Tom', 'Riddle', 6, NULL),
    ('Paul', 'Allen', 7, NULL);
    ('Patrick', 'Bateman', 8, 7)
