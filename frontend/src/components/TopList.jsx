import { useState } from "react";

export default function TopList() {
  const [staffStats, setStaffStats] = useState([]);

  async function fetchTopList() {
    // Q4: Intäkt per anställd
    // Förväntar sig: [{ Full_Name: "Erik Nilsson", totalSold: 905 }, ...]
    const res = await fetch("http://localhost:5000/api/toplist");
    const data = await res.json();

    const sorted = [...data].sort((a, b) => b.totalSold - a.totalSold);

    setStaffStats(sorted);
  }

  return (
    <>
      <div className="panelTitle">Toplist</div>

      <button className="action-btn" onClick={fetchTopList}>Load Toplist</button>

      <div className="tableList" style={{ marginTop: "12px" }}>
        {staffStats.map((staff, index) => (
          <div key={staff.Full_Name} className="tableCard">
            <p>
              <span className="rank">#{index + 1}</span> {staff.Full_Name} — {staff.totalSold} kr
            </p>
          </div>
        ))}
      </div>
    </>
  );
}