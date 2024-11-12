import React from 'react';
import { TaskStatus } from '../types';
import TaskCard from './TaskCard';

function Board({ tasks, setTasks }) {
  const columns = [
    { title: 'To Do', status: TaskStatus.TODO },
    { title: 'In Progress', status: TaskStatus.IN_PROGRESS },
    { title: 'Done', status: TaskStatus.DONE },
  ];

  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData('taskId', taskId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, status) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status } : task
    ));
  };

  return (
    <div className="grid grid-cols-3 gap-6 h-full">
      {columns.map(({ title, status }) => (
        <div
          key={status}
          className="bg-gray-50 p-4 rounded-lg"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, status)}
        >
          <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
          <div className="space-y-4">
            {tasks
              .filter(task => task.status === status)
              .map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onDragStart={handleDragStart}
                />
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Board;