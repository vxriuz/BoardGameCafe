import "../styles/tables.css";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Tables from "../components/TableCard";
import CreateVisit from "../components/CreateVisit";
import TopList from "../components/TopList";

export default function TablesPage() {
  return (
    <div className="table-page">
      <h1 className="title">BOARDGAME CAFE</h1>

      <div className="layout">
        {/* LEFT: Tables */}
        <aside className="panel left">
          <div className="panelTitle">
          <Tables/>
          </div>
        </aside>

        {/* CENTER: Create */}
        <main className="panel center">
          <CreateVisit/>
        </main>

        {/* RIGHT: Toplist + Popular/Games */}
        <aside className="panel right">
          <TopList/>

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