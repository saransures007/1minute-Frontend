// components/ProductRequest.tsx

import { useState, useEffect } from "react";
import { Search, ThumbsUp, Flame } from "lucide-react";
import { apiService } from "@/lib/api/api";

export default function ProductRequest() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [trending, setTrending] = useState<any[]>([]);

  useEffect(() => {
    loadTrending();
  }, []);

  const loadTrending = async () => {
    try {
      const res = await apiService.getTrendingRequests();
      if (res.success) setTrending(res.data);
    } catch {}
  };

  // 🔥 SEARCH
  const handleSearch = async (q: string) => {
    setQuery(q);

    if (q.length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);

    try {
      const res = await apiService.searchProducts(q);
      if (res.success) {
        setResults(res.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // ➕ REQUEST PRODUCT
  const handleRequest = async () => {
    if (!query) return;

    const res = await apiService.createProductRequest({ name: query });

    if (res.success) {
      alert("Request submitted");
      setQuery("");
      setResults([]);
      loadTrending();
    }
  };

  // 👍 VOTE
  const handleVote = async (id: string) => {
    const res = await apiService.voteProduct(id);
    if (res.success) {
      loadTrending();
    } else {
      alert(res.message);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">

      {/* 🔍 SEARCH BAR */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-3 w-4 h-4" />
        <input
          className="w-full border rounded-lg pl-9 pr-4 py-3"
          placeholder="Search product..."
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      {/* 🔥 SEARCH RESULTS */}
      {results.length > 0 && (
        <div className="border rounded-lg mb-6">
          {results.map((item, i) => (
            <div
              key={i}
              className="p-3 border-b flex justify-between items-center"
            >
              <div>
                <p className="font-medium">{item.name}</p>

                <p className="text-xs text-gray-500">
                  {item.source} • {Math.round(item.score * 100)}% match
                </p>
              </div>

              {item.source === "local" && (
                <button
                  onClick={() => handleVote(item.id)}
                  className="text-sm flex items-center gap-1"
                >
                  👍 {item.votes || 0}
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ➕ REQUEST CTA */}
      {query.length > 2 && results.length === 0 && !loading && (
        <div className="border rounded-lg p-4 text-center">
          <p className="mb-2">Not found</p>
          <button
            onClick={handleRequest}
            className="bg-black text-white px-4 py-2 rounded"
          >
            Request "{query}"
          </button>
        </div>
      )}

      {/* 🔥 TRENDING */}
      {trending.length > 0 && (
        <div>
          <h2 className="flex items-center gap-2 font-bold mb-3">
            <Flame className="w-4 h-4 text-orange-500" />
            Trending Requests
          </h2>

          {trending.map((item: any) => (
            <div
              key={item._id}
              className="border rounded-lg p-3 mb-2 flex justify-between"
            >
              <div>
                <p className="font-medium">{item.originalName}</p>
                <p className="text-xs text-gray-500">
                  {item.voteCount} votes
                </p>
              </div>

              <button
                onClick={() => handleVote(item._id)}
                className="text-sm"
              >
                👍 Vote
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}