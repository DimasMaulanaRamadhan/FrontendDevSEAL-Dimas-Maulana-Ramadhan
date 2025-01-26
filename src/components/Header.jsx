import React, { useEffect, useState } from "react";
import "./css/Header.css";
import logo1 from "../assets/logo.png";
import logo2 from "../assets/logo2.png";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  const handleScroll = () => {
    if (window.scrollY > 50) {
      // Ganti 50 dengan nilai scroll yang diinginkan
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className={`header ${isScrolled ? "header-scrolled" : ""}`}>
      <div className="container flex items-center justify-between">
        <div className="text-kiri-container flex items-center justify-start gap-4">
          <img src={isScrolled ? logo2 : logo1} alt="Logo" className="text-kiri-image" />
          <span className="text-kiri font-bold">Berita Kini</span>
        </div>
        <nav className="text-list">
          <a href="#" className="text-kanan font-semibold">
            Beranda
          </a>
          <a href="#" className="text-kanan">
            Kesehatan
          </a>
          <a href="#" className="text-kanan">
            Otomotif
          </a>
          <a href="#" className="text-kanan">
            Politik
          </a>
          <a href="#" className="text-kanan">
            Olahraga
          </a>
          <a href="#" className="text-kanan">
            Nasional
          </a>
          <a href="#" className="text-kanan">
            Internasional
          </a>
        </nav>
      </div>
    </div>
  );
}
