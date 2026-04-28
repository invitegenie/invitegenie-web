import Layout from "../components/Layout";
import PageTitle from "../components/PageTitle";
import { TemplateCard } from "../components/RichCards";
import { useNavigate } from "react-router-dom";

export default function TemplateGallery() {
  const navigate = useNavigate();
  const templates = [
    { title: "Midnight Masquerade", category: "Gala", image: "https://images.unsplash.com/photo-1478147427282-58a87a120781?auto=format&fit=crop&q=80&w=800" },
    { title: "Neon Nights", category: "Cyberpunk", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBTcM_myt0RvmGSyzUUMlyrYj2vfvM9JPbpwMoG3dpQaUqlYh5DUVXuBCVulTRzE8Kn_5Tn6QV-gxiEgJmWlZNIIXjAcv0BQP0Ux0NvJVQLvmarq-Wili3ZzomKXezpkZiXYS50H1auIRU-oBTV1xal7AIX9geEfklOTH8IKrUFpUKPwZ5adOTYCtoQjCxHT5QdBfA7T0ob_qNwNlLUYSulkGpCBIPd9BFuJeRI5Q3FtGf_6-98O-Ajc5FecgH9QY8OjVLcJjjOPDNk" },
    { title: "Ethereal Garden", category: "Wedding", image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800" },
    { title: "Retro Disco", category: "Birthday", image: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&q=80&w=800" },
    { title: "Executive Summit", category: "Conference", image: "https://images.unsplash.com/photo-1540575861501-7ad060e39fe6?auto=format&fit=crop&q=80&w=800" },
    { title: "Minimalist Loft", category: "Corporate", image: "https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&q=80&w=800" },
  ];

  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-6 pb-20">
        <PageTitle title="Template Gallery" subtitle="Professionally designed, high-conversion invitation templates for every magic moment." />
        
        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {templates.map((t, idx) => (
            <TemplateCard key={idx} {...t} onClick={() => navigate("/create-event")} />
          ))}
        </div>
      </div>
    </Layout>
  );
}