import React from "react";
import { FaGoogle, FaYoutube, FaRegUserCircle } from "react-icons/fa";
import { IoMdSwitch, IoMdLogOut } from "react-icons/io";
import { MdOutlineKeyboard, MdOutlineSettings } from "react-icons/md";
import { BsFillMoonFill } from "react-icons/bs";
import { PiGlobe } from "react-icons/pi";
import { AiOutlineSafetyCertificate } from "react-icons/ai";
import { RiVipCrownFill } from "react-icons/ri";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { Link } from "react-router-dom";

const ProfileMenu = () => (
  <div className="w-80 bg-gray-900 text-white rounded-xl shadow-lg p-4">
    {/* Profile Section */}
    <div className="flex items-center gap-3 mb-4">
      <img
        src="https://randomuser.me/api/portraits/men/1.jpg"
        alt="Akhilesh Yadav"
        className="w-12 h-12 rounded-full object-cover border-2 border-red-500"
      />
      <div>
        <div className="font-semibold text-lg">Akhilesh Yadav</div>
        <div className="text-gray-400 text-sm">@akhileshyadu00</div>
        <Link to={"#"} className="text-blue-400 text-sm hover:underline">View your channel</Link>
      </div>
    </div>
    <hr className="border-gray-700 my-2" />

    {/* Menu Items */}
    <div className="flex flex-col gap-1">
      <MenuItem icon={<FaGoogle />} label="Google Account" />
      <MenuItem icon={<IoMdSwitch />} label="Switch account" hasArrow />
      <MenuItem icon={<IoMdLogOut />} label="Sign out" />

      <hr className="border-gray-700 my-2" />

      <MenuItem icon={<FaYoutube />} label="YouTube Studio" />
      <MenuItem icon={<RiVipCrownFill className="text-pink-500" />} label="Your Premium benefits" />
      <MenuItem icon={<HiOutlineShoppingBag />} label="Purchases and memberships" />

      <hr className="border-gray-700 my-2" />

      <MenuItem icon={<AiOutlineSafetyCertificate />} label="Your data in YouTube" />
      <MenuItem icon={<BsFillMoonFill />} label="Appearance: Device theme" hasArrow />
      <MenuItem icon={<PiGlobe />} label="Language: English" hasArrow />
      <MenuItem icon={<MdOutlineSafetyCertificate />} label="Restricted Mode: Off" hasArrow />
      <MenuItem icon={<PiGlobe />} label="Location: India" hasArrow />
      <MenuItem icon={<MdOutlineKeyboard />} label="Keyboard shortcuts" />

      <hr className="border-gray-700 my-2" />

      <MenuItem icon={<MdOutlineSettings />} label="Settings" />
    </div>
  </div>
);

// Helper component for menu items
function MenuItem({ icon, label, hasArrow }) {
  return (
    <button
      className="flex items-center justify-between w-full px-2 py-2 rounded-md hover:bg-gray-800 transition-colors text-left"
    >
      <span className="flex items-center gap-3">
        <span className="text-lg">{icon}</span>
        <span className="text-sm">{label}</span>
      </span>
      {hasArrow && (
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      )}
    </button>
  );
}

export default ProfileMenu;
