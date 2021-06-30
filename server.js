const mysql = require('mysql2');
const inquirer = require('inquirer');
const chalk = require('chalk');
require('console.table');
require('dotenv').config();

const con = mysql.createConnection({
  host: process.env.DB_HOST,
  port: '3306',
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: 'employees_db'
});

// establish connection to db to make sure app is running correctly
con.connect((err) => {
  if (err) throw err;
  init();
});

// start questions prompt
const init = async function () {
  await inquirer.prompt([{
    type: 'list',
    name: 'options',
    message: chalk.yellow('What would you like to do?'),
    choices: [
      new inquirer.Separator(),
      chalk.cyan('View All Departments'),
      chalk.cyan('Add A Department'),
      chalk.cyan('Delete A Department'),
      new inquirer.Separator(),
      chalk.green('View All Roles'),
      chalk.green('Add A Role'),
      chalk.green('Delete A Role'),
      new inquirer.Separator(),
      chalk.magenta('View All Employees'),
      chalk.magenta('View Employees by Department'),
      chalk.magenta('Add An Employee'),
      chalk.magenta('Delete An Employee'),
      new inquirer.Separator(),
      chalk.bold.red('EXIT'),
    ],
  }]).then(function (res) {
    switch (res.options) {
      case chalk.cyan('View All Departments'):
        viewDepartments();
        break;
      case chalk.cyan('Add A Department'):
        addDepartment();
        break;
      case chalk.cyan('Delete A Department'):
        deleteDepartment();
        break;
      case chalk.green('View All Roles'):
        viewRoles();
        break;
      case chalk.green('Add A Role'):
        addRole();
        break;
      case chalk.green('Delete A Role'):
        deleteRole();
        break;
      case chalk.magenta('View All Employees'):
        viewEmployees();
        break;
      case chalk.magenta('View Employees by Department'):
        viewEmployeesByDept();
        break;
      case chalk.magenta('Add An Employee'):
        addEmployee();
        break;
      case chalk.magenta('Delete An Employee'):
        deleteEmployee();
        break;
      case chalk.bold.red('EXIT'):
        exitApp();
        break;
    }
  })
}

const viewDepartments = function () {
  con.query('SELECT * FROM departments',
    (err, res) => {
      if (err) throw err;
      if (res.length === 0) {
        console.log(chalk.dim.red('No departments added yet'));
      } else {
        console.table('Departments:', res);
      }
      init();
    })
}

const addDepartment = function () {
  inquirer.prompt([{
    type: 'input',
    name: 'deptName',
    message: 'Please enter a name for the department',
    validate: (input) => {
      if (!input) {
        console.log(chalk.bold.red('A name is required for new departments'));
        return false;
      } else {
        return true;
      }
    }
  }]).then(function (res) {
    let departmentName = res.deptName
    con.query('INSERT INTO departments SET ?', {
      name: departmentName
    });
    console.log(chalk.cyan(`Department '${departmentName.toLowerCase()}' has been added`));
    init();
  })
}

const deleteDepartment = function () {
  con.query('SELECT departments.id, departments.name FROM departments',
    async (err, res) => {
      if (err) throw err;
      if (await res.length === 0) {
        console.log(chalk.dim.red('No departments to delete'));
        init();
      } else {
        let deptNamesArr = [];
        res.forEach((departments) => {
          deptNamesArr.push(departments.name);
        });
        await inquirer.prompt([{
          type: 'list',
          name: 'deletedDept',
          message: chalk.dim.cyan('Please choose a department to remove'),
          choices: deptNamesArr
        }]).then(async (response) => {
          let deptId;
          await res.forEach((departments) => {
            if (response.deletedDept === departments.name) {
              deptId = departments.id;
            }
          })
          con.query('DELETE FROM departments WHERE departments.id = ?',
            [deptId], (err) => {
              if (err) throw err;
              console.log(chalk.cyan('Department successfully deleted'));
              init();
            })
        })
      }
    })
}

const viewRoles = function () {
  con.query('SELECT * FROM roles',
    (err, res) => {
      if (err) throw err;
      if (res.length === 0) {
        console.log(chalk.dim.red('No roles added yet'));
      } else {
        console.table('Roles:', res);
      }
      init();
    })
}

const addRole = function () {
  con.query('SELECT * FROM departments',
  (err, res) => {
    if (err) throw err;
    inquirer.prompt([
      {
        type: 'input',
        name: 'roleName',
        message: 'Please enter a name for the new role.',
        validate: (input) => {
          if (!input) {
            console.log(chalk.bold.red('A name is required for new roles'));
            return false;
          } else {
            return true;
          }
        }
      },
      {
        type: 'input',
        name: 'roleSalary',
        message: `Please enter a salary for this role (no '$' needed)`,
        validate: (input) => {
          if (isNaN(input)) {
            console.log(chalk.dim.red('Please enter the number only for salary'))
            return false;
          } else {
            return true;
          }
        }
      },
      {
        type: 'list',
        name: 'roleDepartment',
        message: 'Please select a department to assign this role to',
        choices: function() {
          var deptsArr = [];
          for (i = 0; i < res.length; i++) {
            deptsArr.push(res[i].name);
          }
          return deptsArr;
        }
      }
    ]).then((response) => {
      let departmentId;
      for (n = 0; n < res.length; n++) {
        if (res[n].name == response.roleDepartment) {
          departmentId = res[n].id;
        }
      }
      con.query('INSERT INTO roles SET ?',
      {
        title: response.roleName,
        salary: response.roleSalary,
        departments_id: departmentId
      }, (err) => {
        if (err) throw err;
        console.log(chalk.green(`Role '${response.roleName}' has been added`));
        init();
      })
    })
  })
}

const deleteRole = function () {
  con.query('SELECT roles.id, roles.title FROM roles',
  async (err, res) => {
    if (err) throw err;
    if (await res.length === 0) {
      console.log(chalk.dim.red('No roles to delete'));
      init();
    } else {
      let rolesTitleArr = [];
      res.forEach((roles) => {
        rolesTitleArr.push(roles.title);
      });
      await inquirer.prompt([{
        type: 'list',
        name: 'deletedRole',
        message: chalk.dim.green('Please choose a role to remove'),
        choices: rolesTitleArr
      }]).then(async (response) => {
        let roleId;
        await res.forEach((roles) => {
          if (response.deletedRole === roles.title) {
            roleId = roles.id;
          }
        })
        con.query('DELETE FROM roles WHERE roles.id = ?',
          [roleId], (err) => {
            if (err) throw err;
            console.log(chalk.green('Role successfully deleted'));
            init();
          })
      })
    }
  })
}

const viewEmployees = function () {
  con.query('SELECT * FROM employees',
  (err, res) => {
    if (err) throw err;
    if (res.length === 0) {
      console.log(chalk.dim.red('No employees added yet'));
    } else {
      console.table('Employees:', res);
    }
    init();
  })
}

const viewEmployeesByDept = function() {
  const query = `SELECT employees.first_name, employees.last_name, departments.name AS departments FROM employees LEFT JOIN roles ON employees.roles_id = roles.id LEFT JOIN departments ON roles.departments_id = departments.id`;
  con.query(query, (err, res) => {
    if (err) throw err;
    if (res.length === 0) {
      console.log(chalk.dim.red('No employees added yet'));
    } else {
      console.table('Employees by Department:', res);
    }
    init();
  })
}

const addEmployee = function () {
  inquirer.prompt([
    {
      type: 'input',
      name: 'firstName',
      message: chalk.magenta(`Please enter the employee's first name`),
      validate: (input) => {
        if (input) {
          return true;
        } else {
          console.log(chalk.dim.red('A first name is required to add an employee'));
          return false;
        }
      }
    },
    {
      type: 'input',
      name: 'lastName',
      message: chalk.magenta(`Please enter the employee's last name`),
      validate: (input) => {
        if (input) {
          return true;
        } else {
          console.log(chalk.dim.red('A last name is require to add an employee'));
          return false;
        }
      }
    }
  ]).then((response) => {
    const emp = [response.firstName, response.lastName];
    con.query('SELECT roles.id, roles.title FROM roles',
    async (err, res) => {
      if (err) throw err;
      const roles = await res.map(({ id, title }) => ({name: title, value: id}));
      await inquirer.prompt([
        {
          type: 'list',
          name: 'empRole',
          message: chalk.magenta('Please choose a role for the employee'),
          choices: roles
        }
      ]).then((selection) => {
        const employeeRole = selection.empRole;
        emp.push(employeeRole);
        con.query('SELECT * FROM employees',
        async (err, res) => {
          if (err) throw err;
          const managers = await res.map(({ id, first_name, last_name, }) => ({ name: first_name + " " + last_name, value: id }));
          inquirer.prompt([
            {
              type: 'list',
              name: 'empManager',
              message: chalk.magenta('Please select a manager for the employee'),
              choices: managers
            }
          ]).then((selection) => {
            const employeeManager = selection.empManager;
            emp.push(employeeManager);
            con.query('INSERT INTO employees (first_name, last_name, roles_id, manager_id) VALUES (?, ?, ?, ?)',
            emp, (err) => {
              if (err) throw err;
              console.log(chalk.magenta(`Employee successfully added`));
              init();
            })
          })
        })
      })
    })
  })
}

const deleteEmployee = function () {
  con.query('SELECT employees.id, employees.first_name, employees.last_name FROM employees',
  async (err, res) => {
    if (err) throw err;
    if (await res.length === 0) {
      console.log(chalk.dim.red('No employees to delete'));
      init();
    } else {
      let empNameArr = [];
      res.forEach((employees) => {
        empNameArr.push(`${employees.first_name} ${employees.last_name}`);
      })
      await inquirer.prompt([
        {
          type: 'list',
          name: 'deletedEmployee',
          message: chalk.dim.magenta('Please select an employee to delete'),
          choices: empNameArr
        }
      ]).then(async (response) => {
        let empId;
        await res.forEach((employees) => {
          if (response.deletedEmployee === `${employees.first_name} ${employees.last_name}`) {
            empId = employees.id;
          }
        })
        con.query('DELETE FROM employees WHERE employees.id = ?',
        [empId], (err) => {
          if (err) throw err;
          console.log(chalk.magenta('Employee successfully deleted'));
          init();
        })
      })
    }
  })
}

const exitApp = function () {
  con.end();
}