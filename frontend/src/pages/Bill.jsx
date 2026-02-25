import ShowBill from "../components/ShowBill";
import Tables from "../components/TableCard";
import AddOrder from "../components/AddOrder";
import "../styles/tables.css";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

export default function BillPage() {
  return (
    <div className="table-page">
      <h1 className="title">BOARDGAME BILL</h1>

      <div className="layout">
        {/* LEFT: Tables */}
        <aside className="panel left">
          <Tables/>
        </aside>

        {/* CENTER: Create */}
        <main className="panel center">
          <ShowBill />
        </main>

        {/* RIGHT: Toplist + Popular/Games */}
        <aside className="panel right">
            <AddOrder />
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