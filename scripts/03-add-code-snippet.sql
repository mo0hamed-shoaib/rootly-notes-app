-- Migration: add optional code snippet fields to notes
ALTER TABLE notes ADD COLUMN IF NOT EXISTS code_snippet TEXT NULL;
ALTER TABLE notes ADD COLUMN IF NOT EXISTS code_language TEXT NULL;


