import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import Komentar from "./Komentar";
import axios from "axios";
import { load } from "cheerio";
import "./css/NewsDetail.css";
import "./css/PopularNews.css";
import { FaChevronRight, FaHouseUser } from "react-icons/fa";

const createSlug = (title) =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export default function NewsDetail() {
  const { slug } = useParams();
  const [error, setError] = useState(null);
  const [newsDetail, setNewsDetail] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loadingNews, setLoadingNews] = useState(true);
  const [loadingRecommendations, setLoadingRecommendations] = useState(true);

  const categoriesList = [
    "terbaru",
    "politik",
    "hukum",
    "ekonomi",
    "bola",
    "olahraga",
    "humaniora",
    "lifestyle",
    "hiburan",
    "dunia",
    "tekno",
    "otomotif",
  ];

  // Fetch News Detail
  useEffect(() => {
    const fetchNewsDetail = async () => {
      setLoadingNews(true);
      try {
        // Fetch ALL news from all categories
        const responses = await Promise.allSettled(
          categoriesList.map((category) =>
            axios.get(
              `https://api-berita-indonesia.vercel.app/antara/${category}`
            )
          )
        );

        let newsList = [];
        responses.forEach((response) => {
          if (
            response.status === "fulfilled" &&
            response.value?.data?.data?.posts
          ) {
            newsList = [
              ...newsList,
              ...response.value.data.data.posts.map((post) => ({
                ...post,
                fullSlug: createSlug(post.title),
              })),
            ];
          }
        });

        const selectedNews = newsList.find(
          (news) => createSlug(news.title) === slug
        );

        if (!selectedNews) {
          throw new Error("Berita tidak ditemukan.");
        }

        const htmlResponse = await axios.get(
          `https://api.allorigins.win/raw?url=${selectedNews.link}`
        );

        const html = htmlResponse.data;
        const $ = load(html);

        // Remove ad elements
        $("script:contains('adsbygoogle')").remove();
        $(
          ".adsbygoogle, [id*='google_ads'], [class*='ads'], [data-ad-client]"
        ).remove();

        const title = $("h1.post-title").text().trim() || selectedNews.title;
        const pubDate =
          $("meta[property='article:published_time']").attr("content") ||
          selectedNews.pubDate ||
          "Tanggal tidak ditemukan";

        const thumbnail =
          $("div.post-content img").first().attr("src") ||
          selectedNews.thumbnail ||
          "https://via.placeholder.com/600x400?text=Gambar+tidak+tersedia";

        const contentDiv = $("div.post-content");
        const rawContent = [];
        const category = selectedNews.category || "Terbaru";
        const caption =
          $("div.post-content img").first().attr("alt") ||
          selectedNews.title ||
          "Gambar tidak tersedia";

        if (contentDiv.length > 0) {
          contentDiv.children("p, span, h2").each((_, element) => {
            const text = $(element).text().trim();
            if (text) rawContent.push(text);
          });
        } else {
          rawContent.push(
            "Konten tidak ditemukan. Pastikan struktur halaman sesuai."
          );
        }

        setNewsDetail({
          title,
          pubDate,
          thumbnail,
          content: rawContent,
          category,
          caption,
        });
      } catch (err) {
        setError("Gagal memuat detail berita.");
        console.error(err);
      } finally {
        setLoadingNews(false);
      }
    };

    fetchNewsDetail();
  }, [slug]);

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

  // Fetch Recommendations
  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoadingRecommendations(true);
      try {
        const categories = Object.keys(categoryMappings);

        const responses = await Promise.all(
          categories.map((category) =>
            axios.get(
              `https://api-berita-indonesia.vercel.app/antara/${category}`
            )
          )
        );

        let recommendationsList = [];
        responses.forEach((res) => {
          if (res.data?.data?.posts) {
            recommendationsList = [
              ...recommendationsList,
              ...res.data.data.posts,
            ];
          }
        });

        // Shuffle and take first 8 recommendations
        const shuffled = recommendationsList
          .sort(() => 0.5 - Math.random())
          .slice(0, 3);

        setRecommendations(shuffled);
      } catch (err) {
        console.error(err);
        setError("Gagal memuat rekomendasi berita.");
      } finally {
        setLoadingRecommendations(false);
      }
    };

    fetchRecommendations();
  }, []);

  if (loadingNews || loadingRecommendations) {
    return <div className="text-center py-5">Memuat data...</div>;
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
    <div>
      <Header />
      <div className="listatas mb-4">
        <nav aria-label="breadcrumb">
          <ul className="breadcrumb d-flex align-items-center m-0 p-0 list-unstyled">
            <li className="d-flex align-items-center">
              <FaHouseUser className="mx-2 text-secondary" />
              <a href="/" className="pisah text-decoration-none text-secondary">
                Beranda
              </a>
              <FaChevronRight className="mx-2 text-secondary" />
            </li>
            <li className="d-flex align-items-center">
              <a href="/berita" className="text-decoration-none text-secondary">
                Berita
              </a>
              <FaChevronRight className="mx-2 text-secondary" />
            </li>
            <li className="active text-secondary">Detail</li>
          </ul>
        </nav>
      </div>
      <div className="news-detail-layout">
        <main className="news-detail-main">
          <div className="news-article">
            <h1 className="news-title">{newsDetail.title}</h1>
            <p className="news-meta">
              <span className="news-category">{newsDetail.category}</span>
              <span className="circle-dot-recomendation mx-2"></span>
              <span className="news-pubDate">
                {new Date(newsDetail.pubDate).toLocaleString()}
              </span>
            </p>
            <figure>
              <img
                src={newsDetail.thumbnail}
                alt={newsDetail.title}
                className="news-thumbnail"
              />
              <figcaption className="news-caption">
                {newsDetail.caption}
              </figcaption>
            </figure>
            <div className="news-content">
              {newsDetail.content.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
          <aside className="news-sidebar">
            <h2 className="related-news-title">Berita Terpopuler</h2>
            <div className="popular-news">
              {recommendations.map((item, index) => (
                <div className="popular-news-item" key={index}>
                  <a
                    href={`/berita/${createSlug(item.title)}`}
                    className="card h-90 text-decoration-none">
                    <div className="d-flex">
                      <div className="popular-news-index">{index + 1}</div>
                      {item.thumbnail && (
                        <img
                          src={item.thumbnail}
                          className="card-img-left"
                          alt={item.title}
                        />
                      )}
                      <div className="news-content">
                        <h5 className="card-title">{item.title}</h5>
                        <div className="items d-flex align-items-center mb-2">
                          <span className="category-text">
                            {categoryMappings[item.category] || "Terbaru"}
                          </span>
                          <span className="circle-dot mx-2"></span>
                          <p className="card-text text-secondary small mb-0">
                            {new Date(item.pubDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </a>
                </div>
              ))}
            </div>
          </aside>
        </main>
      </div>
      <Komentar />
      <div className="recommendations-container">
        <div className="top-content">
          <h2 className="related-news-title">Berita Terkait</h2>
          <div className="lihat-semua d-flex align-items-center justify-content-center">
            <span>Lihat Semua</span>
          </div>
        </div>
        <div className="related-news-grid">
          {recommendations.map((item, index) => (
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
                    {categoryMappings[item.category] || "Terbaru"}
                  </span>
                  <span className="circle-dot-recomendation mx-2"></span>
                  <span className="card-text-recomendation text-secondary small mb-0">
                    {new Date(item.pubDate).toLocaleDateString()}
                  </span>
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
