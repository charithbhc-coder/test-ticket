# Support Ticket System Deployment & Run Guide

This project contains a full-stack Support Ticket System built with:
- **Backend:** NestJS, TypeORM, PostgreSQL
- **Frontend:** Angular 17, Angular Material

---

## Prerequisites

1. **Node.js**: v18 or later.
2. **PostgreSQL**: A running instance (local or hosted).

---

## 1. Running the Project Locally

### Set up the Database
1. Create a local PostgreSQL database named `ticket_system`.
2. Ensure you have the credentials (default: username `postgres`, password `postgres`). The backend will automatically create the `tickets` table on startup (via `synchronize: true`).

### Start the Backend
1. Open a terminal and run:
   ```bash
   cd backend
   npm install
   ```
2. Set up your environment variables. You can set them in your terminal before starting or place them in a `.env` file in the `backend` directory:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=postgres
   DB_NAME=ticket_system
   POWER_AUTOMATE_WEBHOOK=https://your-webhook-url-here
   ```
   **Important:** Without the `POWER_AUTOMATE_WEBHOOK` set, replies will just be saved to the database but not pushed to Teams.
3. Start the dev server:
   ```bash
   npm run start:dev
   ```
   The API will be available at `http://localhost:3000`.

### Start the Frontend
1. Open a new terminal and run:
   ```bash
   cd frontend
   npm install
   ```
2. Start the Angular application:
   ```bash
   npm start
   ```
   The dashboard will be available at `http://localhost:4200`.

---

## 2. Testing the Integration flow

1. **Simulate a Teams message ticket creation:**
   Use Postman or cURL to mimic Power Automate creating a ticket:
   ```bash
   curl -X POST http://localhost:3000/api/tickets \
     -H "Content-Type: application/json" \
     -d "{\"message\":\"Printer not working\",\"teamsUserId\":\"123456\",\"teamsUserName\":\"John\"}"
   ```
2. **Reply via Dashboard:**
   - Go to `http://localhost:4200/dashboard`.
   - You should see the incoming ticket.
   - Enter your message in the "Type reply..." input.
   - Click **Send**.
   - The backend will save the reply, update status to `RESOLVED`, and POST to the `$POWER_AUTOMATE_WEBHOOK` URL.

---

## 3. Deploying the Application

### Deploying the Backend
We recommend using **Railway**, **Render**, or **Fly.io** for seamless backend deployment.
1. Create a new Postgres database on your chosen provider.
2. Create a Web Service pointing to the `/backend` directory.
3. Set the appropriate environment config variables (`DB_HOST`, `POWER_AUTOMATE_WEBHOOK`, etc.).
4. Start the service.

### Deploying the Frontend
We recommend deploying Angular frontends on **Vercel**, **Netlify**, or **Firebase Hosting**.
1. Set the root directory to `/frontend`.
2. Override the build command to `npm run build`.
3. Set the output directory to `dist/frontend` (or `dist/frontend/browser` depending on Angular config).
4. *Important Note:* Before deploying the frontend, update the `apiUrl` in `src/app/ticket.service.ts` to point to your new live backend domain (e.g., `https://your-backend.railway.app/api/tickets`) instead of localhost.

---

## 4. Useful Guides

- **[Power Automate Setup Guide](./POWER_AUTOMATE_SETUP.md)**: Detailed steps to connect Teams with threaded replies.
- **[Final Walkthrough](./WALKTHROUGH.md)**: Overview of the architecture and final verification steps.

**You're all set! Enjoy managing your Support Tickets.**
