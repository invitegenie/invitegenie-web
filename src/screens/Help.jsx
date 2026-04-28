import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";

function Icon({ name, className = "" }) {
  const iconStyle = {
    fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24",
  };
  return (
    <span className={`material-symbols-outlined ${className}`} style={iconStyle}>
      {name}
    </span>
  );
}

export default function Help() {
  const navigate = useNavigate();

  const faqs = [
    {
      question: "How do I create an event?",
      answer: "Navigate to Events and click 'Create New Event' to get started.",
    },
    {
      question: "Can I customize invitation templates?",
      answer: "Yes, visit the Templates section to browse and customize templates.",
    },
    {
      question: "How do I manage guests?",
      answer: "Go to the Guests section to add, edit, and manage your guest lists.",
    },
    {
      question: "What are points used for?",
      answer: "Points can be earned through events and converted into rewards and premium features.",
    },
  ];

  return (
    <Layout>
      <div className="mx-auto w-full max-w-[1680px] px-4 pb-20 pt-8 sm:px-5 xl:px-6">
        <div className="mb-8 flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="rounded-lg bg-white/5 p-2 hover:bg-white/10"
          >
            <Icon name="arrow_back" className="text-white" />
          </button>
          <h1 className="text-3xl font-bold text-white">Help Center</h1>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-white/10 bg-slate-950/70 p-5 backdrop-blur-xl"
            >
              <h3 className="font-bold text-yellow-200">{faq.question}</h3>
              <p className="mt-2 text-slate-300">{faq.answer}</p>
            </div>
          ))}
        </div>

        <button
          onClick={() => navigate("/profile")}
          className="mt-8 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-500 px-6 py-2 font-bold text-white"
        >
          Back to Profile
        </button>
      </div>
    </Layout>
  );
}
