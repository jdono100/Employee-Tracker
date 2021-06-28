DROP DATABASE IF EXISTS employees_db;
CREATE DATABASE employees_db;
USE employees_db;

CREATE TABLE departments(
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL
);

CREATE TABLE roles(
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(50) NOT NULL,
    salary DECIMAL NOT NULL,
    departments_id INTEGER NOT NULL,
    CONSTRAINT fk_departments FOREIGN KEY (departments_id) REFERENCES departments(id)
);

CREATE TABLE employees(
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    roles_id INTEGER NOT NULL,
    CONSTRAINT fk_roles FOREIGN KEY (roles_id) REFERENCES roles(id),
);

SELECT * FROM departments;
SELECT * FROM roles;
SELECT * FROM employees;