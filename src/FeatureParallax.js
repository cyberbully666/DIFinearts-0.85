import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./FeatureParallax.css";

import exploreArtistsImg from "./assets/artworks/explore-artists.jpg";
import breedCultureImg from "./assets/artworks/breed-culture.jpg";

const features = [
  { title: "Explore Artists", image: exploreArtistsImg, link: "/catalogue" },
  { title: "Breed Culture", image: breedCultureImg, link: "/about" },
];

function FeatureParallax() {
  const sectionRefs = useRef([]);
  const bgRefs = useRef([]);
  const positions = useRef([]);
  const [visible, setVisible] = useState([]);

  // Fade-in buttons on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.dataset.index);
            setVisible((prev) => {
              const newVisible = [...prev];
              newVisible[index] = true;
              return newVisible;
            });
          }
        });
      },
      { threshold: 0.3 }
    );

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  // Parallax effect
  useEffect(() => {
    features.forEach((_, i) => (positions.current[i] = 0));
    const lerp = (start, end, amt) => start + (end - start) * amt;
    let animationFrame;

    const updateParallax = () => {
      sectionRefs.current.forEach((ref, index) => {
        if (ref && bgRefs.current[index]) {
          const rect = ref.getBoundingClientRect();
          const cardHeight = rect.height;
          const windowHeight = window.innerHeight;

          const visiblePercent = Math.min(
            Math.max((windowHeight - rect.top) / (windowHeight + cardHeight), 0),
            1
          );

          const targetTranslate = (visiblePercent - 0.5) * 2 * 150;
          positions.current[index] = lerp(positions.current[index], targetTranslate, 0.1);

          bgRefs.current[index].style.transform = `translateY(${positions.current[index]}px) scale(1.5)`;
        }
      });
      animationFrame = requestAnimationFrame(updateParallax);
    };

    animationFrame = requestAnimationFrame(updateParallax);
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  return (
    <section className="feature-parallax">
      {features.map((feature, index) => (
        <div
          key={index}
          className="parallax-section"
          ref={(el) => (sectionRefs.current[index] = el)}
          data-index={index}
        >
          <div
            className="parallax-bg"
            ref={(el) => (bgRefs.current[index] = el)}
            style={{ backgroundImage: `url(${feature.image})` }}
          />
          <Link
            to={feature.link}
            className={`parallax-button ${visible[index] ? "visible" : ""}`}
          >
            {feature.title}
          </Link>
        </div>
      ))}
    </section>
  );
}

export default FeatureParallax;
