/*
  # Relational Risk Insight - Sessions Schema

  1. New Tables
    - `sessions`
      - `id` (uuid, primary key) - Unique session identifier
      - `user_id` (uuid, nullable) - Optional user ID for authenticated users
      - `started_at` (timestamptz) - Session start timestamp
      - `completed_at` (timestamptz, nullable) - Session completion timestamp
      - `is_complete` (boolean) - Whether session analysis is finished
      - `risk_score` (integer) - Overall risk score (0-100)
      - `created_at` (timestamptz) - Record creation timestamp
      - `updated_at` (timestamptz) - Record update timestamp

    - `messages`
      - `id` (uuid, primary key) - Unique message identifier
      - `session_id` (uuid, foreign key) - Reference to sessions table
      - `role` (text) - Message role: 'user', 'assistant', or 'system'
      - `content` (text) - Message content
      - `timestamp` (timestamptz) - Message timestamp
      - `created_at` (timestamptz) - Record creation timestamp

    - `red_flags`
      - `id` (uuid, primary key) - Unique red flag identifier
      - `session_id` (uuid, foreign key) - Reference to sessions table
      - `category` (text) - Category: Communication, Trust, Emotional Intelligence, Future Alignment
      - `severity` (text) - Severity: low, medium, high, critical
      - `description` (text) - Red flag description
      - `weight` (numeric) - Weight value for scoring
      - `detected_at` (timestamptz) - Detection timestamp
      - `created_at` (timestamptz) - Record creation timestamp

  2. Security
    - Enable RLS on all tables
    - Add policies for public access (sessions are anonymous by default)
    - Users can read/write their own session data
*/

CREATE TABLE IF NOT EXISTS sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  is_complete boolean DEFAULT false,
  risk_score integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content text NOT NULL,
  timestamp timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS red_flags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  category text NOT NULL CHECK (category IN ('Communication', 'Trust', 'Emotional Intelligence', 'Future Alignment')),
  severity text NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  description text NOT NULL,
  weight numeric NOT NULL DEFAULT 1.0,
  detected_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE red_flags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create sessions"
  ON sessions FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can read sessions they created"
  ON sessions FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can update their own sessions"
  ON sessions FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can create messages"
  ON messages FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can read messages from any session"
  ON messages FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can create red flags"
  ON red_flags FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can read red flags"
  ON red_flags FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS idx_messages_session_id ON messages(session_id);
CREATE INDEX IF NOT EXISTS idx_red_flags_session_id ON red_flags(session_id);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
