import React from 'react';
import Icon from './Icon';
import TaskProgressRing from './TaskProgressRing';

const statusConfig = {
  'Pending': { color: 'border-slate-500', bg: 'bg-slate-500/10' },
  'In Progress': { color: 'border-blue-500', bg: 'bg-blue-500/10' },
  'Completed': { color: 'border-emerald-500', bg: 'bg-emerald-500/10' },
  'Delayed': { color: 'border-amber-500', bg: 'bg-amber-500/10' },
  'Blocked': { color: 'border-rose-500', bg: 'bg-rose-500/10' },
  'Emergency': { color: 'border-red-600', bg: 'bg-red-600/10' },
};

const priorityConfig = {
  'low': 'bg-slate-500',
  'medium': 'bg-blue-500',
  'high': 'bg-amber-500',
  'critical': 'bg-red-600',
};

export default function LiveTaskBoard({ tasks = [] }) {
  const columns = ['Pending', 'In Progress', 'Completed'];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {columns.map(status => (
        <div key={status} className="bg-slate-900/50 border border-white/5 rounded-2xl p-4">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${statusConfig[status]?.color.replace('border-', 'bg-')}`} />
            {status}
            <span className="text-xs text-slate-500 ml-auto">{tasks.filter(t => t.status === status).length}</span>
          </h3>
          <div className="space-y-3 mt-4">
            {tasks.filter(t => t.status === status).map(task => (
              <div key={task.id} className={`p-3 rounded-xl border-l-4 ${statusConfig[task.status]?.bg} ${statusConfig[task.status]?.color}`}>
                <div className="flex justify-between items-start">
                  <p className="text-xs font-bold text-white pr-4">{task.title}</p>
                  <TaskProgressRing progress={task.progress} size={24} />
                </div>
                <div className="flex items-center justify-between mt-2 text-[10px] text-slate-400">
                  <span>{task.department}</span>
                  <span className="flex items-center gap-1"><div className={`w-1.5 h-1.5 rounded-full ${priorityConfig[task.priority]}`} /> {task.priority}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}