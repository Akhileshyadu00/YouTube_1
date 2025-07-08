import React, { useEffect, useState } from "react";
import axios from "axios";
import SideNavbar from "../Components/SideNavbar";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";

function Profile({ sideNavbar }) {
  const { id } = useParams();
  const [videos, setVideos] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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
      const res = await axios.get(`http://localhost:4001/api/videos/${id}/channel`);
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

    return () => { isMounted = false; };
  }, [id]);

  // Loading State
  if (loading) {
    return (
      <div className="flex bg-black min-h-screen text-white">
        <SideNavbar sideNavbar={sideNavbar} />
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
        <SideNavbar sideNavbar={sideNavbar} />
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
    <div className="flex bg-black min-h-screen text-white">
      {/* Sidebar */}
      <SideNavbar sideNavbar={sideNavbar} />

      {/* Main Content */}
      <main
        className={`flex-1 transition-all duration-300 ${
          sideNavbar ? "ml-60" : "ml-0"
        } p-4`}
      >
        {/* Header */}
        <header className="mb-6 border-b border-gray-700 pb-4">
          <h1 className="text-2xl font-bold">{user?.channelName || user?.userName || "Channel"}</h1>
        </header>

        {/* Profile Info */}
        <section className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
          <img
            src={user?.profilePic || "/default-profile.png"}
            alt={user?.userName || "User"}
            className="w-20 h-20 rounded-full object-cover"
          />
          <div>
            <h2 className="text-xl font-semibold">{user?.channelName || user?.userName || "Channel Name"}</h2>
            <p className="text-gray-400 text-sm">{videos.length} Videos</p>
            <h3 className="text-gray-400 text-sm">{user?.about || "No channel description."}</h3>
          </div>
        </section>

        {/* Uploaded Videos */}
        {videos.length === 0 ? (
          <p className="text-gray-500">No videos uploaded yet.</p>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {videos.map((video) => (
              <Link to={`/watch/${video._id}`} key={video._id}>
                <div className="bg-gray-900 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition">
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
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Profile;
