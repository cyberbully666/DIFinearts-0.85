import React, { useCallback, useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { supabase, ARTWORK_BUCKET, artworkImageUrl } from "../supabaseClient";
import { useAuth } from "./AuthContext";
import useLegalDocuments from "./useLegalDocuments";
import { compressImage } from "./imageUtils";
import { formatDate, formatSize, pricingLine } from "./format";
import "./Portal.css";

const STATUS_TEXT = {
  pending: "Under review",
  approved: "Approved",
  rejected: "Not approved",
};

function StatusBadge({ status }) {
  return <span className={`pt-badge pt-badge-${status}`}>{STATUS_TEXT[status] || status}</span>;
}

const EMPTY_ARTWORK = {
  title: "",
  medium: "",
  width_cm: "",
  height_cm: "",
  year: "",
  description: "",
  for_sale: true,
  sale_price: "",
  for_rent: false,
  rent_monthly: "",
};

function toNumberOrNull(v) {
  if (v === "" || v === null || v === undefined) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

/* ---------- Add artwork form ---------- */
function AddArtwork({ userId, onAdded }) {
  const [form, setForm] = useState(EMPTY_ARTWORK);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!file) {
      setPreview("");
      return undefined;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const update = (field) => (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm({ ...form, [field]: value });
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setDone(false);
    if (!file) return setError("Please choose a photo of the artwork.");
    if (!form.for_sale && !form.for_rent) return setError("Choose at least one: for sale or for rent.");

    setSaving(true);
    try {
      const blob = await compressImage(file);
      const path = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`;
      const { error: upErr } = await supabase.storage
        .from(ARTWORK_BUCKET)
        .upload(path, blob, { contentType: "image/jpeg" });
      if (upErr) throw upErr;

      const { error: insErr } = await supabase.from("artworks").insert({
        artist_id: userId,
        title: form.title.trim(),
        medium: form.medium.trim() || null,
        width_cm: toNumberOrNull(form.width_cm),
        height_cm: toNumberOrNull(form.height_cm),
        year: toNumberOrNull(form.year),
        description: form.description.trim() || null,
        for_sale: form.for_sale,
        sale_price: form.for_sale ? toNumberOrNull(form.sale_price) : null,
        for_rent: form.for_rent,
        rent_monthly: form.for_rent ? toNumberOrNull(form.rent_monthly) : null,
        image_path: path,
      });
      if (insErr) {
        await supabase.storage.from(ARTWORK_BUCKET).remove([path]);
        throw insErr;
      }

      setForm(EMPTY_ARTWORK);
      setFile(null);
      setDone(true);
      onAdded();
    } catch (err) {
      setError(err.message || "Something went wrong while uploading. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="pt-card pt-form" onSubmit={handleSubmit}>
      <div className="pt-upload">
        <label className="pt-dropzone">
          {preview ? (
            <img src={preview} alt="Selected artwork" />
          ) : (
            <span>
              <strong>Choose a photo</strong>
              <br />
              JPG or PNG. We resize it automatically.
            </span>
          )}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
        </label>

        <div className="pt-upload-fields">
          <label className="pt-field">
            <span>Title</span>
            <input required value={form.title} onChange={update("title")} />
          </label>
          <label className="pt-field">
            <span>Medium</span>
            <input value={form.medium} onChange={update("medium")} placeholder="e.g. Oil on canvas" />
          </label>
          <div className="pt-row pt-row-3">
            <label className="pt-field">
              <span>Width (cm)</span>
              <input type="number" min="0" step="0.1" value={form.width_cm} onChange={update("width_cm")} />
            </label>
            <label className="pt-field">
              <span>Height (cm)</span>
              <input type="number" min="0" step="0.1" value={form.height_cm} onChange={update("height_cm")} />
            </label>
            <label className="pt-field">
              <span>Year</span>
              <input type="number" min="1900" max="2100" value={form.year} onChange={update("year")} />
            </label>
          </div>
        </div>
      </div>

      <label className="pt-field">
        <span>About this work (optional)</span>
        <textarea rows={3} value={form.description} onChange={update("description")} />
      </label>

      <div className="pt-row">
        <div className="pt-option">
          <label className="pt-check">
            <input type="checkbox" checked={form.for_sale} onChange={update("for_sale")} />
            <span>Available to buy</span>
          </label>
          {form.for_sale && (
            <label className="pt-field">
              <span>Sale price (₹)</span>
              <input type="number" min="0" value={form.sale_price} onChange={update("sale_price")} />
            </label>
          )}
        </div>
        <div className="pt-option">
          <label className="pt-check">
            <input type="checkbox" checked={form.for_rent} onChange={update("for_rent")} />
            <span>Available to rent</span>
          </label>
          {form.for_rent && (
            <label className="pt-field">
              <span>Rent per month (₹)</span>
              <input type="number" min="0" value={form.rent_monthly} onChange={update("rent_monthly")} />
            </label>
          )}
        </div>
      </div>

      {error && <p className="pt-error">{error}</p>}
      {done && <p className="pt-success">Uploaded. It's now waiting for review by the DIFinearts team.</p>}

      <button className="pt-btn" type="submit" disabled={saving}>
        {saving ? "Uploading…" : "Submit artwork for review"}
      </button>
    </form>
  );
}

/* ---------- My artworks ---------- */
function MyArtworks({ artworks, onChanged }) {
  async function remove(art) {
    if (!window.confirm(`Remove "${art.title}"? This can't be undone.`)) return;
    const { error } = await supabase.from("artworks").delete().eq("id", art.id);
    if (!error) await supabase.storage.from(ARTWORK_BUCKET).remove([art.image_path]);
    onChanged();
  }

  if (artworks.length === 0) {
    return (
      <div className="pt-card pt-empty">
        <p>You haven't added any artworks yet.</p>
        <p className="pt-muted">Use "Add artwork" above to upload your first piece.</p>
      </div>
    );
  }

  return (
    <div className="pt-grid">
      {artworks.map((art) => (
        <article key={art.id} className="pt-art">
          <div className="pt-art-img">
            <img src={artworkImageUrl(art.image_path)} alt={art.title} loading="lazy" />
          </div>
          <div className="pt-art-body">
            <div className="pt-art-top">
              <h3>{art.title}</h3>
              <StatusBadge status={art.status} />
            </div>
            <p className="pt-muted">
              {[art.medium, formatSize(art.width_cm, art.height_cm), art.year].filter(Boolean).join(" · ")}
            </p>
            <p>{pricingLine(art)}</p>
            {art.status === "rejected" && art.admin_note && (
              <p className="pt-note">Note from DIFinearts: {art.admin_note}</p>
            )}
            <button className="pt-link-btn pt-danger" onClick={() => remove(art)}>
              Remove
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}

/* ---------- Profile ---------- */
function MyProfile({ profile, onSaved }) {
  const [form, setForm] = useState({
    full_name: profile.full_name || "",
    phone: profile.phone || "",
    city: profile.city || "",
    bio: profile.bio || "",
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    const { error } = await supabase.from("profiles").update(form).eq("id", profile.id);
    setSaving(false);
    setMessage(error ? error.message : "Saved.");
    if (!error) onSaved();
  }

  return (
    <form className="pt-card pt-form" onSubmit={handleSubmit}>
      <label className="pt-field">
        <span>Full name</span>
        <input required value={form.full_name} onChange={update("full_name")} />
      </label>
      <div className="pt-row">
        <label className="pt-field">
          <span>Phone</span>
          <input value={form.phone} onChange={update("phone")} />
        </label>
        <label className="pt-field">
          <span>City</span>
          <input value={form.city} onChange={update("city")} />
        </label>
      </div>
      <label className="pt-field">
        <span>About you</span>
        <textarea
          rows={5}
          value={form.bio}
          onChange={update("bio")}
          placeholder="Your background, training, exhibitions, and what your work is about."
        />
      </label>
      {message && <p className={message === "Saved." ? "pt-success" : "pt-error"}>{message}</p>}
      <button className="pt-btn" type="submit" disabled={saving}>
        {saving ? "Saving…" : "Save profile"}
      </button>
    </form>
  );
}

/* ---------- Documents ---------- */
function MyDocuments({ docs, acceptances }) {
  return (
    <div className="pt-card">
      <table className="pt-table">
        <thead>
          <tr>
            <th>Document</th>
            <th>Version</th>
            <th>Accepted on</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {docs.map((doc) => {
            const acc = acceptances.find((a) => a.document_id === doc.id);
            return (
              <tr key={doc.id}>
                <td>{doc.title}</td>
                <td>{doc.version}</td>
                <td>{acc ? formatDate(acc.accepted_at) : <span className="pt-error">Not yet accepted</span>}</td>
                <td>
                  <Link to={`/legal/${doc.slug}`} target="_blank" rel="noreferrer">
                    Read
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/* ---------- Banner asking to accept updated documents ---------- */
function AcceptUpdates({ userId, missing, onAccepted }) {
  const [checked, setChecked] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function accept() {
    setSaving(true);
    setError("");
    const { error: err } = await supabase
      .from("document_acceptances")
      .insert(missing.map((d) => ({ user_id: userId, document_id: d.id })));
    setSaving(false);
    if (err) setError(err.message);
    else onAccepted();
  }

  return (
    <div className="pt-card pt-alert">
      <h2 className="pt-subtitle">Updated agreements</h2>
      <p>
        We've published new versions of the documents below. Please read and accept them to keep
        adding artworks.
      </p>
      <ul>
        {missing.map((d) => (
          <li key={d.id}>
            <Link to={`/legal/${d.slug}`} target="_blank" rel="noreferrer">
              {d.title}
            </Link>{" "}
            <span className="pt-muted">(version {d.version})</span>
          </li>
        ))}
      </ul>
      <label className="pt-check">
        <input type="checkbox" checked={checked} onChange={(e) => setChecked(e.target.checked)} />
        <span>I have read and accept these documents</span>
      </label>
      {error && <p className="pt-error">{error}</p>}
      <button className="pt-btn" disabled={!checked || saving} onClick={accept}>
        {saving ? "Saving…" : "Accept"}
      </button>
    </div>
  );
}

/* ---------- Page ---------- */
export default function ArtistDashboard() {
  const { user, profile, loading, refreshProfile, signOut } = useAuth();
  const { docs } = useLegalDocuments();
  const [tab, setTab] = useState("artworks");
  const [artworks, setArtworks] = useState([]);
  const [acceptances, setAcceptances] = useState([]);

  const loadData = useCallback(async () => {
    if (!user) return;
    const [{ data: arts }, { data: accs }] = await Promise.all([
      supabase.from("artworks").select("*").eq("artist_id", user.id).order("created_at", { ascending: false }),
      supabase.from("document_acceptances").select("document_id, accepted_at").eq("user_id", user.id),
    ]);
    setArtworks(arts || []);
    setAcceptances(accs || []);
  }, [user]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (loading) return <div className="pt-page pt-narrow pt-muted">Loading…</div>;
  if (!user) return <Navigate to="/artists/login" replace />;
  if (!profile) return <div className="pt-page pt-narrow pt-muted">Loading your account…</div>;
  if (profile.role === "admin") return <Navigate to="/admin" replace />;

  const missing = docs.filter((d) => !acceptances.some((a) => a.document_id === d.id));
  const counts = {
    pending: artworks.filter((a) => a.status === "pending").length,
    approved: artworks.filter((a) => a.status === "approved").length,
  };

  return (
    <div className="pt-page">
      <div className="pt-header">
        <div>
          <p className="pt-eyebrow">Artist portal</p>
          <h1 className="pt-title">Hello, {profile.full_name || "artist"}</h1>
          <p className="pt-muted">
            Account: <StatusBadge status={profile.status} /> · {counts.approved} approved ·{" "}
            {counts.pending} under review
          </p>
        </div>
        <button className="pt-btn pt-btn-ghost" onClick={signOut}>
          Log out
        </button>
      </div>

      {profile.status === "pending" && (
        <div className="pt-card pt-info">
          Thanks for joining. Our team is reviewing your profile. You can start uploading artworks
          now; they'll appear in the catalogue once your profile and each work are approved.
        </div>
      )}
      {profile.status === "rejected" && (
        <div className="pt-card pt-alert">
          Your artist profile wasn't approved. Please contact us if you'd like to discuss this.
        </div>
      )}

      {missing.length > 0 && docs.length > 0 ? (
        <AcceptUpdates userId={user.id} missing={missing} onAccepted={loadData} />
      ) : (
        <>
          <nav className="pt-tabs">
            {[
              ["artworks", "My artworks"],
              ["add", "Add artwork"],
              ["profile", "My profile"],
              ["documents", "Agreements"],
            ].map(([key, label]) => (
              <button key={key} className={tab === key ? "active" : ""} onClick={() => setTab(key)}>
                {label}
              </button>
            ))}
          </nav>

          {tab === "artworks" && <MyArtworks artworks={artworks} onChanged={loadData} />}
          {tab === "add" && (
            <AddArtwork
              userId={user.id}
              onAdded={() => {
                loadData();
              }}
            />
          )}
          {tab === "profile" && <MyProfile profile={profile} onSaved={refreshProfile} />}
          {tab === "documents" && <MyDocuments docs={docs} acceptances={acceptances} />}
        </>
      )}
    </div>
  );
}
