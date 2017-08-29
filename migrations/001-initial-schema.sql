-- Up
CREATE TABLE urls (
    `id`                INTEGER PRIMARY KEY,
    `url`               TEXT,
    `short_url`         TEXT,
    `created_at`	    INTEGER, --Дата создания
    UNIQUE (short_url) ON CONFLICT ABORT
);
-- Down 