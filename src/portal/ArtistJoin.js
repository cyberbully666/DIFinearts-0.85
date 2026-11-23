import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import useLegalDocuments from "./useLegalDocuments";
import "./Portal.css";

export default function ArtistJoin() {
  const navigate = useNavigate();
  const { docs, loading: docsLoading, error: docsError } = useLegalDocuments();

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    city: "",
    password: "",
    confirm: "",
  });
  const [accepted, setAccepted] = useState({});
  const [openDoc, setOpenDoc] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [checkEmail, setCheckEmail] = useState(false);

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });
  const allAccepted = docs.length > 0 && docs.every((d) => accepted[d.id]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (form.password.length < 8) return setError("Please choose a password of at least 8 characters.");
    if (form.password !== form.confirm) return setError("The two passwords don't match.");
    if (!allAccepted) return setError("Please read and accept each document below to continue.");

    setSubmitting(true);
    const { data, error: err } = await supabase.auth.signUp({
      email: form.email.trim(),
      password: form.password,
      options: {
        data: {
          full_name: form.full_name.trim(),
          phone: form.phone.trim(),
          city: form.city.trim(),
          accepted_documents: docs.map((d) => d.id),
        },
      },
    });
    setSubmitting(false);

    if (err) {
      setError(
        /already registered/i.test(err.message)
          ? "An account with this email already exists. Try logging in instead."
          : err.message
      );
      return;
    }
    if (data.session) navigate("/portal");
    else setCheckEmail(true);
  }

  if (checkEmail) {
    return (
      <div className="pt-page pt-narrow">
        <h1 className="pt-title">Check your email</h1>
        <p className="pt-lead">
          We've sent a confirmation link to <strong>{form.email}</strong>. Click it, then log in to
          start adding your work.
        </p>
        <Link className="pt-btn" to="/artists/login">Go to login</Link>
      </div>
    );
  }

  return (
    <div className="pt-page pt-narrow">
      <p className="pt-eyebrow">For artists</p>
      <h1 className="pt-title">Join DIFinearts</h1>
      <p className="pt-lead">
        Create your artist account to upload your work. Our team reviews every artist and artwork
        before it appears in the catalogue.
      </p>

      <form className="pt-card pt-form" onSubmit={handleSubmit}>
        <label className="pt-field">
          <span>Full name</span>
          <input required value={form.full_name} onChange={update("full_name")} autoComplete="name" />
        </label>
        <label className="pt-field">
          <span>Email</span>
          <input required type="email" value={form.email} onChange={update("email")} autoComplete="email" />
        </label>
        <div className="pt-row">
          <label className="pt-field">
            <span>Phone</span>
            <input value={form.phone} onChange={update("phone")} autoComplete="tel" />
          </label>
          <label className="pt-field">
            <span>City</span>
            <input value={form.city} onChange={update("city")} />
          </label>
        </div>
        <div className="pt-row">
          <label className="pt-field">
            <span>Password</span>
            <input required type="password" value={form.password} onChange={update("password")} autoComplete="new-password" />
          </label>
          <label className="pt-field">
            <span>Confirm password</span>
            <input required type="password" value={form.confirm} onChange={update("confirm")} autoComplete="new-password" />
          </label>
        </div>

        <h2 className="pt-subtitle">Agreements</h2>
        {docsLoading && <p className="pt-muted">Loading documents…</p>}
        {docsError && <p className="pt-error">{docsError}</p>}
        {docs.map((doc) => (
          <div key={doc.id} className="pt-doc">
            <div className="pt-doc-head">
              <label className="pt-check">
                <input
                  type="checkbox"
                  checked={!!accepted[doc.id]}
                  onChange={(e) => setAccepted({ ...accepted, [doc.id]: e.target.checked })}
                />
                <span>
                  I have read and accept the <strong>{doc.title}</strong>{" "}
                  <span className="pt-muted">(version {doc.version})</span>
                </span>
              </label>
              <button
                type="button"
                className="pt-link-btn"
                onClick={() => setOpenDoc(openDoc === doc.id ? null : doc.id)}
              >
                {openDoc === doc.id ? "Hide" : "Read"}
              </button>
            </div>
            {openDoc === doc.id && <div className="pt-doc-body">{doc.body}</div>}
          </div>
        ))}

        {error && <p className="pt-error">{error}</p>}

        <button className="pt-btn pt-btn-block" type="submit" disabled={submitting || docsLoading}>
          {submitting ? "Creating your account…" : "Create artist account"}
        </button>
        <p className="pt-muted pt-center">
          Already have an account? <Link to="/artists/login">Log in</Link>
        </p>
      </form>
    </div>
  );
}
