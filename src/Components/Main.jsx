import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import CategoryFilter from "./CategoryFilter";

function Main({ fullNav }) {
  const [videos, setVideos] = useState([]);
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const categories = [
    "All",
    "Trending",
    "Music",
    "Gaming",
    "News",
    "Live",
    "UPSC",
    "English",
    "React",
    "Javascript",
  ];

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      try {
        const res = await axios.get("https://yt-backend-thbd.onrender.com/api/videos");
        setVideos(res.data?.videos || []);
        setError("");
      } catch (err) {
        console.error("Error fetching videos:", err);
        setError("Failed to load videos");
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  useEffect(() => {
    if (selectedCategory === "All") {
      setFilteredVideos(videos);
    } else {
      setFilteredVideos(
        videos.filter((video) => video.category === selectedCategory)
      );
    }
  }, [selectedCategory, videos]);

  return (
    <div className="flex flex-col w-full bg-black min-h-screen text-white overflow-x-hidden">
      {/* Category Filter Bar */}
      <div
        className={`fixed top-16 z-10 bg-black w-full px-4 py-2 shadow-md ${
          fullNav ? "left-60" : "left-0"
        } right-0`}
      >
        <CategoryFilter
          categories={categories}
          selected={selectedCategory}
          onSelect={setSelectedCategory}
          fullNav={fullNav}
        />
      </div>

      {/* Main Content */}
      <div
        className={`pt-28 pb-10 px-4 transition-all duration-300 ${
          fullNav ? "ml-60" : "ml-0"
        }`}
      >
        {loading ? (
          <p className="text-center text-gray-400">Loading videos...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : filteredVideos.length === 0 ? (
          <p className="text-center text-gray-500">No videos found</p>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {filteredVideos.map((video) => (
              <div
                key={video._id}
                className="bg-gray-900 rounded-lg overflow-hidden shadow hover:shadow-lg transition"
              >
                <Link to={`/watch/${video._id}`} className="block relative">
                  <img
                    src={
                      video.thumbnail ||
                      "https://via.placeholder.com/300x200?text=No+Thumbnail"
                    }
                    alt={video.title || "Video thumbnail"}
                    className="w-full aspect-video object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://via.placeholder.com/300x200?text=No+Thumbnail";
                    }}
                  />
                  <span className="absolute bottom-1 right-1 bg-black bg-opacity-70 text-xs px-1 py-0.5 rounded">
                    {video.duration || "00:00"}
                  </span>
                </Link>

                <div className="flex gap-3 p-3">
                  <img
                    src={
                      video.user?.profilePic || "https://via.placeholder.com/40"
                    }
                    alt={video.user?.channelName || "User"}
                    className="w-10 h-10 rounded-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/40";
                    }}
                  />
                  <div className="flex flex-col">
                    <h2 className="font-semibold text-sm line-clamp-2">
                      {video.title || "Untitled Video"}
                    </h2>
                    <p className="text-gray-400 text-sm">
                      {video.user?.channelName || "Unknown Channel"}
                    </p>
                    <p className="text-gray-500 text-xs">
                      {video.views ?? 0} views •{" "}
                      {new Date(video.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Main;
