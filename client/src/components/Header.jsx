import { FaSearch, FaBars } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState, useRef } from "react";

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();

    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }

    const handleOutsideClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [location.search]);

  return (
    <header className="bg-white shadow-lg py-4 font-sans relative z-50">
      <div className="flex justify-between items-center max-w-7xl mx-auto px-4 flex-wrap sm:flex-nowrap">
        <div className="flex items-center justify-between w-full sm:w-auto">
          <Link
            to="/"
            className="text-lg sm:text-xl font-bold tracking-wide whitespace-nowrap flex items-center"
          >
            <span className="text-grayDark">Awab</span>
            <span className="text-brandBlue">Properties</span>
          </Link>

          {/* Sign In button for mobile */}
          {!currentUser && (
            <Link
              to="/sign-in"
              className="bg-brandBlue text-white px-4 py-2 rounded-full hover:bg-hoverBlue transition duration-300 ml-auto sm:hidden"
            >
              Sign in
            </Link>
          )}

          {/* Profile picture and Hamburger Menu for mobile */}
          {currentUser && (
            <div className="flex items-center space-x-4 sm:hidden ml-auto">
              <Link to="/profile">
                <img
                  className="rounded-full h-8 w-8 object-cover border-2 border-gray-300 transition duration-300"
                  src={currentUser.avatar}
                  alt="profile"
                />
              </Link>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-2 focus:outline-none"
              >
                <FaBars className="text-brandBlue text-2xl" />
              </button>
            </div>
          )}
        </div>

        {/* Search Bar */}
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded-full p-3 flex items-center w-full sm:w-80 md:w-96 my-2 sm:my-0 sm:ml-4 transition duration-300 ease-in-out transform hover:scale-105"
        >
          <input
            type="text"
            placeholder="Search for properties..."
            className="bg-transparent focus:outline-none px-4 w-full text-sm sm:text-md text-grayDark"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="p-2 bg-brandBlue hover:bg-hoverBlue rounded-full transition duration-300">
            <FaSearch className="text-white" />
          </button>
        </form>

        {/* Desktop Navigation */}
        <ul className="hidden sm:flex items-center gap-4 lg:gap-8">
          <Link
            to="/"
            className="text-grayDark hover:text-secondaryBlue text-sm sm:text-md transition duration-300 tracking-wide"
          >
            Home
          </Link>
          <Link
            to="/about"
            className="text-grayDark hover:text-secondaryBlue text-sm sm:text-md transition duration-300 tracking-wide"
          >
            About Us
          </Link>
          {currentUser ? (
            <>
              <Link
                to="/my-listings"
                className="text-grayDark hover:text-secondaryBlue text-sm sm:text-md transition duration-300 tracking-wide"
              >
                My Listings
              </Link>
              <Link
                to="/create-listing"
                className="text-grayDark hover:text-secondaryBlue text-sm sm:text-md transition duration-300 tracking-wide"
              >
                List Your Property
              </Link>
              <Link to="/profile" className="ml-4">
                <img
                  className="rounded-full h-8 w-8 sm:h-10 sm:w-10 object-cover border-2 border-gray-300 transition duration-300 transform hover:scale-105"
                  src={currentUser.avatar}
                  alt="profile"
                />
              </Link>
            </>
          ) : (
            <>
              {/* Display these links even if the user is not logged in */}
              <Link
                to="/create-listing"
                className="text-grayDark hover:text-secondaryBlue text-sm sm:text-md transition duration-300 tracking-wide"
              >
                List Your Property
              </Link>
              <Link
                to="/sign-in"
                className="bg-brandBlue text-white px-4 py-2 rounded-full hover:bg-hoverBlue transition duration-300"
              >
                Sign in
              </Link>
            </>
          )}
        </ul>

        {/* Mobile Navigation for Logged-out Users */}
        {!currentUser && (
          <div className="block sm:hidden w-full mt-4">
            <div className="flex justify-around">
              <Link
                to="/about"
                className="text-grayDark hover:text-secondaryBlue text-sm transition duration-300"
              >
                About Us
              </Link>
              <Link
                to="/create-listing"
                className="text-grayDark hover:text-secondaryBlue text-sm transition duration-300"
              >
                List Your Property
              </Link>
            </div>
          </div>
        )}

        {/* Mobile Navigation for Logged-in Users */}
        {menuOpen && (
          <div
            ref={menuRef}
            className="absolute right-0 top-full mt-2 bg-white shadow-lg rounded-lg p-4 w-40 space-y-2 transition-opacity duration-300 sm:hidden z-50"
          >
            <Link
              to="/"
              className="block text-grayDark hover:text-secondaryBlue text-sm transition"
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/about"
              className="block text-grayDark hover:text-secondaryBlue text-sm transition"
              onClick={() => setMenuOpen(false)}
            >
              About Us
            </Link>
            <Link
              to="/my-listings"
              className="block text-grayDark hover:text-secondaryBlue text-sm transition"
              onClick={() => setMenuOpen(false)}
            >
              My Listings
            </Link>
            <Link
              to="/create-listing"
              className="block text-grayDark hover:text-secondaryBlue text-sm transition"
              onClick={() => setMenuOpen(false)}
            >
              List Your Property
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
