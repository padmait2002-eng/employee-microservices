import React, { useState, useEffect } from 'react';

const EmployeeForm = ({ onAdd, onUpdate, editingEmployee, onCancel }) => {
  const [employee, setEmployee] = useState({ name: '', department: '', salary: '' });

  useEffect(() => {
    if (editingEmployee) {
      setEmployee(editingEmployee);
    } else {
      setEmployee({ name: '', department: '', salary: '' });
    }
  }, [editingEmployee]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee({ ...employee, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingEmployee) {
      onUpdate(editingEmployee.id, employee);
    } else {
      onAdd(employee);
    }
    setEmployee({ name: '', department: '', salary: '' });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        value={employee.name}
        onChange={handleChange}
        placeholder="Name"
        required
      />
      <input
        type="text"
        name="department"
        value={employee.department}
        onChange={handleChange}
        placeholder="Department"
        required
      />
      <input
        type="number"
        name="salary"
        value={employee.salary}
        onChange={handleChange}
        placeholder="Salary"
        required
      />
      <button type="submit">{editingEmployee ? 'Update' : 'Add'} Employee</button>
      {editingEmployee && <button type="button" onClick={onCancel}>Cancel</button>}
    </form>
  );
};

export default EmployeeForm;
