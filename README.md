# Ecommerce Design/Architecture

## Table of Contents
- Security
- Database Design
- Performance
- Things to consider

## Security
- Following OWASP guidelines
- All user input should be treated with caution to avoid attacks like SQL/javascript injection
- Never storing sensitive data without hashing it first such as passwords

## Database Design
- For scalability, non relational databases are best, however some database transactions require ACID properties so SQL databases are necessary
- A combination of both kinds of databases can be used to provide ACID properties and performance
- Sensitive transactions such as a purchase must be handled in a RDBMS for ACID properties
- But other data such as products, reviews, etc, can be stored in a non relational database
- It's important to understand the difficulties of sharding a SQL database
- In this example SQL database design was used for simplicity

![databaseDesign](https://user-images.githubusercontent.com/43149204/131218560-8d2e22a8-7085-47f4-965a-230da8615d9e.png)

## Performance
- Sending the minimum number of bytes
- Making use of CDNs to store static files and some non static data as well which is not changing too much but requires more frequent refreshing such as products and reviews
- Using a RAM based database such as Redis or Memcache to store various data such as user sessions, most popular products, etc
- Finding ways to reduce to amount of work done on backend processing, for example reducing the number queries by addign redundant data or database normalization, reducing joins

## Things to consider
- How to manage business processes, after a user makes a purchase, topological sort gives an optimal build process
- How to securely manage payments
- How to work with delivery company response and APIs
- If there is only 1 item left of a certain product, how long can a user keep it in their cart without buy?

much, much more!