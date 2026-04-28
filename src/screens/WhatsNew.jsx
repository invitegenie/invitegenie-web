import Layout from "../components/Layout";
import PageTitle from "../components/PageTitle";

export default function WhatsNew() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8 pb-28">
        <PageTitle
          title="What's New"
          subtitle="Explore the latest updates and magical features in InviteGenie."
        />
        <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-12 shadow-xl backdrop-blur-xl text-center">
          <div className="w-20 h-20 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-4xl text-purple-400">auto_awesome</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Coming Soon</h2>
          <p className="text-slate-400 max-w-sm mx-auto">We're working on amazing new tools and AI features to help you create better events.</p>
        </div>
      </div>
    </Layout>
  );
}