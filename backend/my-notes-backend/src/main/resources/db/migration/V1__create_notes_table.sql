-- Flyway baseline migration: create notes table
CREATE TABLE IF NOT EXISTS note (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) NULL,
  content TEXT NULL
);
