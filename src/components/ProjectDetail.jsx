import React, { useState } from 'react';
import { ArrowLeft, Plus, Users, Calendar, CheckCircle, Clock } from 'lucide-react';
import Board from './Board';
import Modal from './Modal';
import NewTaskForm from './NewTaskForm';
import ProgressBar from './ProgressBar';

const ProjectDetail = ({ project, onBack, onUpdateProject, teamMembers }) => {
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const completedTasks = project.tasks.filter(task => task.status === 'DONE').length;
  const totalTasks = project.tasks.length;

  const handleAddTask = (newTask) => {
    const updatedProject = {
      ...project,
      tasks: [...project.tasks, { ...newTask, id: (project.tasks.length + 1).toString() }]
    };
    onUpdateProject(updatedProject);
  };

  const handleUpdateTasks = (updatedTasks) => {
    const updatedProject = {
      ...project,
      tasks: updatedTasks
    };
    onUpdateProject(updatedProject);
  };

  const handleDeleteTask = (taskId) => {
    onDeleteTask(project.id, taskId);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{project.name}</h2>
            <p className="text-sm text-gray-500">{project.description}</p>
          </div>
        </div>
        <button
          onClick={() => setIsTaskModalOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Task
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center space-x-2 text-gray-500 mb-4">
            <Calendar className="h-5 w-5" />
            <span>Due Date: {project.dueDate}</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-500">
            <Users className="h-5 w-5" />
            <span>{project.members.length} Team Members</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center space-x-2 text-green-600 mb-4">
            <CheckCircle className="h-5 w-5" />
            <span>{completedTasks} Tasks Completed</span>
          </div>
          <div className="flex items-center space-x-2 text-blue-600">
            <Clock className="h-5 w-5" />
            <span>{totalTasks - completedTasks} Tasks Remaining</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-700 mb-4">Team Members</h3>
          <div className="flex flex-wrap gap-2">
            {project.members.map((member, index) => (
              <div
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700"
              >
                {member}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6">
          <ProgressBar tasks={project.tasks} />
          <Board tasks={project.tasks} setTasks={handleUpdateTasks} />
          
        </div>
      </div>

      <Modal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        title="Create New Task"
      >
        <NewTaskForm
          onSubmit={handleAddTask}
          onClose={() => setIsTaskModalOpen(false)}
          teamMembers={teamMembers}
        />
      </Modal>
    </div>
  );
};

export default ProjectDetail;