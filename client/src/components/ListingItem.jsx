import { Link } from "react-router-dom";
import { MdLocationOn, MdBed, MdBathtub } from "react-icons/md";
import { FaWhatsapp, FaPhoneAlt } from "react-icons/fa";

export default function ListingItem({ listing }) {
  const handleWhatsAppClick = (e) => {
    e.stopPropagation();
    if (listing.contactNumber) {
      const listingUrl = `https://yourwebsite.com/listing/${listing._id}`; // Replace with your actual website URL

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
    }
  };

  const handleCallClick = (e) => {
    e.stopPropagation();
    if (listing.contactNumber) {
      const callUrl = `tel:${listing.contactNumber}`;
      window.open(callUrl);
    }
  };

  return (
    <div className="bg-white border border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-500 rounded-lg w-full sm:w-[330px] overflow-hidden transform hover:scale-[1.01]">
      <Link to={`/listing/${listing._id}`}>
        {/* Image Section */}
        <div className="relative">
          <img
            className="h-[320px] sm:h-[220px] w-full object-cover transition-transform duration-500 hover:scale-[1.01]"
            src={listing.imageUrls[0]}
            alt="listing cover"
          />
          {/* View Details Overlay */}
          <div className="absolute inset-0 bg-black opacity-0 hover:opacity-30 transition-opacity duration-500 flex justify-center items-center text-white font-semibold text-lg">
            View Details
          </div>
        </div>

        {/* Details Section */}
        <div className="p-4 flex flex-col gap-2">
          <p className="truncate text-lg font-semibold text-slate-700">
            {listing.name}
          </p>

          <div className="flex items-center gap-1 text-slate-600">
            <MdLocationOn className="h-5 w-5 text-brandBlue" />
            <p className="text-sm truncate">{listing.address}</p>
          </div>

          <p className="text-gray-600 text-sm line-clamp-2">
            {listing.description}
          </p>

          <p className="text-brandBlue mt-2 font-semibold">
            {listing.offer && (
              <span className="text-red-500 line-through mr-2">
                ${listing.regularPrice.toLocaleString("en-US")}
              </span>
            )}
            $
            {listing.offer
              ? listing.discountPrice.toLocaleString("en-US")
              : listing.regularPrice.toLocaleString("en-US")}
            {listing.type === "rent" && " / month"}
          </p>

          <div className="flex justify-between text-sm text-slate-600 mt-2">
            <div className="flex items-center gap-1">
              <MdBed className="h-5 w-5" />
              <span className="font-medium">
                {listing.bedrooms > 1
                  ? `${listing.bedrooms} beds`
                  : `${listing.bedrooms} bed`}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <MdBathtub className="h-5 w-5" />
              <span className="font-medium">
                {listing.bathrooms > 1
                  ? `${listing.bathrooms} baths`
                  : `${listing.bathrooms} bath`}
              </span>
            </div>
          </div>
        </div>
      </Link>

      {/* Footer Section with WhatsApp and Call Icons */}
      <div className="flex justify-between items-center border-t border-gray-200 px-4 py-2">
        <button
          onClick={handleWhatsAppClick}
          className={`text-green-500 hover:text-green-600 transition ${
            !listing.contactNumber ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={!listing.contactNumber}
        >
          <FaWhatsapp className="h-6 w-6" />
        </button>
        <button
          onClick={handleCallClick}
          className={`text-blue-500 hover:text-blue-600 transition ${
            !listing.contactNumber ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={!listing.contactNumber}
        >
          <FaPhoneAlt className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
}
