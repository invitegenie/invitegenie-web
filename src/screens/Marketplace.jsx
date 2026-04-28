import { useNavigate } from "react-router-dom";
import { VendorCard } from "../components/RichCards";
import Icon from "../components/Icon";

export default function Marketplace() {
  const navigate = useNavigate();

  const vendors = [
    { name: "Neon Beats DJ", service: "Entertainment", rating: 4.9, price: "$$$", image: "https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&q=80&w=800" },
    { name: "Royal Catering", service: "Catering", rating: 4.8, price: "$$$$", image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800" },
    { name: "Luxe Venues", service: "Venues", rating: 5.0, price: "$$$", image: "https://images.unsplash.com/photo-1478147427282-58a87a120781?auto=format&fit=crop&q=80&w=800" },
    { name: "Ethereal Florals", service: "Decor", rating: 4.7, price: "$$", image: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&q=80&w=800" },
  ];

  return (
    <div className="space-y-5">
      <div className="mb-8 flex items-center gap-4 pt-4">
        <button
          onClick={() => navigate(-1)}
          className="rounded-lg bg-white/[0.04] p-2 hover:bg-white/[0.08] transition-colors"
        >
          <Icon name="arrow_back" className="text-white" />
        </button>
        <h1 className="text-3xl font-bold text-white">Marketplace</h1>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {vendors.map((v, idx) => (
          <VendorCard key={idx} {...v} />
        ))}
      </div>
    </div>
  );
}
