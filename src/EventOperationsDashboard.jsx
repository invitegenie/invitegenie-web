import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { getEventById } from '../services/mockData';
import { startSimulation, stopSimulation } from '../services/realtimeSimulationService';
import { calculateEventHealth, getEventOperations } from '../services/eventOperationsService';
import { getTasks } from '../services/liveTaskService';
import { getStaff } from '../services/staffCoordinationService';
import { getVendorCheckins } from '../services/vendorCheckinService';
import { getTimeline } from '../services/eventTimelineService';
import { getIncidents, getActiveAlerts } from '../services/emergencyAlertService';
import LiveTaskBoard from '../components/LiveTaskBoard';
import EventTimelineTracker from '../components/EventTimelineTracker';
import StaffStatusPanel from '../components/StaffStatusPanel';
import EmergencyAlertBanner from '../components/EmergencyAlertBanner';
import VendorArrivalTracker from '../components/VendorArrivalTracker';
import EventHealthMeter from '../components/EventHealthMeter';
import LiveOperationsFeed from '../components/LiveOperationsFeed';
import OperationsQuickActions from '../components/OperationsQuickActions';
import Icon from '../components/Icon';
import EventCountdownClock from '../components/EventCountdownClock';

export default function EventOperationsDashboard() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [opsData, setOpsData] = useState({});
  const [lastUpdated, setLastUpdated] = useState(Date.now());

  useEffect(() => {
    const foundEvent = getEventById(eventId);
    if (!foundEvent) {
      navigate('/events');
      return;
    }
    setEvent(foundEvent);
    startSimulation(eventId);

    const handleDataChange = () => {
      setLastUpdated(Date.now());
    };

    window.addEventListener('invitegenie:data-change', handleDataChange);

    return () => {
      stopSimulation();
      window.removeEventListener('invitegenie:data-change', handleDataChange);
    };
  }, [eventId, navigate]);

  const { tasks, staff, vendors, timeline, incidents, alerts, health } = useMemo(() => {
    if (!eventId) return {};
    return {
      tasks: getTasks(eventId),
      staff: getStaff(eventId),
      vendors: getVendorCheckins(eventId),
      timeline: getTimeline(eventId),
      incidents: getIncidents(eventId),
      alerts: getActiveAlerts(eventId),
      health: calculateEventHealth(eventId),
    };
  }, [eventId, lastUpdated]);

  if (!event) return <Layout><div className="text-white text-center p-10">Loading Event...</div></Layout>;

  const onlineStaff = staff?.filter(s => s.status !== 'Offline').length || 0;
  const checkedInVendors = vendors?.filter(v => v.status === 'Checked In' || v.status === 'Setup Complete').length || 0;

  return (
    <Layout showHeader={false}>
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 bg-slate-950 min-h-screen">
        <EmergencyAlertBanner alerts={alerts} />

        <header className="flex flex-col md:flex-row gap-4 justify-between items-start">
          <div>
            <h1 className="text-2xl lg:text-3xl font-black text-white">{event.title}</h1>
            <p className="text-sm text-slate-400 mt-1">Live Operations Dashboard</p>
          </div>
          <div className="flex items-center gap-4">
            <EventCountdownClock eventDate={event.date} eventTime={event.time} />
            <button onClick={() => navigate(`/events/${eventId}`)} className="bg-white/10 border border-white/10 text-white rounded-full px-4 py-2 text-xs font-bold hover:bg-white/20">Event Details</button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <OperationsOverviewCard icon="group" title="Staff Online" value={onlineStaff} total={staff?.length} />
              <OperationsOverviewCard icon="local_shipping" title="Vendors Checked In" value={checkedInVendors} total={vendors?.length} />
              <OperationsOverviewCard icon="task_alt" title="Tasks Completed" value={tasks?.filter(t => t.status === 'Completed').length} total={tasks?.length} />
              <OperationsOverviewCard icon="report" title="Active Incidents" value={incidents?.filter(i => i.status !== 'Resolved').length} total={incidents?.length} isAlert={incidents?.some(i => i.status !== 'Resolved')} />
            </div>
            <EventTimelineTracker timeline={timeline} />
            <LiveTaskBoard tasks={tasks} />
            <VendorArrivalTracker vendors={vendors} />
          </div>
          <div className="space-y-6">
            <div className="bg-slate-900 border border-white/5 rounded-2xl p-4 flex flex-col items-center"><EventHealthMeter score={health?.score} status={health?.status} /></div>
            <OperationsQuickActions eventId={eventId} />
            <StaffStatusPanel staff={staff} />
            <LiveOperationsFeed eventId={eventId} />
          </div>
        </div>
      </div>
    </Layout>
  );
}