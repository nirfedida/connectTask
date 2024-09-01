# connectTask
Web Management API
This is a REST API designed for managing items and categories. It enables you to create, update, retrieve, and search items and categories.

Requirements
Node.js (v14.x or later)
SQL Server (local or remote instance)

1. Set Up API Files
unzip API Files:

unzip the all folders to your computer.

2. Initialize the Database
Follow these steps to create the database and tables using SQL Server Management Studio (SSMS):

Open SQL Server Management Studio (SSMS):

Launch SSMS and connect to your SQL Server instance.
Create Database and Tables:

Run the following SQL script in a new query window:

-- Create Database
CREATE DATABASE WebManagementDB;
GO

USE WebManagementDB;
GO

-- Create Categories Table
CREATE TABLE Categories (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Name NVARCHAR(255) NOT NULL UNIQUE
);
GO

-- Create Items Table
CREATE TABLE Items (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Name NVARCHAR(255) NOT NULL UNIQUE,
    CategoryId INT,
    FOREIGN KEY (CategoryId) REFERENCES Categories(Id)
);
GO

-- Create ItemVolumes Table
CREATE TABLE ItemVolumes (
    Id INT PRIMARY KEY IDENTITY(1,1),
    ItemId INT,
    Value NVARCHAR(255) NOT NULL,
    Price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (ItemId) REFERENCES Items(Id),
    UNIQUE (ItemId, Price)
);
GO

-- Insert Categories
INSERT INTO Categories (Name) VALUES ('Electronics');
INSERT INTO Categories (Name) VALUES ('Furniture');
GO

-- Insert Items
INSERT INTO Items (Name, CategoryId) VALUES ('Smartphone', 1);
INSERT INTO Items (Name, CategoryId) VALUES ('Laptop', 1);
INSERT INTO Items (Name, CategoryId) VALUES ('Chair', 2);
INSERT INTO Items (Name, CategoryId) VALUES ('Table', 2);
INSERT INTO Items (Name, CategoryId) VALUES ('Headphones', 1);
INSERT INTO Items (Name, CategoryId) VALUES ('Monitor', 1);
INSERT INTO Items (Name, CategoryId) VALUES ('Sofa', 2);
INSERT INTO Items (Name, CategoryId) VALUES ('Desk', 2);
INSERT INTO Items (Name, CategoryId) VALUES ('Lamp', 2);
INSERT INTO Items (Name, CategoryId) VALUES ('Bookshelf', 2);
GO

-- Insert Item Volumes
INSERT INTO ItemVolumes (ItemId, Value, Price) VALUES (1, '64GB', 100.00);
INSERT INTO ItemVolumes (ItemId, Value, Price) VALUES (1, '128GB', 150.00);
INSERT INTO ItemVolumes (ItemId, Value, Price) VALUES (2, '256GB', 200.00);
INSERT INTO ItemVolumes (ItemId, Value, Price) VALUES (2, '512GB', 250.00);
INSERT INTO ItemVolumes (ItemId, Value, Price) VALUES (3, 'Standard', 50.00);
INSERT INTO ItemVolumes (ItemId, Value, Price) VALUES (3, 'Deluxe', 80.00);
INSERT INTO ItemVolumes (ItemId, Value, Price) VALUES (4, 'Small', 120.00);
INSERT INTO ItemVolumes (ItemId, Value, Price) VALUES (4, 'Large', 180.00);
INSERT INTO ItemVolumes (ItemId, Value, Price) VALUES (5, 'Basic', 60.00);
INSERT INTO ItemVolumes (ItemId, Value, Price) VALUES (6, '4K', 400.00);
GO

3. Create a New SQL Server Login
Create a New Login:

Navigate to 'Security' in the Object Explorer.
Expand the “Security” node and right-click on “Logins.”
Select “New Login…”
Configure the Login:

Login Name: Enter 'DBuser'.
Authentication: Choose “SQL Server authentication”.
Password: Enter '123456' and confirm it.
Set Default Database:

Set the default database to 'WebManagementDB'.
Click OK to create the login.

4. Grant Permissions to the User
Add User to Database:

In SSMS, expand the “Databases” node.
Right-click on 'WebManagementDB', select “Properties,” and go to the “Permissions” page.
Click “Add,” select 'DBuser', and click “OK.”
Assign Roles:

In the database properties window, go to the “Users” page.
Right-click and select “New User…”
Enter 'DBuser' as the user name and select the previously created 'DBuser' login.
Assign roles such as:
'db_owner': Full control over the database.
'db_datareader': Read-only access to the database.
'db_datawriter': Write access to the database.
Click “OK” to save the user settings.

Run the Server:

Open your terminal, navigate to the 'connectTask-main' folder, and run:
node app.js

5. Test API Endpoints
Use Postman or any other API testing tool to test the following endpoints. Include the API key ('connect123') in the request headers:

POST /items - Create or update an item.
GET /category/
- Get category details and related items.
GET /items - Get all items.
GET /item/
- Get item details by ID.
GET /item/search - Search items or categories.
POST /category - Add a new category.
Troubleshooting
Database Connection Issues: Ensure that SQL Server is running and the connection details in your .env file are correct.
API Errors: Check server logs for error messages and adjust SQL queries or API code as necessary.
Permission Issues: Verify that the SQL Server user has the necessary permissions to access and modify the database.