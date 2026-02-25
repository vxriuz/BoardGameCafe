import "./App.css";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import RentPage from "./pages/RentPage.jsx";
import TablesPage from "./pages/TablesPage.jsx";
import BillPage from "./pages/Bill.jsx"

export default function App() {
  return (
    <BrowserRouter>
      <div className="root">
        <div className="content">
          <Routes>
            <Route path="/" element={<TablesPage />} />
            <Route path="/rent" element={<RentPage />} />
            <Route path="/bill" element={<BillPage/>}/>
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}