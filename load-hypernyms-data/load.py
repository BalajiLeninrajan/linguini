"""
A python script to load in the hypernyms
"""

import os
import pandas
from psycopg2 import pool
from dotenv import load_dotenv

load_dotenv()

# load in the data
df = pandas.read_csv("data/hypernyms.csv")

# We only use the nouns
nouns_df = df[df["part_of_speech"] == "noun"][["lemma", "hypernyms"]]

# some cleaning and remnaming just to make things easier
nouns_df = nouns_df.dropna()
nouns_df = nouns_df.rename(columns={"lemma": "word", "hypernyms": "categories"})

# assert no duplicates
assert len(nouns_df) == len(nouns_df['word'].unique())
print("No duplicate words")


CONNECTION_STRING = os.getenv('DATABASE_URL')

# Create a connection pool
connection_pool = pool.SimpleConnectionPool(
    1,  # Minimum number of connections in the pool
    10,  # Maximum number of connections in the pool
    CONNECTION_STRING
)

if connection_pool:
    print("Connection pool created successfully")


# Get a connection from the pool
conn = connection_pool.getconn()

# Create a cursor object
cursor = conn.cursor()
print(conn.get_dsn_parameters())

# load in the data
try:
    for idx, row in nouns_df.iterrows():
        print(idx, row)
        word = row["word"]
        groups = row["categories"].split("|")
        categories = set()
        for group in groups:
            values = group.split(";")
            for value in values:
                categories.add(value)

        for category in categories:
            INSERT_INTO_CATEGORIES = """
                INSERT INTO categories VALUES(%s)
                ON CONFLICT (category) DO NOTHING
            """
            INSERT_INTO_WORD_CATEGORIES = "INSERT INTO word_categories VALUES (%s,%s)"
            cursor.execute(INSERT_INTO_CATEGORIES, (category,)) 
            data = (word, category)
            cursor.execute(INSERT_INTO_WORD_CATEGORIES, data)
    conn.commit()
    print("Successfully loaded words data into database")
except Exception as e:
    conn.rollback()
    print(f"Error: ({e})")

cursor.close()
connection_pool.putconn(conn)

connection_pool.closeall()
