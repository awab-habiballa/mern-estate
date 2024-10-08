import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { FaUpload, FaBed, FaBath } from "react-icons/fa";
import Footer from "../components/Footer";
import useScrollToTop from "../hooks/useScrollToTop";

export default function UpdateListing() {
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    contactNumber: "+971", // Default to UAE country code
    type: "rent", // Default to 'rent'
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const params = useParams();
  const navigate = useNavigate();
  useScrollToTop();

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const listingId = params.listingId;
        const res = await fetch(`/api/listing/get/${listingId}`);
        const data = await res.json();
        if (data.success === false) {
          console.log(data.message);
          return;
        }

        // Set default contactNumber if not present in fetched data
        const updatedData = {
          ...data,
          contactNumber: data.contactNumber || "+971",
        };

        setFormData(updatedData);
      } catch (error) {
        console.log("Failed to fetch listing:", error);
      }
    };

    fetchListing();
  }, [params.listingId]);

  const handleImageSubmit = () => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);

      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }

      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((err) => {
          setImageUploadError("Image upload failed (2 mb max per image)");
          setUploading(false);
        });
    } else {
      setImageUploadError("You can only upload 6 images per listing");
      setUploading(false);
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downLoadURL) => {
            resolve(downLoadURL);
          });
        }
      );
    });
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleChange = (e) => {
    if (e.target.id === "sell") {
      setFormData({ ...formData, type: "sell" });
    } else if (e.target.id === "rent") {
      setFormData({ ...formData, type: "rent" });
    }

    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setFormData({ ...formData, [e.target.id]: e.target.checked });
    }

    if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.type === "textarea"
    ) {
      setFormData({ ...formData, [e.target.id]: e.target.value });
    }
  };

  const validateContactNumber = (number) => {
    const regex = /^\+971\d{9}$/;
    return regex.test(number);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate contact number
    if (!validateContactNumber(formData.contactNumber)) {
      return setError(
        "Please enter a valid UAE contact number starting with +971 followed by 9 digits"
      );
    }

    try {
      if (formData.imageUrls.length < 1)
        return setError("You must upload at least one image");

      if (+formData.regularPrice < +formData.discountPrice)
        return setError("Discount price must be lower than regular price");

      setLoading(true);
      setError(false);

      const res = await fetch(`/api/listing/update/${params.listingId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });

      const data = await res.json();

      setLoading(false);

      if (data.success === false) {
        setError(data.message);
      }

      navigate(`/listing/${data._id}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="bg-grayLight min-h-screen flex flex-col justify-between">
      <main className="p-5 max-w-5xl mx-auto bg-white rounded-lg shadow-lg mt-10 mb-20">
        <h1 className="text-3xl text-center font-semibold my-7 text-brandBlue">
          Update Listing
        </h1>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {/* Left Column */}
          <div className="flex flex-col gap-6">
            <h2 className="text-lg font-semibold text-brandBlue">
              Property Details
            </h2>
            <input
              type="text"
              placeholder="Name"
              className="border p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brandBlue"
              id="name"
              maxLength="62"
              minLength="10"
              required
              onChange={handleChange}
              value={formData.name}
            />
            <textarea
              placeholder="Description"
              className="border p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brandBlue h-32"
              id="description"
              required
              onChange={handleChange}
              value={formData.description}
            />
            <input
              type="text"
              placeholder="Address"
              className="border p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brandBlue"
              id="address"
              required
              onChange={handleChange}
              value={formData.address}
            />

            {/* Contact Number */}
            <input
              type="text"
              placeholder="Contact Number (e.g. +971123456789)"
              className="border p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brandBlue"
              id="contactNumber"
              maxLength="13"
              minLength="10"
              required
              onChange={handleChange}
              value={formData.contactNumber}
            />

            {/* Rent or Sell Checkboxes */}
            <div className="flex gap-6 flex-wrap">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="rent"
                  className="w-5 accent-brandBlue"
                  onChange={handleChange}
                  checked={formData.type === "rent"}
                />
                <span>Rent</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="sell"
                  className="w-5 accent-brandBlue"
                  onChange={handleChange}
                  checked={formData.type === "sell"}
                />
                <span>Sell</span>
              </div>
            </div>

            <h2 className="text-lg font-semibold text-brandBlue">
              Additional Information
            </h2>
            <div className="flex gap-6 flex-wrap">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="offer"
                  className="w-5 accent-brandBlue"
                  onChange={handleChange}
                  checked={formData.offer}
                />
                <span>Offer</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="parking"
                  className="w-5 accent-brandBlue"
                  onChange={handleChange}
                  checked={formData.parking === true}
                />
                <span>Parking spot</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="furnished"
                  className="w-5 accent-brandBlue"
                  onChange={handleChange}
                  checked={formData.furnished}
                />
                <span>Furnished</span>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-6">
            <h2 className="text-lg font-semibold text-brandBlue">
              Upload Images
            </h2>
            <p className="text-sm text-gray-600">
              The first image will be the cover (max 6).
            </p>
            <div className="flex flex-wrap gap-2">
              <input
                onChange={(e) => setFiles(e.target.files)}
                className="p-3 border border-gray-300 rounded-lg shadow-sm"
                type="file"
                id="images"
                accept="image/*"
                multiple
              />
              <button
                type="button"
                disabled={uploading}
                onClick={handleImageSubmit}
                className="p-2 md:p-3 text-white bg-green-500 rounded-lg uppercase hover:bg-green-600 transition duration-300"
              >
                <FaUpload className="inline-block mr-2" />
                {uploading ? "Uploading..." : "Upload"}
              </button>
            </div>
            <p className="text-red-700 text-sm">
              {imageUploadError && imageUploadError}
            </p>
            {formData.imageUrls.length > 0 &&
              formData.imageUrls.map((url, index) => (
                <div
                  key={url}
                  className="flex justify-between p-2 border items-center rounded-lg"
                >
                  <img
                    src={url}
                    alt="listing image"
                    className="w-20 h-20 object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="p-2 text-red-700 border border-red-700 rounded-lg uppercase hover:bg-red-100 transition duration-300"
                  >
                    Delete
                  </button>
                </div>
              ))}
            <h2 className="text-lg font-semibold text-brandBlue">
              Price and Rooms
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="bedrooms"
                  min="1"
                  max="10"
                  required
                  className="p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brandBlue"
                  onChange={handleChange}
                  value={formData.bedrooms}
                />
                <FaBed />
                <p>Beds</p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="bathrooms"
                  min="1"
                  max="10"
                  required
                  className="p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brandBlue"
                  onChange={handleChange}
                  value={formData.bathrooms}
                />
                <FaBath />
                <p>Baths</p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="regularPrice"
                  min="50"
                  max="1000000"
                  required
                  className="p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brandBlue"
                  onChange={handleChange}
                  value={formData.regularPrice}
                />
                <div className="flex flex-col items-center">
                  <p>Regular price</p>
                  <span className="text-xs">($ / month)</span>
                </div>
              </div>
              {formData.offer && (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    id="discountPrice"
                    min="0"
                    max="1000000"
                    required
                    className="p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brandBlue"
                    onChange={handleChange}
                    value={formData.discountPrice}
                  />
                  <div className="flex flex-col items-center">
                    <p>Discounted price</p>
                    <span className="text-xs">($ / month)</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Full-width section for buttons and errors */}
          <div className="col-span-1 md:col-span-2 flex flex-col gap-4 mt-6">
            <button
              disabled={uploading || loading}
              className="p-2 md:p-3 bg-brandBlue text-white rounded-lg uppercase hover:bg-hoverBlue transition duration-300 disabled:opacity-80"
            >
              {loading ? "Updating..." : "Update Listing"}
            </button>
            {error && <p className="text-red-700 text-sm">{error}</p>}
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
}
