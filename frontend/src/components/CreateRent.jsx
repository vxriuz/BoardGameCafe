import { useState, useEffect } from "react";

export default function CreateRent() {
  const [tables, setTables] = useState([]);
  const [games, setGames] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [selectedGame, setSelectedGame] = useState(null);
  const [message, setMessage] = useState("");

  // Hämta upptagna bord (de med aktiv Visit_ID)
  useEffect(() => {
    fetch("http://localhost:5000/api/tables/all")
      .then((res) => res.json())
      .then((data) => {
        const occupied = data.filter((t) => t.Visit_ID !== null);
        setTables(occupied);
      });
  }, []);

  // Hämta tillgängliga spel
  const fetchGames = () => {
    fetch("http://localhost:5000/api/available-games")
      .then((res) => res.json())
      .then((data) => setGames(data));
  };

  // 2. Kalla på funktionen när komponenten laddas första gången
  useEffect(() => {
    fetchGames();
  }, []);

  async function handleSend() {
    if (!selectedTable || !selectedGame) {
      alert("Välj bord och spel först");
      return;
    }

    const res = await fetch("http://localhost:5000/api/new-rental", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        visit_id: selectedTable.Visit_ID,
        game_id: selectedGame.Game_ID,
      }),
    });

    if (res.ok) {
      setMessage(`${selectedGame.Title} → Bord ${selectedTable.Table_ID}`);
      setSelectedGame(null);
      fetchGames();
    } else {
      setMessage("Något gick fel!");
    }
  }

  return (
    <>
      <div className="panelTitle">Hyr spel</div>

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

        {/* VÄLJ SPEL — från databasen */}
        <div>
          <p className="section-label">Välj spel</p>
          <div className="btn-group">
            {games.map((g) => (
              <button
                key={g.Game_ID}
                onClick={() => setSelectedGame(g)}
                className={`select-btn${
                  selectedGame?.Game_ID === g.Game_ID ? " active" : ""
                }`}
              >
                {g.Title}
              </button>
            ))}
          </div>
        </div>

        {/* SKICKA */}
        <div style={{ marginTop: "12px" }}>
          <button className="action-btn" onClick={handleSend}>
            HYR SPEL
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