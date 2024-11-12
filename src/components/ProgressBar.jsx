import React from 'react';

function ProgressBar({ tasks }) {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === 'DONE').length;
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium text-gray-700">Project Progress</h3>
        <span className="text-sm text-gray-500">{progress}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="flex justify-between mt-2 text-xs text-gray-500">
        <span>{completedTasks} completed</span>
        <span>{totalTasks - completedTasks} remaining</span>
      </div>
    </div>
  );
}

export default ProgressBar;