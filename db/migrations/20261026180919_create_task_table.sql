-- migrate:up
CREATE TYPE task_status AS ENUM ('pending', 'in_progress', 'resolved', 'closed');

CREATE TABLE IF NOT EXISTS tasks(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    status task_status NOT NULL DEFAULT 'pending',
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS task_index_id ON tasks(id);
CREATE INDEX IF NOT EXISTS task_owner_id ON tasks(user_id);

-- migrate:down

