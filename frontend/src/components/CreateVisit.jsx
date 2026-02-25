import { useState, useEffect } from "react";

export default function CreateVisit() {
  const [selectedTable, setSelectedTable] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [staffList, setStaffList] = useState([]);

  // Hämta personal från databasen
  useEffect(() => {
    async function fetchStaff() {
      const res = await fetch("http://localhost:5000/api/staff");
      const data = await res.json();
      setStaffList(data);
    }
    fetchStaff();
  }, []);

  // Anropa proceduren newVisit via backend
  async function handleSend() {
    if (!selectedTable || !selectedStaff) {
      alert("Select table and staff first");
      return;
    }

    const res = await fetch("http://localhost:5000/api/new-visit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        table_id: selectedTable,
        staff_id: selectedStaff,
      }),
    });

    if (res.ok) {
      alert("Visit created!");
    } else {
      alert("Something went wrong");
    }
    setSelectedTable(null);
    setSelectedStaff(null);
  }

  return (
    <>
      <div className="panelTitle">Create Visit</div>

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
                Table {table}
              </button>
            ))}
          </div>
        </div>

        {/* STAFF BUTTONS — hämtas från databasen */}
        <div>
          <p className="section-label">Select Staff</p>
          <div className="btn-group">
            {staffList.map((staff) => (
              <button
                key={staff.Staff_ID}
                onClick={() => setSelectedStaff(staff.Staff_ID)}
                className={`select-btn${selectedStaff === staff.Staff_ID ? " active" : ""}`}
              >
                {staff.Full_Name}
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