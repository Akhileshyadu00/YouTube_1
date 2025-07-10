import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

function ManageVideos() {
  const { id } = useParams();
  const [videos, setVideos] = useState([]);
  const [editingVideo, setEditingVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const token = localStorage.getItem("token");

  const fetchVideos = async () => {
    try {
      const res = await axios.get(
        `http://localhost:4001/api/videos/user/${id}`,
        {
          headers: { Authorization: `JWT ${token}` },
          withCredentials: true,
        }
      );
      setVideos(res.data.videos || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load videos");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (videoId) => {
    if (!window.confirm("Are you sure you want to delete this video?")) return;

    try {
      await axios.delete(`http://localhost:4001/api/videos/${videoId}`, {
        headers: { Authorization: `JWT ${token}` },
      });
      setVideos(videos.filter((v) => v._id !== videoId));
      toast.success("Video deleted");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete video");
    }
  };

  const handleEditChange = (e) => {
    setEditingVideo({ ...editingVideo, [e.target.name]: e.target.value });
  };

  const handleEditSave = async () => {
    try {
      await axios.put(
        `http://localhost:4001/api/videos/${editingVideo._id}`,
        editingVideo,
        {
          headers: { Authorization: `JWT ${token}` },
        }
      );
      toast.success("Video updated");
      setEditingVideo(null);
      fetchVideos();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update video");
    }
  };

  const handleThumbnailUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !editingVideo) return;

    setUploading(true);
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "Youtube-clone"); // 🔁 Change to your Cloudinary preset

    try {
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/djthu0xcg/image/upload",
        data
      );
      setEditingVideo((prev) => ({
        ...prev,
        thumbnail: res.data.secure_url,
      }));
      toast.success("Thumbnail uploaded!");
    } catch (err) {
      console.error(err);
      toast.error("Thumbnail upload failed");
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, [id]);

  if (loading) return <div className="p-6 text-white">Loading...</div>;

  return (
    <div className="p-6 bg-black text-white min-h-screen">
      <h2 className="text-2xl font-bold mb-6">Manage Your Videos</h2>

      {videos.length === 0 ? (
        <p>No videos found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <div
              key={video._id}
              className="bg-gray-900 p-4 rounded shadow relative"
            >
              <img
                src={
                  editingVideo?._id === video._id
                    ? editingVideo.thumbnail
                    : video.thumbnail
                }
                alt={video.title}
                className="w-full h-40 object-cover rounded"
              />

              {editingVideo?._id === video._id ? (
                <>
                  <input
                    name="title"
                    value={editingVideo.title}
                    onChange={handleEditChange}
                    className="w-full mt-2 p-2 bg-gray-800 rounded"
                  />
                  <textarea
                    name="description"
                    value={editingVideo.description}
                    onChange={handleEditChange}
                    className="w-full mt-2 p-2 bg-gray-800 rounded"
                  />
                  <label className="text-sm text-gray-400 mt-2 block">
                    Upload New Thumbnail:
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailUpload}
                    className="mt-1 text-sm"
                    disabled={uploading}
                  />

                  <button
                    onClick={handleEditSave}
                    className="mt-3 w-full bg-green-600 hover:bg-green-700 text-white py-1 rounded"
                    disabled={uploading}
                  >
                    {uploading ? "Uploading..." : "Save"}
                  </button>
                  <button
                    onClick={() => setEditingVideo(null)}
                    className="mt-2 w-full bg-gray-700 hover:bg-gray-600 text-white py-1 rounded"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <h3 className="mt-2 text-lg font-semibold">{video.title}</h3>
                  <p className="text-sm text-gray-400 line-clamp-2">
                    {video.description}
                  </p>
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => setEditingVideo(video)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(video._id)}
                      className="flex-1 bg-red-600 hover:bg-red-700 py-1 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ManageVideos;
