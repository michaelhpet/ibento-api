# ibento-api('eventful'): Event Management System

## Overview

ibento-api is the REST API server for ibento, a comprehensive event management system that enables event creators to organize events and manage attendees. It offers features like QR code generation for event verification, social media shareability, notifications, and detailed analytics. This project is built using NestJS, Drizzle, and Resend, with a focus on scalability, performance, and best practices.

## Table of Contents

- [Features](#features)
- [Dependencies](#dependencies)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Testing](#testing)
- [Best Practices](#best-practices)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [License](#license)

## Features

1. **Authentication and Authorization**

   - Secure authentication for event creators and attendees.
   - Authorization controls to ensure users only have access to their relevant data.

2. **QR Code Generation**

   - Automatic QR code generation for a registered guest.
   - QR codes can also be verified by event creator.

3. **Shareability**

   - Public events can be easily shared with a URL.

4. **Notifications**

   - Flexible notification system allowing both creators and attendees to set reminders for upcoming events.

5. **Analytics**
   - Detailed analytics dashboard for creators, providing insights into attendee numbers, ticket sales, and QR code scans.

## Dependencies

- **NestJS**: A progressive Node.js framework for building efficient, reliable, and scalable server-side applications.
- **Drizzle ORM**: A lightweight ORM for TypeScript and JavaScript.
- **Resend**: A service for managing email notifications.
- **Redis**: Used for caching to reduce database load.
- **JWT**: For handling authentication tokens.

## Installation

### Prerequisites

Ensure you have the following installed:

- Node.js (v20 or higher)
- Redis (for caching)

### Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/michaelhpet/ibento-api.git
   cd ibento
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up the environment variables:
   Create a .env file in the root directory and add the necessary environment variables.
   > Note: You may copy the content of `.env.example` to `.env` and update the values accordingly.

## Configuration

- **Database**: Configure your database connection in the `.env` file.
- **JWT**: Configure JWT secret and expiration in the `.env` file.
- **Redis**: Ensure Redis is running and configured properly for caching.

## Running the Application

### Development

To start the application in development mode:

```bash
npm run start:dev
```

### Production

To build and start the application in production mode:

```bash
npm run build
npm run start:prod
```

## Testing

### Unit Tests

Run unit tests with the following command:

```bash
npm run test
```

### Integration Tests

Run integration tests with the following command:

```bash
npm run test:e2e
```

## Best Practices

- Caching: Utilizes Redis to minimize database queries and improve performance.
- Rate Limiting: Implemented rate limiting to prevent abuse of the API.
- Error Handling: Comprehensive error handling to provide meaningful error messages.
- Security: Follows best practices for security, including data validation, sanitization, and the use of JWT for secure authentication.
- Testing: Both unit and integration tests

## Project Structure

The project follows a modular structure with each feature encapsulated in its own module. This makes the application scalable and easy to maintain.

```ruby
test/
├── app.e2e-spec.ts # Integration tests
src/
├── drizzle/ # Database models and config
├── auth/ # Authentication and authorization logic
├── user/ # User management
├── email/ # Email notification service
├── event/ # Event creation, management, and QR code generation
├── analytic/ # Event analytics
├── utils/ # Utilities (constants, functions, etc.)
├── main.ts # Application entry point
└── app.module.ts # Main application module
```

## API Documentation

API documentation is provided using Swagger. Once the application is running, you can access the API docs at http://localhost:8080/api/v1/docs.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.
