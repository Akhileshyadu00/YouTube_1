import React, { useEffect, useState, useContext } from "react";
import { MdEdit, MdClose } from "react-icons/md";
import SideNavbar from "../Components/SideNavbar";
import { AuthContext } from "../context/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams, Link } from "react-router-dom";



function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-gray-900 p-6 rounded-lg w-full max-w-md relative shadow-xl">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-white"
          onClick={onClose}
          aria-label="Close"
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

  const { id } = useParams();
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { token } = useContext(AuthContext);

  // Modal and form states
  const [showEditChannel, setShowEditChannel] = useState(false);
  const [channelForm, setChannelForm] = useState({
    channelName: "",
    description: "",
    channelBanner: "",
  });
  const [channelFormLoading, setChannelFormLoading] = useState(false);

  // console.log("Fetching channel with id:", id, "token:", token);

  useEffect(() => {
    // console.log("Channel ID:", id);
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
      const res = await fetch(`http://localhost:4001/api/channels/${id}`, {
        headers: { Authorization: `JWT ${token}` },
        withCredentials: true,
      });
      //console.log(res);

      if (!res.ok) throw new Error("Failed to load channel");
      const data = await res.json();
      // console.log(data);

      setChannel(data);
    } catch (err) {
     // console.log(err);

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
            withCredentials: true
          },
          body: JSON.stringify(channelForm),
        }
      );
      //console.log(res);

      if (!res.ok) throw new Error((await res.json()).message || "Failed");
      toast.success("Channel updated!");
      setShowEditChannel(false);
      fetchChannel();
    } catch (err) {
      //console.log(err);

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
    });
    setShowEditChannel(true);
  };

  const handleDeleteChannel = async () => {
  if (!window.confirm("Are you sure you want to delete this channel? This action cannot be undone.")) return;
  try {
    const res = await fetch(`http://localhost:4001/api/channels/${channel._id}`, {
      method: "DELETE",
      headers: {
        Authorization: `JWT ${token}`,
      },
       withCredentials: true,
    });
    console.log(res);
    
    if (!res.ok) throw new Error((await res.json()).message || "Failed to delete channel");
    toast.success("Channel deleted!");
    // Optionally redirect or refresh UI after deletion:
    // window.location.href = "/"; // Go to home or another appropriate route
    setChannel(null); // Remove channel from state to trigger fallback UI
  } catch (err) {
    toast.error(err.message);
  }
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
          <div className="max-w-md mx-auto bg-gray-900 rounded-lg p-8 mt-16 text-center shadow-lg">
            <h2 className="text-2xl font-bold text-white mb-4">
              No Channel Found
            </h2>
            <p className="text-gray-400 mb-6">Please create a channel first.</p>
            <Link to="/createchannel">
              <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold transition">
                Create Channel
              </button>
            </Link>
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
        {/* <div className="relative w-full mb-8">
          <img
            src={
              channel.channelBanner?.trim()
                ? channel.channelBanner
                : "https://via.placeholder.com/800x200?text=Banner"
            }
            alt="Banner"
            className="w-full h-48 sm:h-64 object-cover rounded-lg shadow"
          />
          <div className="absolute left-6 -bottom-10 sm:left-12">
            <img
              src={
                channel.channelPic ||
                "https://via.placeholder.com/100?text=Pic"
              }
              alt="Channel"
              className="w-24 h-24 rounded-full border-4 border-gray-900 object-cover shadow-lg"
            />
          </div>
        </div>
        <div className="mt-12 sm:mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white">
              {channel.channelName}
            </h2>
            <div className="flex text-gray-300 text-base gap-4 mt-2">
              <span>
                @{channel.channelName.replace(/\s+/g, "").toLowerCase()}
              </span>
              <span>{channel.subscribers} subscribers</span>
            </div>
            <p className="text-gray-400 mt-4 max-w-xl">{channel.description}</p>
            <div className="flex gap-3 mt-6">
              <button
                onClick={openEditChannelForm}
                className="bg-gray-800 hover:bg-gray-700 px-5 py-2 rounded-full text-white font-semibold transition focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <MdEdit className="inline mr-2" /> Edit Channel
              </button>
            </div>
          </div>
        </div> */}

        <div className="relative w-full mb-8">
          <img
            src={
              channel.channelBanner?.trim()
                ? channel.channelBanner
                : "https://via.placeholder.com/800x200?text=Banner"
            }
            alt="Banner"
            className="w-full h-48 sm:h-64 object-cover rounded-lg shadow"
          />
          {/* Centered avatar */}
          <div className="absolute left-1/2 -bottom-12 transform -translate-x-1/2">
            <img
              src={
                channel.channelBanner || "https://via.placeholder.com/100?text=Pic"
              }
              alt="Channel"
              className="w-24 h-24 rounded-full border-4 border-gray-900 object-cover shadow-lg bg-white"
            />
          </div>
        </div>
        {/* Add margin-top to push content below avatar */}
        <div className="mt-16 sm:mt-12 flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white">
              {channel.channelName}
            </h2>
            <div className="flex text-gray-300 text-base gap-4 mt-2">
              <span>
                @{channel.channelName.replace(/\s+/g, "").toLowerCase()}
              </span>
              <span>{channel.subscribers} subscribers</span>
            </div>
            <p className="text-gray-400 mt-4 max-w-xl">{channel.description}</p>
            {/* 
             */}
             <div className="flex gap-3 mt-6">
  <button
    onClick={openEditChannelForm}
    className="bg-gray-800 hover:bg-gray-700 px-5 py-2 rounded-full text-white font-semibold transition focus:outline-none focus:ring-2 focus:ring-blue-500"
  >
    <MdEdit className="inline mr-2" /> Edit Channel
  </button>
  <button
    onClick={handleDeleteChannel}
    className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-full text-white font-semibold transition focus:outline-none focus:ring-2 focus:ring-red-500"
  >
    Delete Channel
  </button>
</div>

          </div>
        </div>

        {/* Edit Channel Modal */}
        {showEditChannel && (
          <Modal title="Edit Channel" onClose={() => setShowEditChannel(false)}>
            <form onSubmit={handleChannelEdit} className="text-white">
              <input
                className="w-full mb-3 p-2 rounded"
                name="channelName"
                type="text"
                placeholder="Channel Name"
                value={channelForm.channelName}
                onChange={(e) =>
                  setChannelForm({
                    ...channelForm,
                    channelName: e.target.value,
                  })
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
                onChange={(e) =>
                  setChannelForm({
                    ...channelForm,
                    channelBanner: e.target.value,
                  })
                }
              />
              {/* <input
                className="w-full mb-3 p-2 rounded"
                name="channelPic"
                type="url"
                placeholder="Channel picture URL"
                value={channelForm.channelPic}
                onChange={(e) =>
                  setChannelForm({ ...channelForm, channelPic: e.target.value })
                }
              /> */}
              <textarea
                className="w-full mb-3 p-2 rounded"
                name="description"
                placeholder="Channel Description"
                value={channelForm.description}
                onChange={(e) =>
                  setChannelForm({
                    ...channelForm,
                    description: e.target.value,
                  })
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