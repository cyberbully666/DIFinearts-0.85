import React, { useEffect, useState, useRef } from "react";
import "./AboutPage.css";
import aboutImage from "./assets/artworks/breed-culture.jpg";
import Footer from "./Footer"; // <-- import the Footer

function AboutPage() {
  const [show, setShow] = useState(false);
  const ghostRef = useRef(null);
  const bodyRef = useRef(null);

  useEffect(() => {
    setShow(true);
  }, []);

  // Dynamically adjust body top margin to keep overlap constant
  useEffect(() => {
    const adjustBodyMargin = () => {
      if (ghostRef.current && bodyRef.current) {
        const ghostHeight = ghostRef.current.offsetHeight;
        const overlapRatio = 0.15;
        bodyRef.current.style.marginTop = `${-ghostHeight * overlapRatio}px`;
      }
    };

    adjustBodyMargin();
    window.addEventListener("resize", adjustBodyMargin);
    return () => window.removeEventListener("resize", adjustBodyMargin);
  }, []);

  return (
    <>
      {/* HERO */}
      <section
        className="about-hero"
        style={{ backgroundImage: `url(${aboutImage})` }}
      >
        <div className="about-hero-overlay" />
      </section>

      {/* GHOST + BODY */}
      <section className="about-wrapper">
        <div ref={ghostRef} className="about-ghost-text">
          ABOUT DIFINEARTS
        </div>

        <div ref={bodyRef} className={`about-body ${show ? "fade-in" : ""}`}>
          <p className="about-body-text delay-1">
            DIFinearts was founded with a singular belief: that art belongs in
            lived spaces, not behind velvet ropes. We exist to integrate
            meaningful, original artworks into professional environments where
            culture is not announced — it is experienced.
          </p>

          <p className="about-body-text delay-2">
            Our practice is rooted in long-term thinking. We work closely with
            contemporary artists to present carefully curated bodies of work,
            allowing organisations to engage with art as an evolving presence
            rather than a static acquisition.
          </p>

          <p className="about-body-text delay-3">
            For corporations, DIFinearts offers more than visual enhancement.
            We provide a cultural framework — one that encourages dialogue,
            reflection, and a deeper relationship between space, people, and
            creative expression.
          </p>

          <p className="about-body-text delay-4">
            As we grow, our vision remains deliberate and uncompromised: to
            build enduring partnerships between artists and institutions, and
            to shape environments where art quietly but powerfully defines
            character, intent, and identity.
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <Footer />
    </>
  );
}

export default AboutPage;
