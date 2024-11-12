import React from 'react';
import { format } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar, AlertCircle, CheckCircle, Users, Clock, Target } from 'lucide-react';

function Dashboard({ projects }) {
  const upcomingDeadlines = projects
    .flatMap(project => project.tasks)
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5);

  const projectProgress = projects.map(project => ({
    name: project.name,
    completed: project.tasks.filter(task => task.status === 'DONE').length,
    total: project.tasks.length,
  }));

  const totalTasks = projects.reduce((acc, project) => acc + project.tasks.length, 0);
  const completedTasks = projects.reduce(
    (acc, project) => acc + project.tasks.filter(task => task.status === 'DONE').length,
    0
  );
  const totalTeamMembers = [...new Set(projects.flatMap(project => project.members))].length;

  const stats = [
    {
      name: 'Total Projects',
      value: projects.length,
      icon: Target,
      color: 'bg-blue-500',
    },
    {
      name: 'Active Tasks',
      value: totalTasks - completedTasks,
      icon: Clock,
      color: 'bg-yellow-500',
    },
    {
      name: 'Completed Tasks',
      value: completedTasks,
      icon: CheckCircle,
      color: 'bg-green-500',
    },
    {
      name: 'Team Members',
      value: totalTeamMembers,
      icon: Users,
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className={`p-2 rounded-lg ${stat.color} bg-opacity-10`}>
                <stat.icon className={`h-6 w-6 ${stat.color.replace('bg-', 'text-')}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Upcoming Deadlines</h3>
          <div className="space-y-4">
            {upcomingDeadlines.map(task => (
              <div key={task.id} className="flex items-start space-x-3">
                <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{task.title}</p>
                  <p className="text-sm text-gray-500">Due: {format(new Date(task.dueDate), 'MMM d, yyyy')}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Project Status</h3>
          <div className="space-y-4">
            {projects.map(project => {
              const completed = project.tasks.filter(t => t.status === 'DONE').length;
              const total = project.tasks.length;
              const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
              
              return (
                <div key={project.id} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-gray-900">{project.name}</span>
                    <span className="text-gray-500">{progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Task Overview</h3>
          <div className="space-y-4">
            {projects.map(project => {
              const pending = project.tasks.filter(t => t.status !== 'DONE').length;
              const completed = project.tasks.filter(t => t.status === 'DONE').length;
              
              return (
                <div key={project.id} className="space-y-2">
                  <p className="text-sm font-medium text-gray-900">{project.name}</p>
                  <div className="flex space-x-4 text-sm">
                    <div className="flex items-center text-yellow-600">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      <span>{pending} pending</span>
                    </div>
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      <span>{completed} completed</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Project Progress Overview</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={projectProgress}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="completed" fill="#4F46E5" name="Completed Tasks" />
              <Bar dataKey="total" fill="#E5E7EB" name="Total Tasks" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;