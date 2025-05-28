# Linguini

Authors:

- Balaji Leninrajan
- Jane Zeng
- Julia Ilioukhina
- Mariya Turetska

## Running a local instance of the app

- Install mysql and mysql server if not already installed
- Run `npm install` to install the dependencies
- Copy the `.env.example` file to `.env` and fill in the values

```env
DB_HOST=localhost
DB_USER=root
DB_PORT=3306
DB_PASSWORD=password
DB_NAME=demo_db
```

- Run `npm run init:db` to create the database and tables
- Run `npm run dev` to run in dev
