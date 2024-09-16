import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInFailure,
  signInSuccess,
} from "../redux/user/userSlice";
import OAuth from "../components/OAuth";
import useScrollToTop from "../hooks/useScrollToTop";

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useScrollToTop();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });

    if (error) {
      dispatch(signInFailure(null));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(signInStart());

      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }

      dispatch(signInSuccess(data));
      navigate("/");
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-grayLight">
      <div className="p-5 max-w-md w-full bg-white rounded-lg shadow-lg py-6 mt-5 lg:-mt-20">
        <h1 className="text-3xl text-center font-semibold my-5 text-brandBlue">
          Sign In
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
            {loading ? "Loading..." : "Sign In"}
          </button>
          <OAuth />
        </form>
        <div className="flex gap-2 mt-5 justify-center">
          <p>Don't have an account?</p>
          <Link to="/sign-up">
            <span className="text-blue-700"> Sign up</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
