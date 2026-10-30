-- migrate:up

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- apply this trigger function on every table

CREATE TRIGGER users_updated_at
BEFORE UPDATE ON users 
FOR EACH ROW 
EXECUTE FUNCTION update_updated_at();


CREATE TRIGGER tasks_updated_at
BEFORE UPDATE ON tasks
FOR EACH ROW 
EXECUTE FUNCTION update_updated_at();


-- migrate:down

