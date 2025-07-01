import React from "react";
import SideNavbar from "../Components/SideNavbar";

function Profile({ sideNavbar }) {
  return (
    <div className="flex bg-black min-h-screen text-white">
      {/* Sidebar */}
      <SideNavbar sideNavbar={sideNavbar} />

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${sideNavbar ? "ml-60" : "ml-0"} p-4`}>
        {/* Header */}
        <header className="mb-6 border-b border-gray-700 pb-4">
          <h1 className="text-2xl font-bold">Your Channel</h1>
        </header>

        {/* Profile Info */}
        <section className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
          <img
            src="https://via.placeholder.com/80"
            alt="Channel Avatar"
            className="w-20 h-20 rounded-full object-cover"
          />
          <div>
            <h2 className="text-xl font-semibold">Username</h2>
            <p className="text-gray-400 text-sm">1.2M subscribers</p>
            <button className="mt-2 px-4 py-1 bg-gray-700 rounded hover:bg-gray-600 text-sm transition-colors">
              Customize Channel
            </button>
          </div>
        </section>

        {/* Uploaded Videos */}
        <section>
          <h3 className="text-lg font-semibold mb-4">Uploaded Videos</h3>
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, idx) => (
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
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Profile;