import React from "react";
import { SlHome } from "react-icons/sl";
import { SiYoutubeshorts } from "react-icons/si";
import { MdSubscriptions, MdOutlineWatchLater } from "react-icons/md";
import { FaHistory, FaChevronRight } from "react-icons/fa";
import { GoVideo, GoDownload } from "react-icons/go";
import { AiFillLike } from "react-icons/ai";

function SideNavbar({ isOpen }) {
  const subscriptions = new Array(7).fill({
    name: "AajTak",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Aaj_tak_logo.png/640px-Aaj_tak_logo.png"
  });

  if (!isOpen) return null; // Return nothing if sidebar is not open

  return (
    <nav className="fixed top-16 left-0 w-60 h-screen overflow-y-auto bg-black text-white shadow-lg">
      <div className="p-4 space-y-2">
        {/* Top Menu */}
        <div className="space-y-2">
          <NavItem icon={<SlHome />} label="Home" />
          <NavItem icon={<SiYoutubeshorts />} label="Shorts" />
          <NavItem icon={<MdSubscriptions />} label="Subscriptions" />
        </div>

        <hr className="my-4 border-gray-700" />

        {/* You Section */}
        <div>
          <div className="flex items-center text-xl text-gray-400 px-2 mb-2">
            You
            <FaChevronRight />
          </div>
          <NavItem icon={<FaHistory />} label="History" />
          <NavItem icon={<MdSubscriptions />} label="Subscription" />
          <NavItem icon={<GoVideo />} label="Your Videos" />
          <NavItem icon={<MdOutlineWatchLater />} label="Watch Later" />
          <NavItem icon={<AiFillLike />} label="Liked Videos" />
          <NavItem icon={<GoDownload />} label="Download" />
        </div>

        <hr className="my-4 border-gray-700" />

        {/* Subscriptions */}
        <div>
          {subscriptions.map((channel, index) => (
            <div key={index} className="flex items-center gap-3 cursor-pointer hover:bg-gray-800 p-2 rounded">
              <img
                src={channel.logo}
                alt={channel.name}
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="text-sm">{channel.name}</span>
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
}

function NavItem({ icon, label }) {
  return (
    <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-800 px-3 py-2 rounded">
      {icon}
      <span>{label}</span>
    </div>
  );
}

export default SideNavbar;