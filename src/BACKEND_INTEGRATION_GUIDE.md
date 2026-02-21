# ImpactHub - Spring Boot + MySQL Backend Integration Guide

## Overview
This guide provides complete steps to integrate the ImpactHub React frontend with a Spring Boot backend and MySQL database.

---

## Table of Contents
1. [Technology Stack](#technology-stack)
2. [Database Schema](#database-schema)
3. [Spring Boot Project Setup](#spring-boot-project-setup)
4. [Entity Models](#entity-models)
5. [Repository Layer](#repository-layer)
6. [Service Layer](#service-layer)
7. [REST API Controllers](#rest-api-controllers)
8. [Security Configuration](#security-configuration)
9. [Frontend Integration](#frontend-integration)
10. [API Endpoints Reference](#api-endpoints-reference)

---

## Technology Stack

### Backend
- **Framework**: Spring Boot 3.x
- **Database**: MySQL 8.x
- **ORM**: Spring Data JPA (Hibernate)
- **Security**: Spring Security with JWT
- **Build Tool**: Maven
- **Java Version**: 17 or higher

### Frontend (Current)
- React 18
- TypeScript
- Tailwind CSS

---

## Database Schema

### 1. Users Table
```sql
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    user_type ENUM('VOLUNTEER', 'NGO', 'ADMIN') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    INDEX idx_email (email),
    INDEX idx_user_type (user_type)
);
```

### 2. Volunteers Table
```sql
CREATE TABLE volunteers (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    date_of_birth DATE,
    gender ENUM('Male', 'Female', 'Other', 'Prefer not to say'),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(10),
    skills JSON,
    interests JSON,
    availability VARCHAR(50),
    preferred_causes JSON,
    experience_level ENUM('Beginner', 'Intermediate', 'Advanced'),
    education VARCHAR(255),
    occupation VARCHAR(255),
    linkedin_url VARCHAR(500),
    emergency_contact_name VARCHAR(255),
    emergency_contact_phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_city (city),
    INDEX idx_state (state)
);
```

### 3. NGOs Table
```sql
CREATE TABLE ngos (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT UNIQUE NOT NULL,
    ngo_name VARCHAR(255) NOT NULL,
    registration_number VARCHAR(100) UNIQUE NOT NULL,
    year_founded INT,
    ngo_type ENUM('Trust', 'Society', 'Section 8 Company', 'Other'),
    cause_focus JSON,
    mission TEXT,
    vision TEXT,
    website_url VARCHAR(500),
    phone VARCHAR(20),
    email VARCHAR(255),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(10),
    pan_number VARCHAR(20),
    tan_number VARCHAR(20),
    gst_number VARCHAR(20),
    is_12a_registered BOOLEAN DEFAULT FALSE,
    is_80g_registered BOOLEAN DEFAULT FALSE,
    fcra_registered BOOLEAN DEFAULT FALSE,
    bank_account_number VARCHAR(50),
    bank_name VARCHAR(255),
    bank_ifsc VARCHAR(20),
    bank_branch VARCHAR(255),
    primary_contact_name VARCHAR(255),
    primary_contact_designation VARCHAR(100),
    primary_contact_phone VARCHAR(20),
    primary_contact_email VARCHAR(255),
    is_verified BOOLEAN DEFAULT FALSE,
    verification_date TIMESTAMP NULL,
    active_projects INT DEFAULT 0,
    completed_projects INT DEFAULT 0,
    logo_url VARCHAR(500),
    cover_image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_registration_number (registration_number),
    INDEX idx_verified (is_verified),
    INDEX idx_city (city),
    INDEX idx_state (state)
);
```

### 4. Projects Table
```sql
CREATE TABLE projects (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    ngo_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    cause VARCHAR(100),
    location VARCHAR(255),
    status ENUM('ONGOING', 'COMPLETED', 'FUNDED') DEFAULT 'ONGOING',
    funding_goal DECIMAL(15, 2),
    funds_raised DECIMAL(15, 2) DEFAULT 0,
    start_date DATE,
    end_date DATE,
    beneficiaries INT DEFAULT 0,
    image_url VARCHAR(500),
    required_resources JSON,
    volunteers_needed INT DEFAULT 0,
    volunteers_enrolled INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (ngo_id) REFERENCES ngos(id) ON DELETE CASCADE,
    INDEX idx_ngo_id (ngo_id),
    INDEX idx_status (status),
    INDEX idx_cause (cause)
);
```

### 5. Volunteer Enrollments Table
```sql
CREATE TABLE volunteer_enrollments (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    volunteer_id BIGINT NOT NULL,
    project_id BIGINT NOT NULL,
    enrollment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('ACTIVE', 'COMPLETED', 'CANCELLED') DEFAULT 'ACTIVE',
    hours_contributed INT DEFAULT 0,
    notes TEXT,
    FOREIGN KEY (volunteer_id) REFERENCES volunteers(id) ON DELETE CASCADE,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    UNIQUE KEY unique_enrollment (volunteer_id, project_id),
    INDEX idx_volunteer_id (volunteer_id),
    INDEX idx_project_id (project_id),
    INDEX idx_status (status)
);
```

### 6. Volunteer Opportunities Table
```sql
CREATE TABLE volunteer_opportunities (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    ngo_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    skills_required JSON,
    location VARCHAR(255),
    duration VARCHAR(100),
    commitment VARCHAR(100),
    spots_available INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (ngo_id) REFERENCES ngos(id) ON DELETE CASCADE,
    INDEX idx_ngo_id (ngo_id)
);
```

---

## Spring Boot Project Setup

### 1. Create New Spring Boot Project

**Using Spring Initializr (https://start.spring.io/):**
- Project: Maven
- Language: Java
- Spring Boot: 3.2.x or latest
- Packaging: Jar
- Java: 17

**Dependencies:**
- Spring Web
- Spring Data JPA
- MySQL Driver
- Spring Security
- Validation
- Lombok
- Spring Boot DevTools

### 2. Project Structure
```
impact-hub-backend/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/impacthub/
│   │   │       ├── ImpactHubApplication.java
│   │   │       ├── config/
│   │   │       │   ├── SecurityConfig.java
│   │   │       │   ├── CorsConfig.java
│   │   │       │   └── JwtAuthenticationFilter.java
│   │   │       ├── entity/
│   │   │       │   ├── User.java
│   │   │       │   ├── Volunteer.java
│   │   │       │   ├── NGO.java
│   │   │       │   ├── Project.java
│   │   │       │   ├── VolunteerEnrollment.java
│   │   │       │   └── VolunteerOpportunity.java
│   │   │       ├── repository/
│   │   │       │   ├── UserRepository.java
│   │   │       │   ├── VolunteerRepository.java
│   │   │       │   ├── NGORepository.java
│   │   │       │   ├── ProjectRepository.java
│   │   │       │   ├── EnrollmentRepository.java
│   │   │       │   └── OpportunityRepository.java
│   │   │       ├── service/
│   │   │       │   ├── AuthService.java
│   │   │       │   ├── VolunteerService.java
│   │   │       │   ├── NGOService.java
│   │   │       │   ├── ProjectService.java
│   │   │       │   └── JwtService.java
│   │   │       ├── controller/
│   │   │       │   ├── AuthController.java
│   │   │       │   ├── VolunteerController.java
│   │   │       │   ├── NGOController.java
│   │   │       │   └── ProjectController.java
│   │   │       ├── dto/
│   │   │       │   ├── request/
│   │   │       │   │   ├── LoginRequest.java
│   │   │       │   │   ├── VolunteerRegistrationRequest.java
│   │   │       │   │   └── NGORegistrationRequest.java
│   │   │       │   └── response/
│   │   │       │       ├── AuthResponse.java
│   │   │       │       ├── VolunteerResponse.java
│   │   │       │       └── NGOResponse.java
│   │   │       └── exception/
│   │   │           ├── GlobalExceptionHandler.java
│   │   │           └── ResourceNotFoundException.java
│   │   └── resources/
│   │       └── application.properties
│   └── test/
└── pom.xml
```

### 3. application.properties Configuration

```properties
# Server Configuration
server.port=8080
spring.application.name=ImpactHub

# MySQL Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/impacthub_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=your_password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect
spring.jpa.properties.hibernate.format_sql=true

# JWT Configuration
jwt.secret=your-secret-key-change-this-in-production-min-256-bits
jwt.expiration=86400000

# File Upload Configuration
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB

# Logging
logging.level.com.impacthub=DEBUG
logging.level.org.springframework.security=DEBUG
```

### 4. pom.xml Dependencies

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
         https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.2.0</version>
        <relativePath/>
    </parent>
    
    <groupId>com.impacthub</groupId>
    <artifactId>impact-hub-backend</artifactId>
    <version>1.0.0</version>
    <name>ImpactHub Backend</name>
    <description>Backend API for ImpactHub NGO Management Platform</description>
    
    <properties>
        <java.version>17</java.version>
    </properties>
    
    <dependencies>
        <!-- Spring Boot Starters -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-security</artifactId>
        </dependency>
        
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>
        
        <!-- MySQL Driver -->
        <dependency>
            <groupId>com.mysql</groupId>
            <artifactId>mysql-connector-j</artifactId>
            <scope>runtime</scope>
        </dependency>
        
        <!-- JWT -->
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-api</artifactId>
            <version>0.12.3</version>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-impl</artifactId>
            <version>0.12.3</version>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-jackson</artifactId>
            <version>0.12.3</version>
            <scope>runtime</scope>
        </dependency>
        
        <!-- Lombok -->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
        
        <!-- DevTools -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-devtools</artifactId>
            <scope>runtime</scope>
            <optional>true</optional>
        </dependency>
        
        <!-- Test -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
        
        <dependency>
            <groupId>org.springframework.security</groupId>
            <artifactId>spring-security-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>
    
    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <configuration>
                    <excludes>
                        <exclude>
                            <groupId>org.projectlombok</groupId>
                            <artifactId>lombok</artifactId>
                        </exclude>
                    </excludes>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>
```

---

## Entity Models

### 1. User.java
```java
package com.impacthub.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Enumerated(EnumType.STRING)
    @Column(name = "user_type", nullable = false)
    private UserType userType;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum UserType {
        VOLUNTEER, NGO, ADMIN
    }
}
```

### 2. Volunteer.java
```java
package com.impacthub.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "volunteers")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Volunteer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    private String phone;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Enumerated(EnumType.STRING)
    private Gender gender;

    private String address;
    private String city;
    private String state;
    private String pincode;

    @ElementCollection
    @CollectionTable(name = "volunteer_skills", joinColumns = @JoinColumn(name = "volunteer_id"))
    @Column(name = "skill")
    private List<String> skills;

    @ElementCollection
    @CollectionTable(name = "volunteer_interests", joinColumns = @JoinColumn(name = "volunteer_id"))
    @Column(name = "interest")
    private List<String> interests;

    private String availability;

    @ElementCollection
    @CollectionTable(name = "volunteer_preferred_causes", joinColumns = @JoinColumn(name = "volunteer_id"))
    @Column(name = "cause")
    private List<String> preferredCauses;

    @Enumerated(EnumType.STRING)
    @Column(name = "experience_level")
    private ExperienceLevel experienceLevel;

    private String education;
    private String occupation;

    @Column(name = "linkedin_url")
    private String linkedinUrl;

    @Column(name = "emergency_contact_name")
    private String emergencyContactName;

    @Column(name = "emergency_contact_phone")
    private String emergencyContactPhone;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum Gender {
        Male, Female, Other, PreferNotToSay
    }

    public enum ExperienceLevel {
        Beginner, Intermediate, Advanced
    }
}
```

### 3. NGO.java
```java
package com.impacthub.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "ngos")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class NGO {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "ngo_name", nullable = false)
    private String ngoName;

    @Column(name = "registration_number", nullable = false, unique = true)
    private String registrationNumber;

    @Column(name = "year_founded")
    private Integer yearFounded;

    @Enumerated(EnumType.STRING)
    @Column(name = "ngo_type")
    private NGOType ngoType;

    @ElementCollection
    @CollectionTable(name = "ngo_cause_focus", joinColumns = @JoinColumn(name = "ngo_id"))
    @Column(name = "cause")
    private List<String> causeFocus;

    @Column(columnDefinition = "TEXT")
    private String mission;

    @Column(columnDefinition = "TEXT")
    private String vision;

    @Column(name = "website_url")
    private String websiteUrl;

    private String phone;
    private String email;
    private String address;
    private String city;
    private String state;
    private String pincode;

    @Column(name = "pan_number")
    private String panNumber;

    @Column(name = "tan_number")
    private String tanNumber;

    @Column(name = "gst_number")
    private String gstNumber;

    @Column(name = "is_12a_registered")
    private Boolean is12aRegistered = false;

    @Column(name = "is_80g_registered")
    private Boolean is80gRegistered = false;

    @Column(name = "fcra_registered")
    private Boolean fcraRegistered = false;

    @Column(name = "bank_account_number")
    private String bankAccountNumber;

    @Column(name = "bank_name")
    private String bankName;

    @Column(name = "bank_ifsc")
    private String bankIfsc;

    @Column(name = "bank_branch")
    private String bankBranch;

    @Column(name = "primary_contact_name")
    private String primaryContactName;

    @Column(name = "primary_contact_designation")
    private String primaryContactDesignation;

    @Column(name = "primary_contact_phone")
    private String primaryContactPhone;

    @Column(name = "primary_contact_email")
    private String primaryContactEmail;

    @Column(name = "is_verified")
    private Boolean isVerified = false;

    @Column(name = "verification_date")
    private LocalDateTime verificationDate;

    @Column(name = "active_projects")
    private Integer activeProjects = 0;

    @Column(name = "completed_projects")
    private Integer completedProjects = 0;

    @Column(name = "logo_url")
    private String logoUrl;

    @Column(name = "cover_image_url")
    private String coverImageUrl;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum NGOType {
        Trust, Society, Section8Company, Other
    }
}
```

### 4. Project.java
```java
package com.impacthub.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "projects")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Project {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "ngo_id", nullable = false)
    private NGO ngo;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String cause;
    private String location;

    @Enumerated(EnumType.STRING)
    private ProjectStatus status = ProjectStatus.ONGOING;

    @Column(name = "funding_goal", precision = 15, scale = 2)
    private BigDecimal fundingGoal;

    @Column(name = "funds_raised", precision = 15, scale = 2)
    private BigDecimal fundsRaised = BigDecimal.ZERO;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    private Integer beneficiaries = 0;

    @Column(name = "image_url")
    private String imageUrl;

    @ElementCollection
    @CollectionTable(name = "project_required_resources", joinColumns = @JoinColumn(name = "project_id"))
    @Column(name = "resource")
    private List<String> requiredResources;

    @Column(name = "volunteers_needed")
    private Integer volunteersNeeded = 0;

    @Column(name = "volunteers_enrolled")
    private Integer volunteersEnrolled = 0;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum ProjectStatus {
        ONGOING, COMPLETED, FUNDED
    }
}
```

---

## Repository Layer

### 1. UserRepository.java
```java
package com.impacthub.repository;

import com.impacthub.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Boolean existsByEmail(String email);
}
```

### 2. VolunteerRepository.java
```java
package com.impacthub.repository;

import com.impacthub.entity.Volunteer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VolunteerRepository extends JpaRepository<Volunteer, Long> {
    Optional<Volunteer> findByUserId(Long userId);
    List<Volunteer> findByCity(String city);
    List<Volunteer> findByState(String state);
}
```

### 3. NGORepository.java
```java
package com.impacthub.repository;

import com.impacthub.entity.NGO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NGORepository extends JpaRepository<NGO, Long> {
    Optional<NGO> findByUserId(Long userId);
    Optional<NGO> findByRegistrationNumber(String registrationNumber);
    List<NGO> findByIsVerified(Boolean isVerified);
    List<NGO> findByCity(String city);
    List<NGO> findByState(String state);
    
    @Query("SELECT n FROM NGO n WHERE :cause MEMBER OF n.causeFocus")
    List<NGO> findByCause(String cause);
}
```

### 4. ProjectRepository.java
```java
package com.impacthub.repository;

import com.impacthub.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findByNgoId(Long ngoId);
    List<Project> findByStatus(Project.ProjectStatus status);
    List<Project> findByCause(String cause);
    List<Project> findByLocation(String location);
}
```

### 5. VolunteerEnrollmentRepository.java
```java
package com.impacthub.repository;

import com.impacthub.entity.VolunteerEnrollment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VolunteerEnrollmentRepository extends JpaRepository<VolunteerEnrollment, Long> {
    List<VolunteerEnrollment> findByVolunteerId(Long volunteerId);
    List<VolunteerEnrollment> findByProjectId(Long projectId);
    Optional<VolunteerEnrollment> findByVolunteerIdAndProjectId(Long volunteerId, Long projectId);
}
```

---

## Service Layer

### 1. JwtService.java
```java
package com.impacthub.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private Long expiration;

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    public String generateToken(String email, String userType) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userType", userType);
        return createToken(claims, email);
    }

    private String createToken(Map<String, Object> claims, String subject) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public String extractEmail(String token) {
        return extractAllClaims(token).getSubject();
    }

    public String extractUserType(String token) {
        return (String) extractAllClaims(token).get("userType");
    }

    public Boolean isTokenExpired(String token) {
        return extractAllClaims(token).getExpiration().before(new Date());
    }

    public Boolean validateToken(String token, String email) {
        final String tokenEmail = extractEmail(token);
        return (tokenEmail.equals(email) && !isTokenExpired(token));
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
```

### 2. AuthService.java
```java
package com.impacthub.service;

import com.impacthub.dto.request.LoginRequest;
import com.impacthub.dto.request.VolunteerRegistrationRequest;
import com.impacthub.dto.request.NGORegistrationRequest;
import com.impacthub.dto.response.AuthResponse;
import com.impacthub.entity.User;
import com.impacthub.entity.Volunteer;
import com.impacthub.entity.NGO;
import com.impacthub.repository.UserRepository;
import com.impacthub.repository.VolunteerRepository;
import com.impacthub.repository.NGORepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final VolunteerRepository volunteerRepository;
    private final NGORepository ngoRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Transactional
    public AuthResponse registerVolunteer(VolunteerRegistrationRequest request) {
        // Check if user already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        // Create User
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setUserType(User.UserType.VOLUNTEER);
        user.setIsActive(true);
        User savedUser = userRepository.save(user);

        // Create Volunteer Profile
        Volunteer volunteer = new Volunteer();
        volunteer.setUser(savedUser);
        volunteer.setFullName(request.getFullName());
        volunteer.setPhone(request.getPhone());
        volunteer.setDateOfBirth(request.getDateOfBirth());
        volunteer.setGender(request.getGender());
        volunteer.setAddress(request.getAddress());
        volunteer.setCity(request.getCity());
        volunteer.setState(request.getState());
        volunteer.setPincode(request.getPincode());
        volunteer.setSkills(request.getSkills());
        volunteer.setInterests(request.getInterests());
        volunteer.setAvailability(request.getAvailability());
        volunteer.setPreferredCauses(request.getPreferredCauses());
        volunteer.setExperienceLevel(request.getExperienceLevel());
        volunteer.setEducation(request.getEducation());
        volunteer.setOccupation(request.getOccupation());
        volunteer.setLinkedinUrl(request.getLinkedinUrl());
        volunteer.setEmergencyContactName(request.getEmergencyContactName());
        volunteer.setEmergencyContactPhone(request.getEmergencyContactPhone());
        volunteerRepository.save(volunteer);

        // Generate JWT
        String token = jwtService.generateToken(savedUser.getEmail(), savedUser.getUserType().name());

        return new AuthResponse(token, "VOLUNTEER", savedUser.getEmail());
    }

    @Transactional
    public AuthResponse registerNGO(NGORegistrationRequest request) {
        // Check if user already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        // Check if registration number exists
        if (ngoRepository.findByRegistrationNumber(request.getRegistrationNumber()).isPresent()) {
            throw new RuntimeException("Registration number already exists");
        }

        // Create User
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setUserType(User.UserType.NGO);
        user.setIsActive(true);
        User savedUser = userRepository.save(user);

        // Create NGO Profile
        NGO ngo = new NGO();
        ngo.setUser(savedUser);
        ngo.setNgoName(request.getNgoName());
        ngo.setRegistrationNumber(request.getRegistrationNumber());
        ngo.setYearFounded(request.getYearFounded());
        ngo.setNgoType(request.getNgoType());
        ngo.setCauseFocus(request.getCauseFocus());
        ngo.setMission(request.getMission());
        ngo.setVision(request.getVision());
        ngo.setWebsiteUrl(request.getWebsiteUrl());
        ngo.setPhone(request.getPhone());
        ngo.setEmail(request.getEmail());
        ngo.setAddress(request.getAddress());
        ngo.setCity(request.getCity());
        ngo.setState(request.getState());
        ngo.setPincode(request.getPincode());
        ngo.setPanNumber(request.getPanNumber());
        ngo.setTanNumber(request.getTanNumber());
        ngo.setGstNumber(request.getGstNumber());
        ngo.setIs12aRegistered(request.getIs12aRegistered());
        ngo.setIs80gRegistered(request.getIs80gRegistered());
        ngo.setFcraRegistered(request.getFcraRegistered());
        ngo.setBankAccountNumber(request.getBankAccountNumber());
        ngo.setBankName(request.getBankName());
        ngo.setBankIfsc(request.getBankIfsc());
        ngo.setBankBranch(request.getBankBranch());
        ngo.setPrimaryContactName(request.getPrimaryContactName());
        ngo.setPrimaryContactDesignation(request.getPrimaryContactDesignation());
        ngo.setPrimaryContactPhone(request.getPrimaryContactPhone());
        ngo.setPrimaryContactEmail(request.getPrimaryContactEmail());
        ngo.setIsVerified(false);
        ngoRepository.save(ngo);

        // Generate JWT
        String token = jwtService.generateToken(savedUser.getEmail(), savedUser.getUserType().name());

        return new AuthResponse(token, "NGO", savedUser.getEmail());
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Invalid credentials");
        }

        if (!user.getIsActive()) {
            throw new RuntimeException("Account is deactivated");
        }

        String token = jwtService.generateToken(user.getEmail(), user.getUserType().name());

        return new AuthResponse(token, user.getUserType().name(), user.getEmail());
    }
}
```

---

## REST API Controllers

### 1. AuthController.java
```java
package com.impacthub.controller;

import com.impacthub.dto.request.LoginRequest;
import com.impacthub.dto.request.VolunteerRegistrationRequest;
import com.impacthub.dto.request.NGORegistrationRequest;
import com.impacthub.dto.response.AuthResponse;
import com.impacthub.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register/volunteer")
    public ResponseEntity<AuthResponse> registerVolunteer(
            @Valid @RequestBody VolunteerRegistrationRequest request) {
        return ResponseEntity.ok(authService.registerVolunteer(request));
    }

    @PostMapping("/register/ngo")
    public ResponseEntity<AuthResponse> registerNGO(
            @Valid @RequestBody NGORegistrationRequest request) {
        return ResponseEntity.ok(authService.registerNGO(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }
}
```

### 2. NGOController.java
```java
package com.impacthub.controller;

import com.impacthub.entity.NGO;
import com.impacthub.repository.NGORepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ngos")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class NGOController {

    private final NGORepository ngoRepository;

    @GetMapping
    public ResponseEntity<List<NGO>> getAllNGOs() {
        return ResponseEntity.ok(ngoRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<NGO> getNGOById(@PathVariable Long id) {
        return ngoRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/verified")
    public ResponseEntity<List<NGO>> getVerifiedNGOs() {
        return ResponseEntity.ok(ngoRepository.findByIsVerified(true));
    }

    @GetMapping("/cause/{cause}")
    public ResponseEntity<List<NGO>> getNGOsByCause(@PathVariable String cause) {
        return ResponseEntity.ok(ngoRepository.findByCause(cause));
    }

    @GetMapping("/city/{city}")
    public ResponseEntity<List<NGO>> getNGOsByCity(@PathVariable String city) {
        return ResponseEntity.ok(ngoRepository.findByCity(city));
    }
}
```

### 3. ProjectController.java
```java
package com.impacthub.controller;

import com.impacthub.entity.Project;
import com.impacthub.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class ProjectController {

    private final ProjectRepository projectRepository;

    @GetMapping
    public ResponseEntity<List<Project>> getAllProjects() {
        return ResponseEntity.ok(projectRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Project> getProjectById(@PathVariable Long id) {
        return projectRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/ngo/{ngoId}")
    public ResponseEntity<List<Project>> getProjectsByNGO(@PathVariable Long ngoId) {
        return ResponseEntity.ok(projectRepository.findByNgoId(ngoId));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Project>> getProjectsByStatus(@PathVariable String status) {
        Project.ProjectStatus projectStatus = Project.ProjectStatus.valueOf(status.toUpperCase());
        return ResponseEntity.ok(projectRepository.findByStatus(projectStatus));
    }

    @GetMapping("/cause/{cause}")
    public ResponseEntity<List<Project>> getProjectsByCause(@PathVariable String cause) {
        return ResponseEntity.ok(projectRepository.findByCause(cause));
    }
}
```

---

## Security Configuration

### 1. SecurityConfig.java
```java
package com.impacthub.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> {})
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/ngos/**").permitAll()
                .requestMatchers("/api/projects/**").permitAll()
                .anyRequest().authenticated()
            )
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
```

### 2. JwtAuthenticationFilter.java
```java
package com.impacthub.config;

import com.impacthub.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {
        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String userEmail;

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        jwt = authHeader.substring(7);
        userEmail = jwtService.extractEmail(jwt);

        if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);

            if (jwtService.validateToken(jwt, userEmail)) {
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities()
                );
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }
        filterChain.doFilter(request, response);
    }
}
```

### 3. CorsConfig.java
```java
package com.impacthub.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
public class CorsConfig {

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173", "http://localhost:3000"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
```

---

## Frontend Integration

### 1. Create API Service (Frontend)

Create `/src/services/api.ts`:

```typescript
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add JWT token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  registerVolunteer: (data: any) => api.post('/auth/register/volunteer', data),
  registerNGO: (data: any) => api.post('/auth/register/ngo', data),
  login: (email: string, password: string) => 
    api.post('/auth/login', { email, password }),
};

// NGO API
export const ngoAPI = {
  getAll: () => api.get('/ngos'),
  getById: (id: string) => api.get(`/ngos/${id}`),
  getVerified: () => api.get('/ngos/verified'),
  getByCause: (cause: string) => api.get(`/ngos/cause/${cause}`),
  getByCity: (city: string) => api.get(`/ngos/city/${city}`),
};

// Project API
export const projectAPI = {
  getAll: () => api.get('/projects'),
  getById: (id: string) => api.get(`/projects/${id}`),
  getByNGO: (ngoId: string) => api.get(`/projects/ngo/${ngoId}`),
  getByStatus: (status: string) => api.get(`/projects/status/${status}`),
  getByCause: (cause: string) => api.get(`/projects/cause/${cause}`),
};

export default api;
```

### 2. Update Registration Pages

Example for `VolunteerRegistrationPage.tsx`:

```typescript
import { authAPI } from '../services/api';

// In your submit handler:
const handleSubmit = async () => {
  try {
    const response = await authAPI.registerVolunteer({
      email: formData.email,
      password: formData.password,
      fullName: formData.fullName,
      phone: formData.phone,
      // ... all other fields
    });

    // Store token
    localStorage.setItem('authToken', response.data.token);
    localStorage.setItem('currentVolunteer', JSON.stringify(response.data));

    // Navigate to dashboard
    onNavigate('volunteer-dashboard');
  } catch (error) {
    console.error('Registration failed:', error);
    // Show error message to user
  }
};
```

### 3. Update Login Page

```typescript
import { authAPI } from '../services/api';

const handleLogin = async () => {
  try {
    const response = await authAPI.login(email, password);
    
    localStorage.setItem('authToken', response.data.token);
    
    if (response.data.userType === 'VOLUNTEER') {
      localStorage.setItem('currentVolunteer', JSON.stringify(response.data));
      onNavigate('volunteer-dashboard');
    } else if (response.data.userType === 'NGO') {
      localStorage.setItem('currentNGO', JSON.stringify(response.data));
      onNavigate('ngo-admin');
    }
  } catch (error) {
    console.error('Login failed:', error);
  }
};
```

### 4. Fetch Real Data

Replace mock data imports with API calls:

```typescript
// In NGODirectoryPage.tsx
import { ngoAPI } from '../services/api';

useEffect(() => {
  const fetchNGOs = async () => {
    try {
      const response = await ngoAPI.getAll();
      setNGOs(response.data);
    } catch (error) {
      console.error('Failed to fetch NGOs:', error);
    }
  };

  fetchNGOs();
}, []);
```

---

## API Endpoints Reference

### Authentication Endpoints

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| POST | `/api/auth/register/volunteer` | Register new volunteer | VolunteerRegistrationRequest |
| POST | `/api/auth/register/ngo` | Register new NGO | NGORegistrationRequest |
| POST | `/api/auth/login` | User login | LoginRequest (email, password) |

### NGO Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/ngos` | Get all NGOs | No |
| GET | `/api/ngos/{id}` | Get NGO by ID | No |
| GET | `/api/ngos/verified` | Get verified NGOs | No |
| GET | `/api/ngos/cause/{cause}` | Get NGOs by cause | No |
| GET | `/api/ngos/city/{city}` | Get NGOs by city | No |

### Project Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/projects` | Get all projects | No |
| GET | `/api/projects/{id}` | Get project by ID | No |
| GET | `/api/projects/ngo/{ngoId}` | Get projects by NGO | No |
| GET | `/api/projects/status/{status}` | Get projects by status | No |
| GET | `/api/projects/cause/{cause}` | Get projects by cause | No |

---

## Running the Application

### 1. Start MySQL Database
```bash
mysql -u root -p
CREATE DATABASE impacthub_db;
```

### 2. Start Spring Boot Backend
```bash
cd impact-hub-backend
mvn clean install
mvn spring-boot:run
```

Backend will run on: `http://localhost:8080`

### 3. Start React Frontend
```bash
npm install
npm run dev
```

Frontend will run on: `http://localhost:5173`

---

## Testing the Integration

### 1. Test Registration
- Navigate to volunteer registration
- Fill in all required fields
- Submit and check:
  - User created in `users` table
  - Volunteer profile created in `volunteers` table
  - JWT token received and stored

### 2. Test Login
- Use registered credentials
- Verify token is received
- Check if redirected to appropriate dashboard

### 3. Test Data Fetching
- Browse NGOs page should fetch from `/api/ngos`
- Project details should fetch from `/api/projects/{id}`
- Verify data displays correctly

---

## Additional Features to Implement

1. **File Upload for Images**
   - Implement file upload service
   - Store images in cloud storage (AWS S3, Cloudinary)
   - Update URLs in database

2. **Email Notifications**
   - Add Spring Boot Mail dependency
   - Send verification emails
   - Send enrollment confirmations

3. **Advanced Search & Filtering**
   - Implement JPA Specifications
   - Add pagination support
   - Create filter DTOs

4. **Admin Panel**
   - NGO verification workflow
   - User management
   - Analytics dashboard

5. **Volunteer Enrollment**
   - Enroll in projects
   - Track volunteer hours
   - Generate certificates

---

## Deployment Considerations

### Database
- Use MySQL cloud services (AWS RDS, Google Cloud SQL)
- Configure connection pooling
- Set up automated backups

### Backend
- Deploy to cloud platforms (AWS, Heroku, Railway)
- Configure environment variables
- Set up CI/CD pipeline

### Frontend
- Deploy to Vercel, Netlify, or AWS S3
- Update API base URL to production endpoint
- Configure CORS for production domain

---

## Security Best Practices

1. **Never commit sensitive data**
   - Use environment variables for secrets
   - Add `.env` to `.gitignore`

2. **Password Security**
   - Use BCrypt for hashing
   - Implement password strength requirements
   - Add password reset functionality

3. **JWT Security**
   - Use strong secret keys (256+ bits)
   - Implement token refresh mechanism
   - Add token blacklisting for logout

4. **API Security**
   - Implement rate limiting
   - Validate all inputs
   - Use HTTPS in production

---

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Verify CORS configuration in `CorsConfig.java`
   - Check frontend URL matches allowed origins

2. **Database Connection**
   - Verify MySQL is running
   - Check credentials in `application.properties`
   - Ensure database exists

3. **JWT Errors**
   - Verify secret key is set
   - Check token format in headers
   - Validate token expiration time

4. **Null Pointer Exceptions**
   - Check entity relationships
   - Verify cascade settings
   - Add null checks in services

---

## Contact & Support

For issues or questions:
- Check Spring Boot logs: `logs/spring.log`
- Review MySQL error logs
- Use Postman to test API endpoints directly
- Check browser console for frontend errors

---

**Last Updated:** January 2026
**Version:** 1.0.0
