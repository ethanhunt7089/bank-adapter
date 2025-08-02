-- Bank Adapter Database Schema

-- Client Credentials
CREATE TABLE clients (
  id SERIAL PRIMARY KEY,
  client_id VARCHAR(255) UNIQUE NOT NULL,
  client_secret VARCHAR(255) NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tokens พร้อม Domain Info (Admin กำหนด)
CREATE TABLE tokens (
  id SERIAL PRIMARY KEY,
  client_id VARCHAR(255) NOT NULL,
  token_hash VARCHAR(255) UNIQUE NOT NULL,
  target_domain VARCHAR(255) NOT NULL, -- Admin กำหนด
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (client_id) REFERENCES clients(client_id)
);

-- API Logs
CREATE TABLE api_logs (
  id SERIAL PRIMARY KEY,
  client_id VARCHAR(255) NOT NULL,
  target_domain VARCHAR(255) NOT NULL,
  endpoint VARCHAR(255) NOT NULL,
  method VARCHAR(10) NOT NULL,
  request_data JSONB,
  response_data JSONB,
  status_code INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Insert default admin client
INSERT INTO clients (client_id, client_secret, description) 
VALUES ('admin', 'admin-secret-123', 'Admin Client for Bank Adapter'); 