-- Create Database
CREATE DATABASE IF NOT EXISTS fruite_db;
USE fruite_db;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(15),
    profile_photo VARCHAR(255),
    role VARCHAR(20) DEFAULT 'customer',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Addresses Table
CREATE TABLE IF NOT EXISTS addresses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    address_type VARCHAR(20) DEFAULT 'home',
    details TEXT NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    city VARCHAR(50) NOT NULL,
    state VARCHAR(50) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT
);

-- Products Table
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price FLOAT NOT NULL,
    category_id INT NOT NULL,
    stock_quantity INT DEFAULT 0,
    image_url VARCHAR(255),
    tags VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Cart Table
CREATE TABLE IF NOT EXISTS carts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT DEFAULT 1,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    total_price FLOAT NOT NULL,
    status VARCHAR(20) DEFAULT 'placed',
    address_id INT NOT NULL,
    payment_method VARCHAR(20) DEFAULT 'cod',
    payment_status VARCHAR(20) DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (address_id) REFERENCES addresses(id)
);

-- Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price_at_purchase FLOAT NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Insert Sample Data
INSERT IGNORE INTO categories (id, name, description, image_url) VALUES
(1, 'Fruits', 'Fresh seasonal and exotic fruits', 'https://images.unsplash.com/photo-1619566633748-5d8de0d59248?auto=format&fit=crop&q=80&w=800'),
(2, 'Vegetables', 'Organic and farm-fresh vegetables', 'https://images.unsplash.com/photo-1597362868423-1b14ea3396a6?auto=format&fit=crop&q=80&w=800'),
(3, 'Exotics', 'International produce and rare finds', 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=800'),
(4, 'Organic', 'Certified chemical-free naturally grown', 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800');

INSERT IGNORE INTO products (name, description, price, unit, stock_quantity, category_id, image_url, rating, farmer) VALUES
('Alfonso Mangoes', 'Sweet and creamy premium Alfonso mangoes from Ratnagiri.', 600.00, 'Dozen', 50, 1, 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&q=80&w=800', 4.9, 'Prajwal Patil'),
('Fresh Strawberries', 'Hand-picked juicy strawberries from Mahabaleshwar.', 150.00, 'Pack', 30, 1, 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&q=80&w=800', 4.7, 'Suresh Kumar'),
('Broccoli', 'Fresh organic broccoli rich in nutrients.', 80.00, 'Kg', 40, 2, 'https://images.unsplash.com/photo-1459411621453-7b03977f4952?auto=format&fit=crop&q=80&w=2000', 4.5, 'Meera Bai'),
('Avocado', 'Premium Haas avocados for salads and toast.', 250.00, 'Piece', 20, 3, 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&q=80&w=800', 4.8, 'Global Imports');
