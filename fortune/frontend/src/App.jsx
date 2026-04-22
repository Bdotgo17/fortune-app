import React, { useState } from "react";
import axios from "axios";

export default function App() {
  const [loading, setLoading] = useState(false);
  const [fortune, setFortune] = useState(null);
  const [checkoutUrl, setCheckoutUrl] = useState(null);
  const [checkoutId, setCheckoutId] = useState(null);

  const start = async () => {
    setLoading(true);
    setFortune(null);
    try {
      const r = await axios.post("http://localhost:4000/api/create-checkout");
      setCheckoutUrl(r.data.checkoutUrl);
      setCheckoutId(r.data.checkoutId);
      // If it's a simulated local URL, open in the same tab so user can "pay"
      window.location.href = r.data.checkoutUrl;
    } catch (err) {
      console.error(err);
      alert("Failed to create checkout");
    } finally {
      setLoading(false);
    }
  };

  const claim = async () => {
    if (!checkoutId) return alert("No checkoutId");
    setLoading(true);
    try {
      const r = await axios.post("http://localhost:4000/api/fortune", {
        checkoutId,
      });
      setFortune(r.data.fortune);
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.error || "Failed to fetch fortune");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Fortune Reader</h1>
      <p className="small">
        Each fortune costs $1.00. Click below to start payment.
      </p>

      <div style={{ marginTop: 12 }}>
        <button onClick={start} disabled={loading}>
          Get Fortune ($1)
        </button>
      </div>

      {checkoutId && (
        <div style={{ marginTop: 20 }}>
          <p className="small">
            After completing payment, click below to reveal your fortune.
          </p>
          <button onClick={claim} disabled={loading}>
            Reveal Fortune
          </button>
        </div>
      )}

      {fortune && (
        <div className="fortune-card">
          <strong>Your fortune:</strong>
          <p>{fortune}</p>
        </div>
      )}
    </div>
  );
}
