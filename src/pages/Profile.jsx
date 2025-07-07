import React, { useEffect, useState } from "react";
import axios from "axios";
import SideNavbar from "../Components/SideNavbar";
import { Link, useParams } from "react-router-dom";

function Profile({ sideNavbar }) {
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [user, setUser] = useState(null);

  const fetchProfileData = async () => {
    axios
      .get(`http://localhost:4001/api/videos/${id}/channel`)
      //console.log(id);
      .then((response) => {
        console.log(response);
        setData(response.data.videos);
        setUser(response.data.videos[0]?.user);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

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
          <h1 className="text-2xl font-bold">Your Channel</h1>
        </header>

        {/* Profile Info */}
        <section className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
          <img
            src={user?.profilePic}
            alt={user?.userName}
            className="w-20 h-20 rounded-full object-cover"
          />
          <div>
            <h2 className="text-xl font-semibold">{user?.channelName}</h2>
            <p className="text-gray-400 text-sm">{data?.length} Videos</p>
            <h3 className="text-gray-400 text-sm">{user?.about}</h3>
          </div>
        </section>

        {/* Uploaded Videos */}
        <section>
          <h3 className="text-lg font-semibold mb-4">Uploaded Videos</h3>
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {/* {[...Array(6)].map((_, idx) => (
              <div
                key={idx}
                className="bg-gray-900 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition"
              >
                <div className="aspect-video">
                  <img
                    src={`https://source.unsplash.com/random/300x200?sig=${idx}`}
                    alt={`Video ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-3">
                  <h4 className="text-white font-medium text-sm line-clamp-2">
                    Video Title #{idx + 1}
                  </h4>
                  <p className="text-gray-400 text-xs mt-1">12K views • 3 days ago</p>
                </div>
              </div>
            ))} */}

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
