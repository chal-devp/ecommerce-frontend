// src/services/authService.ts

const API_BASE_URL = "http://localhost:5000/api";
interface userProps {
  email: string;
  password: string;
  phone: string;
  endpoint: string;
  role: string;
}
export const authenticateUser = async ({
  email,
  password,
  phone,
  endpoint,
  role,
}: userProps) => {
  const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, phone, role }),
  });

  const data = await response.json();

  if (!response.ok) {
    // We "throw" the error here so the component can "catch" it later
    throw new Error(data.error || "Authentication failed");
  }

  return data; // Returns { token, email }
};
