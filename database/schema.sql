CREATE TABLE IF NOT EXISTS vault_config (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    username TEXT NOT NULL,
    salt BLOB NOT NULL,
    encrypted_vault_key BLOB NOT NULL,
    key_nonce BLOB NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS credentials (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    website TEXT NOT NULL,
    username TEXT NOT NULL,
    encrypted_password BLOB NOT NULL,
    nonce BLOB NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS activity_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    action TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);


CREATE INDEX IF NOT EXISTS idx_credentials_website
ON credentials(website);