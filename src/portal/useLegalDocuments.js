import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

// Loads the current version of every legal document.
export default function useLegalDocuments() {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    supabase
      .from("legal_documents")
      .select("id, slug, title, version, body, published_at")
      .eq("is_current", true)
      .order("slug")
      .then(({ data, error: err }) => {
        if (!active) return;
        if (err) setError("Could not load the agreement documents. Please refresh the page.");
        setDocs(data || []);
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return { docs, loading, error };
}
