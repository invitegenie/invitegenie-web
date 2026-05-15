export const TASKS_KEY = "demo_live_tasks";

const seedTasks = [
  { id: 'task-1', eventId: 'evt-douala-afro', title: 'Confirm VIP guest list', department: 'Guests', assignedTo: 'sandra-planner', status: 'Completed', priority: 'high', progress: 100, dueTime: '16:00' },
  { id: 'task-2', eventId: 'evt-douala-afro', title: 'Sound check main stage', department: 'Technical', assignedTo: 'brice-vendor', status: 'In Progress', priority: 'critical', progress: 50, dueTime: '18:00' },
  { id: 'task-3', eventId: 'evt-douala-afro', title: 'Set up catering station', department: 'Catering', assignedTo: 'awa-vendor', status: 'Pending', priority: 'high', progress: 0, dueTime: '17:00' },
  { id: 'task-4', eventId: 'evt-douala-afro', title: 'Check venue power generators', department: 'Logistics', assignedTo: 'emmanuel-tasker', status: 'Pending', priority: 'medium', progress: 0, dueTime: '15:00' },
  { id: 'task-5', eventId: 'evt-douala-afro', title: 'Brief security team at entrance', department: 'Security', assignedTo: 'nfor-checkin', status: 'Blocked', priority: 'high', progress: 10, dueTime: '18:30' },
];

function read(key, fallback = []) {
  try {
    const data = localStorage.getItem(key);
    if (data) return JSON.parse(data);
    localStorage.setItem(key, JSON.stringify(fallback));
    return fallback;
  } catch {
    return fallback;
  }
}

function write(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
  window.dispatchEvent(new CustomEvent("invitegenie:data-change", { detail: { key, data } }));
}

export function getTasks(eventId) {
  const allTasks = read(TASKS_KEY, seedTasks);
  return allTasks.filter(task => task.eventId === eventId);
}

export function getTask(id) {
  return read(TASKS_KEY, seedTasks).find(task => task.id === id);
}

export function saveTask(task) {
  const list = read(TASKS_KEY, seedTasks);
  const index = list.findIndex(t => t.id === task.id);
  const updated = { ...task, updatedAt: new Date().toISOString() };
  if (index > -1) {
    list[index] = { ...list[index], ...updated };
  } else {
    updated.id = task.id || `task-${Date.now()}`;
    updated.createdAt = new Date().toISOString();
    list.unshift(updated);
  }
  write(TASKS_KEY, list);
  return updated;
}

export function deleteTask(id) {
  write(TASKS_KEY, read(TASKS_KEY, seedTasks).filter(t => t.id !== id));
}