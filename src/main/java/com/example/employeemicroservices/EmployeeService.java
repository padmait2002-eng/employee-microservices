package com.example.employeemicroservices;

import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicLong;

@Service
public class EmployeeService {
    private final List<Employee> employees = new ArrayList<>();
    private final AtomicLong counter = new AtomicLong(1);

    public List<Employee> getAllEmployees() {
        return new ArrayList<>(employees);
    }

    public Optional<Employee> getEmployeeById(Long id) {
        return employees.stream().filter(e -> e.getId().equals(id)).findFirst();
    }

    public Employee addEmployee(Employee employee) {
        employee.setId(counter.getAndIncrement());
        employees.add(employee);
        return employee;
    }

    public Optional<Employee> updateEmployee(Long id, Employee updatedEmployee) {
        Optional<Employee> existing = getEmployeeById(id);
        if (existing.isPresent()) {
            Employee emp = existing.get();
            emp.setName(updatedEmployee.getName());
            emp.setDepartment(updatedEmployee.getDepartment());
            emp.setSalary(updatedEmployee.getSalary());
            return Optional.of(emp);
        }
        return Optional.empty();
    }

    public boolean deleteEmployee(Long id) {
        return employees.removeIf(e -> e.getId().equals(id));
    }
}
