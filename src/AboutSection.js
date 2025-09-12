import React, { useEffect, useRef, useState } from "react";
import "./AboutSection.css";

function AboutSection() {
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
        <p className="about-text delay-1">
          At DIfinearts, we believe your workplace deserves more than bare walls. Based in New Delhi, we collaborate with some of today’s most exciting contemporary artists to bring original, captivating art into corporate spaces.
        </p>
        <p className="about-text delay-2">
          Our art consultants curate thoughtfully designed exhibitions that evolve every two months. Each collection is tailored to reflect your company’s culture, while introducing employees and visitors to a vibrant rotation of emerging and established talent.
        </p>
        <p className="about-text delay-3">
          This isn’t just decoration—it’s an experience. Every exhibition sparks curiosity, inspires new perspectives, and transforms everyday workspaces into environments of creativity and inspiration.
        </p>
      </div>
    </section>
  );
}

export default AboutSection;
