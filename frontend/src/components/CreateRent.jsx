import { useState } from "react";

export default function CreateVisit() {
  const [selectedTable, setSelectedTable] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState(null);

  // Placeholder för framtida INSERT
  async function handleSend() {
    if (!selectedTable || !selectedStaff) {
      alert("Select table and staff first");
      return;
    }

    console.log("Sending visit:", {
      table_id: selectedTable,
      staff: selectedStaff,
    });

    // SENARE:
    // await fetch("http://localhost:5000/api/new-visit", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({
    //     table_id: selectedTable,
    //     staff: selectedStaff,
    //   }),
    // });

    alert("Visit sent (placeholder)");
    setSelectedTable(null);
    setSelectedStaff(null);
  }

  return (
    <>
      <div className="panelTitle">Rent Game</div>

      <div className="createBox">

        {/* TABLE BUTTONS */}
        <div>
          <p className="section-label">Select Table</p>
          <div className="btn-group">
            {[1, 2, 3, 4, 5].map((table) => (
              <button
                key={table}
                onClick={() => setSelectedTable(table)}
                className={`select-btn${selectedTable === table ? " active" : ""}`}
              >
                {table}
              </button>
            ))}
          </div>
        </div>

        {/* GAME BUTTONS */}
        <div>
          <p className="section-label">Select Game</p>
          <div className="btn-group">
            {["UNO", "CATAN", "MONOPOLY", "TICKET TO RIDE", "RISK"].map((name) => (
              <button
                key={name}
                onClick={() => setSelectedStaff(name)}
                className={`select-btn${selectedStaff === name ? " active" : ""}`}
              >
                {name}
              </button>
            ))}
          </div>
        </div>

        {/* SEND BUTTON */}
        <div style={{ marginTop: "12px" }}>
          <button className="action-btn" onClick={handleSend}>
            SEND
          </button>
        </div>

      </div>
    </>
  );
}