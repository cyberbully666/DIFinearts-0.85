import React, { useEffect, useRef, useState } from "react";
import "./AboutSection.css"; // 🔑 reuse same CSS for harmony

function OfficeArtText() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    const currentRef = sectionRef.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, []);

  return (
    <section
      className={`about-section ${isVisible ? "fade-in" : ""}`}
      ref={sectionRef}
    >
      <div className="about-container">
        <p className="about-heading delay-1">
          New art for your office every three months.
        </p>
        <p className="about-text delay-2">
          Refresh your workspace with art that changes every quarter,
          creating a welcoming and inspiring atmosphere.
        </p>
        <p className="about-text delay-3">
          Each new collection transforms your office into a cultural space,
          celebrating creativity and sparking conversation.
        </p>
        <p className="about-text delay-4">
          A unique way to keep your environment engaging, stimulating
          and always evolving.
        </p>
      </div>
    </section>
  );
}

export default OfficeArtText;
