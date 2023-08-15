# Pafin Technical Assigment
The code for the technical assignment. The project uses Express.js for the server and TypeORM for Object-relational mapping for PostgreSQL for clean and maintanable code.  

## Prerequisites
- After cloning the repository open your console inside the root directory of this project and run "npm install"  
- Create a .env file inside the root directory and set a random value for "JWT_TOKEN". An example can be found in .env.example  
- Start a PostgreSQL server if one isn't already running. The project will try to connect to a local (127.0.0.1) PostgreSQL database named "postgres" on port 5432 with the username "postgres" and password "postgres".  

## Testing
The project runs on localhost:3000  
To run the project you can either use "npm run dev" to run the project in development, or you can use "npm run build" and then use "npm run start".  
Postman was used to test the API. Import the "postman_collection" and "postman_environment" files inside your Postman app to set up Postman (Import button at top left of Postman).  
After importing both .json files go to the "environments" tab inside the Postman app and set the "pafin_variables" active by clicking the checkmark right from its name.  
With this you won't have to manually copy the user id (uuid) or the JWT to access the routes. Call the "Create User" route (or "Create 2nd User") and the variables will be automatically stored.

## API Documentation
All routes start with /api  
So the base route is localhost:3000/api  
Example for the "/users" route: localhost:3000/api/users

### /users
**POST** /  
Creates a new user  
Body: Requires a "user" object inside of the request body =>  
```
user: {
    name: string,
    email: string,
    password: string,
}
```  
Authorization: None  

### /users/:id
Param:  
:id => represents the uuid of a user  

**GET** /  
Get a user for the given user id  
Body: None  
Authorization: JWT  

**PUT** /  
Update a user for the given user id  
Body: Requires a "user" object inside of the request body with optional fields =>  
```
user: {
    name?: string,
    email?: string,
    password?: string
}
```  
Authorization: JWT  

**DELETE** /  
Deletes a user with a given user id  
Body: None  
Authorization: JWT  