# Broken Access Control with Weak JWT Implementations Lab

This lab is designed to help you understand how improper implementation of JSON Web Tokens (JWT) and weak access control mechanisms can lead to **role escalation** and **broken access control** vulnerabilities. The goal is to explore the risks of using weak or insecure JWT implementation and how attackers can exploit these flaws to escalate privileges or bypass access restrictions.

## Key Concepts

- **JWT Authentication**: The application uses JWT tokens for user authentication, but the implementation lacks proper token signature verification.
- **Role-Based Access Control (RBAC)**: The system implements role-based access to certain routes, but due to weak JWT validation, attackers can manipulate roles in the token to gain unauthorized access to protected resources.
- **Security Weaknesses**:
  - **Token Signature Skipping**: The application decodes the JWT token without verifying the signature, which allows attackers to tamper with the token payload (e.g., changing user roles).
  - **Role Escalation**: By manipulating the JWT payload, attackers can escalate their privileges, for example, by changing their role to `admin` and gaining access to restricted resources.

---

## Lab Features

### Public Route
Accessible without any authentication:
```bash
GET /public
```

### Login Route

Authenticate and receive a JWT (vulnerable to token manipulation):

```bash
POST /login
```

Request body:
```bash
{
  "username": "your_username",
  "password": "your_password"
}
```

### User Route

Accessible to users with the user or admin role. This route is vulnerable to bypass via JWT manipulation:

```bash
GET /user
```

Requires a valid JWT token in the Authorization header:

```bash
Authorization: Bearer <token>
```

### Admin Route

Restricted to users with the admin role, but vulnerable to role escalation by modifying the JWT token:

```bash
GET /admin
```

Requires a valid JWT token in the Authorization header:

```bash
Authorization: Bearer <token>
```

## Vulnerabilities to Explore

    JWT Signature Verification: The app decodes the token without verifying its signature using jwt.decode(). This vulnerability allows attackers to tamper with the payload and change data like user roles without invalidating the token.

    Role Escalation: By manipulating the role in the JWT payload (e.g., changing the role from user to admin), attackers can access restricted routes (such as /admin) without proper authorization.

    Insecure Role-Based Access Control: The app uses role checks but relies on client-supplied data (JWT payload) for authorization, making it susceptible to attacks.

## Installation and Setup

### Clone the repository:

check the main README to know how to get this directory,click [here](https://github.com/Tharbouch/Toward-Secure-Code/blob/main/README.md).

### Install the required dependencies:

```bash
npm install
```

Create a .env file in the project root with the following content:

```bash
SECRET_KEY=your_secret_key
```

### Start the server:

```bash
    node index.js
```

## Objectives

    Identify JWT-related security flaws: Understand how the absence of signature verification allows attackers to manipulate tokens.
    Exploit role-based access control vulnerabilities: Modify JWTs to escalate user privileges (e.g., from user to admin).
    Learn how to secure JWT implementations: Understand the importance of verifying JWTs and securely managing user roles.

## Disclaimer: 

This lab is for educational purposes only. It is a deliberately vulnerable application designed to demonstrate common security pitfalls. Do not deploy this application in production environments.
