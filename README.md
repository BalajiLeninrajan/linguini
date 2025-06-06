# Linguini

Authors:

- Balaji Leninrajan
- Jane Zeng
- Julia Ilioukhina
- Mariya Turetska

## Running a local instance of the app

- Spin up a PostgreSQL database, we recommend using [Neon](https://neon.com/)
- Run `npm install` to install the dependencies
- Copy the `.env.example` file to `.env` and fill in the values

```env
DATABASE_URL="postgres://user:password@host.db.neon.tech/dbname?sslmode=require"
```

- TODO: CREATE NEW INIT SCRIPT
- Run `npm run dev` to run in dev
