# Car Rental System

A comprehensive Car Rental System where users can rent cars, manage their rentals, and handle car availability.

## Features

- Users can rent cars and ensure that they cannot be rented again until they are returned.
- Different API endpoints to handle users, cars, and rentals efficiently.
- Special API endpoints to filter cars based on various criteria.

## MongoDB Models

### User
- name: String
- password: String
- email: String
- phone: String

  
### Car
- name: String
- model: String
- rentalStatus: String (available/rented)

  
### Rental
- car_id: Reference to Car Model
- user_id: Reference to User Model
- rentalDate: Date
- returnDate: Date


## User APIs

1. Sign up
2. Sign in
3. Get a specific user
4. Get all users
5. Update user (owner access only)
6. Delete user (owner access only)

## Car APIs

1. Add car
2. Get a specific car
3. Get all cars
4. Update a car
5. Delete a car

## Rental APIs

1. Create Rental
2. Update Rental
3. Delete Rental
4. Get all Rentals
5. Get a specific Rental

## Special APIs

1. Get all cars with the brand 'Honda' or 'Toyota'
2. Get Available Cars of a Specific Brand
3. Get Cars that are either Rented or of a Specific Brand
4. Get Available Cars of a Specific Brand or Rented Cars of a Specific Brand
