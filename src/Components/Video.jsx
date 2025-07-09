import React, { useEffect, useState } from "react";
import { IoIosNotifications } from "react-icons/io";
import { BiSolidLike, BiSolidDislike } from "react-icons/bi";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import Suggestion from "./Suggestion";

function Video() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [loading, setLoading] = useState(true);

  // Like/Dislike state
  const [likeCount, setLikeCount] = useState(0);
  const [dislikeCount, setDislikeCount] = useState(0);
  const [userLikeStatus, setUserLikeStatus] = useState(null); // "liked", "disliked", or null
  const [likeMessage, setLikeMessage] = useState("");

  // Comment state
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [commentMessage, setCommentMessage] = useState("");

  // Fetch video and user like/dislike status
  const fetchVideoById = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:4001/api/videos/${id}`,
        token ? { headers: { Authorization: `JWT ${token}`,
        withCredentials: true  } } : undefined
      );
      const videoData = res.data.video;
      setData(videoData);
      setVideoUrl(videoData.videoLink);
      setLikeCount(videoData.like || 0);
      setDislikeCount(videoData.dislike || 0);
      setUserLikeStatus(res.data.userLikeStatus); // "liked", "disliked", or null
    } catch (err) {
      console.error("Failed to fetch video:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch comments
  const getCommentByVideoId = async () => {
    try {
      const response = await axios.get(
        `http://localhost:4001/api/comments/${id}`
      );
      setComments(response.data.comments);
    } catch (err) {
      console.error("Failed to fetch comments:", err);
    }
  };

  // Add comment
  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:4001/api/comments`,
        { videoId: id, message: newComment },
        { headers: { Authorization: `JWT ${token}`,
      withCredentials: true  } }
      );
      setNewComment("");
      setCommentMessage("Comment added!");
      getCommentByVideoId();
      setTimeout(() => setCommentMessage(""), 2000);
    } catch (err) {
      setCommentMessage(
        err.response?.data?.message || "You must be logged in to comment."
      );
      setTimeout(() => setCommentMessage(""), 2000);
    }
  };

  // Like handler
  const handleLike = async () => {
    if (userLikeStatus === "liked") {
      setLikeMessage("You have already liked this video.");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `http://localhost:4001/api/videos/${id}/like`,
        {},
        { headers: { Authorization: `JWT ${token}`,
        withCredentials: true  } }
      );
      setLikeCount(res.data.like);
      setDislikeCount(res.data.dislike);
      setUserLikeStatus("liked");
      setLikeMessage("You liked this video!");
      setTimeout(() => setLikeMessage(""), 2000);
    } catch (err) {
      setLikeMessage(
        err.response?.data?.message || "You must be logged in to like videos."
      );
      setTimeout(() => setLikeMessage(""), 2000);
    }
  };

  // Dislike handler
  const handleDislike = async () => {
    if (userLikeStatus === "disliked") {
      setLikeMessage("You have already disliked this video.");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `http://localhost:4001/api/videos/${id}/dislike`,
        {},
        { headers: { Authorization: `JWT ${token}`,
        withCredentials: true  } }
      );
      setLikeCount(res.data.like);
      setDislikeCount(res.data.dislike);
      setUserLikeStatus("disliked");
      setLikeMessage("You disliked this video!");
      setTimeout(() => setLikeMessage(""), 2000);
    } catch (err) {
      setLikeMessage(
        err.response?.data?.message || "You must be logged in to dislike videos."
      );
      setTimeout(() => setLikeMessage(""), 2000);
    }
  };

  useEffect(() => {
    fetchVideoById();
    getCommentByVideoId();
    // eslint-disable-next-line
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
            <button
              className={`flex items-center gap-1 px-4 py-2 text-white rounded-full text-sm transition ${
                userLikeStatus === "liked"
                  ? "bg-blue-700"
                  : "bg-gray-800 hover:bg-gray-700"
              }`}
              onClick={handleLike}
              disabled={userLikeStatus === "liked"}
            >
              <BiSolidLike className="text-lg" />
              {likeCount}
            </button>
            <button
              className={`flex items-center gap-1 px-4 py-2 text-white rounded-full text-sm transition ${
                userLikeStatus === "disliked"
                  ? "bg-blue-700"
                  : "bg-gray-800 hover:bg-gray-700"
              }`}
              onClick={handleDislike}
              disabled={userLikeStatus === "disliked"}
            >
              <BiSolidDislike className="text-lg" />
              {dislikeCount}
            </button>
          </div>
          {likeMessage && (
            <div className="text-yellow-400 mt-2 text-sm">{likeMessage}</div>
          )}

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

        {/* Comments Section */}
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
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              className="flex-1 p-2 bg-gray-800 rounded-full text-sm text-white outline-none focus:ring-2 focus:ring-gray-600"
            />
            <button
              className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-full transition"
              onClick={handleAddComment}
              disabled={!newComment.trim()}
            >
              Comment
            </button>
          </div>
          {commentMessage && (
            <div className="text-yellow-400 mb-2 text-sm">{commentMessage}</div>
          )}

          {/* Comments List */}
          <div>
            {comments.length > 0 ? (
              comments.map((item, index) => (
                <div key={index} className="flex gap-3 mb-4">
                  <img
                    src={item?.user?.profilePic || "https://via.placeholder.com/32"}
                    alt="User"
                    className="w-8 h-8 rounded-full"
                  />
                  <div>
                    <h4 className="font-semibold text-sm">
                      {item.user?.userName || "User"}
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

      {/* Suggestions */}
      <Suggestion />
    </div>
  );
}

export default Video;
