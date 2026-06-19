# Development Guide

## Understanding the Code Structure

### Backend Architecture

```
EmployeeMicroservicesApplication (Spring Boot Entry Point)
    ↓
EmployeeController (REST API Layer)
    ├── GET /api/employees → getAllEmployees()
    ├── GET /api/employees/{id} → getEmployeeById()
    ├── POST /api/employees → addEmployee()
    ├── PUT /api/employees/{id} → updateEmployee()
    └── DELETE /api/employees/{id} → deleteEmployee()
    ↓
EmployeeService (Business Logic Layer)
    ├── getAllEmployees()
    ├── getEmployeeById()
    ├── addEmployee()
    ├── updateEmployee()
    └── deleteEmployee()
    ↓
ArrayList<Employee> (Data Storage Layer - In-Memory)
```

### Frontend Architecture

```
index.html (Entry Point)
    ↓
index.js (React Root)
    ↓
App.js (Main Component - State Management)
    ├── State: employees[], editingEmployee, notification
    ├── Methods: fetchEmployees, addEmployee, updateEmployee, deleteEmployee
    └── API Communication via Axios
    ↓
├── EmployeeForm.js
│   ├── Props: onAdd, onUpdate, editingEmployee, onCancel
│   ├── Validation Logic
│   └── Form UI
│
└── EmployeeList.js
    ├── Props: employees, onEdit, onDelete
    ├── Delete Confirmation Modal
    └── Table UI
```

## Adding New Fields to Employee

### Step 1: Modify Employee Entity
File: `src/main/java/com/example/employeemicroservices/Employee.java`

```java
public class Employee {
    private Long id;
    private String name;
    private String department;
    private double salary;
    private String email;  // NEW FIELD
    private String phone;  // NEW FIELD

    // Add getter and setter
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }
}
```

### Step 2: Update EmployeeService
File: `src/main/java/com/example/employeemicroservices/EmployeeService.java`

```java
public Optional<Employee> updateEmployee(Long id, Employee updatedEmployee) {
    Optional<Employee> existing = getEmployeeById(id);
    if (existing.isPresent()) {
        Employee emp = existing.get();
        emp.setName(updatedEmployee.getName());
        emp.setDepartment(updatedEmployee.getDepartment());
        emp.setSalary(updatedEmployee.getSalary());
        emp.setEmail(updatedEmployee.getEmail());  // ADD THIS
        emp.setPhone(updatedEmployee.getPhone());  // ADD THIS
        return Optional.of(emp);
    }
    return Optional.empty();
}
```

### Step 3: Update EmployeeForm Component
File: `frontend/src/components/EmployeeForm.js`

```javascript
const [employee, setEmployee] = useState({ 
    name: '', 
    department: '', 
    salary: '',
    email: '',      // ADD THIS
    phone: ''       // ADD THIS
});

// Add to form validation...
if (!employee.email || employee.email.trim() === '') {
    newErrors.email = 'Email is required';
}

// Add input field to form
<div className="form-group">
    <input
        type="email"
        name="email"
        value={employee.email}
        onChange={handleChange}
        placeholder="Email"
        className={errors.email ? 'input-error' : ''}
    />
    {errors.email && <span className="error-message">{errors.email}</span>}
</div>
```

### Step 4: Update EmployeeList Component
File: `frontend/src/components/EmployeeList.js`

```javascript
<thead>
    <tr>
        <th>ID</th>
        <th>Name</th>
        <th>Department</th>
        <th>Salary</th>
        <th>Email</th>      {/* ADD THIS */}
        <th>Actions</th>
    </tr>
</thead>
<tbody>
    {employees.map(employee => (
        <tr key={employee.id}>
            <td>{employee.id}</td>
            <td>{employee.name}</td>
            <td>{employee.department}</td>
            <td>${Number(employee.salary).toFixed(2)}</td>
            <td>{employee.email}</td>  {/* ADD THIS */}
            {/* ... */}
        </tr>
    ))}
</tbody>
```

## Adding Database Support (JPA/Hibernate)

### Step 1: Update pom.xml
Add dependency:
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>
<dependency>
    <groupId>com.h2database</groupId>
    <artifactId>h2</artifactId>
    <scope>runtime</scope>
</dependency>
```

### Step 2: Convert Employee to JPA Entity
```java
import jakarta.persistence.*;

@Entity
@Table(name = "employees")
public class Employee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    private String department;
    private double salary;
}
```

### Step 3: Create Repository
```java
package com.example.employeemicroservices;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
}
```

### Step 4: Update Service
```java
@Service
public class EmployeeService {
    @Autowired
    private EmployeeRepository employeeRepository;

    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    public Optional<Employee> getEmployeeById(Long id) {
        return employeeRepository.findById(id);
    }

    public Employee addEmployee(Employee employee) {
        return employeeRepository.save(employee);
    }

    public Optional<Employee> updateEmployee(Long id, Employee updatedEmployee) {
        return employeeRepository.findById(id).map(employee -> {
            employee.setName(updatedEmployee.getName());
            employee.setDepartment(updatedEmployee.getDepartment());
            employee.setSalary(updatedEmployee.getSalary());
            return employeeRepository.save(employee);
        });
    }

    public boolean deleteEmployee(Long id) {
        if (employeeRepository.existsById(id)) {
            employeeRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
```

### Step 5: Configure Database
File: `application.properties`
```properties
# H2 Database
spring.datasource.url=jdbc:h2:mem:testdb
spring.datasource.driverClassName=org.h2.Driver
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
spring.h2.console.enabled=true

# For MySQL or PostgreSQL
# spring.datasource.url=jdbc:mysql://localhost:3306/employee_db
# spring.datasource.username=root
# spring.datasource.password=password
# spring.jpa.hibernate.ddl-auto=update
```

## Adding Search Functionality

### Backend
```java
@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    List<Employee> findByNameContainingIgnoreCase(String name);
    List<Employee> findByDepartment(String department);
}
```

```java
@GetMapping("/search")
public List<Employee> searchEmployees(@RequestParam String keyword) {
    return employeeService.searchByName(keyword);
}
```

### Frontend
```javascript
const [searchTerm, setSearchTerm] = useState('');

const handleSearch = async () => {
    if (searchTerm.trim() === '') {
        fetchEmployees();
    } else {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/search?keyword=${searchTerm}`
            );
            setEmployees(response.data);
        } catch (error) {
            showNotification('Search failed', 'error');
        }
    }
};
```

## Adding Pagination

### Backend
```java
@GetMapping
public Page<Employee> getAllEmployees(
    @RequestParam(defaultValue = "0") int page,
    @RequestParam(defaultValue = "10") int size
) {
    return employeeService.getAllEmployees(page, size);
}
```

### Frontend
```javascript
const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 10;

const indexOfLastItem = currentPage * itemsPerPage;
const indexOfFirstItem = indexOfLastItem - itemsPerPage;
const currentEmployees = employees.slice(indexOfFirstItem, indexOfLastItem);
```

## Adding Authentication

### Backend
Add Spring Security dependency and configure:
```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    // Configure security rules
}
```

### Frontend
```javascript
// Add login check before API calls
const checkAuth = async () => {
    try {
        await axios.get('/api/auth/verify');
    } catch (error) {
        // Redirect to login
    }
};
```

## Debugging Tips

### Backend Debugging
1. Add logs in EmployeeService:
```java
private static final Logger logger = LoggerFactory.getLogger(EmployeeService.class);

public Employee addEmployee(Employee employee) {
    logger.info("Adding employee: {}", employee.getName());
    employee.setId(counter.getAndIncrement());
    employees.add(employee);
    logger.debug("Total employees: {}", employees.size());
    return employee;
}
```

2. Check application.properties for debug logging:
```properties
logging.level.com.example.employeemicroservices=DEBUG
```

### Frontend Debugging
1. Add console logs:
```javascript
const fetchEmployees = async () => {
    console.log('Fetching employees...');
    try {
        const response = await axios.get(API_BASE_URL);
        console.log('Response data:', response.data);
        setEmployees(response.data);
    } catch (error) {
        console.error('Fetch error:', error);
    }
};
```

2. Use React DevTools browser extension

3. Use Network tab to inspect API calls

## Testing

### Unit Tests (Backend)
Create `EmployeeServiceTest.java`:
```java
@SpringBootTest
class EmployeeServiceTest {
    @Autowired
    private EmployeeService employeeService;

    @Test
    void testAddEmployee() {
        Employee emp = new Employee(null, "Test", "IT", 50000);
        Employee saved = employeeService.addEmployee(emp);
        assertNotNull(saved.getId());
    }
}
```

### Integration Tests (Frontend)
```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

test('renders employee form', () => {
    render(<App />);
    expect(screen.getByPlaceholderText('Employee Name')).toBeInTheDocument();
});
```

## Performance Optimization

### Backend
- Use pagination for large datasets
- Add indexes on frequently searched columns
- Use DTOs to reduce data transfer
- Add caching with @Cacheable

### Frontend
- Use React.memo for components
- Implement lazy loading
- Optimize re-renders
- Minimize API calls

## Best Practices

1. **Error Handling**: Always include try-catch blocks
2. **Validation**: Validate on both frontend and backend
3. **Security**: Never expose sensitive data
4. **Code Organization**: Keep components and services separate
5. **Documentation**: Comment complex logic
6. **Testing**: Write tests for critical functions
7. **Performance**: Monitor and optimize regularly

## Common Issues and Solutions

| Issue | Solution |
|-------|----------|
| Data not persisting | Use database instead of ArrayList |
| Slow API response | Add pagination and caching |
| CORS error | Check @CrossOrigin annotation |
| Component not updating | Check state management |
| Form validation not working | Ensure validation logic is correct |

## Resources

- [Spring Boot Docs](https://spring.io/projects/spring-boot)
- [React Docs](https://react.dev)
- [JPA Documentation](https://www.oracle.com/java/technologies/persistence-jsp.html)
- [Axios Documentation](https://axios-http.com)

