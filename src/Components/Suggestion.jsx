const suggestions = [
  {
    title: "How to Learn React Fast",
    channel: "CodeMaster",
    thumbnail: "https://source.unsplash.com/random/100x60?sig=1",
    video: "/watch/abc123", 
  },
  {
    title: "10 Amazing CSS Tricks",
    channel: "DesignHub",
    thumbnail: "https://source.unsplash.com/random/100x60?sig=2",
    video: "/watch/def456",
  },
  {
    title: "JavaScript Async Explained",
    channel: "JS Academy",
    thumbnail: "https://source.unsplash.com/random/100x60?sig=3",
    video: "/watch/ghi789",
  },
  
];

import { Link } from "react-router-dom";

export default function Suggestion() {
  return (
    <aside className="w-full lg:w-1/4 flex flex-col gap-4">
      <h3 className="text-white text-lg font-semibold mb-2">Suggestions</h3>
      {suggestions.map((item, idx) => (
        <Link to={item.video} key={idx}>
          <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-800 p-2 rounded">
            <img
              src={item.thumbnail}
              alt={`Suggested video ${idx + 1}`}
              className="w-24 h-16 object-cover rounded"
            />
            <div className="flex flex-col">
              <span className="text-white text-sm line-clamp-2">
                {item.title}
              </span>
              <span className="text-gray-400 text-xs">{item.channel}</span>
            </div>
          </div>
        </Link>
      ))}
    </aside>
  );
}
