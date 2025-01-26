import React, { useState } from "react";
import "./css/Komentar.css";
import profil1 from "../assets/profil1.svg";
import profil2 from "../assets/profil2.svg";
import profil3 from "../assets/profil3.svg";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const Komentar = () => {
  const [comment, setComment] = useState("");
  const [charCount, setCharCount] = useState(0);

  const handleCommentChange = (e) => {
    setComment(e.target.value);
    setCharCount(e.target.value.length);
  };

  return (
    <div className="container">
      <div className="comments-section">
        <h2 className="related-news-title">Komentar</h2>
        <div className="comment-form">
          <div className="comment-form-header">
            <img src={profil3} alt="Profile" className="comment-user-image" />
            <textarea
              placeholder="Apa yang ingin Anda tanyakan?"
              maxLength={500}
              className="comment-textarea"></textarea>
          </div>
          <div className="comment-form-footer">
            <span className="char-counter">0/50</span>
            <button className="btn-submit">Kirim</button>
          </div>
        </div>

        {/* Daftar Komentar */}
        <ul className="comments-list">
          <li className="comment-item">
            <div className="comment-user-details">
              <img src={profil1} alt="User" className="comment-user-avatar" />
              <div>
                <p className="comment-user-name">Pengguna 1</p>
                <p className="comment-date">28 Mar 2024 11:15</p>
              </div>
            </div>
            <div className="comment-text">
              Komentar Pengguna 1
            </div>
            <a href="#" className="comment-reply">
              Balas
            </a>
          </li>
          <li className="comment-item reply-item">
            <div className="comment-user-details">
              <img src={profil2} alt="User" className="comment-user-avatar" />
              <div>
                <p className="comment-user-name">Pengguna 2</p>
                <p className="comment-date">28 Mar 2024 11:15</p>
              </div>
            </div>
            <div className="comment-text">
              Komentar Pengguna 2
            </div>
            <a href="#" className="comment-reply">
              Balas
            </a>
          </li>
        </ul>
        {/* Pagination */}
        <div className="pagination-container">
          <div className="pagination-info">
            Item per page
            <select className="pagination-select">
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
            </select>
            of 200
          </div>
          <div className="pagination-controls">
            <button className="pagination-button prev" disabled>
              &lt;
            </button>
            <button className="pagination-number active">1</button>
            <button className="pagination-number">2</button>
            <button className="pagination-button next">&gt;</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Komentar;
