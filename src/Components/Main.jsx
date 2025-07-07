import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Main({ fullNav }) {
  const [videos, setVideos] = useState([]);

  // useEffect(() => {
  //   const fetchVideos = async () => {
  //     try {
  //       const res = await axios.get("http://localhost:4001/api/videos");
  //       setVideos(res.data?.videos || []);
  //     } catch (err) {
  //       console.error("Error fetching videos:", err);
  //     }
  //   };

  //   fetchVideos();
  // }, []);

  useEffect(() => {
  const fetchVideos = async () => {
    try {
      const res = await axios.get("http://localhost:4001/api/videos");
      const newVideos = res.data?.videos || [];

      // Only update if different
      if (JSON.stringify(newVideos) !== JSON.stringify(videos)) {
        setVideos(newVideos);
      }
    } catch (err) {
      console.error("Error fetching videos:", err);
    }
  };

  fetchVideos();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);

  const categories = [
    "All", "Trending", "Music", "Gaming", "News", "Live", "UPSC",
    "English", "React", "Javascript"
  ];

  return (
    <div className="flex flex-col overflow-x-hidden w-full bg-black min-h-screen text-white">
      {/* Category Filter Bar */}
      <div
        className={`fixed top-16 ${
          fullNav ? "left-60" : "left-0"
        } right-0 z-10 bg-gray-900 px-4 py-2 overflow-x-auto whitespace-nowrap shadow-md scrollbar-hide`}
      >
        <div className="flex space-x-4">
          {categories.map((option) => (
            <button
              key={option}
              className="px-4 py-1 bg-gray-700 hover:bg-gray-600 rounded-2xl text-sm transition-colors"
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Video Grid */}
      <div
        className={`mt-24 px-4 grid gap-6 ${
          fullNav ? "ml-60" : "ml-4"
        } grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4`}
      >
        {videos.map((video) => (
          <div key={video._id} className="bg-gray-900 rounded-lg overflow-hidden shadow hover:shadow-lg transition">
            <Link to={`/watch/${video._id}`} className="block relative">
              <img
                src={video.thumbnail || "https://via.placeholder.com/300x200?text=No+Thumbnail"}
                alt={video.title || "Video thumbnail"}
                className="w-full aspect-video object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/300x200?text=No+Thumbnail";
                }}
              />
              <span className="absolute bottom-1 right-1 bg-black bg-opacity-70 text-xs px-1 py-0.5 rounded">
                {video.duration || "00:00"}
              </span>
            </Link>

            {/* Video Info */}
            <div className="flex gap-3 p-3">
              <img
                src={video.user?.profilePic || "https://via.placeholder.com/40"}
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
                <p className="text-gray-400 text-sm">{video.user?.channelName || "Unknown Channel"}</p>
                <p className="text-gray-500 text-xs">
                  {video.views ?? 0} views • {new Date(video.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Main;
