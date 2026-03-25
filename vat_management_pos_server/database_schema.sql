-- MySQL Data Definition Language (DDL) for VAT Management Database
-- Password for the user is expected to be 'chadweek' as defined in your .env

CREATE DATABASE IF NOT EXISTS vat_management;
USE vat_management;

-- 1. Table: users
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Table: products
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    pId VARCHAR(255) NOT NULL UNIQUE,
    quantity INT NOT NULL DEFAULT 0,
    price DECIMAL(10, 2) NOT NULL,
    img VARCHAR(512),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 3. Table: bookings
CREATE TABLE IF NOT EXISTS bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    pId VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    img VARCHAR(512),
    bookQuantity INT NOT NULL DEFAULT 1,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 4. Table: buys (Sales History)
CREATE TABLE IF NOT EXISTS buys (
    id INT AUTO_INCREMENT PRIMARY KEY,
    bookings JSON NOT NULL, -- Storing the array of booked items
    subTotal DECIMAL(10, 2) NOT NULL,
    discount DECIMAL(10, 2) DEFAULT 0,
    vats DECIMAL(10, 2) DEFAULT 0, -- Original vat percentage
    vatAmount DECIMAL(10, 2) DEFAULT 0,
    finalNetAmount DECIMAL(10, 2) NOT NULL,
    date VARCHAR(255),
    time VARCHAR(255),
    customerName VARCHAR(255), -- Renamed from 'name' to 'customerName' to avoid confusion
    phone VARCHAR(255),
    address VARCHAR(255),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 5. Table: updateProducts (Restock History)
CREATE TABLE IF NOT EXISTS updateProducts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    singleProduct JSON NOT NULL, -- Storing the specific product details at time of update
    updateQuantity INT NOT NULL,
    date VARCHAR(255),
    lastQuantityAdd INT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
