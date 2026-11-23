import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import artists from "../artists";
import "./HomePage.css";

const EMAIL = "difinearts.official@gmail.com";
const curatorMail = `mailto:${EMAIL}?subject=${encodeURIComponent(
  "Art for our office"
)}&body=${encodeURIComponent(
  "Hello DIFinearts,\n\nWe'd like to talk about art for our office.\n\nCompany:\nCity:\nApproximate office size:\nPhone:\n"
)}`;

// Width ÷ height of each artist's cover image, so the wall hangs them
// at their true proportions.
const COVER_RATIO = {
  "Renuka Sondhi": 1.5,
  "Alka Jhamb": 1.04,
  "Satish Sharma": 0.51,
  "Anandamoy Banerji": 0.58,
  "Rajshree Pawar": 1.42,
  "Vazda Khan": 1.01,
  "Simmi Khanna": 0.82,
  "Nivedita Pande": 1.02,
  "Madan Lal": 0.75,
  "RP Verma": 0.9,
};

// Works that rotate on the hero wall, in this order.
const HERO_ARTISTS = ["Madan Lal", "RP Verma", "Vazda Khan", "Simmi Khanna"];

const STEPS = [
  {
    title: "Tell us about your space",
    text: "Share a little about your office, your team and the feeling you want the space to have.",
  },
  {
    title: "We curate a selection",
    text: "Our art consultants choose original works from our artists to suit your walls and your culture.",
  },
  {
    title: "Your exhibition goes up",
    text: "Employees and visitors walk into a workplace with real art in it, not prints.",
  },
  {
    title: "It changes every two months",
    text: "A new exhibition arrives, so the space keeps surprising the people who use it every day.",
  },
];

const REASONS = [
  {
    title: "A place people want to be",
    text: "Original art makes an office feel considered and alive, for your team and for every visitor.",
  },
  {
    title: "Something new to talk about",
    text: "Each exhibition sparks conversation and introduces people to artists they would not otherwise meet.",
  },
  {
    title: "Your culture, on the walls",
    text: "Every collection is chosen to reflect who you are as a company, and it evolves as you do.",
  },
];

function useHeroRotation(count, delay) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce || count < 2) return undefined;
    const id = setInterval(() => setIndex((i) => (i + 1) % count), delay);
    return () => clearInterval(id);
  }, [count, delay]);
  return index;
}

export default function HomePage() {
  const heroWorks = HERO_ARTISTS.map((name) => artists.find((a) => a.name === name)).filter(Boolean);
  const heroIndex = useHeroRotation(heroWorks.length, 6500);
  const hero = heroWorks[heroIndex];

  return (
    <main className="df-home">
      {/* ---------- Hero ---------- */}
      <section className="df-hero">
        <div className="df-hero-text">
          <h1>Original Indian art for the places you work.</h1>
          <p className="df-hero-lead">
            DIFinearts curates exhibitions of contemporary art for offices, and changes them every
            two months. Rent a collection for your workspace, or buy the pieces you can't part with.
          </p>
          <div className="df-hero-actions">
            <Link className="df-btn" to="/catalogue">
              Explore the collection
            </Link>
            <a className="df-btn df-btn-quiet" href={curatorMail}>
              Talk to a curator
            </a>
          </div>
        </div>

        <div className="df-hero-wall" aria-live="polite">
          {hero && (
            <figure key={hero.name} className="df-hung">
              <img src={hero.cover} alt={`Painting by ${hero.name}`} />
              <figcaption className="df-label">
                <strong>{hero.name}</strong>
                <span>From the DIFinearts collection</span>
              </figcaption>
            </figure>
          )}
          {heroWorks.length > 1 && (
            <div className="df-hero-dots" aria-hidden="true">
              {heroWorks.map((w, i) => (
                <span key={w.name} className={i === heroIndex ? "on" : ""} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ---------- How it works ---------- */}
      <section className="df-section" id="how-it-works">
        <div className="df-section-head">
          <h2>How it works for companies</h2>
          <p>
            Based in New Delhi, we work with contemporary artists to bring original, rotating
            exhibitions into corporate spaces.
          </p>
        </div>
        <ol className="df-steps">
          {STEPS.map((s, i) => (
            <li key={s.title}>
              <span className="df-step-num">{i + 1}</span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ---------- Rent or buy ---------- */}
      <section className="df-section df-ways">
        <div className="df-way">
          <h2>Rent</h2>
          <p>
            Bring original art into your office on a rotating basis, without buying it outright. Your
            walls stay fresh and your team sees something new every season.
          </p>
          <a href={curatorMail}>Ask about renting</a>
        </div>
        <div className="df-way">
          <h2>Buy</h2>
          <p>
            Fallen for a piece? Works in our collection are also available to buy, so the art you
            love can stay with you for good.
          </p>
          <Link to="/catalogue">Browse works to buy</Link>
        </div>
      </section>

      {/* ---------- The artists (salon wall) ---------- */}
      <section className="df-salon-section">
        <div className="df-section-head df-section-head-wide">
          <h2>The artists</h2>
          <p>
            We work with contemporary artists, from emerging names to established painters. These are
            a few of the works in our collection.
          </p>
        </div>
        <div className="df-salon">
          {artists.map((a) => {
            const r = COVER_RATIO[a.name] || 1;
            return (
              <Link
                key={a.name}
                to={`/catalogue?artist=${encodeURIComponent(a.name)}`}
                className="df-salon-item"
                style={{ "--r": r }}
              >
                <span className="df-salon-frame" style={{ aspectRatio: String(r) }}>
                  <img src={a.cover} alt={`Work by ${a.name}`} loading="lazy" />
                </span>
                <span className="df-salon-name">{a.name}</span>
              </Link>
            );
          })}
        </div>
        <div className="df-center">
          <Link className="df-btn df-btn-quiet" to="/catalogue">
            See every work in the catalogue
          </Link>
        </div>
      </section>

      {/* ---------- Why art at work ---------- */}
      <section className="df-section">
        <div className="df-section-head">
          <h2>Why art at work</h2>
          <p>Bare walls say nothing. Original art says a great deal about the people behind them.</p>
        </div>
        <div className="df-reasons">
          {REASONS.map((r) => (
            <div key={r.title}>
              <h3>{r.title}</h3>
              <p>{r.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Two audiences ---------- */}
      <section className="df-paths">
        <div className="df-path df-path-company">
          <h2>Bring art into your office</h2>
          <p>Tell us about your space and we'll put together a first selection for you.</p>
          <div className="df-path-actions">
            <a className="df-btn df-btn-light" href={curatorMail}>
              Email a curator
            </a>
            <a className="df-path-phone" href="tel:+918800754221">
              or call +91 88007 54221
            </a>
          </div>
        </div>
        <div className="df-path df-path-artist">
          <h2>Show your work with us</h2>
          <p>
            Create an artist account, upload your work, and our team will review it for upcoming
            exhibitions.
          </p>
          <div className="df-path-actions">
            <Link className="df-btn" to="/artists/join">
              Join as an artist
            </Link>
            <Link className="df-path-phone" to="/artists/login">
              Already joined? Log in
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
