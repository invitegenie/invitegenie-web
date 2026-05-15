import React from "react";
import Icon from "./Icon";

export default function BrandAssetUploader({ assets, onChange }) {
  
  const handleUpload = (type) => (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // For local demo, we just use object URL
    const url = URL.createObjectURL(file);
    
    if (type === 'gallery') {
      if (assets.gallery.length >= 6) {
        alert("Maximum 6 photos allowed for analysis.");
        return;
      }
      onChange({ ...assets, gallery: [...assets.gallery, url] });
    } else {
      onChange({ ...assets, [type]: url });
    }
  };

  const removeGalleryImage = (index) => {
    const newGallery = [...assets.gallery];
    newGallery.splice(index, 1);
    onChange({ ...assets, gallery: newGallery });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col items-center justify-center h-24 border border-dashed border-white/20 bg-white/5 rounded-xl cursor-pointer hover:bg-white/10 transition-colors">
          {assets.logo ? <img src={assets.logo} alt="Logo" className="h-full w-full object-contain p-2" /> : <><Icon name="add_photo_alternate" className="text-slate-400 mb-1" /><span className="text-[10px] font-bold text-slate-400 uppercase">Upload Logo</span></>}
          <input type="file" accept="image/*" className="hidden" onChange={handleUpload('logo')} />
        </label>
        <label className="flex flex-col items-center justify-center h-24 border border-dashed border-white/20 bg-white/5 rounded-xl cursor-pointer hover:bg-white/10 transition-colors">
          {assets.cover ? <img src={assets.cover} alt="Cover" className="h-full w-full object-cover rounded-xl" /> : <><Icon name="wallpaper" className="text-slate-400 mb-1" /><span className="text-[10px] font-bold text-slate-400 uppercase">Upload Cover</span></>}
          <input type="file" accept="image/*" className="hidden" onChange={handleUpload('cover')} />
        </label>
      </div>
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Inspiration Photos ({assets.gallery.length}/6)</p>
        <div className="flex gap-2 overflow-x-auto pb-2">
          <label className="flex-shrink-0 flex items-center justify-center h-16 w-16 border border-dashed border-white/20 bg-white/5 rounded-xl cursor-pointer hover:bg-white/10"><Icon name="add" className="text-slate-400" /><input type="file" accept="image/*" className="hidden" onChange={handleUpload('gallery')} /></label>
          {assets.gallery.map((img, i) => (
            <div key={i} className="relative flex-shrink-0 h-16 w-16 rounded-xl overflow-hidden group"><img src={img} className="w-full h-full object-cover" alt="" /><button onClick={() => removeGalleryImage(i)} className="absolute inset-0 bg-red-500/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><Icon name="delete" className="text-white text-sm" /></button></div>
          ))}
        </div>
      </div>
    </div>
  );
}