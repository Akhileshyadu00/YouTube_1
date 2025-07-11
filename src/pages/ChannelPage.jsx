import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { MdEdit, MdDelete, MdUpload, MdSave, MdClose } from "react-icons/md";
import SideNavbar from "../Components/SideNavbar";
import { AuthContext } from "../context/AuthContext";

export default function ChannelPage({ sideNavbar }) {
  const { user } = useContext(AuthContext);
  const [channel, setChannel] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showUpload, setShowUpload] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editVideo, setEditVideo] = useState(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    thumbnail: "",
    videoLink: "",
    category: "",
  });
  const [formLoading, setFormLoading] = useState(false);

  const [showEditChannel, setShowEditChannel] = useState(false);
  const [channelEditForm, setChannelEditForm] = useState({
    channelName: "",
    channelBanner: "",
    channelPic: "",
    description: "",
  });
  const [channelEditLoading, setChannelEditLoading] = useState(false);

  const token = user?.token;

  const fetchChannel = async () => {
    if (!user?.channelId) {
      setError("User has no channel");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `http://localhost:4001/api/channels/${user.channelId}`,
        { headers: { Authorization: `JWT ${token}` } }
      );
      if (!res.ok) throw new Error("Failed to load channel");
      const data = await res.json();
      setChannel(data);
      setVideos(data.videos || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChannel();
  }, [user?.channelId]);

  const uploadOrEditVideo = async (isEdit = false) => {
    setFormLoading(true);
    const method = isEdit ? "PUT" : "POST";
    const url = isEdit
      ? `http://localhost:4001/api/videos/${editVideo._id}`
      : "http://localhost:4001/api/videos";

    const payload = {
      ...form,
      channel: user.channelId,
    };

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `JWT ${token}`,
          withCredentials: true,
        },

        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error((await res.json()).message || "Failed");
      await fetchChannel();
      setShowUpload(false);
      setShowEdit(false);
    } catch (err) {
      alert(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const deleteVideo = async (id) => {
    if (!window.confirm("Delete this video?")) return;
    try {
      const res = await fetch(`http://localhost:4001/api/videos/${id}`, {
        method: "DELETE",
        headers: { Authorization: `JWT ${token}`, withCredentials: true },
      });
      if (!res.ok) throw new Error((await res.json()).message);
      setVideos(videos.filter((v) => v._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const openUpload = () => {
    setForm({
      title: "",
      description: "",
      thumbnail: "",
      videoLink: "",
      category: "",
    });
    setShowUpload(true);
  };

  const openEdit = (v) => {
    setEditVideo(v);
    setForm({
      title: v.title,
      description: v.description,
      thumbnail: v.thumbnail,
      videoLink: v.videoLink,
      category: v.category,
    });
    setShowEdit(true);
  };

  const openEditChannel = () => {
    setChannelEditForm({
      channelName: channel.channelName,
      channelBanner: channel.channelBanner,
      channelPic: channel.channelPic,
      description: channel.description,
    });
    setShowEditChannel(true);
  };

  const saveChannelEdit = async () => {
    setChannelEditLoading(true);
    try {
      const res = await fetch(
        `http://localhost:4001/api/channels/${channel._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `JWT ${token}`,
            withCredentials: true,
          },
          body: JSON.stringify(channelEditForm),
        }
      );
      if (!res.ok) throw new Error((await res.json()).message);
      await fetchChannel();
      setShowEditChannel(false);
    } catch (err) {
      console.log(err);

      alert(err.message);
    } finally {
      setChannelEditLoading(false);
    }
  };

  if (loading)
    return <div className="text-white mt-10 text-center">Loading...</div>;
  if (error)
    return <div className="text-red-500 mt-10 text-center">{error}</div>;
  if (!channel) return null;

  return (
    <div className="flex bg-black min-h-screen">
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
              <span>{videos.length} videos</span>
            </div>
            <p className="text-gray-400 mt-2">{channel.description}</p>

            <div className="flex gap-3 mt-4">
              <button
                onClick={openUpload}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white"
              >
                <MdUpload className="inline mr-2" /> Upload Video
              </button>

              <button
                onClick={openEditChannel}
                className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded text-white"
              >
                <MdEdit className="inline mr-2" /> Edit Channel
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((v) => (
            <div
              key={v._id}
              className="bg-gray-900 rounded shadow overflow-hidden"
            >
              <Link to={`/watch/${v._id}`}>
                <img
                  className="w-full h-40 object-cover"
                  src={v.thumbnail}
                  alt={v.title}
                />
              </Link>
              <div className="p-3">
                <h3 className="text-white font-semibold line-clamp-2">
                  {v.title}
                </h3>
                <p className="text-gray-400 text-xs mt-1">
                  {v.views} views •{" "}
                  {new Date(v.uploadDate).toLocaleDateString()}
                </p>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => openEdit(v)}
                    className="text-blue-400 text-xs hover:underline flex items-center"
                  >
                    <MdEdit className="mr-1" /> Edit
                  </button>
                  <button
                    onClick={() => deleteVideo(v._id)}
                    className="text-red-400 text-xs hover:underline flex items-center"
                  >
                    <MdDelete className="mr-1" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {showUpload && (
          <Modal title="Upload Video" onClose={() => setShowUpload(false)}>
            <VideoForm
              form={form}
              setForm={setForm}
              onSubmit={() => uploadOrEditVideo(false)}
              loading={formLoading}
            />
          </Modal>
        )}

        {showEdit && (
          <Modal title="Edit Video" onClose={() => setShowEdit(false)}>
            <VideoForm
              form={form}
              setForm={setForm}
              onSubmit={() => uploadOrEditVideo(true)}
              loading={formLoading}
            />
          </Modal>
        )}

        {showEditChannel && (
          <Modal title="Edit Channel" onClose={() => setShowEditChannel(false)}>
            <ChannelForm
              form={channelEditForm}
              setForm={setChannelEditForm}
              onSubmit={saveChannelEdit}
              loading={channelEditLoading}
            />
          </Modal>
        )}
      </main>
    </div>
  );
}
