import { useState } from "react";

export default function TopListGame() {
  const [gameList, setGameList] = useState([]);

  async function fetchAllGames() {
    // Q1: Visa tillgängliga spel med kategorier
    // Förväntar sig: [{ Title: "Catan", Category_Name: "Strategy" }, ...]
    const res = await fetch("http://localhost:5000/api/allGames");
    const data = await res.json();
    console.log("Fetched data:", data);

    setGameList(data);
  }

  return (
    <>
      <div className="panelTitle">Available Games</div>

      <button className="action-btn" onClick={fetchAllGames}>Load Games</button>

      <div className="tableList" style={{ marginTop: "12px" }}>
        {gameList.map((game, index) => (
          <div key={game.Title + game.Category_Name} className="tableCard">
            <p>
              {game.Title} — <em>{game.Category_Name}</em>
            </p>
          </div>
        ))}
      </div>
    </>
  );
}