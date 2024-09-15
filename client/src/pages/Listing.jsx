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

  return (
    <main className="bg-grayLight min-h-screen p-4">
      {loading && <p className="text-center my-7 text-2xl">Loading...</p>}
      {error && (
        <p className="text-center my-7 text-2xl">Something went wrong!</p>
      )}
      {listing && !loading && !error && (
        <div className="max-w-5xl mx-auto mb-20">
          {/* Image Slider */}
          <div className="relative overflow-hidden shadow-lg rounded-t-lg">
            {" "}
            {/* Added rounded-t-lg for top rounded corners */}
            <Swiper navigation>
              {listing.imageUrls.map((url) => (
                <SwiperSlide key={url}>
                  <img
                    src={url}
                    alt="listing image"
                    className="w-full h-[550px] object-cover"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
            {/* Share Icon */}
            <div className="absolute top-4 right-4 z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-white cursor-pointer shadow-lg hover:opacity-90 transition">
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
              <p className="fixed top-16 right-8 z-10 rounded-md bg-white p-2 shadow-md">
                Link copied!
              </p>
            )}
          </div>

          {/* Listing Details */}
          <div className="bg-white shadow-lg p-8 rounded-b-lg">
            {" "}
            <p className="text-3xl font-semibold mb-4 text-grayDark">
              {listing.name} - $
              {listing.offer
                ? listing.discountPrice.toLocaleString("en-US")
                : listing.regularPrice.toLocaleString("en-US")}
              {listing.type === "rent" && " / month"}
            </p>
            <p className="flex items-center gap-2 text-brandBlue mb-4">
              <FaMapMarkerAlt />
              {listing.address}
            </p>
            <div className="flex gap-4 mb-4">
              <span className="bg-gradient-to-r from-blue-400 to-blue-600 text-white px-4 py-1 rounded-full text-sm shadow">
                {listing.type === "rent" ? "For Rent" : "For Sale"}
              </span>
              {listing.offer && (
                <span className="bg-gradient-to-r from-green-400 to-green-600 text-white px-4 py-1 rounded-full text-sm shadow">
                  ${+listing.regularPrice - +listing.discountPrice} Discount
                </span>
              )}
            </div>
            <p className="text-gray-700 mb-4">
              <span className="font-semibold text-black">Description - </span>
              {listing.description}
            </p>
            <ul className="text-brandBlue font-semibold text-sm flex flex-wrap items-center gap-6 mb-6">
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
            <div className="flex gap-4 mt-6">
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-full shadow hover:bg-gray-300 transition">
                <FaPhone /> Call
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-full shadow hover:bg-gray-300 transition">
                <FaWhatsapp /> WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer should be outside the listing container */}
      <Footer className="w-full mt-20" />
    </main>
  );
}
