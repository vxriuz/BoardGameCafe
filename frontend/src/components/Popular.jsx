import { useState } from "react";

export default function TopListGame() {
  const [gameStats, setGameStats] = useState([]);

  async function fetchPopular() {
    // Q3: Mest populära spelen
    // Förväntar sig: [{ Title: "Catan", Number_of_rentals: 5 }, ...]
    const res = await fetch("http://localhost:5000/api/popular");
    const data = await res.json();

    const sorted = [...data].sort((a, b) => b.Number_of_rentals - a.Number_of_rentals);

    setGameStats(sorted);
  }

  return (
    <>
      <div className="panelTitle">Popular Games</div>

      <button className="action-btn" onClick={fetchPopular}>Load Popular Games</button>

      <div className="tableList" style={{ marginTop: "12px" }}>
        {gameStats.map((game, index) => (
          <div key={game.Title} className="tableCard">
            <p>
              <span className="rank">#{index + 1}</span> {game.Title} — {game.Number_of_rentals} rentals
            </p>
          </div>
        ))}
      </div>
    </>
  );
}