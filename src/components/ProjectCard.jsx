import React from 'react';
import { Users, Calendar } from 'lucide-react';

function ProjectCard({ project }) {
  const completedTasks = project.tasks.filter(task => task.status === 'DONE').length;
  const progress = Math.round((completedTasks / project.tasks.length) * 100) || 0;

  const handleDelete = (e) => {
    e.stopPropagation(); // Prevent project click event
    if (window.confirm('Are you sure you want to delete this project?')) {
      onDelete(project.id);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-medium text-gray-900">{project.name}</h3>
          <p className="text-sm text-gray-500 mt-1">{project.description}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm ${
          project.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
        }`}>
          {project.status}

        </span>
        
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-500">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center text-sm text-gray-500">
          <Users className="h-4 w-4 mr-1" />
          <span>{project.members.length} members</span>
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <Calendar className="h-4 w-4 mr-1" />
          <span>{project.dueDate}</span>
        </div>
      </div>
    </div>
  );
}

export default ProjectCard;