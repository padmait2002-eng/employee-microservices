# 🔒 Security Configuration Guide

This document describes the security features implemented in the Employee Management System.

---

## Security Features Enabled

### ✅ Spring Security Framework
- **Dependency**: `spring-boot-starter-security`
- **Purpose**: Provides comprehensive security framework for the application
- **Configuration**: `SecurityConfig.java`

### ✅ CORS (Cross-Origin Resource Sharing)
- **Allowed Origins**: `http://localhost:3000`, `http://localhost:3001`
- **Allowed Methods**: GET, POST, PUT, DELETE, OPTIONS, PATCH
- **Max Age**: 3600 seconds (cache time for preflight requests)
- **Credentials**: Enabled for cookie-based authentication

### ✅ CSRF Protection
- **Status**: Disabled for development (REST API with stateless sessions)
- **Note**: Should be enabled in production with proper token handling (JWT, tokens in headers)

### ✅ Session Management
- **Policy**: STATELESS
- **Reason**: REST APIs should be stateless (no server-side session storage)
- **Benefit**: Better scalability and support for distributed deployments

### ✅ Security Headers
- **X-Frame-Options**: DENY (prevents clickjacking attacks)
- **Default Headers**: Automatically managed by Spring Security
- **HTTP-Only Cookies**: Enabled for session tracking

### ✅ Password Encoding
- **Algorithm**: BCrypt
- **Strength**: 10 (default, configurable)
- **Usage**: Ready for user authentication implementation

---

## Authorization Rules

Currently, all `/api/employees/**` endpoints are **permitted without authentication**:

```java
.authorizeHttpRequests(authz -> authz
    .requestMatchers("/api/employees/**").permitAll()
    .requestMatchers("/", "/index.html").permitAll()
    .anyRequest().permitAll()
)
```

This is for **development mode**. For production, implement proper authentication.

---

## Configuration Files

### 1. pom.xml
Added Spring Security dependency:
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>
```

### 2. application.properties
Security-related properties:
```properties
# Security Headers
server.servlet.session.tracking-modes=cookie
server.servlet.session.cookie.http-only=true
server.servlet.session.cookie.secure=false
server.servlet.session.cookie.same-site=lax

# Security Configuration
spring.security.filter.order=5
logging.level.org.springframework.security=DEBUG
```

### 3. SecurityConfig.java
Main security configuration class with:
- CORS configuration
- CSRF settings
- Session management
- Security headers
- Authorization rules

### 4. EmployeeController.java
Updated to remove `@CrossOrigin` annotation (handled by SecurityConfig)

---

## Security Best Practices Implemented

| Practice | Implementation | Status |
|----------|----------------|--------|
| **CORS** | Centralized in SecurityConfig | ✅ Done |
| **CSRF** | Disabled for stateless APIs | ✅ Done |
| **Session** | Stateless (STATELESS policy) | ✅ Done |
| **Headers** | Security headers enabled | ✅ Done |
| **Password Encoding** | BCrypt configured | ✅ Ready |
| **Frame Security** | X-Frame-Options DENY | ✅ Done |

---

## Moving to Production

### 1. Change HTTP to HTTPS
```properties
server.ssl.key-store=classpath:keystore.p12
server.ssl.key-store-password=your-password
server.ssl.key-store-type=PKCS12
server.ssl.key-alias=tomcat
```

### 2. Enable CSRF Protection
```java
// In SecurityConfig.java
.csrf(csrf -> csrf.csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse()))
```

### 3. Add Authentication
Implement Spring Security authentication:
```java
@Bean
public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
    return config.getAuthenticationManager();
}
```

### 4. Add JWT Tokens (Optional)
- Add `jjwt` dependency for JWT
- Create JWT token provider
- Add JWT filter to security chain

### 5. Use Environment-Specific Configurations
```properties
# application-prod.properties
server.ssl.enabled=true
spring.security.require-https=true
```

### 6. Update CORS for Production
```java
// Only allow production domain
config.setAllowedOrigins(Arrays.asList("https://yourdomain.com"));
```

### 7. Add Security Headers
```java
.headers(headers -> headers
    .frameOptions(frame -> frame.deny())
    .contentTypeOptions()
    .xssProtection()
    .cacheControl()
)
```

---

## Security Vulnerabilities & Fixes

### Current Development Setup
- ✅ No known vulnerabilities for development
- ⚠️ HTTPS not enabled (OK for local development)
- ⚠️ All endpoints permit anonymous access (OK for development)

### For Production
- [ ] Enable HTTPS/SSL
- [ ] Remove `.permitAll()` for sensitive endpoints
- [ ] Implement proper authentication
- [ ] Enable CSRF protection
- [ ] Add API rate limiting
- [ ] Enable security logging
- [ ] Add API versioning
- [ ] Implement API key authentication or OAuth2

---

## Testing Security

### Test CORS
```bash
curl -i -X OPTIONS http://localhost:8080/api/employees \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: POST"
```

Expect response headers:
```
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS, PATCH
```

### Check Security Headers
```bash
curl -i http://localhost:8080/api/employees
```

Look for security headers in response.

### Test Session Security
Check cookies are HTTP-only:
```bash
curl -i -c cookies.txt http://localhost:8080/api/employees
cat cookies.txt  # Should show HttpOnly flag
```

---

## Security Headers Reference

| Header | Purpose | Current Status |
|--------|---------|----------------|
| **X-Frame-Options** | Prevent clickjacking | ✅ DENY |
| **X-Content-Type-Options** | Prevent MIME sniffing | ✅ Auto |
| **X-XSS-Protection** | Legacy XSS protection | ✅ Managed |
| **Strict-Transport-Security** | Force HTTPS | ⏳ Need SSL |
| **Content-Security-Policy** | Restrict content sources | ⏳ Optional |
| **Access-Control-Allow-Origin** | CORS origin | ✅ Configured |

---

## Environment Variables (Recommended for Secrets)

For production, use environment variables:

```bash
# .env file (not in git)
CORS_ORIGINS=https://yourdomain.com
JWT_SECRET=your-secret-key-here
SSL_KEYSTORE_PASSWORD=secure-password
ALLOWED_USERS=admin,user1,user2
```

Then load in `application.properties`:
```properties
spring.security.filter.order=${SECURITY_FILTER_ORDER:5}
```

---

## Related Files

| File | Purpose |
|------|---------|
| `SecurityConfig.java` | Main security configuration |
| `EmployeeController.java` | Updated to remove @CrossOrigin |
| `application.properties` | Security properties |
| `pom.xml` | Spring Security dependency |

---

## Troubleshooting

### CORS Errors
**Problem**: "Access to XMLHttpRequest blocked by CORS policy"

**Solution**:
1. Check frontend origin matches CORS configuration
2. Verify preflight requests are successful (check OPTIONS response)
3. Ensure credentials setting is correct

### Security Filter Issues
**Problem**: "No qualifying bean of type 'SecurityFilterChain' found"

**Solution**:
1. Verify `@EnableWebSecurity` annotation exists
2. Check Spring Security dependency is installed
3. Rebuild project: `mvn clean compile`

### Session Cookie Issues
**Problem**: Cookies not being set correctly

**Solution**:
1. Check `server.servlet.session.tracking-modes=cookie`
2. Verify `http-only=true` in development
3. Use `same-site=lax` for better compatibility

---

## Next Steps

1. ✅ Review current security implementation
2. ✅ Test CORS in development
3. ⏳ Plan authentication strategy
4. ⏳ Implement JWT or OAuth2
5. ⏳ Enable HTTPS/SSL for production
6. ⏳ Add rate limiting
7. ⏳ Implement API key management

---

## Resources

- [Spring Security Documentation](https://spring.io/projects/spring-security)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Spring Security Guides](https://spring.io/guides#security)
- [JWT in Spring Boot](https://www.baeldung.com/spring-security-oauth2-login)
- [CORS in Spring](https://spring.io/guides/gs/rest-service-cors/)

---

## Support

For security concerns or improvements, please:
1. Review this documentation
2. Check DEVELOPMENT.md for extension guides
3. Refer to Spring Security official documentation
4. Implement changes in `SecurityConfig.java`

---

**Last Updated**: June 19, 2026  
**Security Compliance**: Spring Boot 3.2.0 best practices  
**Production Readiness**: Requires additional configuration for production use

