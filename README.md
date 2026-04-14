# NagarSetu - Smart Civic Issue Reporting Platform

NagarSetu is a full-stack platform consisting of a Citizen Portal (Client), an Admin Panel for municipal authorities, and a Node.js Backend.

## Project Structure
- `/client` - React App (Vite) for Citizens
- `/admin-panel` - React App (Vite) for Administrators
- `/server` - Node.js Express Backend with MongoDB

## Prerequisites
- Node.js installed
- MongoDB running locally on port 27017 (or update `MONGODB_URI` in `/server/.env`)

## Running the Application

### 1. Start the Backend Server
```bash
cd server
npm start
# (Runs on http://localhost:5000)
```

### 2. Start the Citizen Client
```bash
cd client
npm run dev
# (Runs on http://localhost:5173 - Check console for actual port)
```

### 3. Start the Admin Panel
```bash
cd admin-panel
npm run dev
# (Runs on http://localhost:5174 - Check console for actual port)
```

## Features
- **Citizens**: Register, Login, Report issues with categories (Road, Water, Electricity, etc.), Track issue status.
- **Admins**: Detailed table view of all complaints, dynamic filtering by status and category, update complaint status, add official remarks.

## Setup Dummy Admin Data
You need at least one Admin account to login to the admin panel.
You can create one via normal register route (`http://localhost:5000/api/auth/register`) but using an API tool (like Postman or cURL) and passing `"role": "admin"`.
Or, connect to your MongoDB database `nagarsetu` directly, go to `users` collection, and change a user's role to `"admin"`.
