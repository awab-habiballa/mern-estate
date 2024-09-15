import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FiTrash2, FiEdit } from "react-icons/fi"; // Modern icons
import Footer from "../components/Footer";

export default function MyListings() {
  const { currentUser } = useSelector((state) => state.user);
  const [userListings, setUserListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [deleteListingError, setDeleteListingError] = useState(false);

  useEffect(() => {
    const fetchUserListings = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/user/listings/${currentUser._id}`);
        const data = await res.json();
        if (data.success === false) {
          setError("Failed to fetch listings.");
          setLoading(false);
          return;
        }
        setUserListings(data);
        setLoading(false);
      } catch (error) {
        setError("Error fetching listings.");
        setLoading(false);
      }
    };
    if (currentUser) {
      fetchUserListings();
    }
  }, [currentUser]);

  const handleDeleteListing = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        setDeleteListingError("Failed to delete listing.");
        return;
      }
      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {
      setDeleteListingError("Failed to delete listing.");
    }
  };

  return (
    <div className="bg-grayLight min-h-screen">
      <main className="p-5 max-w-6xl mx-auto mt-10 mb-20">
        <h1 className="text-3xl font-semibold text-center my-7 text-brandBlue">
          My Listings
        </h1>
        {loading && <p className="text-center text-lg">Loading...</p>}
        {error && <p className="text-red-700 text-center mt-3">{error}</p>}
        {deleteListingError && (
          <p className="text-red-700 text-center mt-3">{deleteListingError}</p>
        )}

        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {userListings.length > 0
            ? userListings.map((listing) => (
                <div
                  key={listing._id}
                  className="bg-white shadow-md rounded-lg overflow-hidden flex flex-col justify-between transform transition-transform hover:scale-102 hover:shadow-lg"
                >
                  <Link to={`/listing/${listing._id}`}>
                    <img
                      className="w-full h-48 object-cover rounded-t-lg"
                      src={listing.imageUrls[0]}
                      alt="listing cover"
                    />
                  </Link>
                  <div className="p-4 flex flex-col flex-grow">
                    <Link
                      className="text-grayDark font-semibold hover:underline truncate mb-2"
                      to={`/listing/${listing._id}`}
                    >
                      {listing.name}
                    </Link>
                    <div className="mt-auto flex justify-between items-center pt-2 border-t border-gray-200">
                      <button
                        onClick={() => handleDeleteListing(listing._id)}
                        className="text-red-600 hover:text-red-800 p-2"
                      >
                        <FiTrash2 className="text-lg" />{" "}
                        {/* Modern trash icon */}
                      </button>
                      <Link to={`/update-listing/${listing._id}`}>
                        <button className="text-green-600 hover:text-green-800 p-2">
                          <FiEdit className="text-lg" />{" "}
                          {/* Modern edit icon */}
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            : !loading &&
              !error && (
                <p className="text-center text-gray-700 text-lg col-span-full">
                  No listings found.
                </p>
              )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
