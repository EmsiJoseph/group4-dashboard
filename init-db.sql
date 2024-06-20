-- Initialize the form_data database
CREATE DATABASE IF NOT EXISTS form_data;
USE form_data;

-- Create the user_info table
CREATE TABLE user_info (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    gender VARCHAR(10),
    civil_status VARCHAR(50),
    date_of_birth DATE,
    religion VARCHAR(255),
    occupation VARCHAR(255),
    address_number VARCHAR(255),
    address_street VARCHAR(255),
    address_subdivision_barangay VARCHAR(255),
    address_municipality VARCHAR(255),
    address_province VARCHAR(255),
    address_zip_code VARCHAR(10),
    mobile_number VARCHAR(20),
    q1 VARCHAR(3),
    q2 VARCHAR(3),
    q3 VARCHAR(3),
    q4 VARCHAR(3),
    q5 VARCHAR(3),
    q6 VARCHAR(3),
    q7 VARCHAR(3),
    q8 VARCHAR(3),
    q9 VARCHAR(3),
    q10 VARCHAR(3)
);
