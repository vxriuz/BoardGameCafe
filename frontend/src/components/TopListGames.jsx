import { useState } from "react";

export default function TopListGame() {
  const [gameList, setGameList] = useState([]);

  async function fetchAllGames() {
    // Q1: Visa tillgängliga spel med kategorier (GROUP_CONCAT)
    // Förväntar sig: [{ Title: "Catan", Categories: "Strategy, Family" }, ...]
    const res = await fetch("http://localhost:5000/api/allGames");
    const data = await res.json();
    console.log("Fetched data:", data);

    setGameList(data);
  }

  return (
    <>
      <div className="panelTitle">Categories</div>

      <button className="action-btn" onClick={fetchAllGames}>Load Games</button>

      <div className="tableList" style={{ marginTop: "12px" }}>
        {gameList.map((game) => (
          <div key={game.Title} className="tableCard">
            <p>
              {game.Title} — <em>{game.Categories}</em>
            </p>
          </div>
        ))}
      </div>
    </>
  );
}