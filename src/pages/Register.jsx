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
    about: "",
    profileImage: null,
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Real-time validation (returns error string or "")
  const validateField = (name, value) => {
    switch (name) {
      case "userName":
        if (!value.trim()) return "Username is required.";
        break;
      case "email":
        if (!value.trim()) return "Email is required.";
        if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value))
          return "Please enter a valid email.";
        break;
      case "password":
        if (!value.trim()) return "Password is required.";
        if (value.length < 8)
          return "Password must be at least 8 characters.";
        if (
          !/(?=.*[a-z])/.test(value) ||
          !/(?=.*[A-Z])/.test(value) ||
          !/(?=.*\d)/.test(value) ||
          !/(?=.*[@$!%*?&])/.test(value)
        ) {
          return "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.";
        }
        break;
      case "about":
        if (!value.trim()) return "About is required.";
        break;
      case "profileImage":
        if (value && value.size > 2 * 1024 * 1024)
          return "Profile image must be under 2MB.";
        if (
          value &&
          !["image/jpeg", "image/png", "image/webp", "image/jpg"].includes(
            value.type
          )
        )
          return "Profile image must be JPG, PNG, or WEBP.";
        break;
      default:
        return "";
    }
    return "";
  };

  // Only show toast for file input errors (not for every keystroke)
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "profileImage") {
      const file = files[0];
      const error = validateField(name, file);
      if (error) {
        toast.error(error, { toastId: "profileImage" });
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

    // Validate all fields before submitting
    for (const [key, value] of Object.entries(formData)) {
      const error = validateField(key, value);
      if (error) {
        toast.error(error, { toastId: key }); // Use toastId to avoid duplicates
        return;
      }
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
        toast.error(err.message,"Failed to upload profile image.", { toastId: "cloudinary" });
        setLoading(false);
        return;
      }
    }

    // 2. Prepare and send user data to backend
    const userData = {
      userName: formData.userName,
      email: formData.email,
      password: formData.password,
      profilePic: imageUrl,
      about: formData.about,
    };

    try {
      const res = await axios.post(
        "http://localhost:4001/api/users/register",
        userData
      );
      console.log(res);
      
      toast.success("Registration successful!", { toastId: "register-success" });

      // Reset form
      setFormData({
        userName: "",
        email: "",
        password: "",
        about: "",
        profileImage: null,
      });
      setPreviewImage(null);

      setTimeout(() => {
        navigate("/login");
      }, 1500); // small delay to show toast
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        toast.error(err.response.data.message, { toastId: "register-fail" });
      } else {
        toast.error("Registration failed. Please try again.", { toastId: "register-fail" });
      }
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
            autoComplete="new-password"
            className="w-full p-2 rounded bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-600"
          />
        </div>

        {/* About */}
        <div className="mb-4">
          <label htmlFor="about" className="block mb-1">
            About
          </label>
          <textarea
            id="about"
            name="about"
            value={formData.about}
            onChange={handleChange}
            required
            rows={3}
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
            aria-label="Profile Image"
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
      <ToastContainer position="bottom-right" limit={1} pauseOnFocusLoss={false} pauseOnVisibilityChange={false} />
    </div>
  );
}

export default Registration;
