import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { formatDate } from "./format";
import "./Portal.css";

export default function LegalPage() {
  const { slug } = useParams();
  const [doc, setDoc] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let active = true;
    setStatus("loading");
    supabase
      .from("legal_documents")
      .select("title, version, body, published_at")
      .eq("slug", slug)
      .eq("is_current", true)
      .maybeSingle()
      .then(({ data }) => {
        if (!active) return;
        setDoc(data);
        setStatus(data ? "ready" : "missing");
      });
    return () => {
      active = false;
    };
  }, [slug]);

  return (
    <div className="pt-page pt-narrow">
      {status === "loading" && <p className="pt-muted">Loading…</p>}
      {status === "missing" && <p>This document could not be found.</p>}
      {status === "ready" && (
        <>
          <p className="pt-eyebrow">DIFinearts</p>
          <h1 className="pt-title">{doc.title}</h1>
          <p className="pt-muted">
            Version {doc.version} · published {formatDate(doc.published_at)}
          </p>
          <div className="pt-card pt-legal">{doc.body}</div>
        </>
      )}
    </div>
  );
}
