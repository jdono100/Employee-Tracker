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

// establish connection to db to make sure app runs correctly
con.connect((err) => {
    if (err) throw err;
    init();
});

// start questions prompt
const init = async function() {
    await inquirer.prompt([
        {
            type: 'list',
            name: 'options',
            message: chalk.yellow('What would you like to do?'),
            choices: [
                new inquirer.Separator(),
                chalk.blue('View All Departments'),
                chalk.blue('Add A Department'),
                chalk.blue('Delete A Department'),
                new inquirer.Separator(),
                chalk.green('View All Roles'),
                chalk.green('Add A Role'),
                chalk.green('Delete A Role'),
                new inquirer.Separator(),
                chalk.magenta('View All Employees'),
                chalk.magenta('Add An Employee'),
                chalk.magenta('Delete An Employee'),
                new inquirer.Separator(),
                chalk.red('EXIT'),
            ],
        }
    ]).then(function(res) {
        switch (res.options) {
            case chalk.blue('View All Departments'):
                viewDepartments();
                break;
            case chalk.blue('Add A Department'):
                addDepartment();
                break;
            case chalk.blue('Delete A Department'):
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
            case chalk.magenta('Add An Employee'):
                addEmployee();
                break;
            case chalk.magenta('Delete An Employee'):
                deleteEmployee();
                break;
            case chalk.red('EXIT'):
                exitApp();
                break;
        }
    })
}

const exitApp = function() {
    con.end();
}