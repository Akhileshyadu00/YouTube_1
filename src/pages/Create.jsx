import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom";
import { MdOutlineFeedback, MdOutlineCancel } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function Create() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [inputField, setInputField] = useState({
    title: "",
    description: "",
    videoLink: "",
    thumbnail: "",
    category: "",
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const categories = [
    "Music",
    "Gaming",
    "News",
    "Live",
    "UPSC",
    "English",
    "React",
    "Javascript",
  ];

  const handleChange = (e) => {
    setInputField({ ...inputField, [e.target.name]: e.target.value });
  };

  const uploadVideo = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setErrorMessage("");

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "Youtube-clone");

    try {
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/djthu0xcg/video/upload",
        data
      );
      setInputField((prev) => ({ ...prev, videoLink: res.data.secure_url }));
      toast.success("🎥 Video uploaded successfully!");
    } catch (err) {
      console.error("Video upload failed:", err);
      toast.error("❌ Failed to upload video.");
      setErrorMessage("Video upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const uploadImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPreviewImage(URL.createObjectURL(file));
    setUploading(true);
    setErrorMessage("");

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "Youtube-clone");

    try {
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/djthu0xcg/image/upload",
        data
      );
      setInputField((prev) => ({ ...prev, thumbnail: res.data.secure_url }));
      toast.success("🖼️ Image uploaded successfully!");
    } catch (err) {
      console.error("Image upload failed:", err);
      toast.error("❌ Failed to upload image.");
      setErrorMessage("Image upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    const { title, videoLink, thumbnail, category } = inputField;

    if (!title.trim() || !videoLink || !thumbnail || !category.trim()) {
      toast.warning("⚠️ Please fill in all required fields.");
      return;
    }

    try {
      const payload = { ...inputField, userId: id };
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:4001/api/videos",
        payload,
        {
          headers: {
            Authorization: `JWT ${token}`,
          },
          withCredentials: true,
        }
      );

      toast.success("✅ Video uploaded successfully!");
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      console.error("Submit failed:", err);
      toast.error("❌ Failed to upload video.");
      setErrorMessage("Upload failed. Please check your connection or inputs.");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, []);

  return (
    <div className="bg-black text-white min-h-screen px-6 pt-20">
      <ToastContainer position="top-right" autoClose={4000} />

      <div className="flex justify-between items-center mb-10">
        <h1 className="text-2xl font-bold">Upload Video</h1>
        <div className="flex gap-4 text-2xl">
          <MdOutlineFeedback className="cursor-pointer hover:text-gray-400" />
          <MdOutlineCancel
            onClick={() => navigate("/")}
            className="cursor-pointer hover:text-red-500"
          />
        </div>
      </div>

      <div className="flex justify-center">
        <div className="w-full max-w-lg bg-gray-900 p-6 rounded-lg shadow-md">
          <form onSubmit={handleSubmit}>
            {/* Title */}
            <div className="mb-5">
              <label className="block mb-2 text-sm font-semibold">
                Video Title
              </label>
              <input
                name="title"
                type="text"
                value={inputField.title}
                onChange={handleChange}
                placeholder="Enter a title..."
                className="w-full p-2 rounded bg-gray-800 text-white"
                required
                disabled={uploading}
              />
            </div>

            {/* Description */}
            <div className="mb-5">
              <label className="block mb-2 text-sm font-semibold">
                Description
              </label>
              <input
                name="description"
                type="text"
                value={inputField.description}
                onChange={handleChange}
                placeholder="Enter description..."
                className="w-full p-2 rounded bg-gray-800 text-white"
                disabled={uploading}
              />
            </div>

            {/* Category */}
            <div className="mb-5">
              <label className="block mb-2 text-sm font-semibold">
                Category
              </label>
              <select
                name="category"
                value={inputField.category}
                onChange={handleChange}
                className="w-full p-2 rounded bg-gray-800 text-white"
                required
                disabled={uploading}
              >
                <option value="">Select category...</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Thumbnail Upload */}
            <div className="mb-6">
              <label className="block mb-2 text-sm font-semibold">
                Thumbnail Image
              </label>
              <input
                onChange={uploadImage}
                type="file"
                accept="image/*"
                className="w-full text-sm text-gray-300 file:bg-gray-700 file:text-white file:border-none"
                disabled={uploading}
                required={!inputField.thumbnail}
              />
              {previewImage && (
                <img
                  src={previewImage}
                  alt="Thumbnail preview"
                  className="mt-4 w-32 h-32 object-cover rounded border border-gray-700"
                />
              )}
            </div>

            {/* Video Upload */}
            <div className="mb-6">
              <label className="block mb-2 text-sm font-semibold">
                Video File
              </label>
              <input
                onChange={uploadVideo}
                type="file"
                accept="video/*"
                className="w-full text-sm text-gray-300 file:bg-gray-700 file:text-white"
                disabled={uploading}
                required={!inputField.videoLink}
              />
              {inputField.videoLink && (
                <p className="text-green-400 text-sm mt-2">
                  ✅ Video uploaded successfully.
                </p>
              )}
            </div>

            {/* Error Message */}
            {errorMessage && (
              <p className="text-red-400 text-sm mt-2">{errorMessage}</p>
            )}

            {/* Submit Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <button
                type="submit"
                disabled={uploading}
                className={`w-full sm:w-auto px-6 py-2 rounded-full font-medium transition text-center ${
                  uploading
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-red-600 hover:bg-red-700 text-white"
                }`}
              >
                {uploading ? "Uploading..." : "Upload Video"}
              </button>
              <Link to="/">
                <button
                  type="button"
                  className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full font-medium transition text-center"
                >
                  Home
                </button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Create;
