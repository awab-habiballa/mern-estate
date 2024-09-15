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
import { FaUpload, FaBed, FaBath } from "react-icons/fa"; // Removed FaParking
import Footer from "../components/Footer";

export default function UpdateListing() {
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    contactNumber: "+971", // Default country code for UAE
    type: "rent",
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
    const { id, value, type } = e.target;

    if (id === "sell" || id === "rent") {
      setFormData({ ...formData, type: id });
    }

    if (id === "parking" || id === "furnished" || id === "offer") {
      setFormData({ ...formData, [id]: e.target.checked });
    }

    if (type === "number" || type === "text" || type === "textarea") {
      setFormData({ ...formData, [id]: value });
    }
  };

  const validateContactNumber = (number) => {
    // Regex pattern for validating UAE phone numbers starting with +971 and exactly 9 digits
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
          className="flex flex-col md:flex-row gap-8"
        >
          <div className="flex flex-col gap-6 flex-1">
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
              type="text"
              placeholder="Description"
              className="border p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brandBlue"
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
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="+971"
                className="w-24 border p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brandBlue"
                id="contactNumberCode"
                readOnly
              />
              <input
                type="text"
                placeholder="Contact Number (9 digits)"
                className="flex-1 border p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brandBlue"
                id="contactNumber"
                maxLength="9"
                minLength="9"
                required
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    contactNumber: "+971" + e.target.value,
                  })
                }
                value={formData.contactNumber?.slice(4)} // Use optional chaining
              />
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
            <h2 className="text-lg font-semibold text-brandBlue">
              Price and Rooms
            </h2>
            <div className="flex flex-wrap gap-6">
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
          <div className="flex flex-col flex-1 gap-4">
            <h2 className="text-lg font-semibold text-brandBlue">
              Upload Images
            </h2>
            <p className="text-sm text-gray-600">
              The first image will be the cover (max 6).
            </p>
            <div className="flex gap-4">
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
                className="p-3 text-white bg-green-500 rounded-lg uppercase hover:bg-green-600 transition duration-300"
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
                  className="flex justify-between p-3 border items-center rounded-lg"
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
            <button
              disabled={uploading || loading}
              className="p-3 bg-brandBlue text-white rounded-lg uppercase hover:bg-hoverBlue transition duration-300 disabled:opacity-80"
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
