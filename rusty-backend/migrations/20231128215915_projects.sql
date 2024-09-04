CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    project_id uuid DEFAULT gen_random_uuid() UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    project_art jsonb NOT NULL,
    project_artifacts jsonb NOT NULL,
    server_sequence int DEFAULT 1 NOT NULL
);

