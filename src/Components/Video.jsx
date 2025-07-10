import React, { useEffect, useState, useContext } from "react";
import { IoIosNotifications } from "react-icons/io";
import { BiSolidLike, BiSolidDislike } from "react-icons/bi";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import Suggestion from "./Suggestion";
import Comments from "./Comments";
import { AuthContext } from "../context/AuthContext";
import SideNavbar from "../Components/SideNavbar";

function Video({ sideNavbar }) {
  const { userId, userPic } = useContext(AuthContext);
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [loading, setLoading] = useState(true);

  // Like/Dislike state
  const [likeCount, setLikeCount] = useState(0);
  const [dislikeCount, setDislikeCount] = useState(0);
  const [userLikeStatus, setUserLikeStatus] = useState(null); // "liked", "disliked", or null
  const [likeMessage, setLikeMessage] = useState("");

  // Fetch video and user like/dislike status
  const fetchVideoById = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:4001/api/videos/${id}`,
        token
          ? { headers: { Authorization: `JWT ${token}` } }
          : undefined
      );
      const videoData = res.data.video;
      setData(videoData);
      setVideoUrl(videoData.videoLink);
      setLikeCount(videoData.like || 0);
      setDislikeCount(videoData.dislike || 0);

      // Check if user has liked/disliked the video
      if (token && userId && videoData.likedBy && videoData.dislikedBy) {
        if (videoData.likedBy.includes(userId)) setUserLikeStatus("liked");
        else if (videoData.dislikedBy.includes(userId)) setUserLikeStatus("disliked");
        else setUserLikeStatus(null);
      } else {
        setUserLikeStatus(null);
      }
    } catch (err) {
      setData(null);
      console.error("Failed to fetch video:", err);
    } finally {
      setLoading(false);
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
        { headers: { Authorization: `JWT ${token}`, withCredentials: true } }
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
        { headers: { Authorization: `JWT ${token}`, withCredentials: true } }
      );
      setLikeCount(res.data.like);
      setDislikeCount(res.data.dislike);
      setUserLikeStatus("disliked");
      setLikeMessage("You disliked this video!");
      setTimeout(() => setLikeMessage(""), 2000);
    } catch (err) {
      setLikeMessage(
        err.response?.data?.message ||
          "You must be logged in to dislike videos."
      );
      setTimeout(() => setLikeMessage(""), 2000);
    }
  };

  useEffect(() => {
    fetchVideoById();
    // eslint-disable-next-line
  }, [id, userId]);

  if (loading) {
    return <div className="text-white text-center mt-10">Loading video...</div>;
  }

  if (!data) {
    return <div className="text-white text-center mt-10">Video not found.</div>;
  }

  // Responsive layout starts here
  return (
    <div className="flex bg-black min-h-screen">
      {/* Sidebar */}
      <SideNavbar isOpen={sideNavbar} />

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${sideNavbar ? "ml-60" : "ml-0"} p-2 md:p-6`}>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Video and Details */}
          <div className="w-full lg:w-3/4">
            {/* Video Player */}
            <div className="aspect-video bg-black rounded-lg overflow-hidden shadow-lg">
              <video
                src={videoUrl}
                controls
                autoPlay
                poster={data.thumbnail}
                className="w-full h-full object-contain"
              >
                Your browser does not support the video tag.
              </video>
            </div>

            {/* Title */}
            <h2 className="text-white mt-4 text-xl font-semibold break-words">{data.title}</h2>

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
                    {data.channel?.channelName || "Unknown"}
                  </h4>
                  <p className="text-sm text-gray-400">
                    {data.channel?.subscribers || 0} subscribers
                  </p>
                </div>
              </div>

              {/* Like/Dislike */}
              <div className="flex gap-2 flex-wrap">
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
                {likeMessage && (
                  <div className="text-yellow-400 mt-2 text-sm">{likeMessage}</div>
                )}
              </div>

              {/* Subscribe */}
              <div className="flex gap-3 items-center">
                <button className="p-2 rounded-full hover:bg-gray-700 transition">
                  <IoIosNotifications className="text-white text-2xl" />
                </button>
                <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full text-sm font-medium" disabled>
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
              <p className="text-sm mt-2 text-gray-300 break-words">{data.description}</p>
            </div>

            {/* Comments Section */}
            <div className="mt-6">
              <Comments videoId={id} currentUserId={userId} currentUserPic={userPic} />
            </div>
          </div>

          {/* Suggestions */}
          <div className="w-full lg:w-1/4 mt-8 lg:mt-0">
            <Suggestion currentVideoId={id} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default Video;
