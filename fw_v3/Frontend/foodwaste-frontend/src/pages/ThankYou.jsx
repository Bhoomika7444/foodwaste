import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const quotes = [
  { text: "No act of kindness, however small, is ever wasted.", author: "Aesop" },
  { text: "We make a living by what we get, but we make a life by what we give.", author: "Winston Churchill" },
  { text: "Kindness is the language which the deaf can hear and the blind can see.", author: "Mark Twain" },
];

export default function ThankYou() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: "Friend" });
  const quote = quotes[Math.floor(Math.random() * quotes.length)];

  useEffect(() => {
    const stored = localStorage.getItem("fw_user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  return (
    <div className="thanks-bg">
      <div className="thanks-orb thanks-orb1" />
      <div className="thanks-orb thanks-orb2" />

      <div className="thanks-card fade-up">
        {/* Checkmark */}
        <div className="thanks-check">
          <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="thanks-title">Thank You, {user.name?.split(" ")[0]}! 🎉</h1>
        <p className="thanks-sub">Your donation has been received. You're making the world a better place, one meal at a time.</p>

        {/* Divider */}
        <div className="thanks-divider" />

        {/* Quote */}
        <div className="quote-box">
          <div className="quote-mark">"</div>
          <p className="quote-text">{quote.text}</p>
          <p className="quote-author">— {quote.author}</p>
        </div>

        <div className="thanks-divider" />

        <p className="thanks-impact">💚 Every contribution brings us closer to a hunger-free world</p>

        {/* Actions */}
        <div className="thanks-actions">
          <button className="btn-home" onClick={() => navigate("/home")}>
            ← Back to Home
          </button>
          <button className="btn-donate-again" onClick={() => navigate("/home")}>
            Donate Again 🍱
          </button>
        </div>
      </div>
    </div>
  );
}
