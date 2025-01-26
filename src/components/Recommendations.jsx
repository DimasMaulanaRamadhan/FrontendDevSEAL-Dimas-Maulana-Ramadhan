import React, { useEffect, useState } from "react";
import axios from "axios";
import { createSlug } from "../utils/slugHelper";
import "./css/Recommendations.css";
import { FaSearch } from "react-icons/fa";

export default function Recommendations() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const categoryMappings = {
    terbaru: "Terkini",
    politik: "Politik",
    hukum: "Hukum",
    ekonomi: "Ekonomi",
    bola: "Olahraga",
    olahraga: "Olahraga",
    humaniora: "Humaniora",
    lifestyle: "Gaya Hidup",
    hiburan: "Hiburan",
    dunia: "Internasional",
    tekno: "Teknologi",
    otomotif: "Otomotif",
  };

  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoading(true);
      try {
        const categories = Object.keys(categoryMappings);

        const response = await Promise.all(
          categories.map((category) =>
            axios.get(
              `https://api-berita-indonesia.vercel.app/antara/${category}`
            )
          )
        );

        let recommendationsList = [];
        response.forEach((res) => {
          const postsWithCategory = res.data.data.posts.map((post) => ({
            ...post,
            category: res.config.url.split("/").pop(), // Use the category from the URL
          }));
          recommendationsList = [...recommendationsList, ...postsWithCategory];
        });

        // Shuffle and take first 8 recommendations
        const shuffled = recommendationsList
          .sort(() => 0.5 - Math.random())
          .slice(0, 8);

        setRecommendations(shuffled);
      } catch (err) {
        console.error(err);
        setError("Gagal memuat rekomendasi berita. Silakan coba lagi.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  if (loading) {
    return <div className="text-center py-5">Memuat rekomendasi berita...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-5">
        <p>{error}</p>
        <button
          className="btn btn-primary mt-3"
          onClick={() => window.location.reload()}>
          Muat Ulang
        </button>
      </div>
    );
  }

  return (
    <div className="recommendations-container">
      <div className="title-bar-container">
        <h2 className="related-news-title">Rekomendasi Untuk Anda</h2>
        <div className="search-bar">
          <input type="text" placeholder="Cari disini..." />
          <span className="search-icon">
            <FaSearch />
          </span>
        </div>
      </div>
      <div className="related-news-grid">
        {recommendations.map((item, index) => {
          const categoryDisplay =
            categoryMappings[item.category.toLowerCase()] ||
            item.category.charAt(0).toUpperCase() + item.category.slice(1);

          return (
            <div className="related-news-item" key={index}>
              <a href={`/berita/${createSlug(item.title)}`}>
                <img
                  src={item.thumbnail}
                  alt={`Berita ${item.title}`}
                  className="related-news-image"
                />
                <h5 className="related-news-title-text">{item.title}</h5>
                <div className="items-recomendation d-flex align-items-center mb-2">
                  <span className="category-text-recomendation">
                    {categoryDisplay}
                  </span>
                  <span className="circle-dot-recomendation mx-2"></span>
                  <span className="card-text-recomendation text-secondary small mb-0">
                    {new Date(item.pubDate).toLocaleDateString()}
                  </span>
                </div>
              </a>
            </div>
          );
        })}
      </div>
      <div className="pagination-container">
        <div className="pagination-content">
          <div className="pagination-info">
            Menampilkan 1 hingga {recommendations.length} dari{" "}
            {recommendations.length} hasil
          </div>

          <div className="pagination">
            <span className="arrow">&larr; Previous</span>
            <span className="page-number active">1</span>
            <span className="page-number">2</span>
            <span className="page-number">...</span>
            <span className="page-number">8</span>
            <span className="page-number">9</span>
            <span className="arrow">Next &rarr;</span>
          </div>
        </div>
      </div>
    </div>
  );
}
