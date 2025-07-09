import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

function ChannelPage() {
  const { id } = useParams();
  const [channel, setChannel] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch channel info
  const fetchChannel = async () => {
    try {
      const res = await axios.get(`http://localhost:4001/api/channels/${id}`);
      setChannel(res.data);
    } catch (err) {
      console.error("Channel fetch error:", err);
      setChannel(null);
    }
  };

  // Fetch channel videos
  const fetchChannelVideos = async () => {
    try {
      const res = await axios.get(`http://localhost:4001/api/videos/channel/${id}`);
      setVideos(res.data.videos || []);
    } catch (err) {
      console.error("Channel videos fetch error:", err);
      setVideos([]);
    }
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchChannel(), fetchChannelVideos()]).then(() => setLoading(false));
    // eslint-disable-next-line
  }, [id]);

  if (loading) return <div className="text-white text-center mt-10">Loading...</div>;
  if (!channel) return <div className="text-white text-center mt-10">Channel not found.</div>;

  return (
    <div className="bg-black min-h-screen text-white">
      {/* Channel Banner */}
      {channel.channelBanner && (
        <img
          src={channel.channelBanner}
          alt="Banner"
          className="w-full h-48 object-cover"
        />
      )}

      <div className="max-w-5xl mx-auto p-4">
        {/* Channel Info */}
        <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
          <img
            src={channel.owner?.profilePic || "/default-profile.png"}
            alt={channel.channelName}
            className="w-24 h-24 rounded-full object-cover border-4 border-gray-800"
          />
          <div>
            <h1 className="text-3xl font-bold">{channel.channelName}</h1>
            <p className="text-gray-400 mt-1">{channel.description || "No channel description."}</p>
            <p className="text-gray-400 mt-1">
              Subscribers: <span className="font-semibold">{channel.subscribers || 0}</span>
            </p>
          </div>
        </div>

        {/* Videos Section */}
        <h2 className="text-2xl font-semibold mb-4">Videos</h2>
        {videos.length === 0 ? (
          <p className="text-gray-500">No videos uploaded yet.</p>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-items-center">
            {videos.map((video) => (
              <Link to={`/watch/${video._id}`} key={video._id}>
                <div className="w-full sm:w-[280px] md:w-[300px] min-h-[260px] md:min-h-[300px] bg-gray-900 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition transform hover:-translate-y-1">
                  <div className="aspect-video">
                    <img
                      src={video.thumbnail || "/default-thumbnail.png"}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-3">
                    <h4 className="text-white font-medium text-sm line-clamp-2">
                      {video.title}
                    </h4>
                    <p className="text-gray-400 text-xs mt-1">
                      {video.views || 0} views •{" "}
                      {video.createdAt
                        ? new Date(video.createdAt).toLocaleDateString()
                        : ""}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ChannelPage;
