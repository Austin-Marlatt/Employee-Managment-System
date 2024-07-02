// imported modules

// Inquirer 'prompt' allows the user to interact with the CLI 
const { prompt } = require("inquirer");
// Allows a stylized CLI logo to be rendered using standard characters
const logo = require("asciiart-logo");
// Reference to the DataBase
const db = require("./db");

// function that runs the application
init();

// Renders the string as a logo in the CLI
function init() {
  const logoText = logo({ name: "Employee Managment System" }).render();

  console.log(logoText);

  // Runs the function that has the starter prompts
  starterPrompts();
}

// Function that holds the initial prompts that redirect to a referenced function
function starterPrompts() {
  prompt([
    {
      type: "list",
      name: "choice",
      message: "What would you like to do?",
      choices: [
        {
          name: "View All Employees",
          value: "VIEW_EMPLOYEES"
        },
        {
          name: "View All Employees By Department",
          value: "VIEW_EMPLOYEES_BY_DEPARTMENT"
        },
        {
          name: "View All Employees By Manager",
          value: "VIEW_EMPLOYEES_BY_MANAGER"
        },
        {
          name: "Add Employee",
          value: "ADD_EMPLOYEE"
        },
        {
          name: "Remove Employee",
          value: "REMOVE_EMPLOYEE"
        },
        {
          name: "Update Employee Role",
          value: "UPDATE_EMPLOYEE_ROLE"
        },
        {
          name: "Update Employee Manager",
          value: "UPDATE_EMPLOYEE_MANAGER"
        },
        {
          name: "View All Roles",
          value: "VIEW_ROLES"
        },
        {
          name: "Add Role",
          value: "ADD_ROLE"
        },
        {
          name: "Remove Role",
          value: "REMOVE_ROLE"
        },
        {
          name: "View All Departments",
          value: "VIEW_DEPARTMENTS"
        },
        {
          name: "Add Department",
          value: "ADD_DEPARTMENT"
        },
        {
          name: "Remove Department",
          value: "REMOVE_DEPARTMENT"
        },
        {
          name: "View Total Utilized Budget By Department",
          value: "VIEW_UTILIZED_BUDGET_BY_DEPARTMENT"
        },
        {
          name: "Quit",
          value: "QUIT"
        }
      ]
    }
  ]).then(res => {
    let choice = res.choice;
    // Using a switch case, match the chosen option value, to the matching function
    switch (choice) {
      case "VIEW_EMPLOYEES":
        viewEmployees();
        break;
      case "VIEW_EMPLOYEES_BY_DEPARTMENT":
        viewEmployeesByDepartment();
        break;
      case "VIEW_EMPLOYEES_BY_MANAGER":
        viewEmployeesByManager();
        break;
      case "ADD_EMPLOYEE":
        addEmployee();
        break;
      case "REMOVE_EMPLOYEE":
        removeEmployee();
        break;
      case "UPDATE_EMPLOYEE_ROLE":
        updateEmployeeRole();
        break;
      case "UPDATE_EMPLOYEE_MANAGER":
        updateEmployeeManager();
        break;
      case "VIEW_DEPARTMENTS":
        viewDepartments();
        break;
      case "ADD_DEPARTMENT":
        addDepartment();
        break;
      case "REMOVE_DEPARTMENT":
        removeDepartment();
        break;
      case "VIEW_UTILIZED_BUDGET_BY_DEPARTMENT":
        viewUtilizedBudgetByDepartment();
        break;
      case "VIEW_ROLES":
        viewRoles();
        break;
      case "ADD_ROLE":
        addRole();
        break;
      case "REMOVE_ROLE":
        removeRole();
        break;
      default:
        quit();
    }
  }
  )
}

// Returns all Employees in the db, then return the user to the starter prompts <=== this applies to all the functions
function viewEmployees() {
  db.allEmployees()
    .then(([rows]) => {
      let employees = rows;
      console.log("\n");
      console.table(employees);
    })
    .then(() => starterPrompts());
}

// View all employees related to a department
function viewEmployeesByDepartment() {
  // First, retrieve all dapartments
  db.allDepartments()
    .then(([rows]) => {
      let departments = rows;
      const departmentChoices = departments.map(({ id, name }) => ({
        name: name,
        value: id
      }));
      // Prompt the user to choose one department to query
      prompt([
        {
          type: "list",
          name: "departmentId",
          message: "Which department would you like to see employees for?",
          choices: departmentChoices
        }
      ])
        // Then run the function to find all employees, passing in the department id from the chosen option
        .then(res => db.allEmployeesInDepartment(res.departmentId))
        .then(([rows]) => {
          let employees = rows;
          console.log("\n");
          console.table(employees);
        })
        .then(() => starterPrompts())
    });
}

// Returns all employees related to a single manager
function viewEmployeesByManager() {
  // First, return all managers to choose from
  db.allEmployees()
    .then(([rows]) => {
      let managers = rows;
      const managerChoices = managers.map(({ id, first_name, last_name }) => ({
        name: `${first_name} ${last_name}`,
        value: id
      }));
      // Prompt the user to choose one department to query
      prompt([
        {
          type: "list",
          name: "managerId",
          message: "Which employee do you want to see direct reports for?",
          choices: managerChoices
        }
      ])
        // Then run the function to find all employees related to the selected manager, passing in the managers id
        .then(res => db.findAllEmployeesByManager(res.managerId))
        .then(([rows]) => {
          let employees = rows;
          console.log("\n");
          if (employees.length === 0) {
            console.log("The selected employee does not manage anyone.");
          } else {
            console.table(employees);
          }
        })
        .then(() => starterPrompts())
    });
}

// Removes an employee from the db
function removeEmployee() {
  // Return all available employees
  db.allEmployees()
    .then(([rows]) => {
      let employees = rows;
      const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
        name: `${first_name} ${last_name}`,
        value: id
      }));
      // Prompt the user with available options
      prompt([
        {
          type: "list",
          name: "employeeId",
          message: "Which employee do you want to remove?",
          choices: employeeChoices
        }
      ])
        // Run the remove employee function with the chosen employees id
        .then(res => db.removeEmployee(res.employeeId))
        .then(() => console.log("Removed employee from the database"))
        .then(() => starterPrompts())
    })
}

// assign a role to an employee
function updateEmployeeRole() {
  // return all available employees
  db.allEmployees()
    .then(([rows]) => {
      let employees = rows;
      const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
        name: `${first_name} ${last_name}`,
        value: id
      }));
      // prompt the user with available employees to choose from
      prompt([
        {
          type: "list",
          name: "employeeId",
          message: "Which employee's role do you want to update?",
          choices: employeeChoices
        }
      ])
        // Prompt the user with available roles to assign
        .then(res => {
          let employeeId = res.employeeId;
          db.allRoles()
            .then(([rows]) => {
              let roles = rows;
              const roleChoices = roles.map(({ id, title }) => ({
                name: title,
                value: id
              }));
              // Assign chosen role to chosen employee
              prompt([
                {
                  type: "list",
                  name: "roleId",
                  message: "Which role do you want to assign the selected employee?",
                  choices: roleChoices
                }
              ])
                .then(res => db.updateEmployeeRole(employeeId, res.roleId))
                .then(() => console.log("Updated employee's role"))
                .then(() => starterPrompts())
            });
        });
    })
}

// Update an employee's manager
function updateEmployeeManager() {
  // Return all employees
  db.allEmployees()
    .then(([rows]) => {
      let employees = rows;
      const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
        name: `${first_name} ${last_name}`,
        value: id
      }));
      // prompt the user to choose which employee to assign a new manger to
      prompt([
        {
          type: "list",
          name: "employeeId",
          message: "Which employee's manager do you want to update?",
          choices: employeeChoices
        }
      ])
      // Then, return all other employees besides the chosen one for manager options
        .then(res => {
          let employeeId = res.employeeId
          db.allPossibleManagers(employeeId)
            .then(([rows]) => {
              let managers = rows;
              const managerChoices = managers.map(({ id, first_name, last_name }) => ({
                name: `${first_name} ${last_name}`,
                value: id
              }));
              // Select an employee from the list to assign to the first employee chosen
              prompt([
                {
                  type: "list",
                  name: "managerId",
                  message:
                    "Which employee do you want to set as manager for the selected employee?",
                  choices: managerChoices
                }
              ])
                .then(res => db.updateEmployeeManager(employeeId, res.managerId))
                .then(() => console.log("Updated employee's manager"))
                .then(() => starterPrompts())
            })
        })
    })
}

// Returns all roles
function viewRoles() {
  db.allRoles()
    .then(([rows]) => {
      let roles = rows;
      console.log("\n");
      console.table(roles);
    })
    .then(() => starterPrompts());
}

// Add a new role
function addRole() {
  // Return all departments
  db.allDepartments()
    .then(([rows]) => {
      let departments = rows;
      const departmentChoices = departments.map(({ id, name }) => ({
        name: name,
        value: id
      }));
      // Prompt the user to assign a title and salary to this role and what department it will be attached to
      prompt([
        {
          name: "title",
          message: "What is the name of the role?"
        },
        {
          name: "salary",
          message: "What is the salary of the role?"
        },
        {
          type: "list",
          name: "department_id",
          message: "Which department does the role belong to?",
          choices: departmentChoices
        }
      ])
      // Passes the reponse object to the create role function
        .then(role => {
          db.createRole(role)
            .then(() => console.log(`Added ${role.title} to the database`))
            .then(() => starterPrompts())
        })
    })
}

// Deletes a role
function removeRole() {
  //  Return all available roles
  db.allRoles()
    .then(([rows]) => {
      let roles = rows;
      const roleChoices = roles.map(({ id, title }) => ({
        name: title,
        value: id
      }));
      // Prompt the user to choose a role to delete
      prompt([
        {
          type: "list",
          name: "roleId",
          message:
            "Which role do you want to remove?",
          choices: roleChoices
        }
      ])
      // Run the reomve role function with the chosen roles id passed in
        .then(res => db.removeRole(res.roleId))
        .then(() => console.log("Removed role from the database"))
        .then(() => starterPrompts())
    })
}

// View all deparments
function viewDepartments() {
  // returns all departments
  db.allDepartments()
    .then(([rows]) => {
      let departments = rows;
      console.log("\n");
      console.table(departments);
    })
    .then(() => starterPrompts());
}

// Add a new department
function addDepartment() {
  // Prompt the user for a new department name
  prompt([
    {
      name: "name",
      message: "What is the name of the new department?"
    }
  ])
    // Run the create department function with the name passed in
    .then(res => {
      let name = res;
      db.createDepartment(name)
        .then(() => console.log(`Added ${name.name} to the database`))
        .then(() => starterPrompts())
    })
}

// Deletes a department
function removeDepartment() {
  // Return all departments to choose from
  db.allDepartments()
    .then(([rows]) => {
      let departments = rows;
      const departmentChoices = departments.map(({ id, name }) => ({
        name: name,
        value: id
      }));
      // prompt the user to choose a department to delete
      prompt({ 
        type: "list",
        name: "departmentId",
        message:
          "Which department would you like to remove? (Warning: This will also remove associated roles and employees)",
        choices: departmentChoices
      })
        // Run the delete department function with the chosen departments id passed in
        .then(res => db.removeDepartment(res.departmentId))
        .then(() => console.log(`Removed department from the database`))
        .then(() => starterPrompts())
    })
}

// View all departments and show their total utilized department budget
function viewUtilizedBudgetByDepartment() {
  db.viewAllDepartmentBudgets()
  // This function returns all departments with their associated roles salaries added up to provide the departments budget 
    .then(([rows]) => {
      let departments = rows;
      console.log("\n");
      console.table(departments);
    })
    .then(() => starterPrompts());
}

// Adds an employee
function addEmployee() {
  // Prompt the user for the new employees first and last name
  prompt([
    {
      name: "first_name",
      message: "What is the employee's first name?"
    },
    {
      name: "last_name",
      message: "What is the employee's last name?"
    }
  ])
    .then(res => {
      let firstName = res.first_name;
      let lastName = res.last_name;
      // Return all availbe roles
      db.allRoles()
        .then(([rows]) => {
          let roles = rows;
          const roleChoices = roles.map(({ id, title }) => ({
            name: title,
            value: id
          }));
          // Prompt the user to assign the new employee a role
          prompt({
            type: "list",
            name: "roleId",
            message: "What is the employee's role?",
            choices: roleChoices
          })
            .then(res => {
              let roleId = res.roleId;
              // Return all possible manager choices
              db.allEmployees()
                .then(([rows]) => {
                  let employees = rows;
                  const managerChoices = employees.map(({ id, first_name, last_name }) => ({
                    name: `${first_name} ${last_name}`,
                    value: id
                  }));
                  // Ovewrite the original array so we just have the managers id
                  managerChoices.unshift({ name: "None", value: null });
                  // Prompt the user to choose a manager for the new employee
                  prompt({
                    type: "list",
                    name: "managerId",
                    message: "Who is the employee's manager?",
                    choices: managerChoices
                  })
                    // Build an employee object with the required fields
                    .then(res => {
                      let employee = {
                        manager_id: res.managerId,
                        role_id: roleId,
                        first_name: firstName,
                        last_name: lastName
                      }
                      // Run the create employee function with the employee object passed in as a variable
                      db.createNewEmployee(employee);
                    })
                    .then(() => console.log(
                      `Added ${firstName} ${lastName} to the database`
                    ))
                    .then(() => starterPrompts())
                })
            })
        })
    })
}

// Exit the application
function quit() {
  console.log("Goodbye!");
  process.exit();
}
