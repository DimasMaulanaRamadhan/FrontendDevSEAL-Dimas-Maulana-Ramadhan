import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import "./index.css";
import Home from "./components/Home"; // Halaman utama
import NewsDetail from "./components/NewsDetail"; // Halaman detail berita

export default function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/berita/:slug" element={<NewsDetail />} />
        </Routes>
      </div>
    </Router>
  );
}
