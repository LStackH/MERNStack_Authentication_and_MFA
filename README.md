﻿# MERNStack_Authentication_and_MFA
A secure, full-stack web application demonstrating authentication and multi-factor security mechanism.

# Features

* JWT Authentication: Stateless, secure token-based authentication for all protected API routes.
* Optional MFA (TOTP): Time-based One-Time Password support via Google Authenticator (or any TOTP-compatible app) for an additional layer of security.
* Password Hashing: Secure storage of user credentials using bcrypt.
* Protected Endpoints: All sensitive routes are guarded by middleware validating JWTs and user roles.
* Secure Coding Practices: Modular code organization, environment-based secrets management

# Getting Started
1. Clone the repository
   ```bash
   git clone https://github.com/LStackH/MERNStack_Authentication_and_MFA.git
   cd MERNStack_Authentication_and_MFA
   ```

2. Install dependencies
   ```bash
    # Backend
    cd backend && npm install
    
    # Frontend
    cd ../frontend && npm install
   ```

3. Configure environment
    * Create a .env in backend/:
    ```bash
    JWT_SECRET=your_jwt_secret_here
    MONGO_URI=mongodb://localhost:27017/cybersecurity_project   # or whatever connection string to MongoDB
    ```
4. Run the application
   ```bash
    # Backend
    cd backend && npm start
    
    # Frontend
    cd ../frontend && npm run dev
    ```

5. Register & Secure Your Account

* Register a new user and optionally enable MFA.

* Scan the QR code in your authenticator app.

* Log in with your credentials and one-time code.


# Security Focus
This project was developed with cybersecurity principles at its core:

* Least Privilege: Only authenticated users can access protected resources.

* Defense in Depth: MFA adds a second layer of validation beyond passwords.

* Secure Defaults: Strong hashing, token expiration, and environment-based secrets.

* Extensibility: Modular controllers, routes, and middleware for easy security updates.
