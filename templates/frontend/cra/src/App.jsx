import React from "react";
import { useState } from "react";
import "./index.css";

export default function App() {
  const [status, setStatus] = useState(null);

  const checkBackend = async () => {
    try {
      const res = await fetch("http://localhost:8080/");

      if (res.status === 404) {
        setStatus({ msg: "Backend is running", type: "success" });
        return;
      }

      if (!res.ok) throw new Error();
      setStatus({ msg: "Backend is running", type: "success" });
    } catch {
      setStatus({ msg: "Backend not reachable", type: "error" });
    }
  };

  return (
    <div className="container">
      <div className="hero">
        <div className="logo-group">
          <span className="icon react-icon">⚛️</span>
          <span className="plus">+</span>
          <span className="icon spring-icon">🍃</span>
        </div>
        <h1>React + Spring Boot</h1>
        <p className="subtitle">
          Your full-stack journey starts here. Fast, modern, and ready to scale.
        </p>

        <div className="card">
          <button onClick={checkBackend}>Check Connection</button>
          {status && (
            <div className={`status ${status.type}`}>{status.msg}</div>
          )}
        </div>

        <div className="links">
          <a href="https://react.dev" target="_blank" rel="noreferrer">
            React Docs
          </a>
          <a
            href="https://spring.io/projects/spring-boot"
            target="_blank"
            rel="noreferrer"
          >
            Spring Boot Docs
          </a>
        </div>
      </div>
    </div>
  );
}
