
import React from 'react'

const CategoryFilter = ({ categories, selected, onSelect, fullNav }) => (
  <div
    className={`fixed top-16 ${fullNav ? "left-60" : "left-0"} right-0 z-10 bg-gray-900 px-4 py-2 overflow-x-auto whitespace-nowrap shadow-md scrollbar-hide`}
  >
    <div className="flex space-x-4">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className={`px-4 py-1 rounded-2xl text-sm transition-colors ${
            selected === cat ? "bg-white text-black" : "bg-gray-700 hover:bg-gray-600"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  </div>
);

export default CategoryFilter
