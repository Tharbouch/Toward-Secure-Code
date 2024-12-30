# README: IDOR Vulnerability Testing Lab

## Overview

This project demonstrates an **Insecure Direct Object Reference (IDOR)** vulnerability in a Flask-based application. IDOR is a common web security flaw that allows attackers to access or manipulate resources by modifying request parameters without proper authorization checks.

The lab features:
- A user authentication system with JWT.
- Endpoints for user registration, login, order creation, and order management.
- An intentionally vulnerable endpoint (`/api/orders/<int:order_id>`) that lacks proper authorization checks.

## Prerequisites

- Python 3.8 or higher
- Flask and required dependencies
- SQLite (pre-installed with Python)
- Basic knowledge of REST APIs and web application vulnerabilities

## Setup Instructions

### Clone the Repository

check the main README to know how to get this directory,click [here](https://github.com/Tharbouch/Toward-Secure-Code/blob/main/README.md).


### Install Dependencies

Create a virtual environment and install the required Python packages:

```bash
python3 -m venv venv
source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
pip install -r requirements.txt
```

### Configure Environment Variables

Create a .env file in the root directory with the following content:

```env
SECRET_KEY=your-secret-key
JWT_SECRET_KEY=your-jwt-secret-key
```

Replace your-secret-key and your-jwt-secret-key with your desired values.

### Initialize the Database
```bash
flask db init
flask db migrate
flask db upgrade
```

###  Run the Application

Start the Flask development server:
```bash
python app.py
```

## Disclaimer:
This lab is for educational purposes only. It is a deliberately vulnerable application designed to demonstrate common security pitfalls. Do not deploy this application in production environments.
