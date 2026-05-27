# SmartQueue Postman Workflow

Import `SmartQueue.postman_collection.json` into Postman and run the requests from top to bottom.

Before running:

1. Start MongoDB.
2. Run `npm.cmd run seed` from `backend`.
3. Run `npm.cmd run migrate` from `backend`.
4. Start the backend with `npm.cmd run dev`.

The collection uses `http://localhost:5000/api` and creates a new customer email for each run.

Important check-in rule:

- The collection books a same-day appointment so QR check-in can be tested immediately.
- If Postman reports that no same-day slots are available, run the collection earlier in the day or change the `bookingDate` collection variable to a date you want to test. Future appointments can be booked and validated, but check-in will be rejected until the scheduled date.

Workflow covered:

1. Admin login
2. Customer registration
3. Customer login
4. Consultation type lookup
5. Slot availability lookup
6. Appointment creation
7. Queue status before check-in
8. QR validation
9. QR check-in
10. Active queue lookup
11. Mark queue token serving
12. Mark queue token served
13. Appointment and dashboard verification
