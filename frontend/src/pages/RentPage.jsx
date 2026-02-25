import TopListGame from "../components/TopListGames";
import "../styles/rent.css";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Popular from "../components/Popular.jsx"
import CreateRent from "../components/CreateRent.jsx"


export default function RentPage() {

  return (
    <div className="table-page">
      <h1 className="title">BOARDGAME RENT</h1>

      <div className="layout">
        {/* LEFT: Tables */}
        <aside className="panel left">
          <CreateRent/>
        </aside>

        {/* CENTER: Create */}
        <main className="panel center">
          <Popular />
        </main>

        {/* RIGHT: Toplist + Popular/Games */}
        <aside className="panel right">
          <TopListGame/>
        </aside>

        {/* BOTTOM: Buttons */}
        <footer className="bottomBar">
          <Link to={"/rent"} className="bottomBtn">RENT</Link>
          <Link to={"/"} className="bottomBtn">WAITER</Link>
          <Link to={"/bill"} className="bottomBtn">BILL</Link>
        </footer>
      </div>
    </div>
  );
}