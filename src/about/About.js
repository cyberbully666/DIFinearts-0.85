import React from "react";
import { Link } from "react-router-dom";
import artists from "../artists";
import "./About.css";

const EMAIL = "difinearts.official@gmail.com";

const PRINCIPLES = [
  {
    title: "Long-term thinking",
    text: "We work closely with contemporary artists to present carefully curated bodies of work, so organisations can engage with art as an evolving presence rather than a static acquisition.",
  },
  {
    title: "A cultural framework",
    text: "For companies, DIFinearts offers more than visual enhancement. It encourages dialogue, reflection and a deeper relationship between space, people and creative expression.",
  },
  {
    title: "Lasting partnerships",
    text: "As we grow, our aim stays deliberate: to build enduring partnerships between artists and institutions, and to shape environments where art quietly but powerfully defines character, intent and identity.",
  },
];

// A short row of works for the wall strip.
const STRIP = ["Vazda Khan", "Satish Sharma", "Nivedita Pande", "Anandamoy Banerji", "RP Verma"]
  .map((name) => artists.find((a) => a.name === name))
  .filter(Boolean);

export default function About() {
  return (
    <main className="ab-page">
      <section className="ab-intro">
        <p className="ab-kicker">About DIFinearts</p>
        <h1>Art belongs in lived spaces, not behind velvet ropes.</h1>
        <p className="ab-lead">
          DIFinearts was founded on that belief. We bring meaningful, original artworks into
          professional environments, where culture is not announced but experienced.
        </p>
      </section>

      <section className="ab-strip" aria-label="Works from the collection">
        <div className="ab-strip-row">
          {STRIP.map((a) => (
            <Link
              key={a.name}
              to={`/catalogue?artist=${encodeURIComponent(a.name)}`}
              className="ab-strip-item"
            >
              <img src={a.cover} alt={`Work by ${a.name}`} loading="lazy" />
              <span>{a.name}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="ab-principles">
        <h2>How we work</h2>
        <div className="ab-principle-list">
          {PRINCIPLES.map((p) => (
            <article key={p.title} className="ab-principle">
              <h3>{p.title}</h3>
              <p>{p.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="ab-visit">
        <div className="ab-visit-text">
          <h2>Work with us</h2>
          <p>
            Whether you want art for your office or a place to show your work, we'd like to hear
            from you.
          </p>
        </div>
        <div className="ab-visit-actions">
          <a
            className="df-btn"
            href={`mailto:${EMAIL}?subject=${encodeURIComponent("Art for our office")}`}
          >
            Talk to a curator
          </a>
          <Link className="df-btn df-btn-quiet" to="/artists/join">
            Join as an artist
          </Link>
        </div>
      </section>
    </main>
  );
}
