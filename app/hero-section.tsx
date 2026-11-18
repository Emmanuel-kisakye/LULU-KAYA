"use client";

import Image from "next/image";
import { useState } from "react";
import { shouldUseStaticHero } from "./hero-navigation-state";
import ShopModeLink from "./shop/shop-mode-link";

export default function HeroSection() {
  const [isStaticReturn] = useState(shouldUseStaticHero);
  const [videoEnded, setVideoEnded] = useState(isStaticReturn);
  const [videoError, setVideoError] = useState(false);

  return (
    <section
      className={`hero${videoEnded ? " hero-ended" : ""}${videoError ? " hero-video-error" : ""}${isStaticReturn ? " hero-static" : ""}`}
      id="home"
      aria-labelledby="hero-title"
    >
      <div className="hero-image">
        {!isStaticReturn && (
          <video
            className="hero-video"
            src="/reference/img/HeroVid.mp4"
            autoPlay
            muted
            playsInline
            preload="auto"
            poster="/reference/img/Heroimg.jpg"
            onEnded={() => setVideoEnded(true)}
            onError={() => {
              setVideoError(true);
              setVideoEnded(true);
            }}
            aria-hidden="true"
            tabIndex={-1}
          />
        )}
        <Image
          className="hero-poster"
          src="/reference/img/Heroimg.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          aria-hidden="true"
        />
      </div>
      <div className="hero-inner">
        <div
          className={`hero-copy${videoEnded ? " hero-copy-visible" : ""}`}
          aria-hidden={!videoEnded}
        >
          <p className="eyebrow">Where Beauty Finds Refuge · Bukoto, Kampala</p>
          <h1 id="hero-title">
            Perfume oils from <br /><span>UGX 5,000.</span>
          </h1>
          <p className="hero-description">
            Over 250 scents in seven sizes. <br />
            Pick up in Bukoto, or get it delivered.
          </p>
          <div className="hero-choices">
            <ShopModeLink className="hero-cta" mode="retail">
              <b>Shop now</b><span>Buy for yourself or gift someone</span>
            </ShopModeLink>
            <ShopModeLink className="hero-cta" mode="wholesale">
              <b>Wholesale</b><span>Buy the dozen and do resell</span>
            </ShopModeLink>
          </div>
        </div>
      </div>
    </section>
  );
}
