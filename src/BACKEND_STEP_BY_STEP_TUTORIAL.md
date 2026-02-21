# ImpactHub Backend - Complete Step-by-Step Tutorial for Beginners

## 📚 Table of Contents
1. [Understanding the Architecture](#1-understanding-the-architecture)
2. [Setting Up Development Environment](#2-setting-up-development-environment)
3. [Creating the MySQL Database](#3-creating-the-mysql-database)
4. [Creating the Spring Boot Backend](#4-creating-the-spring-boot-backend)
5. [Writing the Backend Code](#5-writing-the-backend-code)
6. [Testing Your Backend](#6-testing-your-backend)
7. [Connecting Frontend to Backend](#7-connecting-frontend-to-backend)
8. [Deployment](#8-deployment)
9. [Troubleshooting Common Issues](#9-troubleshooting-common-issues)

---

## 1. Understanding the Architecture

### What You're Building

Think of your application like a restaurant:

```
┌─────────────────────────────────────────────────────────┐
│                      FRONTEND (React)                    │
│  "The Restaurant Dining Area - What Customers See"      │
│  - Beautiful UI with forms and dashboards                │
│  - Runs in the user's web browser                       │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ HTTP Requests (like ordering food)
                     │
┌────────────────────▼────────────────────────────────────┐
│                  BACKEND (Spring Boot)                   │
│  "The Kitchen - Processes Orders & Business Logic"      │
│  - Receives requests from frontend                       │
│  - Validates data, applies business rules               │
│  - Talks to database to save/retrieve data              │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ SQL Queries (getting/storing ingredients)
                     │
┌────────────────────▼────────────────────────────────────┐
│                   DATABASE (MySQL)                       │
│  "The Storage Room - Permanent Data Storage"            │
│  - Stores users, NGOs, volunteers, projects             │
│  - Data persists even if server restarts                │
└─────────────────────────────────────────────────────────┘
```

### How Data Flows

**Example: User Registration**

1. User fills out volunteer registration form on **frontend**
2. Frontend sends data to **backend** via HTTP POST request
3. Backend receives data, validates it, hashes the password
4. Backend saves data to **database** (users table, volunteers table)
5. Backend sends success response back to **frontend**
6. Frontend shows success message and redirects to login

---

## 2. Setting Up Development Environment

### Step 2.1: Install Java Development Kit (JDK)

**What it is:** Java is the programming language Spring Boot uses.

**Download & Install:**
1. Go to: https://www.oracle.com/java/technologies/downloads/
2. Download **Java 17** or higher for your operating system
3. Run the installer (default settings are fine)

**Verify Installation:**
Open terminal/command prompt and type:
```bash
java -version
```
You should see something like: `java version "17.0.x"`

---

### Step 2.2: Install MySQL Database

**What it is:** MySQL is where all your data is permanently stored.

**Download & Install:**
1. Go to: https://dev.mysql.com/downloads/installer/
2. Download **MySQL Installer** for your OS
3. During installation:
   - Choose "Developer Default" setup
   - Set a **root password** (REMEMBER THIS!)
   - Example password: `ImpactHub2024!`

**Verify Installation:**
1. Open **MySQL Workbench** (installed with MySQL)
2. Connect to Local instance (enter your root password)
3. If connection succeeds, you're good!

---

### Step 2.3: Install IntelliJ IDEA (IDE)

**What it is:** An editor that makes Java coding much easier.

**Download & Install:**
1. Go to: https://www.jetbrains.com/idea/download/
2. Download **Community Edition** (it's free!)
3. Install with default settings

**Why use it:**
- Auto-completion (suggests code as you type)
- Error detection (highlights mistakes)
- Easy project navigation
- Built-in Maven support

---

### Step 2.4: Install Postman (Optional but Recommended)

**What it is:** A tool to test your API endpoints.

**Download & Install:**
1. Go to: https://www.postman.com/downloads/
2. Download and install

**Why use it:**
Test backend endpoints before connecting frontend.

---

## 3. Creating the MySQL Database

### Step 3.1: Open MySQL Workbench

1. Launch **MySQL Workbench**
2. Click on your **Local instance**
3. Enter your **root password**

---

### Step 3.2: Create Database

Click on the SQL editor and run this command:

```sql
CREATE DATABASE impacthub_db;
USE impacthub_db;
```

**What this does:** Creates an empty database named `impacthub_db`.

---

### Step 3.3: Create Tables

Copy and paste these SQL commands one by one:

**Users Table:**
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

**Volunteers Table:**
```sql
CREATE TABLE volunteers (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    date_of_birth DATE,
    gender ENUM('Male', 'Female', 'Other', 'PreferNotToSay'),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(10),
    availability VARCHAR(50),
    experience_level ENUM('Beginner', 'Intermediate', 'Advanced'),
    education VARCHAR(255),
    occupation VARCHAR(255),
    linkedin_url VARCHAR(500),
    emergency_contact_name VARCHAR(255),
    emergency_contact_phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_city (city)
);
```

**NGOs Table:**
```sql
CREATE TABLE ngos (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT UNIQUE NOT NULL,
    ngo_name VARCHAR(255) NOT NULL,
    registration_number VARCHAR(100) UNIQUE NOT NULL,
    year_founded INT,
    ngo_type ENUM('Trust', 'Society', 'Section8Company', 'Other'),
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
    is_verified BOOLEAN DEFAULT FALSE,
    active_projects INT DEFAULT 0,
    completed_projects INT DEFAULT 0,
    logo_url VARCHAR(500),
    cover_image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_verified (is_verified)
);
```

**Projects Table:**
```sql
CREATE TABLE projects (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    ngo_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    cause VARCHAR(100),
    location VARCHAR(255),
    status ENUM('ONGOING', 'COMPLETED', 'FUNDED') DEFAULT 'ONGOING',
    start_date DATE,
    end_date DATE,
    beneficiaries INT DEFAULT 0,
    image_url VARCHAR(500),
    volunteers_needed INT DEFAULT 0,
    volunteers_enrolled INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (ngo_id) REFERENCES ngos(id) ON DELETE CASCADE,
    INDEX idx_status (status)
);
```

**Volunteer Enrollments Table:**
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
    UNIQUE KEY unique_enrollment (volunteer_id, project_id)
);
```

**Supporting Tables for Lists:**
```sql
-- Volunteer Skills
CREATE TABLE volunteer_skills (
    volunteer_id BIGINT NOT NULL,
    skill VARCHAR(255),
    FOREIGN KEY (volunteer_id) REFERENCES volunteers(id) ON DELETE CASCADE
);

-- Volunteer Interests
CREATE TABLE volunteer_interests (
    volunteer_id BIGINT NOT NULL,
    interest VARCHAR(255),
    FOREIGN KEY (volunteer_id) REFERENCES volunteers(id) ON DELETE CASCADE
);

-- Volunteer Preferred Causes
CREATE TABLE volunteer_preferred_causes (
    volunteer_id BIGINT NOT NULL,
    cause VARCHAR(255),
    FOREIGN KEY (volunteer_id) REFERENCES volunteers(id) ON DELETE CASCADE
);

-- NGO Cause Focus
CREATE TABLE ngo_cause_focus (
    ngo_id BIGINT NOT NULL,
    cause VARCHAR(255),
    FOREIGN KEY (ngo_id) REFERENCES ngos(id) ON DELETE CASCADE
);
```

**Verify Tables Created:**
```sql
SHOW TABLES;
```

You should see all tables listed!

---

## 4. Creating the Spring Boot Backend

### Step 4.1: Generate Spring Boot Project

**Using Spring Initializr Website:**

1. Go to: **https://start.spring.io/**

2. Fill in the form:
   - **Project:** Maven
   - **Language:** Java
   - **Spring Boot:** 3.2.x (latest stable version)
   - **Group:** com.impacthub
   - **Artifact:** backend
   - **Name:** ImpactHub Backend
   - **Description:** Backend API for ImpactHub platform
   - **Package name:** com.impacthub
   - **Packaging:** Jar
   - **Java:** 17

3. Click **"ADD DEPENDENCIES"** button and add these:
   - Spring Web
   - Spring Data JPA
   - MySQL Driver
   - Spring Security
   - Validation
   - Lombok
   - Spring Boot DevTools

4. Click **"GENERATE"** button
   - This downloads a file called `backend.zip`

5. **Extract the ZIP:**
   - Extract to: `C:\Projects\impacthub-backend` (Windows)
   - Or: `~/Projects/impacthub-backend` (Mac/Linux)

---

### Step 4.2: Open Project in IntelliJ

1. Open **IntelliJ IDEA**
2. Click **"Open"**
3. Navigate to extracted folder and select it
4. Click **OK**

**Wait for Dependencies Download:**
- Bottom right corner shows progress
- First time takes 2-5 minutes
- IntelliJ downloads all required libraries

---

### Step 4.3: Add JWT Dependencies

**Why:** JWT (JSON Web Tokens) are used for secure authentication.

**Open:** `pom.xml` (in project root)

**Find** the `<dependencies>` section and **add** these inside it:

```xml
<!-- JWT Dependencies for Authentication -->
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
```

**After adding:** Click the "Load Maven Changes" icon (top right) or press `Ctrl+Shift+O`

---

### Step 4.4: Configure Database Connection

**Open:** `src/main/resources/application.properties`

**Delete everything** and **replace with:**

```properties
# ===================================
# Server Configuration
# ===================================
server.port=8080
spring.application.name=ImpactHub

# ===================================
# MySQL Database Configuration
# ===================================
spring.datasource.url=jdbc:mysql://localhost:3306/impacthub_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_ROOT_PASSWORD_HERE
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# ===================================
# JPA/Hibernate Configuration
# ===================================
# update = automatically update database schema based on entities
spring.jpa.hibernate.ddl-auto=update
# Show SQL queries in console (helpful for debugging)
spring.jpa.show-sql=true
# MySQL dialect for Hibernate
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect
# Format SQL for readability
spring.jpa.properties.hibernate.format_sql=true

# ===================================
# JWT Security Configuration
# ===================================
# Secret key for signing JWT tokens (CHANGE IN PRODUCTION!)
jwt.secret=impacthub-super-secret-key-minimum-256-bits-required-for-security
# Token expiration: 86400000 ms = 24 hours
jwt.expiration=86400000

# ===================================
# File Upload Configuration
# ===================================
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB

# ===================================
# Logging Configuration
# ===================================
logging.level.com.impacthub=DEBUG
logging.level.org.springframework.security=DEBUG
logging.level.org.springframework.web=INFO
```

**IMPORTANT:** Replace `YOUR_MYSQL_ROOT_PASSWORD_HERE` with your actual MySQL password!

---

### Step 4.5: Create Package Structure

**In IntelliJ Project Explorer:**

Right-click on `src/main/java/com/impacthub` → New → Package

Create these packages:
1. `config`
2. `controller`
3. `dto`
4. `dto.request`
5. `dto.response`
6. `entity`
7. `exception`
8. `repository`
9. `service`

**Final structure:**
```
src/main/java/com/impacthub/
├── ImpactHubApplication.java (already exists)
├── config/          (security, JWT, CORS configuration)
├── controller/      (REST API endpoints)
├── dto/
│   ├── request/    (incoming data from frontend)
│   └── response/   (outgoing data to frontend)
├── entity/         (database models)
├── exception/      (error handling)
├── repository/     (database operations)
└── service/        (business logic)
```

---

## 5. Writing the Backend Code

### Understanding the Layers

**Think of it like a factory assembly line:**

```
1. CONTROLLER (Receives orders)
   ↓
2. SERVICE (Processes orders)
   ↓
3. REPOSITORY (Gets/stores materials)
   ↓
4. DATABASE (Storage warehouse)
```

We'll build from bottom to top.

---

### Step 5.1: Create Entity Classes

**What they are:** Java representations of database tables.

**📁 Create:** `src/main/java/com/impacthub/entity/User.java`

```java
package com.impacthub.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity  // Tells Spring this is a database table
@Table(name = "users")  // Table name in MySQL
@Data  // Lombok: Auto-generates getters, setters, toString, etc.
@NoArgsConstructor  // Lombok: Creates empty constructor
@AllArgsConstructor  // Lombok: Creates constructor with all fields
public class User {
    
    @Id  // Primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY)  // Auto-increment
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Enumerated(EnumType.STRING)  // Store enum as string in DB
    @Column(name = "user_type", nullable = false)
    private UserType userType;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @CreationTimestamp  // Auto-set on creation
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp  // Auto-update on modification
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Enum for user types
    public enum UserType {
        VOLUNTEER, NGO, ADMIN
    }
}
```

**Key Annotations Explained:**
- `@Entity` - Marks this class as a database table
- `@Table(name = "users")` - Specifies table name
- `@Id` - Marks the primary key field
- `@Column` - Customizes column properties
- `@Data` - Lombok generates getters/setters automatically
- `@CreationTimestamp` - Automatically fills createdAt field

---

**📁 Create:** `src/main/java/com/impacthub/entity/Volunteer.java`

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

    // One-to-One relationship with User
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

    // List of skills (stored in separate table: volunteer_skills)
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

**Relationship Explained:**
- `@OneToOne` - Each volunteer has exactly one user account
- `@ElementCollection` - For storing lists (skills, interests) in separate tables

---

**📁 Create:** `src/main/java/com/impacthub/entity/NGO.java`

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

---

**📁 Create:** `src/main/java/com/impacthub/entity/Project.java`

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

@Entity
@Table(name = "projects")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Project {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Many-to-One: Many projects belong to one NGO
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

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    private Integer beneficiaries = 0;

    @Column(name = "image_url")
    private String imageUrl;

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

**Relationship Explained:**
- `@ManyToOne` - Many projects can belong to one NGO

---

**📁 Create:** `src/main/java/com/impacthub/entity/VolunteerEnrollment.java`

```java
package com.impacthub.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(
    name = "volunteer_enrollments",
    uniqueConstraints = @UniqueConstraint(
        columnNames = {"volunteer_id", "project_id"},
        name = "unique_enrollment"
    )
)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class VolunteerEnrollment {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Many-to-One: Many enrollments can belong to one volunteer
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "volunteer_id", nullable = false)
    private Volunteer volunteer;

    // Many-to-One: Many enrollments can belong to one project
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @CreationTimestamp
    @Column(name = "enrollment_date", updatable = false)
    private LocalDateTime enrollmentDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EnrollmentStatus status = EnrollmentStatus.ACTIVE;

    @Column(name = "hours_contributed")
    private Integer hoursContributed = 0;

    @Column(columnDefinition = "TEXT")
    private String notes;

    // Enum for enrollment status
    public enum EnrollmentStatus {
        ACTIVE,      // Volunteer is currently working on the project
        COMPLETED,   // Volunteer has completed their work
        CANCELLED    // Enrollment was cancelled
    }
}
```

**Key Features of VolunteerEnrollment:**
- **Unique Constraint:** A volunteer can only enroll in the same project once (prevents duplicates)
- **@ManyToOne Relationships:** 
  - One volunteer can have many enrollments
  - One project can have many enrollments
- **@CreationTimestamp:** Automatically records when the volunteer enrolled
- **Lazy Fetching:** Improves performance by loading related data only when needed
- **Status Tracking:** Tracks the current state of the volunteer's participation

**Common Use Cases:**
1. **Enrolling a volunteer in a project:** Create new VolunteerEnrollment with ACTIVE status
2. **Tracking hours:** Update `hoursContributed` field as volunteer logs time
3. **Completing participation:** Change status from ACTIVE to COMPLETED
4. **Viewing volunteer's projects:** Query all enrollments for a specific volunteer
5. **Viewing project's volunteers:** Query all enrollments for a specific project

**Business Logic Examples:**

```java
// Example: When a volunteer enrolls in a project
// 1. Create enrollment record
// 2. Increment project.volunteersEnrolled count
// 3. Send confirmation notification

// Example: When tracking hours
// 1. Update enrollment.hoursContributed
// 2. Update volunteer's total hours (if tracked)
// 3. Update project progress metrics
```

---

### Step 5.2: Create Repository Interfaces

**What they are:** Interfaces that provide database operations (no code needed - Spring generates it!).

**📁 Create:** `src/main/java/com/impacthub/repository/UserRepository.java`

```java
package com.impacthub.repository;

import com.impacthub.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    // Spring automatically implements these methods!
    Optional<User> findByEmail(String email);
    Boolean existsByEmail(String email);
}
```

**How it works:**
- `JpaRepository<User, Long>` gives you basic CRUD operations: save(), findById(), findAll(), delete()
- Custom methods like `findByEmail()` are auto-generated based on the method name!

---

**📁 Create:** `src/main/java/com/impacthub/repository/VolunteerRepository.java`

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

---

**📁 Create:** `src/main/java/com/impacthub/repository/NGORepository.java`

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
    
    // Custom query to search by cause in the list
    @Query("SELECT n FROM NGO n WHERE :cause MEMBER OF n.causeFocus")
    List<NGO> findByCause(String cause);
}
```

---

**📁 Create:** `src/main/java/com/impacthub/repository/ProjectRepository.java`

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

---

**📁 Create:** `src/main/java/com/impacthub/repository/VolunteerEnrollmentRepository.java`

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

### Step 5.3: Create DTOs (Data Transfer Objects)

**What they are:** Objects that define what data comes in and goes out of APIs.

**📁 Create:** `src/main/java/com/impacthub/dto/request/LoginRequest.java`

```java
package com.impacthub.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {
    
    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    private String email;
    
    @NotBlank(message = "Password is required")
    private String password;
}
```

---

**📁 Create:** `src/main/java/com/impacthub/dto/request/VolunteerRegistrationRequest.java`

```java
package com.impacthub.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class VolunteerRegistrationRequest {
    
    // Step 1: Account Details
    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    private String email;
    
    @NotBlank(message = "Password is required")
    private String password;
    
    // Step 2: Personal Information
    @NotBlank(message = "Full name is required")
    private String fullName;
    
    private String phone;
    private LocalDate dateOfBirth;
    private String gender;
    private String address;
    private String city;
    private String state;
    private String pincode;
    
    // Step 3: Skills & Interests
    private List<String> skills;
    private List<String> interests;
    private String availability;
    private List<String> preferredCauses;
    private String experienceLevel;
    
    // Step 4: Additional Details
    private String education;
    private String occupation;
    private String linkedinUrl;
    private String emergencyContactName;
    private String emergencyContactPhone;
}
```

---

**📁 Create:** `src/main/java/com/impacthub/dto/request/NGORegistrationRequest.java`

```java
package com.impacthub.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.List;

@Data
public class NGORegistrationRequest {
    
    // Step 1: Account Details
    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    private String email;
    
    @NotBlank(message = "Password is required")
    private String password;
    
    // Step 2: Organization Details
    @NotBlank(message = "NGO name is required")
    private String ngoName;
    
    @NotBlank(message = "Registration number is required")
    private String registrationNumber;
    
    private Integer yearFounded;
    private String ngoType;
    private List<String> causeFocus;
    private String mission;
    private String vision;
    
    // Step 3: Contact Information
    private String websiteUrl;
    private String phone;
    private String ngoEmail;
    private String address;
    private String city;
    private String state;
    private String pincode;
    
    // Step 4: Legal & Compliance
    private String panNumber;
    private String tanNumber;
    private String gstNumber;
    
    // Step 5: Primary Contact
    private String primaryContactName;
    private String primaryContactDesignation;
    private String primaryContactPhone;
    private String primaryContactEmail;
}
```

---

**📁 Create:** `src/main/java/com/impacthub/dto/response/AuthResponse.java`

```java
package com.impacthub.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponse {
    private String token;
    private String userType;
    private String email;
    private String message;
}
```

---

### Step 5.4: Create Services (Business Logic)

**📁 Create:** `src/main/java/com/impacthub/service/JwtService.java`

```java
package com.impacthub.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
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

    // Generate JWT token
    public String generateToken(String email, String userType) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userType", userType);
        
        return Jwts.builder()
                .claims(claims)
                .subject(email)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSigningKey())
                .compact();
    }

    // Extract email from token
    public String extractEmail(String token) {
        return extractAllClaims(token).getSubject();
    }

    // Extract user type from token
    public String extractUserType(String token) {
        return (String) extractAllClaims(token).get("userType");
    }

    // Validate token
    public Boolean validateToken(String token, String email) {
        final String tokenEmail = extractEmail(token);
        return (tokenEmail.equals(email) && !isTokenExpired(token));
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    private Boolean isTokenExpired(String token) {
        return extractAllClaims(token).getExpiration().before(new Date());
    }
}
```

---

**📁 Create:** `src/main/java/com/impacthub/service/AuthService.java`

```java
package com.impacthub.service;

import com.impacthub.dto.request.LoginRequest;
import com.impacthub.dto.request.NGORegistrationRequest;
import com.impacthub.dto.request.VolunteerRegistrationRequest;
import com.impacthub.dto.response.AuthResponse;
import com.impacthub.entity.NGO;
import com.impacthub.entity.User;
import com.impacthub.entity.Volunteer;
import com.impacthub.repository.NGORepository;
import com.impacthub.repository.UserRepository;
import com.impacthub.repository.VolunteerRepository;
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

    // Login
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Invalid password");
        }

        String token = jwtService.generateToken(user.getEmail(), user.getUserType().name());

        return new AuthResponse(
                token,
                user.getUserType().name(),
                user.getEmail(),
                "Login successful"
        );
    }

    // Volunteer Registration
    @Transactional
    public AuthResponse registerVolunteer(VolunteerRegistrationRequest request) {
        // Check if email already exists
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
        
        if (request.getGender() != null) {
            volunteer.setGender(Volunteer.Gender.valueOf(request.getGender()));
        }
        
        volunteer.setAddress(request.getAddress());
        volunteer.setCity(request.getCity());
        volunteer.setState(request.getState());
        volunteer.setPincode(request.getPincode());
        volunteer.setSkills(request.getSkills());
        volunteer.setInterests(request.getInterests());
        volunteer.setAvailability(request.getAvailability());
        volunteer.setPreferredCauses(request.getPreferredCauses());
        
        if (request.getExperienceLevel() != null) {
            volunteer.setExperienceLevel(Volunteer.ExperienceLevel.valueOf(request.getExperienceLevel()));
        }
        
        volunteer.setEducation(request.getEducation());
        volunteer.setOccupation(request.getOccupation());
        volunteer.setLinkedinUrl(request.getLinkedinUrl());
        volunteer.setEmergencyContactName(request.getEmergencyContactName());
        volunteer.setEmergencyContactPhone(request.getEmergencyContactPhone());
        
        volunteerRepository.save(volunteer);

        String token = jwtService.generateToken(savedUser.getEmail(), savedUser.getUserType().name());

        return new AuthResponse(
                token,
                "VOLUNTEER",
                savedUser.getEmail(),
                "Volunteer registration successful"
        );
    }

    // NGO Registration
    @Transactional
    public AuthResponse registerNGO(NGORegistrationRequest request) {
        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        // Check if registration number already exists
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
        
        if (request.getNgoType() != null) {
            ngo.setNgoType(NGO.NGOType.valueOf(request.getNgoType()));
        }
        
        ngo.setCauseFocus(request.getCauseFocus());
        ngo.setMission(request.getMission());
        ngo.setVision(request.getVision());
        ngo.setWebsiteUrl(request.getWebsiteUrl());
        ngo.setPhone(request.getPhone());
        ngo.setEmail(request.getNgoEmail());
        ngo.setAddress(request.getAddress());
        ngo.setCity(request.getCity());
        ngo.setState(request.getState());
        ngo.setPincode(request.getPincode());
        ngo.setPanNumber(request.getPanNumber());
        ngo.setPrimaryContactName(request.getPrimaryContactName());
        ngo.setPrimaryContactDesignation(request.getPrimaryContactDesignation());
        ngo.setPrimaryContactPhone(request.getPrimaryContactPhone());
        ngo.setPrimaryContactEmail(request.getPrimaryContactEmail());
        ngo.setIsVerified(false);
        
        ngoRepository.save(ngo);

        String token = jwtService.generateToken(savedUser.getEmail(), savedUser.getUserType().name());

        return new AuthResponse(
                token,
                "NGO",
                savedUser.getEmail(),
                "NGO registration successful"
        );
    }
}
```

---

### Step 5.5: Create Controllers (API Endpoints)

**📁 Create:** `src/main/java/com/impacthub/controller/AuthController.java`

```java
package com.impacthub.controller;

import com.impacthub.dto.request.LoginRequest;
import com.impacthub.dto.request.NGORegistrationRequest;
import com.impacthub.dto.request.VolunteerRegistrationRequest;
import com.impacthub.dto.response.AuthResponse;
import com.impacthub.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173") // Allow React frontend
public class AuthController {

    private final AuthService authService;

    // POST /api/auth/login
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        try {
            AuthResponse response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new AuthResponse(null, null, null, e.getMessage()));
        }
    }

    // POST /api/auth/register/volunteer
    @PostMapping("/register/volunteer")
    public ResponseEntity<AuthResponse> registerVolunteer(
            @Valid @RequestBody VolunteerRegistrationRequest request) {
        try {
            AuthResponse response = authService.registerVolunteer(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new AuthResponse(null, null, null, e.getMessage()));
        }
    }

    // POST /api/auth/register/ngo
    @PostMapping("/register/ngo")
    public ResponseEntity<AuthResponse> registerNGO(
            @Valid @RequestBody NGORegistrationRequest request) {
        try {
            AuthResponse response = authService.registerNGO(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new AuthResponse(null, null, null, e.getMessage()));
        }
    }
}
```

**What this does:**
- Creates 3 API endpoints:
  - `POST /api/auth/login` - For user login
  - `POST /api/auth/register/volunteer` - For volunteer registration
  - `POST /api/auth/register/ngo` - For NGO registration
- `@CrossOrigin` allows your React frontend to call these APIs

---

### Step 5.6: Configure Security

**📁 Create:** `src/main/java/com/impacthub/config/SecurityConfig.java`

```java
package com.impacthub.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // Disable CSRF for REST API
                .cors(cors -> cors.configurationSource(corsConfigurationSource())) // Enable CORS
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**").permitAll() // Allow auth endpoints
                        .anyRequest().authenticated() // Protect other endpoints
                )
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS) // No sessions (JWT-based)
                );

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(); // For password hashing
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173")); // React dev server
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
```

**What this does:**
- Disables CSRF (not needed for JWT-based APIs)
- Enables CORS to allow React app to call APIs
- Makes `/api/auth/**` endpoints public (no login needed)
- Uses BCrypt to hash passwords securely

---

### Step 5.7: Create Exception Handler

**📁 Create:** `src/main/java/com/impacthub/exception/GlobalExceptionHandler.java`

```java
package com.impacthub.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    // Handle validation errors
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationErrors(
            MethodArgumentNotValidException ex) {
        
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error ->
                errors.put(error.getField(), error.getDefaultMessage())
        );
        
        return ResponseEntity.badRequest().body(errors);
    }

    // Handle generic runtime exceptions
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleRuntimeException(RuntimeException ex) {
        Map<String, String> error = new HashMap<>();
        error.put("error", ex.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }
}
```

---

## 6. Testing Your Backend

### Step 6.1: Run the Application

**In IntelliJ:**
1. Find `ImpactHubApplication.java` (main class)
2. Right-click → Run 'ImpactHubApplication'

**Or via terminal:**
```bash
./mvnw spring-boot:run
```

**Check console output:**
```
Started ImpactHubApplication in 5.234 seconds (JVM running for 5.891)
```

✅ Backend is now running on **http://localhost:8080**

---

### Step 6.2: Test with Postman

**Test 1: Volunteer Registration**

1. Open Postman
2. Create new request:
   - Method: **POST**
   - URL: `http://localhost:8080/api/auth/register/volunteer`
   - Headers: `Content-Type: application/json`
   - Body (raw JSON):
   
```json
{
    "email": "test@volunteer.com",
    "password": "password123",
    "fullName": "John Doe",
    "phone": "9876543210",
    "dateOfBirth": "1995-05-15",
    "gender": "Male",
    "city": "Mumbai",
    "state": "Maharashtra",
    "skills": ["Teaching", "Event Management"],
    "interests": ["Education", "Environment"],
    "availability": "Weekends",
    "experienceLevel": "Beginner",
    "education": "B.Tech",
    "occupation": "Software Engineer"
}
```

3. Click **Send**

**Expected Response (200 OK):**
```json
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "userType": "VOLUNTEER",
    "email": "test@volunteer.com",
    "message": "Volunteer registration successful"
}
```

---

**Test 2: Login**

1. New request:
   - Method: **POST**
   - URL: `http://localhost:8080/api/auth/login`
   - Body:
   
```json
{
    "email": "test@volunteer.com",
    "password": "password123"
}
```

2. Click **Send**

**Expected Response:**
```json
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "userType": "VOLUNTEER",
    "email": "test@volunteer.com",
    "message": "Login successful"
}
```

---

**Test 3: NGO Registration**

```json
{
    "email": "ngo@example.org",
    "password": "ngopass123",
    "ngoName": "Green Earth Foundation",
    "registrationNumber": "NGO2024001",
    "yearFounded": 2010,
    "ngoType": "Trust",
    "causeFocus": ["Environment", "Education"],
    "mission": "To protect the environment",
    "city": "Delhi",
    "state": "Delhi",
    "primaryContactName": "Jane Smith",
    "primaryContactPhone": "9876543210",
    "primaryContactEmail": "jane@greenearth.org"
}
```

---

### Step 6.3: Verify Database

**Open MySQL Workbench:**

```sql
USE impacthub_db;

-- Check if user was created
SELECT * FROM users;

-- Check volunteer profile
SELECT * FROM volunteers;

-- Check NGO profile
SELECT * FROM ngos;
```

You should see your test data!

---

## 7. Connecting Frontend to Backend

### Step 7.1: Update Frontend API Calls

**In your React project**, update API base URL.

**Create:** `src/lib/api.ts` (if it doesn't exist):

```typescript
const API_BASE_URL = 'http://localhost:8080/api';

export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }
    
    return response.json();
  },
  
  registerVolunteer: async (data: any) => {
    const response = await fetch(`${API_BASE_URL}/auth/register/volunteer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }
    
    return response.json();
  },
  
  registerNGO: async (data: any) => {
    const response = await fetch(`${API_BASE_URL}/auth/register/ngo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }
    
    return response.json();
  },
};
```

---

### Step 7.2: Update Login Page

```typescript
import { authAPI } from '../lib/api';

const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  
  try {
    const response = await authAPI.login(email, password);
    
    // Store token
    localStorage.setItem('token', response.token);
    localStorage.setItem('userType', response.userType);
    
    // Redirect based on user type
    if (response.userType === 'VOLUNTEER') {
      navigate('/volunteer-dashboard');
    } else if (response.userType === 'NGO') {
      navigate('/ngo-admin');
    }
  } catch (error) {
    alert(error.message);
  }
};
```

---

### Step 7.3: Update Registration Pages

**In VolunteerRegistrationPage.tsx:**

```typescript
const handleSubmit = async () => {
  try {
    const response = await authAPI.registerVolunteer(formData);
    
    localStorage.setItem('token', response.token);
    localStorage.setItem('userType', response.userType);
    
    navigate('/volunteer-dashboard');
  } catch (error) {
    alert(error.message);
  }
};
```

---

## 8. Deployment

### Option 1: Deploy Locally

**Backend:**
```bash
./mvnw clean package
java -jar target/backend-0.0.1-SNAPSHOT.jar
```

**Frontend:**
```bash
npm run build
npm run preview
```

---

### Option 2: Deploy to Cloud

**Backend (Heroku/Railway):**
1. Create account on Railway.app
2. Connect GitHub repo
3. Set environment variables:
   - `SPRING_DATASOURCE_URL`
   - `SPRING_DATASOURCE_USERNAME`
   - `SPRING_DATASOURCE_PASSWORD`
   - `JWT_SECRET`
4. Deploy!

**Database (Cloud MySQL):**
- Use PlanetScale, AWS RDS, or Railway Postgres

**Frontend (Vercel/Netlify):**
```bash
npm run build
# Upload dist folder to Vercel
```

---

## 9. Troubleshooting Common Issues

### Issue 1: "Table doesn't exist"
**Solution:** Ensure `spring.jpa.hibernate.ddl-auto=update` in application.properties

### Issue 2: "Access denied for user"
**Solution:** Check MySQL username/password in application.properties

### Issue 3: "CORS error" in frontend
**Solution:** Add frontend URL to SecurityConfig CORS configuration

### Issue 4: "JWT signature does not match"
**Solution:** Ensure `jwt.secret` is at least 256 bits (32 characters)

### Issue 5: Port 8080 already in use
**Solution:** Change port in application.properties: `server.port=8081`

---

## 🎉 Congratulations!

You've successfully created a full-stack application with:
✅ MySQL database with proper schema
✅ Spring Boot REST API with JWT authentication
✅ React frontend connected to backend
✅ Secure password hashing
✅ Protected API endpoints

### Next Steps:
1. Add more controllers (ProjectController, NGOController, etc.)
2. Implement JWT authentication filter
3. Add file upload for images
4. Create comprehensive API tests
5. Add logging and monitoring

---

## Quick Reference Commands

**Start MySQL:**
```bash
mysql -u root -p
```

**Run Spring Boot:**
```bash
./mvnw spring-boot:run
```

**Build JAR:**
```bash
./mvnw clean package
```

**Run Built JAR:**
```bash
java -jar target/backend-0.0.1-SNAPSHOT.jar
```

---

## Need Help?

- **Spring Boot Docs:** https://spring.io/guides
- **MySQL Docs:** https://dev.mysql.com/doc/
- **JWT Guide:** https://jwt.io/introduction
- **Stack Overflow:** Tag questions with `spring-boot` and `mysql`

---

**Good luck with your ImpactHub platform! 🚀**
