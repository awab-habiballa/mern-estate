import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import {
  deleteUserFailure,
  deleteUserStart,
  deleteUserSucess,
  signOutUserFailure,
  signOutUserStart,
  signOutUserSucess,
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
} from "../redux/user/userSlice";
import { FaTrashAlt, FaSignOutAlt, FaListUl } from "react-icons/fa";
import Footer from "../components/Footer";
import useScrollToTop from "../hooks/useScrollToTop";

export default function Profile() {
  const fileRef = useRef(null);
  const { currentUser, error, loading } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState("");
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const [deleteListingError, setDeleteListingError] = useState(false);
  const [deleteListingLoading, setDeleteListingLoading] = useState(false);
  const dispatch = useDispatch();
  useScrollToTop();

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    setUpdateSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      setUpdateSuccess("");
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess("User updated successfully!");
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());

      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }

      dispatch(deleteUserSucess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch("api/auth/signout");
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
      }

      dispatch(signOutUserSucess(data));
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  };

  const handleShowListings = async () => {
    try {
      setShowListingsError(false);

      const res = await fetch(`api/user/listings/${currentUser._id}`);

      const data = await res.json();

      if (data.success === false) {
        setShowListingsError(true);
        return;
      }
      setUserListings(data);
    } catch (error) {
      setShowListingsError(true);
    }
  };

  const handelDeleteListing = async (listingId) => {
    try {
      setDeleteListingLoading(true);
      setDeleteListingError(false);

      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success === false) {
        setDeleteListingError("Failed to delete listing :)");
        setDeleteListingLoading(false);
        return;
      }

      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {
      setDeleteListingError("Failed to delete listing :)");
    }
  };

  return (
    <div className="bg-grayLight min-h-screen">
      <main className="p-5 max-w-xl mx-auto bg-white rounded-lg shadow-lg mt-10 mb-20">
        <h1 className="text-3xl font-semibold text-center my-7 text-brandBlue">
          Profile
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            onChange={(e) => setFile(e.target.files[0])}
            hidden
            type="file"
            ref={fileRef}
            accept="image/*"
          />
          <img
            onClick={() => fileRef.current.click()}
            className="rounded-full h-28 w-28 object-cover cursor-pointer self-center mt-2 shadow-lg"
            src={formData.avatar || currentUser.avatar}
            alt="profile"
          />
          <p className="text-sm self-center">
            {fileUploadError ? (
              <span className="text-red-700">
                Error Image Upload (image must be less than 2 mb)
              </span>
            ) : filePerc > 0 && filePerc < 100 ? (
              <span className="text-slate-700">{`uploading ${filePerc}%`}</span>
            ) : filePerc === 100 ? (
              <span className="text-green-700">
                Image Successfully uploaded!
              </span>
            ) : (
              ""
            )}
          </p>
          <input
            className="border p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brandBlue"
            type="text"
            placeholder="username"
            defaultValue={currentUser.username}
            id="username"
            onChange={handleChange}
          />
          <input
            className="border p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brandBlue"
            type="email"
            placeholder="email"
            defaultValue={currentUser.email}
            id="email"
            onChange={handleChange}
          />
          <input
            className="border p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brandBlue"
            type="password"
            placeholder="Password"
            id="password"
            onChange={handleChange}
          />
          <button
            disabled={loading}
            className="bg-brandBlue text-white rounded-lg p-3 uppercase hover:bg-hoverBlue transition duration-300 disabled:opacity-80"
          >
            {loading ? "Loading" : "Update"}
          </button>
        </form>
        <div className="flex justify-between mt-5">
          <button
            onClick={handleDeleteUser}
            className="flex items-center gap-2 text-red-600 cursor-pointer hover:text-red-700 transition duration-300"
          >
            <FaTrashAlt />
            Delete Account
          </button>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 text-red-600 cursor-pointer hover:text-red-700 transition duration-300"
          >
            <FaSignOutAlt />
            Sign Out
          </button>
        </div>
        {error && <p className="text-red-700 text-center mt-3">{error}</p>}
        {updateSuccess && (
          <p className="text-green-700 text-center mt-3">{updateSuccess}</p>
        )}

        <button
          onClick={handleShowListings}
          className="flex items-center justify-center gap-2 text-green-700 w-full mt-5 hover:underline transition duration-300"
        >
          <FaListUl />
          Show My Listings
        </button>
        <p className="text-red-700 mt-5">
          {showListingsError ? "Error showing listings :)" : ""}
        </p>

        {deleteListingError && (
          <p className="text-red-700 text-center mt-3">{deleteListingError}</p>
        )}

        {userListings &&
          userListings.length > 0 &&
          userListings.map((listing) => (
            <div
              key={listing._id}
              className="border-t-4 rounded-lg p-3 flex justify-between items-center gap-4 mt-5"
            >
              <Link to={`/listing/${listing._id}`}>
                <img
                  className="h-40 w-40 object-contain"
                  src={listing.imageUrls[0]}
                  alt="listing cover"
                />
              </Link>

              <Link
                className="flex-1 text-slate-700 font-semibold hover:underline truncate"
                to={`/listing/${listing._id}`}
              >
                <p>{listing.name}</p>
              </Link>

              <div className="flex items-center gap-2">
                <button
                  disabled={deleteListingLoading}
                  onClick={() => handelDeleteListing(listing._id)}
                  className="text-red-700 uppercase"
                >
                  Delete
                </button>
                <Link to={`/update-listing/${listing._id}`}>
                  <button className="text-green-700 uppercase">Edit</button>
                </Link>
              </div>
            </div>
          ))}
      </main>
      <Footer />
    </div>
  );
}
