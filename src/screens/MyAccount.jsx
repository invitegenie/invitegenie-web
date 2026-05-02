import React, { useState, useEffect } from "react";
import { useAuth } from "../auth/AuthContext";
import { supabase } from "../lib/supabaseClient";
import Layout from "../components/Layout";
import Icon from "../components/Icon";

export default function MyAccount() {
  const { currentUser, setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: currentUser?.full_name || currentUser?.name || "",
    phone: currentUser?.phone || "",
    avatar_url: currentUser?.avatar_url || "",
  });

  useEffect(() => {
    if (currentUser) {
      setFormData({
        full_name: currentUser.full_name || currentUser.name || "",
        phone: currentUser.phone || "",
        avatar_url: currentUser.avatar_url || "",
      });
    }
  }, [currentUser]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: formData.full_name,
          phone: formData.phone,
          updated_at: new Date().toISOString(),
        })
        .eq("id", currentUser.id);

      if (error) throw error;
      
      // Update local context state
      setUser({ ...currentUser, ...formData, name: formData.full_name });
      alert("Profile updated successfully!");
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const uploadAvatar = async (event) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }

      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const fileName = `${currentUser.id}-${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload file to the 'avatars' bucket
      let { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get the public URL for the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      // Update the profile record with the new URL
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl })
        .eq("id", currentUser.id);

      if (updateError) throw updateError;

      setFormData({ ...formData, avatar_url: publicUrl });
      setUser({ ...currentUser, avatar_url: publicUrl });
      alert("Avatar updated successfully!");
    } catch (error) {
      alert(error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Layout>
      <main className="p-6 space-y-6 bg-[#0B0F19] min-h-screen font-sans">
        <header>
          <h1 className="text-3xl font-bold text-[#F9FAFB] tracking-tight">My Account</h1>
          <p className="text-[#9CA3AF] text-sm mt-1">Manage your identity and presence in the realm.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Avatar / Identity Card */}
          <div className="lg:col-span-4">
            <div className="bg-[#111827] rounded-2xl border border-[#2A3342] shadow-lg p-8 flex flex-col items-center text-center">
              <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#8B5CF6]/30 bg-[#1F2937] flex items-center justify-center shadow-2xl">
                  {formData.avatar_url ? (
                    <img src={formData.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-4xl font-bold text-[#6B7280]">
                      {formData.full_name?.charAt(0) || currentUser?.email?.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <label className="absolute bottom-0 right-0 p-2.5 rounded-full bg-[#8B5CF6] text-white cursor-pointer hover:bg-[#A78BFA] transition-all shadow-lg active:scale-90">
                  <Icon name={uploading ? "sync" : "photo_camera"} className={`text-xl ${uploading ? 'animate-spin' : ''}`} />
                  <input type="file" className="hidden" accept="image/*" onChange={uploadAvatar} disabled={uploading} />
                </label>
              </div>
              <h3 className="text-xl font-bold text-[#F9FAFB] mt-6">{formData.full_name || "New Genie"}</h3>
              <p className="text-[#6B7280] text-sm">{currentUser?.email}</p>
              <div className="mt-4 inline-flex rounded-full bg-[#8B5CF6]/10 px-4 py-1 text-[10px] font-black text-[#A78BFA] uppercase tracking-widest border border-[#8B5CF6]/20">
                {currentUser?.role?.replace('_', ' ') || 'Member'}
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="lg:col-span-8">
            <div className="bg-[#111827] rounded-2xl border border-[#2A3342] shadow-lg p-8">
              <h3 className="text-lg font-bold text-[#F9FAFB] mb-8 flex items-center gap-3">
                <Icon name="manage_accounts" className="text-[#8B5CF6]" />
                Personal Information
              </h3>

              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest px-1">Full Name</label>
                    <input
                      type="text"
                      required
                      className="w-full bg-[#0F172A] border border-[#2A3342] text-white rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-[#8B5CF6]/50 transition-all"
                      placeholder="Ngalle Marie"
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest px-1">Phone Number</label>
                    <input
                      type="tel"
                      className="w-full bg-[#0F172A] border border-[#2A3342] text-white rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-[#8B5CF6]/50 transition-all"
                      placeholder="+237 6XX XXX XXX"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="pt-6 border-t border-[#2A3342] flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-gradient-to-r from-[#8B5CF6] to-[#22C55E] text-white rounded-lg px-10 py-3 font-bold shadow-lg hover:opacity-90 transition-all active:scale-95 disabled:opacity-50"
                  >
                    {loading ? "Updating..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}
