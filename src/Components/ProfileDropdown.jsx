import React from "react";
import { Link } from "react-router-dom";
import { GrChannel } from "react-icons/gr";

import {
  MdOutlineSwitchAccount,
  MdLogout,
  MdOutlineSettings,
  MdOutlineKeyboard,
  MdOutlineDataUsage,
  MdOutlinePalette,
  MdOutlineLanguage,
  MdOutlineLocationOn,
  MdOutlineNoEncryption,
  MdManageAccounts,
} from "react-icons/md";
import { TbHexagonLetterP } from "react-icons/tb";
import { PiShoppingBagOpenLight } from "react-icons/pi";
import { SiYoutubestudio } from "react-icons/si";

function ProfileDropdown({ profileOpen, user, handleLogout }) {
  if (!profileOpen) return null;
  console.log(user);
  
  

  console.log(user);
  return (
    <div className="absolute right-0 mt-2 w-64 bg-black text-white rounded-lg shadow-lg z-50">
      <div className="flex items-center gap-3 px-4 py-3">
        <img
          src={
            user.profilePic || "https://randomuser.me/api/portraits/men/1.jpg"
          }
          alt={user.name || "User"}
          className="w-12 h-12 rounded-full object-cover border-2 border-red-500"
        />
        <div>
          <div className="font-semibold text-lg">
            {user.name || user?.name || "User"}
          </div>
          <div className="text-gray-400 text-sm">@{user.id || "userId"}</div>


          <div className="text-gray-400 text-sm">
            @{user.channelName || "channelName"}
          </div>
          

          
          <Link
            to={`/user/${user.id || ""}`}
            className="text-blue-400 text-sm hover:underline"
          >
            View your channel
          </Link>
        </div>
      </div>

      <hr className="border-gray-700 my-2" />

      <Link to={`/createchannel`}>
        <MenuItem icon={<GrChannel />} label="Create Channel" />{" "}
      </Link>
   
<Link to={`/channel/${user.channelId}`}>
    <MenuItem icon={<MdManageAccounts />} label="Manage Channel" />
  </Link>


      <MenuItem icon={<MdLogout />} label="Sign out" onClick={handleLogout} />
      <MenuItem
        icon={<MdOutlineSwitchAccount />}
        label="Switch account"
        rightArrow
      />
      {/* <MenuItem icon={<MdLogout />} label="Sign out" onClick={handleLogout} /> */}

      <hr className="border-gray-700 my-2" />

      <MenuItem icon={<SiYoutubestudio />} label="YouTube Studio" />
      <MenuItem
        icon={<TbHexagonLetterP className="text-pink-500" />}
        label="Your Premium benefits"
      />
      <MenuItem
        icon={<PiShoppingBagOpenLight />}
        label="Purchases and memberships"
      />

      <hr className="border-gray-700 my-2" />

      <MenuItem icon={<MdOutlineDataUsage />} label="Your data in YouTube" />
      <MenuItem
        icon={<MdOutlinePalette />}
        label="Appearance: Device theme"
        rightArrow
      />
      <MenuItem
        icon={<MdOutlineLanguage />}
        label="Language: English"
        rightArrow
      />
      <MenuItem
        icon={<MdOutlineNoEncryption />}
        label="Restricted Mode: Off"
        rightArrow
      />
      <MenuItem
        icon={<MdOutlineLocationOn />}
        label="Location: India"
        rightArrow
      />
      <MenuItem icon={<MdOutlineKeyboard />} label="Keyboard shortcuts" />

      <hr className="border-gray-700 my-2" />

      <MenuItem icon={<MdOutlineSettings />} label="Settings" />
    </div>
  );
}

// Helper for menu items
function MenuItem({ icon, label, rightArrow, onClick }) {
  return (
    <button
      className="flex items-center justify-between w-full px-4 py-2 rounded-md hover:bg-gray-800 transition-colors text-left"
      onClick={onClick}
      type="button"
    >
      <span className="flex items-center gap-3">
        <span className="text-lg">{icon}</span>
        <span className="text-sm">{label}</span>
      </span>
      {rightArrow && (
        <svg
          className="w-4 h-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      )}
    </button>
  );
}

export default ProfileDropdown;
