# Linguini

A fun word game with friends 🧑‍🤝‍🧑.

## Authors

- Balaji Leninrajan
- Jane Zeng
- Julia Ilioukhina
- Mariya Turetska

---

## Getting Started

Linguini is a project that uses a PostgreSQL database and Next. You can run it with either a hosted or local database.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [npm](https://www.npmjs.com/)
- [Docker Compose](https://docs.docker.com/compose/) (for local DB)
- [Neon](https://neon.com/) account (for hosted DB)
- [python](https://www.python.org/) (for loading word/category data)

---

## Running with a Hosted Database

1. **Set up a PostgreSQL database** (we recommend [Neon](https://neon.com/)).
2. Run `npm install` to install dependencies.
3. Copy `.env.example` to `.env` and fill in the values:

   ```env
   DATABASE_URL="postgres://user:password@host.db.neon.tech/dbname?sslmode=require"
   USE_LOCAL=false
   JWT_SECRET="your-secret-key"
   ```

4. Use the contents of `migrations/init.sql` to create the tables (e.g. via the Neon dashboard SQL editor).
5. Run `npm run dev` to start the development server.

---

## Running with a Local Database

1. Ensure Docker Compose is installed.
2. Run `npm install` to install dependencies.
3. Copy `.env.example` to `.env` and fill in the values:

   ```env
   DATABASE_URL="postgres://postgres:postgres@db.localtest.me:5432/main"
   USE_LOCAL=true
   JWT_SECRET="your-secret-key"
   ```

4. Run `npm run init:db:local` to start the local Postgres database and create tables.
5. For subsequent runs, use `npm run db:local` to start the database without recreating tables.
6. Run `npm run dev` to start the development server.

---

## Loading Data into Words and Categories

- The dataset is from [Kaggle: Hypernyms WordNet](https://www.kaggle.com/datasets/duketemon/hypernyms-wordnet).
- To load production data, run:

  ```sh
  npm run hypernyms:load
  ```

- This script should be run once after initializing empty tables.

## Milestone 2 | Implemented Features

Here are the features implemented for Milestone 2:

- User sign up: Allows new users to register by providing required information. Passwords are securely hashed before storage. Input validation ensures data integrity, and the system checks if the user already exists in the database to prevent duplicates. The implementation is part of the [auth router](src/server/api/routers/auth.ts#L25-L88).

- User login: Authenticates users by verifying credentials against hashed passwords in the database. On successful login, a session token is generated for secure access. Input validation is performed to prevent invalid or malicious data. The implementation is part of the [auth router](src/server/api/routers/auth.ts#L99-L146).

- Group creation: Enables authenticated users to create new groups. Input is validated. The implementation is part of the [group router](./src/server/api/routers/groups.ts.ts#L93-L147).
