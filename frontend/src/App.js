import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EmployeeList from './components/EmployeeList';
import EmployeeForm from './components/EmployeeForm';
import './App.css';

const API_BASE_URL = 'http://localhost:8080/api/employees';

function App() {
  const [employees, setEmployees] = useState([]);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(API_BASE_URL);
      setEmployees(response.data);
    } catch (error) {
      showNotification('Error fetching employees: ' + (error.response?.data?.message || error.message), 'error');
    }
  };

  const addEmployee = async (employee) => {
    try {
      const response = await axios.post(API_BASE_URL, employee);
      setEmployees([...employees, response.data]);
      showNotification(`Employee ${response.data.name} added successfully!`);
    } catch (error) {
      showNotification('Error adding employee: ' + (error.response?.data?.message || error.message), 'error');
    }
  };

  const updateEmployee = async (id, employee) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/${id}`, employee);
      setEmployees(employees.map(emp => emp.id === id ? response.data : emp));
      setEditingEmployee(null);
      showNotification(`Employee ${response.data.name} updated successfully!`);
    } catch (error) {
      showNotification('Error updating employee: ' + (error.response?.data?.message || error.message), 'error');
    }
  };

  const deleteEmployee = async (id) => {
    try {
      const empName = employees.find(e => e.id === id)?.name;
      await axios.delete(`${API_BASE_URL}/${id}`);
      setEmployees(employees.filter(emp => emp.id !== id));
      showNotification(`Employee ${empName} deleted successfully!`);
    } catch (error) {
      showNotification('Error deleting employee: ' + (error.response?.data?.message || error.message), 'error');
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
      <h1>🏢 Employee Management System</h1>
      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}
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
