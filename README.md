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

## On loading data into the words and categories:

The original dataset is taken from a Kaggle dataset of hypernyms, based on WordNet. [Link](https://www.kaggle.com/datasets/duketemon/hypernyms-wordnet)

To load in the production data, navigate to `load-hypernyms-data`. It contains a file `load.py`. Run `python3 load.py` from that directory, which is the script to load in the production data.

In production this script is ran only once right after the empty tables are created in initialization.
