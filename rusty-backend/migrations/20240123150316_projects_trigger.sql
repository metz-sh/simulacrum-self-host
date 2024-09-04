
CREATE OR REPLACE FUNCTION update_sequence_function()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if the project_artifacts column has been changed
    IF OLD.project_artifacts IS DISTINCT FROM NEW.project_artifacts THEN
        NEW.server_sequence := NEW.server_sequence + 1;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_sequence_trigger
BEFORE UPDATE ON PROJECTS
FOR EACH ROW
EXECUTE FUNCTION update_sequence_function();
