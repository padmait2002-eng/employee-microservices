# API Testing Guide

## Testing Employee CRUD API with cURL

The API is available at: `http://localhost:8080/api/employees`

### 1. Get All Employees
```bash
curl -X GET http://localhost:8080/api/employees
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "John Doe",
    "department": "IT",
    "salary": 75000
  },
  {
    "id": 2,
    "name": "Jane Smith",
    "department": "HR",
    "salary": 60000
  }
]
```

### 2. Get Employee by ID
```bash
curl -X GET http://localhost:8080/api/employees/1
```

**Response:**
```json
{
  "id": 1,
  "name": "John Doe",
  "department": "IT",
  "salary": 75000
}
```

### 3. Create New Employee (POST)
```bash
curl -X POST http://localhost:8080/api/employees \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"Alice Johnson\",
    \"department\": \"Finance\",
    \"salary\": 85000
  }"
```

**Response:**
```json
{
  "id": 3,
  "name": "Alice Johnson",
  "department": "Finance",
  "salary": 85000
}
```

### 4. Update Employee (PUT)
```bash
curl -X PUT http://localhost:8080/api/employees/1 \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"John Doe Updated\",
    \"department\": \"Management\",
    \"salary\": 95000
  }"
```

**Response:**
```json
{
  "id": 1,
  "name": "John Doe Updated",
  "department": "Management",
  "salary": 95000
}
```

### 5. Delete Employee
```bash
curl -X DELETE http://localhost:8080/api/employees/1
```

**Response:** 204 No Content (Success)

If employee not found: 404 Not Found

## Testing with Postman

### Step 1: Create Collection
1. Open Postman
2. Create new collection: `Employee API`

### Step 2: Add Requests

#### GET All Employees
- **Method:** GET
- **URL:** `http://localhost:8080/api/employees`
- **Headers:** None required

#### GET Employee by ID
- **Method:** GET
- **URL:** `http://localhost:8080/api/employees/{{id}}`
- **Headers:** None required

#### POST Create Employee
- **Method:** POST
- **URL:** `http://localhost:8080/api/employees`
- **Headers:** `Content-Type: application/json`
- **Body** (raw JSON):
```json
{
  "name": "Bob Wilson",
  "department": "Sales",
  "salary": 70000
}
```

#### PUT Update Employee
- **Method:** PUT
- **URL:** `http://localhost:8080/api/employees/{{id}}`
- **Headers:** `Content-Type: application/json`
- **Body** (raw JSON):
```json
{
  "name": "Bob Wilson Updated",
  "department": "Sales Manager",
  "salary": 85000
}
```

#### DELETE Employee
- **Method:** DELETE
- **URL:** `http://localhost:8080/api/employees/{{id}}`
- **Headers:** None required

## Testing with VS Code REST Client Extension

Create a file `requests.http`:

```http
### Get All Employees
GET http://localhost:8080/api/employees

### Get Employee by ID
GET http://localhost:8080/api/employees/1

### Create New Employee
POST http://localhost:8080/api/employees
Content-Type: application/json

{
  "name": "Charlie Brown",
  "department": "IT",
  "salary": 72000
}

### Update Employee
PUT http://localhost:8080/api/employees/1
Content-Type: application/json

{
  "name": "Charlie Brown Updated",
  "department": "Senior IT",
  "salary": 92000
}

### Delete Employee
DELETE http://localhost:8080/api/employees/1
```

Then use `Send Request` link above each request.

## Testing with JavaScript/Node.js

```javascript
const axios = require('axios');

const API_URL = 'http://localhost:8080/api/employees';

// Get All Employees
async function getAllEmployees() {
  try {
    const response = await axios.get(API_URL);
    console.log('All Employees:', response.data);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Create Employee
async function createEmployee(name, department, salary) {
  try {
    const response = await axios.post(API_URL, { name, department, salary });
    console.log('Created:', response.data);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Update Employee
async function updateEmployee(id, name, department, salary) {
  try {
    const response = await axios.put(`${API_URL}/${id}`, { name, department, salary });
    console.log('Updated:', response.data);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Delete Employee
async function deleteEmployee(id) {
  try {
    await axios.delete(`${API_URL}/${id}`);
    console.log('Deleted employee with ID:', id);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Get Employee by ID
async function getEmployeeById(id) {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    console.log('Employee:', response.data);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Usage
(async () => {
  await getAllEmployees();
  await createEmployee('David Lee', 'Engineering', 88000);
  await getEmployeeById(1);
  await updateEmployee(1, 'David Lee', 'Senior Engineer', 100000);
  await deleteEmployee(2);
})();
```

## HTTP Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200 | OK | GET, PUT successful |
| 201 | Created | POST successful (not used in this API) |
| 204 | No Content | DELETE successful |
| 400 | Bad Request | Invalid request format |
| 404 | Not Found | Employee ID doesn't exist |
| 500 | Server Error | Internal server error |

## Testing Checklist

- [ ] GET all employees returns list
- [ ] GET specific employee returns correct data
- [ ] POST creates new employee with auto-generated ID
- [ ] PUT updates existing employee
- [ ] PUT returns 404 for non-existent ID
- [ ] DELETE removes employee
- [ ] DELETE returns 404 for non-existent ID
- [ ] All responses have correct JSON format
- [ ] Salary values display correctly

## Common Errors

### CORS Error
**Problem:** `Access to XMLHttpRequest at 'http://localhost:8080/...' from origin 'http://localhost:3000' has been blocked`

**Solution:** Ensure backend's `@CrossOrigin` annotation is present in `EmployeeController`

### 404 Not Found
**Problem:** Employee ID doesn't exist

**Solution:** Create employee first, then use returned ID

### Invalid JSON
**Problem:** `400 Bad Request`

**Solution:** Ensure JSON is valid and Content-Type header is set

### Port Already in Use
**Problem:** Cannot start backend/frontend

**Solution:** Kill process on port or change port in configuration

## Performance Testing

Load test with multiple requests:

```bash
# PowerShell - Create 100 employees
for ($i = 1; $i -le 100; $i++) {
  $body = @{
    name = "Employee$i"
    department = "Department$($i % 5)"
    salary = 50000 + ($i * 1000)
  } | ConvertTo-Json
  
  Invoke-WebRequest -Uri "http://localhost:8080/api/employees" `
    -Method POST `
    -ContentType "application/json" `
    -Body $body
}
```

## Notes

- All responses are in JSON format
- Salary can be decimal (e.g., 50000.50)
- ID is auto-generated starting from 1
- IDs are never reused after deletion
- Data is lost when server restarts

