import React, { useEffect, useState, useContext } from "react";
import { MdEdit, MdClose } from "react-icons/md";
import SideNavbar from "../Components/SideNavbar";
import { AuthContext } from "../context/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams } from "react-router-dom";

// Simple Modal component
function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-gray-900 p-6 rounded-lg w-full max-w-md relative">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-white"
          onClick={onClose}
        >
          <MdClose size={24} />
        </button>
        <h2 className="text-xl font-bold text-white mb-4">{title}</h2>
        {children}
      </div>
    </div>
  );
}

export default function ChannelPage({ sideNavbar }) {
  const { user } = useContext(AuthContext); // <-- Use user, not userId!
  const { id } = useParams();
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal and form states
  const [showEditChannel, setShowEditChannel] = useState(false);
  const [channelForm, setChannelForm] = useState({
    channelName: "",
    description: "",
    channelBanner: "",
    channelPic: "",
  });
  const [channelFormLoading, setChannelFormLoading] = useState(false);

  const token = user?.token; // <-- Correct way to get JWT
  console.log(token);
  

  // Fetch channel on mount or when channel id changes
  useEffect(() => {
    if (!id) {
      setChannel(null);
      setLoading(false);
      return;
    }
    fetchChannel();
    // eslint-disable-next-line
  }, [id]);

  const fetchChannel = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `http://localhost:4001/api/channels/${id}`,
        { headers: { Authorization: `JWT ${token}` } }
      );
      if (!res.ok) throw new Error("Failed to load channel");
      const data = await res.json();
      setChannel(data);
    } catch (err) {
      setError(err.message);
      setChannel(null);
    } finally {
      setLoading(false);
    }
  };

  // Edit channel details
  const handleChannelEdit = async (e) => {
    e.preventDefault();
    setChannelFormLoading(true);
    try {
      const res = await fetch(
        `http://localhost:4001/api/channels/${channel._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `JWT ${token}`,
          },
          body: JSON.stringify(channelForm),
        }
      );
      if (!res.ok) throw new Error((await res.json()).message || "Failed");
      toast.success("Channel updated!");
      setShowEditChannel(false);
      fetchChannel();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setChannelFormLoading(false);
    }
  };

  // UI handlers
  const openEditChannelForm = () => {
    setChannelForm({
      channelName: channel.channelName,
      description: channel.description,
      channelBanner: channel.channelBanner,
      channelPic: channel.channelPic,
    });
    setShowEditChannel(true);
  };

  // Render
  if (loading)
    return <div className="text-white mt-10 text-center">Loading...</div>;
  if (error)
    return <div className="text-red-500 mt-10 text-center">{error}</div>;

  // No channel: show message
  if (!channel) {
    return (
      <div className="flex bg-black min-h-screen">
        <SideNavbar isOpen={sideNavbar} />
        <main className="flex-1 p-4">
          <div className="max-w-md mx-auto bg-gray-900 rounded-lg p-8 mt-16 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              No Channel Found
            </h2>
            <p className="text-gray-400">Please create a channel first.</p>
          </div>
        </main>
      </div>
    );
  }

  // Channel exists: show channel page
  return (
    <div className="flex bg-black min-h-screen">
      <ToastContainer position="bottom-right" />
      <SideNavbar isOpen={sideNavbar} />
      <main className={`flex-1 ${sideNavbar ? "ml-60" : "ml-0"} p-4`}>
        <img
          src={
            channel.channelBanner?.trim()
              ? channel.channelBanner
              : "https://via.placeholder.com/800x200?text=Banner"
          }
          alt="Banner"
          className="w-full h-48 sm:h-64 object-cover rounded mb-6"
        />

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
          <img
            src={
              channel.channelPic || "https://via.placeholder.com/100?text=Pic"
            }
            alt="Channel"
            className="w-24 h-24 rounded-full border-2 border-gray-700 object-cover"
          />
          <div>
            <h2 className="text-2xl font-bold text-white">
              {channel.channelName}
            </h2>
            <div className="flex text-gray-300 text-sm gap-4 mt-1">
              <span>
                @{channel.channelName.replace(/\s+/g, "").toLowerCase()}
              </span>
              <span>{channel.subscribers} subscribers</span>
            </div>
            <p className="text-gray-400 mt-2">{channel.description}</p>

            <div className="flex gap-3 mt-4">
              <button
                onClick={openEditChannelForm}
                className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded text-white"
              >
                <MdEdit className="inline mr-2" /> Edit Channel
              </button>
            </div>
          </div>
        </div>

        {/* Edit Channel Modal */}
        {showEditChannel && (
          <Modal title="Edit Channel" onClose={() => setShowEditChannel(false)}>
            <form onSubmit={handleChannelEdit}>
              <input
                className="w-full mb-3 p-2 rounded"
                name="channelName"
                type="text"
                placeholder="Channel Name"
                value={channelForm.channelName}
                onChange={e =>
                  setChannelForm({ ...channelForm, channelName: e.target.value })
                }
                required
                autoFocus
              />
              <input
                className="w-full mb-3 p-2 rounded"
                name="channelBanner"
                type="url"
                placeholder="Banner image URL"
                value={channelForm.channelBanner}
                onChange={e =>
                  setChannelForm({ ...channelForm, channelBanner: e.target.value })
                }
              />
              <input
                className="w-full mb-3 p-2 rounded"
                name="channelPic"
                type="url"
                placeholder="Channel picture URL"
                value={channelForm.channelPic}
                onChange={e =>
                  setChannelForm({ ...channelForm, channelPic: e.target.value })
                }
              />
              <textarea
                className="w-full mb-3 p-2 rounded"
                name="description"
                placeholder="Channel Description"
                value={channelForm.description}
                onChange={e =>
                  setChannelForm({ ...channelForm, description: e.target.value })
                }
                rows={2}
              />
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  className="bg-gray-700 text-white px-4 py-2 rounded"
                  onClick={() => setShowEditChannel(false)}
                  disabled={channelFormLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                  disabled={channelFormLoading}
                >
                  {channelFormLoading ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </Modal>
        )}
      </main>
    </div>
  );
}
