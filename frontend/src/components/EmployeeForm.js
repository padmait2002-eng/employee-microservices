import React, { useState, useEffect } from 'react';

const EmployeeForm = ({ onAdd, onUpdate, editingEmployee, onCancel }) => {
  const [employee, setEmployee] = useState({ name: '', department: '', salary: '' });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingEmployee) {
      setEmployee(editingEmployee);
      setErrors({});
    } else {
      setEmployee({ name: '', department: '', salary: '' });
      setErrors({});
    }
  }, [editingEmployee]);

  const validateForm = () => {
    const newErrors = {};

    if (!employee.name || employee.name.trim() === '') {
      newErrors.name = 'Name is required';
    }

    if (!employee.department || employee.department.trim() === '') {
      newErrors.department = 'Department is required';
    }

    if (!employee.salary || employee.salary === '') {
      newErrors.salary = 'Salary is required';
    } else if (isNaN(employee.salary) || Number(employee.salary) < 0) {
      newErrors.salary = 'Salary must be a positive number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee({ ...employee, [name]: value });
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (editingEmployee) {
      onUpdate(editingEmployee.id, employee);
    } else {
      onAdd(employee);
      setEmployee({ name: '', department: '', salary: '' });
    }
  };

  const handleCancel = () => {
    setEmployee({ name: '', department: '', salary: '' });
    setErrors({});
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit} className="employee-form">
      <h2>{editingEmployee ? '✏️ Edit Employee' : '➕ Add New Employee'}</h2>

      <div className="form-group">
        <input
          type="text"
          name="name"
          value={employee.name}
          onChange={handleChange}
          placeholder="Employee Name"
          className={errors.name ? 'input-error' : ''}
        />
        {errors.name && <span className="error-message">{errors.name}</span>}
      </div>

      <div className="form-group">
        <input
          type="text"
          name="department"
          value={employee.department}
          onChange={handleChange}
          placeholder="Department (e.g., IT, HR, Finance)"
          className={errors.department ? 'input-error' : ''}
        />
        {errors.department && <span className="error-message">{errors.department}</span>}
      </div>

      <div className="form-group">
        <input
          type="number"
          name="salary"
          value={employee.salary}
          onChange={handleChange}
          placeholder="Salary"
          min="0"
          step="0.01"
          className={errors.salary ? 'input-error' : ''}
        />
        {errors.salary && <span className="error-message">{errors.salary}</span>}
      </div>

      <div className="form-buttons">
        <button type="submit" className="btn-submit">
          {editingEmployee ? '💾 Update Employee' : '➕ Add Employee'}
        </button>
        {editingEmployee && (
          <button type="button" onClick={handleCancel} className="btn-cancel">
            ❌ Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default EmployeeForm;
