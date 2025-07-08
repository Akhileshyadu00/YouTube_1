import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import SideNavbar from "../Components/SideNavbar";
import { AuthContext } from "../context/AuthContext";

function Profile({ sideNavbar }) {
  const { id: paramId } = useParams();
  const { userId: contextUserId } = useContext(AuthContext);

  const actualUserId = paramId || contextUserId;

  const [data, setData] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        if (!actualUserId) return; // Wait until we have an ID

        const response = await axios.get(
          `http://localhost:4001/api/videos/${actualUserId}/channel`
        );

        setData(response.data.videos || []);
        setUser(response.data.videos[0]?.user || null);
      } catch (error) {
        console.error("Failed to fetch profile data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [actualUserId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black text-white">
        <p>Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black text-white">
        <p>User not found.</p>
      </div>
    );
  }

  return (
    <div className="flex bg-black min-h-screen text-white">
      {/* Sidebar */}
      <SideNavbar sideNavbar={sideNavbar} />

      {/* Main Content */}
      <main
        className={`flex-1 transition-all duration-300 ${
          sideNavbar ? "ml-60" : "ml-0"
        } p-4`}
      >
        {/* Header */}
        <header className="mb-6 border-b border-gray-700 pb-4">
          <h1 className="text-2xl font-bold">
            {actualUserId === contextUserId ? "Your Channel" : `${user.userName}'s Channel`}
          </h1>
        </header>

        {/* Profile Info */}
        <section className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
          <img
            src={user.profilePic}
            alt={user.userName}
            className="w-20 h-20 rounded-full object-cover"
          />
          <div>
            <h2 className="text-xl font-semibold">{user.channelName}</h2>
            <p className="text-gray-400 text-sm">{data.length} Videos</p>
            <h3 className="text-gray-400 text-sm">{user.about}</h3>
          </div>
        </section>

        {/* Uploaded Videos */}
        <section>
          <h3 className="text-lg font-semibold mb-4">Uploaded Videos</h3>
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {data.map((video) => (
              <Link to={`/watch/${video._id}`} key={video._id}>
                <div className="bg-gray-900 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition">
                  <div className="aspect-video">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-3">
                    <h4 className="text-white font-medium text-sm line-clamp-2">
                      {video.title}
                    </h4>
                    <p className="text-gray-400 text-xs mt-1">
                      {video.views} views •{" "}
                      {new Date(video.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Profile;
