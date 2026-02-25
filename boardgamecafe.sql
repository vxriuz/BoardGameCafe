Create DATABASE if NOT EXISTS BoardGameCafe;
USE BoardGameCafe;

-- Rensa i rätt ordning (beroende tabeller först)
DROP TABLE IF EXISTS Orders;
DROP TABLE IF EXISTS Rentals;
DROP TABLE IF EXISTS Game_Category_Link;
DROP TABLE IF EXISTS Visits;
DROP TABLE IF EXISTS Games;
DROP TABLE IF EXISTS Categories;
DROP TABLE IF EXISTS Menu_Items;
DROP TABLE IF EXISTS Staff;
DROP TABLE IF EXISTS Cafe_Tables;

-- Tabeller utan FK först
CREATE TABLE Categories (
    Category_ID INT NOT NULL AUTO_INCREMENT,
    Category_Name VARCHAR(100) NOT NULL,
    PRIMARY KEY (Category_ID)
);

CREATE TABLE Games (
    Game_ID INT NOT NULL AUTO_INCREMENT,
    Title VARCHAR(100) NOT NULL,
    Min_Players INT NOT NULL,
    Max_Players INT NOT NULL,
    Status VARCHAR(50) NOT NULL DEFAULT 'Available',
    PRIMARY KEY (Game_ID)
);

CREATE TABLE Game_Category_Link (
    Game_ID INT NOT NULL,
    Category_ID INT NOT NULL,
    PRIMARY KEY (Game_ID, Category_ID),
    FOREIGN KEY (Game_ID) REFERENCES Games(Game_ID),
    FOREIGN KEY (Category_ID) REFERENCES Categories(Category_ID)
);

CREATE TABLE Cafe_Tables (
    Table_ID INT NOT NULL AUTO_INCREMENT,
    Seat_Count INT NOT NULL,
    PRIMARY KEY (Table_ID)
);

CREATE TABLE Staff (
    Staff_ID INT NOT NULL AUTO_INCREMENT,
    Full_Name VARCHAR(100) NOT NULL,
    Role VARCHAR(50) NOT NULL,
    PRIMARY KEY (Staff_ID)
);

CREATE TABLE Menu_Items (
    Item_ID INT NOT NULL AUTO_INCREMENT,
    Item_Name VARCHAR(100) NOT NULL,
    Price DECIMAL(6,2) NOT NULL,
    Type VARCHAR(50) NOT NULL,
    PRIMARY KEY (Item_ID)
);

CREATE TABLE Visits (
    Visit_ID INT NOT NULL AUTO_INCREMENT,
    Table_ID INT NOT NULL,
    Staff_ID INT NOT NULL,
    Start_Time DATETIME NOT NULL,
    End_Time DATETIME,
    Total_Bill DECIMAL(8,2) DEFAULT 0,
    PRIMARY KEY (Visit_ID),
    FOREIGN KEY (Table_ID) REFERENCES Cafe_Tables(Table_ID),
    FOREIGN KEY (Staff_ID) REFERENCES Staff(Staff_ID)
);

CREATE TABLE Rentals (
    Rental_ID INT NOT NULL AUTO_INCREMENT,
    Visit_ID INT NOT NULL,
    Game_ID INT NOT NULL,
    Time_Rented DATETIME NOT NULL,
    Time_Returned DATETIME,
    PRIMARY KEY (Rental_ID),
    FOREIGN KEY (Visit_ID) REFERENCES Visits(Visit_ID),
    FOREIGN KEY (Game_ID) REFERENCES Games(Game_ID)
);

CREATE TABLE Orders (
    Order_ID INT NOT NULL AUTO_INCREMENT,
    Visit_ID INT NOT NULL,
    Item_ID INT NOT NULL,
    Quantity INT NOT NULL DEFAULT 1,
    PRIMARY KEY (Order_ID),
    FOREIGN KEY (Visit_ID) REFERENCES Visits(Visit_ID),
    FOREIGN KEY (Item_ID) REFERENCES Menu_Items(Item_ID)
);




-- Kategorier
INSERT INTO Categories (Category_Name) VALUES
('Strategy'), ('Family'), ('Party'), ('Co-op'), ('Card Game');

-- Spel
INSERT INTO Games (Title, Min_Players, Max_Players, Status) VALUES
('Catan', 3, 4, 'Available'),
('Ticket to Ride', 2, 5, 'Available'),
('Codenames', 4, 8, 'Available'),
('Pandemic', 2, 4, 'Available'),
('Uno', 2, 10, 'Available'),
('Azul', 2, 4, 'Available'),
('Dixit', 3, 6, 'Available'),
('7 Wonders', 2, 7, 'Rented');

-- Koppla spel till kategorier
INSERT INTO Game_Category_Link (Game_ID, Category_ID) VALUES
(1, 1), (1, 2), (2, 2), (3, 3), (4, 4), (4, 1),
(5, 5), (5, 3), (6, 1), (7, 3), (7, 2), (8, 1);

-- Bord
INSERT INTO Cafe_Tables (Seat_Count) VALUES
(2), (4), (4), (6), (8);

-- Personal
INSERT INTO Staff (Full_Name, Role) VALUES
('Anna Lindqvist', 'Manager'),
('Erik Nilsson', 'Waiter'),
('Thea Svensson', 'Waiter'),
('Casper Sörensen', 'Game Host');

-- Meny
INSERT INTO Menu_Items (Item_Name, Price, Type) VALUES
('Kaffe', 35.00, 'Drink'),
('Latte', 45.00, 'Drink'),
('Te', 30.00, 'Drink'),
('Smörgås', 65.00, 'Food'),
('Tårta', 55.00, 'Food'),
('Läsk', 25.00, 'Drink'),
('Wrap', 75.00, 'Food');

-- Besök
INSERT INTO Visits (Table_ID, Staff_ID, Start_Time, End_Time, Total_Bill) VALUES
(2, 2, '2025-01-10 14:00:00', '2025-01-10 16:30:00', 125.00),
(3, 3, '2025-01-10 15:00:00', '2025-01-10 18:00:00', 290.00),
(4, 2, '2025-01-11 11:00:00', '2025-01-11 13:00:00', 105.00),
(1, 4, '2025-01-11 14:00:00', '2025-01-11 15:30:00', 60.00),
(5, 3, '2025-01-12 13:00:00', '2025-01-12 17:00:00', 485.00),
(2, 2, '2025-01-12 10:00:00', NULL, 35.00),
(3, 3, '2025-01-13 12:00:00', '2025-01-13 14:30:00', 135.00),
(1, 2, '2025-01-13 15:00:00', '2025-01-13 16:30:00', 100.00),
(4, 4, '2025-01-14 11:00:00', '2025-01-14 14:00:00', 330.00),
(2, 3, '2025-01-14 14:00:00', '2025-01-14 16:00:00', 125.00),
(5, 2, '2025-01-15 12:00:00', '2025-01-15 16:00:00', 540.00),
(3, 4, '2025-01-15 13:00:00', '2025-01-15 15:00:00', 120.00);

-- Uthyrningar
INSERT INTO Rentals (Visit_ID, Game_ID, Time_Rented, Time_Returned) VALUES
(1, 1, '2025-01-10 14:10:00', '2025-01-10 16:00:00'),
(2, 3, '2025-01-10 15:15:00', '2025-01-10 17:00:00'),
(2, 6, '2025-01-10 17:10:00', '2025-01-10 17:50:00'),
(3, 2, '2025-01-11 11:15:00', '2025-01-11 12:45:00'),
(5, 4, '2025-01-12 13:20:00', '2025-01-12 16:00:00'),
(5, 7, '2025-01-12 13:30:00', '2025-01-12 15:00:00'),
(6, 8, '2025-01-12 10:15:00', NULL),
(7, 1, '2025-01-13 12:15:00', '2025-01-13 14:00:00'),
(7, 5, '2025-01-13 12:20:00', '2025-01-13 13:30:00'),
(8, 1, '2025-01-13 15:10:00', '2025-01-13 16:20:00'),
(9, 3, '2025-01-14 11:15:00', '2025-01-14 13:00:00'),
(9, 1, '2025-01-14 11:20:00', '2025-01-14 13:30:00'),
(10, 2, '2025-01-14 14:10:00', '2025-01-14 15:30:00'),
(10, 7, '2025-01-14 14:15:00', '2025-01-14 15:45:00'),
(11, 3, '2025-01-15 12:15:00', '2025-01-15 14:00:00'),
(11, 4, '2025-01-15 12:20:00', '2025-01-15 15:00:00'),
(11, 5, '2025-01-15 14:10:00', '2025-01-15 15:30:00'),
(12, 1, '2025-01-15 13:10:00', '2025-01-15 14:30:00'),
(12, 6, '2025-01-15 13:15:00', '2025-01-15 14:45:00');

-- Beställningar
INSERT INTO Orders (Visit_ID, Item_ID, Quantity) VALUES
(1, 1, 2), (1, 5, 1),
(2, 2, 3), (2, 4, 2), (2, 6, 1),
(3, 3, 1), (3, 7, 1),
(4, 1, 1), (4, 6, 1),
(5, 2, 4), (5, 4, 3), (5, 5, 2),
(6, 1, 1),
(7, 1, 2), (7, 4, 1),
(8, 2, 1), (8, 5, 1),
(9, 1, 3), (9, 7, 2), (9, 6, 3),
(10, 3, 2), (10, 4, 1),
(11, 2, 5), (11, 5, 3), (11, 7, 2),
(12, 1, 2), (12, 6, 2);