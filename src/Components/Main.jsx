import React from "react";

import { Link } from "react-router-dom";

function Main({ fullNav }) {
  const options = [
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

  const videoData = [
    {
      id: 1,
      thumbnail:
        "https://images.unsplash.com/photo-1575936123452-b67c3203c357?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D",
      duration: "12:34",
      avatar: "https://via.placeholder.com/40",
      title: "Sample Video Title That Might Span Two Lines",
      channel: "Channel Name",
      views: "1.2M",
      uploaded: "2 days ago",
    },
    {
      id: 2,
      thumbnail:
        "https://images.unsplash.com/photo-1575936123452-b67c3203c357?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D",
      duration: "10:20",
      avatar: "https://via.placeholder.com/40",
      title: "Another Interesting Video on Technology Trends",
      channel: "TechWorld",
      views: "982K",
      uploaded: "1 week ago",
    },
    {
      id: 3,
      thumbnail:
        "https://images.unsplash.com/photo-1575936123452-b67c3203c357?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D",
      duration: "7:45",
      avatar: "https://via.placeholder.com/40",
      title: "Frontend Dev Tools You Should Know",
      channel: "DevSphere",
      views: "605K",
      uploaded: "3 days ago",
    },
    {
      id: 4,
      thumbnail:
        "https://images.unsplash.com/photo-1575936123452-b67c3203c357?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D",
      duration: "9:10",
      avatar: "https://via.placeholder.com/40",
      title: "Mastering JavaScript in 20 Minutes",
      channel: "CodeHub",
      views: "1.5M",
      uploaded: "5 days ago",
    },
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
        {videoData.map((video) => (
          <div key={video.id} className="text-white">
            {/* Thumbnail */}
            <Link to={`/watch/${video.id}`} className="relative w-full h-48 block">
              <img
                src={video.thumbnail}
                alt={`Thumbnail of ${video.title}`}
                className="w-full h-full object-cover rounded-lg"
                onError={(e) =>
                  (e.target.src = "https://via.placeholder.com/480x270?text=No+Image")
                }
              />
              <div className="absolute bottom-1 right-1 bg-black bg-opacity-70 px-2 py-0.5 text-xs rounded">
                {video.duration}
              </div>
            </Link>

            {/* Details */}
            <div className="flex mt-3 gap-3">
              <img
                src={video.avatar}
                alt={`Avatar of ${video.channel}`}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex flex-col">
                <h2 className="font-semibold text-sm line-clamp-2">
                  {video.title}
                </h2>
                <h4 className="text-gray-400 text-sm">{video.channel}</h4>
                <div className="text-gray-500 text-xs">
                  <span>{video.views} views</span> •{" "}
                  <span>{video.uploaded}</span>
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
