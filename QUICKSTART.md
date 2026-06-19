# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Prerequisites
- Java 17+ (check: `java -version`)
- Node.js 22.x (check: `node --version`)
- Maven 3.6+ (check: `mvn --version`)

### Step 1: Start the Backend (Terminal 1)
```bash
cd C:\JavaWork\Repository\employee-microservices
mvn spring-boot:run
```
Wait for: `Started EmployeeMicroservicesApplication`
✅ Backend running at `http://localhost:8080`

### Step 2: Start the Frontend (Terminal 2)
```bash
cd C:\JavaWork\Repository\employee-microservices\frontend
npm install  # (first time only)
npm start
```
✅ Frontend opens at `http://localhost:3000`

### Step 3: Use the Application
1. **Add Employee**: Fill the form and click "➕ Add Employee"
2. **View Employees**: See all employees in the table
3. **Edit Employee**: Click "✏️ Edit" button and modify
4. **Delete Employee**: Click "🗑️ Delete" and confirm

## 🎯 CRUD Operations

| Operation | How |
|-----------|-----|
| **Create** | Fill form → Click Add Employee |
| **Read** | View table automatically updated |
| **Update** | Click Edit → Modify → Click Update |
| **Delete** | Click Delete → Confirm → Done |

## 📝 Sample Employee
```json
{
  "name": "Alice Johnson",
  "department": "IT",
  "salary": 85000
}
```

## 🛠️ Troubleshooting

### Port 8080 Already in Use
```bash
# Find and kill process on port 8080
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```

### Port 3000 Already in Use
```bash
# Use different port
cd frontend
PORT=3001 npm start
```

### Dependencies Issues
```bash
# Frontend
cd frontend
npm install
npm update

# Backend
mvn clean install
```

### CORS Error?
- Make sure backend is running (`http://localhost:8080`)
- Frontend must be at `http://localhost:3000`

## 📊 Application Flow

```
User Interface (React)
        ↓
   API Calls (Axios)
        ↓
Spring Boot Controller
        ↓
Employee Service (In-Memory)
        ↓
ArrayList Storage
```

## 💾 Data Persistence

⚠️ **Note**: Data is stored in memory and will be lost when the server restarts.

To add persistent storage:
1. Add H2 dependency to `pom.xml`
2. Create `Employee` entity with `@Entity`
3. Create `EmployeeRepository` extending `JpaRepository`
4. Replace list-based service with JPA service

## 🎨 Customization

### Change Backend Port
Edit `src/main/resources/application.properties`:
```properties
server.port=8081
```

### Change Colors
Edit `frontend/src/App.css`:
```css
/* Change primary color from purple to blue */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### Add More Fields to Employee
1. Add field to `Employee.java` class
2. Add input to `EmployeeForm.js`
3. Add column to `EmployeeList.js`

## 📚 Learn More

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [React Documentation](https://react.dev)
- [Axios Documentation](https://axios-http.com)

## ✅ Verification Checklist

- [ ] Backend running on port 8080
- [ ] Frontend running on port 3000
- [ ] Can add employees
- [ ] Can view employees list
- [ ] Can edit employees
- [ ] Can delete employees
- [ ] Success notifications appear
- [ ] Error handling works

## 🎓 Next Steps

1. ✅ Explore the codebase
2. ✅ Try all CRUD operations
3. ✅ Modify styling
4. ✅ Add more fields to Employee
5. ✅ Integrate real database
6. ✅ Add authentication

Happy coding! 🚀

