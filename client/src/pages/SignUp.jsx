import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });

    if (error) {
      setError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success === false) {
        setLoading(false);
        setError(data.message);
        return;
      }

      setLoading(false);
      setError(null);
      navigate("/sign-in");
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-grayLight">
      <div className="p-5 max-w-md w-full bg-white rounded-lg shadow-lg py-6 mt-5 lg:-mt-20">
        <h1 className="text-3xl text-center font-semibold my-5 text-brandBlue">
          Sign Up
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Username"
            className="border p-3 rounded-lg"
            id="username"
            onChange={handleChange}
            required
          />
          <input
            type="text"
            placeholder="Email"
            className="border p-3 rounded-lg"
            id="email"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="border p-3 rounded-lg"
            id="password"
            onChange={handleChange}
            required
          />
          {/* Error message */}
          {error && <p className="text-red text-center">{error}</p>}
          <button
            disabled={loading}
            className="bg-brandBlue text-white p-3 rounded-lg uppercase hover:bg-hoverBlue transition duration-300 disabled:opacity-80"
          >
            {loading ? "Loading..." : "Sign Up"}
          </button>
          <OAuth />
        </form>
        <div className="flex gap-2 mt-5 justify-center">
          <p>Have an account?</p>
          <Link to="/sign-in">
            <span className="text-blue-700"> Sign in</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
