# Secure Note-Taking Application

A secure note-taking REST API with a functional React frontend, JWT authentication, role-based access control, MongoDB/Mongoose persistence, pagination, indexed queries, and MongoDB aggregation pipelines.

The application was built as a technical interview task with a focus on backend architecture, security, database design, and API functionality.

---

## Features

### Authentication

* User registration
* User login
* JWT-based authentication
* Short-lived access tokens
* Refresh tokens stored securely using hashed values
* HttpOnly refresh-token cookie
* Logout with refresh-token invalidation
* Password hashing using bcrypt

### User Roles

The application supports two roles:

#### User

* Create notes
* View own notes
* View a specific own note
* Update own notes
* Delete own notes

#### Admin

* All User capabilities
* Create users
* List users
* Update users
* Delete users
* View all users' notes
* Group users by interests

### Notes

* Create, read, update, and delete notes
* Users can only access their own notes
* Admins can view all notes
* Pagination for note lists
* Pagination metadata included in API responses

### Database / MongoDB

* MongoDB with Mongoose
* Explicit schema indexes
* Compound index for user note queries
* Index for admin note listing
* Index for post author lookup
* MongoDB aggregation pipelines

### Aggregation Requirements

#### Scenario 1 — Group users by interests

Users contain an `interests` array.

The application uses a single `User.aggregate()` call to group users by individual interests.

A user can appear in multiple interest groups if they have multiple interests.

Example:

```text
coding
  ├── User A
  └── User B

chess
  ├── User A
  └── User C
```

#### Scenario 2 — User posts

Posts are stored in a separate `posts` collection.

The application retrieves a user's posts using a single aggregation pipeline containing `$lookup`.

The pipeline joins:

```text
users._id
    ↓
posts.author
```

The user's password is explicitly excluded from the aggregation result.

---

## Tech Stack

### Backend

* Node.js
* Express
* TypeScript
* MongoDB
* Mongoose
* JWT
* bcrypt
* Zod
* Helmet
* CORS
* Cookie Parser

### Frontend

* React
* TypeScript
* Vite
* Axios
* React Router

---

## Architecture

The backend follows a layered architecture:

```text
Route
  ↓
Controller
  ↓
Service
  ↓
Repository
  ↓
Mongoose Model
  ↓
MongoDB
```

### Controller

Responsible for:

* HTTP request/response handling
* Extracting request data
* Calling services

### Service

Responsible for:

* Business logic
* Authentication logic
* Authorization-related business rules
* Password hashing
* Coordinating repository operations

### Repository

Responsible for:

* Database operations
* Mongoose queries
* Aggregation pipelines
* Pagination queries

### Middleware

The application uses middleware for:

* Authentication
* Role authorization
* Request validation
* CORS
* Helmet
* Cookie parsing
* Global error handling

---

## Project Structure

```text
server/
├── src/
│   ├── config/
│   ├── middlewares/
│   ├── modules/
│   │   ├── auth/
│   │   ├── note/
│   │   ├── post/
│   │   └── user/
│   ├── utils/
│   ├── app.ts
│   └── server.ts
│
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

The exact directory structure may contain additional configuration or utility files.

---

## Environment Variables

Create a `.env` file based on `.env.example`.

Example:

```env
NODE_ENV=development
PORT=5000

MONGODB_URI=mongodb://localhost:27017/secure-notes

JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret

JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=30m

FRONTEND_URL=http://localhost:5173
```

### Important

Do not commit `.env` to version control.

Use strong, randomly generated secrets for JWT keys.

---

## Installation

Clone the repository and install dependencies:

```bash
npm install
```

Create the environment file:

```bash
cp .env.example .env
```

Update `.env` with your MongoDB connection string and JWT secrets.

---

## Running the Backend

### Development

```bash
npm run dev
```

The server runs on:

```text
http://localhost:5000
```

### Production Build

```bash
npm run build
```

### Start Production Build

```bash
npm start
```

---

## API Routes

Base URL:

```text
/api
```

### Authentication

| Method | Endpoint              | Description            |
| ------ | --------------------- | ---------------------- |
| POST   | `/auth/register`      | Register a user        |
| POST   | `/auth/login`         | Login                  |
| POST   | `/auth/logout`        | Logout                 |
| POST   | `/auth/refresh-token` | Get a new access token |

### Notes

Authentication required.

| Method | Endpoint     | Description              |
| ------ | ------------ | ------------------------ |
| POST   | `/notes`     | Create a note            |
| GET    | `/notes`     | Get current user's notes |
| GET    | `/notes/:id` | Get a specific note      |
| PATCH  | `/notes/:id` | Update a note            |
| DELETE | `/notes/:id` | Delete a note            |

Example pagination:

```text
GET /api/notes?page=1&limit=10
```

### User Posts

Public endpoint used for the `$lookup` aggregation requirement.

| Method | Endpoint           | Description                 |
| ------ | ------------------ | --------------------------- |
| GET    | `/users/:id/posts` | Get a user with their posts |

### Admin

Admin authentication required.

| Method | Endpoint                         | Description              |
| ------ | -------------------------------- | ------------------------ |
| GET    | `/admin/users`                   | List users               |
| POST   | `/admin/users`                   | Create user              |
| PATCH  | `/admin/users/:id`               | Update user              |
| DELETE | `/admin/users/:id`               | Delete user              |
| GET    | `/admin/users/interests/grouped` | Group users by interests |
| GET    | `/admin/notes`                   | List all notes           |

Admin note pagination:

```text
GET /api/admin/notes?page=1&limit=10
```

---

## Authorization

The API enforces ownership at the database query level.

For example, retrieving a note uses both the note ID and authenticated user's ID:

```text
{ _id: noteId, owner: userId }
```

This prevents a regular user from accessing another user's note even if they know the note ID.

The same ownership rule is applied to:

* Read
* Update
* Delete

Admin-only endpoints are protected by role-based authorization middleware.

---

## Pagination

All list operations support pagination.

Example:

```text
?page=1&limit=10
```

The API returns pagination metadata:

```json
{
  "page": 1,
  "limit": 10,
  "total": 25,
  "totalPages": 3
}
```

The `limit` value is restricted to a maximum of 100.

---

## Database Indexing

Indexes were added only where they support actual application queries.

### Users

```text
_id_
email_1 (unique)
createdAt_-1
```

### Notes

```text
_id_
owner_1_createdAt_-1
createdAt_-1
```

The compound note index supports:

```text
find({ owner })
.sort({ createdAt: -1 })
```

The `createdAt` index supports the admin all-notes listing:

```text
find()
.sort({ createdAt: -1 })
```

### Posts

```text
_id_
author_1
```

The `author` index supports the `$lookup` from users to posts.

### Refresh Tokens

```text
_id_
tokenHash_1 (unique)
user_1
expiresAt_1 (TTL)
```

The TTL index allows expired refresh-token records to be automatically removed by MongoDB.

---

## Query Verification

Important list queries were verified using MongoDB `explain("executionStats")`.

User notes:

```javascript
db.notes
  .find({ owner: ObjectId("USER_ID") })
  .sort({ createdAt: -1 })
  .explain("executionStats")
```

The query uses:

```text
owner_1_createdAt_-1
```

Admin note listing:

```javascript
db.notes
  .find()
  .sort({ createdAt: -1 })
  .explain("executionStats")
```

The query uses:

```text
createdAt_-1
```

The verified queries use `IXSCAN` rather than `COLLSCAN`.

---

## Security

The application includes:

* bcrypt password hashing
* JWT authentication
* Separate access and refresh JWT secrets
* Short-lived access tokens
* HttpOnly refresh-token cookies
* Refresh-token hashing before database storage
* Refresh-token invalidation on logout
* Helmet security headers
* Restricted CORS origin
* Role-based authorization
* Ownership checks for notes
* Zod request validation
* MongoDB ObjectId validation
* Centralized error handling
* Password exclusion from aggregation responses

Sensitive environment variables are not committed to the repository.

---

## Error Handling

The API uses centralized error handling.

Common responses include:

```text
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
409 Conflict
500 Internal Server Error
```

Validation errors are handled through Zod.

Invalid MongoDB ObjectIds are handled as `400 Bad Request` rather than resulting in an internal server error.

Unexpected errors are logged server-side while a generic message is returned to the client.

---

## Frontend

The frontend provides a functional interface for:

* Login
* Registration
* User notes CRUD
* Note pagination
* Admin user management
* Admin note listing
* User grouping by interests

The frontend focuses on functionality and API integration rather than visual design, as required by the task.

---

## Development Notes

The application was developed incrementally with API and database behavior tested during implementation, including:

* Authentication flows
* Access-token refresh
* Logout
* Role authorization
* Note ownership
* Admin operations
* Pagination
* Input validation
* Invalid resource IDs
* MongoDB aggregation pipelines
* Database indexes
* Query execution plans

---

## License

This project was created as a technical interview assignment.
