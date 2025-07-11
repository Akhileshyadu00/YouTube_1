import React, { useState, useEffect, } from "react";
import axios from "axios";



function Comments({ videoId, currentUserId, currentUserPic }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [commentMessage, setCommentMessage] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");




  // Fetch comments
  const getCommentByVideoId = async () => {
    try {
      const response = await axios.get(
        `https://yt-backend-thbd.onrender.com/api/comments/${videoId}`
      );
      setComments(response.data.comments);
    } catch (err) {
      console.error("Failed to fetch comments:", err);
    }
  };

  // Add comment
  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    const token = localStorage.getItem("token");
    if (!token) {
      setCommentMessage("You must be logged in to comment.");
      setTimeout(() => setCommentMessage(""), 2000);
      return;
    }
    try {
      await axios.post(
        `https://yt-backend-thbd.onrender.com/api/comments`,
        { videoId, message: newComment },
        { headers: { Authorization: `JWT ${token}`, withCredentials: true } }
      );
      setNewComment("");
      setCommentMessage("Comment added!");
      getCommentByVideoId();
      setTimeout(() => setCommentMessage(""), 2000);
    } catch (err) {
      console.log(err);
      
      setCommentMessage(
        err.response?.data?.message || "Failed to add comment."
      );
      setTimeout(() => setCommentMessage(""), 2000);
    }
  };

  // Start editing
  const startEdit = (commentId, message) => {
    setEditingId(commentId);
    setEditingText(message);
  };

  // Save edited comment
  const handleEditComment = async (commentId) => {
    const token = localStorage.getItem("token");
    if (!editingText.trim()) return;
    try {
      await axios.put(
        `https://yt-backend-thbd.onrender.com/api/comments/${commentId}`,
        { message: editingText },
        { headers: { Authorization: `JWT ${token}`, withCredentials: true } }
      );
      setEditingId(null);
      setEditingText("");
      getCommentByVideoId();
    } catch (err) {
      setCommentMessage(
        err.response?.data?.message || "Failed to update comment."
      );
      setTimeout(() => setCommentMessage(""), 2000);
    }
  };

  // Delete comment
  const handleDeleteComment = async (commentId) => {
    const token = localStorage.getItem("token");
    if (!window.confirm("Are you sure you want to delete this comment?")) return;
    try {
      await axios.delete(
        `https://yt-backend-thbd.onrender.com/api/comments/${commentId}`,
        { headers: { Authorization: `JWT ${token}`, withCredentials: true } }
      );
      getCommentByVideoId();
    } catch (err) {
      setCommentMessage(
        err.response?.data?.message || "Failed to delete comment."
      );
      setTimeout(() => setCommentMessage(""), 2000);
    }
  };

  useEffect(() => {
    getCommentByVideoId();
    // eslint-disable-next-line
  }, [videoId]);

  return (
    <div className="mt-6 text-white">
      <h3 className="text-lg font-semibold mb-3">Comments</h3>
      {/* Add Comment */}
      <div className="flex items-start sm:items-center gap-3 mb-4">
        <img
          src={currentUserPic || "https://via.placeholder.com/32"}
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
          comments.map((item) => (
            <div key={item._id} className="flex gap-3 mb-4">
              <img
                src={item?.user?.profilePic || "https://via.placeholder.com/32"}
                alt="User"
                className="w-8 h-8 rounded-full"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-sm">
                    {item.user?.userName || item.user?.username || "User"}
                  </h4>
                  <h5 className="text-xs text-gray-400">
                    {new Date(item.createdAt).toLocaleString()}
                  </h5>
                  {/* Show edit/delete buttons only for own comments */}
                  {String(item.user?._id) === String(currentUserId) && (
                    <div className="flex gap-1 ml-2">
                      {editingId === item._id ? (
                        <>
                          <button
                            className="text-xs text-green-400 hover:underline"
                            onClick={() => handleEditComment(item._id)}
                          >
                            Save
                          </button>
                          <button
                            className="text-xs text-gray-400 hover:underline"
                            onClick={() => setEditingId(null)}
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className="text-xs text-blue-400 hover:underline"
                            onClick={() => startEdit(item._id, item.message)}
                          >
                            Edit
                          </button>
                          <button
                            className="text-xs text-red-400 hover:underline"
                            onClick={() => handleDeleteComment(item._id)}
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
                {editingId === item._id ? (
                  <input
                    type="text"
                    value={editingText}
                    onChange={e => setEditingText(e.target.value)}
                    className="w-full mt-1 p-1 bg-gray-900 rounded text-white text-sm"
                  />
                ) : (
                  <p className="text-sm mt-1">{item.message}</p>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400">No comments yet.</p>
        )}
      </div>
    </div>
  );
}

export default Comments;
