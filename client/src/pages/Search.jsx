import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import ListingItem from "../components/ListingItem";
import Footer from "../components/Footer";

export default function Search() {
  const navigate = useNavigate();
  const [sidebarData, setSidebarData] = useState({
    searchTerm: "",
    type: "all",
    parking: false,
    furnished: false,
    offer: false,
    sort: "created_at",
    order: "desc",
  });
  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const typeFromUrl = urlParams.get("type");
    const parkingFromUrl = urlParams.get("parking");
    const sortFromUrl = urlParams.get("sort");
    const orderFromUrl = urlParams.get("order");
    const furnishedFromUrl = urlParams.get("furnished");
    const offerFromUrl = urlParams.get("offer");

    if (
      searchTermFromUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      sortFromUrl ||
      orderFromUrl ||
      furnishedFromUrl
    ) {
      setSidebarData({
        searchTerm: searchTermFromUrl || "",
        type: typeFromUrl || "all",
        parking: parkingFromUrl === "true" ? true : false,
        furnished: furnishedFromUrl === "true" ? true : false,
        offer: offerFromUrl === "true" ? true : false,
        sort: sortFromUrl || "created_at",
        order: orderFromUrl || "desc",
      });
    }

    const fetchListing = async () => {
      setLoading(true);
      setShowMore(false);
      const searchQuery = urlParams.toString();
      const res = await fetch(`api/listing/get?${searchQuery}`);
      const data = await res.json();
      if (data.length > 8) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
      setListings(data);
      setLoading(false);
    };

    fetchListing();
  }, [location.search]);

  const handleChnage = (e) => {
    if (
      e.target.id === "all" ||
      e.target.id === "rent" ||
      e.target.id === "sell"
    ) {
      setSidebarData({ ...sidebarData, type: e.target.id });
    }

    if (e.target.id === "searchTerm") {
      setSidebarData({ ...sidebarData, searchTerm: e.target.value });
    }

    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setSidebarData({
        ...sidebarData,
        [e.target.id]:
          e.target.checked || e.target.checked === "true " ? true : false,
      });
    }

    if (e.target.id === "sort_order") {
      const sort = e.target.value.split("_")[0] || "created_at";
      const order = e.target.value.split("_")[1] || "desc";
      setSidebarData({ ...sidebarData, sort, order });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", sidebarData.searchTerm);
    urlParams.set("type", sidebarData.type);
    urlParams.set("parking", sidebarData.parking);
    urlParams.set("furnished", sidebarData.furnished);
    urlParams.set("offer", sidebarData.offer);
    urlParams.set("sort", sidebarData.sort);
    urlParams.set("order", sidebarData.order);

    const searchQuery = urlParams.toString();

    navigate(`/search?${searchQuery}`);
  };

  // Function to reset filters
  const handleResetFilters = () => {
    setSidebarData({
      searchTerm: "",
      type: "all",
      parking: false,
      furnished: false,
      offer: false,
      sort: "created_at",
      order: "desc",
    });
    navigate("/search");
  };

  const onShowMoreClick = async () => {
    const numberOfListings = listings.length;
    const startIndex = numberOfListings;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);
    console.log(startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`api/listing/get?${searchQuery}`);
    const data = await res.json();
    console.log(data);

    if (data.length < 9) {
      setShowMore(false);
    }
    setListings([...listings, ...data]);
  };

  return (
    <div className="bg-grayLight min-h-screen">
      <div className="max-w-7xl mb-20 mx-auto py-10 px-6 flex flex-col md:flex-row gap-8">
        {/* Sidebar (Search Form) */}
        <div className="md:w-1/3">
          <div className="bg-white shadow-md rounded-lg p-7">
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="relative">
                <input
                  type="text"
                  id="searchTerm"
                  placeholder="Location, Building, ..."
                  className="w-full p-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brandBlue"
                  value={sidebarData.searchTerm}
                  onChange={handleChnage}
                />
                <button
                  type="submit"
                  className="absolute right-3 top-2/4 transform -translate-y-2/4 bg-brandBlue p-2 rounded-full hover:bg-hoverBlue transition duration-300"
                >
                  <FaSearch className="text-white" />
                </button>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex gap-4 flex-wrap">
                  {/* Segmented Control for Type */}
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="all"
                      className="w-4 h-4 text-brandBlue focus:ring-brandBlue border-gray-300 rounded"
                      onChange={handleChnage}
                      checked={sidebarData.type === "all"}
                    />
                    <span>Rent & Sell</span>
                  </div>
                  {/* Other checkboxes... */}
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="rent"
                      className="w-4 h-4 text-brandBlue focus:ring-brandBlue border-gray-300 rounded"
                      onChange={handleChnage}
                      checked={sidebarData.type === "rent"}
                    />
                    <span>Rent</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="sell"
                      className="w-4 h-4 text-brandBlue focus:ring-brandBlue border-gray-300 rounded"
                      onChange={handleChnage}
                      checked={sidebarData.type === "sell"}
                    />
                    <span>Sell</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="offer"
                      className="w-4 h-4 text-brandBlue focus:ring-brandBlue border-gray-300 rounded"
                      onChange={handleChnage}
                      checked={sidebarData.offer}
                    />
                    <span>Offer</span>
                  </div>
                </div>
              </div>

              {/* Amenities */}
              <div className="flex flex-col gap-4">
                <div className="flex gap-4 flex-wrap">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="parking"
                      className="w-4 h-4 text-brandBlue focus:ring-brandBlue border-gray-300 rounded"
                      onChange={handleChnage}
                      checked={sidebarData.parking}
                    />
                    <span>Parking</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="furnished"
                      className="w-4 h-4 text-brandBlue focus:ring-brandBlue border-gray-300 rounded"
                      onChange={handleChnage}
                      checked={sidebarData.furnished}
                    />
                    <span>Furnished</span>
                  </div>
                </div>
              </div>

              {/* Sort */}
              <div className="flex flex-col gap-2">
                <select
                  onChange={handleChnage}
                  defaultValue={"created_at_desc"}
                  id="sort_order"
                  className="border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-brandBlue"
                >
                  <option value="createdAt_desc">Latest</option>
                  <option value="regularPrice_desc">Price high to low</option>
                  <option value="regularPrice_asc">Price low to high</option>
                  <option value="createdAt_asc">Oldest</option>
                </select>
              </div>

              {/* Buttons */}
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-brandBlue text-white p-3 rounded-full hover:bg-hoverBlue transition duration-300 uppercase font-bold flex-1"
                >
                  Search
                </button>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="bg-gray-200 text-gray-700 p-3 rounded-full hover:bg-gray-300 transition duration-300 uppercase font-bold flex-1"
                >
                  Remove Filters
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Main Content (Listing Results) */}
        <div className="flex-1">
          <h1 className="text-3xl font-poppins font-bold text-brandBlue border-b pb-4 mb-4">
            Available Properties
          </h1>
          <div className="flex flex-wrap gap-6">
            {!loading && listings.length === 0 && (
              <p className="text-xl text-grayDark">No listings found!</p>
            )}
            {loading && (
              <p className="text-xl text-grayDark text-center w-full">
                Loading...
              </p>
            )}
            {!loading &&
              listings &&
              listings.map((listing) => (
                <ListingItem key={listing._id} listing={listing} />
              ))}
            {showMore && (
              <button
                onClick={onShowMoreClick}
                className="text-brandBlue hover:underline p-4 font-semibold text-center w-full"
              >
                Show more
              </button>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
