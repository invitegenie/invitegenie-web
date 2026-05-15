export async function requestNotificationPermission() {
  if (!("Notification" in window)) {
    console.warn("This browser does not support desktop notification");
    return false;
  }
  if (Notification.permission === "granted") return true;
  if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission();
    return permission === "granted";
  }
  return false;
}

export async function sendDesktopNotification(title, options = {}) {
  const hasPermission = await requestNotificationPermission();
  if (hasPermission) {
    try {
      new Notification(title, options);
    } catch (e) {
      console.error("Error sending desktop notification", e);
    }
  }
}