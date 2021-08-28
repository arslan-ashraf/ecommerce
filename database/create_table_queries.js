CREATE TABLE users (
	id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    firstName VARCHAR(50) NOT NULL,
    lastName VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL,
    password VARCHAR(1024) NOT NULL,
    created_at DATETIME,
    updated_at DATETIME
);


CREATE TABLE userDetails (
	id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    address VARCHAR(100) NOT NULL,
    city VARCHAR(50) NOT NULL,
    state VARCHAR(50) NOT NULL,
    zipcode INT NOT NULL,
    phone_number INT,
    created_at DATETIME,
    updated_at DATETIME
);

CREATE TABLE userDetails (
	id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    address VARCHAR(100) NOT NULL,
    city VARCHAR(50) NOT NULL,
    state VARCHAR(50) NOT NULL,
    zipcode INT NOT NULL,
    phone_number INT,
    created_at DATETIME,
    updated_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE userPayments (
	id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    payment_type VARCHAR(10) NOT NULL,
    card_number INT NOT NULL,
    cc_number INT NOT NULL,
    expiration_date DATE NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE userSessions (
	session_id VARCHAR(100) UNIQUE NOT NULL PRIMARY KEY,
    user_id INT DEFAULT -1,
    expiration_date DATETIME
);

CREATE TABLE cart (
	id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    user_id INT DEFAULT -1,
    session_id VARCHAR(100) NOT NULL,
    subtotal FLOAT NOT NULL,
    tax FLOAT NOT NULL,
    shipping FLOAT NOT NULL,
    total FLOAT NOT NULL,
    expiration DATETIME NOT NULL,
    FOREIGN KEY (session_id) REFERENCES userSessions(session_id)
);

CREATE TABLE productCategory (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    created_at DATETIME,
    updated_at DATETIME
);

CREATE TABLE products (
	id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    category_id INT NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT, 
    price FLOAT NOT NULL,
    quantity INT NOT NULL,
    created_at DATETIME,
    edited_at DATETIME,
    FOREIGN KEY (category_id) REFERENCES productCategory(id)
);

CREATE TABLE cartItem (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    cart_id INT NOT NULL,
    product_id INT NOT NULL,
    product_title VARCHAR(100),
    product_price FLOAT,
    expiration DATETIME NOT NULL,
    coupon VARCHAR(100),
    quantity INT,
    FOREIGN KEY (cart_id) REFERENCES cart(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE productReviews (
	id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    username VARCHAR(50) NOT NULL,
    title VARCHAR(100) NOT NULL,
    review TEXT,
    rating FLOAT NOT NULL,
    created_at DATETIME,
    edited_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);


CREATE TABLE orders (
	id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
	order_number VARCHAR(100) NOT NULL,
    order_date DATETIME,
    shipping_status VARCHAR(30) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE shipments (
	tracking_number VARCHAR(100) NOT NULL PRIMARY KEY,
    order_id INT NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id)
);