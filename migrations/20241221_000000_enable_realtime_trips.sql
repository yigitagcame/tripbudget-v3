-- Enable realtime on trips table
ALTER PUBLICATION supabase_realtime ADD TABLE trips;

-- Add a comment to document the realtime functionality
COMMENT ON TABLE trips IS 'Realtime enabled - changes will be broadcast to subscribed clients'; 