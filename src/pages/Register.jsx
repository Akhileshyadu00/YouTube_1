import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

function Registration() {
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    channelName: "",
    about: "",
    profileImage: null,
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "profileImage") {
      const file = files[0];

      if (file && file.size > 2 * 1024 * 1024) {
        toast.error("Profile image must be under 2MB.");
        return;
      }

      setFormData((prev) => ({ ...prev, profileImage: file }));

      if (file) {
        const previewUrl = URL.createObjectURL(file);
        setPreviewImage(previewUrl);
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  useEffect(() => {
    return () => {
      if (previewImage) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [previewImage]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    const { userName, email, password, channelName, about } = formData;

    if (!userName || !email || !password || !channelName || !about) {
      toast.error("All fields are required.");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    let imageUrl = "";

    // 1. Upload profile image to Cloudinary
    if (formData.profileImage) {
      const imageData = new FormData();
      imageData.append("file", formData.profileImage);
      imageData.append("upload_preset", "Youtube-clone");

      try {
        const uploadResponse = await axios.post(
          "https://api.cloudinary.com/v1_1/djthu0xcg/image/upload",
          imageData
        );
        imageUrl = uploadResponse.data.secure_url;
      } catch (err) {
        console.error("Image upload failed:", err);
        toast.error("Failed to upload profile image.");
        setLoading(false);
        return;
      }
    }

    // 2. Prepare and send user data to backend
    const userData = {
      userName,
      email,
      password,
      channelName,
      profilePic: imageUrl,
      about,
    };

    try {
      const res = await axios.post(
        "http://localhost:4001/api/users/register",
        userData
      );

      console.log("Registration response:", res.data);
      toast.success("Registration successful!");

      // Reset form
      setFormData({
        userName: "",
        email: "",
        password: "",
        channelName: "",
        about: "",
        profileImage: null,
      });
      setPreviewImage(null);

      setTimeout(() => {
        navigate("/");
      }, 1500); // small delay to show toast
    } catch (err) {
      console.error("User registration failed:", err);
      toast.error("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-lg"
        encType="multipart/form-data"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>

        {/* Username */}
        <div className="mb-4">
          <label htmlFor="userName" className="block mb-1">
            Username
          </label>
          <input
            id="userName"
            type="text"
            name="userName"
            value={formData.userName}
            onChange={handleChange}
            required
            className="w-full p-2 rounded bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-600"
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label htmlFor="email" className="block mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-2 rounded bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-600"
          />
        </div>

        {/* Password */}
        <div className="mb-4">
          <label htmlFor="password" className="block mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full p-2 rounded bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-600"
          />
        </div>

        {/* Channel Name */}
        <div className="mb-4">
          <label htmlFor="channelName" className="block mb-1">
            Channel Name
          </label>
          <input
            id="channelName"
            type="text"
            name="channelName"
            value={formData.channelName}
            onChange={handleChange}
            required
            className="w-full p-2 rounded bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-600"
          />
        </div>

        {/* About */}
        <div className="mb-4">
          <label htmlFor="about" className="block mb-1">
            About
          </label>
          <input
            id="about"
            type="text"
            name="about"
            value={formData.about}
            onChange={handleChange}
            required
            className="w-full p-2 rounded bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-600"
          />
        </div>

        {/* Profile Image Upload */}
        <div className="mb-6">
          <label htmlFor="profileImage" className="block mb-1">
            Profile Image
          </label>
          <input
            id="profileImage"
            type="file"
            name="profileImage"
            accept="image/*"
            onChange={handleChange}
            className="w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4
                       file:rounded file:border-0 file:text-sm file:font-semibold
                       file:bg-red-600 file:text-white hover:file:bg-red-700"
          />
          {previewImage && (
            <img
              src={previewImage}
              alt="Preview"
              className="mt-4 w-24 h-24 object-cover rounded-full border border-gray-700"
            />
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-red-600 hover:bg-red-700 py-2 rounded font-semibold transition disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>

      <ToastContainer position="bottom-right" />
    </div>
  );
}

export default Registration;
