select * from Orders;
select * from Rentals;
select * from Game_Category_Link;
select * from Visits;
select * from Games;
select * from Categories;
select * from Menu_Items;
select * from Staff;
select * from Cafe_Tables;


-- PROCEDURE: Starta ett nytt besök (skapar Visit, tilldelar bord)
-- TRIGGER: Uppdatera Total_Bill automatiskt när en Order läggs till
-- FUNCTION: Beräkna speltid för en rental i minuter

-- Hämta alla menyartiklar
SELECT Menu_Items.Item_ID, Menu_Items.Item_Name, Menu_Items.Price, Menu_Items.Type
        FROM Menu_Items
        ORDER BY Menu_Items.Type, Menu_Items.Item_Name

-- Alla bord med aktiv nota (om det finns)
SELECT Cafe_Tables.Table_ID, Cafe_Tables.Seat_Count, Visits.Total_Bill, Visits.Visit_ID
        FROM Cafe_Tables
        LEFT JOIN Visits ON Cafe_Tables.Table_ID = Visits.Table_ID AND Visits.End_Time IS NULL
        ORDER BY Cafe_Tables.Table_ID


-- Hämta all personal
SELECT Staff.Staff_ID, Staff.Full_Name, Staff.Role
        FROM Staff


-- Hämta alla menyartiklar
SELECT Menu_Items.Item_ID, Menu_Items.Item_Name, Menu_Items.Price, Menu_Items.Type
        FROM Menu_Items
        ORDER BY Menu_Items.Type, Menu_Items.Item_Name







-- Q1: Visa tillgängliga spel med deras kategorier (JOIN + multirelation)
-- "En kund vill välja ett spel att hyra"
select distinct Games.Title, GROUP_CONCAT(Categories.Category_Name SEPARATOR ', ') AS Categories
from Games 
join game_category_link ON Games.Game_ID = Game_Category_Link.Game_ID
join Categories ON Game_Category_Link.Category_ID = Categories.Category_ID
where Games.Status = "Available"
GROUP BY Games.Title;


-- Q2: Visa notan för ett besök (JOIN + aggregation + multirelation)
-- "Kunden vill betala — visa allt de beställt och totalpris"
SELECT Visits.Visit_ID, 
       Menu_Items.Item_Name,
       Menu_Items.Price,
       Orders.Quantity,
       (Orders.Quantity * Menu_Items.Price) AS Line_Total
FROM Visits
JOIN Orders ON Visits.Visit_ID = Orders.Visit_ID
JOIN Menu_Items ON Orders.Item_ID = Menu_Items.Item_ID
ORDER BY Visits.Visit_ID;


-- Q3: Mest populära spelen (JOIN + GROUP BY + aggregation)
-- "Ägaren vill veta vilka spel som hyrs mest"
SELECT Title, COUNT(*) AS Number_of_rentals 
FROM Games
JOIN Rentals on Games.Game_ID = Rentals.Game_ID
GROUP BY Games.Title
ORDER BY Number_of_rentals DESC;


-- Q4: Intäkt per anställd (JOIN + GROUP BY + aggregation + multirelation)
-- "Ägaren vill se vilken personal som genererar mest intäkter"
SELECT Staff.Full_Name, SUM(Visits.Total_bill) AS totalSold
FROM Visits
JOIN Staff on Visits.Staff_ID = Staff.Staff_ID
GROUP BY Staff.Full_Name
ORDER BY totalSold desc;


-- Q5: Visa lediga bord just nu (subquery)
-- "Kund kommer in — vilka bord är tillgängliga?"
SELECT Cafe_Tables.Table_ID, Cafe_Tables.Seat_Count FROM Cafe_Tables
WHERE Cafe_Tables.Table_ID NOT IN (SELECT Visits.Table_ID from Visits where Visits.End_time IS NULL);



-- PROCEDURES & TRIGGER

-- PROCEDURE: Starta nytt besök
DROP PROCEDURE IF EXISTS newVisit;
CREATE PROCEDURE newVisit(
    IN Cafe_TableID INT,
    IN StaffID INT
)
BEGIN
    INSERT INTO Visits (Table_ID, Staff_ID, Start_Time, End_Time, Total_Bill)
    VALUES (Cafe_TableID, StaffID, NOW(), NULL, 0);
END;


-- Procedure: Skapa Rental
DROP PROCEDURE IF EXISTS newRental;
CREATE Procedure newRental(
    IN VisitID INT,
    IN GameID INT
)
BEGIN
    INSERT INTO Rentals (Visit_ID, Game_ID, Time_Rented, Time_Returned)
    VALUES (VisitID, GameID, NOW(), NULL);
    UPDATE Games SET Status = "Rented" WHERE  Game_ID = GameID;
END;


-- Procedure: Skapa Order
DROP PROCEDURE IF EXISTS newOrder;
CREATE Procedure newOrder(
    IN VisitID int,
    IN ItemID int,
    IN Quant int
)
BEGIN
    INSERT INTO Orders (Visit_ID, Item_ID, Quantity)
    VALUES (VisitID, ItemID, Quant);
END;


-- TRIGGER: Uppdatera Total_Bill automatiskt vid ny order
DROP TRIGGER IF EXISTS Update_bill;
CREATE TRIGGER Update_bill
AFTER INSERT ON Orders
FOR EACH ROW
BEGIN
    UPDATE Visits
    SET Total_Bill = Total_Bill + (
        SELECT Price * NEW.Quantity FROM Menu_Items WHERE Item_ID = NEW.Item_ID)
    WHERE Visit_ID = NEW.Visit_ID;
END;


