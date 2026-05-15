import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../components/Layout";
import { useAuth } from "../auth/AuthContext";
import { getProviderById } from "../services/mockData";
import Icon from "../components/Icon";
import * as Engine from "../auth/coreEngine";

export default function VendorReview() {
  const { providerId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const mockListing = getProviderById(providerId);
  const engineListing = (Engine.getCollection(Engine.KEYS.VENDORS) || []).find(v => String(v.id) === String(providerId));
  const listing = mockListing || engineListing;
  
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!listing) {
    return (
      <Layout>
        <div className="flex min-h-[50vh] flex-col items-center justify-center">
          <p className="text-white">Listing not found.</p>
          <button onClick={() => navigate("/marketplace")} className="mt-4 text-violet-400">Back to Marketplace</button>
        </div>
      </Layout>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) return alert("Please provide a comment.");
    setSubmitting(true);
    
    // Simulate saving review
    setTimeout(() => {
      const newReview = {
        userName: currentUser?.name || currentUser?.full_name || "Guest User",
        rating,
        comment,
        date: new Date().toISOString().split("T")[0]
      };
      
      // Save to local storage (demo)
      try {
        const existing = JSON.parse(localStorage.getItem("demo_vendor_reviews") || "{}");
        const listingReviews = existing[providerId] || [];
        existing[providerId] = [newReview, ...listingReviews];
        localStorage.setItem("demo_vendor_reviews", JSON.stringify(existing));
      } catch (e) {
        localStorage.setItem("demo_vendor_reviews", JSON.stringify({ [providerId]: [newReview] }));
      }
      
      setSubmitting(false);
      alert("Review submitted successfully!");
      navigate(`/marketplace/${providerId}`);
    }, 800);
  };

  return (
    <Layout>
      <div className="mx-auto max-w-3xl space-y-6 pb-24 pt-6">
        <button onClick={() => navigate(`/marketplace/${providerId}`)} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-white">
          <Icon name="arrow_back" className="text-lg" /> Back to Listing
        </button>
        
        <div className="rounded-3xl border border-white/10 bg-[#111827] p-8 shadow-2xl">
          <h1 className="text-3xl font-black text-white">Review {listing.businessName}</h1>
          <p className="mt-2 text-sm text-slate-400">Share your experience working with this service provider.</p>
          
          <form onSubmit={handleSubmit} className="mt-8 space-y-8">
            <div>
              <p className="mb-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Overall Rating</p>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="focus:outline-none"
                  >
                    <Icon 
                      name="star" 
                      className={`text-4xl transition-colors ${
                        star <= (hoverRating || rating) ? "text-amber-400" : "text-slate-700"
                      }`} 
                    />
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <p className="mb-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Your Review</p>
              <textarea 
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={6}
                placeholder="Describe your experience..."
                className="w-full resize-none rounded-2xl border border-white/10 bg-slate-900 px-5 py-4 text-sm text-white outline-none focus:border-violet-500/50"
                required
              />
            </div>
            
            <div className="flex justify-end gap-4 border-t border-white/10 pt-6">
              <button type="button" onClick={() => navigate(`/marketplace/${providerId}`)} className="rounded-xl border border-white/10 px-6 py-3 text-xs font-bold uppercase tracking-widest text-slate-300 hover:bg-white/5">Cancel</button>
              <button type="submit" disabled={submitting} className="rounded-xl bg-gradient-to-r from-violet-600 to-emerald-500 px-8 py-3 text-xs font-bold uppercase tracking-widest text-white shadow-lg hover:opacity-90 disabled:opacity-50">
                {submitting ? "Submitting..." : "Post Review"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}