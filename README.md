# Car Rental System

A comprehensive Car Rental System where users can rent cars, manage their rentals, and handle car availability.

## Features

- Users can rent cars and ensure that rented cars cannot be rented again until they are returned.
- Different API endpoints to handle users, cars, and rentals efficiently.
- Special API endpoints to filter cars based on various criteria.

## MongoDB Models

### Car
- **name**: String
- **model**: String
- **rentalStatus**: String (available/rented)

### User
- **name**: String
- **password**: String
- **email**: String
- **phone**: String

### Rental
- **car_id**: Reference to Car model
- **user_id**: Reference to User model
- **rentalDate**: Date
- **returnDate**: Date

## User APIs

1. **Signup**
2. **Sign in**
3. **Get a specific user**
4. **Get all users**
5. **Update user** (owner only)
6. **Delete user** (owner only)

## Car APIs

1. **Add car**
2. **Get a specific car**
3. **Get all cars**
4. **Update a car**
5. **Delete a car**

## Rental APIs

1. **Create Rental**
2. **Update Rental**
3. **Delete Rental**
4. **Get all Rentals**
5. **Get a specific Rental**

## Special APIs

1. **Get all cars whose brand is ‘Honda’ and ‘Toyota’**
2. **Get Available Cars of a Specific Brand**
3. **Get Cars that are Either rented or of a Specific Brand**
4. **Get Available Cars of a Specific Brand or Rented Cars of a Specific Brand**
