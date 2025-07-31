# Database Setup Guide

## Overview
This application has been restructured to use a Railway PostgreSQL database with the provided DDL schema.

## Database Schema
The application uses the following key tables:
- `users` - User accounts
- `job_info` - Employee information linked to users
- `agents` - Agent-specific data
- `internal` - Internal user data
- `clients` - Client user data
- `personal_info` - User personal information
- `tickets` - Support tickets
- `members` - Company/member organizations
- `departments` - Department information

## Authentication Flow
1. User enters Employee ID on login page
2. System looks up `job_info` table by `employee_id`
3. Determines user type (agent/internal) from `agent_user_id` or `internal_user_id`
4. Fetches user data from `users` table
5. Retrieves personal information from `personal_info` table
6. Returns user data for session management

## Environment Setup

### 1. Create `.env.local` file
```bash
# Database Configuration
DATABASE_URL=postgresql://username:password@host:port/database

# Example for Railway:
DATABASE_URL=postgresql://postgres:password@containers-us-west-1.railway.app:5432/railway
```

### 2. Install Dependencies
```bash
npm install pg @types/pg
```

### 3. Database Migration
Run the provided DDL script in your Railway PostgreSQL database to create all tables and relationships.

## Key Features

### Authentication
- Employee ID-based login
- User type detection (Agent/Internal/Client)
- Session management with localStorage

### Ticket Management
- Create tickets with categories matching the schema
- Status tracking (For Approval, On Hold, In Progress, Approved, Completed)
- User-specific ticket views

### Database Service
The `DatabaseService` class provides:
- `authenticateByEmployeeId()` - Authenticate users
- `createTicket()` - Create new tickets
- `getUserTickets()` - Get user's tickets
- `getAllTickets()` - Get all tickets (for agents)
- `updateTicketStatus()` - Update ticket status

## API Endpoints

### Authentication
- `POST /api/auth/login` - Authenticate user by Employee ID

### Tickets
- `GET /api/tickets` - Get all tickets
- `POST /api/tickets` - Create new ticket

## Testing
To test the system:
1. Add test data to the database tables
2. Use a valid Employee ID from the `job_info` table
3. Create tickets through the form interface

## Security Notes
- Employee IDs are validated against the database
- User sessions are managed client-side
- Database connections use SSL in production
- Prepared statements prevent SQL injection 