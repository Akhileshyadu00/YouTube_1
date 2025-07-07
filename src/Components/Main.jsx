import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Main({ fullNav }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:4001/api/videos")
      .then((res) => {
        setData(res.data?.videos || []);
      })
      .catch((err) => {
        console.error("Error fetching videos:", err);
      });
  }, []);

  const options = [
    "All", "Trending", "Music", "Gaming", "News", "Live", "UPSC",
    "English", "React", "Javascript"
  ];

  return (
    <div className="flex flex-col overflow-x-hidden w-full bg-black min-h-screen">
      {/* Filter Bar */}
      <div
        className={`fixed top-16 ${
          fullNav ? "left-60" : "left-0"
        } right-0 z-10 bg-gray-800 text-white px-4 py-2 overflow-x-auto whitespace-nowrap shadow scrollbar-hide`}
      >
        <div className="flex space-x-4 scroll-smooth">
          {options.map((option) => (
            <button
              key={option}
              className="px-4 py-1 bg-gray-700 hover:bg-gray-800 rounded-2xl text-sm transition-colors"
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Video Grid */}
      <div
        className={`mt-24 p-4 grid gap-6 ${
          fullNav ? "ml-60 lg:grid-cols-4" : "ml-16 lg:grid-cols-5"
        } grid-cols-1 sm:grid-cols-2 md:grid-cols-3`}
      >
        {data.map((video) => (
          <div key={video._id || video.id} className="text-white">
            {/* Thumbnail */}
            <Link to={`/watch/${video._id || video.id}`} className="relative block">
              <img
                src={video.thumbnail || "https://via.placeholder.com/300x200?text=No+Thumbnail"}
                alt={video.title || "Video thumbnail"}
                className="object-cover w-full h-full rounded-lg"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/300x200?text=No+Thumbnail";
                }}
              />
              <div className="absolute bottom-1 right-1 bg-black bg-opacity-60 text-white text-xs px-1 py-0.5 rounded">
                {video.duration || "00:00"}
              </div>
            </Link>

            {/* Details */}
            <div className="flex mt-3 gap-3">
              <img
                src={video.user?.profilePic || "https://via.placeholder.com/40"}
                alt={`Avatar of ${video.user?.channelName || "Unknown"}`}
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
                <h4 className="text-gray-400 text-sm">
                  {video.user?.channelName || "Unknown Channel"}
                </h4>
                <div className="text-gray-500 text-xs">
                  <span>{video.views || 0} views</span> •{" "}
                  <span>{video.like || 0} Likes</span> •{" "}
                  <span>{video.dislike || 0} Dislikes</span> •{" "}
                  <span>{new Date(video.createdAt).toLocaleDateString() || "N/A"}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Main;
