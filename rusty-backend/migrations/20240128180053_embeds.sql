CREATE TABLE embeds(
    id SERIAL PRIMARY KEY,
    embed_id uuid DEFAULT gen_random_uuid() UNIQUE NOT NULL,
    project_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,

    FOREIGN KEY (project_id) REFERENCES projects(id)
);

