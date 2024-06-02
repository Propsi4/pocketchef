import React, { useState, useEffect } from "react";
import "./Header.css";

const Header = () => {
  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <header>
      <span className="time">{currentTime}</span>
      <span className="appName">PocketChef🧑‍🍳</span>
      <a
        href="https://github.com/Propsi4"
        target="_blank"
        rel="noopener noreferrer"
        className="githubLink"
      >
        @Propsi4
      </a>
    </header>
  );
};

export default Header;
