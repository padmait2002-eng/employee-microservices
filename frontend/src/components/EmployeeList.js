import React, { useState } from 'react';

const EmployeeList = ({ employees, onEdit, onDelete }) => {
  const [confirmDelete, setConfirmDelete] = useState(null);

  const handleDeleteClick = (employee) => {
    setConfirmDelete(employee);
  };

  const confirmDeleteEmployee = (id) => {
    onDelete(id);
    setConfirmDelete(null);
  };

  const cancelDelete = () => {
    setConfirmDelete(null);
  };

  if (employees.length === 0) {
    return (
      <div className="empty-list">
        <p>📭 No employees found. Add one to get started!</p>
      </div>
    );
  }

  return (
    <div className="employee-list-container">
      <h2>👥 Employee List ({employees.length})</h2>
      <div className="table-wrapper">
        <table className="employee-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Department</th>
              <th>Salary</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map(employee => (
              <tr key={employee.id} className={confirmDelete?.id === employee.id ? 'highlight' : ''}>
                <td>{employee.id}</td>
                <td>{employee.name}</td>
                <td>{employee.department}</td>
                <td>${Number(employee.salary).toFixed(2)}</td>
                <td className="actions">
                  <button onClick={() => onEdit(employee)} className="btn-edit">
                    ✏️ Edit
                  </button>
                  <button onClick={() => handleDeleteClick(employee)} className="btn-delete">
                    🗑️ Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {confirmDelete && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>⚠️ Confirm Delete</h3>
            <p>Are you sure you want to delete <strong>{confirmDelete.name}</strong>?</p>
            <div className="modal-buttons">
              <button onClick={() => confirmDeleteEmployee(confirmDelete.id)} className="btn-confirm">
                Yes, Delete
              </button>
              <button onClick={cancelDelete} className="btn-cancel-modal">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeList;
