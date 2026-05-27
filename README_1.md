# SmartQueue

AI-driven appointment and queue management system for clinics and small service businesses.

## Technology

- Frontend: Next.js, React, TypeScript, Tailwind CSS
- Backend: Node.js, Express, TypeScript, Mongoose
- Database: MongoDB
- Authentication: JWT and bcrypt
- QR: `qrcode` generation and `html5-qrcode` scanning
- Email: SendGrid, optional in local development

## Local URLs

| Service | URL |
| --- | --- |
| Frontend | `http://localhost:3000` |
| Backend API | `http://localhost:5000` |
| API health | `http://localhost:5000/api/health` |
| MongoDB | `mongodb://localhost:27017/SmartQueue` |

## Setup

Backend:

```powershell
cd backend
npm.cmd install
npm.cmd run seed
npm.cmd run migrate
npm.cmd run dev
```

Seed creates or updates:

| Account | Email | Password |
| --- | --- | --- |
| Admin | `admin@smartqueue.local` | `admin123` |
| Demo customer | `customer@smartqueue.local` | `customer123` |

It also creates the four default consultation types: General, Emergency, Specialist, and Follow-up Consultation.

Frontend:

```powershell
cd frontend
npm.cmd install
npm.cmd run dev
```

Environment files:

```env
# backend/.env
PORT=5000
MONGO_URI=mongodb://localhost:27017/SmartQueue
JWT_SECRET=change-this-before-deployment
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:3000
ADMIN_EMAIL=admin@smartqueue.local
ADMIN_PASSWORD=admin123
SENDGRID_API_KEY=
SENDGRID_FROM_EMAIL=
```

```env
# frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Workflow

Customer:

1. Register with full name, email, phone number, and password.
2. Log in to receive a JWT.
3. Choose a consultation type and available slot.
4. Book an appointment and receive an appointment ID, daily token, and QR code.
5. View the booking and QR code in the dashboard.
6. Check in using the QR code; only then does the token enter the live waiting queue.

Admin:

1. Log in through `/admin/login` using credentials configured in `backend/.env`.
2. View dashboard totals, current token, next token, waiting customers, and completed consultations.
3. Filter appointments by consultation type, status, date, or search term.
4. Scan customer QR codes at check-in.
5. Move waiting customers to serving and served states.
6. Manage consultation types in the services screen.

## Data Model

| Collection | Purpose |
| --- | --- |
| `users` | Customer and admin accounts with hashed passwords and roles |
| `services` | Consultation types, duration, active/inactive status |
| `appointments` | Bookings, readable appointment code, slot, QR, lifecycle status |
| `queues` | Daily token and live queue state |
| `checkinlogs` | QR/manual check-in audit history |
| `notifications` | Confirmation and queue alert delivery records |

Internal `Service` records represent consultation types in the user interface.

Appointment lifecycle:

```txt
booked -> checked-in -> in-service -> completed
   \-> cancelled
```

Queue lifecycle:

```txt
booked -> waiting -> serving -> served
   \-> cancelled
```

An appointment receives its token at booking, but enters the active queue only after check-in.

## API Structure

All responses use:

```json
{
  "success": true,
  "message": "Readable result message",
  "data": {}
}
```

Customer API:

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/api/customer/auth/register` | Register customer |
| `POST` | `/api/customer/auth/login` | Login and receive JWT |
| `POST` | `/api/customer/auth/logout` | Logout acknowledgement |
| `GET` | `/api/customer/services` | List consultation types |
| `GET` | `/api/customer/appointments/availability` | List available slots |
| `POST` | `/api/customer/appointments` | Book appointment |
| `GET` | `/api/customer/appointments` | View own bookings |
| `PATCH` | `/api/customer/appointments/:id` | Reschedule a booked appointment |
| `PATCH` | `/api/customer/appointments/:id/cancel` | Cancel a booking |
| `GET` | `/api/customer/queue` | View own token states |
| `GET` | `/api/customer/queue/status/:appointmentId` | View a token state |
| `POST` | `/api/customer/qr/check-in` | Check in from QR |

Admin API:

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/api/admin/auth/login` | Admin login |
| `POST` | `/api/admin/auth/logout` | Logout acknowledgement |
| `GET` | `/api/admin/dashboard` | Summary and live tokens |
| `GET` | `/api/admin/appointments` | Filterable bookings |
| `PATCH` | `/api/admin/appointments/:id/status` | Update consultation status |
| `PATCH` | `/api/admin/appointments/:id/cancel` | Cancel appointment |
| `GET` | `/api/admin/queue` | Active checked-in queue |
| `PATCH` | `/api/admin/queue/:id` | Advance queue state |
| `POST` | `/api/admin/qr/check-in` | Staff QR check-in |
| `GET` | `/api/admin/check-in-logs` | Check-in audit log |
| `GET` | `/api/admin/analytics` | Operational analytics |
| `GET/POST/PATCH/DELETE` | `/api/admin/services` | Consultation type management |

## Structure

```txt
backend/src/
  config/        environment and MongoDB connection
  controllers/   HTTP request/response handling
  middleware/    auth, roles, validation, errors, rate limiting
  models/        Mongoose schemas
  routes/        separate customer/admin API surfaces
  services/      queue and QR business logic
  scripts/       seed and migration commands
  utils/         tokens, QR generation, API response helpers

frontend/
  app/           Next.js pages and role dashboards
  app/components reusable shells, toast, confirmation, QR scanner
  lib/           typed API/session integration
```

## Verification

```powershell
cd backend
npm.cmd run typecheck

cd ../frontend
npm.cmd run build
```

End-to-end API smoke test:

1. Start MongoDB locally.
2. Run `npm.cmd run seed` and `npm.cmd run migrate` in `backend`.
3. Start the backend with `npm.cmd run dev`; it must listen on `http://localhost:5000`.
4. Start the frontend with `npm.cmd run dev`; it must listen on `http://localhost:3000`.
5. Open `http://localhost:5000/api/health` and confirm a successful response.
6. Import [SmartQueue.postman_collection.json](backend/postman/SmartQueue.postman_collection.json) into Postman.
7. Run the collection from top to bottom.

Postman books a same-day appointment because QR check-in is intentionally allowed only on the scheduled appointment date. If all same-day slots have already passed, run the flow through the frontend for a future booking and perform check-in on that date, or temporarily test earlier in the business day.

Recommended UI demo path:

1. Register or log in as a customer at `http://localhost:3000/login`.
2. Book a consultation from `/book-appointment`.
3. Confirm the appointment appears with QR details in `/dashboard`.
4. Log in as admin at `http://localhost:3000/admin/login`.
5. Use `/admin/check-in` to scan or paste the QR payload.
6. Move the token through waiting, serving, and served from `/admin/queue`.

## Production Notes

- Set strong `JWT_SECRET` and admin credentials through environment variables.
- Configure SendGrid to send email confirmations; local operation safely leaves notifications pending when email is disabled.
- Restrict CORS through `CLIENT_URL`; local defaults are fixed to frontend port `3000`.
- Rate limiting protects authentication routes.
- MongoDB indexes prevent active double-booking and duplicate daily tokens.
- Run `npm.cmd run migrate` after schema/workflow changes before deployment.
