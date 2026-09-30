"use client";
import { useState } from "react";

export default function SecretLoginPage() {
  const [creds, setCreds] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!process.env.NEXT_PUBLIC_API_URL) {
      alert("API URL not configured");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-kgf-access-key": process.env.NEXT_PUBLIC_ADMIN_KEY, 
          },
          body: JSON.stringify(creds),
        }
      );

      const data = await res.json();

     if (data.success) {
  document.cookie = `admin_token=${data.token}; path=/;`;
  localStorage.setItem("admin_token", data.token);
  window.location.href = "/Admin/Dashboard";
} else {
        alert(data.message || "Unauthorized Access");
      }
    } catch (err) {
      console.error("LOGIN ERROR:", err);
      alert("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  

  return (
    <div className="flex items-center justify-center h-screen bg-slate-900 text-white">
      <div className="w-80 p-8 bg-slate-800 rounded-2xl shadow-xl border border-slate-700">
        <h2 className="mb-6 text-xl font-bold text-center">
          KGF Admin Access
        </h2>

        <input
          type="text"
          placeholder="Username"
          className="w-full p-3 mb-4 rounded bg-slate-700 outline-none"
          onChange={(e) =>
            setCreds({ ...creds, username: e.target.value })
          }
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-6 rounded bg-slate-700 outline-none"
          onChange={(e) =>
            setCreds({ ...creds, password: e.target.value })
          }
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          className={`w-full p-3 rounded font-bold ${
            loading
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-500"
          }`}
        >
          {loading ? "Checking..." : "Enter Portal"}
        </button>
      </div>
    </div>
  );
}