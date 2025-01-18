-- Administrator Table
CREATE TABLE administrator (
  id INT NOT NULL, 
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  admin_password VARCHAR(255) NOT NULL,
  PRIMARY KEY (id)
);

-- Movie Table
CREATE TABLE movies (
  id SERIAL PRIMARY KEY,
  title VARCHAR(100) NOT NULL, 
  synopsis TEXT NOT NULL,
  rating VARCHAR(10) NOT NULL, 
  image_url VARCHAR(300),
  available BOOLEAN NOT NULL,
  genre VARCHAR(40) NOT NULL,
  administrator_id INT NOT NULL,
  FOREIGN KEY (administrator_id) REFERENCES administrator(id)
);

-- Users Table
CREATE TABLE users (
  id INT NOT NULL, 
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  phone VARCHAR(15), 
  available BOOLEAN NOT NULL,
  user_password VARCHAR(255) NOT NULL,
  PRIMARY KEY (id) 
);

-- Movie Function Table (Changed from UUID to INT)
CREATE TABLE movie_function (
  id SERIAL PRIMARY KEY,        -- Changed to use a normal INT id
  movie_id INT NOT NULL,
  date_function DATE NOT NULL,
  time_function TIME NOT NULL,
  room_number INT NOT NULL,
  available_seats TEXT[] NOT NULL, -- Almacena un array de asientos, e.g., {A1, A2, B1, B2}
  FOREIGN KEY (movie_id) REFERENCES movies(id)
);

-- Invoice Table (UUID remains for invoice id)
CREATE TABLE invoice (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- Using UUID here
  total DECIMAL(10, 2) NOT NULL, 
  date DATE NOT NULL,            
  ticket_count INT NOT NULL      
);

-- Ticket Table 
CREATE TABLE ticket (
  id SERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL,        
  function_id INT NOT NULL,       -- Changed from UUID to INT
  price DECIMAL(10, 2) NOT NULL, 
  seat VARCHAR(5) NOT NULL,       
  invoice_id UUID,               -- This remains a UUID to match invoice table
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (function_id) REFERENCES movie_function(id),  -- Changed to reference INT id
  FOREIGN KEY (invoice_id) REFERENCES invoice(id) 
);

-- ---------------------------------------------------------------------
-- Function to update available seats
CREATE OR REPLACE FUNCTION update_available_seats()
RETURNS TRIGGER AS $$ 
BEGIN 
  -- Remove the purchased seat from the array of available seats 
  UPDATE movie_function 
  SET available_seats = array_remove(available_seats, NEW.seat) 
  WHERE id = NEW.function_id; -- Changed to match INT function_id

  RETURN NEW; 
END; 
$$ LANGUAGE plpgsql;

-- Trigger to call the function after a new ticket is inserted
CREATE TRIGGER update_available_seats_trigger
AFTER INSERT ON ticket
FOR EACH ROW
EXECUTE FUNCTION update_available_seats();

----------------------------------
-- Sample Insert into Administrator
INSERT INTO administrator (id, first_name, last_name, email, admin_password) 
VALUES
(123456789,'Valery','Molina','valery@gmail.com','$2b$10$FVJ1TIMOwD/mWcoUwA8PqOb5.A8tHXPD4xQYxLsAVjg58vRtXTYcq');
