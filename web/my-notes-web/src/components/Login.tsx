import React, { useState } from "react";
import { login, register } from "../services/authService";

interface LoginProps {
  onLogin: (username: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [mode, setMode] = useState<"login" | "register">("login");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!username) {
      setError("Please enter username");
      return;
    }
    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      if (mode === "register") {
        await register(username, password);
        // auto switch to login
        setMode("login");
        setError("Registration successful — please sign in");
        return;
      }

      const data = await login(username, password);
      localStorage.setItem("my_notes_app_token", data.token);
      localStorage.setItem("my_notes_app_user", data.username);
      onLogin(data.username);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    }
  }

  return (
    <div className="login-wrapper">
      <form className="login-card" onSubmit={handleSubmit}>
        <h2>{mode === "login" ? "Sign in" : "Register"}</h2>
        {error && <div className="login-error">{error}</div>}

        <label htmlFor="username">Username</label>
        <input
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="username"
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
        />

        <button type="submit" className="login-button">
          {mode === "login" ? "Sign in" : "Register"}
        </button>

        <div style={{ marginTop: 12 }}>
          <button
            type="button"
            onClick={() => setMode(mode === "login" ? "register" : "login")}
          >
            {mode === "login"
              ? "Need an account? Register"
              : "Have an account? Sign in"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
