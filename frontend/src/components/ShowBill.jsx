import { useState } from "react";

export default function ShowBill() {
  const [selectedTable, setSelectedTable] = useState(null);
  const [billItems, setBillItems] = useState([]);
  const [total, setTotal] = useState(null);

  async function fetchBill() {
    if (!selectedTable) {
      alert("Select a table first");
      return;
    }

    // Q2: Visa notan — returnerar items + total
    const res = await fetch(
      `http://localhost:5000/api/bill/${selectedTable}`
    );

    const data = await res.json();

    // Förväntar sig: { items: [...], total: 250 }
    setBillItems(data.items);
    setTotal(data.total);
    setSelectedTable(null);
  }

  return (
    <>
      <div className="panelTitle">Show Bill</div>

      {/* TABLE BUTTONS */}
      <div className="btn-group" style={{ marginBottom: "10px" }}>
        {[1, 2, 3, 4, 5].map((table) => (
          <button
            key={table}
            onClick={() => setSelectedTable(table)}
            className={`select-btn${selectedTable === table ? " active" : ""}`}
          >
            Table {table}
          </button>
        ))}
      </div>

      <button className="action-btn" onClick={fetchBill}>Get Bill</button>

      {total !== null && (
        <div className="result-box">
          {billItems.map((item, i) => (
            <p key={i} style={{ margin: "4px 0", fontWeight: 400, fontSize: "0.9rem" }}>
              {item.Item_Name} x{item.Quantity} — {item.Line_Total} kr
            </p>
          ))}
          <hr style={{ border: "none", borderTop: "1px solid rgba(44,24,16,0.15)", margin: "8px 0" }} />
          <p>Total: {total} kr</p>
        </div>
      )}
    </>
  );
}