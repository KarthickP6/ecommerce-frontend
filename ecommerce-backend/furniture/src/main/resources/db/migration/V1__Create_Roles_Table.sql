CREATE TABLE IF NOT EXISTS roles (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO roles (name, description) VALUES ('USER', 'Regular user') ON CONFLICT (name) DO NOTHING;
INSERT INTO roles (name, description) VALUES ('ADMIN', 'Administrator') ON CONFLICT (name) DO NOTHING;

