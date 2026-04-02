import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EmployeeList from './components/EmployeeList';
import EmployeeForm from './components/EmployeeForm';
import './App.css';

const API_BASE_URL = 'http://localhost:8080/api/employees';

function App() {
  const [employees, setEmployees] = useState([]);
  const [editingEmployee, setEditingEmployee] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(API_BASE_URL);
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const addEmployee = async (employee) => {
    try {
      const response = await axios.post(API_BASE_URL, employee);
      setEmployees([...employees, response.data]);
    } catch (error) {
      console.error('Error adding employee:', error);
    }
  };

  const updateEmployee = async (id, employee) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/${id}`, employee);
      setEmployees(employees.map(emp => emp.id === id ? response.data : emp));
      setEditingEmployee(null);
    } catch (error) {
      console.error('Error updating employee:', error);
    }
  };

  const deleteEmployee = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/${id}`);
      setEmployees(employees.filter(emp => emp.id !== id));
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  };

  const startEditing = (employee) => {
    setEditingEmployee(employee);
  };

  const cancelEditing = () => {
    setEditingEmployee(null);
  };

  return (
    <div className="App">
      <h1>Employee CRUD</h1>
      <EmployeeForm
        onAdd={addEmployee}
        onUpdate={updateEmployee}
        editingEmployee={editingEmployee}
        onCancel={cancelEditing}
      />
      <EmployeeList
        employees={employees}
        onEdit={startEditing}
        onDelete={deleteEmployee}
      />
    </div>
  );
}

export default App;
