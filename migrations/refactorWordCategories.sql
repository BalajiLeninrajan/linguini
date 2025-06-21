DROP TABLE IF EXISTS word_categories;
DROP TABLE IF EXISTS words;

CREATE TABLE word_categories (
  word TEXT NOT NULL,
  category TEXT NOT NULL,
  PRIMARY KEY (word, category),
  FOREIGN KEY (category) REFERENCES categories(category)
);