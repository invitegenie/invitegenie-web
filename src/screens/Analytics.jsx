import Layout from "../components/Layout";
import AnalyticsHeader from "../components/analytics/AnalyticsHeader";
import AnalyticsMetricCard from "../components/analytics/AnalyticsMetricCard";
import EngagementChartCard from "../components/analytics/EngagementChartCard";
import RSVPStatusCard from "../components/analytics/RSVPStatusCard";
import ConversionFunnelCard from "../components/analytics/ConversionFunnelCard";
import InsightsPanel from "../components/analytics/InsightsPanel";
import FloatingGenieButton from "../components/analytics/FloatingGenieButton";

export default function Analytics() {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-8 pb-28">
        <AnalyticsHeader selectedEvent="Neon Summer Gala 2024" />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <AnalyticsMetricCard
            icon="send"
            delta="+12%"
            label="Invites Sent"
            value="2,480"
            accent="bg-purple-500/20"
          />
          <AnalyticsMetricCard
            icon="drafts"
            delta="88.4%"
            label="Open Rate"
            value="92.1%"
            accent="bg-amber-400/20"
          />
          <AnalyticsMetricCard
            icon="check_circle"
            delta="Optimal"
            label="RSVP Rate"
            value="64.5%"
            accent="bg-emerald-500/20"
          />
          <AnalyticsMetricCard
            icon="qr_code_scanner"
            delta="Pending"
            label="Check-ins"
            value="1,102"
            accent="bg-violet-500/20"
          />
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
          <EngagementChartCard />
          <RSVPStatusCard />
          <ConversionFunnelCard />
          <InsightsPanel />
        </div>
      </div>

      <FloatingGenieButton />
    </Layout>
  );
}