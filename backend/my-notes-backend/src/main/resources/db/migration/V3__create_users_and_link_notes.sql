-- Create users table and add FK on notes.user_id
CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL
);

ALTER TABLE IF EXISTS notes ADD COLUMN IF NOT EXISTS user_id BIGINT;
ALTER TABLE notes ADD CONSTRAINT fk_notes_users FOREIGN KEY (user_id) REFERENCES users(id);
