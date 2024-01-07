CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) UNIQUE,
  custName VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL
);

-- Insert sample data into the users table
INSERT INTO users (username, custName, password) VALUES
('user1@gmail.com','user1', 'user123');

CREATE TABLE bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT,
  customerName VARCHAR(255) NOT NULL,
  testName VARCHAR(255) NOT NULL,
  prescription TEXT,
  date DATE NOT NULL,
  time TIME NOT NULL,
  address VARCHAR(255) NOT NULL,
  isDone BOOLEAN DEFAULT 0,
  phoneNum BIGINT(10) UNSIGNED,
  FOREIGN KEY (userId) REFERENCES users(id)
);

-- Insert sample data into the bookings table
INSERT INTO bookings (userId, customerName, testName, prescription, date, time, address, isDone, phoneNum)
VALUES
  (1, 'John Doe', 'Blood Test', 'Prescription for blood test', '2022-01-10', '10:00:00', '123 Main St', 0, 1234567890),
  (1, 'Jane Smith', 'X-Ray', 'Prescription for X-Ray', '2022-01-12', '14:30:00', '456 Oak St', 1, 9876543210),
  (1, 'Alice Johnson', 'Urine Test', 'Prescription for urine test', '2022-01-15', '09:45:00', '789 Pine St', 0, 5555555555),
  (1, 'Bob Williams', 'MRI', 'Prescription for MRI', '2022-01-20', '13:15:00', '101 Elm St', 0, 7777777777);


CREATE TABLE diagnostic_options (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  description TEXT
);
INSERT INTO diagnostic_options (name, description)
VALUES
  ('Blood Test', 'A diagnostic test to analyze blood components.'),
  ('X-Ray', 'An imaging test that uses X-rays to create detailed pictures.'),
  ('Urine Test', 'Analysis of urine to diagnose various medical conditions.'),
  ('MRI', 'Magnetic Resonance Imaging for detailed images of internal structures.'),
  ('CT Scan', 'Computed Tomography for cross-sectional imaging.'),
  ('EKG/ECG', 'Electrocardiogram for recording the electrical activity of the heart.'),
  ('Colonoscopy', 'Endoscopic examination of the large intestine.'),
  ('Mammogram', 'X-ray of the breast to detect and diagnose breast cancer.'),
  ('Ultrasound', 'Imaging using high-frequency sound waves for various organs.'),
  ('DEXA Scan', 'Dual-Energy X-ray Absorptiometry for bone density measurement.');


ALTER TABLE bookings
ADD COLUMN testsDone BOOLEAN DEFAULT false;

ALTER TABLE users
ADD COLUMN isAdmin BOOLEAN DEFAULT false;


DELETE FROM users;
DELETE FROM diagnostic_options;
DELETE FROM bookings;

UPDATE users
SET isAdmin = true
WHERE username = 'admin@gmail.com' or username = 'admin2@gmail.com';

select * from users;
select * from bookings;