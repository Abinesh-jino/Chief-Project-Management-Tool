import React, { useState } from 'react';
import { Layout, Plus, Search, Settings } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Board from './components/Board';
import Modal from './components/Modal';
import NewTaskForm from './components/NewTaskForm';
import NewProjectForm from './components/NewProjectForm';
import ProjectList from './components/ProjectList';
import ProjectDetail from './components/ProjectDetail';
import ProgressBar from './components/ProgressBar';
import Chatbot from './components/Chatbot';
import Reports from './components/Reports';
import Team from './components/Team';
import Dashboard from './components/Dashboard';
import ChiefLogo from './assets/chief-logo.svg';
import { TaskStatus } from './types';

const teamMembers = [
  { id: 1, name: 'Sarah Chen', email: 'sarah@example.com', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
  { id: 2, name: 'Mike Johnson', email: 'mike@example.com', avatar: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
  { id: 3, name: 'Alex Turner', email: 'alex@example.com', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
  { id: 4, name: 'Tom Cook', email: 'tom@example.com', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
];

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [currentProject, setCurrentProject] = useState(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [projects, setProjects] = useState([
    {
      id: '1',
      name: 'Website Redesign',
      description: 'Complete overhaul of company website with modern design',
      status: 'Active',
      members: ['Sarah Chen', 'Mike Johnson'],
      dueDate: '2024-04-15',
      tasks: [
        {
          id: '1',
          title: 'Design Homepage',
          description: 'Create new homepage design with improved UX',
          status: TaskStatus.IN_PROGRESS,
          priority: 'High',
          assignee: 'Sarah Chen',
          dueDate: '2024-03-25',
        },
        {
          id: '2',
          title: 'Implement Authentication',
          description: 'Set up user authentication system',
          status: TaskStatus.TODO,
          priority: 'High',
          assignee: 'Mike Johnson',
          dueDate: '2024-03-28',
        }
      ]
    },
    {
      id: '2',
      name: 'Mobile App Development',
      description: 'Develop iOS and Android mobile applications',
      status: 'Active',
      members: ['Alex Turner', 'Tom Cook'],
      dueDate: '2024-05-30',
      tasks: [
        {
          id: '3',
          title: 'UI Design',
          description: 'Design user interface for mobile app',
          status: TaskStatus.DONE,
          priority: 'High',
          assignee: 'Alex Turner',
          dueDate: '2024-03-20',
        }
      ]
    }
  ]);

  const handleAddProject = (newProject) => {
    const project = {
      ...newProject,
      id: (projects.length + 1).toString(),
    };
    setProjects([...projects, project]);
  };

  const handleUpdateProject = (updatedProject) => {
    setProjects(projects.map(project =>
      project.id === updatedProject.id ? updatedProject : project
    ));
    setCurrentProject(updatedProject);
  };

  const handleProjectClick = (project) => {
    setCurrentProject(project);
    setCurrentView('project-detail');
  };

  const handleChatbotCreateTask = (newTask) => {
    if (currentProject) {
      const updatedProject = {
        ...currentProject,
        tasks: [...currentProject.tasks, { ...newTask, id: (currentProject.tasks.length + 1).toString() }]
      };
      handleUpdateProject(updatedProject);
    } else if (projects.length > 0) {
      const firstProject = projects[0];
      const updatedProject = {
        ...firstProject,
        tasks: [...firstProject.tasks, { ...newTask, id: (firstProject.tasks.length + 1).toString() }]
      };
      handleUpdateProject(updatedProject);
      setCurrentProject(updatedProject);
      setCurrentView('project-detail');
    }
  };

  const renderContent = () => {
    switch (currentView.toLowerCase()) {
      case 'dashboard':
        return <Dashboard projects={projects} />;
      case 'projects':
        return (
          <ProjectList
            projects={projects}
            onNewProject={() => setIsProjectModalOpen(true)}
            onProjectClick={handleProjectClick}
          />
        );
      case 'project-detail':
        return currentProject && (
          <ProjectDetail
            project={currentProject}
            onBack={() => setCurrentView('projects')}
            onUpdateProject={handleUpdateProject}
            teamMembers={teamMembers}
          />
        );
      case 'team':
        return <Team />;
      case 'reports':
        return <Reports projects={projects} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <img src={ChiefLogo} className="h-8 w-8" />
              <h1 className="ml-2 text-xl font-bold text-gray-900">Chief</h1>
            </div>
            <div className="flex items-center">
              <div className="relative mx-4">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              {currentView === 'project-detail' && (
                <button
                  onClick={() => setIsTaskModalOpen(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  New Task
                </button>
              )}
              <button className="ml-4 p-2 text-gray-400 hover:text-gray-500">
                <Settings className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-4rem)]">
        <Sidebar onNavigate={setCurrentView} currentView={currentView} />
        <main className="flex-1 overflow-auto p-6">
          {renderContent()}
        </main>
      </div>

      <Modal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        title="Create New Task"
      >
        <NewTaskForm
          onSubmit={(newTask) => {
            const updatedProject = {
              ...currentProject,
              tasks: [...currentProject.tasks, { ...newTask, id: (currentProject.tasks.length + 1).toString() }]
            };
            handleUpdateProject(updatedProject);
            setIsTaskModalOpen(false);
          }}
          onClose={() => setIsTaskModalOpen(false)}
          teamMembers={teamMembers}
        />
      </Modal>

      <Modal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        title="Create New Project"
      >
        <NewProjectForm
          onSubmit={handleAddProject}
          onClose={() => setIsProjectModalOpen(false)}
          teamMembers={teamMembers}
        />
      </Modal>

      <Chatbot
        onCreateTask={handleChatbotCreateTask}
        teamMembers={teamMembers}
      />
    </div>
  );
}

export default App;