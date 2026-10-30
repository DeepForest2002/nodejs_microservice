-- migrate:up

CREATE TABLE IF NOT EXISTS attachments(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID NOT NULL,
    image_url TEXT NOT NULL,
    public_id TEXT NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_attachments
BEFORE UPDATE ON attachments
FOR EACH ROW 
EXECUTE FUNCTION update_updated_at();


CREATE INDEX IF NOT EXISTS idx_attachments_task_id ON attachments(task_id);

-- migrate:down

