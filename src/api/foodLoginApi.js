const BASE_URL = "https://69c8b0bb68edf52c954deb4c.mockapi.io/food-login-api";

function samePassword(stored, input) {
  return String(stored ?? "").trim() === String(input ?? "").trim();
}

export async function findUserByEmail(email) {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error("Could not reach server. Try again.");
  const data = await res.json();
  if (!Array.isArray(data)) return null;
  const normalized = email.trim().toLowerCase();
  return (
    data.find(
      (u) =>
        String(u.email || "")
          .trim()
          .toLowerCase() === normalized,
    ) || null
  );
}

/**
 * MockAPI often strips `password` on GET /collection, so client-side compare fails.
 * Filtering with email + password is done on the server; we still match email case-insensitively.
 */
export async function loginUser(email, password) {
  const trimmedEmail = email.trim();
  const normalizedEmail = trimmedEmail.toLowerCase();
  const passTrim = String(password).trim();

  const qs = new URLSearchParams({
    email: trimmedEmail,
    password: passTrim,
  });
  const filteredRes = await fetch(`${BASE_URL}?${qs.toString()}`);
  if (!filteredRes.ok) throw new Error("Could not reach server. Try again.");
  const filtered = await filteredRes.json();
  if (Array.isArray(filtered) && filtered.length > 0) {
    const user = filtered.find(
      (u) =>
        String(u.email || "")
          .trim()
          .toLowerCase() === normalizedEmail,
    );
    if (user) {
      const hasPw =
        user.password !== undefined &&
        user.password !== null &&
        String(user.password).trim() !== "";
      if (hasPw && !samePassword(user.password, password)) return null;
      return user;
    }
  }

  const user = await findUserByEmail(trimmedEmail);
  if (!user) return null;
  if (samePassword(user.password, password)) return user;
  return null;
}

export async function createUser({ name, email, password }) {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: name.trim(),
      email: email.trim(),
      password,
    }),
  });
  if (!res.ok) throw new Error("Sign up failed. Try again.");
  return res.json();
}
