// file that holds all of our query functions

// Imported connection to the db
const connection = require("./connection");

// class Constructor that holds our querys so they can be exported in one module
class DB {

  constructor(connection) {
    // storing the connection to the db for future reference
    this.connection = connection;
  }

  // Returns all Employees with their: roles, salaries, Departments, and managers attached
  allEmployees() {
    return this.connection.promise().query(
      "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;"
    )
  }

  // Creates a new employee
  createNewEmployee(employee) {
    return this.connection.promise().query("INSERT INTO employee SET ?", employee);
  }

  // Remove an employee by id
  removeEmployee(employeeId) {
    return this.connection.promise().query(
      "DELETE FROM employee WHERE id = ?",
      employeeId
    );
  }

  // Find all managers that can be assigned to a single employee,
  // Does not return the passed employee id
    allPossibleManagers(employeeId) {
    return this.connection.promise().query(
      "SELECT id, first_name, last_name FROM employee WHERE id != ?",
      employeeId
    );
  }

  // Update an employees manager
  // takes in the given employess id, and the id of the assigned manager
    updateEmployeeManager(employeeId, managerId) {
    return this.connection.promise().query(
      "UPDATE employee SET manager_id = ? WHERE id = ?",
      [managerId, employeeId]
    );
  }

  // Update the passed Employee's role,
  // exepts the given employees id and the role you want to add
    updateEmployeeRole(employeeId, roleId) {
      return this.connection.promise().query(
        "UPDATE employee SET role_id = ? WHERE id = ?",
        [roleId, employeeId]
      );
    }

  // Find all roles, join with departments to display the department name as well
  // Retruns the role and departmenty name, and the salary for the role
  allRoles() {
    return this.connection.promise().query(
      "SELECT role.id, role.title, department.name AS department, role.salary FROM role LEFT JOIN department on role.department_id = department.id;"
    );
  }

  // Creates a new role
  // exepts an object with a title, salary, and department id
  createRole(role) {
    return this.connection.promise().query("INSERT INTO role SET ?", role);
  }

  // Remove a role from the db
  // exepts a role Id
  removeRole(roleId) {
    return this.connection.promise().query("DELETE FROM role WHERE id = ?", roleId);
  }

  // returns all department names
  allDepartments() {
    return this.connection.promise().query(
      "SELECT department.id, department.name FROM department;"
    );
  }

  // Creates a new department
  // Exepts a name as a string
  createDepartment(department) {
    return this.connection.promise().query("INSERT INTO department SET ?", department);
  }

  // Removes a department
  // Exepts the department id
  removeDepartment(departmentId) {
    return this.connection.promise().query(
      "DELETE FROM department WHERE id = ?",
      departmentId
    );
  }

  // Returns all employees in a department, joins with roles to return employees with their roles as well
  // Excepts the id of the searched department 
  allEmployeesInDepartment(departmentId) {
    return this.connection.promise().query(
      "SELECT employee.id, employee.first_name, employee.last_name, role.title FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department department on role.department_id = department.id WHERE department.id = ?;",
      departmentId
    );
  }

  // Returns all departments, returns employees and roles
  // Returns the sum of all roles salaries in a department to provide the departments budget
    viewAllDepartmentBudgets() {
    return this.connection.promise().query(
      "SELECT department.id, department.name, SUM(role.salary) AS utilized_budget FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id GROUP BY department.id, department.name;"
    );
  }

  // Returns all employees sorted by the passed manager id, 
  // Joins with departments and roles to display titles and department names
  findAllEmployeesByManager(managerId) {
    return this.connection.promise().query(
      "SELECT employee.id, employee.first_name, employee.last_name, department.name AS department, role.title FROM employee LEFT JOIN role on role.id = employee.role_id LEFT JOIN department ON department.id = role.department_id WHERE manager_id = ?;",
      managerId
    );
  }
}

//Export a new instance of the above class with the connection variable passed in
module.exports = new DB(connection);