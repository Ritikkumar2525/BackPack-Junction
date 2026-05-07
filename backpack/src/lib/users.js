/**
 * User store with role-based access for BackPack Junction.
 * Roles: "user" | "admin"
 */
import { hashSync, compareSync } from "bcryptjs";

const users = new Map();
let nextId = 1;

// Seed demo user
users.set("demo@backpackjunction.com", {
  id: "user-demo-001",
  name: "Demo Traveler",
  email: "demo@backpackjunction.com",
  password: hashSync("adventure123", 10),
  phone: "+91 98765 43210",
  image: null,
  role: "user",
  provider: "credentials",
  createdAt: "2026-01-15T10:00:00Z",
});

// Seed admin user
users.set("admin@backpackjunction.com", {
  id: "admin-001",
  name: "Ritik Kumar",
  email: "admin@backpackjunction.com",
  password: hashSync("admin123", 10),
  phone: "+91 82870 54501",
  image: null,
  role: "admin",
  provider: "credentials",
  createdAt: "2025-06-01T10:00:00Z",
});

export function getUser(email) {
  return users.get(email?.toLowerCase()) || null;
}

export function getUserById(id) {
  for (const user of users.values()) {
    if (user.id === id) return user;
  }
  return null;
}

export function createUser({ name, email, password, phone, image, provider = "credentials", role = "user" }) {
  const normalizedEmail = email.toLowerCase();
  if (users.has(normalizedEmail)) {
    return { error: "User already exists" };
  }

  const id = `user-${Date.now()}-${nextId++}`;
  const user = {
    id,
    name,
    email: normalizedEmail,
    password: password ? hashSync(password, 10) : null,
    phone: phone || null,
    image: image || null,
    role,
    provider,
    createdAt: new Date().toISOString(),
  };

  users.set(normalizedEmail, user);
  return { user: { id: user.id, name: user.name, email: user.email, role: user.role } };
}

export function getAllUsers() {
  return Array.from(users.values()).map(({ password, ...u }) => u);
}

export function verifyPassword(email, password) {
  const user = getUser(email);
  if (!user || !user.password) return false;
  return compareSync(password, user.password);
}
