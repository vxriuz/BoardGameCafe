import { useState } from "react";

export default function Tables() {
  const [tables, setTables] = useState([]);

  // Hämta alla bord med aktiv nota
  async function fetchTables() {
    const res = await fetch("http://localhost:5000/api/tables/all");
    const data = await res.json();

    // Förväntar sig: [{ Table_ID: 1, Seat_Count: 4, Total_Bill: 35, Visit_ID: 2 }, ...]
    setTables(data);
  }

  return (
    <>
      <div className="tableList">
        <button onClick={fetchTables} className="button-fetch">Fetch tables</button>
        {tables.map((t) => (
          <div className="tableCard" key={t.Table_ID}>
            <p>
              Table {t.Table_ID} ({t.Seat_Count} platser) {t.Total_Bill ? `— ${t.Total_Bill} kr` : "— Ledigt"}
            </p>
          </div>
        ))}
      </div>
    </>
  );
}