import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Instance from "./Instance";
import { toast } from "react-toastify";
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log({ email, password });
    e.preventDefault();
    setError(""); // Clear previous errors

    try {
      const response = await Instance.post("/users/login", { email, password });

      if (response.status === 200) {
        // Store token if needed
        localStorage.setItem("token", response.data.token);

        toast.success("🎉 Login Successful!", {
          position: "top-right",
          autoClose: 2000, // 2 seconds
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        });

        // Redirect after a short delay
        setTimeout(() => navigate("/"), 2000);
      }
    } catch (err) {
      toast.error("❌ Invalid Credentials! Try again.", {
        position: "top-right",
        autoClose: 3000, // 3 seconds
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Welcome Back! 👋
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium">Email</label>
            <input
              type="email"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Password</label>
            <input
              type="password"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Sign In
          </button>
        </form>
        <p className="text-center text-gray-600 text-sm mt-4">
          Don't have an account?{" "}
          <a href="/register" className="text-blue-600 font-semibold">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login;
