-- Rename singular `note` table to `notes` to match API naming
ALTER TABLE IF EXISTS note RENAME TO notes;
