import { useState, useEffect } from "react";

export default function AddOrder() {
  const [tables, setTables] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");

  // Hämta upptagna bord (de med en aktiv Visit_ID)
  useEffect(() => {
    fetch("http://localhost:5000/api/tables/all")
      .then((res) => res.json())
      .then((data) => {
        const occupied = data.filter((t) => t.Visit_ID !== null);
        setTables(occupied);
      });
  }, []);

  // Hämta menyartiklar
  useEffect(() => {
    fetch("http://localhost:5000/api/menu")
      .then((res) => res.json())
      .then((data) => setMenuItems(data));
  }, []);

  async function handleSend() {
    if (!selectedTable || !selectedItem) {
      alert("Välj bord och artikel först");
      return;
    }

    const res = await fetch("http://localhost:5000/api/new-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        visit_id: selectedTable.Visit_ID,
        item_id: selectedItem.Item_ID,
        quantity: quantity,
      }),
    });

    if (res.ok) {
      setMessage(
        `${quantity}x ${selectedItem.Item_Name} → Bord ${selectedTable.Table_ID}`
      );
      setSelectedItem(null);
      setQuantity(1);
    } else {
      setMessage("Något gick fel!");
    }
  }

  return (
    <>
      <div className="panelTitle">Lägg till beställning</div>

      <div className="createBox">
        {/* VÄLJ BORD — bara upptagna bord */}
        <div>
          <p className="section-label">Välj bord</p>
          <div className="btn-group">
            {tables.length === 0 && (
              <span style={{ color: "#a88b6a" }}>Inga aktiva besök</span>
            )}
            {tables.map((t) => (
              <button
                key={t.Table_ID}
                onClick={() => setSelectedTable(t)}
                className={`select-btn${
                  selectedTable?.Table_ID === t.Table_ID ? " active" : ""
                }`}
              >
                Bord {t.Table_ID}
              </button>
            ))}
          </div>
        </div>

        {/* VÄLJ MENYARTIKEL */}
        <div>
          <p className="section-label">Välj artikel</p>
          <div className="btn-group">
            {menuItems.map((item) => (
              <button
                key={item.Item_ID}
                onClick={() => setSelectedItem(item)}
                className={`select-btn${
                  selectedItem?.Item_ID === item.Item_ID ? " active" : ""
                }`}
              >
                {item.Item_Name} ({item.Price} kr)
              </button>
            ))}
          </div>
        </div>

        {/* VÄLJ ANTAL */}
        <div>
          <p className="section-label">Antal</p>
          <div className="btn-group">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                onClick={() => setQuantity(n)}
                className={`select-btn${quantity === n ? " active" : ""}`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* SKICKA */}
        <div style={{ marginTop: "12px" }}>
          <button className="action-btn" onClick={handleSend}>
            SKICKA ORDER
          </button>
        </div>

        {/* BEKRÄFTELSE */}
        {message && (
          <div className="result-box" style={{ marginTop: "10px" }}>
            ✓ {message}
          </div>
        )}
      </div>
    </>
  );
}