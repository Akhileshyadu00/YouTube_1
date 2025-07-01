import React, { useState } from "react";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom";
import { MdOutlineFeedback, MdOutlineCancel } from "react-icons/md";

function Create() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [previewImage, setPreviewImage] = useState(null);

  const uploadVideo = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const data = new FormData();
    data.append("file", files[0]);
    data.append("upload_preset", "Youtube-clone");

    try {
      const uploadResponse = await axios.post(
        "https://api.cloudinary.com/v1_1/djthu0xcg/video/upload",
        data
      );
      setVideoUrl(uploadResponse.data.secure_url);
      console.log("Uploaded video URL:", uploadResponse.data.secure_url);
    } catch (err) {
      console.error("Video upload failed:", err);
    }
  };

  const uploadImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPreviewImage(URL.createObjectURL(file));

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "Youtube-clone");

    try {
      const uploadResponse = await axios.post(
        "https://api.cloudinary.com/v1_1/djthu0xcg/image/upload",
        data
      );
      setImageUrl(uploadResponse.data.secure_url);
      console.log("Uploaded image URL:", uploadResponse.data.secure_url);
    } catch (err) {
      console.error("Image upload failed:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!videoUrl || !imageUrl) {
      alert("Please upload both video and image before submitting.");
      return;
    }

    const videoData = {
      userId: id,
      title,
      description,
      category,
      videoUrl,
      imageUrl,
    };

    try {
      console.log("Submitting video data:", videoData);
      // Example backend call
      // await axios.post("/api/videos", videoData);
      alert("Video and image uploaded successfully!");
    } catch (err) {
      console.error("Submission failed:", err);
    }
  };

  return (
    <div className="bg-black text-white min-h-screen px-6 pt-20">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-2xl font-bold">Upload Video for User ID: {id}</h1>
        <div className="flex gap-4 text-2xl">
          <MdOutlineFeedback
            className="cursor-pointer hover:text-gray-400"
            title="Feedback"
          />
          <MdOutlineCancel
            onClick={() => navigate("/")}
            className="cursor-pointer hover:text-red-500"
            title="Cancel"
          />
        </div>
      </div>

      {/* Form Container */}
      <div className="flex justify-center">
        <div className="w-full max-w-lg bg-gray-900 p-6 rounded-lg shadow-md">
          <form onSubmit={handleSubmit}>
            {/* Title */}
            <div className="mb-5">
              <label className="block mb-2 text-sm font-semibold">Video Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter a title..."
                className="w-full p-2 rounded bg-gray-800 text-white outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>

            {/* Description */}
            <div className="mb-5">
              <label className="block mb-2 text-sm font-semibold">Description</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter description..."
                className="w-full p-2 rounded bg-gray-800 text-white outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>

            {/* Category */}
            <div className="mb-5">
              <label className="block mb-2 text-sm font-semibold">Category</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Enter category..."
                className="w-full p-2 rounded bg-gray-800 text-white outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>

            {/* Image Upload */}
            <div className="mb-6">
              <label className="block mb-2 text-sm font-semibold">Thumbnail Image</label>
              <input
                onChange={uploadImage}
                type="file"
                accept="image/*"
                className="w-full text-sm text-gray-300 file:bg-gray-700 file:text-white file:border-none file:px-4 file:py-2 file:rounded cursor-pointer"
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
              <label className="block mb-2 text-sm font-semibold">Video File</label>
              <input
                onChange={uploadVideo}
                type="file"
                accept="video/*"
                className="w-full text-sm text-gray-300 file:bg-gray-700 file:text-white file:border-none file:px-4 file:py-2 file:rounded cursor-pointer"
              />
              {videoUrl && (
                <p className="text-green-400 text-sm mt-2">Video uploaded successfully.</p>
              )}
            </div>

            {/* Submit Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <button
                type="submit"
                className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full font-medium transition text-center"
              >
                Upload Video
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