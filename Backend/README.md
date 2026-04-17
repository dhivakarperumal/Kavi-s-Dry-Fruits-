# Backend Server

This is the backend server for both KaviDryFruits e-commerce platform and MediCare healthcare management system.

## Features

- **MediCare Module**: Patient management and appointment scheduling
- **KaviDryFruits Module**: Product and category management
- MySQL database integration
- RESTful API endpoints
- CORS enabled for frontend integration

## Installation

1. Navigate to the backend directory:
   ```bash
   cd Backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up MySQL database:
   - Create a database named `medicare_db`
   - Update database credentials in `.env` file if needed

4. Start the development server:
   ```bash
   npm run dev
   ```

5. For production:
   ```bash
   npm start
   ```

## API Endpoints

### MediCare Module

#### Patients
- `GET /api/medivare/patients` - Get all patients
- `GET /api/medivare/patients/:id` - Get patient by ID
- `POST /api/medivare/patients` - Create new patient
- `PUT /api/medivare/patients/:id` - Update patient
- `DELETE /api/medivare/patients/:id` - Delete patient

#### Appointments
- `GET /api/medivare/appointments` - Get all appointments
- `POST /api/medivare/appointments` - Create new appointment
- `PUT /api/medivare/appointments/:id/status` - Update appointment status

### KaviDryFruits Module

#### Products
- `GET /api/kavidryfruits/products` - Get all products

#### Categories
- `GET /api/kavidryfruits/categories` - Get all categories

## Health Check

- `GET /health` - Server health check

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=medicare_db
JWT_SECRET=your_jwt_secret_key_here
```

## Database Models

### MediCarePatient
- id (Primary Key)
- name
- email
- phone
- dateOfBirth
- medicalRecordNumber
- address
- emergencyContact
- bloodType
- allergies

### MediCareAppointment
- id (Primary Key)
- patientId (Foreign Key)
- doctorName
- appointmentDate
- appointmentTime
- reason
- status
- notes

## Technologies Used

- Node.js
- Express.js
- MySQL
- Sequelize ORM
- CORS
- dotenv