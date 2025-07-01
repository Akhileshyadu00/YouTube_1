import React, { useState, useEffect } from "react";
import axios from "axios";

function Registration() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    channelName: "",
    profileImage: null,
  });

  const [previewImage, setPreviewImage] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "profileImage") {
      const file = files[0];

      if (file && file.size > 2 * 1024 * 1024) {
        // 2MB size limit
        alert("Profile image must be under 2MB.");
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

    let imageUrl = "";

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
        console.log("Uploaded image URL:", imageUrl);
      } catch (err) {
        console.error("Image upload failed:", err);
        return;
      }
    }

    const userData = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
      channelName: formData.channelName,
      profileImageUrl: imageUrl,
    };

    console.log("Submitting user data:", userData);

    try {
      const res = await axios.post(
        "https://your-backend.com/api/register",
        userData
      );
      console.log("User registered successfully:", res.data);
    } catch (err) {
      console.error("User registration failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-sm"
        encType="multipart/form-data"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>

        <div className="mb-4">
          <label htmlFor="username" className="block mb-1">
            Username
          </label>
          <input
            id="username"
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-600"
            required
          />
        </div>

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
            className="w-full p-2 rounded bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-600"
            required
          />
        </div>

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
            className="w-full p-2 rounded bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-600"
            required
          />
        </div>

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
            className="w-full p-2 rounded bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-600"
            required
          />
        </div>

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

        <button
          type="submit"
          className="w-full bg-red-600 hover:bg-red-700 py-2 rounded font-semibold transition"
        >
          Register
        </button>
      </form>
    </div>
  );
}

export default Registration;