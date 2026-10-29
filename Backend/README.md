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
   - Create a database named `kavisdryfruits_db`
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

Create a `Backend/.env` file with the following variables. Use unique, strong secrets and do not commit this file:

```
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=kavisdryfruits_db
JWT_SECRET=generate_a_long_random_secret
GOOGLE_CLIENT_ID=your_google_oauth_client_id
CLIENT_URL=http://localhost:5173
INITIAL_ADMIN_EMAIL=admin@example.com
INITIAL_ADMIN_PASSWORD=use_a_unique_password_with_at_least_12_characters
```

Set `GOOGLE_CLIENT_ID` in the backend process environment to the same OAuth Web client ID configured as `VITE_GOOGLE_CLIENT_ID` in the frontend build environment. The local `Backend/.env` should use `GOOGLE_CLIENT_ID`; configure it in the production hosting control panel as well, then restart/redeploy the backend. The backend verifies Google ID tokens against that exact audience before creating or logging in an account.

In Google Cloud Console, open that OAuth Web client and add every frontend origin under **Authorized JavaScript origins** (for example, `http://localhost:5173`, `http://127.0.0.1:5173` if used, and `https://kavisdryfruits.com`). Origins must match the browser address exactly, including scheme and port. A Google error saying `Missing required parameter: client_id` means the browser received an older/different frontend build without a client ID; an origin-not-allowed error must be fixed in the OAuth client's origin list and cannot be fixed in application code. A 503 from the production `/api/auth/google-login` endpoint means the deployed API service or proxy is unavailable; deploy the current backend and check the hosting service's logs and health before retrying.

Admin web-push notifications require VAPID credentials on the backend. Generate a key pair from the `Backend` directory with `npx web-push generate-vapid-keys`, then set these variables in the production backend environment:

```
VAPID_PUBLIC_KEY=generated_public_key
VAPID_PRIVATE_KEY=generated_private_key
VAPID_SUBJECT=mailto:admin@kavisdryfruits.com
```

Keep the private key only in the backend environment; do not commit it or put it in the frontend. Use one stable key pair and do not regenerate it during routine deployments, because existing browser push subscriptions are tied to the public key. Restart the backend after setting the variables. If they are absent, `GET /api/push/public-key` intentionally returns `503 Web Push is not configured`; this disables server push notifications, while in-app notifications continue to work.

During local Vite development on `localhost` or `127.0.0.1`, the frontend uses `http://localhost:5000/api` and `http://localhost:5000` for the API and socket by default, regardless of the production `VITE_API_URL` and `VITE_SOCKET_URL` values. Start the local backend and ensure its MySQL connection is available. Production builds continue using `VITE_API_URL` and `VITE_SOCKET_URL`.

The backend does not create an administrator with a default password. To bootstrap an administrator on a new database, set `INITIAL_ADMIN_EMAIL` and `INITIAL_ADMIN_PASSWORD` before starting the API. If the legacy `admin@gmail.com` account still uses the known `admin@123` password, startup disables it unless a replacement `INITIAL_ADMIN_PASSWORD` (at least 12 characters) is configured. Existing plaintext password values are cleared during database initialization; only password hashes are retained.

### Instagram homepage feed

To show the latest Instagram posts and Reels on the homepage, configure the Instagram Graph API credentials in the backend environment (never in the frontend):

```
INSTAGRAM_USER_ID=your_instagram_professional_account_id
INSTAGRAM_ACCESS_TOKEN=your_meta_user_access_token
META_GRAPH_API_VERSION=v26.0
```

The Instagram account must be a Business or Creator account connected to a Facebook Page. The Meta app needs the `instagram_basic` and `pages_show_list` permissions. The feed is cached by the backend for five minutes, so newly published posts appear on the homepage after the cache refreshes. The homepage displays the first 25 posts and Reels, with a button to load older media. Meta credentials must be added to the backend deployment environment before media can be loaded; they must never be placed in frontend variables or committed to source control.

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