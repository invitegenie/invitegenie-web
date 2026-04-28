/**
 * Client to communicate with the deployed Google Apps Script Web App.
 */

const APPS_SCRIPT_URL = import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL;

export const getDeviceId = () => {
  let deviceId = localStorage.getItem('ig_device_id');
  if (!deviceId) {
    deviceId = 'GENIE-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    localStorage.setItem('ig_device_id', deviceId);
  }
  return deviceId;
};

const callBridge = async (params) => {
  if (!APPS_SCRIPT_URL) return;
  const query = new URLSearchParams({ ...params, device_id: getDeviceId() }).toString();
  return fetch(`${APPS_SCRIPT_URL}?${query}`, { mode: 'no-cors' });
};

export const trackInvitationView = (uid) => {
  return callBridge({ action: 'invitationView', uid });
};

export const trackInvitationDownload = (uid) => {
  return callBridge({ action: 'download', uid });
};

export const sendCheckinToAppsScript = (uid) => {
  return callBridge({ checkin: uid });
};

export default {
  trackInvitationView,
  trackInvitationDownload,
  sendCheckinToAppsScript
};