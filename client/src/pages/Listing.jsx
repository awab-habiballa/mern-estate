import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import { useSelector } from "react-redux";
import "swiper/css/bundle";
import Footer from "../components/Footer";
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkerAlt,
  FaParking,
  FaPhone,
  FaWhatsapp,
  FaShareAlt,
} from "react-icons/fa";

export default function Listing() {
  SwiperCore.use([Navigation]);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const { currentUser } = useSelector((state) => state.user);

  const params = useParams();

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId]);

  const handleWhatsAppClick = () => {
    if (listing && listing.contactNumber) {
      const listingUrl = `https://yourwebsite.com/listing/${listing._id}`;

      const message = `Hello, I'm interested in your listing:
- *${listing.name}*
- 📍 ${listing.address}
- 💰 ${
        listing.offer
          ? `$${listing.discountPrice.toLocaleString("en-US")}`
          : `$${listing.regularPrice.toLocaleString("en-US")}`
      } ${listing.type === "rent" ? "/ month" : ""}
- 🛏️ ${listing.bedrooms} ${listing.bedrooms > 1 ? "beds" : "bed"}
- 🛁 ${listing.bathrooms} ${listing.bathrooms > 1 ? "baths" : "bath"}

Please let me know if it's still available.

Check the listing here: ${listingUrl}`;

      const whatsappUrl = `https://api.whatsapp.com/send?phone=${encodeURIComponent(
        listing.contactNumber
      )}&text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, "_blank");
    } else {
      alert("Contact number not available.");
    }
  };

  const handleCallClick = () => {
    if (listing && listing.contactNumber) {
      const callUrl = `tel:${listing.contactNumber}`;
      window.open(callUrl);
    } else {
      alert("Contact number not available.");
    }
  };

  return (
    <main className="bg-grayLight min-h-screen p-4">
      {loading && <p className="text-center my-7 text-2xl">Loading...</p>}
      {error && (
        <p className="text-center my-7 text-2xl">Something went wrong!</p>
      )}
      {listing && !loading && !error && (
        <div className="max-w-4xl mx-auto mb-20 shadow-lg rounded-lg">
          {/* Image Slider */}
          <div className="relative overflow-hidden rounded-t-lg">
            <Swiper navigation>
              {listing.imageUrls.map((url) => (
                <SwiperSlide key={url}>
                  <img
                    src={url}
                    alt="listing image"
                    className="w-full h-[350px] object-cover"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
            {/* Share Icon */}
            <div className="absolute top-4 right-4 z-10 border rounded-full w-10 h-10 flex justify-center items-center bg-white cursor-pointer shadow-lg hover:opacity-90 transition">
              <FaShareAlt
                className="text-brandBlue"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  setCopied(true);
                  setTimeout(() => {
                    setCopied(false);
                  }, 2000);
                }}
              />
            </div>
            {copied && (
              <div className="absolute top-16 right-4 z-20 p-2 bg-brandBlue text-white text-sm rounded-md shadow-lg">
                Link copied!
              </div>
            )}
          </div>

          {/* Listing Details */}
          <div className="bg-white p-6 rounded-b-lg">
            <p className="text-xl font-semibold mb-3 text-grayDark">
              {listing.name} - $
              {listing.offer
                ? listing.discountPrice.toLocaleString("en-US")
                : listing.regularPrice.toLocaleString("en-US")}
              {listing.type === "rent" && " / month"}
            </p>
            <p className="flex items-center gap-2 text-brandBlue mb-3 text-sm">
              <FaMapMarkerAlt />
              {listing.address}
            </p>
            <div className="flex gap-4 mb-3">
              <span className="bg-gradient-to-r from-blue-400 to-blue-600 text-white px-3 py-1 rounded-full text-xs shadow">
                {listing.type === "rent" ? "For Rent" : "For Sale"}
              </span>
              {listing.offer && (
                <span className="bg-gradient-to-r from-green-400 to-green-600 text-white px-3 py-1 rounded-full text-xs shadow">
                  ${+listing.regularPrice - +listing.discountPrice} Discount
                </span>
              )}
            </div>
            <p className="text-gray-700 mb-4 text-sm">
              <span className="font-semibold text-black">Description - </span>
              {listing.description}
            </p>
            <ul className="text-brandBlue font-semibold text-xs flex flex-wrap items-center gap-4 mb-5">
              <li className="flex items-center gap-1 whitespace-nowrap">
                <FaBed className="text-lg" />
                {listing.bedrooms > 1
                  ? `${listing.bedrooms} beds `
                  : `${listing.bedrooms} bed `}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap">
                <FaBath className="text-lg" />
                {listing.bathrooms > 1
                  ? `${listing.bathrooms} baths `
                  : `${listing.bathrooms} bath `}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap">
                <FaParking className="text-lg" />
                {listing.parking ? "Parking spot" : "No Parking"}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap">
                <FaChair className="text-lg" />
                {listing.furnished ? "Furnished" : "Unfurnished"}
              </li>
            </ul>
            {/* Contact Buttons */}
            <div className="flex gap-4 mt-4">
              <button
                className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-full shadow hover:bg-gray-300 transition"
                onClick={handleCallClick}
              >
                <FaPhone /> Call
              </button>
              <button
                className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-full shadow hover:bg-gray-300 transition"
                onClick={handleWhatsAppClick}
              >
                <FaWhatsapp /> WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer className="w-full mt-20" />
    </main>
  );
}
