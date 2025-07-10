import React from "react";

import { Link } from "react-router-dom";

// Component: VideoCard
const VideoCard = ({ video }) => {
  return (
    <div className="bg-gray-900 rounded-lg overflow-hidden shadow hover:shadow-lg transition">
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
  );
};


export default VideoCard
