import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function CreateChannel() {
  const [form, setForm] = useState({
    channelName: "",
    description: "",
    channelBanner: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:4001/api/channels", form, {
        headers: { Authorization: `JWT ${token}` },
      });
      toast.success("✅ Channel created successfully!");
      setForm({ channelName: "", description: "", channelBanner: "" });
    } catch (err) {
      console.error(err);
      toast.error("❌ Error creating channel.");
    } finally {
      setLoading(false);
    }
  };

  const uploadBanner = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "Youtube-clone");
    try {
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/djthu0xcg/image/upload",
        data
      );
      setForm((prev) => ({ ...prev, channelBanner: res.data.secure_url }));
      toast.success("🖼️ Banner uploaded successfully!");
    } catch (err) {
      console.error("Banner upload error:", err);
      toast.error("❌ Failed to upload banner.");
    } finally {
      setLoading(false);
    }
  };

 

  return (
    <div className="flex items-center justify-center bg-gray-700 px-4 min-h-screen w-full">
      <ToastContainer position="top-right" autoClose={4000} />
      <div className="w-full max-w-xl bg-gray-900 text-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-center">
          Create Your Channel
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm mb-1" htmlFor="channelName">
              Channel Name <span className="text-red-400">*</span>
            </label>
            <input
              name="channelName"
              id="channelName"
              type="text"
              value={form.channelName}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="My Awesome Channel"
            />
          </div>

          <div>
            <label className="block text-sm mb-1" htmlFor="description">
              Description
            </label>
            <input
              name="description"
              id="description"
              type="text"
              value={form.description}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="What is your channel about?"
            />
          </div>
          <div>
            <label className="block text-sm mb-1" htmlFor="channelBanner">
              Banner Image
            </label>
            <input
              id="channelBanner"
              type="file"
              accept="image/*"
              onChange={uploadBanner}
              disabled={loading}
              className="w-full text-sm text-gray-300 file:bg-gray-700 file:text-white"
            />
            {form.channelBanner && (
              <img
                src={form.channelBanner}
                alt="Banner preview"
                className="mt-4 w-full h-40 object-cover rounded"
              />
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-gray-900 hover:bg-gray-600 disabled:bg-gray-600 text-white rounded transition duration-200 font-semibold"
          >
            {loading ? "Creating..." : "Create Channel"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateChannel;
