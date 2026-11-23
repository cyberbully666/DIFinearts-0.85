import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "./Portal.css";

export default function ArtistLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const { data, error: err } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    if (err) {
      setSubmitting(false);
      setError(
        /invalid login/i.test(err.message)
          ? "That email and password don't match. Please try again."
          : err.message
      );
      return;
    }
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .maybeSingle();
    setSubmitting(false);
    navigate(profile?.role === "admin" ? "/admin" : "/portal");
  }

  return (
    <div className="pt-page pt-narrow">
      <p className="pt-eyebrow">For artists</p>
      <h1 className="pt-title">Log in</h1>

      <form className="pt-card pt-form" onSubmit={handleSubmit}>
        <label className="pt-field">
          <span>Email</span>
          <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
        </label>
        <label className="pt-field">
          <span>Password</span>
          <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
        </label>

        {error && <p className="pt-error">{error}</p>}

        <button className="pt-btn pt-btn-block" type="submit" disabled={submitting}>
          {submitting ? "Logging in…" : "Log in"}
        </button>
        <p className="pt-muted pt-center">
          New here? <Link to="/artists/join">Create an artist account</Link>
        </p>
      </form>
    </div>
  );
}
