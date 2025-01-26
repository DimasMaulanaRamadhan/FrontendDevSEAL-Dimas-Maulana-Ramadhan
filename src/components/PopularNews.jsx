import React, { useEffect, useState } from "react";
import axios from "axios";
import { createSlug } from "../utils/slugHelper";
import "./css/PopularDetail.css";

export default function PopularNews() {
  const [popularNews, setPopularNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPopularNews = async () => {
      setLoading(true);
      try {
        const categories = ["hiburan"];

        const response = await Promise.all(
          categories.map((category) =>
            axios.get(
              `https://api-berita-indonesia.vercel.app/antara/${category}`
            )
          )
        );

        let newsList = [];
        response.forEach((res) => {
          const postsWithCategory = res.data.data.posts.map((post) => ({
            ...post,
            category: res.config.url.split("/").pop(),
          }));
          newsList = [...newsList, ...postsWithCategory];
        });

        setPopularNews(newsList.slice(0, 3));
      } catch (err) {
        console.error(err);
        setError("Gagal memuat berita terpopuler. Silakan coba lagi.");
      } finally {
        setLoading(false);
      }
    };

    fetchPopularNews();
  }, []);

  if (loading) {
    return (
      <div className="pnews-loading text-center py-5">
        Loading popular news...
      </div>
    );
  }

  if (error) {
    return (
      <div className="pnews-error text-center py-5">
        <p>{error}</p>
        <button
          className="pnews-btn btn btn-primary mt-3"
          onClick={() => window.location.reload()}>
          Muat Ulang
        </button>
      </div>
    );
  }

  return (
    <div className="pnews-layout">
      <section className="pnews-sidebar">
        <h2 className="pnews-section-title fs-4 fw-bold">Berita Terpopuler</h2>
        <div className="pnews-list">
          {popularNews.map((news, index) => (
            <div className="pnews-item" key={index}>
              <a
                href={`/berita/${createSlug(news.title)}`}
                className="pnews-card text-decoration-none">
                <div className="pnews-card-body d-flex">
                  <div className="pnews-index">{index + 1}</div>
                  {news.thumbnail && (
                    <img
                      src={news.thumbnail}
                      className="pnews-img"
                      alt={news.title}
                    />
                  )}
                  <div className="pnews-content">
                    <h5 className="pnews-title">{news.title}</h5>
                    <div className="pnews-meta d-flex align-items-center">
                      <span className="pnews-category">
                        {news.category.charAt(0).toUpperCase() +
                          news.category.slice(1)}
                      </span>
                      <span className="pnews-dot mx-2"></span>
                      <p className="pnews-date text-secondary small mb-0">
                        {new Date(news.pubDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </a>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
