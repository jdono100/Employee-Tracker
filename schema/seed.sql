INSERT INTO departments(name)
VALUES ("Engineering"), ("Sales"), ("Human Resources"), ("Marketing");

INSERT INTO roles(title, salary, departments_id)
VALUES ("Front-End", 75000, 1), ("Back-End", 80000, 1), ("Salesperson", 52500, 2), ("HR Manager", 66000, 3), ("Product Marketing Manager", 64000, 4);

INSERT INTO employees(first_name, last_name, roles_id, manager_id)
VALUES ("Jared", "Donovan", 1, null), ("Anthony", "Krueger", 2, null), ("Matt", "Robbins", 3, 1), ("Amanda", "Sherry", 4, 2), ("John", "Novak", 5, 1);