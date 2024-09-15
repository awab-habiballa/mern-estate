import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";
import { Link } from "react-router-dom";
import appAdImage from "../assets/images/app-background.webp"; // Update path as needed

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white font-sans">
      {/* Advertise Section */}
      <div className="bg-brandBlue py-4">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center text-center sm:text-left space-y-4 sm:space-y-0">
          <p className="text-white text-sm sm:text-lg">
            Looking to advertise a property? We can help.
          </p>
          <Link
            to="/list-your-property"
            className="bg-white text-brandBlue font-bold py-2 px-4 rounded-full shadow hover:bg-gray-200"
          >
            List your property with us
          </Link>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-4 gap-8 py-10 px-4 text-center sm:text-left">
        {/* Column 1: About */}
        <div>
          <h3 className="font-poppins font-bold text-lg sm:text-xl mb-3">
            Awab Estate
          </h3>
          <p className="text-gray-300 text-sm">
            Leading real estate marketplace in the UAE.
          </p>
        </div>

        {/* Column 2: Quick Links */}
        <div>
          <h3 className="font-poppins font-bold text-lg sm:text-xl mb-3">
            Quick Links
          </h3>
          <ul className="space-y-2">
            <li>
              <Link
                to="/"
                className="hover:underline hover:text-gray-300 text-sm"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className="hover:underline hover:text-gray-300 text-sm"
              >
                About Us
              </Link>
            </li>
            <li>
              <Link
                to="/create-listing"
                className="hover:underline hover:text-gray-300 text-sm"
              >
                Listing with Us
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Contact Us */}
        <div>
          <h3 className="font-poppins font-bold text-lg sm:text-xl mb-3">
            Contact Us
          </h3>
          <p className="text-gray-300 text-sm">
            📍 123 Real Estate Street, Abu Dhabi, UAE
          </p>
          <p className="text-gray-300 text-sm">📞 +971 586401146</p>
          <p className="text-gray-300 text-sm">📧 contact@awabestate.com</p>
        </div>

        {/* Column 4: App Ad */}
        <div>
          <h3 className="font-poppins font-bold text-lg sm:text-xl mb-3">
            Download the App
          </h3>
          <div className="flex items-center justify-center sm:justify-start">
            <img src={appAdImage} alt="App Ad" className="h-32 w-auto" />
          </div>
          <p className="text-gray-300 text-sm mt-2">
            Download the UAE's most trusted property search app.
          </p>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="text-center text-gray-500 py-4 text-sm">
        &copy; 2024 AwabEstate. All Rights Reserved.
      </div>
    </footer>
  );
}
