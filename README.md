# Library Management System

A complete **Library Management System** built using **ASP.NET Core 8 Web API**. The system provides a RESTful API for managing books, authors, categories, publishers, members, borrowing transactions, system users, authentication, authorization, and activity logs.

## GitHub Repository

**GitHub:** https://github.com/your-username/LibraryManagementSystem

> Replace the GitHub URL above with your actual repository URL before submission.

---

## Table of Contents

* [Project Overview](#project-overview)
* [Technologies](#technologies)
* [Architecture](#architecture)
* [Main Features](#main-features)
* [Authentication & Authorization](#authentication--authorization)
* [API Endpoints](#api-endpoints)

  * [Activity Logs](#activity-logs)
  * [Authentication](#authentication)
  * [Authors](#authors)
  * [Books](#books)
  * [Borrowing](#borrowing)
  * [Categories](#categories)
  * [Members](#members)
  * [Publishers](#publishers)
  * [Users](#users)
* [Database Relationships](#database-relationships)
* [Repository & Unit of Work](#repository--unit-of-work)
* [DTOs](#dtos)
* [Swagger / OpenAPI](#swagger--openapi)
* [Postman](#postman)
* [Security](#security)
* [Project Structure](#project-structure)
* [Setup & Installation](#setup--installation)
* [Running the Project](#running-the-project)
* [Testing](#testing)
* [Bonus Features](#bonus-features)
* [Authentication Flow](#authentication-flow)
* [Conclusion](#conclusion)

---

## Project Overview

The **Library Management System** is a backend application designed to manage the main operations of a library through a RESTful Web API.

The system allows administrators and authorized users to manage:

* Books
* Authors
* Categories
* Publishers
* Library Members
* System Users
* Borrowing Transactions
* Activity Logs

The application also provides authentication and authorization using **JWT Bearer Tokens** and role-based access control.

---

## Technologies

The project is built using the following technologies:

* **ASP.NET Core 8 Web API**
* **Entity Framework Core**
* **SQL Server**
* **C#**
* **Repository Pattern**
* **Unit of Work Pattern**
* **DTOs (Data Transfer Objects)**
* **Dependency Injection**
* **JWT Authentication**
* **Role-Based Authorization**
* **Password Hashing**
* **Swagger / OpenAPI**
* **Postman**
* **RESTful API**

---

## Architecture

The project follows a layered architecture that separates responsibilities between the API, application logic, domain entities, and infrastructure.

```text
                    Library.API
                        |
                        v
                Library.Application
                        |
                        v
                   Library.Domain

                Library.Infrastructure
                        |
                        v
                    SQL Server
```

### Application Layers

#### Library.API

Responsible for exposing the HTTP API and handling API-related configuration.

Contains:

* Controllers
* Middleware
* Extensions
* API configuration
* `Program.cs`
* Application startup configuration

#### Library.Application

Contains the application/business logic.

Contains:

* DTOs
* Interfaces
* Services
* Business logic
* Application-level abstractions

#### Library.Domain

Contains the core domain models.

Contains:

* Entities
* Enums
* Domain-related definitions

#### Library.Infrastructure

Responsible for database access and external infrastructure concerns.

Contains:

* `DbContext`
* Repositories
* Unit of Work
* Entity Framework Core configurations
* Database migrations

---

# Main Features

## Authentication & Authorization

The system provides:

* User registration
* User login
* JWT token generation
* Password hashing
* Role-based authorization
* Administrator authorization
* Protected API endpoints

Registration is restricted to users with the `Administrator` role.

---

## Authors Management

The system provides full CRUD operations for authors.

Supported operations:

* Get all authors
* Get author by ID
* Add author
* Update author
* Delete author

---

## Books Management

The system provides full CRUD operations for books.

Books can be associated with:

* Authors
* Categories
* Publishers

---

## Categories Management

The system provides full CRUD operations for categories.

Categories support a **parent-child relationship**, allowing categories to be organized hierarchically.

---

## Members Management

The system provides full CRUD operations for library members.

Supported operations:

* Get all members
* Get member by ID
* Add member
* Update member
* Delete member

---

## Publishers Management

The system provides full CRUD operations for publishers.

Supported operations:

* Get all publishers
* Get publisher by ID
* Add publisher
* Update publisher
* Delete publisher

---

## Users Management

The system provides full CRUD operations for system users.

Authentication is separated into a dedicated authentication service, while user management is handled through the Users functionality.

---

## Borrowing Management

The system supports library borrowing operations, including:

* Viewing all borrowing transactions
* Viewing a borrowing transaction by ID
* Borrowing books
* Returning books

---

## Activity Logging

The system records important activities performed by system users.

Examples include:

* Login activities
* Creating entities
* Other important system actions

This provides a record of important operations performed through the API.

---

# API Endpoints

All API endpoints are available through the configured API base URL.

Example:

```text
https://localhost:<port>
```

Swagger can be used to view and test all endpoints.

---

## Activity Logs

| Method | Endpoint            | Description           |
| ------ | ------------------- | --------------------- |
| GET    | `/api/ActivityLogs` | Get all activity logs |

---

## Authentication

| Method | Endpoint             | Description                  |
| ------ | -------------------- | ---------------------------- |
| POST   | `/api/Auth/Register` | Register a new system user   |
| POST   | `/api/Auth/Login`    | Login and generate JWT token |

### Login Flow

1. Register a user if required.
2. Login using `/api/Auth/Login`.
3. Receive the JWT token.
4. Use the token to access protected endpoints.

---

## Authors

| Method | Endpoint                          | Description      |
| ------ | --------------------------------- | ---------------- |
| GET    | `/api/Authors/GetAllAuthors`      | Get all authors  |
| GET    | `/api/Authors/GetAuthorById/{id}` | Get author by ID |
| POST   | `/api/Authors/AddAuthor`          | Add a new author |
| PUT    | `/api/Authors/UpdateAuthor/{id}`  | Update an author |
| DELETE | `/api/Authors/DeleteAuthor/{id}`  | Delete an author |

---

## Books

| Method | Endpoint                      | Description    |
| ------ | ----------------------------- | -------------- |
| GET    | `/api/Books/GetAllBooks`      | Get all books  |
| GET    | `/api/Books/GetBookById/{id}` | Get book by ID |
| POST   | `/api/Books/AddBook`          | Add a new book |
| PUT    | `/api/Books/UpdateBook/{id}`  | Update a book  |
| DELETE | `/api/Books/DeleteBook/{id}`  | Delete a book  |

---

## Borrowing

| Method | Endpoint                      | Description                     |
| ------ | ----------------------------- | ------------------------------- |
| GET    | `/api/Borrowing/GetAll`       | Get all borrowing transactions  |
| GET    | `/api/Borrowing/GetById/{id}` | Get borrowing transaction by ID |
| POST   | `/api/Borrowing/borrow`       | Borrow a book                   |
| PUT    | `/api/Borrowing/return/{id}`  | Return a book                   |

---

## Categories

| Method | Endpoint                               | Description        |
| ------ | -------------------------------------- | ------------------ |
| GET    | `/api/Categories/GetAllCategories`     | Get all categories |
| GET    | `/api/Categories/GetCategoryById/{id}` | Get category by ID |
| POST   | `/api/Categories/AddCategory`          | Add a new category |
| PUT    | `/api/Categories/UpdateCategory/{id}`  | Update a category  |
| DELETE | `/api/Categories/DeleteCategory/{id}`  | Delete a category  |

---

## Members

| Method | Endpoint                          | Description      |
| ------ | --------------------------------- | ---------------- |
| GET    | `/api/Members/GetAllMembers`      | Get all members  |
| GET    | `/api/Members/GetMemberById/{id}` | Get member by ID |
| POST   | `/api/Members/Add_Member`         | Add a new member |
| PUT    | `/api/Members/UpdateMember/{id}`  | Update a member  |
| DELETE | `/api/Members/DeleteMember/{id}`  | Delete a member  |

---

## Publishers

| Method | Endpoint                                | Description         |
| ------ | --------------------------------------- | ------------------- |
| GET    | `/api/Publishers/GetAllPublishers`      | Get all publishers  |
| GET    | `/api/Publishers/GetPublisherById/{id}` | Get publisher by ID |
| POST   | `/api/Publishers/AddPublisher`          | Add a new publisher |
| PUT    | `/api/Publishers/UpdatePublisher/{id}`  | Update a publisher  |
| DELETE | `/api/Publishers/DeletePublisher/{id}`  | Delete a publisher  |

---

## Users

| Method | Endpoint                      | Description           |
| ------ | ----------------------------- | --------------------- |
| GET    | `/api/Users/GetAllUsers`      | Get all system users  |
| GET    | `/api/Users/GetUserById/{id}` | Get user by ID        |
| POST   | `/api/Users/AddUser`          | Add a new system user |
| PUT    | `/api/Users/UpdateUser/{id}`  | Update a system user  |
| DELETE | `/api/Users/DeleteUser/{id}`  | Delete a system user  |

---

# Database Relationships

The system contains several relationships between the main entities.

```text
Publisher
    |
    | 1
    |
    | *
    v
  Books
```

### Main Relationships

* One **Publisher** → Many **Books**
* Books ↔ Authors through `BookAuthors`
* Books ↔ Categories through `BookCategories`
* Categories → Categories through a parent-child relationship
* One **Book** → Many **Borrowing Transactions**
* One **Member** → Many **Borrowing Transactions**
* One **System User** → Many **User Activity Logs**

### Many-to-Many Relationships

Books and Authors have a many-to-many relationship through:

```text
BookAuthors
```

Books and Categories have a many-to-many relationship through:

```text
BookCategories
```

---

# Security

The API uses **JWT Bearer Authentication**.

Protected endpoints require a valid JWT token.

Role-based authorization is used to restrict administrative operations.

Passwords are securely hashed before being stored in the database.

### Authorization Header

For protected requests, the JWT token is sent using:

```http
Authorization: Bearer <your-jwt-token>
```

---

# Repository & Unit of Work

The project uses the **Repository Pattern** to abstract database operations.

Repositories provide a clean separation between the application logic and the database access layer.

The **Unit of Work Pattern** is used to coordinate repository operations and database transactions.

This architecture helps to:

* Separate concerns
* Improve maintainability
* Reduce direct database dependencies
* Make business logic easier to test
* Keep database operations organized

---

# DTOs

The project uses **Data Transfer Objects (DTOs)** to control the data exchanged between the API and its clients.

DTOs are used for operations such as:

* User registration
* User login
* Books
* Authors
* Categories
* Members
* Publishers
* Borrowing operations
* Other API operations

Using DTOs helps prevent unnecessary exposure of domain entities and allows the API contract to remain separate from the database models.

---

# Dependency Injection

The project uses the built-in **ASP.NET Core Dependency Injection** system.

Services, repositories, Unit of Work, and other required dependencies are registered through the application's service configuration.

This allows components to depend on abstractions instead of concrete implementations.

---

# Swagger / OpenAPI

Swagger / OpenAPI is configured for API documentation and testing.

Swagger provides an interactive interface that allows developers to:

* View all available endpoints
* View HTTP methods
* View request parameters
* Send API requests
* Test authentication-protected endpoints
* Inspect API responses

After running the project, Swagger can be accessed through the configured Swagger URL, commonly:

```text
https://localhost:<port>/swagger
```

The exact port depends on the project's launch configuration.

---

# Postman

A Postman collection is included for API testing.

The collection covers the main implemented functionality:

* Authentication
* Users
* Authors
* Books
* Categories
* Members
* Publishers
* Borrowing
* Activity Logs

Postman can be used to test:

* CRUD operations
* Authentication
* Authorization
* Borrowing books
* Returning books
* Protected endpoints
* API responses

---

# Setup & Installation

## Prerequisites

Before running the project, make sure the following are installed:

* .NET 8 SDK
* SQL Server
* Visual Studio 2022 or another compatible IDE
* Postman (optional)
* Git (optional)

---

## Clone the Repository

Clone the project using:

```bash
git clone https://github.com/your-username/LibraryManagementSystem.git
```

Then navigate to the project directory:

```bash
cd LibraryManagementSystem
```

> Replace the GitHub URL with the actual repository URL.

---

# Database Configuration

The project uses **SQL Server** with **Entity Framework Core**.

Update the connection string in:

```text
Library.API/appsettings.json
```

Example:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=YOUR_SERVER;Database=LibraryManagementSystem;Trusted_Connection=True;TrustServerCertificate=True;"
  }
}
```

Replace `YOUR_SERVER` with your SQL Server instance.

---

# Entity Framework Core Migrations

If migrations are already included in the project, the database can be created by applying the migrations.

From the appropriate project directory, run:

```bash
dotnet ef database update
```

If Entity Framework CLI is not installed:

```bash
dotnet tool install --global dotnet-ef
```

Then run:

```bash
dotnet ef database update
```

The exact migration command may depend on the configured startup and infrastructure projects.

---

# Running the Project

From the solution directory, restore the required packages:

```bash
dotnet restore
```

Build the solution:

```bash
dotnet build
```

Run the API:

```bash
dotnet run --project Library.API
```

The API will start on the URL configured in the project's launch settings.

---

# Testing

The API can be tested using:

### Swagger

Swagger provides an interactive interface for testing the API directly from the browser.

### Postman

Postman can be used for more detailed API testing and for maintaining a collection of requests.

---

## Testing Protected Endpoints

For endpoints that require authentication:

1. Login using:

```text
POST /api/Auth/Login
```

2. Copy the returned JWT token.

3. Add the token to the request Authorization header:

```http
Authorization: Bearer <your-jwt-token>
```

4. Send the request to the protected endpoint.

5. Make sure the authenticated user has the required role if the endpoint is role-restricted.

---

# Authentication Flow

The general authentication flow is:

```text
Register
   |
   v
Login
   |
   v
Receive JWT Token
   |
   v
Add Token to Authorization Header
   |
   v
Access Protected Endpoints
```

---

# Bonus Features

The project includes several additional features beyond basic CRUD operations:

* JWT Authentication
* Role-Based Authorization
* Password Hashing
* User Activity Logging
* Parent-Child Category Relationship
* Many-to-Many relationship between Books and Authors
* Many-to-Many relationship between Books and Categories
* Swagger / OpenAPI Documentation
* Postman API Testing
* Repository Pattern
* Unit of Work Pattern
* Dependency Injection
* DTO-based API communication

---

# Project Structure

```text
LibraryManagementSystem
│
├── Library.API
│   ├── Controllers
│   ├── Extensions
│   ├── Middleware
│   ├── appsettings.json
│   └── Program.cs
│
├── Library.Application
│   ├── DTOs
│   ├── Interfaces
│   └── Services
│
├── Library.Domain
│   ├── Entities
│   └── Enums
│
├── Library.Infrastructure
│   ├── Data
│   ├── Migrations
│   └── Repositories
│
└── README.md
```

---

# API Summary

| Module         | Operations                         |
| -------------- | ---------------------------------- |
| Authentication | Register, Login                    |
| Authors        | Create, Read, Update, Delete       |
| Books          | Create, Read, Update, Delete       |
| Categories     | Create, Read, Update, Delete       |
| Members        | Create, Read, Update, Delete       |
| Publishers     | Create, Read, Update, Delete       |
| Users          | Create, Read, Update, Delete       |
| Borrowing      | Get All, Get By ID, Borrow, Return |
| Activity Logs  | Get All                            |

---

# Project Goals

The main goals of this project are to provide:

* A clean and maintainable backend architecture
* RESTful API endpoints
* Secure authentication and authorization
* Efficient database access using Entity Framework Core
* Proper separation of concerns
* Reusable repository and service layers
* DTO-based API communication
* Complete library management functionality
* API documentation and testing through Swagger and Postman

---

# Conclusion

The **Library Management System** provides a complete backend solution for managing library operations through an ASP.NET Core 8 Web API.

The system combines CRUD operations for the main library entities with authentication, authorization, borrowing and returning books, activity logging, database relationships, DTOs, Repository and Unit of Work patterns, Swagger documentation, and Postman testing.

The layered architecture makes the application easier to maintain, extend, test, and integrate with future frontend applications.

---

## Repository

GitHub Repository:

**https://github.com/your-username/LibraryManagementSystem**

> Replace this placeholder with the actual GitHub repository URL before submitting the assessment.
