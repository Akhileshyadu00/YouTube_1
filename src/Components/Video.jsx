import React, { useEffect, useState } from "react";
import { IoIosNotifications } from "react-icons/io";
import { BiSolidLike, BiSolidDislike } from "react-icons/bi";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

function Video() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [comments, setComments] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchVideoById = async () => {
    try {
      const response = await axios.get(
        `http://localhost:4001/api/videos/${id}`
      );
      const videoData = response.data.video;

      setData(videoData);
      setVideoUrl(videoData.videoLink);
    } catch (err) {
      console.error("Failed to fetch video:", err);
    } finally {
      setLoading(false);
    }
  };

  const getCommentByVideoId = async () => {
    try {
      const response = await axios.get(
        `http://localhost:4001/api/comments/${id}`
      );
      console.log(response);

      const commentData = response.data.comments;

      setComments(commentData);
    } catch (err) {
      console.error("Failed to fetch video:", err);
    }
  };

  useEffect(() => {
    fetchVideoById();
    getCommentByVideoId();
  }, [id]);

  if (loading) {
    return <div className="text-white text-center mt-10">Loading video...</div>;
  }

  if (!data) {
    return <div className="text-white text-center mt-10">Video not found.</div>;
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-4 mt-4 bg-black min-h-screen">
      {/* Video Section */}
      <div className="w-full lg:w-3/4">
        {/* Video Player */}
        <div className="aspect-video bg-black rounded-lg overflow-hidden shadow-lg">
          {data && (
            <video
              src={videoUrl}
              controls
              autoPlay
              poster={data.thumbnail}
              className="w-full h-full object-contain"
            >
              Your browser does not support the video tag.
            </video>
          )}
        </div>

        {/* Title */}
        <h2 className="text-white mt-4 text-xl font-semibold">{data.title}</h2>

        {/* Channel Info & Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4 gap-4">
          {/* Channel Details */}
          <div className="flex items-center gap-3">
            <Link to={`/user/${data?.user?._id}`}>
              <img
                src={data.user?.profilePic || "https://via.placeholder.com/40"}
                alt="Channel Avatar"
                className="w-10 h-10 rounded-full object-cover"
              />
            </Link>
            <div className="text-white">
              <h4 className="text-base font-semibold">
                {data.user?.channelName || "Unknown"}
              </h4>
              <p className="text-sm text-gray-400">
                {data.user?.followers || "N/A"} followers
              </p>
            </div>
          </div>

          {/* Like/Dislike */}
          <div className="flex gap-3">
            <button className="flex items-center gap-1 px-4 py-2 text-white bg-gray-800 hover:bg-gray-700 rounded-full text-sm transition">
              <BiSolidLike className="text-lg" />
              {data.like || 0}
            </button>
            <button className="flex items-center gap-1 px-4 py-2 text-white bg-gray-800 hover:bg-gray-700 rounded-full text-sm transition">
              <BiSolidDislike className="text-lg" />
              {data.dislike || 0}
            </button>
          </div>

          {/* Subscribe */}
          <div className="flex gap-3 items-center">
            <button className="p-2 rounded-full hover:bg-gray-700 transition">
              <IoIosNotifications className="text-white text-2xl" />
            </button>
            <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full text-sm font-medium">
              Subscribe
            </button>
          </div>
        </div>

        {/* Description */}
        <div className="mt-4 text-white">
          <p className="text-sm text-gray-400">
            Published on:{" "}
            <span className="text-white">
              {new Date(data.createdAt).toLocaleDateString()}
            </span>
          </p>
          <p className="text-sm mt-2 text-gray-300">{data.description}</p>
        </div>

        {/* Comments Section (Static or Fetchable) */}
        <div className="mt-6 text-white">
          <h3 className="text-lg font-semibold mb-3">Comments</h3>

          {/* Add Comment */}
          <div className="flex items-start sm:items-center gap-3 mb-4">
            <img
              src="https://via.placeholder.com/32"
              alt="User"
              className="w-8 h-8 rounded-full"
            />
            <input
              type="text"
              placeholder="Add a comment..."
              className="flex-1 p-2 bg-gray-800 rounded-full text-sm text-white outline-none focus:ring-2 focus:ring-gray-600"
            />
            <button className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-full transition">
              Comment
            </button>
          </div>

          {/* Placeholder Comments */}
          <div className="flex gap-3 mb-4">
            <img
              src="https://via.placeholder.com/32"
              alt="User"
              className="w-8 h-8 rounded-full"
            />
            <div>
              {comments.length > 0 ? (
                comments.map((item, index) => (
                  <div key={index} className="flex gap-3 mb-4">
                    <img
                      src={
                        item?.user?.profilePic
                      }
                      alt="User"
                      className="w-8 h-8 rounded-full"
                    />
                    <div>
                      <h4 className="font-semibold text-sm">
                        {item.user?.username || "User"}
                      </h4>
                      <h5 className="text-xs text-gray-400">
                        {new Date(item.createdAt).toLocaleString()}
                      </h5>
                      <p className="text-sm mt-1">{item.message}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-400">No comments yet.</p>
              )}

              </div>
          </div>
        </div>
      </div>

      {/* Suggestions */}
      <aside className="w-full lg:w-1/4 flex flex-col gap-4">
        <h3 className="text-white text-lg font-semibold mb-2">Suggestions</h3>
        {[...Array(7)].map((_, idx) => (
          <div
            key={idx}
            className="flex items-center gap-3 cursor-pointer hover:bg-gray-800 p-2 rounded"
          >
            <img
              src={`https://source.unsplash.com/random/100x60?sig=${idx}`}
              alt={`Suggested video ${idx + 1}`}
              className="w-24 h-16 object-cover rounded"
            />
            <div className="flex flex-col">
              <span className="text-white text-sm line-clamp-2">
                Suggested Video Title #{idx + 1}
              </span>
              <span className="text-gray-400 text-xs">Channel Name</span>
            </div>
          </div>
        ))}
      </aside>
    </div>
  );
}

export default Video;
