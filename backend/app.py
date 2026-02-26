from flask import Flask, jsonify, request
from flask_cors import CORS
from db import get_db

app = Flask(__name__)
CORS(app)


@app.route("/")
def home():
    return "BoardGameCafe API"


# Q5: Visa lediga bord just nu (subquery)
# "Kund kommer in — vilka bord är tillgängliga?"
@app.route("/api/tables")
def get_tables():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("""
        SELECT Cafe_Tables.Table_ID, Cafe_Tables.Seat_Count
        FROM Cafe_Tables
        WHERE Cafe_Tables.Table_ID NOT IN (
            SELECT Visits.Table_ID FROM Visits WHERE Visits.End_Time IS NULL
        )
    """)
    tables = cursor.fetchall()
    cursor.close()
    db.close()
    return jsonify(tables)


# GET /api/tables/all — Alla bord med aktiv nota (om det finns)
@app.route("/api/tables/all")
def get_all_tables():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("""
        SELECT Cafe_Tables.Table_ID, Cafe_Tables.Seat_Count, Visits.Total_Bill, Visits.Visit_ID
        FROM Cafe_Tables
        LEFT JOIN Visits ON Cafe_Tables.Table_ID = Visits.Table_ID AND Visits.End_Time IS NULL
        ORDER BY Cafe_Tables.Table_ID
    """)
    tables = cursor.fetchall()
    cursor.close()
    db.close()
    return jsonify(tables)


# Q4: Intäkt per anställd (JOIN + GROUP BY + aggregation + multirelation)
# "Ägaren vill se vilken personal som genererar mest intäkter"
@app.route("/api/toplist")
def get_toplist():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("""
        SELECT Staff.Full_Name, SUM(Visits.Total_Bill) AS totalSold
        FROM Visits
        JOIN Staff ON Visits.Staff_ID = Staff.Staff_ID
        GROUP BY Staff.Full_Name
        ORDER BY totalSold DESC
    """)
    result = cursor.fetchall()
    cursor.close()
    db.close()
    return jsonify(result)


# Q3: Mest populära spelen (JOIN + GROUP BY + aggregation)
# "Ägaren vill veta vilka spel som hyrs mest"
@app.route("/api/popular")
def get_popular():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("""
        SELECT Games.Title, COUNT(*) AS Number_of_rentals
        FROM Games
        JOIN Rentals ON Games.Game_ID = Rentals.Game_ID
        GROUP BY Games.Title
        ORDER BY Number_of_rentals DESC
    """)
    result = cursor.fetchall()
    cursor.close()
    db.close()
    return jsonify(result)


# Q1: Visa tillgängliga spel med deras kategorier (JOIN + multirelation)
# "En kund vill välja ett spel att hyra"
@app.route("/api/allGames")
def get_all_games():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("""
        SELECT Games.Title, GROUP_CONCAT(Categories.Category_Name SEPARATOR ', ') AS Categories
        FROM Games
        JOIN Game_Category_Link ON Games.Game_ID = Game_Category_Link.Game_ID
        JOIN Categories ON Game_Category_Link.Category_ID = Categories.Category_ID
        WHERE Games.Status = 'Available'
        GROUP BY Games.Title
    """)
    result = cursor.fetchall()
    cursor.close()
    db.close()
    return jsonify(result)




# Q2: Visa notan för ett besök (JOIN + aggregation + multirelation)
# "Kunden vill betala — visa allt de beställt och totalpris"
@app.route("/api/bill/<int:table_id>")
def get_bill(table_id):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("""
        SELECT Visits.Visit_ID,
               Menu_Items.Item_Name,
               Menu_Items.Price,
               Orders.Quantity,
               (Orders.Quantity * Menu_Items.Price) AS Line_Total
        FROM Visits
        JOIN Orders ON Visits.Visit_ID = Orders.Visit_ID
        JOIN Menu_Items ON Orders.Item_ID = Menu_Items.Item_ID
        WHERE Visits.Table_ID = %s AND Visits.End_Time IS NULL
        ORDER BY Visits.Visit_ID
    """, (table_id,))
    rows = cursor.fetchall()
    total = sum(float(row["Line_Total"]) for row in rows)
    cursor.close()
    db.close()
    return jsonify({"items": rows, "total": total})


# Hämta all personal
@app.route("/api/staff")
def get_staff():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("""
        SELECT Staff.Staff_ID, Staff.Full_Name, Staff.Role
        FROM Staff
    """)
    result = cursor.fetchall()
    cursor.close()
    db.close()
    return jsonify(result)


# PROCEDURE: Starta nytt besök
@app.route("/api/new-visit", methods=["POST"])
def new_visit():
    data = request.json
    table_id = data.get("table_id")
    staff_id = data.get("staff_id")

    db = get_db()
    cursor = db.cursor()
    cursor.callproc("newVisit", [table_id, staff_id])
    db.commit()
    cursor.close()
    db.close()
    return jsonify({"message": "Visit created"}), 201


# Hämta alla menyartiklar
@app.route("/api/menu")
def get_menu():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("""
        SELECT Menu_Items.Item_ID, Menu_Items.Item_Name, Menu_Items.Price, Menu_Items.Type
        FROM Menu_Items
        ORDER BY Menu_Items.Type, Menu_Items.Item_Name
    """)
    result = cursor.fetchall()
    cursor.close()
    db.close()
    return jsonify(result)


# PROCEDURE: Skapa Order
@app.route("/api/new-order", methods=["POST"])
def new_order():
    data = request.json
    visit_id = data.get("visit_id")
    item_id = data.get("item_id")
    quantity = data.get("quantity", 1)

    db = get_db()
    cursor = db.cursor()
    cursor.callproc("newOrder", [visit_id, item_id, quantity])
    db.commit()
    cursor.close()
    db.close()
    return jsonify({"message": "Order added"}), 201


# Hämta tillgängliga spel (för rental-dropdown)
@app.route("/api/available-games")
def get_available_games():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("""
        SELECT Games.Game_ID, Games.Title
        FROM Games
        WHERE Games.Status = 'Available'
        ORDER BY Games.Title
    """)
    result = cursor.fetchall()
    cursor.close()
    db.close()
    return jsonify(result)


# PROCEDURE: Skapa Rental
@app.route("/api/new-rental", methods=["POST"])
def new_rental():
    data = request.json
    visit_id = data.get("visit_id")
    game_id = data.get("game_id")

    db = get_db()
    cursor = db.cursor()
    cursor.callproc("newRental", [visit_id, game_id])
    db.commit()
    cursor.close()
    db.close()
    return jsonify({"message": "Rental created"}), 201


if __name__ == "__main__":
    app.run(debug=True)
