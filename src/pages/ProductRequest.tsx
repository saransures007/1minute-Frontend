"use client";

import { useState, useEffect } from "react";
import { Search, ThumbsUp, ArrowRight } from "lucide-react";

import Layout from "@/components/Layout";
import AnimatedSection from "@/components/AnimatedSection";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import { apiService, SearchItem } from "@/lib/api/api";

/* ---------------- VOTE BUTTON ---------------- */
function VoteButton({ id, initialVotes = 0, onVoted }: any) {
  const [voted, setVoted] = useState(false);
  const [votes, setVotes] = useState(initialVotes);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("votedIds") || "[]");
    if (stored.includes(id)) setVoted(true);
  }, [id]);

  const handleVote = async () => {
    if (voted) return;

    const res = await apiService.voteProduct(id);

    if (res.success) {
      setVoted(true);
      setVotes(v => v + 1);

      const stored = JSON.parse(localStorage.getItem("votedIds") || "[]");
      localStorage.setItem("votedIds", JSON.stringify([...stored, id]));

      onVoted?.();
    }
  };

  return (
    <button
      onClick={handleVote}
      disabled={voted}
      className={`px-3 py-1 rounded-full text-xs flex items-center gap-1
        ${voted ? "bg-green-100 text-green-700" : "bg-muted hover:bg-muted/70"}
      `}
    >
      <ThumbsUp className="w-3 h-3" />
      {voted ? "Voted" : votes}
    </button>
  );
}

/* ---------------- MAIN ---------------- */

export default function ProductRequest() {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<SearchItem[]>([]);

  const [requestedQuery, setRequestedQuery] = useState("");
  const [requestedList, setRequestedList] = useState<any[]>([]);

  const [form, setForm] = useState({
    name: "",
    category: "",
    brand: "",
    description: ""
  });

  useEffect(() => {
    fetchRequested("");
  }, []);

  /* 🔍 LEFT SEARCH */
  const handleSearch = async (q: string) => {
    setSearchQuery(q);

    if (q.length < 2) return setResults([]);

    const res = await apiService.searchProducts(q);
    if (res.success) setResults(res.data || []);
  };

  /* 🔥 RIGHT SEARCH */
  const fetchRequested = async (q: string) => {
    const res = await apiService.searchRequestedProducts(q);
    if (res.success) setRequestedList(res.data || []);
  };

  /* ➕ SUBMIT */
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const res = await apiService.createProductRequest({
      name: form.name,
      category: form.category,
      brand: form.brand,
      description: form.description
    });

    if (res.success) {
      alert("Request submitted");
      setForm({
        name: "",
        category: "",
        brand: "",
        description: ""
      });
      fetchRequested("");
    }
  };

  return (
    <Layout>
      <AnimatedSection className="py-20">
        <div className="container mx-auto max-w-7xl px-4">
     <div className="text-center mb-16">
            <h1 className="text-4xl md:text-4xl font-display font-bold mb-4">
              Request <span className="text-gradient-hero">Products</span> Here
            </h1>
          </div>
          <div className="grid lg:grid-cols-3 gap-8">

            {/* 🟢 LEFT */}
            <div className="space-y-6">

              <h2 className="font-bold">Search Products</h2>

              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4" />
                <Input
                  className="pl-9"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>

              {/* RESULTS */}
              <div className="bg-card rounded-xl shadow p-4">
                {results.length > 0 ? (
                  results.map(item => (
                    <div key={item.id} className="py-3 border-b space-y-2">

                      <div className="flex justify-between">
                        <div>
                          <p className="text-sm font-medium">{item.name}</p>
                          {/* <p className="text-xs text-muted-foreground">
                            {item.source}
                          </p> */}
                        </div>

                        {item.source === "local" && (
                          <div className="flex items-center gap-2">
                            <span className="text-xs">
                              👍 {item.votes || 0}
                            </span>
                            <VoteButton id={item.id} initialVotes={item.votes} />
                          </div>
                        )}
                      </div>

                      {/* MATCH BAR */}
                      <div>
                        <div className="flex justify-between text-xs">
                          <span>Match</span>
                          <span>{Math.round(item.score * 100)}%</span>
                        </div>

                        <div className="flex h-2 rounded overflow-hidden">
                          <div
                            className="bg-green-500"
                            style={{ width: `${item.score * 100}%` }}
                          />
                          <div
                            className="bg-red-400"
                            style={{ width: `${(1 - item.score) * 100}%` }}
                          />
                        </div>
                      </div>

                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Start typing to search products
                  </p>
                )}
              </div>

            </div>

            {/* 🟡 CENTER */}
            <div>
              <form className="bg-card p-6 rounded-xl shadow space-y-4" onSubmit={handleSubmit}>

                <h3 className="font-bold text-center">
                  Request Product
                </h3>

                <Input
                  placeholder="Product Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />

                <Input
                  placeholder="Category"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                />

                <Input
                  placeholder="Brand"
                  value={form.brand}
                  onChange={(e) => setForm({ ...form, brand: e.target.value })}
                />

                <textarea
                  className="w-full border rounded px-3 py-2"
                  placeholder="Description"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />

                <Button type="submit" className="w-full">
                  Submit Request
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>

              </form>
            </div>

            {/* 🔵 RIGHT */}
            <div className="space-y-6">

              <div className="bg-card p-4 rounded-xl shadow space-y-3">

                <h3 className="font-semibold">🔥 Requested Products</h3>

                <Input
                  placeholder="Search requested..."
                  value={requestedQuery}
                  onChange={(e) => {
                    setRequestedQuery(e.target.value);
                    fetchRequested(e.target.value);
                  }}
                />

                {requestedList.map(item => (
                  <div key={item._id} className="flex justify-between items-center py-2 border-b">

                    <span className="text-sm">{item.originalName}</span>

                    <div className="flex items-center gap-2">
                      <span className="text-xs">
                        {/* {item.voteCount} */}
                      </span>

                      <VoteButton
                        id={item._id}
                        initialVotes={item.voteCount}
                        onVoted={() => fetchRequested(requestedQuery)}
                      />
                    </div>

                  </div>
                ))}

              </div>

            </div>

          </div>
        </div>
      </AnimatedSection>
    </Layout>
  );
}