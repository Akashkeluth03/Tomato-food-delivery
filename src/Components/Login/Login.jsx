import { useState, useEffect } from "react";
import "./Login.css";
import { assets } from "../../assets/assets";
import { findUserByEmail, createUser, loginUser } from "../../api/foodLoginApi";

const Login = ({ setShowLogin, setUser }) => {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setShowLogin(false);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [setShowLogin]);

  useEffect(() => {
    setError("");
  }, [mode, email]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError("Please enter your email.");
      return;
    }
    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setLoading(true);
    let keepModalOpen = true;
    try {
      if (mode === "login") {
        const existing = await loginUser(trimmedEmail, password);
        if (!existing) {
          const byEmail = await findUserByEmail(trimmedEmail);
          if (!byEmail) {
            setMode("signup");
            setError(
              "No account for this email. Add your name and choose a password to sign up."
            );
            return;
          }
          setError("Wrong password. Try again.");
          return;
        }
        setUser({
          name: existing.name || "User",
          email: existing.email || trimmedEmail,
        });
        setShowLogin(false);
        setName("");
        setEmail("");
        setPassword("");
        keepModalOpen = false;
        return;
      }

      if (!name.trim()) {
        setError("Please enter your name.");
        return;
      }
      if (password.length < 6) {
        setError("Password must be at least 6 characters.");
        return;
      }
      const existing = await findUserByEmail(trimmedEmail);
      if (existing) {
        setError("This email is already registered. Use the Login tab.");
        setMode("login");
        return;
      }
      const created = await createUser({
        name,
        email: trimmedEmail,
        password,
      });
      setUser({
        name: created.name || name.trim() || "User",
        email: created.email || trimmedEmail,
      });
      setShowLogin(false);
      setName("");
      setEmail("");
      setPassword("");
      keepModalOpen = false;
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      if (keepModalOpen) setLoading(false);
    }
  };

  return (
    <div
      className="login-overlay"
      role="presentation"
      onClick={() => setShowLogin(false)}
    >
      <div
        className="login-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-heading"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="login-close"
          onClick={() => setShowLogin(false)}
          aria-label="Close"
        >
          <img src={assets.cross_icon} alt="" />
        </button>

        <div className="login-title-row">
          <h2 id="login-heading">{mode === "login" ? "Login" : "Sign Up"}</h2>
          <img src={assets.logo} alt="" className="login-logo" />
        </div>

        <div className="login-tabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={mode === "login"}
            className={`login-tab ${mode === "login" ? "active" : ""}`}
            onClick={() => setMode("login")}
          >
            Login
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === "signup"}
            className={`login-tab ${mode === "signup" ? "active" : ""}`}
            onClick={() => setMode("signup")}
          >
            Sign Up
          </button>
        </div>

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          {error && (
            <p className="login-error" role="alert">
              {error}
            </p>
          )}
          {mode === "signup" && (
            <div className="login-field">
              <label htmlFor="login-name">Name</label>
              <input
                id="login-name"
                name="name"
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                required={mode === "signup"}
              />
            </div>
          )}
          <div className="login-field">
            <label htmlFor="login-email">Email</label>
            <input
              id="login-email"
              name="email"
              type="text"
              inputMode="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>
          <div className="login-field">
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              name="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={
                mode === "login" ? "current-password" : "new-password"
              }
              required
              minLength={mode === "signup" ? 6 : 1}
            />
          </div>
          <button
            type="submit"
            className="login-submit"
            disabled={loading}
          >
            {loading
              ? "Please wait…"
              : mode === "login"
                ? "Login"
                : "Create account"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
