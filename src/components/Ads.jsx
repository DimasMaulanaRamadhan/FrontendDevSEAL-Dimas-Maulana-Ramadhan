import React from "react";
import "./css/Ads.css";
import AdsImage from "../assets/Ads.png";

export default function Ads() {
  return (
    <div>
      <div className="educative-adventure-container">
        <div className="educative-adventure-content">
          <div className="educative-adventure-text">
            <h1 className="educative-adventure-title">
              Petualangan Edukatif bersama Malang Mbois City Tour!
            </h1>
            <p className="educative-adventure-description">
              Petualangan Edukatif bersama Malang Mbois City Tour!
            </p>
          </div>

          <div className="educative-adventure-image-wrapper">
            <img
              src={AdsImage}
              alt="Petualangan Edukatif"
              className="educative-image"
            />
          </div>
        </div>
      </div>
      <div className="carousel-dots">
        <span className="dot"></span>
        <span className="dot active"></span>
        <span className="dot"></span>
      </div>
    </div>
  );
}
