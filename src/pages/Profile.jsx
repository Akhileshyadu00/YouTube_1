import React, { useEffect, useState } from "react";
import axios from "axios";
import SideNavbar from "../Components/SideNavbar";
import { Link, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function Profile({ sideNavbar,}) {
  const { id } = useParams();
  
  const [videos, setVideos] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Edit modal state
  const [showEdit, setShowEdit] = useState(false);
  const [editVideo, setEditVideo] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    thumbnail: "",
    videoLink: "",
    category: "",
  });
  const [editLoading, setEditLoading] = useState(false);

  // Fetch user/channel info
  const fetchUserData = async () => {
    try {
      const res = await axios.get(`http://localhost:4001/api/users/${id}`);
      setUser(res.data.user || res.data.data || res.data);
    } catch (err) {
      console.error("User fetch error:", err);
      setUser(null);
      toast.error("Failed to load user info.");
    }
  };

  // Fetch videos for this user/channel
  const fetchVideos = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:4001/api/videos/user/${id}`,
        token
          ? {
              headers: { Authorization: `JWT ${token}` },
              withCredentials: true,
            }
          : {}
      );
      setVideos(res.data.videos || []);
    } catch (err) {
      console.error("Videos fetch error:", err);
      setVideos([]);
      toast.error("Failed to load videos.");
    }
  };

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const fetchAll = async () => {
      await Promise.all([fetchUserData(), fetchVideos()]);
      if (isMounted) setLoading(false);
    };

    if (id) fetchAll();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line
  }, [id]);

  // Handle Edit
  const handleEdit = (video) => {
    setEditVideo(video);
    setEditForm({
      title: video.title || "",
      description: video.description || "",
      thumbnail: video.thumbnail || "",
      videoLink: video.videoLink || "",
      category: video.category || "",
    });
    setShowEdit(true);
  };


  // Edit handler
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    const token = localStorage.getItem("token");
    try {
      await axios.put(
        `http://localhost:4001/api/videos/${editVideo._id}`,
        editForm,
        { headers: { Authorization: `JWT ${token}` } }
      );
      toast.success("Video updated!"); // Only this toast, not "login successful"
      setShowEdit(false);
      setEditVideo(null);
      await fetchVideos();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update video.");
    } finally {
      setEditLoading(false);
    }
  };

  // Delete handler
  const handleDelete = async (videoId) => {
    if (!window.confirm("Are you sure you want to delete this video?")) return;
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:4001/api/videos/${videoId}`, {
        headers: { Authorization: `JWT ${token}` },
      });
      toast.success("Video deleted!"); // Now this will always show on success
      await fetchVideos();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete video.");
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="flex bg-black min-h-screen text-white">
        <SideNavbar isOpen={sideNavbar} />
        <main className="flex-1 flex items-center justify-center">
          <span className="text-xl">Loading...</span>
        </main>
      </div>
    );
  }

  // User Not Found State
  if (!user) {
    return (
      <div className="flex bg-black min-h-screen text-white">
        <SideNavbar isOpen={sideNavbar} />
        <main className="flex-1 flex flex-col items-center justify-center">
          <span className="text-xl text-red-500 mb-4">User not found.</span>
          <Link to="/" className="text-blue-400 underline">
            Go Home
          </Link>
        </main>
      </div>
    );
  }

  // Main Profile Content
  return (
    <div className="flex mt-10 bg-black min-h-screen text-white">
      {/* Sidebar */}
      <ToastContainer position="bottom-right" />
      <SideNavbar isOpen={sideNavbar} />

      {/* Main Content */}
      <main
        className={`flex-1 transition-all duration-300 ${
          sideNavbar ? "ml-60" : "ml-0"
        } p-4`}
      >
        {/* Header */}

        <header className="mb-6 border-b border-gray-700 pb-4">
          

        </header>

        {/* Profile Info */}
        <section className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
          <img
            src={user?.profilePic || "/default-profile.png"}
            alt={user?.userName || "User"}
            className="w-20 h-20 rounded-full object-cover"
          />
          <div>
            <h2 className="text-xl font-semibold">
              {user?.channelName || user?.userName || "Channel Name"}
            </h2>
            <p className="text-gray-400 text-sm">{videos.length} Videos</p>
            <h3 className="text-gray-400 text-sm">
              {user?.about || "No channel description."}
            </h3>
          </div>
        </section>

        <div className="mb-4">
          <h2 className="text-xl font-semibold text-white mb-1">Videos</h2>
          <hr className="border-gray-600" />
        </div>

        {/* Uploaded Videos */}
        {videos.length === 0 ? (
          <p className="text-gray-500">No videos uploaded yet.</p>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-items-center">
            {videos.map((video) => (
              <div
                key={video._id}
                className="w-full sm:w-[280px] md:w-[300px] min-h-[260px] md:min-h-[300px] bg-gray-900 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition transform hover:-translate-y-1"
              >
                <Link to={`/watch/${video._id}`}>
                  <div className="aspect-video">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-3">
                    <h4 className="text-white font-medium text-sm line-clamp-2">
                      {video.title}
                    </h4>
                    <p className="text-gray-400 text-xs mt-1">
                      {video.views} views •{" "}
                      {new Date(video.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </Link>
                {/* Edit/Delete Actions */}
                <div className="flex justify-between items-center px-3 pb-2">
                  <button
                    className="text-blue-400 hover:underline text-xs mr-2"
                    onClick={() => handleEdit(video)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-500 hover:underline text-xs"
                    onClick={() => handleDelete(video._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Edit Modal */}
        {showEdit && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-gray-900 p-6 rounded-lg w-full max-w-md">
              <h2 className="text-xl font-bold text-white mb-4">Edit Video</h2>
              <form onSubmit={handleEditSubmit}>
                <input
                  className="w-full mb-3 p-2 rounded"
                  name="title"
                  type="text"
                  placeholder="Video title"
                  value={editForm.title}
                  onChange={(e) =>
                    setEditForm({ ...editForm, title: e.target.value })
                  }
                  required
                />
                <input
                  className="w-full mb-3 p-2 rounded"
                  name="videoLink"
                  type="url"
                  placeholder="Video file URL"
                  value={editForm.videoLink}
                  onChange={(e) =>
                    setEditForm({ ...editForm, videoLink: e.target.value })
                  }
                  required
                />
                <input
                  className="w-full mb-3 p-2 rounded"
                  name="thumbnail"
                  type="url"
                  placeholder="Thumbnail image URL"
                  value={editForm.thumbnail}
                  onChange={(e) =>
                    setEditForm({ ...editForm, thumbnail: e.target.value })
                  }
                  required
                />
                <textarea
                  className="w-full mb-3 p-2 rounded"
                  name="description"
                  placeholder="Video description"
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm({ ...editForm, description: e.target.value })
                  }
                  rows={2}
                />
                <input
                  className="w-full mb-3 p-2 rounded"
                  name="category"
                  type="text"
                  placeholder="Category"
                  value={editForm.category}
                  onChange={(e) =>
                    setEditForm({ ...editForm, category: e.target.value })
                  }
                />
                <div className="flex gap-2 justify-end">
                  <button
                    type="button"
                    className="bg-gray-700 text-white px-4 py-2 rounded"
                    onClick={() => setShowEdit(false)}
                    disabled={editLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                    disabled={editLoading}
                  >
                    {editLoading ? "Saving..." : "Save"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Profile;
