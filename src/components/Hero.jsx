import React, { useEffect, useState } from "react";
import axios from "axios";
import { createSlug } from "../utils/slugHelper";
import "./css/Hero.css";

export default function Hero({}) {
  const [mainNews, setMainNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMainNews = async () => {
      setLoading(true);
      try {
        const categories = ["bola"];

        const response = await Promise.all(
          categories.map((category) =>
            axios.get(
              `https://api-berita-indonesia.vercel.app/antara/${category}`
            )
          )
        );

        let newsList = [];
        response.forEach((res) => {
          newsList = [...newsList, ...res.data.data.posts];
        });

        const selectedNews = newsList[0];

        if (!selectedNews) {
          throw new Error("Berita utama tidak ditemukan.");
        }

        setMainNews(selectedNews);
      } catch (err) {
        setError("Gagal memuat berita utama. Silakan coba lagi.");
      } finally {
        setLoading(false);
      }
    };

    fetchMainNews();
  }, []);

  if (loading) {
    return <div className="text-center py-5">Memuat berita utama...</div>;
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
    <section className="hero">
      <div className="hero-container">
        <div className="hero-content">
          <p className="hero-tagline">Headline</p>
          <h1 className="hero-title">{mainNews?.title}</h1>
          <p className="hero-description">{mainNews?.description}</p>
          <p className="hero-date">
            <i className="fa fa-calendar"></i>{" "}
            {mainNews && new Date(mainNews.pubDate).toLocaleDateString()}
          </p>
          <a
            href={`/berita/${createSlug(mainNews.title)}`}
            className="hero-link">
            Baca Selengkapnya &rarr;
          </a>
        </div>
        <div className="hero-image-container">
          <img
            src={mainNews?.thumbnail}
            alt={mainNews?.title}
            className="hero-image"
          />
        </div>
      </div>
      <div className="pagination-hero">
        <span className="arrow">&lt;</span>
        <span className="current-page">1</span>
        <span className="separator">dari</span>
        <span className="total-pages">5</span>
        <span className="arrow">&gt;</span>
      </div>
    </section>
  );
}
