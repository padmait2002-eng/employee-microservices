# Employee Management System - CRUD Application

A full-stack employee management application with an in-memory database built with Java Spring Boot backend and React.js frontend.

---

## 🚀 Quick Links

| Need | File | Time |
|------|------|------|
| **Just want to run it?** | [QUICKSTART.md](QUICKSTART.md) | 5 min |
| **Want to test APIs?** | [API_TESTING.md](API_TESTING.md) | 10 min |
| **Want to extend it?** | [DEVELOPMENT.md](DEVELOPMENT.md) | 30 min |
| **Want to understand security?** | [SECURITY.md](SECURITY.md) | 15 min |
| **Full documentation?** | This file (README.md) | 20 min |

---

## Features

✨ **Complete CRUD Operations:**
- ➕ Create: Add new employees
- 📋 Read: View all employees in a table
- ✏️ Update: Edit employee information
- 🗑️ Delete: Remove employees with confirmation

✅ **Additional Features:**
- Input validation on the frontend
- Real-time error messages
- Success/error notifications
- Delete confirmation dialog
- Responsive design for mobile and desktop
- Formatted salary display
- Employee count display
- Empty state message

🔒 **Security Features:**
- Spring Security framework enabled
- CORS properly configured and centralized
- Stateless REST API session management
- Security headers (X-Frame-Options, etc.)
- BCrypt password encoding ready for authentication
- Ready for JWT/OAuth2 implementation

## Project Structure

```
employee-microservices/
├── pom.xml                                 # Maven configuration
├── src/
│   └── main/
│       └── java/
│           └── com/example/employeemicroservices/
│               ├── EmployeeMicroservicesApplication.java  # Spring Boot main class
│               ├── Employee.java                          # Employee entity
│               ├── EmployeeService.java                   # Business logic (in-memory CRUD)
│               └── EmployeeController.java                # REST API endpoints
└── frontend/
    ├── package.json                        # Node.js dependencies
    ├── public/
    │   └── index.html                     # HTML template
    └── src/
        ├── index.js                        # React entry point
        ├── index.css                       # Global styles
        ├── App.js                          # Main React component
        ├── App.css                         # App styling
        └── components/
            ├── EmployeeForm.js             # Form component for add/edit
            └── EmployeeList.js             # Table component for listing/deleting
```

## Technology Stack

### Backend
- **Java 17**
- **Spring Boot 3.2.0**
- **Spring Web**
- **Spring Validation**
- **Maven**

### Frontend
- **React 18.2.0**
- **Axios** (for HTTP requests)
- **CSS3** (with animations and flexbox)

## Installation

### Prerequisites
- Java 17 or higher
- Node.js 22.x and npm
- Maven 3.6+

### Backend Setup

1. Navigate to the project root directory:
```bash
cd employee-microservices
```

2. Build the Spring Boot application:
```bash
mvn clean install
```

3. Run the Spring Boot application:
```bash
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the React development server:
```bash
npm start
```

The frontend will open automatically at `http://localhost:3000`

## API Endpoints

### Base URL: `http://localhost:8080/api/employees`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get all employees |
| GET | `/{id}` | Get employee by ID |
| POST | `/` | Create a new employee |
| PUT | `/{id}` | Update an employee |
| DELETE | `/{id}` | Delete an employee |

### Request/Response Examples

**Create Employee (POST)**
```json
{
  "name": "John Doe",
  "department": "IT",
  "salary": 75000
}
```

**Response**
```json
{
  "id": 1,
  "name": "John Doe",
  "department": "IT",
  "salary": 75000
}
```

## Employee Entity

```java
public class Employee {
    private Long id;           // Auto-generated ID
    private String name;       // Employee name
    private String department; // Department name
    private double salary;     // Annual salary
}
```

## Data Storage

The application uses **in-memory storage** with an ArrayList. The data persists only while the application is running:
- When the server restarts, all data is lost
- Perfect for development and testing
- Can be easily replaced with a database (H2, MySQL, PostgreSQL, etc.)

## In-Memory CRUD Implementation

Located in `EmployeeService.java`:
- Uses `ArrayList<Employee>` for storage
- Uses `AtomicLong` counter for thread-safe ID generation
- Thread-safe operations with streams and Optional pattern
- No external database required

## Building for Production

### Backend
```bash
mvn clean package
java -jar target/employee-microservices-0.0.1-SNAPSHOT.jar
```

### Frontend
```bash
cd frontend
npm run build
```

The build folder will contain the optimized production build.

## Troubleshooting

### CORS Errors
If you see CORS errors, ensure:
1. Backend is running on `http://localhost:8080`
2. Frontend is running on `http://localhost:3000`
3. CORS is properly configured in `SecurityConfig.java`
4. Check browser console for specific CORS error messages

For security details, see [SECURITY.md](SECURITY.md)

### Port Already in Use
- **Backend (Port 8080)**: Change in `src/main/resources/application.properties`
- **Frontend (Port 3000)**: Kill the process or use `PORT=3001 npm start`

### Frontend Dependencies Issue
```bash
cd frontend
npm install --save axios
```

## Future Enhancements

- 🗄️ Integrate with a persistent database (JPA/Hibernate)
- 🔐 Add authentication and authorization
- 📊 Add employee dashboard with charts
- 🔍 Add search and filter functionality
- 📄 Add pagination for large employee lists
- 📱 Improve mobile responsiveness
- 🎨 Add more UI themes
- 📧 Add email notifications
- 📝 Add employee details/profile page
- 🧪 Add unit and integration tests

## Documentation Files

| File | Purpose |
|------|---------|
| **README.md** | Complete project documentation (you are here) |
| **QUICKSTART.md** | 5-minute setup and run guide |
| **API_TESTING.md** | API endpoint testing with cURL, Postman, JavaScript examples |
| **DEVELOPMENT.md** | Developer guide for extending features, adding database, testing |
| **SECURITY.md** | Security configuration, best practices, and production recommendations |

## License

This project is open source and available under the MIT License.

## Contributing

Feel free to fork this repository and submit pull requests for any improvements!

## Support

For support, please contact the development team or create an issue in the repository.

