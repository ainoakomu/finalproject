import { useState, useEffect } from "react";

import "bootstrap/dist/js/bootstrap.bundle.min.js";
import '../styles.css/Focus.css'

function FocusPage() {
  const [timeLeft, setTimeLeft] = useState(25 * 60); 
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState("focus"); 
  const [quote, setDailyQuote] = useState(null);

 

  // Timer logic
  useEffect(() => {
    let timer;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    } else if (timeLeft === 0 && isRunning) {
      new Audio("https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg").play();
      setIsRunning(false);
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  // Quote of the Day
  useEffect(() => {
  const fetchQuoteOfTheDay = async () => {
    try {
      const res = await fetch("https://insult.mattbas.org/api/adjective.json");
      const data = await res.json();
      setDailyQuote(data.insult); 
    } catch (err) {
      console.error("Failed to fetch quote:", err);
      setDailyQuote("Blah!");
    }
  };
  fetchQuoteOfTheDay();
}, []);

  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const seconds = String(timeLeft % 60).padStart(2, "0");

  const startFocus = () => {
    setMode("focus");
    setTimeLeft(25 * 60);
    setIsRunning(true);
  };

  const startBreak = () => {
    setMode("break");
    setTimeLeft(5 * 60);
    setIsRunning(true);
  };

  const resetTimer = () => {
    setTimeLeft(mode === "focus" ? 25 * 60 : 5 * 60);
    setIsRunning(false);
  };

  return (
    <div className="focus-page">
  <div className="timer">
    <h1>{mode === "focus" ? "🎯 Focus Time" : "☕ Break Time"}</h1>
    <h2>{minutes}:{seconds}</h2>
  </div>

  <div className="button-group">
    <button className="btn btn-success" onClick={() => setIsRunning(!isRunning)}>
      {isRunning ? "Pause" : "Resume"}
    </button>
    <button className="btn btn-primary" onClick={startFocus}>
      Start Focus
    </button>
    <button className="btn btn-warning" onClick={startBreak}>
      Start Break
    </button>
    <button className="btn btn-secondary" onClick={resetTimer}>
      Reset
    </button>
  </div>

  {quote && (
    <div className="quote">
      <p>"Don't be a {quote}, be productive"</p>
    </div>
  )}

  <div className="music">
    <iframe
      width="100%"
      height="100%"
      src="https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=1&loop=1&playlist=jfKfPfyJRdk"
      title="Lofi Girl"
      frameBorder="0"
      allow="autoplay; encrypted-media; picture-in-picture"
      allowFullScreen
    ></iframe>
  </div>
</div>

  );
}

export default FocusPage;


