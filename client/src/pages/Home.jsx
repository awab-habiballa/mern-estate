import { useEffect, useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import ListingItem from "../components/ListingItem";
import Footer from "../components/Footer";
import EmiratesSelector from "../components/EmiratesSelector";

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);

  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch("/api/listing/get?offer=true&limit=3");
        const data = await res.json();
        setOfferListings(data);
        fetchRentListings();
      } catch (error) {
        console.log(error);
      }
    };
    const fetchRentListings = async () => {
      try {
        const res = await fetch("/api/listing/get?type=rent&limit=5");
        const data = await res.json();
        setRentListings(data);
        fetchSaleListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSaleListings = async () => {
      try {
        const res = await fetch("/api/listing/get?type=sell&limit=5");
        const data = await res.json();
        setSaleListings(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchOfferListings();
  }, []);

  return (
    <div className="font-sans">
      {/* Hero Section */}
      <div className="relative h-[60vh] overflow-hidden">
        {" "}
        {/* Adjusted height */}
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src="/videos/Uae-Real-Estate.mp4"
          autoPlay
          loop
          muted
          playsInline
        ></video>
        <div className="absolute inset-0 bg-gradient-to-r from-gray-800 via-transparent to-gray-800 opacity-60"></div>
        <div className="relative z-10 p-6 lg:p-20 flex flex-col gap-6 max-w-6xl mx-auto text-center lg:text-left">
          <h1 className="text-white font-poppins font-bold text-3xl lg:text-5xl tracking-tight">
            Discover Your <span className="text-brandBlue">Perfect</span> <br />
            Home with Confidence
          </h1>

          <p className="text-white text-sm lg:text-lg leading-relaxed">
            Awab Properties offers a curated selection of premium properties.
            Find your dream home in our exclusive listings.
          </p>

          <Link
            to="/search"
            className="mt-4 h-12 w-48 flex items-center justify-center bg-brandBlue text-white font-bold rounded-full hover:bg-hoverBlue transition duration-300 text-md inline-block shadow-md space-x-2"
          >
            <span className="text-white">Start Your Search</span>
            <FaArrowRight className="text-white text-lg" />
          </Link>
        </div>
      </div>

      <EmiratesSelector />

      {/* Main Content Section with Light Grey Background */}
      <div className="bg-grayLight py-10">
        <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col gap-16">
          {offerListings && offerListings.length > 0 && (
            <div>
              <div className="my-4 flex justify-between items-center">
                <h2 className="text-2xl sm:text-3xl font-poppins font-bold text-grayDark">
                  Exclusive Offers
                </h2>
                <Link
                  className="text-sm sm:text-md text-brandBlue hover:text-hoverBlue transition duration-300"
                  to={"/search?offer=true"}
                >
                  View More Offers
                </Link>
              </div>
              <div className="flex flex-wrap gap-6">
                {offerListings.map((listing) => (
                  <ListingItem listing={listing} key={listing._id} />
                ))}
              </div>
            </div>
          )}
          {rentListings && rentListings.length > 0 && (
            <div>
              <div className="my-4 flex justify-between items-center">
                <h2 className="text-2xl sm:text-3xl font-poppins font-bold text-grayDark">
                  Recent Places for Rent
                </h2>
                <Link
                  className="text-sm sm:text-md text-brandBlue hover:text-hoverBlue transition duration-300"
                  to={"/search?type=rent"}
                >
                  View More Rentals
                </Link>
              </div>
              <div className="flex flex-wrap gap-6">
                {rentListings.map((listing) => (
                  <ListingItem listing={listing} key={listing._id} />
                ))}
              </div>
            </div>
          )}
          {saleListings && saleListings.length > 0 && (
            <div>
              <div className="my-4 flex justify-between items-center">
                <h2 className="text-2xl sm:text-3xl font-poppins font-bold text-grayDark">
                  Recent Places for Sale
                </h2>
                <Link
                  className="text-sm sm:text-md text-brandBlue hover:text-hoverBlue transition duration-300"
                  to={"/search?type=sell"}
                >
                  View More Sales
                </Link>
              </div>
              <div className="flex flex-wrap gap-6">
                {saleListings.map((listing) => (
                  <ListingItem listing={listing} key={listing._id} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
