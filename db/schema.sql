-- File that sets the layout of the DataBase

-- Before the database is created, delete one of the same name, if it exists
-- This command is exclusively for development purposes
DROP DATABASE IF EXISTS employees;
CREATE DATABASE employees;

-- Set the current SQL enviroment to focus on this DataBase,
-- All subsequent commands will only effect this DataBase
USE employees;

-- Creates a table for 'department'
-- column 1: id, must be a positive number, all iterations will have a incremented id, this will be used as a primary key to reference this Table
-- column 2: Name, can be any character, up to 30 characters, must not match any other entry in this table, must have a value passed to create an entry
CREATE TABLE department (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(30) UNIQUE NOT NULL
);

-- Creates a table for 'role'
-- column 1: id, must be a positive number, all iterations will have a incremented id, this will be used as a primary key to reference this Table
-- column 2: title, can be any character, up to 30 characters, must not match any other entry on this table, must have a value passed to create an entry
-- column 3: salary, alcolumns a fixed point, exact number, must have a value passed to create an entry
-- column 4: department_id, foreign key to link to the department table, must be a positive number, must have a value passed to create an entry
-- column 5: Adds an Index for faster querying
-- column 6: Constraint is used to specify rules for the table, referenced column in the referenced table, The referenced table, When a column is deleted from a parent table, all columns in the child table that reference the deleted column should also be deleted
CREATE TABLE role (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(30) UNIQUE NOT NULL,
  salary DECIMAL UNSIGNED NOT NULL,
  department_id INT UNSIGNED NOT NULL,
  INDEX dep_ind (department_id),
  CONSTRAINT fk_department FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE CASCADE
);

-- Creates a table for 'employee'
-- column 1: id, must be a positive number, all iterations will have a incremented id, this will be used as a primary key to reference this table
-- column 2: first_name, can be any character, up to 30 characters, must have a value passed to create an entry
-- column 3: last_name, can be any character, up to 30 characters, must have a value passed to create an entry
-- column 4: role_id, foreign key to link to the role table, must be a positive number, must have a value passed to create an entry
-- column 5: Adds an index for faster querying
-- column 6: Constraint is used to specify rules for the table, referenced column in the referenced table, The referenced table, When a column is deleted from a parent table, all columns in the child table that reference the deleted column should also be deleted
CREATE TABLE employee (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT UNSIGNED NOT NULL,
  INDEX role_ind (role_id),
  CONSTRAINT fk_role FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE CASCADE,
  manager_id INT UNSIGNED,
  INDEX man_ind (manager_id),
  CONSTRAINT fk_manager FOREIGN KEY (manager_id) REFERENCES employee(id) ON DELETE SET NULL
);