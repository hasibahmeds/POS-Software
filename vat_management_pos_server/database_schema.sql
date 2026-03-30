-- MySQL Data Definition Language (DDL) for VAT Management Database
-- Password for the user is expected to be 'chadweek' as defined in your .env

CREATE DATABASE IF NOT EXISTS pos_software;
USE pos_software;

-- Drop existing tables if they exist (in reverse order of dependencies)
DROP TABLE IF EXISTS buy_items;
DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS updateProducts;
DROP TABLE IF EXISTS buys;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS users;

-- 1. Table: users (User accounts)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Table: products (Product catalog)
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    productId VARCHAR(255) NOT NULL UNIQUE,
    quantity INT NOT NULL DEFAULT 0,
    price DECIMAL(10, 2) NOT NULL,
    img VARCHAR(512),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_products_productId (productId)
);

-- 3. Table: bookings (Shopping cart / temporary reservations)
CREATE TABLE IF NOT EXISTS bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    productId VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    img VARCHAR(512),
    bookQuantity INT NOT NULL DEFAULT 1,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    -- Foreign Key to products table (using productId)
    CONSTRAINT fk_bookings_product FOREIGN KEY (productId) 
        REFERENCES products(productId) 
        ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_bookings_productId (productId)
);

-- 4. Table: buys (Sales transactions - Header)
CREATE TABLE IF NOT EXISTS buys (
    id INT AUTO_INCREMENT PRIMARY KEY,
    subTotal DECIMAL(10, 2) NOT NULL,
    discount DECIMAL(10, 2) DEFAULT 0,
    vats DECIMAL(10, 2) DEFAULT 0,
    vatAmount DECIMAL(10, 2) DEFAULT 0,
    finalNetAmount DECIMAL(10, 2) NOT NULL,
    date VARCHAR(255),
    time VARCHAR(255),
    customerName VARCHAR(255),
    phone VARCHAR(255),
    address VARCHAR(255),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 5. Table: buy_items (Sales transactions - Line Items)
CREATE TABLE IF NOT EXISTS buy_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    buyId INT NOT NULL,
    productId VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    img VARCHAR(512),
    bookQuantity INT NOT NULL DEFAULT 1,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- Foreign Key to buys table (parent transaction)
    CONSTRAINT fk_buy_items_buy FOREIGN KEY (buyId) 
        REFERENCES buys(id) 
        ON DELETE CASCADE ON UPDATE CASCADE,
    -- Foreign Key to products table (for inventory tracking)
    CONSTRAINT fk_buy_items_product FOREIGN KEY (productId) 
        REFERENCES products(productId) 
        ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_buy_items_buyId (buyId),
    INDEX idx_buy_items_productId (productId)
);

-- 6. Table: updateProducts (Restock/Inventory update history)
CREATE TABLE IF NOT EXISTS updateProducts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    productId VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    img VARCHAR(512),
    price DECIMAL(10, 2) NOT NULL,
    updateQuantity INT NOT NULL,
    date VARCHAR(255),
    lastQuantityAdd INT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    -- Foreign Key to products table
    CONSTRAINT fk_updateProducts_product FOREIGN KEY (productId) 
        REFERENCES products(productId) 
        ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_updateProducts_productId (productId)
);

-- ============================================
-- RELATIONSHIP SUMMARY FOR MYSQL WORKBENCH:
-- ============================================
-- 
-- users (1) ---- (0) no direct relationship (future: could add userId to buys)
-- 
-- products (1) ---- (M) bookings
--   └─ Primary key: productId (VARCHAR)
--   └─ Referenced by: bookings.productId
-- 
-- products (1) ---- (M) buy_items
--   └─ Primary key: productId (VARCHAR)
--   └─ Referenced by: buy_items.productId
-- 
-- products (1) ---- (M) updateProducts
--   └─ Primary key: productId (VARCHAR)
--   └─ Referenced by: updateProducts.productId
-- 
-- buys (1) ---- (M) buy_items
--   └─ Primary key: id (INT AUTO_INCREMENT)
--   └─ Referenced by: buy_items.buyId
--   └─ ON DELETE CASCADE: When a sale is deleted, all line items are deleted
--   └─ ON UPDATE CASCADE: If sale ID changes, updates propagate
