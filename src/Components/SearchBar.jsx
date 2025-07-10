  import React, { useState } from "react";
  import { CiSearch } from "react-icons/ci";
  import { MdKeyboardVoice } from "react-icons/md";
  import { Link } from "react-router-dom";

  function SearchBar() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [hasSearched, setHasSearched] = useState(false);

    const handleSearch = async (e) => {
      e.preventDefault();
      const trimmed = query.trim();
      if (!trimmed) return;

      setHasSearched(true);

      try {
        setLoading(true);
        setError("");
        const res = await fetch(
          `http://localhost:4001/api/videos?search=${encodeURIComponent(trimmed)}`
        );
        
        if (!res.ok) throw new Error("Failed to fetch search results");
        const data = await res.json();
        console.log(data);
        
        setResults(data.videos || []);
      } catch (err) {
        console.log(err);
        
        setError("An error occurred while searching.");
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="flex flex-col items-center gap-6 w-full max-w-2xl mx-auto px-4 py-6">
        <div className="flex w-full items-center gap-3">
          <form
            onSubmit={handleSearch}
            className="flex flex-1 items-center border border-gray-600 rounded-full overflow-hidden bg-gray-900"
          >
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                if (e.target.value.trim() === "") {
                  setHasSearched(false);
                  setResults([]);
                  setError("");
                }
              }}
              placeholder="Search"
              className="flex-grow p-2 pl-4 text-gray-100 bg-transparent focus:outline-none"
              aria-label="Search"
            />
            <button
              type="submit"
              className="bg-gray-700 p-2 border-l border-gray-600 hover:bg-gray-600 transition-colors"
              title="Search"
            >
              <CiSearch className="text-2xl text-white" />
            </button>
          </form>

          <button
            className="bg-gray-700 p-3 rounded-full hover:bg-gray-600 transition-colors"
            title="Voice Search"
            onClick={() => alert("Voice search not implemented yet!")}
            type="button"
          >
            <MdKeyboardVoice className="text-2xl text-white" />
          </button>
        </div>

        {loading && <div className="text-gray-300">Searching...</div>}
        {error && <div className="text-red-500">{error}</div>}

        {/* Results */}
        {results.length > 0 && (
    <div className="w-full bg-black p-4 rounded-md">
      <ul className="text-gray-200 space-y-3">
        {results.map((video) => (
          <li
            key={video._id}
            className="border-b border-gray-700 pb-2 hover:bg-gray-700/40 rounded-md transition"
          >
            <Link
              to={`/watch/${video._id}`}
              onClick={() => {
                setQuery("");
                setResults([]);
                setHasSearched(false);
              }}
              className="block p-2"
            >
              <div className="font-medium text-white">{video.title}</div>
              <div className="text-sm text-gray-400">
                by {video.user?.userName || "Unknown"}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )}


        {/* Only show "No Video Found..." after a search */}
        {hasSearched && !loading && results.length === 0 && !error && (
          <div className="text-gray-400 mt-2">No Video Found...</div>
        )}
      </div>
    );
  }

  export default SearchBar;
