"use client";

import { useState } from "react";
import Button from "../components/Button";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  //Login Logic
  const handleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      // Use the environment variable, fallback to localhost for local testing
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      
      const res = await fetch(`${backendUrl}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        throw new Error("Login failed");
      }

      //Wrong Password
      const data = await res.json();
      if (!data) {
        throw new Error("Invalid credentials");
      }
   
      //Success
      console.log("Login success:", data);
      //Save token
      localStorage.setItem("token", data.access_token);
      //Save role
      localStorage.setItem("role", data.role);  

    // Redirect based on role
    if (data.role === "member") {
      window.location.href = "/member";
    } else if (data.role === "manager") {
      window.location.href = "/manager/dashboard";
    } else if (data.role === "trainer") {
        window.location.href = "/trainer/dashboard";
    } else {
      // fallback (We're cooked)
      window.location.href = "/";
    } 

    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex h-screen bg-[#f6f6f6]">
      
      {/* LEFT SIDE */}
      <div className="w-1/2 flex items-center justify-center">
        <div className="w-[550px]">
          <h1 className="text-5xl font-bold text-[#202022] mb-6">
            Welcome Back 👋
          </h1>
          
          <p className="text-[#202022] mb-15">
            Today is a new day. It's your day. <br />
            Sign in and let's get started.
          </p>

          {/* Username */}
          <label className="block text-sm mb-1 text-[#202022]">Username</label>
          <input
            type="email"
            placeholder="Please enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 mb-8 rounded-lg border border-[#D4D7E3] bg-[#F7FBFF] outline-none text-[#8897AD]"
          />

          {/* Password */}
          <label className="block text-sm mb-1 text-[#202022]">Password</label>
          <input
            type="password"
            placeholder="Please enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 mb-2 rounded-lg border border-[#D4D7E3] bg-[#F7FBFF] outline-none text-[#8897AD]"
          />

          <div className="text-right mb-4">
            <a href="#" className="text-sm text-[#AB94FF]">
              Forgot Password?
            </a>
          </div>

          {error && <p className="text-red-500 mb-2">{error}</p>}

          <Button text={loading ? "Signing in..." : "Sign in"} onClick={handleLogin} />
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-1/2 items-center flex justify-center">
        <img
          src="/login.png"
          alt="gym"
          className="mx-auto w-[900px] h-screen object-cover rounded-3xl p-6"
        />
      </div>

    </div>
  );
}