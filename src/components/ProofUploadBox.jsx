import React, { useRef, useState } from "react";
import Icon from "./Icon";

export default function ProofUploadBox({ onUpload, label = "Upload Proof Image" }) {
  const [preview, setPreview] = useState(null);
  const fileInput = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        onUpload(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full">
      <label className="block mb-2 text-[10px] font-black uppercase tracking-widest text-slate-500">{label}</label>
      <div 
        onClick={() => fileInput.current?.click()}
        className="relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/10 rounded-2xl bg-black/40 hover:bg-white/5 hover:border-violet-500/50 transition-all cursor-pointer overflow-hidden group"
      >
        {preview ? (
          <img src={preview} alt="Proof preview" className="w-full h-full object-contain opacity-80 group-hover:opacity-50 transition-opacity" />
        ) : (
          <div className="flex flex-col items-center justify-center text-slate-400">
            <Icon name="cloud_upload" className="text-3xl mb-2 group-hover:text-violet-400 transition-colors" />
            <span className="text-xs font-bold uppercase tracking-widest">Click to Upload</span>
          </div>
        )}
        <input type="file" accept="image/*" ref={fileInput} className="hidden" onChange={handleFileChange} />
      </div>
    </div>
  );
}